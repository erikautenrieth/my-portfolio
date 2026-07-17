"use client";

import { motion } from "motion/react";
import { MoleculeChain } from "./MoleculeChain";

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-display text-3xl font-bold text-slate-100 md:text-4xl"
      >
        <span className="mr-3 font-mono text-lg text-cyan-400">{"//"}</span>
        {children}
      </motion.h2>
      <MoleculeChain className="mt-4" />
    </div>
  );
}
