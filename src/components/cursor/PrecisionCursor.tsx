"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

interface Ping {
  id: number;
  x: number;
  y: number;
}

interface Lock {
  x: number;
  y: number;
  width: number;
  height: number;
}

let pingId = 0;

// Sci-fi precision cursor: a slowly rotating segmented reticle that snaps
// onto interactive elements as a corner-bracket target lock (same design
// language as the DNA target), with a live coordinate readout and a clean
// sonar ping + radar sweep on click.
export function PrecisionCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [lock, setLock] = useState<Lock | null>(null);
  const [pings, setPings] = useState<Ping[]>([]);
  const [pressed, setPressed] = useState(false);
  const readoutRef = useRef<HTMLSpanElement>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 500, damping: 38 });
  const ringY = useSpring(y, { stiffness: 500, damping: 38 });

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

    const onDown = (e: PointerEvent) => {
      setPressed(true);
      setPings((current) => [...current, { id: pingId++, x: e.clientX, y: e.clientY }]);
    };
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

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-100" aria-hidden>
      {/* core dot — always exactly on the pointer */}
      <motion.div
        className="absolute h-1 w-1 rounded-full bg-sky-200 shadow-[0_0_6px_2px] shadow-sky-400/80"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />

      {/* segmented reticle ring (free mode) */}
      <motion.div
        className="absolute"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: lock ? 0.35 : pressed ? 0.72 : 1,
          opacity: lock ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        <svg
          width="46"
          height="46"
          viewBox="0 0 46 46"
          className={
            reduced ? "" : "animate-spin [animation-duration:7s] [animation-timing-function:linear]"
          }
        >
          <circle
            cx="23"
            cy="23"
            r="17"
            fill="none"
            stroke="var(--color-sky-300)"
            strokeWidth="1.5"
            strokeOpacity="0.85"
            pathLength={100}
            strokeDasharray="18 7"
            className="[filter:drop-shadow(0_0_4px_rgba(125,211,252,0.7))]"
          />
          {/* orientation ticks */}
          {[0, 90, 180, 270].map((deg) => (
            <line
              key={deg}
              x1="23"
              y1="1"
              x2="23"
              y2="5"
              stroke="var(--color-sky-300)"
              strokeWidth="1.5"
              strokeOpacity="0.5"
              transform={`rotate(${deg} 23 23)`}
            />
          ))}
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

      {/* click: sonar ping + one radar sweep */}
      <AnimatePresence>
        {pings.map((ping) => (
          <motion.div
            key={ping.id}
            className="absolute"
            style={{ left: ping.x, top: ping.y }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute rounded-full border border-sky-300"
              initial={{ width: 10, height: 10, x: -5, y: -5, opacity: 0.9 }}
              animate={{ width: 88, height: 88, x: -44, y: -44, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() =>
                setPings((current) => current.filter((p) => p.id !== ping.id))
              }
            />
            {!reduced && (
              <motion.div
                className="absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(125,211,252,0.5) 0deg, transparent 70deg)",
                  maskImage:
                    "radial-gradient(circle, transparent 30%, black 32%, black 55%, transparent 57%)",
                }}
                initial={{ rotate: 0, opacity: 0.8 }}
                animate={{ rotate: 360, opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
