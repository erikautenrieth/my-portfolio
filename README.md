# my-portfolio

Personal portfolio — **erikautenrieth.github.io/my-portfolio**

Interactive one-pager with a scroll-driven holographic "Neural DNA" 3D scene,
bilingual content (EN at `/`, DE at `/de`) and case studies with live demos.

## Stack

Next.js 15 (App Router, static export) · React 19 · TypeScript · Tailwind CSS v4 ·
Three.js + React Three Fiber + drei + postprocessing · Motion · Lenis

## Development

```bash
npm install
npm run dev      # http://localhost:3000/my-portfolio
npm run build    # static export to out/
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow
(`.github/workflows/deploy.yml`), which builds the static export and deploys it
to GitHub Pages.
