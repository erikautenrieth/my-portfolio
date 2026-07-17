"use client";

import { useEffect, useRef } from "react";

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";
const FUCHSIA = "#f0abfc";
const LIGHT_CYAN = "#67e8f9";
const ORANGE = "#fb923c";
const BOND_COLOR = "rgba(255,255,255,0.4)";

type MoleculeType = "H2O" | "CO2" | "CH4" | "RING" | "SYNAPSE";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  alpha: number;
  life: number;
  maxLife: number;
  type: MoleculeType;
}

function drawAtom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  label?: string
): void {
  // outer glow halo
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.fillStyle = color + "30"; // ~19% opacity
  ctx.beginPath();
  ctx.arc(x, y, r * 1.6, 0, Math.PI * 2);
  ctx.fill();

  // atom body
  ctx.shadowBlur = 8;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // specular highlight (3D sphere effect)
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath();
  ctx.arc(x - r * 0.28, y - r * 0.3, r * 0.38, 0, Math.PI * 2);
  ctx.fill();

  if (label) {
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.font = `bold ${Math.max(5, r * 1.1)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + 0.5);
  }
}

function drawLonePair(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color: string
): void {
  const d = 3.5;
  const ox = Math.cos(angle) * d;
  const oy = Math.sin(angle) * d;
  ctx.shadowBlur = 4;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + ox - 1.5, y + oy, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + ox + 1.5, y + oy, 1, 0, Math.PI * 2);
  ctx.fill();
}

function drawBond(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  double = false,
  color = BOND_COLOR
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.shadowBlur = 3;
  ctx.shadowColor = color;

  if (double) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = (-dy / len) * 1.2;
    const ny = (dx / len) * 1.2;
    ctx.beginPath();
    ctx.moveTo(x1 + nx, y1 + ny);
    ctx.lineTo(x2 + nx, y2 + ny);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1 - nx, y1 - ny);
    ctx.lineTo(x2 - nx, y2 - ny);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function drawMolecule(ctx: CanvasRenderingContext2D, type: MoleculeType): void {
  ctx.shadowBlur = 0;

  switch (type) {
    case "H2O": {
      // H-O-H, 104.5° angle, compact
      const dist = 13;
      const half = (52.25 * Math.PI) / 180;
      const h1x = Math.cos(Math.PI / 2 - half) * dist;
      const h1y = Math.sin(Math.PI / 2 - half) * dist;
      const h2x = -Math.cos(Math.PI / 2 - half) * dist;
      const h2y = Math.sin(Math.PI / 2 - half) * dist;
      drawBond(ctx, 0, 0, h1x, h1y, false, "rgba(34,211,238,0.5)");
      drawBond(ctx, 0, 0, h2x, h2y, false, "rgba(34,211,238,0.5)");
      drawAtom(ctx, h1x, h1y, 2.8, FUCHSIA, "H");
      drawAtom(ctx, h2x, h2y, 2.8, FUCHSIA, "H");
      drawAtom(ctx, 0, 0, 4.5, CYAN, "O");
      // lone pairs on O (top)
      drawLonePair(ctx, 0, 0, -Math.PI / 2 - 0.3, CYAN);
      drawLonePair(ctx, 0, 0, -Math.PI / 2 + 0.3, CYAN);
      break;
    }

    case "CO2": {
      // O=C=O linear
      drawBond(ctx, 0, 0, -15, 0, true, "rgba(167,139,250,0.55)");
      drawBond(ctx, 0, 0, 15, 0, true, "rgba(167,139,250,0.55)");
      drawAtom(ctx, -15, 0, 3.5, CYAN, "O");
      drawAtom(ctx, 15, 0, 3.5, CYAN, "O");
      drawAtom(ctx, 0, 0, 4.5, VIOLET, "C");
      // lone pairs on oxygens
      drawLonePair(ctx, -15, 0, -Math.PI / 2, CYAN);
      drawLonePair(ctx, -15, 0, Math.PI / 2, CYAN);
      drawLonePair(ctx, 15, 0, -Math.PI / 2, CYAN);
      drawLonePair(ctx, 15, 0, Math.PI / 2, CYAN);
      break;
    }

    case "CH4": {
      // tetrahedral projection
      const dist = 12;
      const dirs = [0, 90, 180, 270].map((deg) => ({
        x: Math.cos((deg * Math.PI) / 180) * dist,
        y: Math.sin((deg * Math.PI) / 180) * dist,
      }));
      dirs.forEach((h) => drawBond(ctx, 0, 0, h.x, h.y, false, "rgba(103,232,249,0.5)"));
      dirs.forEach((h) => drawAtom(ctx, h.x, h.y, 2.5, LIGHT_CYAN, "H"));
      drawAtom(ctx, 0, 0, 4.5, CYAN, "C");
      break;
    }

    case "RING": {
      // Benzene — hexagon with aromatic circle inside
      const R = 11;
      const atomColors = [CYAN, VIOLET, CYAN, VIOLET, CYAN, VIOLET];
      const atoms = Array.from({ length: 6 }, (_, i) => ({
        x: Math.cos((i / 6) * Math.PI * 2 - Math.PI / 2) * R,
        y: Math.sin((i / 6) * Math.PI * 2 - Math.PI / 2) * R,
        color: atomColors[i],
      }));

      // aromatic inner circle (dashed approximation via segments)
      ctx.save();
      ctx.strokeStyle = "rgba(167,139,250,0.35)";
      ctx.lineWidth = 0.8;
      ctx.shadowBlur = 4;
      ctx.shadowColor = VIOLET;
      ctx.setLineDash([2, 2.5]);
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.58, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // bonds
      for (let i = 0; i < 6; i++) {
        drawBond(ctx, atoms[i].x, atoms[i].y, atoms[(i + 1) % 6].x, atoms[(i + 1) % 6].y, false, "rgba(255,255,255,0.35)");
      }
      atoms.forEach((a) => drawAtom(ctx, a.x, a.y, 3.2, a.color));
      break;
    }

    case "SYNAPSE": {
      // Neural node: central body + 3 dendrite arms with terminal buttons
      const armLen = 14;
      const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

      angles.forEach((angle, i) => {
        const ex = Math.cos(angle) * armLen;
        const ey = Math.sin(angle) * armLen;
        // axon
        ctx.save();
        ctx.strokeStyle = i === 0 ? "rgba(34,211,238,0.6)" : i === 1 ? "rgba(167,139,250,0.6)" : "rgba(251,146,60,0.6)";
        ctx.lineWidth = 1.0;
        ctx.shadowBlur = 5;
        ctx.shadowColor = i === 0 ? CYAN : i === 1 ? VIOLET : ORANGE;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // slight curve for organic look
        ctx.quadraticCurveTo(
          Math.cos(angle + 0.4) * armLen * 0.55,
          Math.sin(angle + 0.4) * armLen * 0.55,
          ex, ey
        );
        ctx.stroke();
        ctx.restore();
        // terminal button
        drawAtom(ctx, ex, ey, 2.2, i === 0 ? CYAN : i === 1 ? VIOLET : ORANGE);
      });

      // central soma (cell body)
      drawAtom(ctx, 0, 0, 5, CYAN);
      break;
    }
  }
}

const MOLECULE_TYPES: MoleculeType[] = ["H2O", "CO2", "CH4", "RING", "SYNAPSE"];
const MAX_PARTICLES = 7;
const VELOCITY_THRESHOLD = 5;
const SPAWN_THROTTLE_MS = 110;
const MAX_LIFE_MS = 950;

export function MoleculeParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const prevPosRef = useRef<{ x: number; y: number } | null>(null);
  const reducedMotionRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const onMqChange = (e: MediaQueryListEvent) => { reducedMotionRef.current = e.matches; };
    mq.addEventListener("change", onMqChange);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    function onPointerMove(e: PointerEvent) {
      if (reducedMotionRef.current) return;
      const now = performance.now();
      const prev = prevPosRef.current;

      if (prev !== null) {
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;
        const velocity = Math.sqrt(dx * dx + dy * dy);

        if (velocity > VELOCITY_THRESHOLD && now - lastSpawnRef.current > SPAWN_THROTTLE_MS) {
          const ps = particlesRef.current;
          if (ps.length >= MAX_PARTICLES) ps.shift();

          // slow drift — stays near cursor
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.3 + Math.random() * 0.5;

          ps.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.15,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() < 0.5 ? 1 : -1) * (0.015 + Math.random() * 0.02),
            scale: 0.05,
            alpha: 1,
            life: MAX_LIFE_MS,
            maxLife: MAX_LIFE_MS,
            type: MOLECULE_TYPES[Math.floor(Math.random() * MOLECULE_TYPES.length)],
          });

          lastSpawnRef.current = now;
        }
      }
      prevPosRef.current = { x: e.clientX, y: e.clientY };
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let lastTime = performance.now();

    function animate(now: number) {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.008;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.life -= dt;

        const lifeRatio = Math.max(0, p.life / p.maxLife);
        p.alpha = Math.pow(lifeRatio, 0.65);

        const elapsed = p.maxLife - p.life;
        if (elapsed < 150) {
          p.scale = 0.05 + (elapsed / 150) * 0.55; // pop to 0.6
        } else if (p.life < 180) {
          p.scale = (p.life / 180) * 0.6;
        } else {
          p.scale = 0.6;
        }

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rotation);
        ctx!.scale(p.scale, p.scale);
        ctx!.globalAlpha = p.alpha;
        drawMolecule(ctx!, p.type);
        ctx!.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      mq.removeEventListener("change", onMqChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 98 }}
      aria-hidden
    />
  );
}
