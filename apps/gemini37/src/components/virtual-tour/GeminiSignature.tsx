'use client'

// Gemini 3.7 Flash architectural signature for the comparison article:
// instead of per-furniture AABB checks, a uniform spatial hash grid that
// partitions the floor once and answers collision queries in O(1).

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOM } from './Room'

const CELL = 1.2 // grid cell size in meters
const PLAYER_R = 0.35

export interface Obstacle { x: number, z: number, hw: number, hd: number }

export function buildSpatialHash(obstacles: Obstacle[]) {
  const cells = new Map<string, Obstacle[]>()
  const key = (cx: number, cz: number) => `${cx},${cz}`
  for (const o of obstacles) {
    const minX = Math.floor((o.x - o.hw) / CELL)
    const maxX = Math.floor((o.x + o.hw) / CELL)
    const minZ = Math.floor((o.z - o.hd) / CELL)
    const maxZ = Math.floor((o.z + o.hd) / CELL)
    for (let cx = minX; cx <= maxX; cx++) {
      for (let cz = minZ; cz <= maxZ; cz++) {
        const k = key(cx, cz)
        const arr = cells.get(k) || []
        arr.push(o)
        cells.set(k, arr)
      }
    }
    cells.set(key(Math.floor(o.x / CELL), Math.floor(o.z / CELL)), cells.get(key(Math.floor(o.x / CELL), Math.floor(o.z / CELL))) || [o])
  }
  return cells
}

export function queryHash(
  cells: Map<string, Obstacle[]>,
  x: number,
  z: number,
  r: number,
): Obstacle[] {
  const out: Obstacle[] = []
  const cx = Math.floor(x / CELL)
  const cz = Math.floor(z / CELL)
  // 3x3 neighborhood covers r <= CELL
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const arr = cells.get(`${cx + i},${cz + j}`)
      if (arr) {
        for (const o of arr) {
          if (
            x > o.x - o.hw - r && x < o.x + o.hw + r &&
            z > o.z - o.hd - r && z < o.z + o.hd + r
          ) out.push(o)
        }
      }
    }
  }
  return out
}

// Declarative debug visualizer: draws the hash grid + obstacles
export function SpatialHashDebug({ obstacles, visible = false }: { obstacles: Obstacle[], visible?: boolean }) {
  const cells = useMemo(() => buildSpatialHash(obstacles), [obstacles])
  const lineRef = useRef<THREE.LineSegments>(null)

  const gridGeo = useMemo(() => {
    const pts: number[] = []
    const { width, depth } = ROOM
    for (let x = -width / 2; x <= width / 2 + 0.001; x += CELL) {
      pts.push(x, 0.02, -depth / 2, x, 0.02, depth / 2)
    }
    for (let z = -depth / 2; z <= depth / 2 + 0.001; z += CELL) {
      pts.push(-width / 2, 0.02, z, width / 2, 0.02, z)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const m = lineRef.current.material as THREE.LineBasicMaterial
      m.opacity = 0.08 + Math.sin(clock.elapsedTime * 2) * 0.03
    }
  })

  if (!visible) return null

  return (
    <lineSegments ref={lineRef} geometry={gridGeo}>
      <lineBasicMaterial color="#7dd3fc" transparent opacity={0.1} />
    </lineSegments>
  )
}
