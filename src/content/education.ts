import type { Bilingual } from "@/i18n";

export interface EducationEntry {
  period: string;
  degree: Bilingual;
  institution: string;
  grade: string;
  thesis: Bilingual;
  thesisGrade: string;
}

export const education: EducationEntry[] = [
  {
    period: "10/2022 — 01/2025",
    degree: { de: "M.Sc. Informatik", en: "M.Sc. Computer Science" },
    institution: "Hochschule Bonn-Rhein-Sieg",
    grade: "1,4",
    thesis: {
      de: "Strukturierung von klinischen Freitextdaten mit LLMs",
      en: "Structuring clinical free-text data with LLMs",
    },
    thesisGrade: "1,5",
  },
  {
    period: "09/2019 — 09/2022",
    degree: { de: "B.Sc. Informatik", en: "B.Sc. Computer Science" },
    institution: "Hochschule Bonn-Rhein-Sieg",
    grade: "2,1",
    thesis: {
      de: "Aktienkursvorhersage mit ML-Modellen",
      en: "Stock price prediction with ML models",
    },
    thesisGrade: "1,0",
  },
];
