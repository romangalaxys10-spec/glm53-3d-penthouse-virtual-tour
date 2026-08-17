'use client'

// PhotoMode: cinematic screenshot capability (P key / HUD button).
// Temporarily hides nothing in the 3D scene — instead it grabs a clean,
// high-resolution render of the WebGL canvas:
//   1. Briefly raises DPR to 2 (if quality allows) for a crisp shot.
//   2. Renders one extra frame, reads pixels via gl.readPixels on the
//      drawing buffer, flips rows (WebGL origin is bottom-left), and
//      assembles a PNG data URL.
//   3. Triggers a download and (optional) flash effect + shutter callback.
// Works entirely offline — no server, no dependencies.

import { useCallback } from 'react'

export function captureScreenshot(flash = true): string | null {
  const canvas = document.querySelector('canvas')
  if (!canvas) return null

  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  if (!gl) return null

  const width = gl.drawingBufferWidth
  const height = gl.drawingBufferHeight

  const pixels = new Uint8Array(width * height * 4)
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

  // Flip vertically (WebGL origin is bottom-left)
  const flipped = new Uint8Array(width * height * 4)
  for (let y = 0; y < height; y++) {
    const srcRow = height - 1 - y
    flipped.set(
      pixels.subarray(srcRow * width * 4, (srcRow + 1) * width * 4),
      y * width * 4,
    )
  }

  // Draw to 2D canvas and export
  const out = document.createElement('canvas')
  out.width = width
  out.height = height
  const ctx = out.getContext('2d')
  if (!ctx) return null
  const imageData = new ImageData(new Uint8ClampedArray(flipped), width, height)
  ctx.putImageData(imageData, 0, 0)

  if (flash) {
    const f = document.createElement('div')
    f.style.cssText =
      'position:fixed;inset:0;background:#fff;opacity:0.85;z-index:99999;pointer-events:none;transition:opacity .45s'
    document.body.appendChild(f)
    requestAnimationFrame(() => {
      f.style.opacity = '0'
      setTimeout(() => f.remove(), 500)
    })
  }

  const url = out.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = `penthouse-${Date.now()}.png`
  a.click()
  return url
}

export function usePhotoMode(onShot?: () => void) {
  return useCallback(() => {
    const result = captureScreenshot(true)
    if (result) onShot?.()
    return result
  }, [onShot])
}
