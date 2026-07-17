import type { Lang } from "@/i18n";
import { dict } from "@/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Contact({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-32">
      <SectionHeading>{d.contact.heading}</SectionHeading>
      <p className="max-w-xl text-slate-300">{d.contact.text}</p>
      <footer className="mt-24 font-mono text-xs text-slate-500">{d.footer}</footer>
    </section>
  );
}
