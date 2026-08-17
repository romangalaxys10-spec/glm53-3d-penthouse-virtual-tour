# 🏙️ 3D Luxury Penthouse Virtual Tour — Built with GLM-5.3

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r128+-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Article Breakdown](https://img.shields.io/badge/Read_Case_Study-CLAW_Blog-red?style=for-the-badge)](https://claw.rommark.dev/blog/62-inside-glm-5-3-building-a-3d-penthouse-virtual-tour.html)

An interactive, high-performance **3D Luxury Penthouse Virtual Tour** web application designed, architected, and executed end-to-end using Z.ai's frontier coding model **GLM-5.3**.

Features realistic procedural lighting, custom Three.js room geometries, interactive floor-plan radar with real-time yaw tracking, spatial ambient audio, interactive point-of-interest (POI) markers, and a responsive UI.

---

## 📖 Deep Dive Article

For a full breakdown of how GLM-5.3 planned the data structures, implemented Three.js camera transitions without memory leaks, and structured the component hierarchy:
👉 **[Read the Full Case Study on CLAW](https://claw.rommark.dev/blog/62-inside-glm-5-3-building-a-3d-penthouse-virtual-tour.html)**

---

## ✨ Key Features

- **🌐 Custom Procedural 3D Engine**: Built directly on Three.js with custom skybox shaders, HDR daylight & night lighting modes, procedural floor tiles, and luxury furniture meshes.
- **🧭 Interactive Floor Plan Radar**: Real-time 2D mini-map showing user location and camera orientation (yaw angle cone).
- **🛋️ Multi-Room Navigation**: Smooth animated camera transitions between rooms:
  - Grand Living Room & Lounge
  - Master Suite & Balcony
  - Panoramic Sky Terrace
  - Private Wine Cellar & Tasting Room
- **📍 Hotspots & Point of Interest (POI)**: Interactive 3D clickable markers with contextual property info and high-res asset previews.
- **🎵 Spatial Sound Effects**: Web Audio API-powered ambient luxury room sounds and interaction feedback.
- **🎨 Glassmorphic Modern UI**: Built with Tailwind CSS, Lucide Icons, and modern component ergonomics.
- **⚡ Zero Memory Leaks**: Proper Three.js geometry, texture, and animation frame disposal on room transitions and unmounts.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router), React 19 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **3D / Graphics** | [Three.js](https://threejs.org/), Custom WebGL Shaders & Procedural Meshes |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), CSS Modules |
| **Icons & UI** | [Lucide React](https://lucide.dev/), Radix UI / shadcn |
| **Audio** | HTML5 Web Audio API |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or newer)
- npm <command>

Usage:

npm install        install all the dependencies in your project
npm install <foo>  add the <foo> dependency to your project
npm test           run this project's tests
npm run <foo>      run the script named <foo>
npm <command> -h   quick help on <command>
npm -l             display usage info for all commands
npm help <term>    search for help on <term>
npm help npm       more involved overview

All commands:

    access, adduser, audit, bugs, cache, ci, completion,
    config, dedupe, deprecate, diff, dist-tag, docs, doctor,
    edit, exec, explain, explore, find-dupes, fund, get, help,
    help-search, hook, init, install, install-ci-test,
    install-test, link, ll, login, logout, ls, org, outdated,
    owner, pack, ping, pkg, prefix, profile, prune, publish,
    query, rebuild, repo, restart, root, run-script, sbom,
    search, set, shrinkwrap, star, stars, start, stop, team,
    test, token, uninstall, unpublish, unstar, update, version,
    view, whoami

Specify configs in the ini-formatted file:
    /home/roman/.npmrc
or on the command line via: npm <command> --key=value

More configuration info: npm help config
Configuration fields: npm help 7 config

npm@10.9.8 /home/roman/.nvm/versions/node/v22.23.2/lib/node_modules/npm or Version 10.33.2
Usage: pnpm [command] [flags]
       pnpm [ -h | --help | -v | --version ]

These are common pnpm commands used in various situations, use 'pnpm help -a' to list all commands

Manage your dependencies:
      add                  Installs a package and any packages that it depends
                           on. By default, any new package is installed as a
                           prod dependency
   i, install              Install all dependencies for a project
  ln, link                 Connect the local project to another one
  rm, remove               Removes packages from node_modules and from the
                           project's package.json
      unlink               Unlinks a package. Like yarn unlink but pnpm
                           re-installs the dependency after removing the
                           external link
  up, update               Updates packages to their latest version based on the
                           specified range

Review your dependencies:
      audit                Checks for known security issues with the installed
                           packages
  ls, list                 Print all the versions of packages that are
                           installed, as well as their dependencies, in a
                           tree-structure
      outdated             Check for outdated packages
      why                  Shows all packages that depend on the specified
                           package

Run your scripts:
      create               Create a project from a "create-*" or "@foo/create-*"
                           starter kit
      dlx                  Fetches a package from the registry without
                           installing it as a dependency, hot loads it, and runs
                           whatever default command binary it exposes
      exec                 Executes a shell command in scope of a project
      run                  Runs a defined package script

Other:
   c, config               Manage the pnpm configuration files
      init                 Create a package.json file
      publish              Publishes a package to the registry
      self-update          Updates pnpm to the latest version

Options:
  -r, --recursive          Run the command for each project in the workspace. or yarn install v1.22.22
info No lockfile found.
[1/4] Resolving packages...
[2/4] Fetching packages...
info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command.

### Installation

1. **Clone the repository:**
   

2. **Install dependencies:**
   

3. **Run the development server:**
   
> nextjs_tailwind_shadcn_ts@0.2.1 dev
> next dev -p 3000 2>&1 | tee dev.log

sh: 1: next: not found

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to experience the virtual tour.

---

## 📂 Project Architecture



---

## 🤝 Special Offers & Partner Links

- **OpenAdapter**: Get 20% off with invite code  → [https://dashboard.openadapter.in/?ref=BDPBCR3R](https://dashboard.openadapter.in/?ref=BDPBCR3R)
- **Z.ai Coding Plan**: Get 10% off with code  → [https://z.ai/subscribe?ic=ROK78RJKNW](https://z.ai/subscribe?ic=ROK78RJKNW)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
