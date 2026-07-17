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
    <div
      className="mb-12 flex w-fit flex-wrap items-center gap-x-7 gap-y-3"
      data-heading-anchor={seq !== undefined ? seq - 1 : undefined}
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-display text-3xl font-bold text-slate-100 md:text-4xl"
      >
        {children}
      </motion.h2>
      {molecule !== undefined && <MoleculeMark index={molecule} />}
    </div>
  );
}
