"use client";

import { motion } from "motion/react";

// Gates section content: it fades in only after the SEQ annotation on the
// DNA has appeared (sequential, not parallel).
export function SectionReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-22%" }}
      transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
