'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createFabricTexture, createMarbleTexture, createRugTexture, createArtTexture } from './textures'
import { ROOM } from './Room'

// ============= SOFA =============
export function Sofa({ position = [0, 0, 0], rotation = 0 }: { position?: [number, number, number], rotation?: number }) {
  const fabricTex = useMemo(() => createFabricTexture('#3a4250'), [])
  const cushionTex = useMemo(() => createFabricTexture('#4a5260'), [])
  const pillowTex = useMemo(() => createFabricTexture('#a8825a'), [])

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base frame */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.5, 1.4]} />
        <meshStandardMaterial map={fabricTex} roughness={0.85} metalness={0} />
      </mesh>
      {/* Back cushions */}
      <mesh position={[0, 0.85, -0.55]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 0.7, 0.3]} />
        <meshStandardMaterial map={cushionTex} roughness={0.85} />
      </mesh>
      {/* Seat cushions */}
      {[-0.75, 0, 0.75].map((x, i) => (
        <mesh key={i} position={[x, 0.72, 0.1]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.18, 1.05]} />
          <meshStandardMaterial map={cushionTex} roughness={0.8} />
        </mesh>
      ))}
      {/* Arm rests */}
      {[-1.55, 1.55].map((x, i) => (
        <mesh key={i} position={[x, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.55, 1.4]} />
          <meshStandardMaterial map={fabricTex} roughness={0.85} />
        </mesh>
      ))}
      {/* Decorative pillows */}
      <mesh position={[-1.1, 0.95, -0.25]} rotation={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.4, 0.15]} />
        <meshStandardMaterial map={pillowTex} roughness={0.85} />
      </mesh>
      <mesh position={[1.2, 0.95, -0.2]} rotation={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.4, 0.15]} />
        <meshStandardMaterial map={pillowTex} roughness={0.85} />
      </mesh>
      {/* Legs */}
      {[[-1.45, 0.55], [1.45, 0.55], [-1.45, -0.55], [1.45, -0.55]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.07, p[1]]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.14, 12]} />
          <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ============= ARMCHAIR =============
export function Armchair({ position = [0, 0, 0], rotation = 0, color = '#5a4030' }: {
  position?: [number, number, number], rotation?: number, color?: string
}) {
  const fabricTex = useMemo(() => createFabricTexture(color), [color])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.4, 1.0]} />
        <meshStandardMaterial map={fabricTex} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.65, -0.42]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.7, 0.2]} />
        <meshStandardMaterial map={fabricTex} roughness={0.85} />
      </mesh>
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.5, 1.0]} />
          <meshStandardMaterial map={fabricTex} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, 0.6, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.12, 0.85]} />
        <meshStandardMaterial map={fabricTex} roughness={0.8} />
      </mesh>
      {[[-0.4, 0.4], [0.4, 0.4], [-0.4, -0.4], [0.4, -0.4]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.07, p[1]]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.14, 12]} />
          <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ============= COFFEE TABLE =============
export function CoffeeTable({ position = [0, 0, 0], rotation = 0 }: { position?: [number, number, number], rotation?: number }) {
  const marbleTex = useMemo(() => createMarbleTexture(), [])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* top */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.08, 0.8]} />
        <meshStandardMaterial
          map={marbleTex}
          roughness={0.15}
          metalness={0.05}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* lower shelf */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.04, 0.7]} />
        <meshStandardMaterial color="#2a2218" roughness={0.5} />
      </mesh>
      {/* legs */}
      {[[-0.65, 0.32], [0.65, 0.32], [-0.65, -0.32], [0.65, -0.32]].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[1]]} castShadow>
          <boxGeometry args={[0.06, 0.32, 0.06]} />
          <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.8} />
        </mesh>
      ))}
      {/* decorative book */}
      <mesh position={[0.3, 0.49, 0.1]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.25, 0.03, 0.18]} />
        <meshStandardMaterial color="#8a3a2a" roughness={0.7} />
      </mesh>
      {/* vase */}
      <mesh position={[-0.4, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.25, 16]} />
        <meshStandardMaterial color="#2c4a5a" roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  )
}

// ============= TV STAND + TV =============
export function TVStand({ position = [0, 0, 0], rotation = 0 }: { position?: [number, number, number], rotation?: number }) {
  const screenOnRef = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(({ clock }) => {
    if (screenOnRef.current) {
      const t = clock.getElapsedTime()
      screenOnRef.current.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.08
    }
  })

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* stand */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.5, 0.45]} />
        <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* top */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.7, 0.04, 0.5]} />
        <meshStandardMaterial color="#0e0a08" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* TV frame */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2.4, 1.35, 0.06]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* TV screen */}
      <mesh position={[0, 1.5, 0.035]}>
        <planeGeometry args={[2.28, 1.23]} />
        <meshStandardMaterial
          ref={screenOnRef}
          color="#0a1a2a"
          emissive="#3a8acf"
          emissiveIntensity={0.45}
          roughness={0.1}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>
      {/* soundbar */}
      <mesh position={[0, 0.62, 0.1]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.1]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* decor on stand */}
      <mesh position={[-1.4, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 0.2, 16]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.4} />
      </mesh>
      <mesh position={[1.4, 0.58, 0]} castShadow>
        <boxGeometry args={[0.18, 0.16, 0.04]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} />
      </mesh>
    </group>
  )
}

// ============= KITCHEN ISLAND =============
export function KitchenIsland({ position = [0, 0, 0], rotation = 0 }: { position?: [number, number, number], rotation?: number }) {
  const marbleTex = useMemo(() => createMarbleTexture(), [])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* base cabinet */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 1.0, 1.0]} />
        <meshStandardMaterial color="#2a2620" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* marble top */}
      <mesh position={[0, 1.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.08, 1.15]} />
        <meshStandardMaterial
          map={marbleTex}
          roughness={0.18}
          metalness={0.05}
          envMapIntensity={1.4}
        />
      </mesh>
      {/* cabinet door handles */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0.52]} castShadow>
          <boxGeometry args={[0.3, 0.04, 0.03]} />
          <meshStandardMaterial color="#d4a854" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}
      {/* bar stools */}
      {[-0.8, 0.8].map((x, i) => (
        <group key={i} position={[x, 0, 1.0]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.05, 24]} />
            <meshStandardMaterial color="#1a1410" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.7, 24]} />
            <meshStandardMaterial color="#2a2620" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.36, 12]} />
            <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* footrest ring */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <torusGeometry args={[0.16, 0.012, 8, 24]} />
            <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.8} />
          </mesh>
        </group>
      ))}
      {/* fruit bowl on top */}
      <mesh position={[0.8, 1.12, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.12, 0.08, 24]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.6} />
      </mesh>
      {[
        { x: 0.7, c: '#c43a3a' },
        { x: 0.85, c: '#d48a3a' },
        { x: 0.8, c: '#a4c43a' },
      ].map((f, i) => (
        <mesh key={i} position={[f.x, 1.17, 0 + (i - 1) * 0.08]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={f.c} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// ============= DINING TABLE =============
export function DiningTable({ position = [0, 0, 0], rotation = 0 }: { position?: [number, number, number], rotation?: number }) {
  const marbleTex = useMemo(() => createMarbleTexture(), [])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* top */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.0, 0.05, 48]} />
        <meshStandardMaterial
          map={marbleTex}
          roughness={0.2}
          metalness={0.05}
          envMapIntensity={1.4}
        />
      </mesh>
      {/* base */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, 0.7, 24]} />
        <meshStandardMaterial color="#1a1410" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 24]} />
        <meshStandardMaterial color="#1a1410" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* chairs around */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2
        const x = Math.cos(angle) * 1.4
        const z = Math.sin(angle) * 1.4
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.45, 0.05, 0.45]} />
              <meshStandardMaterial color="#3a2a1c" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.75, -0.2]} castShadow receiveShadow>
              <boxGeometry args={[0.45, 0.55, 0.05]} />
              <meshStandardMaterial color="#3a2a1c" roughness={0.6} />
            </mesh>
            {[[-0.18, 0.18], [0.18, 0.18], [-0.18, -0.18], [0.18, -0.18]].map((p, j) => (
              <mesh key={j} position={[p[0], 0.22, p[1]]} castShadow>
                <boxGeometry args={[0.04, 0.45, 0.04]} />
                <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.6} />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

// ============= RUG =============
export function Rug({ position = [0, 0, 0], rotation = 0, size = [4, 2.5] }: {
  position?: [number, number, number], rotation?: number, size?: [number, number]
}) {
  const rugTex = useMemo(() => createRugTexture(), [])
  return (
    <mesh position={[position[0], 0.01, position[2]]} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial map={rugTex} roughness={0.9} metalness={0} />
    </mesh>
  )
}

// ============= PLANT =============
export function Plant({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number], scale?: number }) {
  const leavesMat = useMemo(() => (
    <meshStandardMaterial color="#2c5a2c" roughness={0.7} />
  ), [])
  const potMat = useMemo(() => (
    <meshStandardMaterial color="#c4a585" roughness={0.6} />
  ), [])

  return (
    <group position={position} scale={scale}>
      {/* pot */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.4, 24]} />
        {potMat}
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
        {potMat}
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.03, 24]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.95} />
      </mesh>
      {/* leaves - multiple stalks */}
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = (i / 7) * Math.PI * 2
        const r = 0.05 + Math.random() * 0.08
        const h = 0.7 + Math.random() * 0.6
        const lean = 0.15 + Math.random() * 0.2
        return (
          <group key={i} position={[Math.cos(angle) * r, 0.42, Math.sin(angle) * r]}>
            {/* stem */}
            <mesh position={[lean / 2, h / 2, 0]} rotation={[0, 0, -lean]} castShadow>
              <cylinderGeometry args={[0.012, 0.018, h, 8]} />
              <meshStandardMaterial color="#3a5a2a" roughness={0.8} />
            </mesh>
            {/* leaves */}
            {Array.from({ length: 5 }).map((_, j) => {
              const lh = 0.15 + Math.random() * 0.15
              const lx = Math.sin(lean) * h * (j / 4) + lean * 0.2
              const ly = Math.cos(lean) * h * (j / 4) + 0.1
              return (
                <mesh
                  key={j}
                  position={[lx + (Math.random() - 0.5) * 0.1, ly + lh / 2, (Math.random() - 0.5) * 0.15]}
                  rotation={[Math.random() * 0.4, Math.random() * Math.PI * 2, Math.random() * 0.4]}
                  castShadow
                >
                  <coneGeometry args={[0.06, lh, 6]} />
                  {leavesMat}
                </mesh>
              )
            })}
          </group>
        )
      })}
    </group>
  )
}

// ============= FLOOR LAMP =============
export function FloorLamp({ position = [0, 0, 0], color = '#fff5e0' }: { position?: [number, number, number], color?: string }) {
  return (
    <group position={position}>
      {/* base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.04, 24]} />
        <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* pole */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.7, 12]} />
        <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* shade */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <coneGeometry args={[0.25, 0.4, 24, 1, true]} />
        <meshStandardMaterial
          color="#e8d4a0"
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* bulb light */}
      <pointLight
        position={[0, 1.55, 0]}
        color={color}
        intensity={2.5}
        distance={6}
        decay={2}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.001}
      />
    </group>
  )
}

// ============= WALL ART =============
export function WallArt({ position = [0, 1.8, 0], rotation = 0, seed = 0, size = [0.8, 1.2] }: {
  position?: [number, number, number], rotation?: number, seed?: number, size?: [number, number]
}) {
  const artTex = useMemo(() => createArtTexture(seed), [seed])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* frame */}
      <mesh castShadow>
        <boxGeometry args={[size[0] + 0.06, size[1] + 0.06, 0.04]} />
        <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* canvas */}
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={size} />
        <meshStandardMaterial map={artTex} roughness={0.7} />
      </mesh>
    </group>
  )
}

// ============= PENDANT LIGHT =============
export function PendantLight({ position = [0, 0, 0], color = '#ffe8b0' }: { position?: [number, number, number], color?: string }) {
  return (
    <group position={position}>
      {/* cord */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.8, 8]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      {/* shade */}
      <mesh position={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.18, 0.25, 24, 1, true]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.4}
          metalness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* inner glow */}
      <mesh position={[0, -0.05, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, -0.2, 0]}
        color={color}
        intensity={2}
        distance={5}
        decay={2}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.001}
      />
    </group>
  )
}

// ============= BOOKSHELF =============
export function Bookshelf({ position = [0, 0, 0], rotation = 0 }: { position?: [number, number, number], rotation?: number }) {
  const bookColors = ['#8a3a2a', '#3a5a8a', '#3a8a5a', '#8a8a3a', '#5a3a8a', '#8a5a3a', '#3a3a8a', '#8a3a5a']
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* frame */}
      <mesh position={[0, 1.1, -0.15]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 2.2, 0.05]} />
        <meshStandardMaterial color="#2a2018" roughness={0.6} />
      </mesh>
      {/* shelves */}
      {[0, 0.55, 1.1, 1.65, 2.2].map((y, i) => (
        <mesh key={i} position={[0, y, -0.1]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.04, 0.3]} />
          <meshStandardMaterial color="#2a2018" roughness={0.6} />
        </mesh>
      ))}
      {/* sides */}
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 0.98, 1.1, -0.05]} castShadow receiveShadow>
          <boxGeometry args={[0.04, 2.2, 0.3]} />
          <meshStandardMaterial color="#2a2018" roughness={0.6} />
        </mesh>
      ))}
      {/* books */}
      {[0.3, 0.85, 1.4, 1.95].map((y, shelf) => (
        <group key={shelf}>
          {Array.from({ length: 8 + shelf }).map((_, i) => {
            const w = 0.06 + Math.random() * 0.04
            const h = 0.35 + Math.random() * 0.12
            const x = -0.92 + i * 0.13 + Math.random() * 0.02
            return (
              <mesh key={i} position={[x, y + h / 2 + 0.02, -0.05]} castShadow>
                <boxGeometry args={[w, h, 0.22]} />
                <meshStandardMaterial
                  color={bookColors[Math.floor(Math.random() * bookColors.length)]}
                  roughness={0.7}
                />
              </mesh>
            )
          })}
        </group>
      ))}
      {/* decorative objects */}
      <mesh position={[0.7, 1.45, -0.05]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.18, 16]} />
        <meshStandardMaterial color="#c4a854" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-0.6, 2.0, -0.05]} castShadow>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color="#3a5a4a" roughness={0.5} />
      </mesh>
    </group>
  )
}

// ============= SIDE TABLE =============
export function SideTable({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 32]} />
        <meshStandardMaterial color="#2a2018" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
        <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 32]} />
        <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* cup */}
      <mesh position={[0.1, 0.55, 0.05]} castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.08, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
    </group>
  )
}

// ============= FIREPLACE =============
export function Fireplace({ position = [0, 0, 0], rotation = 0 }: { position?: [number, number, number], rotation?: number }) {
  const fireRef = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (fireRef.current) {
      const t = clock.getElapsedTime()
      fireRef.current.intensity = 1.5 + Math.sin(t * 12) * 0.4 + Math.sin(t * 7) * 0.3
    }
  })

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* surround */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 2.0, 0.3]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.7} />
      </mesh>
      {/* mantel */}
      <mesh position={[0, 2.0, 0.05]} castShadow>
        <boxGeometry args={[2.2, 0.1, 0.4]} />
        <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* fire opening */}
      <mesh position={[0, 0.7, 0.16]}>
        <boxGeometry args={[1.2, 0.8, 0.02]} />
        <meshStandardMaterial color="#0a0505" roughness={0.9} />
      </mesh>
      {/* fire glow */}
      <mesh position={[0, 0.5, 0.18]}>
        <planeGeometry args={[1.0, 0.5]} />
        <meshBasicMaterial color="#ff8030" transparent opacity={0.6} toneMapped={false} />
      </mesh>
      {/* logs */}
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0.18]} rotation={[0, i * 0.5, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial color="#3a1a0a" roughness={0.9} emissive="#80300a" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* fire light */}
      <pointLight
        ref={fireRef}
        position={[0, 0.6, 0.3]}
        color="#ff6020"
        intensity={1.5}
        distance={5}
        decay={2}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.001}
      />
    </group>
  )
}
