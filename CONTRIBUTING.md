# Contributing to NexAI Website

This is the operational manual for working in this repo. Brand and typography rules live in [`./CLAUDE.md`](./CLAUDE.md) (and mirrored for non-Claude agents in [`./AGENTS.md`](./AGENTS.md)) — do not duplicate them here.

## Setup

```bash
git clone https://github.com/nexailabs/NexAI-Website.git
cd NexAI-Website
npm install
npm run dev          # http://localhost:4321
```

Requires Node ≥ 22 (see `.nvmrc`).

## Branch workflow

Single trunk: `main`. Branch protection blocks direct pushes; everything goes through a PR.

1. Branch from `main`. Naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `refactor/<slug>`, `docs/<slug>`, `polish/<slug>`.
2. Work, commit using the convention below, push.
3. Open a PR against `main` using the template in `.github/PULL_REQUEST_TEMPLATE.md`.
4. Wait for the required CI status check (`Lint, Type-check & Build`) to pass.
5. CODEOWNERS auto-assigns reviewers. **Rahul (`@rahul-nexailabs`) merges after approval — do not self-merge.**

There is no `dev` branch. Older docs that reference `main → dev → feature/*` are stale.

## Commit messages

Conventional Commits: `type(scope): subject`. Subject under 72 characters.

| Field  | Values                                                                                                                    |
| ------ | ------------------------------------------------------------------------------------------------------------------------- |
| Types  | `feat`, `fix`, `chore`, `refactor`, `docs`, `perf`, `polish`, `test`                                                      |
| Scopes | `home`, `prompts`, `apps`, `blog`, `brand`, `seo`, `repo`, `copy`, `typography`, `policy`, `deps`, `audit-NN`, `security` |

Add a body when the why isn't obvious. Example:

```
feat(home): agent orbit card states + hero rewrite
```

## CODEOWNERS

`@rahul-nexailabs` owns every path. Every PR routes to him; no other reviewers are configured. He approves and merges. AI coding agents working on his behalf action via his admin override.

## Off-limits without prior approval

Do not modify these in a feature/fix PR:

- `.github/` (workflows, CODEOWNERS, PR template)
- `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`
- `wrangler.toml`, `public/_headers`, `public/_redirects`
- `src/styles/brand.css`, `src/styles/global.css` (brand tokens, typography system)
- `scripts/guard-fonts.mjs` (CI guard)
- `src/scripts/lenis.ts` (smooth-scroll integration — locked)

If a task genuinely needs one of these, raise it on the PR description and tag Rahul.

## Pre-commit hooks

`.husky/pre-commit` runs `lint-staged`:

- `eslint --fix` on `*.{js,ts,mjs,cjs,astro}`
- `prettier --write` on `*.{js,ts,mjs,cjs,astro,css,json,md,yml,yaml}`

If the hook fails:

```bash
npm run lint:fix      # auto-fix what eslint can
npm run format        # prettier on the whole tree
git add <files>
git commit            # retry
```

**Do not use `--no-verify`.** If a rule genuinely needs to be suppressed, add a single-line `// eslint-disable-next-line <rule>` with a reason on the line above the offence — never blanket-disable a whole file.

## Verify before pushing

```bash
npm run lint            # eslint
npm run format:check    # prettier (read-only)
npm run type-check      # astro check (TS)
npm run guard:fonts     # banned-font CI guard
npm run build           # static production build
npm run test            # playwright smoke (optional locally)
```

CI runs the same set; getting them green locally avoids round-trips.

## Component patterns

- **Data-driven content.** Section copy, lists, prompt entries, vault apps, agent specs live in `src/data/*.ts` — not inline in component markup. Components consume typed data and render it.
- **Client behaviour.** Astro client scripts go in `src/scripts/` and are imported once from the relevant component (`<script>import '../../scripts/foo';</script>`). Astro's `astro:before-swap` / `astro:page-load` events handle SPA-cleanup — see `src/scripts/agent-orbit.ts` for the pattern.
- **Brand primitives.** Reusable UI atoms live in `src/components/brand/`. `<Eyebrow number={N}>LABEL</Eyebrow>` is the reference impl for sequential numbered section labels.
- **Icons.** Inline SVG; component-local icon registry next to the consumer (e.g. `src/components/home/orbit-icons.ts`).

## Asset / media policy

- Images and short clips: **ImageKit** (CDN with on-the-fly transforms). URL builder: `src/config/imagekit.ts`.
- Long-form video: **YouTube embed**.
- `public/` holds only `favicon`, `robots.txt`, `_headers`, `_redirects`. **Do not commit images, video, or fonts under `public/`.**

## Audits

`audits/` is the decision log. Numbered files: `NN-<slug>.md`. Read past audits before changing the area they cover. Next free number: `15-<slug>.md`.

## Where to look first

- [`./CLAUDE.md`](./CLAUDE.md) — brand-font lockdown, typography system, mono usage, brand colors.
- [`./AGENTS.md`](./AGENTS.md) — agent operating manual (this file's twin for non-Claude agents).
- [`./README.md`](./README.md) — project overview, stack, routes, structure.
- `audits/` — past decisions and inventories.
- `Brand Guidelines.pdf` (`~/Desktop/NexAI Labs/Branding/`) — visual source of truth.
