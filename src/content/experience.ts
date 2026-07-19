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
            de: "LangGraph-Agenten mit Tool-Calling, Middleware-Stack und persistenter Zustandsverwaltung entworfen und gebaut: das zentrale Laufzeitsystem für automatisierte Zertifizierungsabläufe",
            en: "Architected a LangGraph agent with tool calling, a middleware stack, and persistent state as the core runtime for automated certification workflows",
          },
          {
            de: "Hybrid-Search-RAG auf pgvector gebaut; Hamilton-Pipelines für XML-Ingest, LLM-Summarisierung und Embedding-Generierung",
            en: "Built a hybrid-search RAG system on pgvector with Hamilton pipelines covering XML ingestion, LLM summarisation, and embedding generation",
          },
          {
            de: "Langfuse-Observability eingerichtet (End-to-End-LLM-Tracing, Token- und Kostenmonitoring) und automatisierten Evaluations-Harness für Agenten-Regressionstests gebaut",
            en: "Wired up Langfuse for end-to-end LLM tracing and cost monitoring, then built an automated evaluation harness for regression testing agent outputs",
          },
          {
            de: "System auf AWS-Kubernetes ausgerollt: Helm-Charts, ArgoCD-GitOps und HPA für Produktionslast konfiguriert",
            en: "Shipped to AWS Kubernetes via Helm and ArgoCD, with HPA configured for production traffic",
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
            de: "ML-Klassifizierungsservice mit FastAPI und scikit-learn gebaut, der Sendungskategorien und -attribute automatisch bei Eingang erkennt",
            en: "Built a FastAPI/scikit-learn classification service that predicts shipment categories and attributes automatically at intake",
          },
          {
            de: "React-Frontend mit Redux Toolkit, RTK Query und MUI geliefert, inkl. Barcode-Scanning und mehrstufiger Sendungsrecherche",
            en: "Delivered a React/Redux Toolkit frontend with RTK Query, MUI, barcode scanning, and multi-level shipment search",
          },
          {
            de: "Spring-Boot-Backend mit Liquibase-Schema-Migrationen und vollständiger CI/CD-Pipeline über Azure Pipelines betreut",
            en: "Maintained a Spring Boot backend with Liquibase schema migrations, wired into a full CI/CD flow on Azure Pipelines",
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
        de: "Cloud-MLOps-Plattform für biomedizinisches Text-Mining entworfen und umgesetzt: MLflow, Ray AI, AutoML, Docker, GitHub Actions",
        en: "Designed and built a cloud MLOps platform for biomedical text mining: MLflow, Ray AI, AutoML, Docker, and GitHub Actions",
      },
      {
        de: "Masterarbeit (Note 1,5): LLM-Pipeline auf HPC gebaut, die klinischen Freitext automatisch strukturiert. Prompt Engineering und Few-Shot-Learning systematisch evaluiert",
        en: "Master's thesis (grade 1.5): built an LLM pipeline on HPC to automatically structure clinical free-text using prompt engineering and few-shot techniques",
      },
      {
        de: "React-Features für den \"Health Study Hub\" entwickelt, eine Publikationsplattform für medizinische Forschende bei ZB MED",
        en: "Shipped React features for the Health Study Hub, a publication discovery platform for medical researchers",
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
        de: "Automatisierte Python-Pipeline für Quantitative Susceptibility Mapping (QSM) gebaut, Grundlage der Frontiers-in-Psychiatry-Publikation 2026",
        en: "Built the automated QSM pipeline in Python that produced the reproducible MRI analysis underlying the 2026 Frontiers in Psychiatry publication",
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
        de: "Assignments im Modul \"Scientific Programming with Python\" konzipiert und betreut (SciPy, scikit-learn, Pandas, NumPy)",
        en: "Designed and graded assignments for Scientific Programming with Python, covering SciPy, scikit-learn, Pandas, and NumPy",
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
        de: "Python-Pipelines zur MRT-Bildanalyse entwickelt, Preprocessing mit FSL, AFNI und MATLAB",
        en: "Built Python pipelines for MRI image analysis using FSL, AFNI, and MATLAB preprocessing",
      },
    ],
  },
];
