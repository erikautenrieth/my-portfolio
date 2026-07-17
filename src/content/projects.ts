import type { Bilingual } from "@/i18n";

export interface Project {
  title: Bilingual;
  problem: Bilingual;
  approach: Bilingual;
  result: Bilingual;
  tech: string[];
  links: { demo?: string; code?: string; paper?: string };
}

export const projects: Project[] = [
  {
    title: {
      de: "ML Stock Prediction",
      en: "ML Stock Prediction",
    },
    problem: {
      de: "Richtungsprognose des S&P 500 (up/down/neutral) auf Basis technischer Indikatoren.",
      en: "Directional forecasting of the S&P 500 (up/down/neutral) based on technical indicators.",
    },
    approach: {
      de: "End-to-End-Pipeline: yfinance/DuckDB für Daten, scikit-learn + LightGBM mit Optuna-Tuning, Experiment-Tracking mit MLflow und Versionierung mit DVC.",
      en: "End-to-end pipeline: yfinance/DuckDB for data, scikit-learn + LightGBM with Optuna tuning, experiment tracking with MLflow and versioning with DVC.",
    },
    result: {
      de: "Live-Dashboard mit Candlestick-Charts, Modell-Prognosen inkl. Konfidenz und Performance-Metriken.",
      en: "Live dashboard with candlestick charts, model predictions incl. confidence and performance metrics.",
    },
    tech: ["Python", "scikit-learn", "LightGBM", "Optuna", "MLflow", "DVC", "DuckDB", "Streamlit"],
    links: {
      demo: "https://ml-stock-pred.streamlit.app",
      code: "https://github.com/erikautenrieth/ml-stock-prediction",
    },
  },
  {
    title: {
      de: "Strukturierung klinischer Freitextdaten mit LLMs",
      en: "Structuring clinical free-text data with LLMs",
    },
    problem: {
      de: "Klinische Informationen liegen als unstrukturierter Freitext vor und sind für Analysen nicht nutzbar.",
      en: "Clinical information exists as unstructured free text and cannot be used for analysis.",
    },
    approach: {
      de: "LLM-Pipeline auf HPC-Infrastruktur mit Prompt Engineering, Few-Shot Learning und systematischer Evaluierung der Extraktionsqualität.",
      en: "LLM pipeline on HPC infrastructure with prompt engineering, few-shot learning and systematic evaluation of extraction quality.",
    },
    result: {
      de: "Masterarbeit, Note 1,5 — automatisierte Strukturierungspipeline für klinische Daten.",
      en: "Master's thesis, grade 1.5 — automated structuring pipeline for clinical data.",
    },
    tech: ["LLMs", "Prompt Engineering", "Few-Shot Learning", "HPC", "Python"],
    links: {},
  },
  {
    title: {
      de: "QSM-Pipeline: Eisenkonzentration im Gehirn",
      en: "QSM pipeline: brain iron concentration",
    },
    problem: {
      de: "Quantifizierung von Eisenkonzentrationen im Gehirn von ADHS-Patienten aus MRT-Daten.",
      en: "Quantifying iron concentrations in the brains of ADHD patients from MRI data.",
    },
    approach: {
      de: "Automatisierte Python-Pipeline für Quantitative Susceptibility Mapping (QSM) mit reproduzierbarer Auswertung.",
      en: "Automated Python pipeline for quantitative susceptibility mapping (QSM) with reproducible analysis.",
    },
    result: {
      de: "Publiziert in Frontiers in Psychiatry (2026).",
      en: "Published in Frontiers in Psychiatry (2026).",
    },
    tech: ["Python", "NumPy", "Pandas", "nibabel", "MRI"],
    links: {
      paper: "https://doi.org/10.3389/fpsyt.2026.1735191",
    },
  },
];
