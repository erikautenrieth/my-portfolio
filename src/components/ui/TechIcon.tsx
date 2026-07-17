import type { ComponentType } from "react";
import {
  SiAnthropic,
  SiApachekafka,
  SiArgo,
  SiCircleci,
  SiDocker,
  SiEslint,
  SiFastapi,
  SiGit,
  SiGithubactions,
  SiGitlab,
  SiGrafana,
  SiHelm,
  SiHuggingface,
  SiKubernetes,
  SiLangchain,
  SiLanggraph,
  SiMilvus,
  SiMlflow,
  SiMockserviceworker,
  SiMui,
  SiNextdotjs,
  SiNumpy,
  SiOpentelemetry,
  SiPandas,
  SiPostgresql,
  SiPrometheus,
  SiPytest,
  SiPytorch,
  SiPython,
  SiReact,
  SiRedis,
  SiRedux,
  SiRuff,
  SiScikitlearn,
  SiSonarqubeserver,
  SiSpringboot,
  SiSqlalchemy,
  SiTerraform,
  SiTypescript,
  SiVite,
  SiVitest,
} from "@icons-pack/react-simple-icons";

type IconComponent = ComponentType<{ size?: number; color?: string }>;

const icons: Record<string, IconComponent> = {
  anthropic: SiAnthropic,
  apachekafka: SiApachekafka,
  argo: SiArgo,
  circleci: SiCircleci,
  docker: SiDocker,
  eslint: SiEslint,
  fastapi: SiFastapi,
  git: SiGit,
  githubactions: SiGithubactions,
  gitlab: SiGitlab,
  grafana: SiGrafana,
  helm: SiHelm,
  huggingface: SiHuggingface,
  kubernetes: SiKubernetes,
  langchain: SiLangchain,
  langgraph: SiLanggraph,
  milvus: SiMilvus,
  mlflow: SiMlflow,
  mockserviceworker: SiMockserviceworker,
  mui: SiMui,
  nextdotjs: SiNextdotjs,
  numpy: SiNumpy,
  opentelemetry: SiOpentelemetry,
  pandas: SiPandas,
  postgresql: SiPostgresql,
  prometheus: SiPrometheus,
  pytest: SiPytest,
  pytorch: SiPytorch,
  python: SiPython,
  react: SiReact,
  redis: SiRedis,
  redux: SiRedux,
  ruff: SiRuff,
  scikitlearn: SiScikitlearn,
  sonarqube: SiSonarqubeserver,
  springboot: SiSpringboot,
  sqlalchemy: SiSqlalchemy,
  terraform: SiTerraform,
  typescript: SiTypescript,
  vite: SiVite,
  vitest: SiVitest,
};

export function TechIcon({ slug, size = 16 }: { slug?: string; size?: number }) {
  const Icon = slug ? icons[slug] : undefined;
  if (!Icon) {
    return (
      <span className="text-cyan-400" style={{ fontSize: size - 2 }} aria-hidden>
        ✦
      </span>
    );
  }
  return <Icon size={size} color="default" />;
}
