export interface Publication {
  authors: string;
  year: number;
  title: string;
  venue: string;
  doi: string;
}

export const publications: Publication[] = [
  {
    authors: "Schulze, Autenrieth, et al.",
    year: 2026,
    title: "Quantitative susceptibility mapping of brain iron in adult ADHD",
    venue: "Front. Psychiatry 17:1735191",
    doi: "10.3389/fpsyt.2026.1735191",
  },
  {
    authors: "Autenrieth",
    year: 2024,
    title:
      "Vergleich von Open Source MLOps Tools zur Unterstützung von Machine Learning basierten Zeitreihenanalysen",
    venue: "Publikationsserver H-BRS",
    doi: "10.18418/opus-7847",
  },
];
