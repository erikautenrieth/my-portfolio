export interface SkillCategory {
  label: { de: string; en: string };
  skills: { name: string; icon?: string }[];
}

export const skillCategories: SkillCategory[] = [
  {
    label: { de: "AI / LLMs / Agenten", en: "AI / LLMs / Agents" },
    skills: [
      { name: "LangChain", icon: "langchain" },
      { name: "LangGraph", icon: "langgraph" },
      { name: "OpenAI", icon: "openai" },
      { name: "RAG" },
      { name: "Hybrid Search" },
      { name: "Hugging Face", icon: "huggingface" },
      { name: "Prompt Engineering" },
      { name: "Multi-Agent Orchestration" },
      { name: "Langfuse" },
    ],
  },
  {
    label: { de: "ML / Data Science", en: "ML / Data Science" },
    skills: [
      { name: "PyTorch", icon: "pytorch" },
      { name: "scikit-learn", icon: "scikitlearn" },
      { name: "CatBoost" },
      { name: "MLflow", icon: "mlflow" },
      { name: "Pandas", icon: "pandas" },
      { name: "NumPy", icon: "numpy" },
      { name: "Hamilton" },
    ],
  },
  {
    label: { de: "Backend", en: "Backend" },
    skills: [
      { name: "FastAPI", icon: "fastapi" },
      { name: "Spring Boot", icon: "springboot" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "SQLAlchemy", icon: "sqlalchemy" },
      { name: "pgvector" },
      { name: "Kafka", icon: "apachekafka" },
    ],
  },
  {
    label: { de: "Frontend", en: "Frontend" },
    skills: [
      { name: "React", icon: "react" },
      { name: "Redux Toolkit", icon: "redux" },
      { name: "RTK Query", icon: "redux" },
      { name: "MSW" },
      { name: "Vite", icon: "vite" },
      { name: "MUI", icon: "mui" },
      { name: "Next.js", icon: "nextdotjs" },
    ],
  },
  {
    label: { de: "Cloud & DevOps", en: "Cloud & DevOps" },
    skills: [
      { name: "Azure" },
      { name: "AWS" },
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Helm", icon: "helm" },
      { name: "ArgoCD", icon: "argo" },
      { name: "Git", icon: "git" },
      { name: "GitHub Actions", icon: "githubactions" },
    ],
  },
  {
    label: { de: "Qualitätssicherung", en: "Quality Assurance" },
    skills: [
      { name: "Pytest", icon: "pytest" },
      { name: "Vitest", icon: "vitest" },
      { name: "MockServer" },
      { name: "SonarQube", icon: "sonarqube" },
      { name: "Ruff", icon: "ruff" },
      { name: "ESLint", icon: "eslint" },
      { name: "Testcontainers" },
    ],
  },
  {
    label: { de: "Methodik", en: "Methodology" },
    skills: [
      { name: "Agile / Scrum" },
      { name: "CI/CD" },
      { name: "MLOps" },
      { name: "Clean Code" },
      { name: "ADR-based Architecture" },
    ],
  },
];
