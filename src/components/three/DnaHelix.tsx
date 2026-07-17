"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Instance, Instances } from "@react-three/drei";
import type { MotionValue } from "motion/react";

// Style reference: prototype/neural-dna.html — same parameters, colors, timings.
const TURNS = 2.4;
const HEIGHT = 16;
const N = 110;
const R = 2.1;
const RUNG_EVERY = 5;
const TILT = -0.55;
const TRAVELER_COUNT = 6;
const TRAIL_LENGTH = 5;
const STREAM_COUNT = 160;

const CYAN = new THREE.Color("#22d3ee").multiplyScalar(0.8);
const VIOLET = new THREE.Color("#a78bfa").multiplyScalar(0.8);

function helixPoint(t: number, phase: number, target = new THREE.Vector3()) {
  const angle = t * TURNS * Math.PI * 2 + phase;
  return target.set(Math.cos(angle) * R, (t - 0.5) * HEIGHT, Math.sin(angle) * R);
}

// Static random geometry is generated once at module load (client-only file),
// not during render — keeps render functions pure.
function buildStrandPoints(phase: number) {
  return Array.from({ length: N }, (_, i) => ({
    position: helixPoint(i / (N - 1), phase).toArray() as [number, number, number],
    scale: 0.75 + 0.5 * Math.random(),
  }));
}

const STRAND_POINTS: Record<"a" | "b", ReturnType<typeof buildStrandPoints>> = {
  a: buildStrandPoints(0),
  b: buildStrandPoints(Math.PI),
};

function Strand({ color, strand }: { color: THREE.Color; strand: "a" | "b" }) {
  const points = STRAND_POINTS[strand];
  return (
    <Instances limit={N}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshBasicMaterial color={color} />
      {points.map((p, i) => (
        <Instance key={i} position={p.position} scale={p.scale} />
      ))}
    </Instances>
  );
}

// Continuous holographic tube along each strand (soft core + wireframe ribs).
function StrandTube({ color, phase }: { color: THREE.Color; phase: number }) {
  const geometry = useMemo(() => {
    const points = Array.from({ length: 80 }, (_, i) => helixPoint(i / 79, phase));
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 180, 0.08, 10, false);
  }, [phase]);
  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </group>
  );
}

interface Rung {
  a: THREE.Vector3;
  b: THREE.Vector3;
  mid: THREE.Vector3;
  seed: number;
  quaternion: THREE.Quaternion;
  length: number;
}

const UP = new THREE.Vector3(0, 1, 0);

function buildRungs(): Rung[] {
  const rungs: Rung[] = [];
  for (let i = 4; i < N - 4; i += RUNG_EVERY) {
    const t = i / (N - 1);
    const a = helixPoint(t, 0);
    const b = helixPoint(t, Math.PI);
    const direction = b.clone().sub(a);
    rungs.push({
      a,
      b,
      mid: a.clone().lerp(b, 0.5),
      seed: Math.random() * Math.PI * 2,
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        UP,
        direction.clone().normalize(),
      ),
      length: direction.length(),
    });
  }
  return rungs;
}

const RUNGS = buildRungs();

function makeHaloTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

// Client-only module (dynamic import, ssr: false) — guard keeps it robust.
const HALO_TEXTURE = typeof document !== "undefined" ? makeHaloTexture() : null;

const TRAVELERS = Array.from({ length: TRAVELER_COUNT }, (_, i) => ({
  t: Math.random(),
  speed: 0.05 + Math.random() * 0.04,
  phase: i % 2 ? Math.PI : 0,
  history: [] as THREE.Vector3[],
}));

function buildStreamPositions() {
  const positions = new Float32Array(STREAM_COUNT * 3);
  for (let i = 0; i < STREAM_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.22;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * HEIGHT;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return positions;
}

const STREAM_POSITIONS = buildStreamPositions();

export interface DnaAnnotation {
  label: string;
}

export function NeuralDna({
  reduced,
  scroll,
  annotations,
}: {
  reduced: boolean;
  scroll: MotionValue<number>;
  annotations: DnaAnnotation[];
}) {
  const group = useRef<THREE.Group>(null!);
  const scanRing = useRef<THREE.Mesh>(null!);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const rungMaterialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(
    () =>
      scroll.on("change", (progress) => {
        // 8 sections total; annotation i belongs to section i+1 (hero has none)
        setActive(Math.round(progress * 7) - 1);
      }),
    [scroll],
  );
  const travelerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const trailRefs = useRef<(THREE.Mesh | null)[]>([]);
  const firingRefs = useRef<(THREE.Mesh | null)[]>([]);
  const streamRef = useRef<THREE.Points>(null!);

  const rungs = RUNGS;
  const travelers = TRAVELERS;

  const firings = useRef([
    { t: 1.1, rung: 0 },
    { t: 1.1, rung: 0 },
  ]);

  const { size } = useThree();
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const time = state.clock.elapsedTime;
    const g = group.current;
    const progress = reduced ? 0 : scroll.get();

    // responsive: pull helix toward center on narrow screens
    const targetX = size.width < 768 ? 1.2 : 2.4;
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 2, dt);

    // calm rotation + pointer parallax (state.pointer is normalized -1..1)
    if (!reduced) g.rotation.y += dt * (0.1 + progress * 0.08);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * -0.1, 2, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, TILT + state.pointer.x * 0.05, 2, dt);

    // scroll-driven camera: track the tilted helix axis from top to bottom,
    // keeping the active annotation in frame
    const yLocal = THREE.MathUtils.lerp(3.0, -8.2, progress);
    const axisX = g.position.x - Math.sin(TILT) * yLocal;
    const axisY = Math.cos(TILT) * yLocal;
    const breatheX = reduced ? 0 : Math.sin(time * 0.15) * 0.35;
    const breatheY = reduced ? 0 : Math.sin(time * 0.2) * 0.25;
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      axisX + 0.4 + breatheX,
      2.5,
      dt,
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      axisY + 0.2 + breatheY,
      2.5,
      dt,
    );
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 12.2, 2.5, dt);
    lookTarget.set(axisX, axisY, 0);
    state.camera.lookAt(lookTarget);

    // scan ring sweep
    const sweep = reduced ? 0.5 : (time * 0.1) % 1;
    scanRing.current.position.y = -HEIGHT / 2 + sweep * HEIGHT;
    (scanRing.current.material as THREE.MeshBasicMaterial).opacity =
      0.12 + 0.45 * Math.sin(Math.PI * sweep);

    // synapse nodes: pulse + flash when scan ring passes
    rungs.forEach((rung, i) => {
      const node = nodeRefs.current[i];
      if (!node) return;
      const flash = Math.max(0, 1 - Math.abs(rung.mid.y - scanRing.current.position.y) / 0.7);
      const pulse = reduced ? 1 : 1 + 0.45 * Math.sin(time * 2.2 + rung.seed) + flash * 1.3;
      node.scale.setScalar(pulse * 0.9);
      const rungMaterial = rungMaterialRefs.current[i];
      if (rungMaterial)
        rungMaterial.opacity = 0.3 + 0.12 * Math.sin(time * 2.2 + rung.seed) + flash * 0.45;
    });

    // travelling signals with trails
    if (!reduced) {
      travelers.forEach((traveler, i) => {
        traveler.t = (traveler.t + traveler.speed * dt) % 1;
        const head = travelerRefs.current[i];
        if (!head) return;
        helixPoint(traveler.t, traveler.phase, head.position);
        traveler.history.unshift(head.position.clone());
        if (traveler.history.length > 16) traveler.history.pop();
        for (let j = 0; j < TRAIL_LENGTH; j++) {
          const trail = trailRefs.current[i * TRAIL_LENGTH + j];
          const historyPoint =
            traveler.history[Math.min((j + 1) * 3, traveler.history.length - 1)];
          if (trail && historyPoint) trail.position.copy(historyPoint);
        }
      });

      // synapse firings (pool of 2)
      firings.current.forEach((firing, i) => {
        const mesh = firingRefs.current[i];
        if (!mesh) return;
        if (firing.t > 1) {
          mesh.visible = false;
          if (Math.random() < 0.015) {
            firing.t = 0;
            firing.rung = Math.floor(Math.random() * rungs.length);
          }
          return;
        }
        firing.t += dt * 1.6;
        mesh.visible = true;
        const rung = rungs[firing.rung];
        mesh.position.lerpVectors(rung.a, rung.b, Math.min(firing.t, 1));
      });

      // core data stream flowing upwards
      const positionAttribute = streamRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      for (let i = 0; i < STREAM_COUNT; i++) {
        let y = positionAttribute.getY(i) + dt * 2.2;
        if (y > HEIGHT / 2) y = -HEIGHT / 2;
        positionAttribute.setY(i, y);
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <group ref={group} position={[2.4, 0, 0]} rotation={[0, 0, TILT]}>
      <Strand color={CYAN} strand="a" />
      <Strand color={VIOLET} strand="b" />
      <StrandTube color={CYAN} phase={0} />
      <StrandTube color={VIOLET} phase={Math.PI} />

      {rungs.map((rung, i) => (
        <group key={i}>
          <mesh position={rung.mid} quaternion={rung.quaternion} scale={[1, rung.length, 1]}>
            <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
            <meshBasicMaterial
              ref={(el: THREE.MeshBasicMaterial | null) => {
                rungMaterialRefs.current[i] = el;
              }}
              color="#38bdf8"
              transparent
              opacity={0.35}
            />
          </mesh>
          <mesh
            ref={(el: THREE.Mesh | null) => {
              nodeRefs.current[i] = el;
            }}
            position={rung.mid}
          >
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshBasicMaterial color="#e0f7ff" />
          </mesh>
        </group>
      ))}

      {annotations.map((annotation, i) => (
        <Html
          key={i}
          position={[0.3, 1.4 - i * 1.6, 0]}
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className={`flex items-center whitespace-nowrap font-mono text-[11px] tracking-[0.25em] text-cyan-300 transition-all duration-700 ${
              active === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
            }`}
          >
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
              <path
                d="M1 8 V1 H8 M18 1 H25 V8 M25 18 V25 H18 M8 25 H1 V18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span className="block h-px w-14 bg-linear-to-r from-cyan-300/80 to-cyan-300/20" />
            <span className="border border-cyan-300/30 bg-slate-950/70 px-3 py-1.5 backdrop-blur-sm">
              <b className="mr-2 font-normal text-cyan-400">
                SEQ.{String(i + 1).padStart(2, "0")}
              </b>
              <span className="uppercase text-slate-200">{annotation.label}</span>
            </span>
          </div>
        </Html>
      ))}

      {travelers.map((_, i) => (
        <group key={i}>
          <mesh
            ref={(el: THREE.Mesh | null) => {
              travelerRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.085, 12, 12]} />
            <meshBasicMaterial color="#f0fdff" />
          </mesh>
          {Array.from({ length: TRAIL_LENGTH }, (_, j) => (
            <mesh
              key={j}
              ref={(el: THREE.Mesh | null) => {
                trailRefs.current[i * TRAIL_LENGTH + j] = el;
              }}
              scale={0.8 - j * 0.13}
            >
              <sphereGeometry args={[0.085, 12, 12]} />
              <meshBasicMaterial color="#a5f3fc" transparent opacity={0.4 - j * 0.07} />
            </mesh>
          ))}
        </group>
      ))}

      {[0, 1].map((i) => (
        <mesh
          key={i}
          ref={(el: THREE.Mesh | null) => {
            firingRefs.current[i] = el;
          }}
          visible={false}
        >
          <sphereGeometry args={[0.085, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      <mesh ref={scanRing} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R + 0.55, 0.012, 8, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>

      <points ref={streamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[STREAM_POSITIONS, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#7dd3fc"
          size={0.06}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <sprite position={[0, 0, -3]} scale={18}>
        <spriteMaterial
          map={HALO_TEXTURE}
          color="#0e7490"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite position={[1.5, -2, -4]} scale={12}>
        <spriteMaterial
          map={HALO_TEXTURE}
          color="#6d28d9"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}
