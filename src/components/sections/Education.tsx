import type { Lang } from "@/i18n";
import { dict } from "@/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Education({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="education" className="mx-auto max-w-6xl px-6 py-32">
      <SectionHeading>{d.sections.education}</SectionHeading>
    </section>
  );
}
