"use client";

import { useEffect, useRef } from "react";

// Sci-fi callout: dot after the heading → horizontal run in the free
// corridor above the content card → 45° chamfer → vertical drop with an
// arrowhead precisely into the target lock. A light pulse travels the path.
// Updated per frame via direct DOM writes (the DNA rotates continuously).
export function TargetConnector() {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const arrowRef = useRef<SVGPolygonElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const path = pathRef.current;
      const dot = dotRef.current;
      const arrow = arrowRef.current;
      const pulse = pulseRef.current;
      const svg = svgRef.current;
      if (!path || !dot || !arrow || !pulse || !svg) return;

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
      const lockCenterY = b.top + b.height / 2;
      const dy = lockCenterY - y1;
      const chamfer = 16;

      if (Math.abs(dy) < 44) {
        // lock roughly on heading level → enter from the left side
        const ex = b.left - 5;
        const bendX = ex - Math.max(Math.abs(dy), 0.01);
        path.setAttribute(
          "d",
          bendX > x1 + 12
            ? `M ${x1} ${y1} H ${bendX} L ${ex} ${lockCenterY}`
            : `M ${x1} ${y1} L ${ex} ${lockCenterY}`,
        );
        arrow.setAttribute(
          "points",
          `${ex - 7},${lockCenterY - 4.5} ${ex - 7},${lockCenterY + 4.5} ${ex},${lockCenterY}`,
        );
      } else {
        // enter from top/bottom: horizontal in the free corridor on heading
        // level, one 45° chamfer, then straight into the lock
        const below = dy > 0;
        const tx = b.left + b.width / 2;
        const ty = below ? b.top - 5 : b.bottom + 5;
        if (tx - chamfer > x1 + 12) {
          const cy = below ? y1 + chamfer : y1 - chamfer;
          path.setAttribute(
            "d",
            `M ${x1} ${y1} H ${tx - chamfer} L ${tx} ${cy} V ${ty}`,
          );
        } else {
          path.setAttribute("d", `M ${x1} ${y1} L ${tx} ${ty}`);
        }
        arrow.setAttribute(
          "points",
          below
            ? `${tx - 4.5},${ty - 7} ${tx + 4.5},${ty - 7} ${tx},${ty}`
            : `${tx - 4.5},${ty + 7} ${tx + 4.5},${ty + 7} ${tx},${ty}`,
        );
      }

      dot.setAttribute("cx", String(x1));
      dot.setAttribute("cy", String(y1));

      // light pulse travelling along the path
      if (reduced) {
        pulse.style.opacity = "0";
      } else {
        const length = path.getTotalLength();
        const t = (performance.now() / 1500) % 1;
        const point = path.getPointAtLength(length * t);
        pulse.setAttribute("cx", String(point.x));
        pulse.setAttribute("cy", String(point.y));
        pulse.style.opacity = "0.95";
      }

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
      <polygon
        ref={arrowRef}
        fill="var(--color-sky-300)"
        className="[filter:drop-shadow(0_0_5px_rgba(125,211,252,0.9))]"
      />
      <circle
        ref={pulseRef}
        r="2.5"
        fill="#ffffff"
        className="[filter:drop-shadow(0_0_7px_rgba(186,230,253,1))]"
      />
    </svg>
  );
}
