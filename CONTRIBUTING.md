# Contributing to NexAI Website

This is the operational manual for working in this repo. AI coding agents should also read [`./AGENTS.md`](./AGENTS.md) — it's the same content addressed to non-human contributors.

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

1. Branch from `main`. Naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `refactor/<slug>`, `docs/<slug>`, `polish/<slug>`, `perf/<slug>`.
2. Work, commit using the convention below, push.
3. Open a PR against `main` using the template in `.github/PULL_REQUEST_TEMPLATE.md`.
4. Wait for the required CI status check (`Lint, Type-check & Build`) to pass.
5. CODEOWNERS auto-assigns reviewers. **Rahul (`@rahul-nexailabs`) merges after approval — do not self-merge.**

There is no `dev` branch. Older docs that reference `main → dev → feature/*` are stale.

## Commit messages

Conventional Commits: `type(scope): subject`. Subject under 72 characters.

| Field             | Values                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| Types             | `feat`, `fix`, `chore`, `refactor`, `docs`, `perf`, `polish`, `test`                           |
| Scopes (optional) | examples seen in this repo: `prompts`, `seo`, `deps`, `security`, `audit-NN`, `home`, `studio` |

Add a body when the why isn't obvious. Example:

```
fix(seo): footer links to live pages + sitemap excludes for stubs
```

## CODEOWNERS map

| Path                                           | Reviewer(s)                       |
| ---------------------------------------------- | --------------------------------- |
| `*` (default)                                  | `@rahul-nexailabs`                |
| `src/components/`, `src/pages/`                | `@rahul-nexailabs`, `@amit-nexai` |
| `src/styles/`                                  | `@rahul-nexailabs` (Rahul-only)   |
| `.github/`, `astro.config.mjs`, `package.json` | `@rahul-nexailabs` (Rahul-only)   |

PRs that change Rahul-only paths cannot merge without his review. Avoid touching those paths unless the PR is explicitly about them.

## Off-limits without prior approval

Do not modify these in a feature/fix PR:

- `.github/` (workflows, CODEOWNERS, PR template)
- `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`
- `wrangler.toml`, `public/_headers`, `public/_redirects`
- `src/styles/global.css` (design tokens, utilities — changes touch everything)
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
npm run build           # static production build
npm run test            # playwright smoke (optional locally)
```

CI runs the same set; getting them green locally avoids round-trips.

## Component patterns

- **Data-driven content.** Section copy and lists generally live in `src/data/*.ts` (typed) or `src/content/` (markdown collections). Components consume typed data; do not hard-code large blocks of copy in markup.
- **Client behaviour.** Astro client scripts go in `src/scripts/` and are imported once from the relevant component (`<script>import '../../scripts/foo';</script>`). Use `astro:before-swap` and `astro:page-load` for SPA-safe init/teardown.
- **Icons.** Inline SVG; component-local icon registries live next to the consumer when reused.

## Asset / media policy

- Images and short clips: **ImageKit** (CDN with on-the-fly transforms). URL builder: `src/config/imagekit.ts`.
- Long-form video: **YouTube embed**.
- `public/` holds only `favicon`, `robots.txt`, `_headers`, `_redirects`. **Do not commit images, video, or fonts under `public/`.**

## Audits

`audits/` is the decision log. Numbered files: `NN-<slug>.md`. Read past audits before changing the area they cover.

## Where to look first

- [`./AGENTS.md`](./AGENTS.md) — same rules, addressed to AI coding agents.
- [`./README.md`](./README.md) — project overview, stack, routes, structure.
- `audits/` — past decisions and inventories.
- `Brand Guidelines.pdf` (`~/Desktop/NexAI Labs/Branding/`) — visual source of truth.
