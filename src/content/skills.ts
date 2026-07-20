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
      { name: "Anthropic", icon: "anthropic" },
      { name: "OpenAI", icon: "openrouter" },
      { name: "RAG", icon: "elasticsearch" },
      { name: "Hybrid Search", icon: "algolia" },
      { name: "Hugging Face", icon: "huggingface" },
      { name: "Prompt Engineering", icon: "chatbot" },
      { name: "Multi-Agent Orchestration", icon: "crewai" },
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
      { name: "Python", icon: "python" },
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
      { name: "pgvector", icon: "milvus" },
      { name: "Kafka", icon: "apachekafka" },
      { name: "Redis", icon: "redis" },
      { name: "Python", icon: "python" },
    ],
  },
  {
    label: { de: "Frontend", en: "Frontend" },
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Redux Toolkit", icon: "redux" },
      { name: "RTK Query", icon: "redux" },
      { name: "MSW", icon: "mockserviceworker" },
      { name: "Vite", icon: "vite" },
      { name: "MUI", icon: "mui" },
    ],
  },
  {
    label: { de: "Cloud & Infrastruktur", en: "Cloud & Infrastructure" },
    skills: [
      { name: "Azure" },
      { name: "AWS" },
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Helm", icon: "helm" },
      { name: "ArgoCD", icon: "argo" },
      { name: "Terraform", icon: "terraform" },
    ],
  },
  {
    label: { de: "CI/CD & Observability", en: "CI/CD & Observability" },
    skills: [
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "GitLab CI", icon: "gitlab" },
      { name: "Git", icon: "git" },
      { name: "Grafana", icon: "grafana" },
      { name: "Prometheus", icon: "prometheus" },
      { name: "OpenTelemetry", icon: "opentelemetry" },
    ],
  },
  {
    label: { de: "Qualitätssicherung", en: "Quality Assurance" },
    skills: [
      { name: "Pytest", icon: "pytest" },
      { name: "Vitest", icon: "vitest" },
      { name: "MSW", icon: "mockserviceworker" },
      { name: "MockServer", icon: "testinglibrary" },
      { name: "SonarQube", icon: "sonarqube" },
      { name: "Ruff", icon: "ruff" },
      { name: "ESLint", icon: "eslint" },
      { name: "Testcontainers", icon: "docker" },
    ],
  },
  {
    label: { de: "Methodik", en: "Methodology" },
    skills: [
      { name: "Agile / Scrum", icon: "jira" },
      { name: "MLOps" },
      { name: "Clean Code" },
      { name: "TDD" },
      { name: "ADR-based Architecture" },
      { name: "Domain-Driven Design" },
    ],
  },
  {
    label: { de: "Agentic Development", en: "Agentic Development" },
    skills: [
      { name: "Claude Code", icon: "claude" },
      { name: "MCP", icon: "modelcontextprotocol" },
      { name: "CodeGraph", icon: "neo4j" },
      { name: "Cursor", icon: "cursor" },
      { name: "GitHub Copilot", icon: "githubcopilot" },
      { name: "Skills", icon: "zap" },
      { name: "Windsurf", icon: "windsurf" },
    ],
  },
];
