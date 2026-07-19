import type { Lang } from "@/i18n";
import { dict } from "@/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { GITHUB_URL, LINKEDIN_URL } from "@/content/links";

const linkClass =
  "rounded-full bg-white/5 px-6 py-2.5 font-mono text-sm text-slate-300 ring-1 ring-white/10 transition hover:text-cyan-400 hover:ring-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/20";

export function About({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-32 md:pr-[34%]">
      <SectionHeading seq={1} molecule={0}>{d.sections.about}</SectionHeading>
      <GlassCard className="p-8 md:p-10">
        <p className="max-w-2xl text-lg leading-relaxed text-slate-300">{d.about.text}</p>
        <div className="mt-10 flex gap-4">
          <a href={GITHUB_URL} target="_blank" rel="noopener" className={linkClass}>
            GitHub ↗
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener" className={linkClass}>
            LinkedIn ↗
          </a>
        </div>
      </GlassCard>
    </section>
  );
}
