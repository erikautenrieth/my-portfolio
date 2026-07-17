"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import type { Lang } from "@/i18n";
import { dict, t } from "@/i18n";
import { experience } from "@/content/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

export function Experience({ lang }: { lang: Lang }) {
  const d = dict[lang];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 70%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const main = experience.filter((entry) => !entry.compact);
  const compact = experience.filter((entry) => entry.compact);

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-32 md:pr-[34%]">
      <SectionHeading seq={3} molecule={2}>{d.sections.experience}</SectionHeading>
      <div ref={ref} className="relative pl-8 md:pl-12">
        {/* growing timeline line */}
        <div className="absolute left-2 top-0 h-full w-px bg-white/10 md:left-3" />
        <motion.div
          style={{ scaleY }}
          className="absolute left-2 top-0 h-full w-px origin-top bg-linear-to-b from-cyan-400 to-violet-400 md:left-3"
        />

        <div className="grid gap-10">
          {main.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* node on the line */}
              <span className="absolute -left-8 top-8 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_2px] shadow-cyan-400/50 md:-left-[2.4rem]" />
              <GlassCard className="p-8">
                <p className="font-mono text-xs tracking-widest text-cyan-400">{entry.period}</p>
                <h3 className="mt-2 font-display text-xl font-bold text-slate-100">
                  {t(lang, entry.role)}
                </h3>
                <p className="font-mono text-sm text-slate-400">{entry.company}</p>

                {entry.bullets && (
                  <ul className="mt-4 grid gap-2">
                    {entry.bullets.map((bullet, j) => (
                      <li key={j} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                        {t(lang, bullet)}
                      </li>
                    ))}
                  </ul>
                )}

                {entry.projects?.map((project, j) => (
                  <div
                    key={j}
                    className="mt-6 border-l-2 border-violet-400/30 pl-5 first-of-type:mt-5"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-400">
                      {t(lang, project.client)}
                    </p>
                    <p className="mt-1 font-semibold text-slate-200">{t(lang, project.title)}</p>
                    <ul className="mt-3 grid gap-2">
                      {project.bullets.map((bullet, k) => (
                        <li
                          key={k}
                          className="flex gap-3 text-sm leading-relaxed text-slate-300"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                          {t(lang, bullet)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </GlassCard>
            </motion.div>
          ))}

          {/* compact entries */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <span className="absolute -left-8 top-8 h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_12px_2px] shadow-violet-400/50 md:-left-[2.4rem]" />
            <GlassCard className="p-8">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">
                {d.experience.more}
              </p>
              <ul className="mt-4 grid gap-4">
                {compact.map((entry, i) => (
                  <li key={i} className="text-sm leading-relaxed text-slate-300">
                    <span className="font-mono text-xs text-cyan-400">{entry.period}</span>
                    <span className="mx-2 text-slate-600">—</span>
                    <span className="font-semibold text-slate-200">
                      {t(lang, entry.role)}, {entry.company}:
                    </span>{" "}
                    {entry.bullets && t(lang, entry.bullets[0])}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
