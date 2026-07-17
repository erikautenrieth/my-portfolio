"use client";

import { motion } from "motion/react";
import type { Lang } from "@/i18n";
import { dict, t } from "@/i18n";
import { projects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

const linkClass =
  "rounded-full px-5 py-2 font-mono text-xs tracking-wider ring-1 transition hover:shadow-lg";

export function Projects({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-32 md:pr-[34%]">
      <SectionHeading seq={2} molecule={1}>{d.sections.projects}</SectionHeading>
      <div className="grid gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: "easeOut" }}
            whileHover={{ y: -4 }}
          >
            <GlassCard className="p-8 md:p-10">
              <h3 className="font-display text-2xl font-bold text-slate-100">
                {t(lang, project.title)}
              </h3>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {(
                  [
                    [d.projects.problem, project.problem, "text-cyan-400"],
                    [d.projects.approach, project.approach, "text-violet-400"],
                    [d.projects.result, project.result, "text-emerald-400"],
                  ] as const
                ).map(([label, text, color]) => (
                  <div key={label}>
                    <p className={`mb-2 font-mono text-xs uppercase tracking-[0.25em] ${color}`}>
                      {label}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-300">{t(lang, text)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-slate-400 ring-1 ring-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {(project.links.demo || project.links.code || project.links.paper) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener"
                      className={`${linkClass} bg-cyan-400/10 text-cyan-300 ring-cyan-400/40 hover:shadow-cyan-400/25`}
                    >
                      ▶ {d.projects.demo}
                    </a>
                  )}
                  {project.links.code && (
                    <a
                      href={project.links.code}
                      target="_blank"
                      rel="noopener"
                      className={`${linkClass} bg-white/5 text-slate-300 ring-white/15 hover:text-cyan-300 hover:ring-cyan-400/40 hover:shadow-cyan-400/20`}
                    >
                      {d.projects.code} ↗
                    </a>
                  )}
                  {project.links.paper && (
                    <a
                      href={project.links.paper}
                      target="_blank"
                      rel="noopener"
                      className={`${linkClass} bg-violet-400/10 text-violet-300 ring-violet-400/40 hover:shadow-violet-400/25`}
                    >
                      {d.projects.paper} ↗
                    </a>
                  )}
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
