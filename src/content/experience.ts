import type { Bilingual } from "@/i18n";

export interface ClientProject {
  client: Bilingual;
  title: Bilingual;
  bullets: Bilingual[];
}

export interface ExperienceEntry {
  period: string;
  role: Bilingual;
  company: string;
  projects?: ClientProject[];
  bullets?: Bilingual[];
  compact?: boolean;
}

export const experience: ExperienceEntry[] = [
  {
    period: "03/2025 — heute",
    role: {
      de: "Full Stack Developer / Data Scientist",
      en: "Full Stack Developer / Data Scientist",
    },
    company: "SprintEins, Bonn",
    projects: [
      {
        client: {
          de: "Globaler Automobilhersteller",
          en: "Global automotive manufacturer",
        },
        title: {
          de: "AI-Agent für Zertifizierungsprozesse",
          en: "AI agent for certification processes",
        },
        bullets: [
          {
            de: "Architektur und Entwicklung eines LangGraph-basierten AI-Agenten mit Tool-Calling, Middleware-Stack und persistenter Zustandsverwaltung",
            en: "Architected and built a LangGraph-based AI agent with tool calling, middleware stack and persistent state management",
          },
          {
            de: "Hybrid-Search-RAG-System mit pgvector; Datenpipelines mit Hamilton für XML-Parsing, LLM-Summarisierung und Embedding-Generierung",
            en: "Hybrid search RAG system with pgvector; data pipelines with Hamilton for XML parsing, LLM summarisation and embedding generation",
          },
          {
            de: "Observability-Stack mit Langfuse (LLM-Tracing, Token- und Kosten-Monitoring) plus Evaluationssystem für automatisierte Regressionstests",
            en: "Observability stack with Langfuse (LLM tracing, token and cost monitoring) plus an evaluation system for automated regression testing",
          },
          {
            de: "Produktives Deployment auf AWS-Kubernetes mit Helm, ArgoCD und Horizontal Pod Autoscaling",
            en: "Production deployment on AWS Kubernetes with Helm, ArgoCD and horizontal pod autoscaling",
          },
        ],
      },
      {
        client: {
          de: "Internationaler Logistikkonzern",
          en: "International logistics group",
        },
        title: {
          de: "Logistik-Plattform mit ML-Klassifizierung",
          en: "Logistics platform with ML classification",
        },
        bullets: [
          {
            de: "ML-Klassifizierungsservice (Python, FastAPI, scikit-learn) zur automatischen Vorhersage von Sendungskategorien und -attributen",
            en: "ML classification service (Python, FastAPI, scikit-learn) automatically predicting shipment categories and attributes",
          },
          {
            de: "React-Frontend mit Redux Toolkit, RTK Query und MUI inkl. Barcode-Scanning und mehrstufiger Sendungsrecherche",
            en: "React frontend with Redux Toolkit, RTK Query and MUI including barcode scanning and multi-level shipment search",
          },
          {
            de: "Spring-Boot-Backend mit Liquibase-Migrationen und CI/CD über Azure Pipelines",
            en: "Spring Boot backend with Liquibase migrations and CI/CD via Azure Pipelines",
          },
        ],
      },
    ],
  },
  {
    period: "05/2023 — 12/2024",
    role: { de: "Software Developer", en: "Software Developer" },
    company: "ZB MED, Bonn",
    bullets: [
      {
        de: "Konzeption und Implementierung eines cloudbasierten MLOps-Systems für Text-Mining mit MLflow, Ray AI, AutoML, Docker und GitHub Actions",
        en: "Designed and implemented a cloud-based MLOps system for text mining with MLflow, Ray AI, AutoML, Docker and GitHub Actions",
      },
      {
        de: "Automatisierte Strukturierung klinischer Daten mit LLMs auf HPC-Infrastruktur (Masterarbeit): Prompt Engineering, Few-Shot Learning, systematische Evaluierung",
        en: "Automated structuring of clinical data with LLMs on HPC infrastructure (master's thesis): prompt engineering, few-shot learning, systematic evaluation",
      },
      {
        de: "Feature-Entwicklung mit React für den „Health Study Hub“, eine Plattform für medizinische Publikationen",
        en: "Feature development with React for the “Health Study Hub”, a platform for medical publications",
      },
    ],
  },
  {
    period: "11/2022 — 10/2023",
    role: { de: "Wissenschaftliche Hilfskraft", en: "Research Assistant" },
    company: "Universitätsklinikum Bonn",
    compact: true,
    bullets: [
      {
        de: "Automatisierte Python-Pipeline für Quantitative Susceptibility Mapping (QSM) — Grundlage der Frontiers-Publikation 2026",
        en: "Automated Python pipeline for quantitative susceptibility mapping (QSM) — basis of the 2026 Frontiers publication",
      },
    ],
  },
  {
    period: "04/2022 — 02/2025",
    role: { de: "Wissenschaftliche Hilfskraft", en: "Teaching Assistant" },
    company: "Hochschule Bonn-Rhein-Sieg",
    compact: true,
    bullets: [
      {
        de: "Erstellung und Betreuung von Assignments im Modul „Scientific Programming with Python“ (SciPy, scikit-learn, Pandas, NumPy)",
        en: "Created and supervised assignments for “Scientific Programming with Python” (SciPy, scikit-learn, Pandas, NumPy)",
      },
    ],
  },
  {
    period: "02/2022 — 05/2022",
    role: { de: "Data-Science-Praktikum", en: "Data Science Internship" },
    company: "Universitätsklinikum Bonn",
    compact: true,
    bullets: [
      {
        de: "Python-Pipelines zur MRT-Bildanalyse mit FSL, AFNI und MATLAB-Preprocessing",
        en: "Python pipelines for MRI image analysis with FSL, AFNI and MATLAB preprocessing",
      },
    ],
  },
];
