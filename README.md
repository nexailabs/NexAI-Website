# NexAI Labs — Website

Website rebuild for NexAI Labs, an AI agency based in India. Two pages:

1. **`/ai-shoots`** — AI Fashion Photography conversion landing page
2. **`/`** — AI Agency portfolio homepage

## Quick Start

```bash
npm install
npm run dev        # localhost:4321
npm run build      # production build to dist/
```

## Documentation

Read these before writing any code:

| Doc | What it covers |
|-----|---------------|
| [`docs/BUILD-PLAN.md`](docs/BUILD-PLAN.md) | 21-phase build guide, architecture, section-by-section order, design quality expectations |
| [`docs/BRAND.md`](docs/BRAND.md) | Color palette, typography, logo files, design patterns, contact info |
| [`docs/REFERENCES.md`](docs/REFERENCES.md) | 19 competitor/inspiration sites, categorized by what to study from each |
| [`docs/AI-SHOOTS-CONTENT.md`](docs/AI-SHOOTS-CONTENT.md) | Full copy/content for the AI Shoots landing page (all 11 sections) |
| [`docs/website-analysis.md`](docs/website-analysis.md) | 5.3/10 critique of the current live site — context on what to fix |

## Stack

- **Astro 5** (SSG, TypeScript strict)
- **GSAP 3.14** + ScrollTrigger (scroll animations)
- **Lenis** (smooth scroll — `src/scripts/lenis.ts`, do not modify)
- **Vanilla CSS** with custom properties (design tokens in `src/styles/global.css`)
- **No** Tailwind, React, Vue, Svelte, or UI libraries

## Brand Assets

Logo files in `public/assets/logo/`:
- `nexai-icon.png` — standalone hexagonal icon (teal gradient)
- `nexai-logo-white.png` — white wordmark for dark backgrounds
- `nexai-logo-black.png` — black wordmark for light backgrounds

## Workflow

Each section = 1 PR. Build it, push a feature branch, get approval, merge to `dev`. See `docs/BUILD-PLAN.md` for full phase-by-phase order.
