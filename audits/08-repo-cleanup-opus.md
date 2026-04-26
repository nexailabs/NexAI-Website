# Repo Cleanup, Documentation & Dev SOP Audit

Date: 2026-04-26
Auditor: Claude Opus 4.7 (1M context). Codex was unavailable; I substituted.
Scope: Tech debt, documentation debt, GitHub plumbing, dev SOPs.
Repo: `nexailabs/NexAI-Website` — Astro 6 marketing site, deployed via Cloudflare Pages.
Method: Read-only inspection of every config, workflow, doc, script, component, page, and data file. Cross-checked component/script/dependency definitions against import sites with Grep. No source code modified.

---

## 1. Executive Summary

The repo is in better shape than most solo-founder marketing sites. CI is structurally correct, Husky + lint-staged + Prettier + ESLint + TypeScript strict are all wired, CODEOWNERS exists, Dependabot exists, the PR template exists. Nothing here is a fire. The biggest issues are stale baggage from the Astro 5 era, a `dev` branch workflow documented in README that nobody is using, and missing operational docs that a teammate would need on day one.

- **Stale dependencies in `package.json`.** `@fontsource/cormorant-garamond`, `@fontsource/inter`, `@fontsource/montserrat` are still declared but no source file imports them — the Astro 6 migration moved font loading to `astro:assets` `<Font>` + `fontProviders.fontsource()` in `astro.config.mjs`. They add ~9 MB to `node_modules` for nothing.
- **Documentation drift.** `README.md` says "Astro 5", "GSAP 3.14 + ScrollTrigger", "Inter 400/600/800" and a `main → dev → feature/*` branch model. Actual: Astro 6, no GSAP anywhere in `src/`, four font families, and the team works directly on `feature/*` → `main`. Branch protection requires PR + 1 review on `main`, which contradicts the README's "dev as integration branch" diagram.
- **Dead components and assets.** `src/components/CategoryPage.astro` and `src/components/vault/Arrow.astro` have zero importers. `public/assets/brands/*.png` (~312 KB across 11 files), `public/assets/og-default.png` and `public/assets/og-ai-shoots.png` (~180 KB) are referenced nowhere — all brand logos and OG images are pulled from ImageKit. `public/assets/logo/nexai-icon.png`, `nexai-logo-black.png`, `nexai-logo-white.png` (~167 KB) are also unused — Navbar/Footer pull from ImageKit too.
- **Workers Builds vestige still gating PRs.** Branch protection lists "Workers Builds" as a required check from a now-closed Cloudflare Workers PR. Every PR has a permanently-failing required check that has to be force-merged. CI itself (`.github/workflows/ci.yml`) is healthy.
- **Operational docs missing.** No `ARCHITECTURE.md`, no deploy/rollback SOP, no on-call doc, no ADR scaffold, no release notes process, no documented brand voice doc beyond `docs/BRAND.md` (which is design tokens, not copy voice). `CONTRIBUTING.md` exists but is 67 lines and points at a `dev` branch workflow that does not match reality.
- **Test scope is hollow on a multi-route site.** `tests/smoke.spec.ts` covers `/` and `/studio/`. There are no smoke tests for `/blog`, `/blog/[slug]`, `/prompts`, `/prompts/[slug]`, `/apps`, `/apps/[slug]`, `/apps/stacks/[slug]`, `/coming-soon`, or the `/api/runs` Pages Function. Visual snapshot suite is `describe.skip`'d.

---

## 2. Per-Area Scorecard

| Area                                | Score | Notes                                                                                                                                                                                                                                                 |
| ----------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build configuration                 | 5 / 5 | `tsconfig` strict, `astro.config.mjs` clean, sitemap excludes wired, fonts via Astro 6 provider.                                                                                                                                                      |
| Lint / format / pre-commit          | 5 / 5 | ESLint 10 flat config, Prettier 3 with Astro plugin, Husky `pre-commit` runs `lint-staged`, EditorConfig present.                                                                                                                                     |
| Type safety                         | 4 / 5 | `astro/tsconfigs/strict`, zero `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck` in src. One `eslint-disable prefer-rest-params` in `Layout.astro:132` (justified — Cal.com analytics shim). Astro check is in CI.                                    |
| CI workflows                        | 4 / 5 | One real workflow plus Claude bot. Actions pinned to `@v4`. No job timeout. Cache is on. Tests run.                                                                                                                                                   |
| GitHub plumbing                     | 3 / 5 | CODEOWNERS, PR template, two issue templates, Dependabot all present. Issue templates are bare. PR template lacks risk/rollback section. CODEOWNERS includes `@amit-nexai` who may not be a real GitHub user — verify.                                |
| Branch protection / required checks | 2 / 5 | "Workers Builds" required check is a vestige and is failing on every PR. Needs to be removed in repo settings.                                                                                                                                        |
| Repo docs                           | 2 / 5 | README is solid but stale (Astro 5, GSAP, dev branch). CONTRIBUTING contradicts the README. No ARCHITECTURE.md, no SOPs.                                                                                                                              |
| Project / status docs               | 4 / 5 | `docs/BUILD-PLAN.md`, `docs/BRAND.md`, `docs/REFERENCES.md` are useful. `docs/superpowers/` plans are present and current. `TASKS.md` is alive.                                                                                                       |
| Testing                             | 2 / 5 | One smoke file, two pages covered, visual suite skipped, no API test, no broken-link test, no Lighthouse-in-CI, no a11y test.                                                                                                                         |
| Dependency hygiene                  | 3 / 5 | Caret ranges everywhere, no `engines.npm`, three @fontsource packages no longer imported. Lockfile is committed. Dependabot weekly is fine for a marketing site.                                                                                      |
| Security posture                    | 4 / 5 | `_headers` ships HSTS+CSP+COOP+frame-ancestors. SECURITY.md exists. No secrets found in source. The KV namespace IDs in `wrangler.toml` are public bindings, not secrets. `/api/runs` is a known weak spot (called out in `audits/04-exhaustive.md`). |
| Dead code / dead assets             | 3 / 5 | Two unused components, ~660 KB of unused public assets, three unused npm deps.                                                                                                                                                                        |
| Deploy / rollback                   | 2 / 5 | Cloudflare Pages auto-deploys from `main`. There is no documented rollback procedure, no documented preview-URL convention, no documented env-separation between preview and prod.                                                                    |

Weighted average: ~3.4 / 5. Translation: above the median solo-founder site, below the bar for a "ready to onboard a new dev tomorrow" repo.

---

## 3. Dead-Code Inventory

### Components defined but never imported

| File                                | Size    | Status                                                                                                                             | Action  |
| ----------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `src/components/CategoryPage.astro` | 1.36 KB | Zero importers in `src/`. Only mentioned in `prompts/audit-studio-page.md` (a planning doc).                                       | Delete. |
| `src/components/vault/Arrow.astro`  | 0.40 KB | Zero importers anywhere. The string "Arrow" only appears in unrelated keyboard-navigation switch cases (`ArrowLeft`/`ArrowRight`). | Delete. |

### Components imported but never rendered

None found. Every import resolves to a `<Component … />` usage.

### Unused public assets

All of these are referenced nowhere in `src/` and have ImageKit-served equivalents in production:

| File                                      | Size    | Why unused                                                    |
| ----------------------------------------- | ------- | ------------------------------------------------------------- |
| `public/assets/brands/Banno.png`          | 13.5 KB | Brand marquee pulls from `${ik}/studio/brands/...`            |
| `public/assets/brands/DBJ.png`            | 14.9 KB | same                                                          |
| `public/assets/brands/GANGA ONG.png`      | 16.4 KB | same; also note space in filename                             |
| `public/assets/brands/INDO ERA PNG.png`   | 14.4 KB | same; space in filename                                       |
| `public/assets/brands/JANASYA.png`        | 9.1 KB  | same                                                          |
| `public/assets/brands/JUGO.png`           | 13.1 KB | same                                                          |
| `public/assets/brands/STF.png`            | 19.8 KB | same                                                          |
| `public/assets/brands/leemboodi.png`      | 149 KB  | same                                                          |
| `public/assets/brands/skylee.png`         | 18.1 KB | same                                                          |
| `public/assets/brands/xyxx.png`           | 6.8 KB  | same                                                          |
| `public/assets/brands/yufta.png`          | 10.7 KB | same                                                          |
| `public/assets/og-default.png`            | 88.9 KB | OG image is fetched from `${ik}/nexai/og/default.png`.        |
| `public/assets/og-ai-shoots.png`          | 86.9 KB | No reference anywhere in `src/`.                              |
| `public/assets/logo/nexai-icon.png`       | 58.6 KB | Navbar + Footer reference `${ik}/nexai/logos/nexai-icon.png`. |
| `public/assets/logo/nexai-logo-black.png` | 42.1 KB | No reference in `src/`.                                       |
| `public/assets/logo/nexai-logo-white.png` | 62.6 KB | No reference in `src/`.                                       |

Total dead asset weight: ~625 KB. README claims `public/assets/logo/` "stays in repo because they're small and rarely change" — the production site does not actually serve them. Either delete them or wire them as a fallback. Pick one.

### Empty-state pages excluded from sitemap, possibly dead

Confirmed live: `astro.config.mjs` filters `/coming-soon`, `/prompts/empty`, `/apps/empty` out of the sitemap. They are still indexable HTML pages. If they are intended as fallbacks they should be `noindex`. Tracked in `audits/03-seo-content-ux.md`.

### Suppressions

- `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck`: 0 occurrences in `src/`.
- `eslint-disable`: 1 occurrence (`src/layouts/Layout.astro:132`, justified Cal.com shim).
- `TODO`/`FIXME`/`HACK`: 0 occurrences in `src/`.

This is unusually clean. Don't lose this discipline.

---

## 4. Unused-Deps Inventory

`package.json` declares 6 dependencies and 10 devDependencies. Cross-checked every name against a Grep for `from ['"]<name>` in `src/` and `astro.config.mjs`.

### Confirmed unused (drop these)

| Package                          | Declared  | Imported in source? | Why it's still here                                                                                                |
| -------------------------------- | --------- | ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `@fontsource/cormorant-garamond` | `^5.2.11` | No                  | Pre-Astro-6 leftover. Fonts now load via `fontProviders.fontsource()` + `<Font cssVariable="--font-cormorant" />`. |
| `@fontsource/inter`              | `^5.2.8`  | No                  | Same.                                                                                                              |
| `@fontsource/montserrat`         | `^5.2.8`  | No                  | Same.                                                                                                              |

Removing all three saves ~9 MB in `node_modules` and removes the false impression that fonts are loaded the old way.

### Confirmed used

| Package                                                            | Used at                                                                      |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `astro`                                                            | every `*.astro` file (transitively), `astro.config.mjs`, `content.config.ts` |
| `@astrojs/sitemap`                                                 | `astro.config.mjs`                                                           |
| `lenis`                                                            | `src/scripts/lenis.ts`                                                       |
| `@astrojs/check`                                                   | `npm run type-check`                                                         |
| `@playwright/test`                                                 | `playwright.config.ts`, `tests/smoke.spec.ts`                                |
| `@eslint/js`, `eslint`, `eslint-plugin-astro`, `typescript-eslint` | `eslint.config.mjs`                                                          |
| `prettier`, `prettier-plugin-astro`                                | `.prettierrc`, lint-staged                                                   |
| `husky`                                                            | `.husky/pre-commit`                                                          |
| `lint-staged`                                                      | `package.json`                                                               |

### Engines / version pinning

- `engines.node = ">=22"` is correct. `.nvmrc` says `22`. CI uses `node-version-file: .nvmrc`. Consistent.
- No `engines.npm` set. Fine for a solo project, but tightens reproducibility if added (e.g. `"npm": ">=10"`).
- All dependencies use caret ranges. Acceptable for a marketing site; Dependabot is on weekly schedule. Consider pinning `astro` exactly (no caret) given the recent v5→v6 churn — a minor bump to `astro@6.2` should be a deliberate decision, not a Dependabot drive-by.

---

## 5. Workflow Health Table

| Workflow                           | File                           | Triggers                                                                        | Jobs                                                          | Health | Issues                                                                                                                                                                                                     |
| ---------------------------------- | ------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI (lint, type-check, build, test) | `.github/workflows/ci.yml`     | `push: [main]`, `pull_request: [main]`                                          | `quality` (lint, format:check, type-check, build, Playwright) | Green  | No `timeout-minutes` set on the job (default 360 min — risk of stuck runners burning CI minutes). No concurrency group (back-to-back pushes on a branch can race). Playwright browser install is uncached. |
| Claude Code bot                    | `.github/workflows/claude.yml` | `issue_comment`, `pull_request_review_comment`, `issues`, `pull_request_review` | `claude`                                                      | Green  | Locked to `github.event.sender.login == 'rahul-nexailabs'`, which is correct hardening. Uses `anthropics/claude-code-action@v1` (major-tag pin — acceptable, but Dependabot won't see point releases).     |

Things you might think exist but don't:

- No "Workers Builds" workflow file in this repo. The required-check entry under branch protection is left over from a closed Cloudflare Workers PR. **Remove it from branch protection settings**; the file is already gone.
- No Lighthouse / PSI workflow. Recent commits show ad-hoc PSI screenshots (`/nav-and-orbit-*.png` is in `.gitignore`). Consider `treosh/lighthouse-ci-action` on PR.
- No link-check workflow. With three doc-heavy directories (`docs/`, `prompts/`, `plans/`) and a real blog, broken internal links are inevitable. `lycheeverse/lychee-action` is one option.
- No CodeQL. For a static marketing site this is borderline — the only attack surface is `functions/api/runs.ts`, which has its own callouts in `audits/04-exhaustive.md`.

### Action version pinning

`actions/checkout@v4`, `actions/setup-node@v4`, `anthropics/claude-code-action@v1`. All major-tag. No SHA pinning. Acceptable for a marketing site; SHA pin would tighten supply chain at a maintenance cost.

### Secrets

Only `CLAUDE_CODE_OAUTH_TOKEN` is referenced. Cloudflare Pages handles deploy secrets directly, so nothing else is needed in repo secrets.

### Caching

- Node modules: cached via `setup-node` `cache: 'npm'` keyed off `package-lock.json`. Good.
- Playwright browsers: not cached. Each CI run downloads Chromium fresh. Add a cache step keyed by Playwright version; saves ~30s per run.

---

## 6. Docs Debt

### Existing repo-root docs

- `README.md` (10.9 KB) — solid but stale.
- `CONTRIBUTING.md` (1.8 KB) — short, contradicts the README on branch model.
- `SECURITY.md` (0.6 KB) — minimal but adequate.
- `TASKS.md` (0.9 KB) — current; tracking CSP work.
- No `ARCHITECTURE.md`, no `DEPLOY.md`, no `RUNBOOK.md`, no `ADR.md`, no `RELEASE.md`, no `CODE_OF_CONDUCT.md`, no `CHANGELOG.md`.

### `docs/` directory inventory (13 files)

Useful and current:

- `docs/BUILD-PLAN.md` — 21-phase build guide.
- `docs/BRAND.md` — design tokens.
- `docs/REFERENCES.md` — competitor/inspiration.
- `docs/AI-SHOOTS-CONTENT.md` — AI Shoots copy.
- `docs/superpowers/plans/2026-03-30-post-audit-hardening.md`
- `docs/superpowers/specs/2026-03-30-post-audit-hardening-design.md`

Stale or single-use:

- `docs/CODEX-1-VISUAL-ALIGNMENT.md`, `docs/CODEX-2-ANIMATION-POLISH.md`, `docs/CODEX-3-RESPONSIVE-EDGE-CASES.md` — Codex hand-off briefs from the old execution model. Either move under `docs/archive/` or delete.
- `docs/AI-SHOOTS-CONTENT.md` references the AI Shoots / `/studio` page; check whether any phrases are still in production copy.
- `docs/website-analysis.md` — critique of "the current live site" — date this or move it.
- `docs/OLD-vs-NEW-REPO-COMPARISON.md` — historical context. Move to `docs/archive/`.
- `docs/gallery-upgrade-plan.md` — completed? Status comment at top would help.
- `docs/company-overview.md` — overview of the company, not the codebase. Either keep or move to a separate company-docs repo.

### Missing docs (in priority order)

1. **`ARCHITECTURE.md`.** One page. Section headings: Pages & Routing, Data Layer (`src/data/`, content collections), Layout & Globals, Animations & Scripts (Lenis/Navbar/StudioHero), Media Pipeline (ImageKit + transforms), Edge Functions (`functions/api/runs.ts` + KV), Build Output. Goal: "If I were debugging at 11pm, where do I look?"
2. **`docs/DEPLOY.md` or section in CONTRIBUTING.** Explain Cloudflare Pages connection, the `pages_build_output_dir = "dist"`, KV namespace bindings (production + preview), preview URL convention, what triggers a deploy, what happens to PRs.
3. **`docs/RUNBOOK.md`.** Rollback procedure (Cloudflare Pages → Deployments → Retry old deploy or `git revert <sha> && git push`), how to disable Cal.com embed if it breaks the site, how to drop all KV counter values, how to rotate `CLAUDE_CODE_OAUTH_TOKEN`, how to handle a broken font provider.
4. **`docs/adr/0000-template.md` and `docs/adr/0001-astro-static-cloudflare-pages.md`.** Three ADRs of value to write retroactively: Astro static + Cloudflare Pages choice, ImageKit over self-hosted/Astro `<Image>`, KV-counter on Pages Functions vs Durable Object. Then make ADRs the standard for "we considered X and chose Y".
5. **`docs/VOICE.md` (or rename `BRAND.md` to cover voice).** The `audits/03-seo-content-ux.md` file calls out repeated stock phrases ("real work / fixed price / no hard sell / month two") and excessive Cormorant emphasis. A voice doc with do/don't and three sample sentences fixes that during writing, not in review.
6. **`docs/RELEASE.md` or `CHANGELOG.md`.** Even a one-line-per-release log catches regressions. Keep-a-changelog format. Auto-update from PR titles is overkill for current scale; manual is fine.
7. **`docs/ONCALL.md`.** Solo founder, but if Amit ships and breaks the site at 2am IST: who notices, where to look, how to roll back. One page.
8. **`AGENTS.md` / `CLAUDE.md` at repo root.** Tells AI assistants the rules: don't touch `src/scripts/lenis.ts` without discussion, don't import `@fontsource/*` (use `<Font>`), don't edit `wrangler.toml` IDs without note. The user's global `CLAUDE.md` covers some of this, but a repo-local one binds it to the project.

### Specific README fixes (drop-in patch list)

- Line 5 / line 29: "Astro 5" → "Astro 6". Drop "GSAP 3.14 + ScrollTrigger" — there is no GSAP in `src/` (verified by Grep; only docs reference it).
- Line 35: "Inter (400, 600, 800)" → "Inter, Cormorant Garamond, Montserrat, Anton via `astro:assets`".
- Lines 81-89: Remove `dev` branch from the diagram. It does not exist as a remote branch (`git branch -a` confirms). Either bring it back or update the doc; you can't hold both.
- Lines 1-1: CI badge points to `branch=dev`. Change to `branch=main` or remove.
- Lines 95-127: Update "Starting New Work" to `git checkout -b feature/x main` (not `dev`).
- README lists only `src/components/`, `src/layouts/`, `src/pages/`, `src/scripts/`, `src/styles/`. Reality also has `src/components/{home,blog,promptHub,vault}/`, `src/config/`, `src/content/`, `src/data/`, `src/types/`, `functions/api/`. Update the tree.

---

## 7. Proposed Repo SOP (drop-in CONTRIBUTING.md sketch)

Replace the current `CONTRIBUTING.md` with a single-source-of-truth file that matches reality and absorbs the README's process content. The README then shrinks to "what is this site / how do I run it / where are the docs".

```markdown
# Contributing to NexAI Labs Website

## TL;DR

- Branch off `main`, open a PR, get one approval, merge. No `dev` branch.
- Do not push to `main` directly. Branch protection blocks it.
- Pre-commit runs `lint-staged`. CI runs `lint` + `format:check` + `type-check` + `build` + Playwright. All four must pass.
- Cloudflare Pages auto-deploys merged PRs to production. There is no staging environment.

## Setup

1. `nvm use` (Node 22, see `.nvmrc`).
2. `npm ci`.
3. `npm run dev` → http://localhost:4321.
4. (optional) `npx playwright install chromium` to run the smoke suite locally.

## Branch & PR Conventions

- Branch names: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>`, `perf/<slug>`. Slug is kebab-case, ≤ 40 chars.
- One PR per concern. If you find drive-by fixes, ship them as a separate `chore/` PR — do not bundle.
- Title prefix: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `perf:`, `refactor:`, `style:`, `test:`). Optional scope: `fix(navbar): close on Escape`.
- PR body uses the template (Summary / Changes / Screenshots / Checklist). Add a "Risk" line if the change touches `src/scripts/lenis.ts`, `_headers`, `wrangler.toml`, or `functions/api/`.

## Commit Messages

- Conventional Commits, present tense, imperative mood.
- 72-char first line. Body wraps at 80.
- Group commits before merge: squash if 5+ noisy commits, otherwise let them through.

## Pre-Merge Checklist

- [ ] `npm run lint`
- [ ] `npm run format:check`
- [ ] `npm run type-check`
- [ ] `npm run build`
- [ ] `npm test` (or document why it was skipped)
- [ ] No commits of files in `node_modules/`, `dist/`, `.astro/`, or assets larger than 200 KB
- [ ] If a public-facing copy changed, the change is in `src/data/*.ts` or content collection, not hard-coded in a component
- [ ] If a new env var was added, `.env.example` is updated
- [ ] If a new public route was added, the sitemap filter in `astro.config.mjs` is correct (exclude empty/coming-soon/private routes)
- [ ] If `_headers` changed, the CSP additions are documented in the PR body

## Locked Files (do not touch without an ADR)

- `src/scripts/lenis.ts` — scroll engine. Visible breakage on every page if mis-edited.
- `public/_headers` — CSP and security headers. Production-affecting.
- `wrangler.toml` — KV bindings. Wrong IDs = lost counter data.

## Where Things Live

- Components: `src/components/<feature>/` (home, blog, promptHub, vault) or `src/components/` for cross-page (Navbar, Footer, CustomCursor).
- Pages & routes: `src/pages/`. Dynamic routes use `[...slug].astro`.
- Data: `src/data/*.ts` (TypeScript-typed lists). Content collections: `src/content/blog/*.md`.
- Edge functions: `functions/api/*.ts`. Deployed by Cloudflare Pages, not Astro.
- Styles: `src/styles/global.css` (tokens + utilities) + scoped `<style>` blocks in components.
- Media: ImageKit (`src/config/imagekit.ts` for transforms). Do not commit media to git.

## Commit & PR Approval Roles

- All PRs: at least one approval from `@rahul-nexailabs` (CODEOWNERS).
- Workflow / CI / package config changes: `@rahul-nexailabs` only.

## Local Verification SOP (5 steps before opening a PR)

1. `git fetch && git rebase origin/main`
2. `npm ci` if `package-lock.json` changed
3. `npm run lint && npm run format:check && npm run type-check && npm run build`
4. `npm run preview` and click through the routes you touched
5. `npm test` (skip is fine for CSS-only changes; document in PR)

## Troubleshooting

- Husky hook didn't run? `npm run prepare` to reinstall.
- Astro check fails on `astro:content`? Delete `.astro/` and rebuild.
- Cloudflare Pages preview fails? Check `wrangler.toml` KV bindings and the build log on Cloudflare dashboard.
```

---

## 8. Top 15 Ranked Fixes

Effort key: S = ≤30 min. M = 30 min – 2 hr. L = 2+ hr.

| #   | Fix                                                                                                                                    | Effort | Impact | Why                                                                                                                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------ |
| 1   | Remove "Workers Builds" from required checks in branch protection                                                                      | S      | High   | Every PR currently has a permanently-failing required check. Unblocks merge UX immediately.                        |
| 2   | Drop `@fontsource/cormorant-garamond`, `@fontsource/inter`, `@fontsource/montserrat` from `package.json`                               | S      | Med    | They are not imported anywhere; they're confusing future-you and bloating `node_modules` by ~9 MB.                 |
| 3   | Update `README.md` to match reality: Astro 6, four fonts, no GSAP, no `dev` branch, fix CI badge                                       | S      | High   | Onboarding doc must not lie.                                                                                       |
| 4   | Rewrite `CONTRIBUTING.md` to the SOP in §7 of this audit                                                                               | S      | High   | Single source of truth; removes the README/CONTRIBUTING contradiction.                                             |
| 5   | Delete `src/components/CategoryPage.astro` and `src/components/vault/Arrow.astro`                                                      | S      | Low    | Dead components. Verified zero importers.                                                                          |
| 6   | Delete or relocate `public/assets/brands/*` (or move to ImageKit if intended as fallback)                                              | S      | Med    | ~312 KB of dead assets shipped on every clone. Spaces in filenames (`GANGA ONG.png`) are also fragile across OSes. |
| 7   | Delete `public/assets/og-default.png`, `og-ai-shoots.png`, and the local `logo/` PNGs (or wire them as ImageKit fallback)              | S      | Med    | ~625 KB total dead. Pick one source of truth.                                                                      |
| 8   | Add `timeout-minutes: 15` and `concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }` to `.github/workflows/ci.yml`   | S      | Med    | Prevents stuck runners and stale CI on branch updates.                                                             |
| 9   | Cache Playwright browsers in CI via `actions/cache` keyed by Playwright version                                                        | S      | Low    | Saves ~30s per CI run.                                                                                             |
| 10  | Write `ARCHITECTURE.md` (1 page, structure in §6)                                                                                      | M      | High   | Cuts onboarding time from "read 10 docs" to "read this one".                                                       |
| 11  | Write `docs/RUNBOOK.md` covering rollback, env rotation, KV reset, Cal embed disable                                                   | M      | High   | Solo founders without a runbook re-derive the rollback procedure under pressure.                                   |
| 12  | Add `AGENTS.md` (or repo-root `CLAUDE.md`) with the locked-files list and "do not import @fontsource" / "do not modify lenis.ts" rules | S      | Med    | Locks AI assistants to your conventions.                                                                           |
| 13  | Expand `tests/smoke.spec.ts` to cover `/blog`, `/prompts`, `/apps`, `/coming-soon`, `/api/runs` (GET)                                  | M      | High   | Currently only `/` and `/studio/` are tested; everything else can break silently.                                  |
| 14  | Move `docs/CODEX-1-…`, `CODEX-2-…`, `CODEX-3-…`, `OLD-vs-NEW-REPO-COMPARISON.md`, `gallery-upgrade-plan.md` to `docs/archive/`         | S      | Low    | Reduces signal-to-noise in the docs root.                                                                          |
| 15  | Add `docs/adr/` with `0000-template.md` and three retroactive ADRs (Astro+CF Pages, ImageKit, KV counter on Pages Functions)           | M      | Med    | Future "why did we choose X" questions get answered in 30 seconds instead of a code archaeology session.           |

---

## Appendix A — Verification Commands Used

- `git -C <repo> log --oneline main -20` — confirmed `main` is the active branch and only branch with commits.
- `git -C <repo> branch -a` — confirmed only `main` and a few stale remote `fix/*` branches; no `dev` exists.
- `Grep "from ['\"].*\\.astro" src/` — full importer graph for components.
- `Grep "from ['\"]@fontsource"` repo-wide — confirmed zero imports in `src/`, only lockfile + package.json + planning docs reference these packages.
- `Grep "@ts-ignore|@ts-expect-error|@ts-nocheck" src/` — zero matches.
- `Grep "TODO|FIXME|HACK|XXX" src/` — zero matches.
- `Grep "key.*=.*['\"]\\w{16,}|secret|token" src/ -i` — zero matches; KV namespace IDs in `wrangler.toml` are public bindings, not secrets.
- File-system inspection of `public/assets/`, cross-checked each filename against `Grep` in `src/` and `astro.config.mjs`.

## Appendix B — What I Did Not Do

- Did not run `npm ci` or `npm run build`. Audit is read-only by request.
- Did not check live Cloudflare Pages dashboard for branch deploy / preview URL settings or for the actual list of "required status checks" on `main`. The Workers-Builds-vestige call is based on the user's report; please verify in repo Settings → Branches.
- Did not enumerate `node_modules/` to confirm that no transitive dep imports `@fontsource/*` — only confirmed first-party absence. A `npm ls @fontsource/inter` would close that loop.
- Did not run `npx depcheck` or `npx knip`. Doing so locally is the next-cheapest verification step for the unused-deps and dead-code sections.
- Did not modify any source code or settings, per audit constraints.
