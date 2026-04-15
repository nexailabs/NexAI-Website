# Codex — Build the App Vault page

You are building the App Vault page for the NexAI Labs marketing site. This is a curated, editorial, dark-native directory of the software NexAI actually uses and recommends. It competes with efficient.app and openalternative.co and must feel tighter, faster, and more opinionated than both.

The full spec lives at `plans/app-vault.md` in this repo. **Read that file in full before you write a single line of code.** This document is the handoff wrapper — it locks in all defaults, defines the hard rules, and specifies how to verify when you're done. Every decision is already made. Start coding immediately. The spec is the authority on scope, schema, components, layout, and phases.

---

## Repo facts you must respect

- Astro 5.18.1 static site, Cloudflare Pages, TypeScript, vanilla CSS.
- No React, no Vue, no Svelte, no Tailwind, no CSS-in-JS. Astro components + scoped `<style>` blocks only.
- Design tokens live in `src/styles/global.css` (`--color-brand-teal`, `--color-brand-cyan`, `--color-surface-elevated`, `--font-inter`, `--font-cormorant`, `--space-*`, `--ease-out-expo`, etc.). Reuse them. Do not invent new color or spacing values.
- Global layout wrapper: `src/layouts/Layout.astro`. It already handles `<head>`, SEO meta, OG/Twitter, favicons, Astro 5 Fonts API (Inter, Cormorant, Montserrat), the Cal.com booking dialog, View Transitions, and the global `CustomCursor` + `Footer`. Reuse it — do not rebuild the page chrome.
- Navigation: `src/config/navigation.ts` already has an `app-vault` entry. Currently it points at a placeholder. Flip its `href` to `/app-vault` as part of PR 1.
- Media: `src/config/imagekit.ts` centralises ImageKit transforms. Add the `appLogo`, `appLogo2x`, and `appShot` presets there — do not scatter `?tr=` strings through components.
- Homepage composition pattern for reference: `src/pages/index.astro` + `src/components/home/HomeHero.astro`. Use the same rhythm for the Vault hero.
- Sitemap: `@astrojs/sitemap` is already installed and wired in `astro.config.mjs`. Verify new routes appear in the built sitemap after PR 1.

## Locked decisions — use these defaults, do not stop to ask

All decisions are locked. Start on a new branch off `main` and proceed straight to Phase 1. Rahul will edit values after PR 1 lands if anything needs tweaking — treat everything here as live, not as a questionnaire.

1. **Categories (frozen, append-only enum):** `['AI Writing', 'AI Agents', 'Vibe Coding', 'Dev Tools', 'Design', 'Productivity', 'Research', 'Marketing', 'Data & Analytics', 'Creative / Media']`.
2. **Tags (frozen, append-only enum, 20 values):** `llm, rag, agents, image-gen, video-gen, voice, automation, notes, browser, terminal, ide, no-code, analytics, scraping, email, crm, design-system, prototyping, docs, search`.
3. **Pricing enum:** `['free', 'freemium', 'paid', 'open-source']`.
4. **Platforms enum:** `['web', 'mac', 'windows', 'linux', 'ios', 'android', 'cli', 'api']`.
5. **Seed data (PR 1 ships with these 10 apps):** seed the vault yourself with the following well-known tools. Write real taglines and descriptions. Use official ImageKit-safe logo URLs (either upload to `nexailabs/app-vault/` on ImageKit or use each tool's official logo CDN proxied through `https://ik.imagekit.io/nexailabs/` remote-fetch — whichever is faster). Rahul will swap them to his real curated list after PR 1 lands. The list exists so the page ships with content, not empty state.
   - **Claude** (AI Agents, paid, web/mac/windows/ios/android/api, featured)
   - **ChatGPT** (AI Writing, freemium, web/mac/windows/ios/android/api, featured)
   - **Cursor** (Vibe Coding, freemium, mac/windows/linux, featured)
   - **Codex CLI** (Vibe Coding, free, cli, featured)
   - **Linear** (Productivity, freemium, web/mac/windows/ios)
   - **Notion** (Productivity, freemium, web/mac/windows/ios/android)
   - **Framer** (Design, freemium, web)
   - **Figma** (Design, freemium, web/mac/windows)
   - **v0 by Vercel** (Vibe Coding, freemium, web)
   - **Raycast** (Productivity, freemium, mac)
6. **Logo pipeline:** logos live at `nexailabs/app-vault/<slug>.png` on ImageKit endpoint `https://ik.imagekit.io/nexailabs`. If a logo isn't uploaded yet, use ImageKit remote-fetch (`/proxy/<encoded-url>`) so PR 1 ships without a blocking upload step. Document the upload path in a short `README.md` inside `src/components/app-vault/` (not at repo root — keep it scoped).
7. **Detail pages:** deferred to PR 3 (per `plans/app-vault.md` §6). PR 1 cards link directly to `affiliateUrl ?? websiteUrl` in a new tab.
8. **Affiliate links:** no affiliate URLs in the seed data — leave `affiliateUrl` undefined on all 10 seed entries. When Rahul later adds affiliate links, the card anchor must include `rel="noopener sponsored nofollow"` and an inline `<small>` disclosure line near the hero stating "Some links are affiliate links — they help fund the vault and cost you nothing extra." PR 1 just ships the plumbing (conditional `rel` + conditional disclosure render); neither renders when no affiliate URLs exist.
9. **Sort "Most Used" semantics:** reads `rahulRank` (lower = earlier), falls back to `rating` desc, then `addedAt` desc. In PR 1 leave both fields undefined on seed data — the sort falls back to `addedAt` and that's fine.
10. **"Most Used" sort in PR 2 UI:** label it `Staff Pick Order` in the dropdown — more honest than "Most Used" when we don't actually track usage. Rename the enum later if Rahul objects.

If any of these values turn out to be wrong after PR 1 ships, they're all 1-line edits. Do not treat them as blockers. Start coding now.

---

## Phase 1 — Foundations (SHIP FIRST)

Goal: `/app-vault` returns 200 with a real dark-themed grid of 10 seeded apps. No filters, no detail pages. Lighthouse ≥ 95 / 100 on first deploy.

### 1.1 Data model

Create `src/data/app-vault.ts`. Copy the exact TypeScript shape from `plans/app-vault.md` §4. Key points:

- Frozen enums: `APP_CATEGORIES`, `APP_PRICING`, `APP_PLATFORMS`, `APP_TAGS`, each `as const` with a derived type.
- `AppEntry` interface with all fields from §4. Do not add `layoutMode`, `accent`, `chrome`, or `proseWidth` fields — uniform template discipline.
- `export const apps: readonly AppEntry[]` holding the 10 seed entries from §5 (locked defaults).

Create `src/data/app-vault.validate.ts`. At module load, iterate `apps` and throw on:

- Duplicate `slug` values
- `tagline.length > 60`
- `description.length > 180`
- `category` not in `APP_CATEGORIES`
- Any `tag` not in `APP_TAGS`
- Any `platform` not in `APP_PLATFORMS`
- Missing `logo`
- `pricing` not in `APP_PRICING`

Import the validator at the top of `src/pages/app-vault/index.astro` so `npm run build` fails loudly on bad data.

### 1.2 ImageKit presets

Edit `src/config/imagekit.ts`. Add:

```ts
appLogo: '?tr=w-96,h-96,fo-auto,f-auto,q-80',
appLogo2x: '?tr=w-192,h-192,fo-auto,f-auto,q-80',
appShot: '?tr=w-1200,h-675,f-auto,q-80',
```

Follow the existing presets' style — do not refactor the file.

### 1.3 Route + components

Create these files (see `plans/app-vault.md` §7 for the full list and one-line purposes):

- `src/pages/app-vault/index.astro`
- `src/components/app-vault/AppVaultHero.astro`
- `src/components/app-vault/AppCard.astro`
- `src/components/app-vault/AppVaultGrid.astro`
- `src/components/app-vault/icons.ts` (inline SVG map for pricing badges + platform icons — no icon library)

**PR 1 scope only — do NOT create** `AppVaultFilterRail`, `AppVaultToolbar`, `AppVaultSortDropdown`, `AppVaultSearchBar`, `AppVaultEmptyState`, `src/scripts/app-vault.ts`, or any detail-page components. Those are PR 2 and PR 3.

`src/pages/app-vault/index.astro` composition:

```astro
---
import Layout from '../../layouts/Layout.astro';
import AppVaultHero from '../../components/app-vault/AppVaultHero.astro';
import AppVaultGrid from '../../components/app-vault/AppVaultGrid.astro';
import { apps } from '../../data/app-vault';
import '../../data/app-vault.validate';

const featured = apps.filter((a) => a.featured).slice(0, 4);
---

<Layout
	title="App Vault — software we actually use | NexAI Labs"
	description="The AI tools, dev utilities, and creative weapons NexAI Labs actually opens every day. Curated, opinionated, dark-native."
	mainClass="app-vault"
>
	<AppVaultHero featured={featured} />
	<AppVaultGrid apps={apps} />
</Layout>
```

`AppVaultHero.astro`:

- Eyebrow pill: `THE VAULT`
- Headline in Cormorant italic: _"The software we actually open every day."_
- Muted sub (Inter, ~1.05rem): one sentence. Rahul can rewrite post-launch.
- Hero contains the featured strip (3–4 horizontal cards) below the headline. In PR 1 without a search input. The search input is added in PR 2.

`AppCard.astro` anatomy (single uniform card for every entry — see §5.3 of the spec):

- `<article data-app-card>` with all filter data attributes pre-rendered (`data-category`, `data-pricing`, `data-platforms`, `data-tags`, `data-name`, `data-alt-to`, `data-search`, `data-added-at`, `data-rank`) so PR 2 can wire the filter script without touching the card.
- Entire card wrapped in `<a href={affiliateUrl ?? websiteUrl} target="_blank" rel="noopener nofollow">` in PR 1. (In PR 3, the wrapping anchor flips to the internal detail route.)
- Logo: 48px, `<img loading="lazy" decoding="async" width="48" height="48" src={logo + appLogo} srcset="{logo + appLogo} 1x, {logo + appLogo2x} 2x" />`. First 6 cards in DOM order use `loading="eager"` — add a `isAboveFold` prop.
- Name (Inter 600, 1rem), tagline (muted, 0.9rem, 2-line clamp), tag pills (reuse `.tag-pill` token from global.css, max 3 + overflow chip), platform icons bottom-left, external-link arrow bottom-right, pricing badge top-right.
- Hover: `transform: translateY(-2px)`, `border-color: rgba(78, 201, 180, 0.4)`, 300ms `var(--ease-out-expo)`. No box-shadow animations (avoid paint-trigger).
- Scoped `<style>` block only. No per-app CSS.

`AppVaultGrid.astro`:

- Plain CSS grid. Breakpoints: 3 cols ≥ 1100px, 2 cols 768–1099, 1 col < 768. `gap: var(--space-md)`.
- No JS. No pagination. All 10 cards render server-side.

### 1.4 Navigation

Edit `src/config/navigation.ts`. Find the `app-vault` entry and flip its `href` to `/app-vault`. Do not rename the label. Do not change the icon.

### 1.5 JSON-LD

Add an inline `<script type="application/ld+json">` block to `index.astro` emitting an `ItemList` with one `ListItem` per app pointing at its `websiteUrl`. This is worth shipping in PR 1 because the index page's SEO value is front-loaded.

### 1.6 Styling rules

- Reuse existing tokens for all colors and spacing.
- Component `<style>` blocks only — Astro scopes them automatically.
- No new fonts. Inter + Cormorant + Montserrat are already loaded by Layout.
- Follow the "quiet observatory" aesthetic: restrained teal accents, serif italic only on the hero headline, Inter for everything else, dark surfaces.
- All transitions must use `transform` or `opacity` only. No `filter`, `border-color`, or `box-shadow` animations.

### 1.7 Acceptance — PR 1

- `npm run build` clean. Validator does not throw.
- `/app-vault` returns 200 locally and in deploy preview.
- 10 cards render in the grid. Featured strip shows 3–4 cards above the grid.
- Navbar "App Vault" link resolves to `/app-vault`.
- Card click opens the external app in a new tab.
- Lighthouse mobile on the route: Performance ≥ 95, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95.
- No console errors. No unused imports. No CSS warnings.
- Visual smoke test at 360, 768, 1100, 1440 px widths: grid collapses cleanly, no horizontal scroll, no overlap.

---

## Phase 2 — Filters, search, sort (follow-up PR)

Do NOT merge Phase 2 into the Phase 1 PR. It is a separate commit and review.

Scope from `plans/app-vault.md` §§5.2, 5.3, 5.4, 5.5, 7, 8:

- `AppVaultFilterRail.astro` — sticky desktop sidebar + mobile drawer, `<fieldset><legend>` per group, "Clear all" link
- `AppVaultSearchBar.astro` — pill-shaped `<input type="search">`, keyboard hint `/`
- `AppVaultToolbar.astro` — result count (ARIA-live), active filter chips, sort dropdown
- `AppVaultSortDropdown.astro` — styled native `<select>`, 4 options
- `AppVaultEmptyState.astro`
- `src/scripts/app-vault.ts` — URL-driven filter/search/sort logic, ≤ 3 KB gzip, runs on `astro:page-load`

Filter logic must:

- Read `URLSearchParams` on `astro:page-load` and hydrate the filter UI
- Toggle `hidden` on `[data-app-card]` nodes based on their data attributes
- Debounce search input by 150 ms
- Update URL via `history.replaceState` on keystroke, `history.pushState` on filter-group change
- Write result count to an `aria-live="polite"` region
- Re-sort by reparenting nodes — never by re-rendering from data

Add `<meta name="robots" content="noindex, follow">` to `index.astro` when any filter param is present (via `Astro.url.searchParams`).

Acceptance — PR 2: filters survive reload and back-button, empty state triggers, keyboard shortcut `/` focuses search, a11y checks pass (run `axe` or equivalent), Lighthouse still ≥ 95 / 100.

---

## Phase 3 — Detail pages (follow-up PR)

Scope from `plans/app-vault.md` §6 and §7:

- `src/pages/app-vault/[slug].astro` with `getStaticPaths()` over `apps`
- `AppVaultDetailHero.astro`, `AppVaultProsCons.astro`, `AppVaultRelated.astro`
- `SoftwareApplication` JSON-LD per detail page (use `applicationCategory`, `operatingSystem`, `offers.price` derived from `pricing`, `aggregateRating` if `rating` present)
- `BreadcrumbList` JSON-LD
- Update `AppCard.astro` wrapping anchor from external site to `/app-vault/{slug}`. The primary external CTA moves inside `AppVaultDetailHero`.
- Related row queries same-category apps, excludes self, limits to 3

Acceptance — PR 3: every slug resolves, pros/cons render when present and gracefully collapse when absent, related row shows 3 cards, detail pages pass Google Rich Results test for `SoftwareApplication`.

---

## Hard don'ts

1. **No frameworks.** No React, Vue, Svelte, Preact, Solid, HTMX, Alpine, htmx, Tailwind, daisyUI, shadcn. Astro + vanilla CSS + vanilla JS only.
2. **No per-app CSS.** Every card renders through `AppCard.astro`. Every detail page through the same layout. If you feel the urge to add a `layoutMode` or `accent` prop, stop and re-read the plan.
3. **No new fonts.** Inter + Cormorant + Montserrat are enough.
4. **No icon libraries.** `react-icons`, `lucide`, `heroicons`, `phosphor-icons` — none of them. Inline SVG from `src/components/app-vault/icons.ts`.
5. **No `filter: blur`, `border-color`, or `box-shadow` animations.** They trigger paint and tank LCP/INP. Use `transform` + `opacity` only.
6. **No touching the Cal.com dialog** in `Layout.astro`. It's wired correctly for the booking flow.
7. **No deleting `/studio`, `/home-joi`, or any existing page.** Only additions + one nav edit + one imagekit.ts edit.
8. **Seed data is the 10 apps in §5** — real, well-known tools with honest taglines and descriptions. Do not invent fake app names. If you can't find a canonical logo for one of the 10, use ImageKit remote-fetch with the tool's official site favicon as a fallback. Do not ship an empty grid and do not substitute other apps.
9. **No pulling PR 2 scope into PR 1.** Filters, search, sort, empty state, and the `src/scripts/app-vault.ts` file all belong to PR 2. Resist the urge to "just wire it up now".
10. **No CSS framework-y refactors of `global.css`.** Add Vault-specific styles inside component `<style>` blocks, not in the global stylesheet, unless you're adding a missing token (in which case ask first).

---

## Verification checklist (run before opening the PR)

### Build + static checks

- `npm run build` completes clean. No warnings from Astro, Vite, or TypeScript.
- `dist/app-vault/index.html` exists and contains all 10 card `<article>` elements.
- `dist/sitemap-index.xml` (or `dist/sitemap-0.xml`) includes `/app-vault`.
- `grep -r 'layoutMode\|accent.*chrome\|proseWidth' src/components/app-vault` returns zero matches.

### Visual smoke test (dev preview)

- `/app-vault` renders dark-themed hero + featured strip + grid.
- At 360 px width: single-column grid, no horizontal scroll, cards stack vertically.
- At 768 px: two columns.
- At 1100 px: three columns.
- Hover on a card: 2 px lift + teal border glow, smooth.
- Tap a card on mobile: external link opens in new tab.
- Navbar "App Vault" link works. Footer still resolves. Homepage unchanged.

### Accessibility

- Tab order: hero → card 1 → card 2 → … → footer. No keyboard traps.
- Focus ring visible on cards (`outline: 2px solid var(--color-brand-cyan); outline-offset: 3px;`).
- `aria-label` on each card anchor says something meaningful (e.g. `Visit {name}`).
- Color contrast ≥ 4.5:1 on all text including muted.
- No `<h1>` duplication (hero has the only h1; cards use h3).

### Performance

- Lighthouse mobile: Performance ≥ 95, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95.
- First 6 card logos use `loading="eager"`; rest use `loading="lazy"`.
- No layout shift when logos load (explicit `width`/`height` attrs on every `<img>`).
- No JS on the route beyond the existing global Lenis + CustomCursor + Cal bootstrap.

### SEO

- `<title>` is set on `index.astro`.
- `<meta name="description">` is ≤ 160 chars.
- `<link rel="canonical">` points at `https://www.nexailabs.com/app-vault`.
- `<script type="application/ld+json">` emits a valid `ItemList` — paste into Google Rich Results test and confirm it parses.

---

## Rollback

Phase 1 is purely additive except the one-line `navigation.ts` edit. Rollback = `git revert <commit>`. The nav edit reverts to the placeholder `href` in the same commit. No migrations, no data mutations, no state to clean up. Safe.

---

## Handoff checklist

Before you write code, confirm:

- [ ] You read `plans/app-vault.md` end to end.
- [ ] All decisions in the "Locked decisions" section are live — do not re-ask any of them.
- [ ] You're on a new branch off `main` (e.g. `feat/app-vault-pr1`).
- [ ] You understand that PR 1 is index-only. Filters = PR 2. Detail pages = PR 3.
- [ ] You understand the hard don'ts.

When you're done with PR 1, report back with:

- Branch name + commit SHA
- Lighthouse mobile screenshot for `/app-vault`
- Dev-preview URL if Cloudflare Pages has built it
- Anything Rahul needs to decide before PR 2 starts
