"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useReducedMotion } from "motion/react";
import { useScroll } from "motion/react";
import { NeuralDna } from "./DnaHelix";
import { ParticleField } from "./ParticleField";

export default function Scene() {
  const reduced = useReducedMotion();
  const [dpr, setDpr] = useState(1.5);
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <Canvas camera={{ position: [0, 0, 13], fov: 45 }} dpr={dpr}>
        <color attach="background" args={["#020617"]} />
        <fogExp2 attach="fog" args={["#020617", 0.035]} />
        <PerformanceMonitor
          onDecline={() => setDpr(1.5)}
          onIncline={() => setDpr(2)}
        >
          <NeuralDna reduced={!!reduced} scroll={scrollYProgress} />
          <ParticleField />
          <EffectComposer>
            <Bloom intensity={0.4} luminanceThreshold={0.6} mipmapBlur radius={0.35} />
          </EffectComposer>
        </PerformanceMonitor>
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
