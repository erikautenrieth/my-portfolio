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
    <section id="hero" className="relative flex min-h-screen items-center pt-20">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_auto]"
      >
        <div>
          <motion.p
            variants={item}
            className="mb-3 font-mono text-sm tracking-[0.25em] text-cyan-400"
          >
            {d.hero.kicker}
          </motion.p>

          <motion.p
            variants={item}
            className="mb-2 text-lg text-slate-400 md:text-xl"
          >
            {d.hero.subtitle}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-5xl font-bold leading-[1.02] md:text-7xl lg:text-8xl"
          >
            <span className="bg-linear-to-r from-slate-200 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {d.hero.name}
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base text-slate-400 md:text-lg"
          >
            {d.hero.description}
          </motion.p>

          <motion.p
            variants={container}
            className="mt-5 flex flex-wrap gap-x-3 font-mono text-sm tracking-widest text-slate-500"
          >
            {d.hero.titles.map((title, i) => (
              <motion.span key={title} variants={item} className="flex items-center gap-3">
                {i > 0 && <span className="text-slate-600">/</span>}
                <span className={i === 0 ? "text-cyan-400" : ""}>{title.toUpperCase()}</span>
              </motion.span>
            ))}
          </motion.p>
        </div>

        {/* Status card */}
        <motion.aside
          variants={item}
          className="hidden self-center lg:block"
        >
          <div className="w-72 rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-widest text-slate-500">
              <span>SIGNAL / 01</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ONLINE
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              {d.hero.status}
            </p>
            <div className="mt-4 flex gap-3 border-t border-white/5 pt-3 font-mono text-[10px] tracking-widest text-slate-500">
              {d.hero.tags.map((tag) => (
                <span key={tag}>{tag.toUpperCase()}</span>
              ))}
            </div>
          </div>
        </motion.aside>
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
