"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

interface Lock {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ClickColumn {
  xOffset: number;
  chars: string[];
  startDelay: number;
  speed: number;
}

interface ClickBurst {
  x: number;
  y: number;
  born: number;
  columns: ClickColumn[];
}

// Sci-fi precision cursor: a slowly rotating segmented reticle that snaps
// onto interactive elements as a corner-bracket target lock (same design
// language as the DNA target), with a live coordinate readout and a
// Matrix DNA rain burst on click.
export function PrecisionCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [lock, setLock] = useState<Lock | null>(null);
  const [pressed, setPressed] = useState(false);
  const readoutRef = useRef<HTMLSpanElement>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 500, damping: 38 });
  const ringY = useSpring(y, { stiffness: 500, damping: 38 });

  const clickCanvasRef = useRef<HTMLCanvasElement>(null);
  const clickAnimsRef = useRef<ClickBurst[]>([]);
  const clickRafRef = useRef<number>(0);
  const clickRunningRef = useRef(false);

  useEffect(() => {
    // only on precise pointers (desktop) — touch devices keep native behavior
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const raf = requestAnimationFrame(() => setEnabled(true));

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (readoutRef.current) {
        readoutRef.current.textContent = `${String(Math.round(e.clientX)).padStart(4, "0")} : ${String(
          Math.round(e.clientY),
        ).padStart(4, "0")}`;
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor='hover']",
      );
      if (!target) return;
      const rect = target.getBoundingClientRect();
      // only lock onto reasonably sized controls
      if (rect.width > 340 || rect.height > 200) return;
      setLock({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });
    };

    const onOut = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a, button, [data-cursor='hover']",
      );
      if (target) setLock(null);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onScroll = () => setLock(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
    };
  }, [x, y]);

  useEffect(() => {
    const canvas = clickCanvasRef.current;
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    function getChar(): string {
      if (Math.random() < 0.3) return "0123456789ABCDEF"[Math.floor(Math.random() * 16)];
      return "ATGC"[Math.floor(Math.random() * 4)];
    }

    function startClickLoop() {
      if (clickRunningRef.current) return;
      clickRunningRef.current = true;
      clickRafRef.current = requestAnimationFrame(renderClicks);
    }

    function renderClicks() {
      const now = performance.now();
      const bursts = clickAnimsRef.current;

      const rect = canvas!.getBoundingClientRect();
      ctx!.clearRect(0, 0, rect.width, rect.height);

      for (let bi = bursts.length - 1; bi >= 0; bi--) {
        const burst = bursts[bi];
        const elapsed = now - burst.born;
        if (elapsed > 1200) { bursts.splice(bi, 1); continue; }

        // Phase 1: bright flash + expanding ring
        if (elapsed < 180) {
          const t = elapsed / 180;
          const ringR = t * 24;
          const flashA = 0.9 * (1 - t);
          // bright white-cyan center flash
          const grad = ctx!.createRadialGradient(burst.x, burst.y, 0, burst.x, burst.y, ringR);
          grad.addColorStop(0, `rgba(220,255,255,${flashA})`);
          grad.addColorStop(0.4, `rgba(34,211,238,${flashA * 0.6})`);
          grad.addColorStop(1, "rgba(34,211,238,0)");
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(burst.x, burst.y, ringR, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Phase 2: falling columns directly below click point
        ctx!.font = "bold 11px 'JetBrains Mono', 'Courier New', monospace";
        ctx!.textAlign = "center";
        ctx!.textBaseline = "top";

        for (const col of burst.columns) {
          const colElapsed = elapsed - col.startDelay;
          if (colElapsed < 0) continue;

          const baseX = burst.x + col.xOffset;
          const fallDist = (colElapsed / 1000) * col.speed;

          // Alpha: fade in quickly, hold, fade out
          let colAlpha = 1;
          if (colElapsed < 80) colAlpha = colElapsed / 80;
          else if (colElapsed > 750) colAlpha = 1 - (colElapsed - 750) / 450;

          for (let ci = 0; ci < col.chars.length; ci++) {
            const charY = burst.y + 6 + ci * 14 + fallDist;
            const t = ci / (col.chars.length - 1);
            // leading char: bright white-green (Matrix), trailing: cyan → deep violet
            if (ci === 0) {
              ctx!.fillStyle = "#b5ffb5";
              ctx!.shadowBlur = 10;
              ctx!.shadowColor = "#00ff88";
              ctx!.globalAlpha = colAlpha;
            } else if (ci === 1) {
              ctx!.fillStyle = "#22d3ee";
              ctx!.shadowBlur = 4;
              ctx!.shadowColor = "#22d3ee";
              ctx!.globalAlpha = colAlpha * 0.9;
            } else {
              const r = Math.round(34 + t * (139 - 34));
              const g = Math.round(211 + t * (92 - 211));
              const b = Math.round(238 + t * (246 - 238));
              ctx!.fillStyle = `rgb(${r},${g},${b})`;
              ctx!.shadowBlur = 0;
              ctx!.globalAlpha = colAlpha * Math.max(0.15, 1 - t * 0.9);
            }
            ctx!.fillText(col.chars[ci], baseX, charY);
          }
        }
      }

      ctx!.globalAlpha = 1;
      ctx!.shadowBlur = 0;

      if (bursts.length > 0) {
        clickRafRef.current = requestAnimationFrame(renderClicks);
      } else {
        clickRunningRef.current = false;
      }
    }

    function onClick(e: PointerEvent) {
      const columns: ClickColumn[] = Array.from({ length: 5 }, (_, i) => ({
        xOffset: (i - 2) * 14,
        chars: Array.from({ length: 6 }, () => getChar()),
        startDelay: i * 30,
        speed: 55 + Math.random() * 30,
      }));

      clickAnimsRef.current.push({ x: e.clientX, y: e.clientY, born: performance.now(), columns });
      startClickLoop();
    }

    window.addEventListener("pointerdown", onClick);

    return () => {
      window.removeEventListener("pointerdown", onClick);
      cancelAnimationFrame(clickRafRef.current);
      ro.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-100" aria-hidden>
      {/* core dot — nucleotide node on pointer */}
      <motion.div
        className="absolute h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_3px_rgba(34,211,238,0.7),0_0_2px_1px_rgba(255,255,255,0.9)]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />

      {/* double helix ring — two offset arcs rotating around cursor */}
      <motion.div
        className="absolute"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: lock ? 0.3 : pressed ? 0.65 : 1,
          opacity: lock ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          className={
            reduced ? "" : "animate-spin [animation-duration:5s] [animation-timing-function:linear]"
          }
        >
          {/* strand A — cyan arc */}
          <path
            d="M 22 4 A 18 18 0 0 1 40 22"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1.2"
            strokeOpacity="0.8"
            strokeLinecap="round"
            className="[filter:drop-shadow(0_0_4px_rgba(34,211,238,0.8))]"
          />
          <path
            d="M 22 40 A 18 18 0 0 1 4 22"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1.2"
            strokeOpacity="0.8"
            strokeLinecap="round"
            className="[filter:drop-shadow(0_0_4px_rgba(34,211,238,0.8))]"
          />
          {/* strand B — violet arc (offset 90°) */}
          <path
            d="M 40 22 A 18 18 0 0 1 22 40"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1"
            strokeOpacity="0.55"
            strokeLinecap="round"
            className="[filter:drop-shadow(0_0_3px_rgba(167,139,250,0.7))]"
          />
          <path
            d="M 4 22 A 18 18 0 0 1 22 4"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1"
            strokeOpacity="0.55"
            strokeLinecap="round"
            className="[filter:drop-shadow(0_0_3px_rgba(167,139,250,0.7))]"
          />
          {/* base-pair bridges connecting the two strands */}
          <line x1="22" y1="4" x2="22" y2="8" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.4" />
          <line x1="40" y1="22" x2="36" y2="22" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.4" />
          <line x1="22" y1="40" x2="22" y2="36" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.4" />
          <line x1="4" y1="22" x2="8" y2="22" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
      </motion.div>

      {/* live coordinate readout */}
      <motion.div
        className="absolute font-mono text-[9px] tracking-[0.2em] text-sky-300/50"
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: lock ? 0 : 1 }}
      >
        <span ref={readoutRef} className="block translate-x-5 translate-y-4" />
      </motion.div>

      {/* corner brackets snapping onto the hovered control */}
      <motion.div
        className="absolute"
        initial={false}
        animate={
          lock
            ? {
                left: lock.x - 7,
                top: lock.y - 7,
                width: lock.width + 14,
                height: lock.height + 14,
                opacity: 1,
                scale: 1,
              }
            : { opacity: 0, scale: 1.3 }
        }
        transition={{ type: "spring", stiffness: 550, damping: 34 }}
      >
        {[
          "left-0 top-0 border-l-2 border-t-2",
          "right-0 top-0 border-r-2 border-t-2",
          "left-0 bottom-0 border-l-2 border-b-2",
          "right-0 bottom-0 border-r-2 border-b-2",
        ].map((position) => (
          <span
            key={position}
            className={`absolute h-3 w-3 border-sky-300 drop-shadow-[0_0_5px_rgba(125,211,252,0.9)] ${position}`}
          />
        ))}
      </motion.div>

      {/* click: DNA rain burst canvas */}
      <canvas
        ref={clickCanvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />
    </div>
  );
}
