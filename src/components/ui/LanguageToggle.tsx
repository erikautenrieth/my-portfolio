import Link from "next/link";
import type { Lang } from "@/i18n";

export function LanguageToggle({ lang }: { lang: Lang }) {
  const target = lang === "en" ? "/de" : "/";
  const label = lang === "en" ? "DE" : "EN";
  return (
    <Link
      href={target}
      className="fixed top-6 right-6 z-50 font-mono text-sm tracking-widest text-slate-400 hover:text-cyan-400 transition-colors"
      aria-label={lang === "en" ? "Zur deutschen Version" : "Switch to English version"}
    >
      {label}
    </Link>
  );
}
