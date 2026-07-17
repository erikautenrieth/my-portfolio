"use client";

import { motion } from "motion/react";
import { MoleculeMark } from "./Molecules";

export function SectionHeading({
  seq,
  molecule,
  children,
}: {
  seq?: number;
  molecule?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-12">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-3xl font-bold text-slate-100 md:text-4xl"
      >
        {seq !== undefined && (
          <span className="flex items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 26 26" aria-hidden className="text-sky-400">
              <path
                d="M1 8 V1 H8 M18 1 H25 V8 M25 18 V25 H18 M8 25 H1 V18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span className="font-mono text-base font-normal tracking-[0.3em] text-sky-400 md:text-lg">
              SEQ.{String(seq).padStart(2, "0")}
            </span>
            <span className="hidden h-px w-10 bg-linear-to-r from-sky-400/80 to-sky-400/10 md:block" />
          </span>
        )}
        {children}
      </motion.h2>
      {molecule !== undefined && <MoleculeMark index={molecule} className="mt-4" />}
    </div>
  );
}
