"use client";

import { useId } from "react";
import { motion } from "motion/react";

// Decorative molecule chain (hexagon rings + bonds), styled after
// scientific structural formulas. Frames section headings.
export function MoleculeChain({ className = "" }: { className?: string }) {
  const id = useId();
  const hexagon = (cx: number, cy: number, r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");

  return (
    <motion.svg
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      width="220"
      height="44"
      viewBox="0 0 220 44"
      fill="none"
      aria-hidden
      className={`text-cyan-400/40 ${className}`}
    >
      <g stroke="currentColor" strokeWidth="1">
        <polygon points={hexagon(24, 22, 13)} />
        <line x1="37" y1="22" x2="55" y2="22" />
        <polygon points={hexagon(68, 22, 13)} />
        <line x1="81" y1="22" x2="99" y2="22" />
        <line x1="81" y1="19" x2="99" y2="19" opacity="0.6" />
        <polygon points={hexagon(112, 22, 13)} />
        <line x1="125" y1="22" x2="143" y2="22" />
        <circle cx="150" cy="22" r="3.5" fill={`url(#${id})`} stroke="none" />
        <line x1="157" y1="22" x2="175" y2="22" strokeDasharray="3 3" />
        <circle cx="182" cy="22" r="2" fill="currentColor" stroke="none" />
        <line x1="188" y1="22" x2="206" y2="22" strokeDasharray="2 4" opacity="0.5" />
      </g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a78bfa" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}
