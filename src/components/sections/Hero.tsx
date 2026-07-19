"use client";

import { motion } from "motion/react";
import type { Lang } from "@/i18n";
import { dict } from "@/i18n";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export function Hero({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="hero" className="relative flex min-h-screen items-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-6"
      >
        <motion.p
          variants={item}
          className="mb-4 font-mono text-sm tracking-[0.35em] text-cyan-400"
        >
          {d.hero.kicker}
        </motion.p>
        <motion.h1
          variants={item}
          className="font-display text-6xl font-bold leading-[1.02] md:text-8xl"
        >
          <span className="bg-linear-to-r from-slate-200 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            {d.hero.name}
          </span>
        </motion.h1>
        <motion.p
          variants={container}
          className="mt-6 flex flex-wrap gap-x-3 font-mono text-sm text-slate-400 md:text-base"
        >
          {d.hero.titles.map((title, i) => (
            <motion.span key={title} variants={item} className="flex items-center gap-3">
              {i > 0 && <span className="text-emerald-400">·</span>}
              <span className={i === 0 ? "text-slate-200" : ""}>{title}</span>
            </motion.span>
          ))}
        </motion.p>
      </motion.div>
      <motion.a
        href="#about"
        aria-label={d.hero.scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
      >
        <motion.svg
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 9 L12 15 L18 9" />
        </motion.svg>
      </motion.a>
    </section>
  );
}
