'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Move, MousePointer2, Smartphone, Map, X, Info, Zap, Camera, Sun, SunDim, MoonStar, Gauge } from 'lucide-react'
import { setLightingPreset, getLightingPreset, type PresetName } from './LightingPresets'
import { usePhotoMode } from './PhotoMode'
import { getLiveFps, subscribeFps } from './PerfMonitor'

interface TourUIProps {
  isLocked: boolean
  isTouch: boolean
  playerPos: [number, number, number]
  playerDir: [number, number, number]
  quality: 'low' | 'high'
  onToggleQuality: () => void
  onToggleGrid?: () => void
  gridVisible?: boolean
}

const HOTSPOTS = [
  {
    id: 'living',
    title: 'Living Room',
    pos: [0, 2.5],
    description: 'Modern sectional sofa with custom upholstery facing the integrated media wall. The space is grounded by a hand-knotted wool rug with traditional geometric pattern.',
  },
  {
    id: 'kitchen',
    title: 'Kitchen Island',
    pos: [0, -3.5],
    description: 'Marble waterfall countertop island with integrated bar seating. Brushed brass fixtures complement the dark oak cabinetry.',
  },
  {
    id: 'dining',
    title: 'Dining Area',
    pos: [-5, -3],
    description: 'Round marble dining table with sculptural pedestal base, surrounded by four upholstered chairs in warm cognac leather.',
  },
  {
    id: 'fireplace',
    title: 'Stone Fireplace',
    pos: [-8, -3],
    description: 'Contemporary linear fireplace set in a honed stone surround. Cast iron mantel provides architectural anchor to the room.',
  },
  {
    id: 'windows',
    title: 'Floor-to-Ceiling Windows',
    pos: [0, -6.5],
    description: 'Full-height glazing frames the city skyline at golden hour. High-performance low-E glass with thermal break mullions.',
  },
  {
    id: 'art',
    title: 'Curated Art Wall',
    pos: [8.5, 2.5],
    description: 'Abstract mixed-media compositions selected to complement the interior palette. Museum-grade LED picture lighting.',
  },
]

export function TourUI({
  isLocked,
  isTouch,
  playerPos,
  playerDir,
  quality,
  onToggleQuality,
}: TourUIProps) {
  const [showIntro, setShowIntro] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [preset, setPresetState] = useState<PresetName>('golden')
  const [showGrid, setShowGrid] = useState(false)
  const [fps, setFps] = useState(60)
  const [shotToast, setShotToast] = useState(false)
  const takeShot = usePhotoMode(() => {
    setShotToast(true)
    setTimeout(() => setShotToast(false), 2200)
  })

  // live FPS counter
  useEffect(() => {
    const unsub = subscribeFps(setFps)
    setFps(getLiveFps())
    return unsub
  }, [])

  const cyclePreset = useCallback(() => {
    const order: PresetName[] = ['golden', 'day', 'night']
    const next = order[(order.indexOf(getLightingPreset()) + 1) % 3]
    setLightingPreset(next)
    setPresetState(next)
  }, [])

  const handleStart = useCallback(() => {
    setShowIntro(false)
    if (!isTouch) {
      // Try to trigger pointer lock on first user interaction
      const canvas = document.querySelector('canvas')
      if (canvas) canvas.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    }
  }, [isTouch])

  // Show controls briefly when locking — defer setState via setTimeout to comply with lint rule
  const [controlsKey, setControlsKey] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(false)
  useEffect(() => {
    if (!isLocked) return
    const t1 = setTimeout(() => {
      setControlsKey((k) => k + 1)
      setControlsVisible(true)
    }, 0)
    const t2 = setTimeout(() => setControlsVisible(false), 4000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [isLocked])

  // Check if near a hotspot — derived from playerPos
  const activeHotspot = useMemo(() => {
    const near = HOTSPOTS.find((h) => {
      const dx = h.pos[0] - playerPos[0]
      const dz = h.pos[1] - playerPos[2]
      return Math.sqrt(dx * dx + dz * dz) < 2.5
    })
    return near?.id || null
  }, [playerPos])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyM') setShowMap((s) => !s)
      if (e.code === 'KeyH') setControlsVisible((s) => !s)
      if (e.code === 'KeyL') cyclePreset()
      if (e.code === 'KeyP') takeShot()
      if (e.code === 'KeyG') setShowGrid((s) => !s)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cyclePreset, takeShot])

  return (
    <>
      {/* ====== INTRO SCREEN ====== */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(15,20,35,0.92) 0%, rgba(5,8,15,0.98) 100%)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Animated background gradient */}
            <motion.div
              aria-hidden
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 30%, rgba(200,140,80,0.4), transparent 50%)',
                  'radial-gradient(circle at 80% 70%, rgba(120,180,220,0.4), transparent 50%)',
                  'radial-gradient(circle at 20% 30%, rgba(200,140,80,0.4), transparent 50%)',
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative max-w-2xl w-full px-6 py-8 text-center text-white">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-xs uppercase tracking-[0.2em] font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#e0c8a0',
                  }}
                >
                  <Eye size={14} /> Real-Time 3D Tour
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-sky-300/80 mb-2">Gemini 3.7 Flash Edition</div>
                <h1
                  className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #fff 0%, #e0c8a0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Penthouse Loft
                </h1>
                <p className="text-lg md:text-xl text-white/70 mb-2 leading-relaxed">
                  An immersive architectural walkthrough rendered in real-time with physically-based materials, soft shadows, and cinematic post-processing.
                </p>
                <p className="text-sm text-white/40 mb-8">
                  Modern open-plan apartment · 252 m² · Sunset lighting scenario
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 text-left"
              >
                <Feature icon={<Move size={16} />} title="Walk" desc="WASD / Arrows" />
                <Feature icon={<MousePointer2 size={16} />} title="Look" desc="Mouse" />
                <Feature icon={<Zap size={16} />} title="Sprint" desc="Shift" />
                <Feature icon={<Map size={16} />} title="Map" desc="M key" />
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={handleStart}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-lg text-base font-semibold tracking-wide shadow-2xl transition-colors"
                style={{
                  background: 'linear-gradient(135deg, #d4a854 0%, #b48438 100%)',
                  color: '#1a1410',
                  boxShadow: '0 8px 32px rgba(212,168,84,0.4)',
                }}
              >
                Begin Tour →
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-xs text-white/40"
              >
                Click anywhere on screen to enable mouse-look · Press ESC to release
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== CONTROLS HINT ====== */}
      <AnimatePresence>
        {controlsVisible && isLocked && !isTouch && (
          <motion.div
            key={controlsKey}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-4 px-5 py-2.5 rounded-full text-sm text-white"
              style={{
                background: 'rgba(15,20,35,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span className="flex items-center gap-2"><KeyCap>W A S D</KeyCap> Move</span>
              <span className="flex items-center gap-2"><KeyCap>Shift</KeyCap> Sprint</span>
            <span className="flex items-center gap-2"><KeyCap>L</KeyCap> Lighting</span>
            <span className="flex items-center gap-2"><KeyCap>P</KeyCap> Photo</span>
            <span className="flex items-center gap-2"><KeyCap>G</KeyCap> Spatial Grid</span>
              <span className="flex items-center gap-2"><KeyCap>M</KeyCap> Map</span>
              <span className="flex items-center gap-2"><KeyCap>Esc</KeyCap> Exit</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== TOUCH CONTROLS HINT ====== */}
      {isTouch && !showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        >
          <div className="flex items-center gap-4 px-5 py-2.5 rounded-full text-xs text-white/80"
            style={{
              background: 'rgba(15,20,35,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Smartphone size={14} /> Drag left to move · Drag right to look
          </div>
        </motion.div>
      )}

      {/* ====== TOP-RIGHT HUD ====== */}
      {!showIntro && (
        <div className="fixed top-4 right-4 z-30 flex flex-col gap-2 items-end">
          <button
            onClick={() => setShowMap((s) => !s)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white transition-colors"
            style={{
              background: 'rgba(15,20,35,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            title="Toggle Map (M)"
          >
            <Map size={14} /> Map
          </button>
          <button
            onClick={onToggleQuality}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white transition-colors"
            style={{
              background: 'rgba(15,20,35,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            title="Toggle Quality"
          >
            <Zap size={14} /> {quality === 'high' ? 'High' : 'Low'}
          </button>
          <button
            onClick={cyclePreset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white transition-colors"
            style={{
              background: 'rgba(15,20,35,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            title="Lighting preset (L)"
          >
            {preset === 'golden' ? <Sun size={14} /> : preset === 'day' ? <SunDim size={14} /> : <MoonStar size={14} />}
            {' '}{preset === 'golden' ? 'Golden Hour' : preset === 'day' ? 'Daylight' : 'Midnight'}
          </button>
          <button
            onClick={takeShot}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white transition-colors"
            style={{
              background: 'rgba(15,20,35,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            title="Photo mode (P)"
          >
            <Camera size={14} /> Photo
          </button>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono"
            style={{
              background: 'rgba(15,20,35,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: fps >= 50 ? '#7dd97d' : fps >= 30 ? '#e8c468' : '#e88484',
            }}
            title="Measured FPS (auto-downgrades below 30)"
          >
            <Gauge size={14} /> {fps} FPS
          </div>
          <button
            onClick={() => setShowIntro(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white transition-colors"
            style={{
              background: 'rgba(15,20,35,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Info size={14} /> Menu
          </button>
        </div>
      )}

      {/* ====== MINI MAP ====== */}
      <AnimatePresence>
        {showMap && !showIntro && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className="fixed top-4 right-4 mt-14 z-30"
          >
            <Minimap playerPos={playerPos} playerDir={playerDir} hotspots={HOTSPOTS} onClose={() => setShowMap(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== HOTSPOT INFO ====== */}
      <AnimatePresence>
        {activeHotspot && !showIntro && (
          <motion.div
            key={activeHotspot}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-md w-[90%]"
          >
            <div className="rounded-xl p-5 text-white shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(20,28,42,0.95), rgba(10,14,22,0.95))',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(212,168,84,0.25)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Camera size={16} style={{ color: '#d4a854' }} />
                <h3 className="text-base font-semibold" style={{ color: '#e0c8a0' }}>
                  {HOTSPOTS.find((h) => h.id === activeHotspot)?.title}
                </h3>
              </div>
              <p className="text-sm text-white/75 leading-relaxed">
                {HOTSPOTS.find((h) => h.id === activeHotspot)?.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== CROSSHAIR (subtle) ====== */}
      {isLocked && !isTouch && !showIntro && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>
      )}
      {/* ====== PHOTO MODE TOAST ====== */}
      <AnimatePresence>
        {shotToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs text-white"
              style={{
                background: 'rgba(15,20,35,0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(212,168,84,0.35)',
              }}>
              <Camera size={13} /> Screenshot saved to your downloads
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="rounded-lg p-3"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color: '#d4a854' }}>{icon}</span>
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>
      <p className="text-xs text-white/50">{desc}</p>
    </div>
  )
}

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 rounded text-xs font-mono"
      style={{
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 2px 0 rgba(0,0,0,0.3)',
      }}
    >
      {children}
    </span>
  )
}

function Minimap({
  playerPos,
  playerDir,
  hotspots,
  onClose,
}: {
  playerPos: [number, number, number]
  playerDir: [number, number, number]
  hotspots: typeof HOTSPOTS
  onClose: () => void
}) {
  // Map world coords (-9..9, -7..7) to map coords (0..200, 0..160)
  const W = 220, H = 180
  const worldToMap = (x: number, z: number) => {
    const mx = (x / 18) * W + W / 2
    const my = (z / 14) * H + H / 2
    return [mx, my] as const
  }
  const [px, py] = worldToMap(playerPos[0], playerPos[2])
  const angle = Math.atan2(playerDir[0], -playerDir[2])

  return (
    <div
      className="rounded-xl overflow-hidden shadow-2xl relative"
      style={{
        background: 'rgba(10,14,22,0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <span className="text-xs font-semibold text-white flex items-center gap-2">
          <Map size={12} /> Floor Plan
        </span>
        <button onClick={onClose} className="text-white/60 hover:text-white">
          <X size={14} />
        </button>
      </div>
      <div className="relative" style={{ width: W, height: H }}>
        <svg width={W} height={H} className="absolute inset-0">
          {/* room outline */}
          <rect x="8" y="8" width={W - 16} height={H - 16}
            fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          {/* window marker (top) */}
          <line x1="60" y1="8" x2={W - 60} y2="8"
            stroke="#7acaff" strokeWidth="2.5" />
          {/* door (bottom) */}
          <line x1={W / 2 - 20} y1={H - 8} x2={W / 2 + 20} y2={H - 8}
            stroke="#d4a854" strokeWidth="2.5" />
          {/* hotspots */}
          {hotspots.map((h) => {
            const [hx, hy] = worldToMap(h.pos[0], h.pos[1])
            return (
              <g key={h.id}>
                <circle cx={hx} cy={hy} r="3.5" fill="#d4a854" />
                <text x={hx + 6} y={hy + 3} fontSize="8" fill="rgba(255,255,255,0.7)">
                  {h.title.split(' ')[0]}
                </text>
              </g>
            )
          })}
          {/* player */}
          <g transform={`translate(${px}, ${py}) rotate(${(angle * 180) / Math.PI})`}>
            <circle r="5" fill="rgba(255,255,255,0.2)" />
            <path d="M -4 4 L 0 -6 L 4 4 Z" fill="#fff" stroke="#d4a854" strokeWidth="1" />
          </g>
        </svg>
      </div>
    </div>
  )
}
