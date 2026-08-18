# Demo Guide: Presenting the Penthouse Project

A five-minute walkthrough script for showing the project to reviewers, colleagues, or an audience — optimized for the "wow, then substance" arc. Every step below is verified working on the live deployments.

---

## Pre-flight (30 seconds before you share your screen)

1. Open both tabs in advance:
   - 🔴 [glm53.vercel.app](https://glm53.vercel.app)
   - 🔵 [gemini37.vercel.app](https://gemini37.vercel.app)
2. On the GLM tab: click once to lock the pointer (some browsers require a click before fullscreen-ish interactions feel right).
3. Know your exit: `Esc` releases the pointer lock at any time.

---

## The 5-Minute Arc

### Minute 1 — The Hook (GLM tab)

> "This is a 3D penthouse tour with zero downloaded assets. Every texture — the oak floor, the marble, the city outside — is painted by code at runtime. And it was planned, designed, and built end-to-end by an LLM: GLM-5.3."

Walk forward slowly. Let the room breathe. Sprint once with `Shift` to show it's real-time.

### Minute 2 — The Staging (`L` key)

Press `L` once: golden hour → daylight. Press again: daylight → midnight.

> "Lighting is a narrative here. Every transition lerps sun position, color temperature, and fog over about 1.2 seconds — smoothstep-eased, so it feels like a film set, not a light switch."

Point out the city lights in the night preset through the glass wall.

### Minute 3 — The Intelligence Layer

Aim the crosshair at the sofa → dossier card appears.

> "Every furniture piece is raycast-aware. Aim at anything and it identifies itself — name, materials, dimensions."

Press `P` — screenshot downloads.

> "Photo mode bumps the render to 2x pixel ratio for one frame, reads the pixels back from the GPU, and saves a PNG. Entirely client-side."

Press `M` → radar minimap.

### Minute 4 — The Plot Twist (Gemini tab)

Switch tabs. Hit `G`.

> "Same penthouse. Different engineer. This build was generated with Gemini 3.7 Flash, and it was asked to solve collision differently: a spatial hash grid with 1.2-meter cells. This glowing overlay is the actual data structure — every cell you see is a hash bucket the collision engine will query in O(1)."

Walk around and watch the cells respond.

### Minute 5 — The Point

> "Both builds are live, both are in one repo, and the only architectural difference is the collision layer. GLM-5.3 chose a hand-rolled linear AABB scan — simple, debuggable, honest. Gemini chose the scalable data structure. At thirteen colliders they're identical to the user; at ten thousand, one of them still runs. That's what 'engineering judgment in LLMs' looks like — and it's one click verifiable."

Close with the repo link and the case study link.

---

## FAQ Cheat Sheet

**Q: Is this really zero assets?**
A: Yes — no `.obj`, `.gltf`, or image files in the repo. All textures are procedural canvases; all geometry is Three.js primitives.

**Q: How big is the codebase?**
A: ~18,000 lines of TypeScript/TSX across both editions.

**Q: Did a human write the 3D code?**
A: The original build and its upgrades were generated and iterated with GLM-5.3; the comparison edition was generated with Gemini 3.7 Flash. The full process is documented in the case study article.

**Q: What's the point of two editions?**
A: Isolating architectural judgment. Same brief, same features, different collision engine — the divergence you can *see* (press `G`) is algorithmic, not cosmetic.

**Q: Does it run on weak GPUs?**
A: There's a built-in FPS watchdog: if frames drop below 30 for ~4 seconds, render resolution steps down automatically.

**Q: Why 1.2 m cells?**
A: Large enough to keep buckets shallow (most furniture fits in 1–4 cells), small enough that a 0.35 m player radius can't skip a cell between frames at walk speed.

---

## Backup Facts (if someone digs deeper)

- Room: 18 × 14 × 4.2 m, wall thickness 0.15 m (`Room.tsx`)
- Eye height 1.65 m, walk 4.5 m/s, sprint ×1.7, mouse sens 0.0022 (`FirstPersonControls.tsx`)
- Lighting presets: `golden` (default) / `day` / `night`, ~1.2 s smoothstep transitions (`LightingPresets.tsx`)
- Spatial hash: `CELL = 1.2`, `Map<string, Obstacle[]>` keyed `"x,z"` (`GeminiSignature.tsx`)
- Perf watchdog: FPS < 30 for ~4 s triggers quality step-down (`PerfMonitor.tsx`)
- Verification: headless Chromium pass, all presets, zero console errors (2026-08-17)
- Repo: 18,168 lines TS/TSX, MIT licensed, commit `1720669`
