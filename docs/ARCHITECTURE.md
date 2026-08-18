# Architecture Deep-Dive: How GLM-5.3 Engineered the Penthouse

This document walks through every engineering decision in the tour, module by module.
Read this after the [README](../README.md) if you want to *how* level detail — the README tells the story, this doc shows the wiring.

> All file paths below are relative to the app they live in (`apps/glm53/...` unless marked otherwise).
> Every number in this doc is read straight from the source code — nothing is estimated.

---

## Table of Contents

1. [Scene Graph & Room Architecture](#1-scene-graph--room-architecture)
2. [Procedural Texture Factory](#2-procedural-texture-factory)
3. [First-Person Kinematics](#3-first-person-kinematics)
4. [Collision Engine — Two Philosophies](#4-collision-engine--two-philosophies)
5. [Lighting Presets Engine](#5-lighting-presets-engine)
6. [HUD: Dossiers, Minimap, Photo Mode](#6-hud-dossiers-minimap-photo-mode)
7. [Performance Strategy](#7-performance-strategy)
8. [Monorepo Layout & Deployment](#8-monorepo-layout--deployment)

---

## 1. Scene Graph & Room Architecture

**Files:** `ApartmentScene.tsx`, `Room.tsx`

The world is a single open-plan penthouse defined by one constant — no level editor, no imported scene:

```ts
export const ROOM = {
  width: 18,   // X
  depth: 14,   // Z
  height: 4.2, // Y
  wallThickness: 0.15,
}
```

From that seed, `RoomArchitecture` constructs floors, walls, and the signature floor-to-ceiling glass wall. Textures are cloned-and-repeated per surface (`repeat.set(6, 5)` for the floor) inside `useMemo`, so each canvas is painted once and reused across surfaces.

The scene layers cleanly:

```
ApartmentScene (Canvas root)
├── RoomArchitecture      — shell: floor, walls, glass, fireplace wall
├── Furniture             — 13+ pieces, each self-locating + registered for collision
├── FirstPersonControls   — player capsule + camera rig
├── LightingPresets       — the four-light rig (see §5)
└── PerfMonitor           — frame-time watchdog (see §7)
```

**Why it matters:** GLM-5.3 made the room a *data constant*, not scattered magic numbers. Changing one number resizes the apartment; collision bounds derive from the same constant (see §3). That's the difference between generating code and engineering it.

---

## 2. Procedural Texture Factory

**File:** `textures.ts`

Zero image assets. Every surface in the penthouse is a 1024×1024 HTML canvas painted at runtime by six generator functions:

| Texture | Technique |
|---|---|
| Oak parquet | Per-plank hue jitter (`hue = 28 + Math.random() * 6`), plank grid with half-plank row offsets |
| Wood roughness | Companion canvas for the roughness map channel |
| Wall plaster | Low-frequency noise over a flat base |
| Concrete | Higher-frequency mottling for the fireplace surround |
| Carrara marble | Layered noise walks for veins over a bright base |
| City panorama | Procedural skyline silhouettes with lit windows for the night view |

A single helper opens every canvas:

```ts
function createCanvas(size = 1024) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  return { canvas, ctx: canvas.getContext('2d')! }
}
```

**Why it matters:** the entire art budget is one DOM API. No downloads, no licensing, no loading screens — and the textures are deterministic enough to tile believably.

---

## 3. First-Person Kinematics

**File:** `FirstPersonControls.tsx`

Classic FPS rig, hand-rolled on `useFrame`:

| Constant | Value | Meaning |
|---|---|---|
| `EYE_HEIGHT` | 1.65 m | Camera height above floor |
| `MOVE_SPEED` | 4.5 m/s | Base walk speed |
| `SPRINT_MULT` | 1.7 | Shift multiplier |
| `MOUSE_SENS` | 0.0022 | Radians per pixel of mouse motion |
| `PLAYER_RADIUS` | 0.35 m | Capsule radius for collision |

The controls integrate velocity each frame, resolve wall bounds derived from `ROOM` (not hardcoded), then resolve furniture collisions (see §4). Pointer lock handles look; touch devices get drag-look + on-screen joystick.

**Why it matters:** the tuning constants are physically plausible (a 1.65 m eye height and 4.5 m/s walk speed match real human gait), which is why the tour *feels* right immediately.

---

## 4. Collision Engine — Two Philosophies

This is the heart of the comparison. Both editions ship the same tour, the same furniture, the same HUD — and a deliberately different collision architecture.

### 🔴 GLM-5.3: Per-Furniture AABB, Linear Scan

`FirstPersonControls.tsx` holds `FURNITURE_BOXES`: an array of `{ x, z, hw, hd }` axis-aligned boxes — sofa (`hw: 1.7, hd: 0.8`), coffee table, kitchen island, dining table, bookshelf, fireplace, and more. Every frame, the player capsule is tested against each box in a simple loop.

- **Cost:** O(n) per frame, n ≈ 13
- **Character:** transparent, debuggable, zero dependencies
- **Scaling limit:** fine for a home; degrades with hundreds+ of colliders

### 🔵 Gemini 3.7 Flash: Spatial Hash Grid

`apps/gemini37/src/components/virtual-tour/GeminiSignature.tsx` replaces the linear scan:

```ts
const CELL = 1.2 // grid cell size in meters
```

Every obstacle's AABB is bucketed into `Map<string, Obstacle[]>` keyed by `"x,z"` cell coordinates (`Math.floor((o.x - o.hw) / CELL)` …). Collision queries then check only the cell the player stands in (plus neighbors): **O(1) lookup**. Press `G` in the Gemini edition and the grid is drawn live over the floor — you can watch cells light up as you walk.

- **Cost:** O(1) per query after O(n) build
- **Character:** algorithmically elegant, scales to thousands of colliders
- **Trade-off:** more code, plus grid rebuilds when furniture moves

### The Honest Read

At n = 13 colliders, both engines hit 60 fps without breaking a sweat — the difference is academic *today* and decisive *at scale*. That's precisely the point: same problem, two defensible engineering philosophies, both shipped and verifiable one click apart.

---

## 5. Lighting Presets Engine

**File:** `LightingPresets.tsx`

A four-light rig — directional sun, directional fill, hemisphere light, ambient light — plus fog. Three presets ship:

```ts
export type PresetName = 'golden' | 'day' | 'night'
```

Switching (`L` key or HUD) doesn't teleport the lights: a **smoothstep-eased ~1.2 s transition** lerps sun position, sun/fill/hemi/ambient intensities and colors, and fog color frame by frame inside `useFrame`. A tiny module-level pub/sub store lets the HUD trigger presets without React re-renders in the scene.

**Why it matters:** cinematic light changes are exactly where amateur 3D demos feel cheap (hard cuts). The lerp rig is why the penthouse feels staged.

---

## 6. HUD: Dossiers, Minimap, Photo Mode

**Files:** `CrosshairDossiers.tsx`, `TourUI.tsx`, `PhotoMode.ts`

- **Furniture dossiers** — a raycaster fires from the crosshair; the furniture it hits pops a DOM info card (name, materials, dimensions) split out of the 3D scene, so text stays crisp.
- **Radar minimap** (`M`) — a canvas 2D top-down radar with player position/direction and furniture hotspots, drawn from the same collision data.
- **Photo mode** (`P`) — briefly raises device pixel ratio to 2 for a crisp shot, renders one extra frame, reads pixels via `gl.readPixels`, flips rows (WebGL origin is bottom-left), and assembles a PNG download. No server, no dependencies.

---

## 7. Performance Strategy

**File:** `PerfMonitor.tsx`

A frame-time watchdog, not a vanity counter:

- Counts real frames per second in `useFrame`
- **If FPS < 30 for ~4 continuous seconds**, it notifies listeners to step down render quality (pixel ratio), keeping the scene smooth on integrated GPUs
- The FPS readout is also exposed to the HUD (and togglable)

Verification: the final headless-Chromium pass across all three lighting presets logged **zero console errors**.

---

## 8. Monorepo Layout & Deployment

```
apps/
├── glm53/     # 🔴 GLM-5.3 edition — https://glm53.vercel.app
└── gemini37/  # 🔵 Gemini 3.7 Flash edition — https://gemini37.vercel.app
```

Each app is a self-contained Next.js project (install & run independently). Both deploy to Vercel from their subdirectory. The shared nothing / compare everything split is the experiment: the divergence is confined to the collision layer (and the Gemini intro overlay), so any behavioral difference you can *see* is architectural, not cosmetic.

---

## Verification Notes

All facts in this doc were checked against the source at commit `1720669`:

- `ROOM` dimensions: `Room.tsx`
- Kinematics constants: `FirstPersonControls.tsx`
- `CELL = 1.2`: `GeminiSignature.tsx`
- Lerp timing (`dt / 1.2`): `LightingPresets.tsx`
- FPS threshold (`< 30` for ~4 s): `PerfMonitor.tsx`
- Zero console errors: headless Chromium verification run, 2026-08-17
