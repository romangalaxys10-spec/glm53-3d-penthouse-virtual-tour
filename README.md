# 🏢 GLM-5.3 3D Penthouse Virtual Tour

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **An interactive, real-time 3D luxury penthouse virtual tour built with Three.js, React Three Fiber, Next.js App Router, and Tailwind CSS.**  
> *Architected, planned, and implemented autonomously using Z.ai's GLM-5.3 model.*

📖 **Read the deep-dive technical case study:** [Inside GLM-5.3: Building a 3D Penthouse Virtual Tour on CLAW](https://claw.rommark.dev/blog/62-inside-glm-5-3-building-a-3d-penthouse-virtual-tour.html)

---

## ✨ Features

- **🏢 Procedural 3D Architectural Rendering**: Fully synthesized 3D multi-room environment featuring custom floor textures, drywall shaders, architectural windows, and realistic ambient/directional lighting.
- **🧭 Dual-Mode Navigation**:
  - **First-Person Walkthrough**: WASD + Mouse look controls with collision bounds and head-bob dynamics.
  - **Quick Teleportation**: Instant room transitions between Living Room, Master Suite, Panoramic Terrace, and Wine Cellar.
- **🗺️ Interactive Minimap Radar**: Real-time 2D floor plan overlay tracking player coordinates and orientation yaw in real time.
- **🛋️ Parametric Furniture & Interior Styling**: Procedurally assembled luxury furniture sets including velvet sectionals, marble coffee tables, king-size beds, and wine racks.
- **🌓 Dynamic Time-of-Day Lighting**: Seamless toggle between golden hour daylight and luxury evening mood lighting.
- **🔊 Web Audio Soundscape**: Ambient room acoustics and spatial interaction audio effects.
- **📱 Responsive Glassmorphic UI**: Floating control panel, HUD elements, and room picker built with Tailwind CSS and Radix UI primitives.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/), [React 19](https://react.dev/) |
| **3D & Graphics** | [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI Primitives](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) |
| **State & Animations** | [Zustand](https://zustand-demo.pmnd.rs/), [Framer Motion](https://www.framer.com/motion/) |
| **Language & Tooling** | [TypeScript](https://www.typescriptlang.org/), [Bun](https://bun.sh/) / [Node.js](https://nodejs.org/) |

---

## 📂 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Global root layout & font definitions
│   │   ├── page.tsx           # Virtual tour viewport & control interface
│   │   └── globals.css        # Tailwind styles & theme variables
│   ├── components/
│   │   ├── virtual-tour/
│   │   │   ├── ApartmentScene.tsx     # 3D Canvas, lighting, and scene manager
│   │   │   ├── FirstPersonControls.tsx# FPS movement, mouse-look & collision logic
│   │   │   ├── Room.tsx               # Room geometry, walls, floors & portals
│   │   │   ├── Furniture.tsx          # Procedural furniture & decoration models
│   │   │   ├── TourUI.tsx             # Minimap, room selector HUD & settings
│   │   │   └── textures.ts            # Procedural canvas texture generators
│   │   └── ui/                        # Reusable Radix / shadcn UI components
│   ├── hooks/                         # Custom UI & sensory hooks
│   └── lib/                           # Utility functions
├── public/                            # Static assets and icons
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/) or [Bun](https://bun.sh/)
- `npm`, `pnpm`, or `bun`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/romangalaxys10-spec/glm53-3d-penthouse-virtual-tour.git
   cd glm53-3d-penthouse-virtual-tour
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to explore the 3D tour.

---

## 🎮 Controls

| Action | Control |
| :--- | :--- |
| **Look Around** | Click on screen to lock pointer + Move mouse |
| **Move** | `W` `A` `S` `D` or Arrow Keys |
| **Toggle Room** | Click room buttons in the HUD / Minimap |
| **Toggle Minimap** | Press `M` or click the Map icon |
| **Unlock Pointer** | Press `Escape` |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
