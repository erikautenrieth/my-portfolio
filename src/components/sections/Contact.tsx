import type { Lang } from "@/i18n";
import { dict } from "@/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GITHUB_URL, LINKEDIN_URL } from "@/content/links";

export function Contact({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-32">
      <SectionHeading>{d.contact.heading}</SectionHeading>
      <p className="max-w-xl text-slate-300">{d.contact.text}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener"
          className="rounded-xl bg-cyan-400/10 px-8 py-4 font-display text-lg font-semibold text-cyan-300 ring-1 ring-cyan-400/40 transition hover:shadow-xl hover:shadow-cyan-400/25 hover:ring-cyan-400/70"
        >
          GitHub ↗
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener"
          className="rounded-xl bg-violet-400/10 px-8 py-4 font-display text-lg font-semibold text-violet-300 ring-1 ring-violet-400/40 transition hover:shadow-xl hover:shadow-violet-400/25 hover:ring-violet-400/70"
        >
          LinkedIn ↗
        </a>
      </div>
      <footer className="mt-24 font-mono text-xs text-slate-500">{d.footer}</footer>
    </section>
  );
}
