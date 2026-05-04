# NexAI Website — Agent Operating Manual

This file is auto-loaded by AI coding agents (Cursor, Codex, Cline, GitHub Copilot, etc.) that follow the `AGENTS.md` convention. It is the operational manual for working in this repo.

> **Brand and typography rules** live in [`./CLAUDE.md`](./CLAUDE.md) and apply to every agent regardless of name. Read them before editing any component or style. This file does not restate them.

## Setup

- Node ≥ 22 (see `.nvmrc`).
- `npm install`
- `npm run dev` → http://localhost:4321
- `npm run build` → static build to `dist/`
- `npm run preview` → serve `dist/` locally

## Branch + commit convention

- Single trunk: `main`. **No `dev` branch.** Direct push to `main` is blocked by branch protection.
- Branch from `main`: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `refactor/<slug>`, `docs/<slug>`, `polish/<slug>`.
- Conventional Commits: `type(scope): subject`. Subject under 72 chars.
  - Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `perf`, `polish`, `test`.
  - Scopes (use one that fits): `home`, `prompts`, `apps`, `blog`, `brand`, `seo`, `repo`, `copy`, `typography`, `policy`, `deps`, `audit-NN`, `security`.

## PR workflow

1. Push the branch.
2. Open a PR against `main`; fill `.github/PULL_REQUEST_TEMPLATE.md`.
3. Required CI status check: **`Lint, Type-check & Build`** (job `quality` in `.github/workflows/ci.yml`). Must be green.
4. CODEOWNERS routes review to `@rahul-nexailabs` (and `@amit-nexai` for `src/components/` and `src/pages/`).
5. **Rahul merges after approval.** Do not self-merge even if GitHub allows it.

## Pre-commit hooks

`.husky/pre-commit` runs `lint-staged` (`eslint --fix` + `prettier --write` on staged files). On failure:

```bash
npm run lint:fix && npm run format
git add <files>
git commit          # retry
```

Never bypass with `--no-verify`. Do not blanket-disable lint rules — use a single-line `// eslint-disable-next-line <rule>` with a reason on the line above the offence.

## Verify before pushing

```bash
npm run lint && npm run format:check && npm run type-check && npm run guard:fonts && npm run build
```

Same checks CI runs. Getting them green locally avoids round-trips.

## Off-limits without Rahul approval

- `.github/` (workflows, CODEOWNERS, PR template)
- `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`
- `wrangler.toml`, `public/_headers`, `public/_redirects`
- `src/styles/brand.css`, `src/styles/global.css`
- `scripts/guard-fonts.mjs`
- `src/scripts/lenis.ts`

If a task requires touching one of these, flag it in the PR description.

## Component patterns

- **Data-driven content.** Section copy, lists, agent specs, prompt entries live in `src/data/*.ts` (e.g. `home.ts`, `promptHub.ts`, `vault.ts`, `studio.ts`). Components consume typed data; do not hard-code content in markup.
- **Client behaviour.** Astro client scripts go in `src/scripts/` and are imported once from the consuming component. Use `astro:before-swap` and `astro:page-load` for SPA-safe init/teardown — see `src/scripts/agent-orbit.ts` for the pattern.
- **Brand primitives.** Reusable UI atoms live in `src/components/brand/`. `<Eyebrow number={N}>LABEL</Eyebrow>` is the reference impl for sequential numbered section labels.
- **Icons.** Inline SVG; component-local icon registry next to the consumer (e.g. `src/components/home/orbit-icons.ts`).

## Asset / media policy

- Images, thumbnails, short clips: **ImageKit** (CDN with transforms). URL builder: `src/config/imagekit.ts`.
- Long-form video: **YouTube embed**.
- `public/` holds only `favicon`, `robots.txt`, `_headers`, `_redirects`. **Do not commit images, video, or fonts under `public/`.**

## Audits

`audits/` is the decision log — numbered `NN-<slug>.md`. Read the relevant audit before changing the area it covers. Next free number: `15-<slug>.md`.

## Where to look first

| Question                                      | File                                     |
| --------------------------------------------- | ---------------------------------------- |
| Can I add a new font / color / utility class? | [`./CLAUDE.md`](./CLAUDE.md)             |
| Branch / commit / PR / hooks rules            | [`./CONTRIBUTING.md`](./CONTRIBUTING.md) |
| Project overview, stack, routes               | [`./README.md`](./README.md)             |
| Past decisions on a given area                | `audits/`                                |
| Visual source of truth                        | `Brand Guidelines.pdf`                   |
