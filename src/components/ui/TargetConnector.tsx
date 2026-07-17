"use client";

import { useEffect, useRef } from "react";

// HUD connector: draws an animated elbow line from the active section's
// SEQ heading bracket to the target lock on the DNA base pair.
// Updated per frame via direct DOM writes (the DNA rotates continuously).
export function TargetConnector() {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const path = pathRef.current;
      const svg = svgRef.current;
      if (!path || !svg) return;

      const lock = document.querySelector<HTMLElement>(".target-lock-active");
      if (!lock) {
        svg.style.opacity = "0";
        return;
      }
      const index = lock.dataset.targetIndex;
      const anchor = document.querySelector<HTMLElement>(
        `[data-seq-anchor="${index}"]`,
      );
      if (!anchor) {
        svg.style.opacity = "0";
        return;
      }

      const a = anchor.getBoundingClientRect();
      const b = lock.getBoundingClientRect();
      // hide when the heading is scrolled out of view
      if (a.bottom < 16 || a.top > innerHeight - 16 || b.width === 0) {
        svg.style.opacity = "0";
        return;
      }

      // HUD routing in right angles through free space: up from the
      // bracket, horizontally across (above heading + molecule), then
      // straight down into the lock — never crossing text
      const x1 = a.left + a.width / 2;
      const x2 = b.left + b.width / 2;
      const runwayY = Math.max(12, Math.min(a.top - 24, b.top - 44));
      const y2 = b.top - 6;
      path.setAttribute(
        "d",
        `M ${x1} ${a.top - 4} V ${runwayY} H ${x2} V ${y2}`,
      );
      svg.style.opacity = "1";
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 h-full w-full opacity-0 transition-opacity duration-500"
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="var(--color-sky-300)"
        strokeWidth="1.5"
        strokeDasharray="7 5"
        className="[filter:drop-shadow(0_0_4px_rgba(125,211,252,0.7))] animate-hud-dash"
      />
    </svg>
  );
}
