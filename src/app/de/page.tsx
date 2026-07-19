import type { Metadata } from "next";
import { Portfolio } from "@/components/Portfolio";

export const metadata: Metadata = {
  title: "Erik Autenrieth — AI Engineer & Data Scientist",
  description:
    "AI Engineer und Data Scientist. Baut LLM-Agenten, RAG-Systeme und MLOps-Pipelines, die in Produktion laufen. Full-Stack inklusive.",
  alternates: {
    canonical: "/de",
    languages: { en: "/", de: "/de" },
  },
};

export default function GermanPage() {
  return <Portfolio lang="de" />;
}
