import type { Lang } from "@/i18n";
import { dict } from "@/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-32">
      <SectionHeading>{d.sections.about}</SectionHeading>
      <p className="max-w-2xl text-lg leading-relaxed text-slate-300">{d.about.text}</p>
    </section>
  );
}
