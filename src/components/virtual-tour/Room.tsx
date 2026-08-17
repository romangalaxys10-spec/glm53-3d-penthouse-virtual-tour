'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import {
  createWoodTexture,
  createWoodRoughness,
  createWallTexture,
  createConcreteTexture,
  createMarbleTexture,
  createCityTexture,
} from './textures'

// Room dimensions — modern open-plan penthouse apartment
export const ROOM = {
  width: 18,   // X
  depth: 14,   // Z
  height: 4.2, // Y
  wallThickness: 0.15,
}

export function RoomArchitecture() {
  const woodTex = useMemo(() => createWoodTexture(), [])
  const woodRough = useMemo(() => createWoodRoughness(), [])
  const wallTex = useMemo(() => createWallTexture(), [])
  const concreteTex = useMemo(() => createConcreteTexture(), [])
  const cityTex = useMemo(() => createCityTexture(), [])

  // configure repeats
  const floorTex = useMemo(() => {
    const t = woodTex.clone()
    t.repeat.set(6, 5)
    t.needsUpdate = true
    return t
  }, [woodTex])
  const floorRough = useMemo(() => {
    const t = woodRough.clone()
    t.repeat.set(6, 5)
    t.needsUpdate = true
    return t
  }, [woodRough])
  const wallTexN = useMemo(() => {
    const t = wallTex.clone()
    t.repeat.set(6, 2)
    t.needsUpdate = true
    return t
  }, [wallTex])
  const wallTexE = useMemo(() => {
    const t = wallTex.clone()
    t.repeat.set(5, 2)
    t.needsUpdate = true
    return t
  }, [wallTex])
  const wallTexW = useMemo(() => {
    const t = wallTex.clone()
    t.repeat.set(5, 2)
    t.needsUpdate = true
    return t
  }, [wallTex])
  const concTex = useMemo(() => {
    const t = concreteTex.clone()
    t.repeat.set(6, 5)
    t.needsUpdate = true
    return t
  }, [concreteTex])

  const { width, depth, height, wallThickness } = ROOM

  return (
    <group>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          map={floorTex}
          roughnessMap={floorRough}
          roughness={0.55}
          metalness={0.05}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          map={concTex}
          color="#c8c5be"
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      {/* North wall (back) - has large windows */}
      <group position={[0, 0, -depth / 2]}>
        {/* left solid section */}
        <mesh position={[-width / 2 + 2.5, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, height, wallThickness]} />
          <meshStandardMaterial map={wallTexN} color="#f5ebd9" roughness={0.85} />
        </mesh>
        {/* right solid section */}
        <mesh position={[width / 2 - 2.5, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, height, wallThickness]} />
          <meshStandardMaterial map={wallTexN} color="#f5ebd9" roughness={0.85} />
        </mesh>
        {/* top section above window */}
        <mesh position={[0, height - 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[width - 10, 0.8, wallThickness]} />
          <meshStandardMaterial map={wallTexN} color="#f5ebd9" roughness={0.85} />
        </mesh>
        {/* bottom section (kickspace) */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[width - 10, 0.2, wallThickness]} />
          <meshStandardMaterial map={wallTexN} color="#f5ebd9" roughness={0.85} />
        </mesh>
        {/* Window frame structure */}
        <WindowFrame width={width - 10} height={height - 1.2} position={[0, height / 2 + 0.2, 0]} />
        {/* Glass */}
        <mesh position={[0, height / 2 + 0.2, 0]}>
          <planeGeometry args={[width - 10.4, height - 1.6]} />
          <meshPhysicalMaterial
            color="#a8c5d8"
            transmission={0.92}
            opacity={1}
            transparent
            roughness={0.05}
            metalness={0}
            ior={1.5}
            thickness={0.5}
            envMapIntensity={1.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* City backdrop */}
        <mesh position={[0, height / 2 + 0.2, -0.5]}>
          <planeGeometry args={[60, 18]} />
          <meshBasicMaterial map={cityTex} toneMapped={false} />
        </mesh>
      </group>

      {/* South wall (front) - solid with door opening */}
      <group position={[0, 0, depth / 2]}>
        <mesh position={[-width / 4 - 1, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width / 2 - 2, height, wallThickness]} />
          <meshStandardMaterial map={wallTexN} color="#f5ebd9" roughness={0.85} />
        </mesh>
        <mesh position={[width / 4 + 1, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width / 2 - 2, height, wallThickness]} />
          <meshStandardMaterial map={wallTexN} color="#f5ebd9" roughness={0.85} />
        </mesh>
        {/* top above door */}
        <mesh position={[0, height - 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[4, 1.2, wallThickness]} />
          <meshStandardMaterial map={wallTexN} color="#f5ebd9" roughness={0.85} />
        </mesh>
        {/* door */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.8, 2.2, 0.05]} />
          <meshStandardMaterial color="#3a2a1c" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* door handle */}
        <mesh position={[0.7, 1.1, 0.08]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#d4a854" roughness={0.25} metalness={0.9} />
        </mesh>
      </group>

      {/* East wall (right) */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[depth, height, wallThickness]} />
        <meshStandardMaterial map={wallTexE} color="#f5ebd9" roughness={0.85} />
      </mesh>

      {/* West wall (left) - partial open arch to bedroom area */}
      <group position={[-width / 2, 0, 0]}>
        <mesh position={[0, height / 2, -depth / 4 - 1]} castShadow receiveShadow>
          <boxGeometry args={[wallThickness, height, depth / 2 - 2]} />
          <meshStandardMaterial map={wallTexW} color="#f5ebd9" roughness={0.85} />
        </mesh>
        <mesh position={[0, height / 2, depth / 4 + 1]} castShadow receiveShadow>
          <boxGeometry args={[wallThickness, height, depth / 2 - 2]} />
          <meshStandardMaterial map={wallTexW} color="#f5ebd9" roughness={0.85} />
        </mesh>
        {/* top of arch */}
        <mesh position={[0, height - 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[wallThickness, 1.2, 4]} />
          <meshStandardMaterial map={wallTexW} color="#f5ebd9" roughness={0.85} />
        </mesh>
      </group>

      {/* Baseboards along walls for realism */}
      <Baseboards />

      {/* Crown molding */}
      <CrownMolding />
    </group>
  )
}

function WindowFrame({ width, height, position }: { width: number, height: number, position: [number, number, number] }) {
  const frameMat = (
    <meshStandardMaterial color="#2a2620" roughness={0.4} metalness={0.3} />
  )
  const t = 0.08 // frame thickness
  return (
    <group position={position}>
      {/* left */}
      <mesh position={[-width / 2, 0, 0]} castShadow>
        <boxGeometry args={[t, height + t, t]} />
        {frameMat}
      </mesh>
      {/* right */}
      <mesh position={[width / 2, 0, 0]} castShadow>
        <boxGeometry args={[t, height + t, t]} />
        {frameMat}
      </mesh>
      {/* top */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width + t, t, t]} />
        {frameMat}
      </mesh>
      {/* bottom */}
      <mesh position={[0, -height / 2, 0]} castShadow>
        <boxGeometry args={[width + t, t, t]} />
        {frameMat}
      </mesh>
      {/* center mullions */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[t, height, t]} />
        {frameMat}
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[width, t, t]} />
        {frameMat}
      </mesh>
    </group>
  )
}

function Baseboards() {
  const { width, depth } = ROOM
  const mat = <meshStandardMaterial color="#dcd4c4" roughness={0.6} />
  const h = 0.12
  const t = 0.04
  return (
    <group>
      {/* south wall baseboard - skip door */}
      <mesh position={[-width / 4 - 1, h / 2, depth / 2 - 0.08]} castShadow>{mat}
        <boxGeometry args={[width / 2 - 2, h, t]} />
      </mesh>
      <mesh position={[width / 4 + 1, h / 2, depth / 2 - 0.08]} castShadow>{mat}
        <boxGeometry args={[width / 2 - 2, h, t]} />
      </mesh>
      {/* east */}
      <mesh position={[width / 2 - 0.08, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>{mat}
        <boxGeometry args={[depth, h, t]} />
      </mesh>
    </group>
  )
}

function CrownMolding() {
  const { width, depth, height } = ROOM
  const mat = <meshStandardMaterial color="#dcd4c4" roughness={0.6} />
  const t = 0.08
  const h = 0.1
  return (
    <group>
      {/* south */}
      <mesh position={[-width / 4 - 1, height - h / 2, depth / 2 - 0.08]} castShadow>{mat}
        <boxGeometry args={[width / 2 - 2, h, t]} />
      </mesh>
      <mesh position={[width / 4 + 1, height - h / 2, depth / 2 - 0.08]} castShadow>{mat}
        <boxGeometry args={[width / 2 - 2, h, t]} />
      </mesh>
      {/* east */}
      <mesh position={[width / 2 - 0.08, height - h / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>{mat}
        <boxGeometry args={[depth, h, t]} />
      </mesh>
    </group>
  )
}
