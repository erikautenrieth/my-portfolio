"use client";

import { useEffect, useRef } from "react";

// Smooth flowing arc from heading to target lock.
// Updated per frame via direct DOM writes (the DNA rotates continuously).
export function TargetConnector() {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const arrowRef = useRef<SVGPolygonElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lastIndexRef = useRef<string | null>(null);
  const drawStartRef = useRef(0);

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
        lastIndexRef.current = null;
        return;
      }
      const index = lock.dataset.targetIndex;
      // new target → restart the draw-in animation
      if (index !== lastIndexRef.current) {
        lastIndexRef.current = index ?? null;
        drawStartRef.current = performance.now();
      }
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
      const lockCenterX = b.left + b.width / 2;
      const lockCenterY = b.top + b.height / 2;

      const lockRadius = Math.max(b.width, b.height) / 2 + 6;
      const dx = lockCenterX - x1;
      const dy = lockCenterY - y1;
      const dist = Math.hypot(dx, dy) || 1;

      if (dist < lockRadius + 12) {
        svg.style.opacity = "0";
        return;
      }

      const ex = lockCenterX - (dx / dist) * lockRadius;
      const ey = lockCenterY - (dy / dist) * lockRadius;

      const hPull = Math.min(Math.abs(dx) * 0.4, 180);
      const vBow = Math.sign(dy || -1) * Math.min(Math.abs(dx) * 0.18, 60);
      const cx1 = x1 + hPull;
      const cy1 = y1 + vBow;
      const cx2 = ex - hPull * 0.5;
      const cy2 = ey - vBow * 0.4;
      const angle = Math.atan2(ey - cy2, ex - cx2);

      path.setAttribute(
        "d",
        `M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${ex} ${ey}`,
      );

      dot.setAttribute("cx", String(x1));
      dot.setAttribute("cy", String(y1));

      // draw-in: the line traces from the dot to the target, then the
      // arrowhead snaps in and the pulse starts travelling
      const drawT = reduced
        ? 1
        : Math.min(1, (performance.now() - drawStartRef.current) / 700);
      const eased = drawT < 0.5
        ? 4 * drawT * drawT * drawT
        : 1 - Math.pow(-2 * drawT + 2, 3) / 2;
      const totalLength = path.getTotalLength();
      path.setAttribute("stroke-dasharray", String(totalLength));
      path.setAttribute("stroke-dashoffset", String(totalLength * (1 - eased)));

      // arrowhead aligned with the final segment, pointing into the lock
      const degrees = (angle * 180) / Math.PI;
      arrow.setAttribute("points", "-8,-4.5 -8,4.5 0,0");
      arrow.setAttribute(
        "transform",
        `translate(${ex}, ${ey}) rotate(${degrees})`,
      );
      arrow.style.opacity = eased > 0.92 ? "1" : "0";

      // light pulse travelling along the path (only once fully drawn)
      if (reduced || drawT < 1) {
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
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-500"
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="var(--color-sky-300)"
        strokeWidth="1"
        strokeOpacity="0.45"
        className="[filter:drop-shadow(0_0_3px_rgba(125,211,252,0.4))]"
      />
      <circle
        ref={dotRef}
        r="3"
        fill="var(--color-sky-300)"
        fillOpacity="0.6"
        className="[filter:drop-shadow(0_0_4px_rgba(125,211,252,0.5))]"
      />
      <polygon
        ref={arrowRef}
        fill="var(--color-sky-300)"
        fillOpacity="0.6"
        className="transition-opacity duration-200 [filter:drop-shadow(0_0_3px_rgba(125,211,252,0.5))]"
      />
      <circle
        ref={pulseRef}
        r="2"
        fill="#ffffff"
        fillOpacity="0.7"
        className="[filter:drop-shadow(0_0_5px_rgba(186,230,253,0.7))]"
      />
    </svg>
  );
}
