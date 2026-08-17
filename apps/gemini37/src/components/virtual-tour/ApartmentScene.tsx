'use client'

import * as THREE from 'three'
import { Environment, Lightformer, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ToneMapping, SMAA, BrightnessContrast } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { RoomArchitecture, ROOM } from './Room'
import { LightingPresets } from './LightingPresets'
import {
  Sofa, Armchair, CoffeeTable, TVStand, KitchenIsland, DiningTable, Rug,
  Plant, FloorLamp, WallArt, PendantLight, Bookshelf, SideTable, Fireplace,
} from './Furniture'

export function ApartmentScene() {
  const { width, depth, height } = ROOM

  return (
    <>
      {/* ============== LIGHTING (dynamic presets: golden / day / night) ============== */}
      <LightingPresets />

      {/* ============== ENVIRONMENT (for reflections) ============== */}
      <Environment resolution={128} frames={1}>
        <color attach="background" args={['#0a1530']} />
        <Lightformer
          intensity={3.5}
          form="rect"
          position={[0, 5, -9]}
          scale={[10, 5, 1]}
          color="#ffb060"
        />
        <Lightformer
          intensity={2.0}
          form="rect"
          position={[5, 3, 8]}
          scale={[8, 4, 1]}
          color="#d8e8ff"
        />
        <Lightformer
          intensity={2.5}
          form="ring"
          position={[-6, 4, 0]}
          scale={[3, 3, 1]}
          color="#ffe8d0"
        />
        <Lightformer
          intensity={1.2}
          form="circle"
          position={[0, 8, 0]}
          scale={[12, 12, 1]}
          color="#4060a0"
        />
      </Environment>

      {/* ============== ROOM ============== */}
      <RoomArchitecture />

      {/* ============== FURNITURE — Living Room ============== */}
      <Rug position={[0, 0, 2]} size={[5, 3.5]} />
      <Sofa position={[0, 0, 3.6]} rotation={0} />
      <Armchair position={[-3.4, 0, 2.5]} rotation={0.6} color="#5a4030" />
      <Armchair position={[3.4, 0, 2.5]} rotation={-0.6} color="#5a4030" />
      <CoffeeTable position={[0, 0, 2.4]} />
      <TVStand position={[0, 0, -depth / 2 + 0.4]} rotation={0} />
      <SideTable position={[-1.9, 0, 3.8]} />
      <SideTable position={[1.9, 0, 3.8]} />
      <FloorLamp position={[-4.2, 0, 1.5]} color="#fff0d0" />
      <FloorLamp position={[4.2, 0, 1.5]} color="#fff0d0" />

      {/* Wall art on east wall */}
      <WallArt position={[width / 2 - 0.1, 2.0, 2.5]} rotation={-Math.PI / 2} seed={0} size={[1.4, 1.0]} />
      <WallArt position={[width / 2 - 0.1, 2.0, -1.5]} rotation={-Math.PI / 2} seed={1} size={[0.9, 1.3]} />
      {/* Wall art on south wall (front) */}
      <WallArt position={[-5, 1.9, depth / 2 - 0.1]} rotation={Math.PI} seed={2} size={[1.0, 1.4]} />
      {/* Bookshelf against south wall */}
      <Bookshelf position={[5.5, 0, depth / 2 - 0.3]} rotation={Math.PI} />

      {/* ============== FURNITURE — Kitchen Area ============== */}
      <KitchenIsland position={[0, 0, -3.5]} />
      <PendantLight position={[-0.8, height - 1.0, -3.5]} />
      <PendantLight position={[0.8, height - 1.0, -3.5]} />
      <DiningTable position={[-5, 0, -3]} />

      {/* ============== FURNITURE — Cozy Corner (fireplace) ============== */}
      <Fireplace position={[-width / 2 + 0.15, 0, -3]} rotation={Math.PI / 2} />

      {/* ============== PLANTS ============== */}
      <Plant position={[-width / 2 + 0.6, 0, 4]} scale={1.2} />
      <Plant position={[width / 2 - 0.6, 0, -5]} scale={1.0} />
      <Plant position={[6, 0, depth / 2 - 0.6]} scale={0.8} />
      <Plant position={[-6, 0, 1]} scale={0.9} />

      {/* ============== GROUND CONTACT SHADOWS ============== */}
      <ContactShadows
        position={[0, 0.01, 0]}
        scale={20}
        far={6}
        blur={2.4}
        opacity={0.45}
        resolution={512}
        color="#1a1410"
      />

      {/* ============== POST-PROCESSING ============== */}
      <EffectComposer multisampling={2} enableNormalPass={false}>
        <Bloom
          intensity={0.35}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.4}
          mipmapBlur
          radius={0.5}
        />
        <BrightnessContrast brightness={0.05} contrast={0.05} />
        <Vignette eskil={false} offset={0.3} darkness={0.25} />
        <SMAA />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} exposure={1.4} />
      </EffectComposer>
    </>
  )
}
