"use client";

import { useRef, useState } from "react";

export function Scannable({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [scanning, setScanning] = useState(false);
  const [decoded, setDecoded] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const decodeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  function onEnter() {
    setScanning(true);
    timeoutRef.current = setTimeout(() => {
      setScanning(false);
      const hex = Math.random().toString(16).slice(2, 7).toUpperCase();
      setDecoded(hex);
      decodeTimeoutRef.current = setTimeout(() => setDecoded(null), 1800);
    }, 520);
  }

  function onLeave() {
    setScanning(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
      {scanning && (
        <div
          className="pointer-events-none absolute left-0 right-0 h-px bg-cyan-400 shadow-[0_0_6px_#22d3ee,0_0_14px_rgba(34,211,238,0.25)] animate-[scanDown_520ms_ease-in-out_forwards]"
          style={{ top: 0 }}
        />
      )}
      {decoded && (
        <span className="pointer-events-none absolute bottom-2 right-3 font-mono text-[7px] tracking-[0.1em] text-cyan-400/60 animate-[fadeInOut_1800ms_ease-in-out_forwards]">
          {decoded}
        </span>
      )}
    </div>
  );
}
