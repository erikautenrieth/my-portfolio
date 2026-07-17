"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

interface Burst {
  id: number;
  x: number;
  y: number;
  particles: { angle: number; distance: number }[];
}

let burstId = 0;

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // trailing ring follows with spring physics (framework, no manual lerp/rAF)
  const ringX = useSpring(x, { stiffness: 400, damping: 40 });
  const ringY = useSpring(y, { stiffness: 400, damping: 40 });

  useEffect(() => {
    // only on precise pointers (desktop) — touch devices keep native behavior
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [data-cursor='hover']"));
    };

    const onDown = (e: PointerEvent) => {
      const particles = reduced
        ? []
        : Array.from({ length: 10 }, () => ({
            angle: Math.random() * Math.PI * 2,
            distance: 40 + Math.random() * 50,
          }));
      const burst: Burst = { id: burstId++, x: e.clientX, y: e.clientY, particles };
      setBursts((current) => [...current, burst]);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [x, y, reduced]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      {/* dot */}
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-cyan-400"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      {/* trailing ring */}
      <motion.div
        className={`absolute rounded-full border transition-colors duration-200 ${
          hovering ? "border-violet-400" : "border-cyan-400/60"
        }`}
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: hovering ? 44 : 28, height: hovering ? 44 : 28 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      {/* click shockwave + particle burst */}
      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            className="absolute"
            style={{ left: burst.x, top: burst.y }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute rounded-full border border-cyan-400"
              initial={{ width: 8, height: 8, opacity: 0.9, x: -4, y: -4 }}
              animate={{
                width: 90,
                height: 90,
                opacity: 0,
                x: -45,
                y: -45,
              }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              onAnimationComplete={() =>
                setBursts((current) => current.filter((b) => b.id !== burst.id))
              }
            />
            {burst.particles.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-cyan-300"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(particle.angle) * particle.distance,
                  y: Math.sin(particle.angle) * particle.distance,
                  opacity: 0,
                  scale: 0.4,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
