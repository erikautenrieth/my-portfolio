# Portfolio-Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ein visuell spektakuläres One-Pager-Portfolio (Dark Bio-Tech-Style) für Erik Autenrieth mit 3D-**Neural-DNA** (KI-Signale, die in einer DNA-Helix leben), Scroll-Kamerafahrt, Custom-Cursor mit Klick-Effekten, animierten Tech-Logos und DE/EN-Umschalter – gehostet auf GitHub Pages unter `erikautenrieth.github.io/my-portfolio`.

**Architecture:** Next.js 15 (App Router) mit statischem Export (`output: 'export'`, `basePath: '/my-portfolio'`). Zwei prerenderte Routen (`/` = EN, `/de` = DE) rendern dieselbe `<Portfolio lang>`-Komponente – Sprache ist Framework-Routing statt Client-State. Ein fixiertes Fullscreen-`<Canvas>` (React Three Fiber) liegt hinter dem Content; der Scroll-Fortschritt (Motion-`useScroll`-MotionValue, geglättet durch Lenis) steuert die 3D-Kamera. Content und Übersetzungen liegen als typisierte Datenobjekte in `src/content/`.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4.1, Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing, Motion (`motion/react`), Lenis (`lenis/react`), @icons-pack/react-simple-icons, GitHub Actions → GitHub Pages.

**Leitprinzip: Framework-Funktionen vor Eigenbau.** Tailwind-Palette & -Utilities statt eigener Hexwerte/CSS-Dateien, drei-Helper statt manuellem Three.js-Boilerplate, Motion-Hooks (`useScroll`, `useSpring`, `useReducedMotion`) statt eigener rAF/lerp-Logik, Next-Datei-Konventionen (`icon.svg`, `opengraph-image.png`) statt manueller Meta-Tags.

---

## Design-Zusammenfassung (aus Brainstorming, freigegeben)

- **Look:** Dark Sci-Fi / Bio-Tech. Farben direkt aus der Tailwind-Palette: Hintergrund `slate-950`, Neon-Akzente `cyan-400` + `violet-400` – keine eigenen Hexwerte, dadurch volle Utility-Unterstützung (`text-cyan-400`, `shadow-cyan-400/50`, `from-cyan-400`, …). Glassmorphism-Karten, Monospace-Akzentfont. **Dark-only: bewusst kein Light Mode und kein Theme-Toggle** (`color-scheme: dark`, kein `prefers-color-scheme`-Handling).
- **Fonts:** Space Grotesk (Headlines), Inter (Body), JetBrains Mono (Akzente/Labels) – alle via `next/font` self-hosted.
- **3D-Herzstück – „Neural-DNA" (AI in der DNA):** Rotierende DNA-Doppelhelix, deren Basenpaar-Sprossen **Synapsen eines neuronalen Netzes** sind: dünne halbtransparente Verbindungen mit pulsierenden Knoten. Helle **Signal-Pulse** wandern die Stränge entlang und „feuern" über die Synapsen; durch die Helix-Achse fließt ein feiner **AI-Datenstrom** nach oben. Bewusst schlicht: dunkler Void, sparsames Sternenfeld, Glow (Bloom) nur auf Pulsen und Knoten. Reagiert auf Mausposition (Parallax) und Scroll (Kamerafahrt entlang der Helix). Style-Referenz: `prototype/neural-dna.html`.
- **Custom Cursor:** Eigener Cursor-Dot + Trailing-Ring, magnetischer Hover auf Links/Buttons, **Klick löst Schockwellen-Ripple + Partikel-Burst aus**.
- **Sektionen (Scroll-Reihenfolge):**
  1. **Hero** – Name, Titel („AI Engineer · Data Scientist · Full Stack Developer" – in dieser Reihenfolge), Stagger-Text-Animation, Neural-DNA fullscreen
  2. **About** – Kurzprofil (3–4 Sätze), GitHub/LinkedIn-Links
  3. **Projects / Case Studies** – eigene Projekte im Format **Problem → Ansatz → Ergebnis**: ML Stock Prediction (Live-Demo + GitHub), LLM-Masterarbeit, QSM-Publikation
  4. **Experience** – Vertikale Timeline mit Glassmorphism-Karten; Projekte **anonymisiert** („Globaler Automobilhersteller", „Internationaler Logistikkonzern")
  5. **Skills** – Tech-Logos in animierten Marquee-Reihen pro Kategorie (Details unten)
  6. **Education** – Master (1,4) + Bachelor mit Abschlussarbeiten
  7. **Publications** – 2 Publikationen mit DOI-Links
  8. **Contact/Footer** – GitHub + LinkedIn mit Glow-Hover
- **i18n:** DE/EN über zwei prerenderte Routen (`/` = EN, `/de/` = DE). Der Toggle oben rechts ist ein simpler `next/link` auf die Gegenroute – kein Context, kein localStorage, keine Hydration-Probleme, und **beide Sprachen stehen komplett im statischen HTML** (SEO). `hreflang`-Alternates via Metadata API.
- **Content-Prinzipien (kein Fluff):** Positionierung in dieser Reihenfolge: **1. AI Engineer, 2. Data Scientist, 3. Full Stack Developer**. Nur marktrelevante Inhalte prominent: AI-Agenten/LLM-Engineering (LangGraph, RAG, Evals, Observability) > ML/MLOps > Full-Stack-Delivery. Nebenstationen (HiWi-Jobs, Praktikum) nur als Kompakt-Einträge; Details ohne Signalwert (z. B. Bewertungsvorlagen, Android-Lehr-App) entfallen. Jeder Bullet nennt Tech + Ergebnis, keine Füllwörter. **Eigene Projekte mit einsehbarem Code/Live-Demo sind das Herzstück** – sie zeigen, was anonymisierte Kundenprojekte nicht zeigen können.
- **Accessibility/Performance:** `useReducedMotion` (Motion) → statisches Fallback; Auflösung/Qualität regelt drei automatisch via `<AdaptiveDpr>` + `<PerformanceMonitor>`.

### Skills-Sektion mit Tech-Logos (Kern-Feature-Wunsch)

Pro Kategorie eine **unendlich scrollende Marquee-Reihe** aus glühenden Logo-Chips (SVG-Logo + Name), Reihen laufen abwechselnd links/rechts, pausieren + leuchten auf Hover. Logos via `@icons-pack/react-simple-icons` – fertige React-Komponenten der simple-icons-Library inkl. Markenfarben (kein eigener SVG-Wrapper nötig). Konzepte ohne Logo (RAG, Prompt Engineering, Scrum, …) werden als gestylte Text-Chips mit Funkel-Icon gerendert.

**Kategorien & Inhalte:**

| Kategorie | Skills |
|---|---|
| AI / LLMs / Agenten | LangChain, LangGraph, OpenAI, RAG, Hybrid Search, Hugging Face, Prompt Engineering, Multi-Agent-Orchestrierung, Langfuse |
| ML / Data Science | PyTorch, scikit-learn, CatBoost, MLflow, Pandas, NumPy, Hamilton |
| Backend | FastAPI, Spring Boot, PostgreSQL, SQLAlchemy, pgvector, Kafka |
| Frontend | React, Redux Toolkit, RTK Query, MSW, Vite, MUI, Next.js |
| Cloud & DevOps | Azure, AWS, Docker, Kubernetes, Helm, ArgoCD, Git, GitHub Actions |
| Qualitätssicherung | Pytest, Vitest, MockServer, SonarQube, Ruff, ESLint, Testcontainers |
| Methodik | Agile Entwicklung, Scrum, CI/CD, MLOps, Clean Code, ADR-basierte Architekturentscheidungen |

**Publikationen:**

- Schulze, Autenrieth, et al. (2026): *Quantitative susceptibility mapping of brain iron in adult ADHD*. Front. Psychiatry 17:1735191. DOI: 10.3389/fpsyt.2026.1735191
- Autenrieth (2024): *Vergleich von Open Source MLOps Tools zur Unterstützung von Machine Learning basierten Zeitreihenanalysen*. Publikationsserver H-BRS. DOI: 10.18418/opus-7847

---

## Dateistruktur (Zielzustand)

```
my-portfolio/
├── .github/workflows/deploy.yml        # GitHub Pages Deployment
├── next.config.ts                      # output: 'export', basePath
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Fonts (next/font), Metadata API, <ReactLenis root>
│   │   ├── page.tsx                    # EN-Route → <Portfolio lang="en">
│   │   ├── de/page.tsx                 # DE-Route → <Portfolio lang="de">
│   │   ├── icon.svg                    # Favicon (Next-Datei-Konvention)
│   │   ├── opengraph-image.png         # OG-Bild (Next-Datei-Konvention)
│   │   └── globals.css                 # Tailwind v4 (@theme nur Fonts + Keyframes)
│   ├── components/
│   │   ├── Portfolio.tsx               # komponiert alle Sektionen, reicht lang durch
│   │   ├── three/
│   │   │   ├── Scene.tsx               # Canvas, Kamera, Postprocessing, AdaptiveDpr
│   │   │   ├── DnaHelix.tsx            # drei <Instances>-Helix
│   │   │   └── ParticleField.tsx       # drei <Points> + <PointMaterial>
│   │   ├── cursor/
│   │   │   └── CustomCursor.tsx        # Motion useSpring + AnimatePresence
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Education.tsx
│   │   │   ├── Publications.tsx
│   │   │   └── Contact.tsx
│   │   └── ui/
│   │       ├── LanguageToggle.tsx      # next/link auf Gegenroute
│   │       ├── TechIcon.tsx            # react-simple-icons + Fallback-Chip
│   │       ├── Marquee.tsx             # animate-marquee-Utility (aus @theme)
│   │       ├── GlassCard.tsx           # reine Tailwind-Utilities
│   │       └── SectionHeading.tsx
│   ├── content/
│   │   ├── experience.ts               # Stationen + anonymisierte Projekte
│   │   ├── projects.ts                 # Case Studies (Problem → Ansatz → Ergebnis)
│   │   ├── skills.ts                   # Kategorien + Icon-Zuordnung
│   │   ├── education.ts
│   │   └── publications.ts
│   └── i18n/
│       ├── de.ts, en.ts                # UI-Strings + Textblöcke
│       └── index.ts                    # Lang-Typ + t()-Helper
└── docs/                               # dieser Plan
```

**Verantwortlichkeiten:** `three/` weiß nichts vom Content; es konsumiert nur den Scroll-MotionValue. `sections/` konsumieren `content/` + `lang`-Prop. `content/` ist reine Daten-Schicht (beide Sprachen pro Eintrag: `{ de: string, en: string }`). **Kein `lib/`-Ordner:** Scroll, Federung und Reduced-Motion kommen vollständig aus Motion/drei – kein einziger selbstgebauter Hook.

---

## Task 1: Projekt-Scaffold

**Files:** Create: gesamtes Next.js-Grundgerüst, `next.config.ts`

- [ ] **Step 1:** `npx create-next-app@latest . --ts --app --tailwind --src-dir --eslint --import-alias "@/*"` im Repo-Root ausführen (gültige CLI-Flags; bestehende README/LICENSE behalten)
- [ ] **Step 2:** `next.config.ts` konfigurieren:
  ```ts
  const nextConfig = {
    output: 'export',
    basePath: '/my-portfolio',
    images: { unoptimized: true },
  };
  ```
- [ ] **Step 3:** Verifizieren: `npm run build` erzeugt `out/` mit `index.html` → Erfolg prüfen
- [ ] **Step 4:** Verifizieren: `npm run dev` startet, Seite lädt unter `localhost:3000/my-portfolio`
- [ ] **Step 5:** Commit: `chore: scaffold next.js with static export for github pages`

## Task 2: GitHub-Pages-Deployment (früh, damit die Pipeline steht)

**Files:** Create: `.github/workflows/deploy.yml`

- [ ] **Step 1:** Workflow schreiben: Trigger `push` auf `main`; Jobs: checkout → setup-node (v22, npm cache) → `actions/configure-pages` (offizieller Pages-Setup-Step) → `npm ci` → `npm run build` → `actions/upload-pages-artifact` (Pfad `out/`) → `actions/deploy-pages`. Permissions: `pages: write`, `id-token: write`
- [ ] **Step 2:** Kein `.nojekyll` nötig: `actions/deploy-pages` liefert das Artefakt unverändert aus – Jekyll läuft nur bei Branch-basierten Deployments (bewusst weggelassen statt Cargo-Cult)
- [ ] **Step 3:** Commit + Push, dann in Repo-Settings → Pages → Source: „GitHub Actions" aktivieren (manueller Schritt, User informieren)
- [ ] **Step 4:** Verifizieren: Action läuft grün durch, `erikautenrieth.github.io/my-portfolio` zeigt die Scaffold-Seite
- [ ] **Step 5:** Commit-Message: `ci: add github pages deployment workflow`

## Task 3: Design-System & Fonts

**Files:** Modify: `src/app/globals.css`, `src/app/layout.tsx`

- [ ] **Step 1:** Keine eigenen Farbwerte: Tailwind-Palette nutzen (`slate-950` Hintergrund, `cyan-400`/`violet-400` Akzente). In `@theme` nur echte Zusatz-Tokens: Font-Variablen aus `next/font` und Marquee-Keyframes. Der Glass-Look entsteht später komplett aus Framework-Utilities (`bg-white/5 backdrop-blur-md ring-1 ring-white/10`) – keine handgeschriebene CSS-Klasse
- [ ] **Step 2:** `next/font`: Space Grotesk, Inter, JetBrains Mono in `layout.tsx` laden, als CSS-Variablen exponieren
- [ ] **Step 3:** Basis-Styles: dunkler Body, Selection-Farbe, Scrollbar-Styling, `cursor: none` auf Desktop (für Custom Cursor)
- [ ] **Step 4:** Verifizieren: Testseite mit Headline/Body/Mono-Text + Glass-Karte sieht korrekt aus (Browser-Check)
- [ ] **Step 5:** Commit: `feat: design system with bio-tech dark theme`

## Task 4: Content-Layer & i18n (Routen-basiert)

**Files:** Create: `src/content/*.ts`, `src/i18n/de.ts`, `src/i18n/en.ts`, `src/i18n/index.ts`, `src/components/Portfolio.tsx`, `src/app/de/page.tsx`, `src/components/ui/LanguageToggle.tsx`; Modify: `src/app/page.tsx`

- [ ] **Step 1:** Typen definieren: `Bilingual = { de: string; en: string }`; Interfaces für `ExperienceEntry` (Zeitraum, Rolle, Firma, Projekte mit anonymisiertem Kunden, Bullet-Points), `Project` (Titel, Problem/Ansatz/Ergebnis, Tech-Stack, Links zu Demo/Repo/Paper), `SkillCategory`, `EducationEntry`, `Publication`; `i18n/index.ts` exportiert `type Lang = 'de' | 'en'` + `t(lang, bilingual)`-Helper
- [ ] **Step 2:** CV-Daten aus dem Lebenslauf in `content/` übertragen – **Kunden anonymisiert**: Mercedes-Benz → „Globaler Automobilhersteller" / „Global automotive manufacturer", DHL → „Internationaler Logistikkonzern" / „International logistics group". Arbeitgeber (SprintEins, ZB MED, H-BRS, UK Bonn) bleiben genannt. **Content-Prinzipien anwenden:** nur relevante Highlights, AI-Inhalte zuerst, Nebenstationen kompakt
- [ ] **Step 3:** `Portfolio.tsx` nimmt `lang` als Prop und reicht es an alle Sektionen durch; `app/page.tsx` rendert `<Portfolio lang="en">`, `app/de/page.tsx` rendert `<Portfolio lang="de">` – beide Seiten werden beim Export prerendert (Framework-Routing statt Client-State, kein Context/localStorage, keine Hydration-Sonderfälle)
- [ ] **Step 4:** `LanguageToggle`: fixierter `next/link` oben rechts auf die Gegenroute (`/` ⇄ `/de`), Mono-Font; `basePath` berücksichtigt `next/link` automatisch
- [ ] **Step 5:** Verifizieren: `npm run build` erzeugt `out/index.html` **und** `out/de/index.html`, beide mit korrektem Text im HTML-Quelltext (View-Source-Check)
- [ ] **Step 6:** Commit: `feat: content layer and route-based de/en i18n`

## Task 5: Seiten-Skelett & Smooth Scroll

**Files:** Create: alle `sections/*.tsx` als Platzhalter; Modify: `src/components/Portfolio.tsx`, `src/app/layout.tsx`

- [ ] **Step 1:** `lenis` installieren; `<ReactLenis root>` aus `lenis/react` (offizielle React-Integration) im Layout einbinden – kein manuelles Lenis-Setup, kein eigener Hook
- [ ] **Step 2:** Alle 8 Sektionen als Platzhalter mit `id`, `min-h-screen` und Überschrift anlegen; `Portfolio.tsx` komponiert sie in Scroll-Reihenfolge
- [ ] **Step 3:** `motion` installieren (Nachfolge-Paket von Framer Motion, Import aus `motion/react`); `SectionHeading` mit Scroll-Reveal (`whileInView`) bauen; Scroll-Fortschritt kommt überall aus Motions `useScroll` (MotionValue → kein Re-Render pro Frame, kein eigener Hook)
- [ ] **Step 4:** Verifizieren: Seite scrollt butterweich durch 8 Sektionen, Headings faden ein
- [ ] **Step 5:** Commit: `feat: page skeleton with lenis smooth scroll`

## Task 6: 3D-Szene – Neural-DNA, Partikel, Bloom

**Files:** Create: `src/components/three/Scene.tsx`, `DnaHelix.tsx`, `ParticleField.tsx`

> **Style-Referenz:** `prototype/neural-dna.html` – dort abgenommene Farben, Dichte, Bloom-Werte und Puls-Timings 1:1 übernehmen.

- [ ] **Step 1:** Installieren: `three @react-three/fiber @react-three/drei @react-three/postprocessing`; `Scene.tsx`: fixiertes Fullscreen-`<Canvas>` (`position: fixed; inset: 0; z-index: -1`), dynamischer Import mit `ssr: false`
- [ ] **Step 2:** `DnaHelix`: zwei gegenläufige Helix-Stränge deklarativ mit dreis `<Instances>/<Instance>` (~2×110 Kugeln, leichte Größenvariation, Cyan/Violett) statt manueller `InstancedMesh`-Matrix-Mathematik; langsame Eigenrotation in `useFrame`
- [ ] **Step 3:** **Neural-Synapsen statt Basenpaar-Zylinder:** dünne halbtransparente Linien zwischen den Strängen mit pulsierendem Knoten in der Mitte (Scale-/Opacity-Sinus, phasenversetzt) – die DNA-Sprossen SIND das neuronale Netz
- [ ] **Step 4:** **Signal-Pulse:** helle Lichtpunkte wandern die Stränge entlang; gelegentliches „Feuern" über eine zufällige Synapse (max. 2 gleichzeitig, danach Cleanup)
- [ ] **Step 5:** **AI-Core-Datenstrom:** feiner Partikelstrom fließt durch die Helix-Achse nach oben (dreis `<Points>` + `<PointMaterial>`, additive Blending) – die Intelligenz *in* der DNA
- [ ] **Step 6:** Hintergrund: sparsames Sternenfeld (dreis `<Points>`, geringe Opacity) + `FogExp2` zum Ausblenden der Helix-Enden – schlicht halten
- [ ] **Step 7:** Postprocessing: `<EffectComposer>` mit `<Bloom>` (intensity ~1.1, luminanceThreshold ~0.18) – Glow gezielt auf Pulse/Knoten, Stränge bleiben dezent
- [ ] **Step 8:** Maus-Parallax: normalisierte Mausposition neigt Helix-Gruppe sanft, gedämpft mit `THREE.MathUtils.damp` (Framework-Funktion, framerate-unabhängig – kein eigener Lerp)
- [ ] **Step 9:** Performance & Motion: dreis `<AdaptiveDpr>` + `<PerformanceMonitor>` regeln die Auflösung automatisch nach Geräteleistung (statt manueller Mobile-Erkennung); `useReducedMotion` aus `motion/react` stoppt Rotation und Pulse
- [ ] **Step 10:** Verifizieren: 60 fps auf Desktop (DevTools-Performance-Check), Synapsen pulsieren, Signale feuern, Datenstrom fließt
- [ ] **Step 11:** Commit: `feat: neural-dna 3d scene with synapse pulses and bloom`

## Task 7: Scroll-Kamerafahrt

**Files:** Modify: `Scene.tsx`, `DnaHelix.tsx`

- [ ] **Step 1:** `useScroll().scrollYProgress` (Motion-MotionValue) in der Szene per `.get()` in `useFrame` lesen – kein React-State, kein Re-Render pro Frame; Kamera entlang einer `THREE.CatmullRomCurve3` an der Helix entlang interpolieren, Dämpfung mit `THREE.MathUtils.damp`
- [ ] **Step 2:** Pro Sektions-Bereich subtile Szenen-Variation (z. B. Helix-Rotationsgeschwindigkeit/Farbton verschiebt sich mit Fortschritt)
- [ ] **Step 3:** Verifizieren: Scrollen bewegt die Kamera flüssig, kein Ruckeln, Content bleibt lesbar (Kontrast prüfen)
- [ ] **Step 4:** Commit: `feat: scroll-driven camera path through helix`

## Task 8: Custom Cursor mit Klick-Effekten

**Files:** Create: `src/components/cursor/CustomCursor.tsx`; Modify: `layout.tsx`

- [ ] **Step 1:** Cursor-Dot (klein, neon) + Trailing-Ring als `motion.div`s: Position als `useMotionValue`, Ring folgt via `useSpring` (Framework-Federphysik statt manuellem lerp/rAF-Loop); auf Touch-Geräten deaktiviert (`pointer: coarse` → nativer Cursor)
- [ ] **Step 2:** Magnetic Hover: auf `a`/`button` (via `data-cursor="hover"` oder Event-Delegation) wächst der Ring und färbt sich `violet-400`
- [ ] **Step 3:** **Klick-Effekt:** bei `pointerdown` an Klickposition (a) expandierender Schockwellen-Ring und (b) 8–12 Partikel-Splitter – beides `motion.div`s in `<AnimatePresence>`, Cleanup über `onAnimationComplete` (Framework-Lifecycle statt manuellem DOM-Aufräumen)
- [ ] **Step 4:** `useReducedMotion` (aus `motion/react`): nur dezenter Ring-Puls statt Partikel-Burst
- [ ] **Step 5:** Verifizieren: Cursor folgt flüssig, Klick überall löst Schockwelle + Burst aus, Touch-Geräte unbeeinträchtigt
- [ ] **Step 6:** Commit: `feat: custom cursor with shockwave click effect`

## Task 9: Hero & About

**Files:** Modify: `sections/Hero.tsx`, `sections/About.tsx`

- [ ] **Step 1:** Hero: Name in Space Grotesk (groß, Gradient `from-cyan-400 to-violet-400` – Tailwind-Utilities), Titel-Zeile „AI Engineer · Data Scientist · Full Stack Developer" mit Stagger-Buchstaben-Animation (Motion `staggerChildren`), Mono-Kicker „// INTELLIGENCE ENCODED", Scroll-Hinweis (animierter Pfeil)
- [ ] **Step 2:** About: 3–4 Sätze Kurzprofil (DE/EN), Reihenfolge der Stärken: AI-Agenten & LLM-Systeme (LangGraph, RAG, Evals) → Data Science/MLOps → Full-Stack-Delivery; klinischer Daten-Hintergrund als Differenzierung. GitHub-/LinkedIn-Buttons mit Glow-Hover
- [ ] **Step 3:** Verifizieren: Texte in beiden Sprachen korrekt, Animationen greifen beim Laden/Scrollen
- [ ] **Step 4:** Commit: `feat: hero and about sections`

## Task 10: Projects / Case Studies (Herzstück)

**Files:** Modify: `sections/Projects.tsx`; Create: `content/projects.ts`, `ui/GlassCard.tsx`

- [ ] **Step 1:** `content/projects.ts`: 3 Case Studies im Format **Problem → Ansatz → Ergebnis** (DE/EN):
  1. **ML Stock Prediction** – Problem: S&P-500-Richtungsprognose (up/down/neutral); Ansatz: Pipeline aus yfinance/DuckDB → scikit-learn/LightGBM/Optuna → MLflow-Tracking + DVC; Ergebnis: Live-Dashboard mit Candlestick-Charts, Predictions & Performance-Metriken; Links: **Live-Demo** (`https://ml-stock-pred.streamlit.app`) + **GitHub-Repo** (Link beim Umsetzen aus dem Profil verifizieren)
  2. **LLM-Strukturierung klinischer Freitextdaten** (Masterarbeit, Note 1,5) – Problem: unstrukturierte klinische Texte; Ansatz: LLMs auf HPC-Infrastruktur, Prompt Engineering, Few-Shot Learning, systematische Evaluierung; Ergebnis: automatisierte Strukturierungspipeline
  3. **QSM-Pipeline** – Problem: Bestimmung von Eisenkonzentrationen im Gehirn (ADHS-Forschung); Ansatz: automatisierte Python-Pipeline (Quantitative Susceptibility Mapping); Ergebnis: **Frontiers-Publikation 2026** (DOI-Link)
- [ ] **Step 2:** `GlassCard` hier einführen: reine Tailwind-Utilities (`bg-white/5 backdrop-blur-md ring-1 ring-white/10`, Hover-Glow via `hover:shadow-lg hover:shadow-cyan-400/20`) – keine Custom-CSS-Datei. Karten-Layout: große GlassCards mit Mono-Labels für Problem/Ansatz/Ergebnis, Tech-Chips als Mono-Text-Chips (Umstellung auf `TechIcon` erfolgt in Task 12), prominente Buttons „Live Demo" / „GitHub" / „Paper" mit Glow-Hover (`target="_blank"` + `rel="noopener"`)
- [ ] **Step 3:** Scroll-Reveal (`whileInView`) + dezenter Hover-Lift (Motion `whileHover`)
- [ ] **Step 4:** Verifizieren: alle Links öffnen korrekt, Case-Study-Texte in DE und EN vollständig
- [ ] **Step 5:** Commit: `feat: projects section with case studies and live demo links`

## Task 11: Experience-Timeline

**Files:** Modify: `sections/Experience.tsx`

- [ ] **Step 1:** `GlassCard` aus Task 10 wiederverwenden – keine neue Styling-Variante
- [ ] **Step 2:** Vertikale Timeline: mittige/linke Leuchtlinie, Stationen als GlassCards mit Zeitraum (Mono), Rolle, Arbeitgeber; Projekte als eingerückte Unterblöcke mit anonymisierten Kunden und gekürzten Bullet-Points (max. 4 pro Projekt)
- [ ] **Step 3:** Scroll-Reveal: Karten sliden alternierend von links/rechts ein (`whileInView`); Timeline-Linie „wächst" mit Scroll: `useScroll` (auf die Sektion gescoped) + `useSpring` → `scaleY` als MotionValue direkt in `style` (kein Re-Render)
- [ ] **Step 4:** Inhalte mit klarer Hierarchie (kein Fluff):
  - **SprintEins** (große Karte): AI-Agent-Projekt zuerst mit max. 4 Bullets (LangGraph-Agent mit Tool-Calling, Hybrid-Search-RAG mit pgvector, Langfuse-Observability + Eval-System, AWS-Kubernetes-Deployment); Logistik-Projekt mit max. 3 Bullets (ML-Klassifizierungsservice FastAPI/scikit-learn, React-Frontend, Spring-Boot-Backend)
  - **ZB MED** (mittlere Karte): max. 3 Bullets – cloudbasiertes MLOps-System (MLflow, Ray, AutoML), LLM-Strukturierung klinischer Daten auf HPC (Masterarbeit), React-Features für Health Study Hub
  - **Weitere Stationen** (Kompakt-Einträge, je 1 Zeile): HiWi UK Bonn → QSM-Python-Pipeline (führte zur Frontiers-Publikation 2026); HiWi H-BRS → Lehre „Scientific Programming with Python"; Data-Science-Praktikum UK Bonn → MRT-Bildanalyse-Pipelines. Gestrichen: Bewertungsvorlage, Android-App – kein Signalwert
- [ ] **Step 5:** Verifizieren: SprintEins/ZB MED detailliert, Nebenstationen einzeilig, in DE und EN korrekt, Animationen flüssig
- [ ] **Step 6:** Commit: `feat: experience timeline with glassmorphism cards`

## Task 12: Skills mit Tech-Logo-Marquees

**Files:** Modify: `sections/Skills.tsx`; Create: `ui/TechIcon.tsx`, `ui/Marquee.tsx`, `content/skills.ts`

- [ ] **Step 1:** `@icons-pack/react-simple-icons` installieren – fertige React-Komponenten inkl. Markenfarbe (kein eigener SVG-Wrapper); `TechIcon`: mappt Skill → Icon-Komponente; bei fehlendem Icon → Fallback-Chip mit Funkel-Symbol (für RAG, Prompt Engineering, Scrum, ADR, …)
- [ ] **Step 2:** `content/skills.ts`: 7 Kategorien mit Skill-Name + Icon-Zuordnung befüllen; verfügbare Icons gegen das Paket prüfen (z. B. `SiLangchain`, `SiOpenai`, `SiHuggingface`, `SiPytorch`, `SiScikitlearn`, `SiMlflow`, `SiPandas`, `SiNumpy`, `SiFastapi`, `SiSpring`, `SiPostgresql`, `SiApachekafka`, `SiReact`, `SiRedux`, `SiVite`, `SiMui`, `SiNextdotjs`, `SiDocker`, `SiKubernetes`, `SiHelm`, `SiArgo`, `SiGit`, `SiGithubactions`, `SiPytest`, `SiVitest`, `SiSonarqube`, `SiRuff`, `SiEslint`) – fehlende (u. a. Azure/AWS sind aus simple-icons entfernt) bekommen den Text-Fallback
- [ ] **Step 3:** `Marquee`: Keyframes als `--animate-marquee`-Token in `@theme` → Tailwind generiert daraus die `animate-marquee`-Utility (Framework-Mechanismus statt loser CSS-Datei); duplizierter Inhalt, Richtung pro Reihe via `[animation-direction:reverse]`, Pause via `hover:[animation-play-state:paused]`; Logo-Chips glühen auf Hover in Markenfarbe
- [ ] **Step 4:** Skills-Sektion: Kategorie-Label (Mono, `text-cyan-400`) + Marquee-Reihe pro Kategorie; seitliche Fade-Masken mit Tailwind-v4.1-Mask-Utilities (`mask-x-from-80%`) statt handgeschriebenem `mask-image`
- [ ] **Step 5:** Verifizieren: alle 7 Reihen laufen, Logos korrekt gefärbt, Fallback-Chips stimmig, Hover pausiert + glüht; Tech-Chips in Task-10-Projektkarten auf `TechIcon` umstellen
- [ ] **Step 6:** Commit: `feat: skills section with glowing tech logo marquees`

## Task 13: Education, Publications, Contact

**Files:** Modify: `sections/Education.tsx`, `sections/Publications.tsx`, `sections/Contact.tsx`

- [ ] **Step 1:** Education: zwei GlassCards (M.Sc. 1,4 / B.Sc. 2,1) mit Abschlussarbeiten als Highlight-Zeile (Titel + Note)
- [ ] **Step 2:** Publications: zwei Einträge im Zitations-Stil (Mono-Akzente), DOI als externe Links (`10.3389/fpsyt.2026.1735191`, `10.18418/opus-7847`)
- [ ] **Step 3:** Contact/Footer: „Let's connect"-Heading, große GitHub-/LinkedIn-Buttons mit Neon-Glow, Copyright-Zeile
- [ ] **Step 4:** Verifizieren: Links öffnen korrekt (GitHub-Profil, LinkedIn, DOIs), beide Sprachen vollständig
- [ ] **Step 5:** Commit: `feat: education, publications and contact sections`

## Task 14: Polish, SEO & Launch

**Files:** Modify: `layout.tsx`, diverse; Create: `src/app/icon.svg`, `src/app/opengraph-image.png`

- [ ] **Step 1:** Next-Datei-Konventionen: `app/icon.svg` (Favicon, DNA-Motiv) und `app/opengraph-image.png` (statisches OG-Bild im Bio-Tech-Style) – Next generiert Favicon-/OG-/Twitter-Meta-Tags automatisch, keine manuellen `<link>`/`<meta>`-Tags
- [ ] **Step 2:** Metadata API in `layout.tsx`: Titel, Description, `metadataBase` auf `https://erikautenrieth.github.io/my-portfolio`, `alternates.languages` (`en` → `/`, `de` → `/de`) für hreflang
- [ ] **Step 3:** Performance-Pass: Lighthouse auf dem Prod-Build (`npx serve out`) – Ziel: Performance ≥ 80 (3D-Seite), Accessibility ≥ 95; Three.js-Szene bleibt dynamisch importiert
- [ ] **Step 4:** Cross-Check: Mobile-Ansicht (Cursor aus, AdaptiveDpr greift), `prefers-reduced-motion`-Modus, Tastatur-Navigation, Kontraste
- [ ] **Step 5:** `README.md` aktualisieren: Kurzbeschreibung, Stack, lokale Entwicklung, Deploy-Hinweis
- [ ] **Step 6:** Finaler Push → GitHub Action → Live-Verifikation auf `erikautenrieth.github.io/my-portfolio` in beiden Sprachen
- [ ] **Step 7:** Commit: `chore: seo metadata, performance polish and launch`

---

## Risiken & Entscheidungen

| Risiko | Mitigation |
|---|---|
| `basePath` bricht Asset-Pfade | Alle Assets über Next-Mechanismen laden (`next/font`, `next/link`, Datei-Konventionen); keine hartcodierten `/`-Pfade |
| Next-`i18n`-Config inkompatibel mit `output: 'export'` | Statische Routen `/` + `/de` – beide Sprachen prerendert, kein Client-State nötig |
| 3D-Performance auf schwachen Geräten | drei `<AdaptiveDpr>` + `<PerformanceMonitor>` regeln Qualität automatisch; Instancing; reduced-motion-Fallback |
| simple-icons hat nicht alle Logos (Azure/AWS entfernt, Hamilton, MSW etc. unklar) | Einheitlicher Text-Chip-Fallback, wird in Task 11 pro Icon verifiziert |
| Dynamische OG-Bilder (`ImageResponse`) mit Static Export fragil | Bewusst statisches `opengraph-image.png` per Datei-Konvention |
| NDA-Risiko bei Kundenprojekten | Kunden anonymisiert, Arbeitgeber genannt |
