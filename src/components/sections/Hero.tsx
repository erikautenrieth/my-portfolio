import type { Lang } from "@/i18n";
import { dict } from "@/i18n";

export function Hero({ lang }: { lang: Lang }) {
  const d = dict[lang];
  return (
    <section id="hero" className="relative flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-6xl px-6">
        <p className="mb-4 font-mono text-sm tracking-[0.35em] text-cyan-400">{d.hero.kicker}</p>
        <h1 className="font-display text-6xl font-bold leading-[1.02] md:text-8xl">
          <span className="bg-gradient-to-r from-slate-200 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            {d.hero.name}
          </span>
        </h1>
        <p className="mt-6 font-mono text-sm text-slate-400 md:text-base">
          {d.hero.titles.join(" · ")}
        </p>
      </div>
    </section>
  );
}
