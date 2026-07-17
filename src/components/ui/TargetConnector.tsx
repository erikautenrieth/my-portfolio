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
      const dy = lockCenterY - y1;

      // free corridor: right edge of the section's content column
      const section = anchor.closest("section");
      let corridor = x1 + 40;
      if (section) {
        const s = section.getBoundingClientRect();
        const paddingRight =
          parseFloat(getComputedStyle(section).paddingRight) || 0;
        corridor = s.right - paddingRight + 24;
      }

      // one bend: prefer a 45° diagonal, but never enter the content column
      const lockRadius = Math.max(b.width, b.height) / 2 + 6;
      let bendX = Math.max(lockCenterX - Math.abs(dy), corridor);
      // keep enough runway so the diagonal never folds back on itself
      bendX = Math.min(bendX, lockCenterX - lockRadius - 14);

      let ex: number;
      let ey: number;
      let angle: number;

      const segLength = Math.hypot(lockCenterX - bendX, dy);
      if (bendX <= x1 + 16 || segLength < lockRadius + 10 || Math.abs(dy) < 14) {
        // straight shot from the heading dot
        const dirX = lockCenterX - x1;
        const dirY = lockCenterY - y1;
        const length = Math.hypot(dirX, dirY) || 1;
        if (length < lockRadius + 12) {
          svg.style.opacity = "0";
          return;
        }
        ex = lockCenterX - (dirX / length) * lockRadius;
        ey = lockCenterY - (dirY / length) * lockRadius;
        angle = Math.atan2(dirY, dirX);
        path.setAttribute("d", `M ${x1} ${y1} L ${ex} ${ey}`);
      } else {
        const dirX = lockCenterX - bendX;
        const dirY = dy;
        const length = Math.hypot(dirX, dirY) || 1;
        ex = lockCenterX - (dirX / length) * lockRadius;
        ey = lockCenterY - (dirY / length) * lockRadius;
        angle = Math.atan2(dirY, dirX);
        // softly rounded bend instead of a hard corner
        const r = Math.min(12, bendX - x1);
        const bx = bendX + (dirX / length) * r;
        const by = y1 + (dirY / length) * r;
        path.setAttribute(
          "d",
          `M ${x1} ${y1} H ${bendX - r} Q ${bendX} ${y1} ${bx} ${by} L ${ex} ${ey}`,
        );
      }

      dot.setAttribute("cx", String(x1));
      dot.setAttribute("cy", String(y1));

      // draw-in: the line traces from the dot to the target, then the
      // arrowhead snaps in and the pulse starts travelling
      const drawT = reduced
        ? 1
        : Math.min(1, (performance.now() - drawStartRef.current) / 550);
      const eased = 1 - Math.pow(1 - drawT, 3);
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
        className="transition-opacity duration-200 [filter:drop-shadow(0_0_5px_rgba(125,211,252,0.9))]"
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
