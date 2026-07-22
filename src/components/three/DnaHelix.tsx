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
const AMBIENT_COUNT = 400;

function helixPoint(t: number, phase: number): [number, number, number] {
  const angle = t * TURNS * Math.PI * 2 + phase;
  return [Math.cos(angle) * R, (t - 0.5) * HEIGHT, Math.sin(angle) * R];
}

function buildParticleData() {
  const helixPositions: number[] = [];
  const cloudPositions: number[] = [];
  const sizes: number[] = [];
  const colorMix: number[] = [];
  const randoms: number[] = []; // per-particle seed for shimmer and stagger jitter

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
    randoms.push(Math.random());
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
    randoms.push(Math.random());
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
      randoms.push(Math.random());
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
    randoms.push(Math.random());
  }

  return {
    helixPositions: new Float32Array(helixPositions),
    cloudPositions: new Float32Array(cloudPositions),
    sizes: new Float32Array(sizes),
    colorMix: new Float32Array(colorMix),
    randoms: new Float32Array(randoms),
    count: helixPositions.length / 3,
  };
}

const PARTICLES = buildParticleData();

function helixCenterAt(localY: number): [number, number, number] {
  const t = Math.max(0.03, Math.min(0.97, localY / HEIGHT + 0.5));
  const a = helixPoint(t, 0);
  const b = helixPoint(t, PHASE_OFFSET);
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

const DEFAULT_TARGET_YS = [1.0, -1.5, -4.0, -6.5, -9.0, -11.5, -14.0];
const TARGET_POSITIONS = DEFAULT_TARGET_YS.map(helixCenterAt);

const vertexShader = /* glsl */ `
  attribute vec3 aHelixPosition;
  attribute vec3 aCloudPosition;
  attribute float aSize;
  attribute float aColorMix;
  attribute float aRandom;    // per-particle seed [0,1] — shimmer phase + stagger jitter

  uniform float uProgress;
  uniform float uTime;

  varying float vColorMix;
  varying float vAlpha;
  varying float vDepth;       // normalised camera-space Z for chromatic depth
  varying float vPulse;       // data-packet brightness contribution
  varying float vIsAmbient;   // 1.0 for ambient particles
  varying float vEdgeFade;    // Y-edge softening
  varying float vShimmer;     // per-particle flicker multiplier [0.88, 1.12]

  void main() {
    // ── Staggered morph via aRandom ───────────────────────────────────────
    // Bottom of helix assembles first (tNorm=0), top last (tNorm=1).
    // Each particle gets a small random jitter so they don't snap in unison.
    float tNorm       = (aHelixPosition.y + ${(HEIGHT * 0.5).toFixed(1)}) / ${HEIGHT.toFixed(1)};
    float staggerDelay = tNorm * 0.55 + aRandom * 0.12;
    float localP       = clamp((uProgress - staggerDelay) / 0.33, 0.0, 1.0);
    // Smooth ease-in-out per-particle
    float p = localP * localP * (3.0 - 2.0 * localP);
    float invP = 1.0 - p;

    // ── Per-particle shimmer ──────────────────────────────────────────────
    // aRandom drives an individual rate so particles flicker at different phases.
    vShimmer = 0.88 + 0.24 * sin(uTime * (1.8 + aRandom * 4.2) + aRandom * 6.28318);

    // ── Corkscrew assembly morph ──────────────────────────────────────────
    // Spin particles inward on a tightening helix so they corkscrew into
    // position rather than sliding straight in.

    // Rotation angle decreases to 0 as progress reaches 1
    float corkscrewAngle = invP * 3.14159265 * 2.5
                         * (0.5 + 0.5 * sin(aCloudPosition.y * 0.18 + aColorMix * 1.57));
    float ca = cos(corkscrewAngle);
    float sa = sin(corkscrewAngle);

    // Linear interpolation base
    vec3 pos = mix(aCloudPosition, aHelixPosition, p);

    // Apply rotation in XZ plane around the helix axis (world Y), fading out as p→1
    float rx = pos.x * ca - pos.z * sa;
    float rz = pos.x * sa + pos.z * ca;
    pos.x = mix(rx, pos.x, p);
    pos.z = mix(rz, pos.z, p);

    // Subtle drift on cloud side
    float drift = invP * 0.45;
    pos.x += sin(uTime * 0.38 + aCloudPosition.y * 0.09) * drift;
    pos.z += cos(uTime * 0.29 + aCloudPosition.x * 0.09) * drift;

    // Subtle radial breathing on helix side
    float breath = p * sin(uTime * 1.1 + aHelixPosition.y * 0.22) * 0.07;
    pos.x += breath * (aHelixPosition.x / ${R.toFixed(1)});
    pos.z += breath * (aHelixPosition.z / ${R.toFixed(1)});

    // ── Ambient slow drift (size < ~0.36 are ambient) ────────────────────
    float isAmbient = step(aSize, 0.36);
    pos.x += isAmbient * sin(uTime * 0.11 + aCloudPosition.z * 0.3) * 0.18;
    pos.y += isAmbient * sin(uTime * 0.08 + aCloudPosition.x * 0.25) * 0.10;
    pos.z += isAmbient * cos(uTime * 0.13 + aCloudPosition.y * 0.22) * 0.14;
    vIsAmbient = isAmbient;

    // ── Data-packet pulse ─────────────────────────────────────────────────
    // Two slightly different speeds per strand (aColorMix: 0=A, 1=B, mid=rung)
    // Phase seed from helix Y position so pulse travels up the strand
    float strandSpeed  = 0.9 + aColorMix * 0.35;     // strand B is ~38% faster
    float pulsePhase   = aHelixPosition.y * 0.55 - uTime * strandSpeed * 2.8;
    // Narrow bright packet: raised cosine window ~ 0.15 wide in phase space
    float packet       = max(0.0, cos(pulsePhase) - 0.72) / 0.28;
    packet             = pow(packet, 2.5);            // sharpen
    vPulse             = packet * p;                  // only visible when helix is formed

    // ── Edge fade (top/bottom Y softening) ───────────────────────────────
    float normY  = aHelixPosition.y / (${(HEIGHT * 0.5).toFixed(1)});   // -1 … +1
    vEdgeFade    = smoothstep(1.0, 0.65, abs(normY));                    // fade last 35%

    // ── MVP + point size ──────────────────────────────────────────────────
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position     = projectionMatrix * mvPosition;

    // Size: ambient particles are small; pulse swells strand particles a touch
    float sizeBoost = 1.0 + vPulse * 0.35;
    gl_PointSize    = aSize * sizeBoost * (120.0 / -mvPosition.z);

    // ── Varyings ──────────────────────────────────────────────────────────
    vColorMix = aColorMix;

    // Normalise depth: mvPosition.z is negative; map to 0 (close) … 1 (far)
    vDepth = clamp(-mvPosition.z / 22.0, 0.0, 1.0);

    // Base alpha: ambient is kept very dim; helix fades in with progress
    float baseAlpha = mix(0.06, 0.75, 1.0 - isAmbient);
    vAlpha = baseAlpha * smoothstep(0.0, 0.18, p) * (0.65 + 0.35 * p);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;    // #22d3ee cyan-400
  uniform vec3 uColorB;    // #34d399 emerald-400

  varying float vColorMix;
  varying float vAlpha;
  varying float vDepth;
  varying float vPulse;
  varying float vIsAmbient;
  varying float vEdgeFade;
  varying float vShimmer;

  void main() {
    // ── Diamond / rhombus shape ───────────────────────────────────────────
    // Rotate gl_PointCoord 45° then use Chebyshev (max-norm) distance
    vec2 uv  = gl_PointCoord - vec2(0.5);
    // 45° rotation matrix: [cos45 -sin45 / sin45 cos45] = [√½ -√½ / √½ √½]
    const float INV_SQRT2 = 0.70710678;
    vec2 rot = vec2(
      uv.x * INV_SQRT2 - uv.y * INV_SQRT2,
      uv.x * INV_SQRT2 + uv.y * INV_SQRT2
    );
    // Slight elongation along the "up" direction of the diamond (Y axis)
    rot.y *= 0.72;

    float diamond = max(abs(rot.x), abs(rot.y));
    if (diamond > 0.5) discard;

    // Soft falloff: sharp bright core, wide soft halo
    float core  = 1.0 - smoothstep(0.0, 0.22, diamond);
    float halo  = 1.0 - smoothstep(0.10, 0.50, diamond);
    float shape = core * 0.8 + halo * 0.2;
    shape = pow(shape, 1.6);

    // ── Chromatic depth shift ─────────────────────────────────────────────
    // Close particles → warm cyan-white; far → cooler desaturated blue
    vec3 depthShift = vec3(-0.04, -0.06, 0.12);        // slight blue push at distance
    vec3 baseColor  = mix(uColorA, uColorB, vColorMix);
    baseColor       = baseColor + depthShift * vDepth;

    // ── Data-packet: white-hot burst that rides on top ────────────────────
    // Pulse drives color toward white and sharply boosts alpha
    vec3 pulseColor = mix(baseColor, vec3(1.0), vPulse * 0.85);
    float pulseAlphaBoost = vPulse * 1.4;

    // ── Core halo tint: near-white at centre regardless of strand ─────────
    // Gives the "fiber optic core glow" look
    vec3 coreWhiten = mix(pulseColor, vec3(0.92, 0.98, 1.0), core * 0.35);

    // ── Ambient: flat, barely-there colour ───────────────────────────────
    // Override colour for ambient particles — muted, no pulse contribution
    vec3 ambientColor = mix(uColorA, uColorB, 0.5) * 0.55;
    vec3 finalColor   = mix(coreWhiten, ambientColor, vIsAmbient);

    // ── Alpha assembly ────────────────────────────────────────────────────
    float alpha = shape * vAlpha * vEdgeFade * vShimmer;
    alpha      += shape * pulseAlphaBoost * (1.0 - vIsAmbient);
    alpha       = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, alpha);
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
  const targetRefs = useRef<(THREE.Group | null)[]>([]);
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
      uColorA: { value: new THREE.Color("#22d3ee") }, // cyan-400 — strand A
      uColorB: { value: new THREE.Color("#34d399") }, // emerald-400 — strand B
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
    const yLocal = THREE.MathUtils.lerp(0.0, -12.0, progress);
    const axisX = g.position.x - Math.sin(TILT) * yLocal * 0.3;
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

    const cam = state.camera;
    const inverseMatrix = g.matrixWorld.clone().invert();
    const unprojVec = new THREE.Vector3();

    for (let i = 0; i < targetRefs.current.length; i++) {
      const tg = targetRefs.current[i];
      if (!tg) continue;
      const anchor = document.querySelector<HTMLElement>(
        `[data-heading-anchor="${i}"]`,
      );
      if (!anchor) continue;
      const rect = anchor.getBoundingClientRect();
      const ndcX = 1.0;
      const ndcY = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;
      unprojVec.set(ndcX, ndcY, 0.5).unproject(cam);
      const dir = unprojVec.sub(cam.position).normalize();
      const t = -cam.position.z / dir.z;
      const worldPoint = cam.position.clone().add(dir.multiplyScalar(t));
      worldPoint.applyMatrix4(inverseMatrix);
      const localY = worldPoint.y;
      const snapped = helixCenterAt(localY);
      tg.position.x = THREE.MathUtils.damp(tg.position.x, snapped[0], 4, dt);
      tg.position.y = THREE.MathUtils.damp(tg.position.y, snapped[1], 4, dt);
      tg.position.z = THREE.MathUtils.damp(tg.position.z, snapped[2], 4, dt);
    }
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
          <bufferAttribute
            attach="attributes-aRandom"
            args={[PARTICLES.randoms, 1]}
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
        <group key={i} ref={(el) => { targetRefs.current[i] = el; }} position={pos}>
          <Html
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
        </group>
      ))}
    </group>
  );
}
