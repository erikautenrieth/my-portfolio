"use client";

import { motion } from "motion/react";

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="font-display text-3xl font-bold text-slate-100 mb-12 md:text-4xl"
    >
      <span className="mr-3 font-mono text-lg text-cyan-400">//</span>
      {children}
    </motion.h2>
  );
}
