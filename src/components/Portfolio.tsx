import type { Lang } from "@/i18n";
import { dict } from "@/i18n";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { SceneLoader } from "@/components/three/SceneLoader";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Publications } from "@/components/sections/Publications";
import { Contact } from "@/components/sections/Contact";

export function Portfolio({ lang }: { lang: Lang }) {
  const s = dict[lang].sections;
  const annotations = [
    s.about,
    s.projects,
    s.experience,
    s.skills,
    s.education,
    s.publications,
    s.contact,
  ].map((label) => ({ label }));

  return (
    <SmoothScroll>
      <main className="relative flex-1">
        <SceneLoader annotations={annotations} />
        <CustomCursor />
        <LanguageToggle lang={lang} />
        <Hero lang={lang} />
        <About lang={lang} />
        <Projects lang={lang} />
        <Experience lang={lang} />
        <Skills lang={lang} />
        <Education lang={lang} />
        <Publications lang={lang} />
        <Contact lang={lang} />
      </main>
    </SmoothScroll>
  );
}
