import type { Lang } from "@/i18n";
import { dict } from "@/i18n";
import { publications } from "@/content/publications";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

export function Publications({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="publications" className="mx-auto max-w-6xl px-6 py-32 lg:pr-[36%]">
      <SectionHeading seq={6} molecule={0}>{d.sections.publications}</SectionHeading>
      <div className="grid gap-6">
        {publications.map((publication) => (
          <GlassCard key={publication.doi} className="p-8">
            <p className="leading-relaxed text-slate-300">
              <span className="font-mono text-sm text-cyan-400">
                {publication.authors} ({publication.year}).
              </span>{" "}
              <em className="text-slate-100">{publication.title}.</em>{" "}
              <span className="text-sm text-slate-400">{publication.venue}.</span>
            </p>
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-block rounded-full bg-white/5 px-4 py-1.5 font-mono text-xs text-slate-300 ring-1 ring-white/15 transition hover:text-cyan-300 hover:ring-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/20"
            >
              DOI: {publication.doi} ↗
            </a>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
