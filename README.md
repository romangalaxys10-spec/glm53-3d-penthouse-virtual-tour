# GLM-5.3 vs Gemini 3.7 Flash — 3D Penthouse Virtual Tour

**Side-by-side build comparison:** the same interactive 3D penthouse tour, architected two ways.

- 🔴 **Live GLM-5.3 edition**: <https://glm53.vercel.app>
- 🔵 **Live Gemini 3.7 Flash edition**: <https://gemini37.vercel.app>
- 📖 **Full case study**: [Inside GLM-5.3: Building a 3D Penthouse Virtual Tour](https://claw.rommark.dev/blog/62-inside-glm-5-3-building-a-3d-penthouse-virtual-tour.html)

## What is this?

One Next.js + React Three Fiber penthouse tour, two engineering philosophies:

| Dimension | `apps/glm53` (GLM-5.3) | `apps/gemini37` (Gemini 3.7 Flash) |
|---|---|---|
| Textures | Procedural CPU canvas (oak parquet, Carrara marble) | Same procedural set, shared base |
| Collision | Per-furniture AABB, O(n) linear scan | **Spatial hash grid** — 1.2 m cells, O(1) queries, `G` key visualizes the grid live |
| Lighting | 3 lerped presets (golden / day / night) | Same preset engine |
| Extras | Photo mode (`P`), furniture dossiers, radar minimap, FPS monitor + adaptive quality | Same, plus the spatial-grid debug overlay |
| Build | Static export, zero runtime deps | Same |

## Run locally

```bash
# GLM-5.3 edition
cd apps/glm53 && npm install && npm run dev

# Gemini 3.7 Flash edition
cd apps/gemini37 && npm install && npm run dev
```

## Controls

| Key | Action |
|---|---|
| WASD / arrows | Walk |
| Shift | Sprint |
| Mouse (click to lock) | Look |
| `L` | Cycle lighting preset |
| `P` | Photo mode screenshot |
| `M` | Radar minimap |
| `G` | Spatial hash grid overlay *(Gemini edition)* |
| `Esc` | Release pointer |

## Repo layout

```
apps/
├── glm53/      # GLM-5.3 original build
└── gemini37/   # Gemini 3.7 Flash edition (spatial-hash signature)
```

MIT licensed. Built for the CLAW case study — see the article for the full architectural breakdown.
