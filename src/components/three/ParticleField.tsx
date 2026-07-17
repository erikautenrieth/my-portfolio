"use client";

import { useMemo } from "react";
import * as THREE from "three";

const STAR_COUNT = 350;

export function ParticleField() {
  const positions = useMemo(() => {
    const array = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < array.length; i++) array[i] = (Math.random() - 0.5) * 55;
    return array;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#94a3b8"
        size={0.045}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
}
