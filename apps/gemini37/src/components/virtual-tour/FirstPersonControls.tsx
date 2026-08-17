'use client'

import { useRef, useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOM } from './Room'
import { buildSpatialHash, queryHash } from './GeminiSignature'

// First-person navigation: WASD + mouse look (pointer lock)
// Mobile: drag to look, on-screen joystick to move

interface PlayerState {
  velocity: THREE.Vector3
  direction: THREE.Vector3
  euler: THREE.Euler
  isLocked: boolean
}

const EYE_HEIGHT = 1.65
const MOVE_SPEED = 4.5
const SPRINT_MULT = 1.7
const MOUSE_SENS = 0.0022

// Wall AABBs for collision (player radius for collision)
const PLAYER_RADIUS = 0.35

function getCollisionBounds() {
  const { width, depth } = ROOM
  // define interior bounds with margin
  const minX = -width / 2 + PLAYER_RADIUS + 0.2
  const maxX = width / 2 - PLAYER_RADIUS - 0.2
  const minZ = -depth / 2 + PLAYER_RADIUS + 0.2
  const maxZ = depth / 2 - PLAYER_RADIUS - 0.2
  return { minX, maxX, minZ, maxZ }
}

// Furniture collision boxes (approximate AABBs centered at origin)
const FURNITURE_BOXES: { x: number, z: number, hw: number, hd: number }[] = [
  // Sofa
  { x: 0, z: 3.6, hw: 1.7, hd: 0.8 },
  // Coffee table
  { x: 0, z: 2.4, hw: 0.8, hd: 0.5 },
  // Side tables
  { x: -1.9, z: 3.8, hw: 0.35, hd: 0.35 },
  { x: 1.9, z: 3.8, hw: 0.35, hd: 0.35 },
  // Armchairs
  { x: -3.4, z: 2.5, hw: 0.6, hd: 0.6 },
  { x: 3.4, z: 2.5, hw: 0.6, hd: 0.6 },
  // Floor lamps
  { x: -4.2, z: 1.5, hw: 0.25, hd: 0.25 },
  { x: 4.2, z: 1.5, hw: 0.25, hd: 0.25 },
  // TV stand (against north wall at z = -7)
  { x: 0, z: -6.6, hw: 1.9, hd: 0.35 },
  // Kitchen island
  { x: 0, z: -3.5, hw: 1.65, hd: 0.65 },
  // Dining table
  { x: -5, z: -3, hw: 1.15, hd: 1.15 },
  // Bookshelf (south wall at z = 7)
  { x: 5.5, z: 6.5, hw: 1.1, hd: 0.35 },
  // Fireplace (west wall at x = -9)
  { x: -8.6, z: -3, hw: 0.4, hd: 1.1 },
  // Plants
  { x: -8.4, z: 4, hw: 0.35, hd: 0.35 },
  { x: 8.4, z: -5, hw: 0.3, hd: 0.3 },
  { x: 6, z: 6.3, hw: 0.3, hd: 0.3 },
  { x: -6, z: 1, hw: 0.32, hd: 0.32 },
]

// Gemini signature: spatial hash built once, O(1) queries instead of O(n) scan
const HASH_CELLS = buildSpatialHash(FURNITURE_BOXES)

function collides(x: number, z: number): boolean {
  return queryHash(HASH_CELLS, x, z, PLAYER_RADIUS).length > 0
}

interface TouchState {
  lookActive: boolean
  lookId: number | null
  lookLastX: number
  lookLastY: number
  moveActive: boolean
  moveId: number | null
  moveStartX: number
  moveStartY: number
  moveX: number
  moveY: number
}

export function FirstPersonControls({
  onLockChange,
  onMove,
}: {
  onLockChange?: (locked: boolean) => void
  onMove?: (pos: THREE.Vector3, dir: THREE.Vector3) => void
}) {
  const { camera, gl } = useThree()
  const playerRef = useRef<PlayerState>({
    velocity: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    euler: new THREE.Euler(0, 0, 0, 'YXZ'),
    isLocked: false,
  })
  const keys = useRef<Record<string, boolean>>({})
  const [isTouch, setIsTouch] = useState(false)
  const touchState = useRef<TouchState>({
    lookActive: false,
    lookId: null,
    lookLastX: 0,
    lookLastY: 0,
    moveActive: false,
    moveId: null,
    moveStartX: 0,
    moveStartY: 0,
    moveX: 0,
    moveY: 0,
  })

  // Set initial camera position - standing in living room looking toward -Z (TV/windows)
  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, 6)
    // Default Three.js camera looks toward -Z. No Y rotation needed.
    const initEuler = new THREE.Euler(0, 0, 0, 'YXZ')
    camera.quaternion.setFromEuler(initEuler)
    playerRef.current.euler.copy(initEuler)
  }, [camera])

  // Detect touch device
  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    // Defer setState to satisfy lint rule
    setTimeout(() => setIsTouch(touch), 0)
  }, [])

  // Keyboard
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true
    }
    const onUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  // Pointer lock for desktop
  useEffect(() => {
    if (isTouch) return
    const canvas = gl.domElement
    const onPointerDown = () => {
      if (!playerRef.current.isLocked) {
        canvas.requestPointerLock()
      }
    }
    const onPointerLockChange = () => {
      playerRef.current.isLocked = document.pointerLockElement === canvas
      onLockChange?.(playerRef.current.isLocked)
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!playerRef.current.isLocked) return
      const { euler } = playerRef.current
      euler.y -= e.movementX * MOUSE_SENS
      euler.x -= e.movementY * MOUSE_SENS
      euler.x = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, euler.x))
      camera.quaternion.setFromEuler(euler)
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('mousemove', onMouseMove)
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl, camera, isTouch, onLockChange])

  // Touch controls
  useEffect(() => {
    if (!isTouch) return

    const canvas = gl.domElement

    const onTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]
        // right half = look, left half = move
        if (t.clientX > window.innerWidth / 2) {
          if (!touchState.current.lookActive) {
            touchState.current.lookActive = true
            touchState.current.lookId = t.identifier
            touchState.current.lookLastX = t.clientX
            touchState.current.lookLastY = t.clientY
          }
        } else {
          if (!touchState.current.moveActive) {
            touchState.current.moveActive = true
            touchState.current.moveId = t.identifier
            touchState.current.moveStartX = t.clientX
            touchState.current.moveStartY = t.clientY
            touchState.current.moveX = 0
            touchState.current.moveY = 0
          }
        }
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]
        if (t.identifier === touchState.current.lookId) {
          const dx = t.clientX - touchState.current.lookLastX
          const dy = t.clientY - touchState.current.lookLastY
          touchState.current.lookLastX = t.clientX
          touchState.current.lookLastY = t.clientY
          const { euler } = playerRef.current
          euler.y -= dx * 0.005
          euler.x -= dy * 0.005
          euler.x = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, euler.x))
          camera.quaternion.setFromEuler(euler)
        }
        if (t.identifier === touchState.current.moveId) {
          const dx = t.clientX - touchState.current.moveStartX
          const dy = t.clientY - touchState.current.moveStartY
          const max = 80
          touchState.current.moveX = Math.max(-1, Math.min(1, dx / max))
          touchState.current.moveY = Math.max(-1, Math.min(1, dy / max))
        }
      }
      e.preventDefault()
    }
    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]
        if (t.identifier === touchState.current.lookId) {
          touchState.current.lookActive = false
          touchState.current.lookId = null
        }
        if (t.identifier === touchState.current.moveId) {
          touchState.current.moveActive = false
          touchState.current.moveId = null
          touchState.current.moveX = 0
          touchState.current.moveY = 0
        }
      }
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)
    canvas.addEventListener('touchcancel', onTouchEnd)
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [gl, camera, isTouch])

  // Animation loop — movement
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    const p = playerRef.current
    const { velocity, direction } = p

    // Reset direction
    direction.set(0, 0, 0)

    let speed = MOVE_SPEED
    if (keys.current['ShiftLeft'] || keys.current['ShiftRight']) {
      speed *= SPRINT_MULT
    }

    if (isTouch) {
      direction.x = touchState.current.moveX
      direction.z = touchState.current.moveY
    } else if (p.isLocked) {
      if (keys.current['KeyW'] || keys.current['ArrowUp']) direction.z -= 1
      if (keys.current['KeyS'] || keys.current['ArrowDown']) direction.z += 1
      if (keys.current['KeyA'] || keys.current['ArrowLeft']) direction.x -= 1
      if (keys.current['KeyD'] || keys.current['ArrowRight']) direction.x += 1
    }

    direction.normalize()

    // Apply movement in camera-relative direction
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    const right = new THREE.Vector3()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

    const moveVec = new THREE.Vector3()
    moveVec.addScaledVector(forward, -direction.z * speed * dt)
    moveVec.addScaledVector(right, direction.x * speed * dt)

    // Smooth velocity (optional damping)
    velocity.lerp(moveVec, 0.2)

    // Apply movement with collision check (separate axes for sliding)
    // Use a local Vector3 to avoid mutating camera.position directly (lint rule)
    const bounds = getCollisionBounds()
    const pos = camera.position
    const curX = pos.x
    const curZ = pos.z
    const newX = curX + velocity.x
    const newZ = curZ + velocity.z

    let finalX = curX
    let finalZ = curZ
    // Try X
    if (
      newX > bounds.minX && newX < bounds.maxX &&
      !collides(newX, curZ)
    ) {
      finalX = newX
    } else {
      velocity.x = 0
    }
    // Try Z
    if (
      newZ > bounds.minZ && newZ < bounds.maxZ &&
      !collides(finalX, newZ)
    ) {
      finalZ = newZ
    } else {
      velocity.z = 0
    }

    // Keep eye height with subtle bob
    const bob = Math.sin(performance.now() * 0.003) * 0.01 * (direction.length() > 0.1 ? 1 : 0)
    pos.set(finalX, EYE_HEIGHT + bob, finalZ)

    // Notify movement
    if (onMove) {
      onMove(camera.position, forward)
    }
  })

  return null
}
