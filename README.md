![CI](https://github.com/nexailabs/NexAI-Website/actions/workflows/ci.yml/badge.svg?branch=dev) ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg) ![Cloudflare Pages](https://img.shields.io/badge/Deployed_on-Cloudflare_Pages-orange)

# NexAI Labs — Website

Premium website for NexAI Labs, an AI agency based in India. Built with Astro 5, GSAP animations, and deployed on Cloudflare Pages.

**Live site:** [nexailabs.com](https://nexailabs.com)

> **For AI coding agents:** read [`./AGENTS.md`](./AGENTS.md) (workflow, hooks, off-limits files) before making changes. Branch and commit conventions are in [`./CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## Quick Start

```bash
git clone https://github.com/nexailabs/NexAI-Website.git
cd NexAI-Website
npm install
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to dist/
npm run preview      # Preview built site locally
```

---

## Tech Stack

| Layer                | Technology                       | Notes                                       |
| -------------------- | -------------------------------- | ------------------------------------------- |
| Framework            | Astro 5 (SSG, TypeScript strict) | Static site generation                      |
| Animation            | GSAP 3.14 + ScrollTrigger        | Scroll-triggered animations                 |
| Smooth Scroll        | Lenis 1.3                        | `src/scripts/lenis.ts` — DO NOT MODIFY      |
| Styling              | Vanilla CSS + custom properties  | Design tokens in `src/styles/global.css`    |
| Images + short video | ImageKit                         | 25GB free bandwidth, auto-optimization, CDN |
| Long-form video      | YouTube embed                    | Free, unlimited                             |
| Hosting              | Cloudflare Pages                 | Auto-deploys from `main` branch             |
| Fonts                | Inter (400, 600, 800)            | Google Fonts, preloaded                     |

**DO NOT use:** Tailwind, React, Vue, Svelte, Bootstrap, or any UI component library.

---

## Project Structure

```
Website/
├── docs/                        # Read these before writing any code
│   ├── BUILD-PLAN.md            # 21-phase build guide (the master plan)
│   ├── BRAND.md                 # Colors, typography, design patterns
│   ├── REFERENCES.md            # 19 competitor/inspiration sites
│   ├── AI-SHOOTS-CONTENT.md     # Full copy for /ai-shoots page
│   └── website-analysis.md      # Critique of current live site
├── public/                      # Static assets (served as-is)
│   ├── assets/
│   │   ├── logo/                # Brand logos (PNG, keep in repo)
│   │   └── ai-shoots/           # AI shoots page assets
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── components/              # Reusable Astro components
│   ├── layouts/
│   │   └── Layout.astro         # Root layout (extend, don't replace)
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   └── ai-shoots.astro      # AI Shoots landing page
│   ├── scripts/
│   │   └── lenis.ts             # Lenis + GSAP sync (LOCKED)
│   └── styles/
│       └── global.css           # Design tokens + resets + utilities
├── .github/
│   └── workflows/claude.yml     # Claude Code PR review action
├── package.json
├── astro.config.mjs
└── tsconfig.json
```

---

## Git Workflow

Single trunk: `main`. Branch protection blocks direct pushes; everything goes through a PR. There is no `dev` branch.

```bash
git checkout main
git pull origin main
git checkout -b feat/<short-name>     # or fix/, chore/, refactor/, docs/, polish/, perf/

# work, stage specific files, commit
git add src/components/Foo.astro
git commit -m "feat(home): tighten hero copy"

git push -u origin feat/<short-name>
gh pr create --base main
```

Conventional commits — `type(scope): subject`. Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `perf`, `polish`, `test`. Scopes are optional; examples in this repo: `prompts`, `seo`, `deps`, `security`, `audit-NN`, `home`, `studio`.

Required CI check: **`Lint, Type-check & Build`**. CODEOWNERS auto-assigns reviewers; **Rahul (`@rahul-nexailabs`) merges after approval — do not self-merge.**

Pre-commit hooks (Husky + lint-staged) run `eslint --fix` and `prettier --write` on staged files. Don't bypass with `--no-verify`. Full PR + hooks workflow: [`./CONTRIBUTING.md`](./CONTRIBUTING.md) and [`./AGENTS.md`](./AGENTS.md).

### Rules

| Rule                                          | Why                                                |
| --------------------------------------------- | -------------------------------------------------- |
| Never push directly to `main`                 | Branch protection blocks it; keeps production safe |
| Never use `git push --force` on main          | Destroys other people's work permanently           |
| One feature per branch                        | If something breaks, only that branch is affected  |
| Always `git pull origin main` before starting | Prevents merge conflicts                           |
| Stage specific files, not `git add .`         | Prevents committing logs, secrets, huge images     |
| Don't commit images to git                    | Use ImageKit instead (see Image Guidelines)        |
| Don't commit `.log` files                     | They're in `.gitignore` for a reason               |

---

## Image Guidelines

### Where Media Lives

All website images and short video clips are hosted on **ImageKit** — NOT in the git repo.
Longer videos are embedded from **YouTube**.

**Exception:** Logos and favicons stay in `public/assets/logo/` (they're small and rarely change).

### How to Add Images

1. **Upload** the original image to the [ImageKit dashboard](https://imagekit.io/dashboard)
2. **Copy** the URL
3. **Use it** in your code with transformation parameters:

```html
<!-- Auto-format, auto-quality, 1200px wide -->
<img
	src="https://ik.imagekit.io/YOUR_ID/folder/image.jpg?tr=w-1200,f-auto,q-80"
	alt="Description of the image"
/>
```

### How to Add Videos

**Short clips (8-30s product demos, reels):** Upload to ImageKit, use like images:

```html
<video
	src="https://ik.imagekit.io/YOUR_ID/folder/clip.mp4?tr=w-800"
	autoplay
	muted
	loop
	playsinline
/>
```

**Longer videos (case studies, tutorials):** Upload to YouTube, embed:

```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
```

### Size Targets

| Media Type           | Max Width  | Target Size | Format                   |
| -------------------- | ---------- | ----------- | ------------------------ |
| Hero/showcase images | 1600px     | 500KB - 1MB | WebP (auto via `f-auto`) |
| Portfolio cards      | 800px      | 150 - 300KB | WebP (auto)              |
| Thumbnails           | 400px      | 50 - 100KB  | WebP (auto)              |
| Logos/icons          | As needed  | < 50KB      | SVG or PNG               |
| Short video clips    | 800-1200px | < 5MB       | MP4                      |

### Why Not Git?

Git stores every version of every file forever. A 10MB image committed, re-optimized, and re-committed = 20MB in git history that can never be removed. With 100+ images, the repo becomes uncloneable.

---

## Blog (MDX Content Collections)

Blog posts use Astro's built-in content collections with MDX:

```
src/content/blog/
├── my-first-post.mdx
├── ai-photography-guide.mdx
└── ...
```

MDX = Markdown + custom components. You can embed videos, image galleries, styled callouts, and any custom component inside blog posts.

```mdx
---
title: 'How AI is Changing Fashion Photography'
date: 2026-03-26
---

# How AI is Changing Fashion Photography

Regular text with **bold** and _italic_...

<YouTubeEmbed url="https://youtube.com/watch?v=..." />

<BeforeAfterSlider before="before.jpg" after="after.jpg" />
```

---

## Documentation

Read these before writing any code:

| Doc                                               | What It Covers                                               |
| ------------------------------------------------- | ------------------------------------------------------------ |
| [BUILD-PLAN.md](docs/BUILD-PLAN.md)               | 21-phase build guide, architecture, section-by-section order |
| [BRAND.md](docs/BRAND.md)                         | Color palette, typography, logo files, design patterns       |
| [REFERENCES.md](docs/REFERENCES.md)               | 19 competitor/inspiration sites to study                     |
| [AI-SHOOTS-CONTENT.md](docs/AI-SHOOTS-CONTENT.md) | Full copy for the AI Shoots landing page                     |
| [website-analysis.md](docs/website-analysis.md)   | Critique of the current live site                            |

---

## Design System

Full brand specification is in [`docs/BRAND.md`](docs/BRAND.md). Key tokens:

| Token                | Value     | Usage                |
| -------------------- | --------- | -------------------- |
| `--color-bg`         | `#050607` | Page background      |
| `--color-brand-teal` | `#1E7E72` | Brand gradient start |
| `--color-brand-cyan` | `#4EC9B4` | Brand gradient end   |
| `--color-accent`     | `#DCEA22` | Lime accent          |
| `--color-text-main`  | `#ffffff` | Primary text         |

Responsive breakpoints: **375px** (mobile), **768px** (tablet), **1024px** (desktop), **1440px** (wide)

---

## Hosting & Deployment

The site is deployed on **Cloudflare Pages**:

- **Auto-deploy:** Every push to `main` triggers a build and deploy
- **Preview deployments:** Every PR gets a preview URL for testing
- **Custom domain:** nexailabs.com (DNS on Cloudflare)
- **Build command:** `npm run build`
- **Output directory:** `dist/`

---

## Brand Assets

Logo files in `public/assets/logo/`:

- `nexai-icon.png` — Hexagonal icon (teal gradient)
- `nexai-logo-white.png` — White wordmark (dark backgrounds)
- `nexai-logo-black.png` — Black wordmark (light backgrounds)

---

## Team

- **Rahul** — Founder, strategy & AI
- **Amit** — Development & design

Contact: hello@nexailabs.com
