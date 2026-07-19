"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { MotionValue } from "motion/react";

const TURNS = 3.2;
const HEIGHT = 38;
const R = 2.1;
const PHASE_OFFSET = 2.2;
const TILT = -0.4;

const STRAND_COUNT = 1400;
const RUNG_PARTICLE_COUNT = 12;
const AMBIENT_COUNT = 1000;

function helixPoint(t: number, phase: number): [number, number, number] {
  const angle = t * TURNS * Math.PI * 2 + phase;
  return [Math.cos(angle) * R, (t - 0.5) * HEIGHT, Math.sin(angle) * R];
}

function buildParticleData() {
  const helixPositions: number[] = [];
  const cloudPositions: number[] = [];
  const sizes: number[] = [];
  const colorMix: number[] = [];

  // Strand A particles
  for (let i = 0; i < STRAND_COUNT; i++) {
    const t = i / (STRAND_COUNT - 1);
    const [x, y, z] = helixPoint(t, 0);
    helixPositions.push(x, y, z);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 8;
    cloudPositions.push(
      Math.sin(phi) * Math.cos(theta) * r,
      (Math.random() - 0.5) * HEIGHT * 1.2,
      Math.sin(phi) * Math.sin(theta) * r,
    );
    sizes.push(0.8 + Math.random() * 0.6);
    colorMix.push(0.0);
  }

  // Strand B particles
  for (let i = 0; i < STRAND_COUNT; i++) {
    const t = i / (STRAND_COUNT - 1);
    const [x, y, z] = helixPoint(t, PHASE_OFFSET);
    helixPositions.push(x, y, z);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 8;
    cloudPositions.push(
      Math.sin(phi) * Math.cos(theta) * r,
      (Math.random() - 0.5) * HEIGHT * 1.2,
      Math.sin(phi) * Math.sin(theta) * r,
    );
    sizes.push(0.8 + Math.random() * 0.6);
    colorMix.push(1.0);
  }

  // Rung particles (connecting strands)
  for (let ri = 0; ri < 33; ri++) {
    const t = (ri + 1) / 34;
    const a = helixPoint(t, 0);
    const b = helixPoint(t, PHASE_OFFSET);
    for (let j = 0; j < RUNG_PARTICLE_COUNT; j++) {
      const lerp = j / (RUNG_PARTICLE_COUNT - 1);
      helixPositions.push(
        a[0] + (b[0] - a[0]) * lerp,
        a[1] + (b[1] - a[1]) * lerp,
        a[2] + (b[2] - a[2]) * lerp,
      );
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 7;
      cloudPositions.push(
        Math.sin(phi) * Math.cos(theta) * r,
        (Math.random() - 0.5) * HEIGHT * 1.2,
        Math.sin(phi) * Math.sin(theta) * r,
      );
      sizes.push(0.5 + Math.random() * 0.4);
      colorMix.push(lerp);
    }
  }

  // Ambient cloud particles
  for (let i = 0; i < AMBIENT_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 3 + Math.random() * 6;
    const y = (Math.random() - 0.5) * HEIGHT;
    const px = Math.cos(theta) * r;
    const pz = Math.sin(theta) * r;
    helixPositions.push(px * 0.7, y, pz * 0.7);
    cloudPositions.push(px, y, pz);
    sizes.push(0.2 + Math.random() * 0.3);
    colorMix.push(0.5);
  }

  return {
    helixPositions: new Float32Array(helixPositions),
    cloudPositions: new Float32Array(cloudPositions),
    sizes: new Float32Array(sizes),
    colorMix: new Float32Array(colorMix),
    count: helixPositions.length / 3,
  };
}

const PARTICLES = buildParticleData();

const TARGET_YS = [1.0, -1.5, -4.0, -6.5, -9.0, -11.5, -14.0];

function computeTargetPositions() {
  return TARGET_YS.map((targetY) => {
    let bestT = 0;
    let bestDist = Infinity;
    for (let ri = 0; ri < 33; ri++) {
      const t = (ri + 1) / 34;
      const y = (t - 0.5) * HEIGHT;
      const dist = Math.abs(y - targetY);
      if (dist < bestDist) {
        bestDist = dist;
        bestT = t;
      }
    }
    const a = helixPoint(bestT, 0);
    const b = helixPoint(bestT, PHASE_OFFSET);
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2] as [number, number, number];
  });
}

const TARGET_POSITIONS = computeTargetPositions();

const vertexShader = /* glsl */ `
  attribute vec3 aHelixPosition;
  attribute vec3 aCloudPosition;
  attribute float aSize;
  attribute float aColorMix;

  uniform float uProgress;
  uniform float uTime;

  varying float vColorMix;
  varying float vAlpha;

  void main() {
    vec3 pos = mix(aCloudPosition, aHelixPosition, uProgress);

    // Subtle drift when not fully formed
    float drift = (1.0 - uProgress) * 0.5;
    pos.x += sin(uTime * 0.4 + aCloudPosition.y * 0.1) * drift;
    pos.z += cos(uTime * 0.3 + aCloudPosition.x * 0.1) * drift;

    // Subtle breathing when formed
    float breath = uProgress * sin(uTime * 1.2 + aHelixPosition.y * 0.25) * 0.08;
    pos.x += breath * (aHelixPosition.x / ${R.toFixed(1)});
    pos.z += breath * (aHelixPosition.z / ${R.toFixed(1)});

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (180.0 / -mvPosition.z);

    vColorMix = aColorMix;
    vAlpha = smoothstep(0.0, 0.15, uProgress) * (0.7 + 0.3 * uProgress);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vColorMix;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float strength = 1.0 - dist * 2.0;
    strength = pow(strength, 2.0);

    vec3 color = mix(uColorA, uColorB, vColorMix);
    color *= 1.6;

    gl_FragColor = vec4(color, strength * vAlpha);
  }
`;

const SECTION_IDS = [
  "hero",
  "about",
  "projects",
  "experience",
  "skills",
  "education",
  "publications",
  "contact",
];

export function NeuralDna({
  reduced,
  scroll,
}: {
  reduced: boolean;
  scroll: MotionValue<number>;
}) {
  const group = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const [active, setActive] = useState(-1);
  const { size } = useThree();
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActive(SECTION_IDS.indexOf((entry.target as HTMLElement).id) - 1);
        });
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#22d3ee") },
      uColorB: { value: new THREE.Color("#0e7490") },
    }),
    [],
  );

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const time = state.clock.elapsedTime;
    const g = group.current;
    const progress = reduced ? 0 : scroll.get();

    // Update shader uniforms
    if (materialRef.current) {
      const morphTarget = reduced ? 1 : Math.min(progress / 0.15, 1.0);
      materialRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
        materialRef.current.uniforms.uProgress.value,
        morphTarget,
        3.0,
        dt,
      );
      materialRef.current.uniforms.uTime.value = time;
    }

    // Camera and group positioning logic
    const targetX = size.width < 768 ? 1.4 : 3.1;
    g.position.x = targetX;

    if (!reduced) g.rotation.y += dt * 0.045;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * -0.1, 2, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, TILT + state.pointer.x * 0.05, 2, dt);

    const viewShift = size.width < 768 ? 0.7 : 2.5;
    const yLocal = THREE.MathUtils.lerp(0.0, -16.0, progress);
    const axisX = g.position.x - Math.sin(TILT) * yLocal;
    const axisY = Math.cos(TILT) * yLocal - 4;
    const breatheX = reduced ? 0 : Math.sin(time * 0.15) * 0.35;
    const breatheY = reduced ? 0 : Math.sin(time * 0.2) * 0.25;
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      axisX - viewShift + 0.4 + breatheX,
      2.5,
      dt,
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      axisY + 0.2 + breatheY,
      2.5,
      dt,
    );
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      13.5,
      2.5,
      dt,
    );
    lookTarget.set(axisX - viewShift, axisY, 0);
    state.camera.lookAt(lookTarget);
  });

  return (
    <group ref={group} position={[2.5, -4, 0]} rotation={[0, 0, TILT]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[PARTICLES.helixPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-aHelixPosition"
            args={[PARTICLES.helixPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-aCloudPosition"
            args={[PARTICLES.cloudPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[PARTICLES.sizes, 1]}
          />
          <bufferAttribute
            attach="attributes-aColorMix"
            args={[PARTICLES.colorMix, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {TARGET_POSITIONS.map((pos, i) => (
        <Html
          key={i}
          position={pos}
          center
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            data-target-index={i}
            className={`target-lock ${active === i ? "target-lock-active" : ""}`}
          >
            <i />
            <i />
            <i />
            <i />
            <span className="absolute left-full top-1/2 h-px w-3.5 bg-sky-300/70" />
            <span className="absolute left-[calc(100%+18px)] top-1/2 -translate-y-1/2 whitespace-nowrap border border-sky-300/30 bg-slate-950/75 px-2.5 py-1 font-mono text-[11px] tracking-[0.3em] text-sky-300 backdrop-blur-sm">
              SEQ.{String(i + 1).padStart(2, "0")}
            </span>
          </div>
        </Html>
      ))}
    </group>
  );
}
