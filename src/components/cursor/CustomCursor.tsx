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
  const ringX = useSpring(x, { stiffness: 400, damping: 40 });
  const ringY = useSpring(y, { stiffness: 400, damping: 40 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const raf = requestAnimationFrame(() => setEnabled(true));

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [data-cursor='hover']"));
    };

    const onDown = (e: PointerEvent) => {
      const particles = reduced
        ? []
        : Array.from({ length: 10 }, (_, i) => ({
            angle: (i / 10) * Math.PI * 2,
            distance: 40 + Math.random() * 50,
          }));
      setBursts((c) => [...c, { id: burstId++, x: e.clientX, y: e.clientY, particles }]);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [x, y, reduced]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-100" aria-hidden>
      {/* glowing dot */}
      <motion.div
        className="absolute rounded-full"
        style={{ x, y, translateX: "-50%", translateY: "-50%", width: 5, height: 5 }}
        animate={{
          backgroundColor: hovering ? "#a78bfa" : "#22d3ee",
          boxShadow: hovering
            ? "0 0 8px 2px rgba(167,139,250,0.95)"
            : "0 0 8px 2px rgba(34,211,238,0.95)",
        }}
        transition={{ duration: 0.2 }}
      />

      {/* ring container — spring-follows, animates size */}
      <motion.div
        className="absolute"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: hovering ? 52 : 34, height: hovering ? 52 : 34 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* dim full base ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: hovering
              ? "inset 0 0 0 1px rgba(167,139,250,0.18)"
              : "inset 0 0 0 1px rgba(34,211,238,0.14)",
          }}
          transition={{ duration: 0.2 }}
        />

        {/* rotating scanning arc */}
        {!reduced && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              rotate: 360,
              filter: hovering
                ? "drop-shadow(0 0 5px rgba(167,139,250,0.9))"
                : "drop-shadow(0 0 5px rgba(34,211,238,0.9))",
              background: hovering
                ? "conic-gradient(from 0deg, rgba(167,139,250,1) 0deg 110deg, transparent 110deg 360deg)"
                : "conic-gradient(from 0deg, rgba(34,211,238,1) 0deg 110deg, transparent 110deg 360deg)",
            }}
            style={{
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))",
            }}
            transition={{
              rotate: { duration: 2.5, repeat: Infinity, ease: "linear" },
              filter: { duration: 0.2 },
              background: { duration: 0.2 },
            }}
          />
        )}

        {/* counter-rotating short arc (appears on hover) */}
        {!reduced && hovering && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{
              rotate: -360,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            style={{
              background:
                "conic-gradient(from 180deg, rgba(34,211,238,0.6) 0deg 50deg, transparent 50deg 360deg)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))",
              filter: "drop-shadow(0 0 3px rgba(34,211,238,0.6))",
            }}
            transition={{
              rotate: { duration: 1.8, repeat: Infinity, ease: "linear" },
              opacity: { duration: 0.15 },
            }}
          />
        )}
      </motion.div>

      {/* click burst */}
      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            className="absolute"
            style={{ left: burst.x, top: burst.y }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute rounded-full"
              style={{
                border: "1px solid rgba(34,211,238,0.85)",
                boxShadow: "0 0 10px rgba(34,211,238,0.5)",
              }}
              initial={{ width: 8, height: 8, opacity: 0.9, x: -4, y: -4 }}
              animate={{ width: 90, height: 90, opacity: 0, x: -45, y: -45 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              onAnimationComplete={() =>
                setBursts((c) => c.filter((b) => b.id !== burst.id))
              }
            />
            {burst.particles.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 3,
                  height: 3,
                  backgroundColor: "#67e8f9",
                  boxShadow: "0 0 5px rgba(34,211,238,0.9)",
                }}
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
