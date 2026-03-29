# Contributing to NexAI Website

## Setup

```bash
git clone https://github.com/nexailabs/NexAI-Website.git
cd NexAI-Website
npm install
npm run dev
```

Requires Node 22+ (see `.nvmrc`).

## Branch Workflow

```
main          ← production (protected — requires PR + review + CI pass)
  └── dev     ← integration branch
       └── feature/*  ← your work goes here
```

1. Create a branch from `dev`: `git checkout -b feature/your-feature dev`
2. Make your changes
3. Open a PR to `dev`, fill out the PR template
4. Get 1 approval + CI passing, then merge

## Before Submitting a PR

Pre-commit hooks run automatically, but verify manually:

```bash
npm run lint          # ESLint
npm run format:check  # Prettier
npm run type-check    # Astro type checking
npm run build         # Production build
```

## Code Style

Enforced automatically — no manual work needed:

- **Prettier** formats on save and pre-commit (tabs, single quotes, 100 char width)
- **ESLint** catches errors and unused variables
- **Husky + lint-staged** runs both on every commit

## Commit Messages

Follow the existing convention:

```
feat: add new hero section
fix: mobile text overflow on cards
chore: update dependencies
docs: add deployment guide
style: adjust card spacing on mobile
```

Keep the first line under 72 characters. Add detail in the body if needed.

## Key Files

| File                    | Note                                                    |
| ----------------------- | ------------------------------------------------------- |
| `src/scripts/lenis.ts`  | Locked — do not modify without discussion               |
| `src/styles/global.css` | Design tokens and utilities — changes affect everything |
| `public/_headers`       | Cloudflare security headers — changes affect production |
