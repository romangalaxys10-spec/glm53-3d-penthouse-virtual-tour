'use client'

// LightingPresets: dynamic time-of-day system for the penthouse scene.
// Three cinematic presets — Golden Hour (default), Bright Daylight, Midnight —
// animating sun color/intensity, fill, ambient, fog, background color and
// exposure through smooth lerps inside useFrame. Exposed via a tiny
// module-level store so the HUD (TourUI) can switch presets without React
// re-rendering the whole scene tree.

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type PresetName = 'golden' | 'day' | 'night'

interface PresetConfig {
  sunColor: THREE.Color
  sunIntensity: number
  sunPosition: [number, number, number]
  fillColor: THREE.Color
  fillIntensity: number
  hemiIntensity: number
  ambientIntensity: number
  fogColor: THREE.Color
  fogNear: number
  fogFar: number
  bg: THREE.Color
  exposure: number
}

function makePresets(): Record<PresetName, PresetConfig> {
  return {
    golden: {
      sunColor: new THREE.Color('#ffd9a0'),
      sunIntensity: 5.5,
      sunPosition: [8, 12, -6],
      fillColor: new THREE.Color('#8fb4d8'),
      fillIntensity: 2.0,
      hemiIntensity: 1.6,
      ambientIntensity: 0.8,
      fogColor: new THREE.Color('#0a0a0f'),
      fogNear: 35,
      fogFar: 80,
      bg: new THREE.Color('#0a0a0f'),
      exposure: 1.6,
    },
    day: {
      sunColor: new THREE.Color('#ffffff'),
      sunIntensity: 6.5,
      sunPosition: [2, 18, -4],
      fillColor: new THREE.Color('#cfe4ff'),
      fillIntensity: 2.8,
      hemiIntensity: 2.2,
      ambientIntensity: 1.2,
      fogColor: new THREE.Color('#20283a'),
      fogNear: 45,
      fogFar: 110,
      bg: new THREE.Color('#20283a'),
      exposure: 1.35,
    },
    night: {
      sunColor: new THREE.Color('#3a5a9a'),
      sunIntensity: 0.6,
      sunPosition: [8, 14, -6],
      fillColor: new THREE.Color('#1a2440'),
      fillIntensity: 0.5,
      hemiIntensity: 0.35,
      ambientIntensity: 0.25,
      fogColor: new THREE.Color('#04060c'),
      fogNear: 18,
      fogFar: 60,
      bg: new THREE.Color('#04060c'),
      exposure: 1.9,
    },
  }
}

const PRESETS = makePresets()

// ---- Tiny reactive store (module-level, zero deps) ----
type Listener = (p: PresetName) => void
let currentPreset: PresetName = 'golden'
const listeners = new Set<Listener>()

export function setLightingPreset(p: PresetName) {
  currentPreset = p
  listeners.forEach((l) => l(p))
}
export function getLightingPreset(): PresetName {
  return currentPreset
}
export function subscribeLighting(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function LightingPresets({ initial = 'golden' }: { initial?: PresetName }) {
  const { scene, gl } = useThree()
  const sunRef = useRef<THREE.DirectionalLight | null>(null)
  const fillRef = useRef<THREE.DirectionalLight | null>(null)
  const hemiRef = useRef<THREE.HemisphereLight | null>(null)
  const ambRef = useRef<THREE.AmbientLight | null>(null)
  const target = useRef<PresetConfig>(PRESETS[initial])
  const transition = useRef(1)
  const sunTargetPos = useRef(new THREE.Vector3(...PRESETS[initial].sunPosition))

  useEffect(() => {
    target.current = PRESETS[initial]
    const unsub = subscribeLighting((p) => {
      target.current = PRESETS[p]
      sunTargetPos.current.set(...PRESETS[p].sunPosition)
      transition.current = 0
    })
    return unsub
  }, [initial])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    if (transition.current >= 1) return
    // ~1.2s smooth transition
    transition.current = Math.min(1, transition.current + dt / 1.2)
    const t = transition.current
    const ease = t * t * (3 - 2 * t) // smoothstep

    const T = target.current
    if (sunRef.current) {
      sunRef.current.color.lerp(T.sunColor, ease)
      sunRef.current.intensity = lerp(sunRef.current.intensity, T.sunIntensity, ease)
      sunRef.current.position.lerp(sunTargetPos.current, ease)
    }
    if (fillRef.current) {
      fillRef.current.color.lerp(T.fillColor, ease)
      fillRef.current.intensity = lerp(fillRef.current.intensity, T.fillIntensity, ease)
    }
    if (hemiRef.current) {
      hemiRef.current.intensity = lerp(hemiRef.current.intensity, T.hemiIntensity, ease)
    }
    if (ambRef.current) {
      ambRef.current.intensity = lerp(ambRef.current.intensity, T.ambientIntensity, ease)
    }

    // Fog + background
    const fog = scene.fog as THREE.Fog | null
    if (fog) {
      fog.color.lerp(T.fogColor, ease)
      fog.near = lerp(fog.near, T.fogNear, ease)
      fog.far = lerp(fog.far, T.fogFar, ease)
    }
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(T.bg, ease)
    }

    // Tone mapping exposure (lives on the renderer)
    gl.toneMappingExposure = lerp(gl.toneMappingExposure, T.exposure, ease)
  })

  return (
    <>
      <directionalLight
        ref={sunRef}
        position={[8, 12, -6]}
        intensity={5.5}
        color="#ffd9a0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight ref={fillRef} position={[-5, 8, -8]} intensity={2.0} color="#8fb4d8" />
      <hemisphereLight ref={hemiRef} args={['#dde8ff', '#7a6a5a', 1.6]} />
      <ambientLight ref={ambRef} intensity={0.8} />
    </>
  )
}
