"use client";

import Link from "next/link";
import type { Lang } from "@/i18n";
import { dict } from "@/i18n";

const NAV_ITEMS = [
  { key: "about", href: "#about" },
  { key: "projects", href: "#projects" },
  { key: "experience", href: "#experience" },
  { key: "skills", href: "#skills" },
  { key: "contact", href: "#contact" },
] as const;

export function Navbar({ lang }: { lang: Lang }) {
  const d = dict[lang];
  const target = lang === "en" ? "/de" : "/";
  const label = lang === "en" ? "DE" : "EN";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 font-mono text-xs font-bold text-cyan-400">
            EA
          </span>
        </div>

        <div className="flex items-center gap-6 md:gap-8">
          <ul className="hidden items-center gap-6 font-mono text-xs tracking-widest text-slate-400 md:flex">
            {NAV_ITEMS.map(({ key, href }) => (
              <li key={key}>
                <a href={href} className="transition-colors hover:text-cyan-400">
                  {d.sections[key as keyof typeof d.sections]?.toUpperCase() ??
                    key.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href={target}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 font-mono text-xs tracking-widest text-slate-400 transition-colors hover:border-cyan-400/40 hover:text-cyan-400"
            aria-label={lang === "en" ? "Zur deutschen Version" : "Switch to English version"}
          >
            {label}
          </Link>
        </div>
      </nav>
    </header>
  );
}
