"use client";

import { useEffect, useRef } from "react";

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
}

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";
const MAX_LIFE = 850;
const MAX_PARTICLES = 10;
const SPAWN_THROTTLE_MS = 55;
const SPAWN_MIN_DELTA = 2;

function drawDnaFragment(ctx: CanvasRenderingContext2D, alpha: number): void {
  const amp = 5;
  const numPoints = 9;
  const totalWidth = 24;
  const xStart = -12;

  const pointsA: { x: number; y: number }[] = [];
  const pointsB: { x: number; y: number }[] = [];

  for (let i = 0; i < numPoints; i++) {
    const t = (i / (numPoints - 1)) * Math.PI * 2;
    const px = xStart + (i / (numPoints - 1)) * totalWidth;
    pointsA.push({ x: px, y: Math.sin(t) * amp });
    pointsB.push({ x: px, y: Math.sin(t + Math.PI) * amp });
  }

  // Base-pair rungs
  ctx.save();
  ctx.lineWidth = 0.6;
  ctx.shadowBlur = 0;
  for (let r = 0; r < 7; r++) {
    const idx = r * ((numPoints - 1) / 6);
    const i = Math.floor(idx);
    const frac = idx - i;
    const nextI = Math.min(i + 1, numPoints - 1);
    const ax = pointsA[i].x + (pointsA[nextI].x - pointsA[i].x) * frac;
    const ay = pointsA[i].y + (pointsA[nextI].y - pointsA[i].y) * frac;
    const bx = pointsB[i].x + (pointsB[nextI].x - pointsB[i].x) * frac;
    const by = pointsB[i].y + (pointsB[nextI].y - pointsB[i].y) * frac;
    // gradient-like color on rungs: alternate cyan/violet tint
    ctx.strokeStyle = r % 2 === 0 ? "rgba(34,211,238,0.45)" : "rgba(167,139,250,0.45)";
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
  ctx.restore();

  // Strand A — cyan (front strand, slightly brighter)
  ctx.save();
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 1.2;
  ctx.shadowBlur = 8;
  ctx.shadowColor = CYAN;
  ctx.beginPath();
  ctx.moveTo(pointsA[0].x, pointsA[0].y);
  for (let i = 0; i < numPoints - 1; i++) {
    const cpx = (pointsA[i].x + pointsA[i + 1].x) / 2;
    const cpy = (pointsA[i].y + pointsA[i + 1].y) / 2;
    ctx.quadraticCurveTo(pointsA[i].x, pointsA[i].y, cpx, cpy);
  }
  ctx.lineTo(pointsA[numPoints - 1].x, pointsA[numPoints - 1].y);
  ctx.stroke();
  ctx.restore();

  // Strand B — violet (back strand, slightly dimmer = depth cue)
  ctx.save();
  ctx.strokeStyle = VIOLET;
  ctx.lineWidth = 1.0;
  ctx.shadowBlur = 6;
  ctx.shadowColor = VIOLET;
  ctx.globalAlpha = alpha * 0.8;
  ctx.beginPath();
  ctx.moveTo(pointsB[0].x, pointsB[0].y);
  for (let i = 0; i < numPoints - 1; i++) {
    const cpx = (pointsB[i].x + pointsB[i + 1].x) / 2;
    const cpy = (pointsB[i].y + pointsB[i + 1].y) / 2;
    ctx.quadraticCurveTo(pointsB[i].x, pointsB[i].y, cpx, cpy);
  }
  ctx.lineTo(pointsB[numPoints - 1].x, pointsB[numPoints - 1].y);
  ctx.stroke();
  ctx.restore();

  // Nucleotide nodes — strand A with phosphate highlight
  ctx.save();
  ctx.shadowColor = CYAN;
  for (const pt of pointsA) {
    // outer glow ring
    ctx.shadowBlur = 7;
    ctx.fillStyle = "rgba(34,211,238,0.25)";
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
    ctx.fill();
    // core
    ctx.shadowBlur = 5;
    ctx.fillStyle = CYAN;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
    // specular highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.arc(pt.x - 0.5, pt.y - 0.5, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Nucleotide nodes — strand B
  ctx.save();
  ctx.shadowColor = VIOLET;
  ctx.globalAlpha = alpha * 0.85;
  for (const pt of pointsB) {
    ctx.shadowBlur = 7;
    ctx.fillStyle = "rgba(167,139,250,0.22)";
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 5;
    ctx.fillStyle = VIOLET;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.arc(pt.x - 0.5, pt.y - 0.5, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function DnaTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(0);
  const lastSpawnPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      const now = performance.now();
      const dx = e.clientX - lastSpawnPosRef.current.x;
      const dy = e.clientY - lastSpawnPosRef.current.y;

      if (
        now - lastSpawnTimeRef.current >= SPAWN_THROTTLE_MS &&
        Math.sqrt(dx * dx + dy * dy) >= SPAWN_MIN_DELTA
      ) {
        lastSpawnTimeRef.current = now;
        lastSpawnPosRef.current = { x: e.clientX, y: e.clientY };

        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          // very slow drift — stays close to cursor
          vx: (Math.random() - 0.5) * 0.25,
          vy: -0.1 - Math.random() * 0.2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.025,
          scale: 0.1,
          alpha: 1,
          life: MAX_LIFE,
          maxLife: MAX_LIFE,
        });

        if (particlesRef.current.length > MAX_PARTICLES) {
          particlesRef.current.splice(0, particlesRef.current.length - MAX_PARTICLES);
        }
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let lastTime = 0;

    function loop(now: number) {
      rafRef.current = requestAnimationFrame(loop);
      const deltaMs = lastTime === 0 ? 16 : Math.min(now - lastTime, 50);
      lastTime = now;

      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= deltaMs;
        if (p.life <= 0) { particles.splice(i, 1); continue; }

        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.995;
        p.rotation += p.rotationSpeed;
        p.alpha = p.life / p.maxLife;

        const elapsed = p.maxLife - p.life;
        // pop in fast (120ms), hold at 0.5 scale (feels small, close to cursor)
        p.scale = elapsed < 120 ? 0.1 + (elapsed / 120) * 0.4 : 0.5;

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rotation);
        ctx!.scale(p.scale, p.scale);
        ctx!.globalAlpha = p.alpha;
        drawDnaFragment(ctx!, p.alpha);
        ctx!.restore();
      }
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      particlesRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99 }}
      aria-hidden
    />
  );
}
