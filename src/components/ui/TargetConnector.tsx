"use client";

import { useEffect, useRef } from "react";

// Sci-fi callout: a dot after the section heading, a clean line running
// right, one 45° bend, ending at the target lock on the DNA base pair.
// Updated per frame via direct DOM writes (the DNA rotates continuously).
export function TargetConnector() {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const path = pathRef.current;
      const dot = dotRef.current;
      const svg = svgRef.current;
      if (!path || !dot || !svg) return;

      const lock = document.querySelector<HTMLElement>(".target-lock-active");
      if (!lock) {
        svg.style.opacity = "0";
        return;
      }
      const index = lock.dataset.targetIndex;
      const anchor = document.querySelector<HTMLElement>(
        `[data-heading-anchor="${index}"]`,
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

      const x1 = a.right + 18;
      const y1 = a.top + a.height / 2;
      const x2 = b.left - 8;
      const y2 = b.top + b.height / 2;
      const bend = Math.abs(y2 - y1);
      const elbowX = x2 - bend;
      // dot → horizontal run → single 45° bend into the lock
      path.setAttribute(
        "d",
        elbowX > x1 + 20
          ? `M ${x1} ${y1} H ${elbowX} L ${x2} ${y2}`
          : `M ${x1} ${y1} L ${x2} ${y2}`,
      );
      dot.setAttribute("cx", String(x1));
      dot.setAttribute("cy", String(y1));
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
        strokeOpacity="0.85"
        className="[filter:drop-shadow(0_0_4px_rgba(125,211,252,0.7))]"
      />
      <circle
        ref={dotRef}
        r="3.5"
        fill="var(--color-sky-300)"
        className="[filter:drop-shadow(0_0_6px_rgba(125,211,252,0.9))]"
      />
    </svg>
  );
}
