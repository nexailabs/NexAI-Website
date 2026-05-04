![CI](https://github.com/nexailabs/NexAI-Website/actions/workflows/ci.yml/badge.svg)
![Cloudflare Pages](https://img.shields.io/badge/Deployed_on-Cloudflare_Pages-orange)

# NexAI Labs — Website

Marketing site for NexAI Labs — an AI agent agency. Astro 6, static output, Cloudflare Pages.

**Live site:** [www.nexailabs.com](https://www.nexailabs.com)

> **For AI coding agents:** read [`./CLAUDE.md`](./CLAUDE.md) (brand + typography rules) and [`./AGENTS.md`](./AGENTS.md) (workflow, hooks, off-limits files) before making changes. Branch and commit conventions are in [`./CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## Quick start

```bash
git clone https://github.com/nexailabs/NexAI-Website.git
cd NexAI-Website
npm install
npm run dev          # http://localhost:4321
npm run build        # static build to dist/
npm run preview      # serve dist/ locally
```

Requires Node ≥ 22.

---

## Stack

| Layer                | Technology                             | Notes                                        |
| -------------------- | -------------------------------------- | -------------------------------------------- |
| Framework            | Astro 6 (static output, TS strict)     | View Transitions enabled                     |
| Smooth scroll        | Lenis 1.3                              | `src/scripts/lenis.ts`                       |
| Styling              | Vanilla CSS + custom properties        | Brand tokens in `src/styles/brand.css`       |
| Images / short video | ImageKit                               | CDN with on-the-fly transforms               |
| Long-form video      | YouTube embed                          |                                              |
| Hosting              | Cloudflare Pages                       | Auto-deploys from `main`                     |
| Pages Functions      | `functions/api/runs.ts`                | KV-backed counter for prompt copies/installs |
| Fonts                | Montserrat / Inter / Plus Jakarta Sans | Astro Fonts API + Fontsource provider        |

**Out of stack:** Tailwind, React, Vue, Svelte, Bootstrap, GSAP, any UI component library.

---

## Project structure

```
Website/
├── functions/api/runs.ts         # Cloudflare Pages Function — KV counter
├── public/                       # Favicon, robots.txt, _headers, _redirects
├── src/
│   ├── components/
│   │   ├── brand/                # Brand-canonical primitives (Eyebrow)
│   │   ├── home/                 # Homepage sections (Hero, Thesis, Anatomy, Roster, Toolkit, Pricing)
│   │   ├── promptHub/            # Prompt Hub UI (cards, filters, modal, hero)
│   │   ├── vault/                # App Vault UI (filters, tiles, stack cards)
│   │   └── blog/                 # Field Notes UI (cover, meta, TOC)
│   ├── config/                   # site.ts, navigation.ts, imagekit.ts
│   ├── content/blog/             # Markdown posts (drafts auto-excluded from build)
│   ├── content.config.ts         # Astro Content Collections schema
│   ├── data/                     # promptHub.ts, vault.ts (typed seed data)
│   ├── layouts/Layout.astro      # Root layout with Navbar, Footer, head meta
│   ├── pages/                    # Routes (file-based)
│   ├── scripts/                  # Lenis, hero engine, navbar, etc.
│   └── styles/
│       ├── brand.css             # Single source of truth: colors, fonts, spacing
│       └── global.css            # Resets, utilities (legacy aliases to brand.css)
├── astro.config.mjs              # Sitemap, fonts, prefetch
├── wrangler.toml                 # Cloudflare Pages + KV namespace bindings
└── tsconfig.json
```

---

## Routes

| Path                          | What                                                       |
| ----------------------------- | ---------------------------------------------------------- |
| `/`                           | Homepage — Hero, Thesis, Anatomy, Roster, Toolkit, Pricing |
| `/studio`, `/studio/gallery`  | NexAI Studio (AI photoshoots)                              |
| `/prompts`, `/prompts/<slug>` | Prompt Hub — 7 artifacts, beacon-tracked copies            |
| `/prompts/empty`              | Empty filter state                                         |
| `/apps`, `/apps/<slug>`       | App Vault — tools we use                                   |
| `/apps/stacks/<slug>`         | Curated tool stacks                                        |
| `/apps/empty`                 | Empty filter state                                         |
| `/blog`, `/blog/<slug>`       | Field Notes — drafts hidden in production                  |
| `/coming-soon`                | Placeholder for not-yet-shipped product surfaces           |

---

## Brand

The `Brand Guidelines.pdf` at `~/Desktop/NexAI Labs/Branding/` is authoritative.

- **Fonts:** Montserrat (display), Inter (body), Plus Jakarta Sans (accent — eyebrows, mono labels).
- **Colors:** `--brand-teal-bright #30C0CB`, `--brand-teal-dark #0E696D`, `--brand-ink #0C1418`. Quantized teal-aXX and white-aXX alpha scales. All in `src/styles/brand.css`.
- **Eyebrow:** one component (`src/components/brand/Eyebrow.astro`). `<Eyebrow number={N}>LABEL</Eyebrow>`. Sequential numbering across home sections.

**No new color literals or font stacks in component styles.** Add a token to `brand.css` first.

Full rules and one-off exceptions: [`./CLAUDE.md`](./CLAUDE.md). Operational rules (branches, commits, hooks, off-limits files): [`./AGENTS.md`](./AGENTS.md) and [`./CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## Git workflow

Single branch: `main`. Branch protection requires 1 review and CI green. Direct push to `main` is blocked.

Conventional commits — `type(scope): subject`. Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `perf`, `polish`, `test`. Scopes: `home`, `prompts`, `apps`, `blog`, `brand`, `seo`, `repo`, `copy`, `typography`, `policy`, `deps`, `audit-NN`, `security`.

```bash
git checkout -b feat/<short-name>
# work, commit
git push -u origin feat/<short-name>
gh pr create --base main
```

Required CI check: **`Lint, Type-check & Build`**. CODEOWNERS auto-assigns reviewers; Rahul (`@rahul-nexailabs`) merges after approval.

Pre-commit hooks (Husky + lint-staged) run `eslint --fix` and `prettier --write` on staged files. Don't bypass hooks (`--no-verify`). Full PR + hooks workflow: [`./CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## Development

```bash
npm run dev           # dev server with HMR
npm run build         # static build
npm run preview       # serve dist/ locally
npm run lint          # eslint
npm run type-check    # astro check (TS)
npm run format        # prettier --write
npm run test          # playwright smoke tests
```

---

## Deploy

`main` auto-deploys to Cloudflare Pages on push. Pages Function (`functions/api/runs.ts`) is bundled at deploy. KV namespace `PROMPT_HUB_KV` is bound via `wrangler.toml`.

Preview URLs: each PR gets a Cloudflare Pages preview deployment.

---

## Audits + planning

- `audits/` — periodic audit reports (architecture, security, SEO, branding, copy, repo cleanup). Read-only research; not source of truth. Numbering convention: `audits/NN-<slug>.md`; next free number is `15`.
- `docs/` — older planning docs and brand notes. Some are stale — verify against current code before relying on them.
- `~/.claude/plans/` — recent plan files (machine-generated).

---

## License

Proprietary — NexAI Labs.
