"use client";

import { useEffect, useRef } from "react";

const DNA_CHARS = "ATGC";
const HEX_CHARS = "0123456789ABCDEF";
const SPAWN_INTERVAL = 80;
const FADE_DURATION = 550;
const MAX_CHARS = 30;

interface CharParticle {
  x: number;
  y: number;
  char: string;
  alpha: number;
  spawnAlpha: number;
  born: number;
  color: string;
}

export function DnaTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<CharParticle[]>([]);
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + 'px';
      canvas!.style.height = window.innerHeight + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    function getChar(): string {
      if (Math.random() < 0.25) return HEX_CHARS[Math.floor(Math.random() * 16)];
      return DNA_CHARS[Math.floor(Math.random() * 4)];
    }

    function getSpeedAlpha(speed: number): [number, string] {
      const t = Math.min(1, Math.max(0, (speed - 200) / 200));
      const alpha = 0.55 + t * 0.15;
      const r = Math.round(34 + t * (167 - 34));
      const g = Math.round(211 + t * (139 - 211));
      const b = Math.round(238 + t * (250 - 238));
      return [alpha, `rgb(${r},${g},${b})`];
    }

    function startLoop() {
      if (runningRef.current) return;
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(loop);
    }

    function loop() {
      const particles = particlesRef.current;
      const now = performance.now();

      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx!.font = "bold 11px 'Courier New', monospace";
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const elapsed = now - p.born;
        if (elapsed >= FADE_DURATION) {
          particles.splice(i, 1);
          continue;
        }
        p.y += 0.4;
        p.alpha = p.spawnAlpha * (1 - elapsed / FADE_DURATION);
        ctx!.globalAlpha = p.alpha;
        ctx!.fillStyle = p.color;
        ctx!.fillText(p.char, p.x, p.y);
      }

      if (particles.length > 0) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        runningRef.current = false;
      }
    }

    function onPointerMove(e: PointerEvent) {
      const now = performance.now();
      const prev = lastPosRef.current;

      let speed = 0;
      if (prev) {
        const dt = now - prev.time;
        if (dt > 0) {
          const dist = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);
          speed = (dist / dt) * 1000;
        }
      }
      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };

      if (now - lastSpawnRef.current < SPAWN_INTERVAL) return;
      if (speed < 30) return;
      lastSpawnRef.current = now;

      const [alpha, color] = getSpeedAlpha(speed);
      const particle: CharParticle = {
        x: e.clientX,
        y: e.clientY,
        char: getChar(),
        alpha,
        spawnAlpha: alpha,
        born: now,
        color,
      };

      particlesRef.current.push(particle);
      if (particlesRef.current.length > MAX_CHARS) particlesRef.current.shift();
      startLoop();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
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
