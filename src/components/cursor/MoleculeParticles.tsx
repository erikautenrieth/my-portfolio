"use client";

import { useEffect, useRef } from "react";

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";
const FUCHSIA = "#f0abfc";
const LIGHT_CYAN = "#67e8f9";
const BOND_COLOR = "rgba(255,255,255,0.35)";

type MoleculeType = "H2O" | "CO2" | "CH4" | "RING";

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
  ctx.shadowBlur = 8;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  if (label) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 7px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y);
  }
}

function drawBond(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  double = false
): void {
  ctx.strokeStyle = BOND_COLOR;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 0;

  if (double) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;

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
  switch (type) {
    case "H2O": {
      const dist = 22;
      const half = (52.5 * Math.PI) / 180;
      const h1x = Math.cos(Math.PI / 2 - half) * dist;
      const h1y = Math.sin(Math.PI / 2 - half) * dist;
      const h2x = -Math.cos(Math.PI / 2 - half) * dist;
      const h2y = Math.sin(Math.PI / 2 - half) * dist;
      drawBond(ctx, 0, 0, h1x, h1y);
      drawBond(ctx, 0, 0, h2x, h2y);
      drawAtom(ctx, h1x, h1y, 4, FUCHSIA, "H");
      drawAtom(ctx, h2x, h2y, 4, FUCHSIA, "H");
      drawAtom(ctx, 0, 0, 7, CYAN, "O");
      break;
    }
    case "CO2": {
      drawBond(ctx, 0, 0, -24, 0, true);
      drawBond(ctx, 0, 0, 24, 0, true);
      drawAtom(ctx, -24, 0, 5, CYAN, "O");
      drawAtom(ctx, 24, 0, 5, CYAN, "O");
      drawAtom(ctx, 0, 0, 7, VIOLET, "C");
      break;
    }
    case "CH4": {
      const dist = 20;
      const dirs = [0, 90, 180, 270].map((deg) => ({
        x: Math.cos((deg * Math.PI) / 180) * dist,
        y: Math.sin((deg * Math.PI) / 180) * dist,
      }));
      dirs.forEach((h) => drawBond(ctx, 0, 0, h.x, h.y));
      dirs.forEach((h) => drawAtom(ctx, h.x, h.y, 3.5, LIGHT_CYAN, "H"));
      drawAtom(ctx, 0, 0, 7, CYAN, "C");
      break;
    }
    case "RING": {
      const R = 16;
      const atomColors = [CYAN, VIOLET, CYAN, VIOLET, CYAN, VIOLET];
      const atoms = Array.from({ length: 6 }, (_, i) => ({
        x: Math.cos((i / 6) * Math.PI * 2 - Math.PI / 2) * R,
        y: Math.sin((i / 6) * Math.PI * 2 - Math.PI / 2) * R,
        color: atomColors[i],
      }));
      for (let i = 0; i < 6; i++) {
        drawBond(ctx, atoms[i].x, atoms[i].y, atoms[(i + 1) % 6].x, atoms[(i + 1) % 6].y, i % 2 === 0);
      }
      atoms.forEach((a) => drawAtom(ctx, a.x, a.y, 4.5, a.color));
      break;
    }
  }
}

const MOLECULE_TYPES: MoleculeType[] = ["H2O", "CO2", "CH4", "RING"];
const MAX_PARTICLES = 8;
const VELOCITY_THRESHOLD = 8;
const SPAWN_THROTTLE_MS = 120;
const MAX_LIFE_MS = 1600;

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
          const count = Math.random() < 0.5 ? 1 : 2;
          const ps = particlesRef.current;

          for (let i = 0; i < count; i++) {
            if (ps.length >= MAX_PARTICLES) ps.shift();
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 2.0;
            ps.push({
              x: e.clientX,
              y: e.clientY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 0.3,
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() < 0.5 ? 1 : -1) * (0.02 + Math.random() * 0.03),
              scale: 0.1,
              alpha: 1,
              life: MAX_LIFE_MS,
              maxLife: MAX_LIFE_MS,
              type: MOLECULE_TYPES[Math.floor(Math.random() * MOLECULE_TYPES.length)],
            });
          }
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
        p.vy += 0.015;
        p.vx *= 0.985;
        p.rotation += p.rotationSpeed;
        p.life -= dt;

        const lifeRatio = Math.max(0, p.life / p.maxLife);
        p.alpha = Math.pow(lifeRatio, 0.7);

        const elapsed = p.maxLife - p.life;
        if (elapsed < 180) {
          p.scale = 0.1 + (elapsed / 180) * 0.9;
        } else if (p.life < 200) {
          p.scale = p.life / 200;
        } else {
          p.scale = 1.0;
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
