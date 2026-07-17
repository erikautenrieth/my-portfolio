import type { Lang } from "@/i18n";
import { dict } from "@/i18n";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

export function Portfolio({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <main className="flex-1">
      <LanguageToggle lang={lang} />
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <h1 className="font-display text-5xl">{d.hero.name}</h1>
      </section>
      {(
        [
          ["about", d.sections.about],
          ["projects", d.sections.projects],
          ["experience", d.sections.experience],
          ["skills", d.sections.skills],
          ["education", d.sections.education],
          ["publications", d.sections.publications],
          ["contact", d.sections.contact],
        ] as const
      ).map(([id, label]) => (
        <section key={id} id={id} className="min-h-screen flex items-center justify-center">
          <h2 className="font-display text-3xl text-cyan-400">{label}</h2>
        </section>
      ))}
    </main>
  );
}
