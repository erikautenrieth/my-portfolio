import type { Lang } from "@/i18n";
import { dict } from "@/i18n";
import { skillCategories } from "@/content/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { TechIcon } from "@/components/ui/TechIcon";

export function Skills({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-32">
      <SectionHeading>{d.sections.skills}</SectionHeading>
      <div className="grid gap-8">
        {skillCategories.map((category, i) => (
          <div key={i}>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
              {category.label[lang]}
            </p>
            <Marquee reverse={i % 2 === 1}>
              {category.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="flex shrink-0 items-center gap-2.5 rounded-full bg-white/5 px-4 py-2 font-mono text-sm text-slate-300 ring-1 ring-white/10 transition hover:text-white hover:ring-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/15"
                >
                  <TechIcon slug={skill.icon} />
                  {skill.name}
                </span>
              ))}
            </Marquee>
          </div>
        ))}
      </div>
    </section>
  );
}
