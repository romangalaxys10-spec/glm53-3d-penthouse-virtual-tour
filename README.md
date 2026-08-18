<div align="center">

# 🏙️ The Penthouse That an LLM Built

### A 3D virtual tour, planned · designed · shipped by **GLM-5.3** — and what happens when Gemini 3.7 Flash gets the same keys

**[🔴 LIVE — GLM-5.3 Edition](https://glm53.vercel.app)** · **[🔵 LIVE — Gemini 3.7 Flash Edition](https://gemini37.vercel.app)** · **[📖 The Full Case Study](https://claw.rommark.dev/blog/62-inside-glm-5-3-building-a-3d-penthouse-virtual-tour.html)**

*Zero downloaded assets. Zero 3D scanners. Zero stock textures. 18,000+ lines of pure code — every plank and marble vein drawn by mathematics.*

**Built by a Z.ai Ambassador to answer one question: can a frontier LLM truly *engineer* real-time 3D — not just autocomplete it?**

</div>

---

## 🎬 The Premise

Hand an LLM a request most developers would refuse: *build a photorealistic penthouse you can walk through — no asset files, no texture packs, no Blender, no photogrammetry. Everything must be generated in code.*

GLM-5.3 took the brief and ran a full engineering process:

| Stage | What GLM-5.3 Actually Did |
|---|---|
| 🧭 **Plan** | Scoped an 18 × 14 × 4.2 m open-plan penthouse (`ROOM` const), picked Next.js + React Three Fiber + TypeScript, split work into scene / controls / collision / HUD layers |
| 🎨 **Design** | Authored procedural 1024px canvas textures — oak parquet with per-plank hue variation, Carrara-style marble, brushed concrete, a night city panorama — all from `fillRect` + noise math |
| 🏗️ **Build** | Sculpted 13+ furniture pieces from raw Three.js primitives: floor lamps with emissive bulbs, a wood-clad fireplace wall, kitchen island, floor-to-ceiling glass south wall |
| 🧠 **Think** | Wrote its own 2D AABB collision engine with player radius, wall margins, and per-furniture hitboxes; pointer-lock first-person kinematics with sprint, head-bob, and eye-height 1.65 m |
| ⚡ **Optimize** | `useMemo` texture caching, capped draw calls, an FPS monitor that auto-downgrades render scale when frames dip — real 60fps discipline, not a slideshow |
| 📸 **Delight** | Three lerped lighting presets (golden hour / daylight / midnight), photo mode that saves screenshots, crosshair furniture dossiers, radar minimap |

Then we asked a second frontier model — **Gemini 3.7 Flash** — to solve the same brief in the same repo, with one twist: re-architect the collision layer as a **spatial hash grid**. Same tour, different engineering soul. Both are deployed. Both are one click away.

---

## 🎮 Try It — 60 Seconds to Impress

1. Open the **[GLM-5.3 edition](https://glm53.vercel.app)**
2. Click to lock the pointer. Walk with `WASD`. Sprint with `Shift`.
3. Press `L` — watch the sun sweep from golden hour to midnight over the skyline.
4. Aim at the sofa. A **dossier card** appears: name, materials, dimensions.
5. Press `P` — photo mode saves a screenshot straight to your downloads.
6. Now open the **[Gemini edition](https://gemini37.vercel.app)** and hit `G` — you'll see its spatial hash grid glowing over the floor, re-bucketing furniture into 1.2 m cells in real time.

> Two frontier LLMs. Same penthouse. Two collision architectures you can *see*.

---

## 🧠 The Engineering Story (Why This Is Hard)

**3D web apps break LLMs.** They demand simultaneous mastery of linear algebra, the browser render loop, asset pipelines, physics, and UI — all stateful, all interactive, all unforgiving of hallucinated APIs. One wrong `THREE` namespace reference crashes the whole canvas.

This repo is a stress test of *engineering* ability, not snippet generation:

### 1. The Zero-Asset Constraint
Every surface is a 1024×1024 HTML canvas painted at runtime. Oak planks get per-plank hue jitter (`28 + Math.random() * 6` on the hue wheel); marble veins are layered noise walks. The total "art budget" is a single `createCanvas()` helper.

### 2. Geometry From Primitives
No imported models. The sofa is a composed stack of rounded boxes; floor lamps are cylinders + spheres + `PointLight`s; the skyline outside is procedural silhouettes. 13+ furniture pieces, each with its own collision AABB.

### 3. A Hand-Rolled Collision Engine (GLM-5.3's Choice)
Per-furniture axis-aligned bounding boxes, checked linearly every frame against the player capsule. Simple, debuggable, honest O(n) — the kind of engine an engineer writes when they understand the problem *before* reaching for a library.

### 4. The Gemini Signature: Spatial Hash Grid
Gemini 3.7 Flash rejected the linear scan. It bucketed all furniture into a hash grid of **1.2 m cells**, making collision lookups O(1) — check only the cell you're standing in. Press `G` in its edition to see the grid drawn live over the floor. At 13 colliders the difference is academic; at 10,000 colliders it's a rendering session vs. a slideshow. *That's the architectural judgment this repo exists to showcase.*

### 5. Lighting as a Narrative
Three presets — `golden`, `day`, `night` — lerp sun position, color temperature, sky color, and lamp intensity together over ~1.5 s. The penthouse feels *staged*, not rendered.

### 6. Performance as a Feature
A live FPS meter watches frame times; when they dip, the renderer's pixel ratio steps down automatically. The tour stays smooth on integrated GPUs. (Verified on headless Chromium: zero console errors across all lighting presets.)

---

## ⚔️ GLM-5.3 vs Gemini 3.7 Flash — The Real Comparison

| Dimension | 🔴 GLM-5.3 Edition | 🔵 Gemini 3.7 Flash Edition |
|---|---|---|
| Collision | Per-furniture AABB, linear scan — hand-rolled, debuggable, zero deps | **Spatial hash grid — 1.2 m cells, O(1) lookup, live grid overlay on `G`** |
| Textures | Procedural canvas: oak parquet, Carrara marble, concrete, city panorama | Shared procedural base |
| Lighting | 3 lerped presets — golden hour / daylight / midnight | Same preset engine |
| Extras | Photo mode (`P`), furniture dossiers, radar minimap, FPS monitor + adaptive quality | Same, plus grid debug overlay |
| Character | The engineer's build: direct, transparent, everything where you expect it | The architect's build: algorithmically elegant, scales to thousands of colliders |

Both editions share the same procedural texture engine, lighting rig, and HUD — the divergence is *purely architectural*, which is exactly what makes the comparison honest.

---

## 🎛️ Controls

| Input | Action |
|---|---|
| `WASD` / arrows | Walk |
| `Shift` | Sprint (×1.7) |
| Mouse (click to lock) | Look |
| `L` | Cycle lighting preset (golden → day → night) |
| `P` | Photo mode — saves a screenshot |
| `M` | Radar minimap |
| `G` | Spatial hash grid overlay *(Gemini edition only)* |
| `Esc` | Release pointer |

---

## 📁 Repo Layout

```
glm53-3d-penthouse-virtual-tour/
├── apps/
│   ├── glm53/                        # 🔴 The GLM-5.3 build (original)
│   │   └── src/components/virtual-tour/
│   │       ├── ApartmentScene.tsx      # Scene graph root
│   │       ├── Room.tsx                # Architecture: walls, floors, glass wall, fireplace
│   │       ├── Furniture.tsx           # 13+ procedural furniture pieces
│   │       ├── FirstPersonControls.tsx # Pointer-lock kinematics + AABB collision
│   │       ├── textures.ts             # Procedural canvas texture factory
│   │       ├── LightingPresets.tsx     # Golden / day / night lerp engine
│   │       ├── CrosshairDossiers.tsx   # Raycast furniture info cards
│   │       ├── PhotoMode.ts            # Screenshot capture
│   │       └── PerfMonitor.tsx         # FPS meter + adaptive resolution
│   └── gemini37/                      # 🔵 The Gemini 3.7 Flash build
│       └── src/components/virtual-tour/
│           └── … same components, plus:
│           └── GeminiSignature.tsx     # Spatial hash grid + live debug overlay
└── README.md                          # You are here
```

**18,168 lines** of TypeScript/TSX across both editions.
No `.obj`. No `.gltf`. No image files.
*No 3D assets were downloaded during the making of this penthouse.*

---

## 🚀 Run Locally

```bash
# GLM-5.3 edition
cd apps/glm53 && npm install && npm run dev

# Gemini 3.7 Flash edition
cd apps/gemini37 && npm install && npm run dev
```

Each app is a self-contained Next.js project — install and run independently.

---

## 📖 The Full Story

The complete architectural breakdown — how GLM-5.3 planned the scene graph, how the texture math works, why the collision engines diverge, and what it means for agentic coding — lives in the case study:

**→ [Inside GLM-5.3: How an LLM Planned, Designed, and Executed a 3D Penthouse Virtual Tour](https://claw.rommark.dev/blog/62-inside-glm-5-3-building-a-3d-penthouse-virtual-tour.html)**

---

## 🙏 Credits & Context

- **Original penthouse build:** generated and iterated with **GLM-5.3** (Z.ai)
- **Comparison edition:** spatial-hash rebuild generated with **Gemini 3.7 Flash**
- **Case study & upgrades:** published on [claw.rommark.dev](https://claw.rommark.dev/blog/) by a Z.ai Ambassador
- **License:** MIT — fork it, walk it, break it, learn from it

<div align="center">

**⭐ If this project made you rethink what LLMs can engineer, a star helps other builders find it.**

[🔴 Live GLM-5.3](https://glm53.vercel.app) · [🔵 Live Gemini 3.7 Flash](https://gemini37.vercel.app) · [📖 Case Study](https://claw.rommark.dev/blog/62-inside-glm-5-3-building-a-3d-penthouse-virtual-tour.html)

</div>
