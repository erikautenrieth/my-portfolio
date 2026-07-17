import type { Lang } from "@/i18n";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SceneLoader } from "@/components/three/SceneLoader";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { DnaTrail } from "@/components/cursor/DnaTrail";
import { MoleculeParticles } from "@/components/cursor/MoleculeParticles";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Publications } from "@/components/sections/Publications";
import { Contact } from "@/components/sections/Contact";

export function Portfolio({ lang }: { lang: Lang }) {
  const sections = [
    <About key="about" lang={lang} />,
    <Projects key="projects" lang={lang} />,
    <Experience key="experience" lang={lang} />,
    <Skills key="skills" lang={lang} />,
    <Education key="education" lang={lang} />,
    <Publications key="publications" lang={lang} />,
    <Contact key="contact" lang={lang} />,
  ];

  return (
    <SmoothScroll>
      <main className="relative flex-1">
        <SceneLoader />
        <MoleculeParticles />
        <DnaTrail />
        <CustomCursor />
        <LanguageToggle lang={lang} />
        <Hero lang={lang} />
        {sections.map((section, i) => (
          <SectionReveal key={i}>{section}</SectionReveal>
        ))}
      </main>
    </SmoothScroll>
  );
}
