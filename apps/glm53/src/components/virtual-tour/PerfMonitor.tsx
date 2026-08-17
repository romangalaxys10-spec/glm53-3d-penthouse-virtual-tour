'use client'

// PerfMonitor: live FPS sampling with automatic quality downshift.
// A tiny module store exposes the current measured FPS so the HUD can show
// a real counter (P key). If FPS < 30 for ~4 seconds continuously while in
// 'high' quality, it auto-switches to 'low' (dpr 1) once per session and
// notifies the parent through onAutoDowngrade.

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

type FpsListener = (fps: number) => void
let liveFps = 60
const fpsListeners = new Set<FpsListener>()

export function getLiveFps(): number {
  return liveFps
}
export function subscribeFps(fn: FpsListener): () => void {
  fpsListeners.add(fn)
  return () => fpsListeners.delete(fn)
}

export function PerfMonitor({
  quality,
  onAutoDowngrade,
}: {
  quality: 'low' | 'high'
  onAutoDowngrade?: () => void
}) {
  const frames = useRef(0)
  const last = useRef(performance.now())
  const lowStreak = useRef(0)
  const downgraded = useRef(false)
  const qualityRef = useRef(quality)
  qualityRef.current = quality

  useFrame(() => {
    frames.current++
    const now = performance.now()
    const elapsed = now - last.current
    if (elapsed >= 500) {
      liveFps = Math.round((frames.current * 1000) / elapsed)
      fpsListeners.forEach((l) => l(liveFps))
      frames.current = 0
      last.current = now

      // Adaptive logic: only auto-downgrade from high, once per session
      if (qualityRef.current === 'high' && !downgraded.current) {
        if (liveFps < 30) {
          lowStreak.current += 0.5
          if (lowStreak.current >= 4) {
            downgraded.current = true
            onAutoDowngrade?.()
          }
        } else {
          lowStreak.current = 0
        }
      }
    }
  })

  return null
}
