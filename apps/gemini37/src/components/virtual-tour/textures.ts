'use client'

import * as THREE from 'three'

// ============ Procedural Canvas Textures ============

function createCanvas(size = 1024): { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  return { canvas, ctx }
}

// Wood plank floor texture — oak parquet with realistic grain
export function createWoodTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas(1024)
  // base warm wood color
  ctx.fillStyle = '#b07a45'
  ctx.fillRect(0, 0, 1024, 1024)

  // draw planks
  const plankW = 128
  const plankH = 256
  for (let y = 0; y < 1024; y += plankH) {
    const offset = (y / plankH) % 2 === 0 ? 0 : plankW / 2
    for (let x = -plankW; x < 1024 + plankW; x += plankW) {
      const px = x + offset
      // plank color variation - lighter oak
      const hue = 28 + Math.random() * 6
      const sat = 50 + Math.random() * 15
      const light = 42 + Math.random() * 12
      ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`
      ctx.fillRect(px, y, plankW - 2, plankH - 2)
      // grain lines
      ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light - 10}%, 0.45)`
      ctx.lineWidth = 1
      for (let g = 0; g < 8; g++) {
        const gy = y + Math.random() * plankH
        ctx.beginPath()
        ctx.moveTo(px, gy)
        const seg = 8
        for (let i = 1; i <= seg; i++) {
          const sx = px + (plankW / seg) * i
          const sy = gy + (Math.random() - 0.5) * 4
          ctx.lineTo(sx, sy)
        }
        ctx.stroke()
      }
      // darker bevel
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'
      ctx.lineWidth = 1
      ctx.strokeRect(px, y, plankW - 2, plankH - 2)
    }
  }
  // subtle noise
  const img = ctx.getImageData(0, 0, 1024, 1024)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 18
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n))
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n))
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n))
  }
  ctx.putImageData(img, 0, 0)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Roughness map for wood — planks smoother than grooves
export function createWoodRoughness(): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas(1024)
  ctx.fillStyle = '#444' // base roughness
  ctx.fillRect(0, 0, 1024, 1024)
  const plankW = 128
  const plankH = 256
  for (let y = 0; y < 1024; y += plankH) {
    const offset = (y / plankH) % 2 === 0 ? 0 : plankW / 2
    for (let x = -plankW; x < 1024 + plankW; x += plankW) {
      const px = x + offset
      ctx.fillStyle = '#5a5a5a'
      ctx.fillRect(px, y, plankW - 2, plankH - 2)
      ctx.strokeStyle = '#222'
      ctx.strokeRect(px, y, plankW - 2, plankH - 2)
    }
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 8
  return tex
}

// Painted wall texture — subtle plaster
export function createWallTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas(1024)
  ctx.fillStyle = '#f5ebd9'
  ctx.fillRect(0, 0, 1024, 1024)
  // subtle mottling
  const img = ctx.getImageData(0, 0, 1024, 1024)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n))
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n))
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n))
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Marble countertop texture
export function createMarbleTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas(1024)
  ctx.fillStyle = '#e8e6e2'
  ctx.fillRect(0, 0, 1024, 1024)
  // veins
  for (let v = 0; v < 14; v++) {
    ctx.strokeStyle = `rgba(${60 + Math.random() * 40}, ${60 + Math.random() * 40}, ${60 + Math.random() * 40}, ${0.18 + Math.random() * 0.22})`
    ctx.lineWidth = 1 + Math.random() * 3
    ctx.beginPath()
    const sx = Math.random() * 1024
    const sy = Math.random() * 1024
    ctx.moveTo(sx, sy)
    let x = sx, y = sy
    for (let s = 0; s < 40; s++) {
      x += (Math.random() - 0.5) * 60
      y += (Math.random() - 0.5) * 60
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  // subtle noise
  const img = ctx.getImageData(0, 0, 1024, 1024)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 6
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n))
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n))
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n))
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Fabric texture for sofa
export function createFabricTexture(color = '#3a4250'): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas(512)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 512, 512)
  // weave pattern
  const img = ctx.getImageData(0, 0, 512, 512)
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const i = (y * 512 + x) * 4
      const weave = (Math.sin(x * 0.5) * Math.sin(y * 0.5)) * 12
      const n = (Math.random() - 0.5) * 14
      img.data[i] = Math.max(0, Math.min(255, img.data[i] + weave + n))
      img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + weave + n))
      img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + weave + n))
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Concrete texture for ceiling
export function createConcreteTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas(512)
  ctx.fillStyle = '#d6d4cf'
  ctx.fillRect(0, 0, 512, 512)
  const img = ctx.getImageData(0, 0, 512, 512)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 20
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n))
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n))
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n))
  }
  ctx.putImageData(img, 0, 0)
  // some darker spots
  for (let s = 0; s < 30; s++) {
    ctx.fillStyle = `rgba(120,118,112,${0.06 + Math.random() * 0.08})`
    const r = 10 + Math.random() * 40
    ctx.beginPath()
    ctx.arc(Math.random() * 512, Math.random() * 512, r, 0, Math.PI * 2)
    ctx.fill()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Rug texture with pattern
export function createRugTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas(512)
  ctx.fillStyle = '#9c3f2a' // deep rust
  ctx.fillRect(0, 0, 512, 512)
  // border
  ctx.strokeStyle = '#e0c8a0'
  ctx.lineWidth = 8
  ctx.strokeRect(20, 20, 472, 472)
  ctx.lineWidth = 4
  ctx.strokeRect(36, 36, 440, 440)
  // central pattern
  ctx.strokeStyle = '#e0c8a0'
  ctx.lineWidth = 2
  for (let i = 0; i < 8; i++) {
    ctx.beginPath()
    ctx.arc(256, 256, 30 + i * 22, 0, Math.PI * 2)
    ctx.stroke()
  }
  // diamond pattern
  ctx.fillStyle = '#e0c8a0'
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const x = 256 + Math.cos(angle) * 180
    const y = 256 + Math.sin(angle) * 180
    ctx.beginPath()
    ctx.moveTo(x, y - 20)
    ctx.lineTo(x + 14, y)
    ctx.lineTo(x, y + 20)
    ctx.lineTo(x - 14, y)
    ctx.closePath()
    ctx.fill()
  }
  // noise overlay
  const img = ctx.getImageData(0, 0, 512, 512)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 16
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n))
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n))
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n))
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// City night view texture for outside windows
export function createCityTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas(2048, 1024)
  // gradient sky - sunset
  const grad = ctx.createLinearGradient(0, 0, 0, 1024)
  grad.addColorStop(0, '#0a1535')
  grad.addColorStop(0.4, '#1d2a55')
  grad.addColorStop(0.7, '#3a2d56')
  grad.addColorStop(0.85, '#7a3b5a')
  grad.addColorStop(1, '#d97a4a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 2048, 1024)

  // distant buildings
  for (let layer = 0; layer < 3; layer++) {
    const opacity = 0.35 + layer * 0.2
    const yBase = 600 + layer * 60
    for (let x = 0; x < 2048; x += 30) {
      const w = 18 + Math.random() * 28
      const h = 80 + Math.random() * 200 + layer * 30
      ctx.fillStyle = `rgba(${20 + layer * 18}, ${22 + layer * 18}, ${38 + layer * 18}, ${opacity})`
      ctx.fillRect(x, yBase - h, w, h)
      // windows
      if (layer === 2) {
        for (let wy = yBase - h + 10; wy < yBase - 8; wy += 12) {
          for (let wx = x + 3; wx < x + w - 3; wx += 8) {
            if (Math.random() < 0.45) {
              ctx.fillStyle = Math.random() < 0.85 ? '#ffd87a' : '#7acaff'
              ctx.fillRect(wx, wy, 3, 4)
            }
          }
        }
      }
    }
  }

  // stars
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 2048
    const y = Math.random() * 400
    ctx.fillRect(x, y, 1, 1)
  }
  // moon glow
  const moonX = 1500, moonY = 200
  const moonGrad = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 120)
  moonGrad.addColorStop(0, 'rgba(255,245,220,0.9)')
  moonGrad.addColorStop(0.2, 'rgba(255,225,180,0.3)')
  moonGrad.addColorStop(1, 'rgba(255,225,180,0)')
  ctx.fillStyle = moonGrad
  ctx.fillRect(moonX - 120, moonY - 120, 240, 240)
  ctx.fillStyle = '#fff8e8'
  ctx.beginPath()
  ctx.arc(moonX, moonY, 28, 0, Math.PI * 2)
  ctx.fill()

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Abstract art texture for wall art
export function createArtTexture(seed = 0): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas(512, 768)
  // background
  const palettes = [
    ['#1a2a3e', '#c4554a', '#e8c468', '#3a5a7a'],
    ['#2d1f3e', '#7a4a8a', '#d68ac8', '#3a8a9a'],
    ['#3e2a1a', '#c48a4a', '#e8d0a0', '#5a3a2a'],
  ]
  const palette = palettes[seed % palettes.length]
  ctx.fillStyle = palette[0]
  ctx.fillRect(0, 0, 512, 768)
  // abstract shapes
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = palette[(i % 3) + 1]
    ctx.globalAlpha = 0.55 + Math.random() * 0.35
    const type = Math.random()
    if (type < 0.4) {
      ctx.beginPath()
      ctx.arc(Math.random() * 512, Math.random() * 768, 20 + Math.random() * 90, 0, Math.PI * 2)
      ctx.fill()
    } else if (type < 0.7) {
      ctx.fillRect(Math.random() * 512, Math.random() * 768, 30 + Math.random() * 120, 8 + Math.random() * 60)
    } else {
      ctx.beginPath()
      ctx.moveTo(Math.random() * 512, Math.random() * 768)
      ctx.lineTo(Math.random() * 512, Math.random() * 768)
      ctx.lineTo(Math.random() * 512, Math.random() * 768)
      ctx.closePath()
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
  // brush noise
  const img = ctx.getImageData(0, 0, 512, 768)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n))
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n))
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n))
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
