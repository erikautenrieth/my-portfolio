import type { Metadata } from "next";
import { Portfolio } from "@/components/Portfolio";

export const metadata: Metadata = {
  title: "Erik Autenrieth — AI Engineer",
  description:
    "AI Engineer · Data Scientist · Full Stack Developer. LLM-Agenten, RAG-Systeme, MLOps und Full-Stack-Entwicklung.",
  alternates: {
    canonical: "/de",
    languages: { en: "/", de: "/de" },
  },
};

export default function GermanPage() {
  return <Portfolio lang="de" />;
}
