"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Instance, Instances } from "@react-three/drei";
import type { MotionValue } from "motion/react";

const TURNS = 3.2;
const HEIGHT = 30;
const N = 200;
const R = 2.1;
const PHASE_OFFSET = 2.2;
const RUNG_EVERY = 6;
const TILT = -0.4;

const BLUE = new THREE.Color("#22d3ee");
const SILVER = new THREE.Color("#0e7490");

const PAIR_COLORS: [string, string][] = [
  ["#22d3ee", "#0e7490"],
  ["#06b6d4", "#0891b2"],
];

function helixPoint(t: number, phase: number, target = new THREE.Vector3()) {
  const angle = t * TURNS * Math.PI * 2 + phase;
  return target.set(Math.cos(angle) * R, (t - 0.5) * HEIGHT, Math.sin(angle) * R);
}

function buildStrandPoints(phase: number) {
  return Array.from({ length: N }, (_, i) => ({
    position: helixPoint(i / (N - 1), phase).toArray() as [number, number, number],
    scale: 1.0,
  }));
}

const STRAND_POINTS: Record<"a" | "b", ReturnType<typeof buildStrandPoints>> = {
  a: buildStrandPoints(0),
  b: buildStrandPoints(PHASE_OFFSET),
};

function Strand({ color, strand }: { color: THREE.Color; strand: "a" | "b" }) {
  const points = STRAND_POINTS[strand];
  return (
    <Instances limit={N}>
      <sphereGeometry args={[0.055, 8, 6]} />
      <meshBasicMaterial color={color} />
      {points.map((p, i) => (
        <Instance key={i} position={p.position} scale={p.scale} />
      ))}
    </Instances>
  );
}

function StrandTube({ color, phase, opacity }: { color: THREE.Color; phase: number; opacity: number }) {
  const geometry = useMemo(() => {
    const points = Array.from({ length: 90 }, (_, i) => helixPoint(i / 89, phase));
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 220, 0.1, 12, false);
  }, [phase]);
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

interface Rung {
  a: THREE.Vector3;
  b: THREE.Vector3;
  mid: THREE.Vector3;
  midA: THREE.Vector3;
  midB: THREE.Vector3;
  halfLength: number;
  seed: number;
  quaternion: THREE.Quaternion;
  colors: [string, string];
}

const UP = new THREE.Vector3(0, 1, 0);

function buildRungs(): Rung[] {
  const rungs: Rung[] = [];
  let pairIndex = 0;
  for (let i = 4; i < N - 4; i += RUNG_EVERY) {
    const t = i / (N - 1);
    const a = helixPoint(t, 0);
    const b = helixPoint(t, PHASE_OFFSET);
    const direction = b.clone().sub(a);
    const mid = a.clone().lerp(b, 0.5);
    rungs.push({
      a,
      b,
      mid,
      midA: a.clone().lerp(mid, 0.5),
      midB: b.clone().lerp(mid, 0.5),
      halfLength: direction.length() * 0.46,
      seed: Math.random() * Math.PI * 2,
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        UP,
        direction.clone().normalize(),
      ),
      colors: PAIR_COLORS[pairIndex++ % PAIR_COLORS.length],
    });
  }
  return rungs;
}

const RUNGS = buildRungs();

const TARGET_YS = [0.5, -1.5, -3.5, -5.5, -7.5, -9.5, -11.5];
const TARGET_RUNGS = TARGET_YS.map((y) => {
  let best = 0;
  let bestDistance = Infinity;
  RUNGS.forEach((rung, i) => {
    const distance = Math.abs(rung.mid.y - y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  });
  return best;
});

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
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const rungMaterialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const [active, setActive] = useState(-1);

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

  const rungs = RUNGS;

  const { size } = useThree();
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const time = state.clock.elapsedTime;
    const g = group.current;
    const progress = reduced ? 0 : scroll.get();

    const targetX = size.width < 768 ? 1.4 : 3.1;
    g.position.x = targetX;

    if (!reduced) g.rotation.y += dt * 0.045;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * -0.1, 2, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, TILT + state.pointer.x * 0.05, 2, dt);

    const viewShift = size.width < 768 ? 0.7 : 2.5;
    const yLocal = THREE.MathUtils.lerp(2.0, -13.0, progress);
    const axisX = g.position.x - Math.sin(TILT) * yLocal;
    const axisY = Math.cos(TILT) * yLocal - 2;
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

    // The "one thing": a phase-shifted wave traveling upward through the nodes
    rungs.forEach((rung, i) => {
      const node = nodeRefs.current[i];
      if (!node) return;

      // traveling wave: moves up the helix, creating "data flowing" impression
      const wave = Math.sin(time * 1.8 - rung.mid.y * 0.22 + rung.seed * 0.3);

      // nodes closer to camera's current Y glow brighter (viewport proximity)
      const distFromView = Math.abs(rung.mid.y - yLocal);
      const proximity = Math.max(0, 1 - distFromView / 5);

      // combined pulse: base + wave + proximity boost
      const pulse = reduced ? 1 : 1 + (0.08 + 0.18 * proximity) * wave;
      node.scale.setScalar(pulse * 0.85);

      // rung material opacity follows the same wave
      for (const half of [0, 1]) {
        const rungMaterial = rungMaterialRefs.current[i * 2 + half];
        if (rungMaterial)
          rungMaterial.opacity = 0.55 + (0.15 + 0.1 * proximity) * wave;
      }
    });
  });

  return (
    <group ref={group} position={[2.5, -2, 0]} rotation={[0, 0, TILT]}>
      <Strand color={BLUE} strand="a" />
      <Strand color={SILVER} strand="b" />
      <StrandTube color={BLUE} phase={0} opacity={0.5} />
      <StrandTube color={SILVER} phase={PHASE_OFFSET} opacity={0.28} />

      {rungs.map((rung, i) => (
        <group key={i}>
          <mesh
            position={rung.midA}
            quaternion={rung.quaternion}
            scale={[1, rung.halfLength, 1]}
          >
            <cylinderGeometry args={[0.055, 0.055, 1, 8]} />
            <meshBasicMaterial
              ref={(el: THREE.MeshBasicMaterial | null) => {
                rungMaterialRefs.current[i * 2] = el;
              }}
              color={rung.colors[0]}
              transparent
              opacity={0.7}
            />
          </mesh>
          <mesh
            position={rung.midB}
            quaternion={rung.quaternion}
            scale={[1, rung.halfLength, 1]}
          >
            <cylinderGeometry args={[0.055, 0.055, 1, 8]} />
            <meshBasicMaterial
              ref={(el: THREE.MeshBasicMaterial | null) => {
                rungMaterialRefs.current[i * 2 + 1] = el;
              }}
              color={rung.colors[1]}
              transparent
              opacity={0.7}
            />
          </mesh>
          <mesh
            ref={(el: THREE.Mesh | null) => {
              nodeRefs.current[i] = el;
            }}
            position={rung.mid}
          >
            <sphereGeometry args={[0.055, 8, 6]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.85} />
          </mesh>
        </group>
      ))}

      {TARGET_RUNGS.map((rungIndex, i) => (
        <Html
          key={i}
          position={RUNGS[rungIndex].mid}
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
