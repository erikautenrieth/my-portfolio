import type { ComponentType } from "react";
import {
  SiApachekafka,
  SiArgo,
  SiDocker,
  SiEslint,
  SiFastapi,
  SiGit,
  SiGithubactions,
  SiHelm,
  SiHuggingface,
  SiKubernetes,
  SiLangchain,
  SiLanggraph,
  SiMlflow,
  SiMui,
  SiNextdotjs,
  SiNumpy,
  SiPandas,
  SiPostgresql,
  SiPytest,
  SiPytorch,
  SiReact,
  SiRedux,
  SiRuff,
  SiScikitlearn,
  SiSonarqubeserver,
  SiSpringboot,
  SiSqlalchemy,
  SiVite,
  SiVitest,
} from "@icons-pack/react-simple-icons";

type IconComponent = ComponentType<{ size?: number; color?: string }>;

const icons: Record<string, IconComponent> = {
  apachekafka: SiApachekafka,
  argo: SiArgo,
  docker: SiDocker,
  eslint: SiEslint,
  fastapi: SiFastapi,
  git: SiGit,
  githubactions: SiGithubactions,
  helm: SiHelm,
  huggingface: SiHuggingface,
  kubernetes: SiKubernetes,
  langchain: SiLangchain,
  langgraph: SiLanggraph,
  mlflow: SiMlflow,
  mui: SiMui,
  nextdotjs: SiNextdotjs,
  numpy: SiNumpy,
  pandas: SiPandas,
  postgresql: SiPostgresql,
  pytest: SiPytest,
  pytorch: SiPytorch,
  react: SiReact,
  redux: SiRedux,
  ruff: SiRuff,
  scikitlearn: SiScikitlearn,
  sonarqube: SiSonarqubeserver,
  springboot: SiSpringboot,
  sqlalchemy: SiSqlalchemy,
  vite: SiVite,
  vitest: SiVitest,
};

export function TechIcon({ slug, size = 16 }: { slug?: string; size?: number }) {
  const Icon = slug ? icons[slug] : undefined;
  if (!Icon) {
    // fallback for concepts without a brand icon (RAG, Prompt Engineering, …)
    return (
      <span className="text-cyan-400" style={{ fontSize: size - 2 }} aria-hidden>
        ✦
      </span>
    );
  }
  return <Icon size={size} color="default" />;
}
