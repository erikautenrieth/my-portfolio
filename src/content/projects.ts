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
      de: "S&P-500-Richtung (up/down/neutral) aus technischen Indikatoren vorhersagen, reproduzierbar und vollständig nachvollziehbar.",
      en: "Predict S&P 500 direction (up/down/neutral) from technical indicators with a reproducible, tracked ML pipeline.",
    },
    approach: {
      de: "End-to-End-Pipeline mit yfinance/DuckDB, LightGBM + Optuna-Tuning, MLflow für Experiment-Tracking und DVC für Datenversionierung.",
      en: "End-to-end pipeline with yfinance/DuckDB for data, LightGBM + Optuna for tuning, MLflow for experiment tracking, and DVC for data versioning.",
    },
    result: {
      de: "Streamlit-Dashboard mit Candlestick-Charts, Richtungsprognosen inkl. Konfidenz und Live-Performance-Metriken, live deployed.",
      en: "Deployed Streamlit dashboard showing candlestick charts, directional predictions with confidence scores, and live performance metrics.",
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
      de: "Klinische Befunde stecken als Freitext in Datenbanken: für jede Analyse manuell aufwändig, nicht skalierbar.",
      en: "Clinical records locked in unstructured free text, inaccessible for downstream analysis or research.",
    },
    approach: {
      de: "LLM-Inferenz auf HPC betrieben, Prompt Engineering und Few-Shot-Beispiele iteriert, Evaluierungsframework für Extraktionsqualität gebaut.",
      en: "Ran LLM inference on HPC, iterated on prompt engineering and few-shot examples, and built a systematic evaluation framework to measure extraction quality.",
    },
    result: {
      de: "Masterarbeit mit Note 1,5 abgeschlossen. Funktionierende Strukturierungspipeline für klinischen Freitext geliefert.",
      en: "Master's thesis graded 1.5. Delivered a working structuring pipeline for clinical free-text data.",
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
      de: "Regionale Eisenkonzentrationen im Gehirn von ADHS-Patienten aus 3T-MRT-Daten messen, ohne manuelle Bildverarbeitung.",
      en: "Measure regional brain iron concentrations in ADHD patients from 3T MRI data, with no manual image processing.",
    },
    approach: {
      de: "Komplette QSM-Verarbeitungskette in Python automatisiert: von Roh-MRT bis zu quantifizierten Suszeptibilitätskarten, vollständig reproduzierbar.",
      en: "Automated the full QSM processing chain in Python, from raw MRI to quantified susceptibility maps, with fully reproducible outputs.",
    },
    result: {
      de: "Peer-reviewed und veröffentlicht in Frontiers in Psychiatry (2026).",
      en: "Peer-reviewed and published in Frontiers in Psychiatry (2026).",
    },
    tech: ["Python", "NumPy", "Pandas", "nibabel", "MRI"],
    links: {
      paper: "https://doi.org/10.3389/fpsyt.2026.1735191",
    },
  },
];
