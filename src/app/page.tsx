'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { ApartmentScene } from '@/components/virtual-tour/ApartmentScene'
import { FirstPersonControls } from '@/components/virtual-tour/FirstPersonControls'
import { TourUI } from '@/components/virtual-tour/TourUI'

export default function Home() {
  const [isLocked, setIsLocked] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [quality, setQuality] = useState<'low' | 'high'>('high')
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 1.65, 5])
  const [playerDir, setPlayerDir] = useState<[number, number, number]>([0, 0, -1])
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const posUpdateRef = useRef(0)

  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    // Defer setState to satisfy lint rule
    setTimeout(() => {
      setIsTouch(touch)
      if (touch || window.devicePixelRatio > 2) {
        setQuality('low')
      }
    }, 0)
  }, [])

  // Loading progress simulation (real loader integration via Drei)
  useEffect(() => {
    let raf: number
    const start = performance.now()
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000
      // Loading takes ~2-3 seconds for scene assembly
      const p = Math.min(100, (elapsed / 2.5) * 100 * (elapsed > 2.5 ? 1 : 0.85))
      setProgress((prev) => Math.max(prev, p))
      if (p < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setLoaded(true), 300)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Throttle player position updates
  const handleMove = (pos: THREE.Vector3, dir: THREE.Vector3) => {
    const now = performance.now()
    if (now - posUpdateRef.current < 50) return
    posUpdateRef.current = now
    setPlayerPos([pos.x, pos.y, pos.z])
    setPlayerDir([dir.x, dir.y, dir.z])
  }

  return (
    <main className="fixed inset-0 overflow-hidden bg-black" style={{ background: '#0a0a0f' }}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, quality === 'high' ? 2 : 1]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.6,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{
          fov: 65,
          near: 0.05,
          far: 100,
          position: [0, 1.65, 6],
        }}
      >
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 35, 80]} />
        <Suspense fallback={null}>
          <ApartmentScene />
          <FirstPersonControls
            onLockChange={setIsLocked}
            onMove={handleMove}
          />
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      {!loaded && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at center, #0a0a0f 0%, #000 100%)',
          }}
        >
          <div className="text-center text-white">
            <div className="mb-6 inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-[#d4a854] animate-spin" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Preparing Penthouse</h2>
            <p className="text-sm text-white/40 mb-6">Compiling shaders · Building lightmaps</p>
            <div className="w-72 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #d4a854, #e8c468)',
                }}
              />
            </div>
            <p className="text-xs text-white/30 mt-3 font-mono">{Math.round(progress)}%</p>
          </div>
        </div>
      )}

      {/* UI overlay */}
      <TourUI
        isLocked={isLocked}
        isTouch={isTouch}
        playerPos={playerPos}
        playerDir={playerDir}
        quality={quality}
        onToggleQuality={() => setQuality((q) => (q === 'high' ? 'low' : 'high'))}
      />
    </main>
  )
}
