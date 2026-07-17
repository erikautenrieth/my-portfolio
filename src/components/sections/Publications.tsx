import type { Lang } from "@/i18n";
import { dict } from "@/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Publications({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="publications" className="mx-auto max-w-6xl px-6 py-32">
      <SectionHeading>{d.sections.publications}</SectionHeading>
    </section>
  );
}
