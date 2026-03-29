![CI](https://github.com/nexailabs/NexAI-Website/actions/workflows/ci.yml/badge.svg?branch=dev) ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg) ![Cloudflare Pages](https://img.shields.io/badge/Deployed_on-Cloudflare_Pages-orange)

# NexAI Labs — Website

Premium website for NexAI Labs, an AI agency based in India. Built with Astro 5, GSAP animations, and deployed on Cloudflare Pages.

**Live site:** [nexailabs.com](https://nexailabs.com)

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

## Git Workflow (READ THIS CAREFULLY)

### Branch Structure

```
main ──────── Production. Only merged PRs. Never push directly.
  │
  └── dev ──── Integration branch. Test here before promoting to main.
        │
        ├── feature/navbar-fix ──── Your working branch
        ├── feature/pricing ──────── Another feature
        └── feature/responsive ───── Another feature
```

### Starting New Work

```bash
# 1. Always start from the latest dev
git checkout dev
git pull origin dev

# 2. Create a feature branch with a descriptive name
git checkout -b feature/your-task-name

# 3. Do your work, then stage SPECIFIC files (not everything)
git add src/components/Navbar.astro src/styles/global.css
git commit -m "fix: navbar hamburger menu on mobile"

# 4. Push your branch
git push origin feature/your-task-name
```

### Creating a Pull Request

1. Go to GitHub > your repo > "Compare & pull request"
2. Set base branch to `dev` (NOT main)
3. Write a clear title: what changed and why
4. Request a review from your teammate
5. After approval > click "Merge pull request"
6. Delete the feature branch after merging

### Promoting to Production

When `dev` is stable and tested:

1. Create PR: `dev` > `main`
2. Review together
3. Merge = Cloudflare Pages auto-deploys to production

### Rules

| Rule                                  | Why                                               |
| ------------------------------------- | ------------------------------------------------- |
| Never push directly to `main`         | Keeps production safe                             |
| Never use `git push --force`          | Destroys other people's work permanently          |
| One feature per branch                | If something breaks, only that branch is affected |
| Always `git pull` before starting     | Prevents merge conflicts                          |
| Stage specific files, not `git add .` | Prevents committing logs, secrets, huge images    |
| Don't commit images to git            | Use ImageKit instead (see Image Guidelines)       |
| Don't commit `.log` files             | They're in `.gitignore` for a reason              |

### Common Mistakes & Fixes

**"I made changes on the wrong branch!"**

```bash
git stash                          # Save your changes temporarily
git checkout feature/correct-branch  # Switch to the right branch
git stash pop                      # Apply your changes here
```

**"I committed something I shouldn't have!"**

> Stop. Don't try to fix it yourself. Ask for help before running any undo commands.

**"Git says there's a merge conflict!"**

> Don't panic. Open the conflicted file, look for `<<<<<<<` markers, choose which version to keep, remove the markers, then commit.

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
