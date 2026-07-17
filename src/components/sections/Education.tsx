import type { Lang } from "@/i18n";
import { dict, t } from "@/i18n";
import { education } from "@/content/education";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

export function Education({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="education" className="mx-auto max-w-6xl px-6 py-32">
      <SectionHeading>{d.sections.education}</SectionHeading>
      <div className="grid gap-8 md:grid-cols-2">
        {education.map((entry, i) => (
          <GlassCard key={i} className="p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-widest text-cyan-400">{entry.period}</p>
                <h3 className="mt-2 font-display text-xl font-bold text-slate-100">
                  {t(lang, entry.degree)}
                </h3>
                <p className="font-mono text-sm text-slate-400">{entry.institution}</p>
              </div>
              <span className="rounded-full bg-cyan-400/10 px-4 py-1.5 font-mono text-sm text-cyan-300 ring-1 ring-cyan-400/30">
                {entry.grade}
              </span>
            </div>
            <div className="mt-6 border-l-2 border-violet-400/30 pl-4">
              <p className="text-sm leading-relaxed text-slate-300">
                „{t(lang, entry.thesis)}“
              </p>
              <p className="mt-1 font-mono text-xs text-violet-300">
                {lang === "de" ? "Note" : "Grade"} {entry.thesisGrade}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
