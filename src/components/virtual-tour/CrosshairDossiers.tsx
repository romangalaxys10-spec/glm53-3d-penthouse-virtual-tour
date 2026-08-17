'use client'

// CrosshairDossiers: look-at-to-inspect system.
// Split architecture:
//   <CrosshairRaycaster />  — lives INSIDE the R3F Canvas; raycasts from the
//     camera center every ~150ms and publishes the matched dossier via a tiny
//     module store (no React re-renders of the scene tree).
//   <CrosshairDossierCard /> — DOM overlay OUTSIDE the Canvas; subscribes to
//     the store and renders the dossier card.
// Coordinates mirror FURNITURE_BOXES from FirstPersonControls (single source:
// the room layout). Zero new dependencies.

import { useRef, useState, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

export interface Dossier {
  id: string
  name: string
  spec: string
  detail: string
  aabb: { x: number, z: number, hw: number, hd: number }
}

const DOSSIERS: Dossier[] = [
  {
    id: 'sofa',
    name: 'Sectional Sofa',
    spec: '3.4 m · Bouclé wool upholstery',
    detail: 'Corner module with hand-stitched seams; kiln-dried beech frame; high-resilience foam over pocket springs.',
    aabb: { x: 0, z: 3.6, hw: 1.7, hd: 0.8 },
  },
  {
    id: 'coffee',
    name: 'Coffee Table',
    spec: 'Oak top · 1.6 × 0.9 m',
    detail: 'Solid European oak with natural oil finish; rounded edges; blackened steel sled base.',
    aabb: { x: 0, z: 2.4, hw: 0.8, hd: 0.5 },
  },
  {
    id: 'island',
    name: 'Kitchen Island',
    spec: 'Carrara marble · waterfall edges',
    detail: '3.3 m island with honed Carrara counter, integrated bar seating for three, brushed brass fixtures.',
    aabb: { x: 0, z: -3.5, hw: 1.65, hd: 0.65 },
  },
  {
    id: 'dining',
    name: 'Dining Table',
    spec: 'Round · marble pedestal',
    detail: '1.3 m round table; sculptural honed-stone pedestal base; four chairs upholstered in cognac leather.',
    aabb: { x: -5, z: -3, hw: 1.15, hd: 1.15 },
  },
  {
    id: 'fireplace',
    name: 'Linear Fireplace',
    spec: 'Honed basalt surround',
    detail: 'Contemporary linear gas fireplace set in honed basalt; cast-iron mantel.',
    aabb: { x: -8.6, z: -3, hw: 0.4, hd: 1.1 },
  },
  {
    id: 'media',
    name: 'Media Wall',
    spec: 'OLED · 77 in',
    detail: 'Wall-mounted 77-inch OLED with integrated soundbar; low-reflection calibration for daylight viewing.',
    aabb: { x: 0, z: -6.6, hw: 1.9, hd: 0.35 },
  },
  {
    id: 'bookshelf',
    name: 'Bookshelf',
    spec: 'Blackened oak · 2.2 m',
    detail: 'Floor-to-ceiling shelving in blackened white oak; adjustable brass shelf pins; integrated LED strips.',
    aabb: { x: 5.5, z: 6.5, hw: 1.1, hd: 0.35 },
  },
]

// ---- Tiny store bridging the R3F world and the DOM overlay ----
type DossierListener = (d: Dossier | null) => void
let activeDossier: Dossier | null = null
const dossierListeners = new Set<DossierListener>()

function publishDossier(d: Dossier | null) {
  activeDossier = d
  dossierListeners.forEach((l) => l(d))
}
export function subscribeDossier(fn: DossierListener): () => void {
  dossierListeners.add(fn)
  fn(activeDossier)
  return () => {
    dossierListeners.delete(fn)
  }
}

// ---- In-canvas raycaster ----
export function CrosshairRaycaster({ enabled = true }: { enabled?: boolean }) {
  const { camera, scene } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const center = useRef(new THREE.Vector2(0, 0))
  const throttle = useRef(0)
  const activeId = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled && activeId.current !== null) {
      activeId.current = null
      publishDossier(null)
    }
  }, [enabled])

  useFrame((_, delta) => {
    if (!enabled) return
    const dt = Math.min(delta, 0.1)

    // Throttle raycast to ~7 Hz to save perf
    throttle.current += dt
    if (throttle.current < 0.15) return
    throttle.current = 0

    raycaster.current.setFromCamera(center.current, camera)

    // Raycast against all meshes; find nearest intersect within 6 m
    const hits = raycaster.current.intersectObjects(scene.children, true)
    const near = hits.find((h) => h.distance < 6)
    if (!near) {
      if (activeId.current !== null) {
        activeId.current = null
        publishDossier(null)
      }
      return
    }

    // Match hit position to dossier AABBs
    const p = near.point
    const match = DOSSIERS.find(
      (d) =>
        Math.abs(p.x - d.aabb.x) < d.aabb.hw + 0.3 &&
        Math.abs(p.z - d.aabb.z) < d.aabb.hd + 0.3,
    )

    const matchId = match ? match.id : null
    if (matchId !== activeId.current) {
      activeId.current = matchId
      publishDossier(match || null)
    }
  })

  return null
}

// ---- DOM overlay card (outside the Canvas) ----
export function CrosshairDossierCard() {
  const [active, setActive] = useState<Dossier | null>(null)

  useEffect(() => subscribeDossier(setActive), [])

  return (
    <div
      className="fixed left-1/2 top-1/2 z-40 pointer-events-none"
      style={{ transform: 'translate(-50%, calc(-50% + 60px))' }}
    >
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="max-w-xs rounded-xl px-4 py-3 text-white shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(20,28,42,0.95), rgba(10,14,22,0.95))',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(212,168,84,0.3)',
            }}
          >
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#d4a854] mb-1">
              {active.spec}
            </div>
            <div className="text-sm font-semibold mb-1">{active.name}</div>
            <div className="text-xs text-white/60 leading-relaxed">{active.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
