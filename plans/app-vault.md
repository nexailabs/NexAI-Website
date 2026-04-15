# App Vault — Implementation Plan

> Planning-phase deliverable. Codex will implement from this.

## 1. Context & goal

App Vault is NexAI Labs' curated directory of software — the AI tools, dev utilities, productivity apps, and creative weapons Rahul and the team actually use and recommend. Audience is founders, indie operators, and "vibe coders" who are tired of SEO-farm listicles and want a short, opinionated, fast, beautifully-designed shortlist. It differentiates from efficient.app by being dark, editorial, and faster; and from openalternative.co by being opinionated (not exhaustive), categorised around modern AI workflows (agents, vibe coding, research) rather than a generic "open source alternatives" framing, and visually native to the rest of NexAI's "quiet observatory" aesthetic.

Rahul will populate the vault separately via a typed data file that the page reads at build time. The plan must NOT hardcode any app entries in components or pages — every app render must come from a single source of truth (`src/data/app-vault.ts`) with a TypeScript shape validated at build time. Rahul seeds it with ~10 apps for launch, then grows to 50–200 over time.

## 2. Inspiration audit

| Dimension    | openalternative.co                                                                                                  | efficient.app                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Top-level IA | Directory with category nav, alphabet/tag cloud, "Alternative to X" positioning front and centre. Search in header. | Curated "best in class" shortlist, hero with strong positioning, category grouping rather than filter rail. Tabs or sections per category.                        |
| Card anatomy | Logo, name, description, star/GitHub count (OSS badge), "Alternative to [X]" line, category tag, license badge.     | Logo, name, one-line description, small category label, review/score, screenshot on hover or inline. More editorial, less dense.                                  |
| Filters      | URL-driven filters: category, license (OSS focus), language/stack. Sidebar + chips.                                 | Minimal filters; mostly curated tabs. Search is lightweight.                                                                                                      |
| Detail page  | Yes — per-app detail with description, screenshots, repo stats, pros/cons, alternatives, related tools.             | Yes — detail pages with writeup, pros, alternatives, affiliate CTA. Editorial long-form.                                                                          |
| Visual tone  | Light mode, clean, utilitarian, green accent. High density, grid-heavy.                                             | Light mode, premium editorial, lots of whitespace, serif-ish headings, friendly illustrations. Lower density.                                                     |
| Weaknesses   | Utilitarian — feels like a database. No editorial voice. Dense but cold. Detail pages are mostly metadata.          | Low density = more scrolling. Filters are weak. No URL-shareable filter state. Lacks compare depth. Slow LCP on some pages due to heavy imagery. Light mode only. |

**Keepers from openalternative**: URL-driven filters, "alternative to X" chip pattern, category + tag + pricing filter trio, JSON-LD collection schema, shareable filter URLs, dense responsive grid, detail pages with related-apps row.

**Keepers from efficient.app**: editorial tone, strong positioning hero, pros/cons on detail pages, curated rather than exhaustive, per-card screenshot or hover preview, affiliate-aware CTAs, personal-voice microcopy.

**Leave behind**: openalternative's utilitarian coldness and database feel; efficient.app's low density, light-mode-only aesthetic, weak filters, slow LCP, and lack of URL state.

## 3. Information architecture

- **Primary route**: `/app-vault` (index). `src/config/navigation.ts` currently points the "App Vault" entry at a placeholder — update `href` to `/app-vault` as part of PR 1.
- **Detail route**: `/app-vault/[slug]` — ship in PR 3 (v2). v1 is index-only so we can launch fast and measure. Justification: the index page with rich cards + filters delivers 80% of the value, and detail pages need real editorial copy (pros, cons, use case) that Rahul will write incrementally. Cards in v1 link directly to the app's external site as a fallback until detail pages ship.
- **Categories (PLACEHOLDER — Rahul to confirm)**:
  `AI Writing`, `AI Agents`, `Vibe Coding`, `Dev Tools`, `Design`, `Productivity`, `Research`, `Marketing`, `Data & Analytics`, `Creative / Media`. Frozen enum.
- **Filter dimensions**:
  - `category` (single-select, enum)
  - `pricing` (multi-select: `free | freemium | paid | open-source`)
  - `platforms` (multi-select: `web | mac | windows | linux | ios | android | cli | api`)
  - `tags` (multi-select, frozen enum — ~20 cross-cutting tags like `llm`, `rag`, `image-gen`, `voice`, `automation`, `notes`, `browser`, `terminal`, etc.)
  - `alternativeTo` (free text on detail pages / chip filter on index)
  - `q` (search string — matches name, tagline, description, alternativeTo)
- **Sort options**: `Featured` (default, by `featured` desc then `addedAt` desc), `Newest` (by `addedAt` desc), `A→Z` (by `name` asc), `Most Used` (by explicit `rahulRank` or `rating` desc — placeholder).

## 4. Data model

Use a plain TypeScript module for v1 — simpler than Astro content collections for a single flat list with a frozen enum. If the list crosses 200 entries or Rahul wants per-app markdown bodies, migrate to `src/content/app-vault/*.md` content collections in a later PR.

File: `src/data/app-vault.ts`

```ts
// Frozen enums — imported everywhere so the UI + filters + validation stay in sync.
export const APP_CATEGORIES = [
	'AI Writing',
	'AI Agents',
	'Vibe Coding',
	'Dev Tools',
	'Design',
	'Productivity',
	'Research',
	'Marketing',
	'Data & Analytics',
	'Creative / Media',
] as const;
export type AppCategory = (typeof APP_CATEGORIES)[number];

export const APP_PRICING = ['free', 'freemium', 'paid', 'open-source'] as const;
export type AppPricing = (typeof APP_PRICING)[number];

export const APP_PLATFORMS = [
	'web',
	'mac',
	'windows',
	'linux',
	'ios',
	'android',
	'cli',
	'api',
] as const;
export type AppPlatform = (typeof APP_PLATFORMS)[number];

export const APP_TAGS = [
	'llm',
	'rag',
	'agents',
	'image-gen',
	'video-gen',
	'voice',
	'automation',
	'notes',
	'browser',
	'terminal',
	'ide',
	'no-code',
	'analytics',
	'scraping',
	'email',
	'crm',
	'design-system',
	'prototyping',
	'docs',
	'search',
] as const;
export type AppTag = (typeof APP_TAGS)[number];

export interface AppEntry {
	slug: string; // kebab-case, unique
	name: string;
	tagline: string; // ≤ 60 chars, shown on card
	description: string; // ≤ 180 chars, shown on card hover / detail
	logo: string; // ImageKit URL, square
	screenshot?: string; // ImageKit URL, 16:9, optional

	category: AppCategory;
	tags: readonly AppTag[];
	pricing: AppPricing;
	platforms: readonly AppPlatform[];

	websiteUrl: string;
	affiliateUrl?: string; // preferred outbound link if present
	alternativeTo?: readonly string[]; // e.g. ['Notion', 'Evernote']

	featured: boolean;
	addedAt: string; // ISO date
	rating?: 1 | 2 | 3 | 4 | 5; // Rahul's rating
	rahulRank?: number; // optional manual sort override

	pros?: readonly string[]; // detail page only
	cons?: readonly string[]; // detail page only
	useCase?: string; // detail page only, ≤ 240 chars
}

export const apps: readonly AppEntry[] = [
	// Rahul populates. Plan does NOT ship seed data.
];
```

Add a `src/data/app-vault.validate.ts` helper that runs at build time (imported by the page) and throws if: duplicate slugs, missing logo, tagline > 60, description > 180, category not in enum, any tag not in enum. Build-time validation keeps Cloudflare Pages deploys honest.

**Logos**: all logo URLs go through ImageKit (`src/config/imagekit.ts`). Add new transform presets: `appLogo: '?tr=w-96,h-96,fo-auto,f-auto,q-80'` and `appLogo2x: '?tr=w-192,h-192,fo-auto,f-auto,q-80'` for retina. Screenshots use `appShot: '?tr=w-1200,h-675,f-auto,q-80'`.

## 5. Page layout — index `/app-vault`

1. **Hero section** (`AppVaultHero.astro`)
   - Eyebrow: `THE VAULT`
   - Headline (Cormorant italic, serif): _"The software we actually open every day."_
   - Sub (Inter, muted): one line on what this is and how it's curated.
   - Inline search input (large, pill-shaped, cyan focus ring) bound to `?q=`
   - Below hero: "Staff Picks" strip — 3–4 horizontal cards for `featured: true` apps, no filter rail, purely editorial.

2. **Filter rail** (`AppVaultFilterRail.astro`)
   - Desktop: sticky left sidebar, 260px wide, scroll-independent (`position: sticky; top: var(--header-height)`).
   - Mobile: collapsible drawer triggered by a "Filters" button; drawer slides up from bottom with backdrop.
   - Groups: Category (radio pills, single-select), Pricing (checkbox pills), Platforms (checkbox pills), Tags (wrapping tag cloud).
   - Each group = `<fieldset><legend>`; ARIA-live region on the results container announces "`N` apps".
   - "Clear all" link at top when any filter active.

3. **Results grid** (`AppVaultGrid.astro` + `AppCard.astro`)
   - Responsive: 3 cols ≥ 1100px, 2 cols 768–1099, 1 col < 768.
   - Card anatomy:
     - 48px logo top-left (img, ImageKit `appLogo` preset, `loading="lazy"` except first 6)
     - Name (Inter 600, 1rem)
     - Pricing badge top-right (inline SVG icon + label)
     - Tagline below name (muted, 0.9rem)
     - Up to 3 tag pills (reuse `.tag-pill` token, smaller variant)
     - Platform icons bottom-left (inline SVG)
     - External-link arrow bottom-right
     - Entire card wrapped in `<a href={websiteUrl or affiliateUrl}>` — card is a single link, no nested interactive elements in v1.
   - Hover state: card lifts 2px, border shifts to `rgba(78, 201, 180, 0.4)`, subtle inner glow, 300ms `var(--ease-out-expo)`.

4. **Toolbar** above grid
   - Result count left (`42 apps`) — ARIA-live.
   - Active filter chips (removable).
   - Sort dropdown right (`AppVaultSortDropdown` — styled native `<select>`, no framework).

5. **Empty state** (`AppVaultEmptyState.astro`)
   - Serif italic one-liner: _"Nothing in the vault matches that."_
   - "Clear filters" ghost button.

6. **URL-driven state** — single source of truth is `URLSearchParams`. Filters write to URL; URL reads hydrate filter UI on page load. Supports back/forward, shareable links, no hydration mismatch because it's all post-render vanilla JS.

## 6. Page layout — detail `/app-vault/[slug]` (v2, PR 3)

- Static `getStaticPaths()` over `apps`.
- Breadcrumb: `App Vault / {category} / {name}`
- Hero: 96px logo, name (Cormorant italic), tagline, pricing badge, platform icons row, primary CTA (`Visit site` → affiliateUrl || websiteUrl, `target="_blank" rel="noopener sponsored"` when affiliate).
- Screenshot (`AppVaultDetailHero.astro`) — ImageKit `appShot`, 16:9, lazy, explicit width/height.
- Description paragraph (Inter, ~1.05rem).
- Pros/cons (`AppVaultProsCons.astro`) — two-column grid, check/cross inline SVG, collapses to single column < 720px.
- `useCase` pullquote in Cormorant italic.
- "Alternative to" chips (linked to `/app-vault?alternativeTo={name}` pre-filter).
- Related apps (`AppVaultRelated.astro`) — 3 cards from same category, excluding current.
- Back-to-vault CTA (ghost button).

## 7. Components to build

Uniform discipline: no per-app CSS, no component variants per entry, all styling via tokens.

- `src/pages/app-vault/index.astro` — route, composes hero + rail + grid, reads `apps`, renders server-side.
- `src/pages/app-vault/[slug].astro` — detail route (PR 3).
- `src/components/app-vault/AppVaultHero.astro` — hero section with headline, search, featured strip.
- `src/components/app-vault/AppVaultSearchBar.astro` — pill-shaped input, keyboard-shortcut hint (`/`), wired to `?q=`.
- `src/components/app-vault/AppVaultFilterRail.astro` — sidebar + mobile drawer, fieldsets per filter group.
- `src/components/app-vault/AppVaultToolbar.astro` — result count + active chips + sort dropdown.
- `src/components/app-vault/AppVaultSortDropdown.astro` — styled `<select>`, 4 options.
- `src/components/app-vault/AppVaultGrid.astro` — responsive CSS grid, no JS.
- `src/components/app-vault/AppCard.astro` — single-link card, uniform for all entries.
- `src/components/app-vault/AppCardSkeleton.astro` — used in loading fallback and empty-state slot.
- `src/components/app-vault/AppVaultEmptyState.astro`
- `src/components/app-vault/AppVaultDetailHero.astro` (PR 3)
- `src/components/app-vault/AppVaultProsCons.astro` (PR 3)
- `src/components/app-vault/AppVaultRelated.astro` (PR 3)
- `src/scripts/app-vault.ts` — client-side filter/search/sort logic (vanilla, <3 KB gz).

## 8. Interactivity

- **Static-first rendering**. The page renders 100% of the grid server-side at build. Google sees every card. Filters are progressive enhancement.
- **Filter script** (`src/scripts/app-vault.ts`):
  - On `astro:page-load` (View Transitions-safe), read `URLSearchParams`, hydrate filter UI state, then run a single `applyFilters()` pass.
  - `applyFilters()` iterates `[data-app-card]` nodes, reads their `data-category`, `data-pricing`, `data-platforms` (space-separated), `data-tags`, `data-name`, `data-alt-to` attrs, toggles `hidden`.
  - Debounced search input (150ms) matches against `data-search` (lowercase name + tagline + description + alt-to concat).
  - Sort: store original DOM order in a `data-initial-index`; sort by reading `data-rank`, `data-added-at`, `data-name` attributes and reparenting nodes.
  - Updates URL via `history.replaceState` (no new history entry per keystroke), pushes a real entry on filter-group change.
  - Result count written into an ARIA-live region.
- **No frameworks**. Script is a single file, no bundler features beyond TS, ≤ ~200 LOC.
- **Lenis** is already global — scroll is smooth for free.
- **Keyboard**: `/` focuses search (when not in an input), `Esc` clears search, optional arrow-key grid nav (nice-to-have, PR 2 if time).

## 9. SEO

- `<title>`: `"App Vault — tools we actually use | NexAI Labs"` on index. Filtered URLs share canonical with index to avoid thin duplicates, `<meta name="robots" content="noindex, follow">` when any filter param is present.
- Detail page `<title>`: `"{name} — {category} | NexAI Labs App Vault"`, canonical = clean slug URL.
- Meta description: 140–160 chars, curated one-liner.
- **JSON-LD index**: `ItemList` with each app as a `ListItem` → `SoftwareApplication`. Rendered inline in `index.astro` `<head>`.
- **JSON-LD detail**: `SoftwareApplication` with `applicationCategory`, `operatingSystem`, `offers.price` (from pricing), `aggregateRating` if rating present.
- `@astrojs/sitemap` already installed — verify `astro.config.mjs` picks up `/app-vault` and the `[slug]` routes (add to sitemap config if excluded).
- Breadcrumb JSON-LD on detail pages.
- OG image: per-app dynamic OG later; for v1 reuse default NexAI OG.

## 10. Performance budget

- **LCP**: ≤ 2.0s on mobile (4G). LCP element is likely the hero headline (text) — cheap.
- **CLS**: ≤ 0.05. All logos have explicit `width`/`height` attrs.
- **Lighthouse**: ≥ 95 perf, 100 a11y, 100 best practices, 95 SEO.
- **Images**:
  - Logos: `loading="lazy"` except first 6 (above the fold on 3-col). First 6 use `loading="eager"` + `fetchpriority="high"` on hero/staff-pick logos only.
  - ImageKit preset: `?tr=w-96,h-96,fo-auto,f-auto,q-80` for logos, `?tr=w-192,...` for retina `srcset`.
  - No framework icon libraries. Platform icons and pricing icons ship as inline SVG in a single `src/components/app-vault/icons.ts` map.
- **JS budget**: filter script ≤ 3 KB gz. No other JS on this route beyond the already-global Lenis + cursor + Cal.
- **CSS**: reuse tokens; add ~6 KB of App-Vault-scoped styles split into component `<style>` blocks (Astro scopes them).
- **No fonts loaded beyond what Layout already loads.**

## 11. Accessibility

- Filter rail: each group wrapped in `<fieldset><legend>`. Labels programmatically tied to inputs.
- `aria-live="polite"` region announces "N apps" on filter change.
- Search input: visible `<label>` (can be `.sr-only`), `type="search"`, `aria-describedby` for the `/` shortcut hint.
- Cards: entire card is an `<a>`, no nested buttons. Focus ring visible: `outline: 2px solid var(--color-brand-cyan); outline-offset: 3px;`.
- Color contrast: all text ≥ 4.5:1 on dark bg. Verified for muted text too.
- Keyboard: tab order is hero → search → filters → sort → cards (in DOM order). `/` focuses search (unless typing in another input). `Esc` clears search when focused.
- Mobile drawer: focus-trapped while open, `Esc` closes, returns focus to trigger.
- Reduced-motion: hover lift and drawer slide respect `prefers-reduced-motion: reduce` (already handled globally).

## 12. Phase breakdown (3 PRs)

**PR 1 — Foundations**

- Add `src/data/app-vault.ts` with enums, `AppEntry` interface, empty array (Rahul fills).
- Add `src/data/app-vault.validate.ts` build-time validator.
- Add `appLogo`, `appLogo2x`, `appShot` transforms to `src/config/imagekit.ts`.
- Add `src/pages/app-vault/index.astro` with hero + static grid + `AppCard` + `AppVaultHero`.
- Update `src/config/navigation.ts` — `app-vault` entry `href` → `/app-vault`.
- Ship with 10 seed apps from Rahul. No filters yet. Empty state if zero apps.
- Acceptance: route renders 200, 10 cards visible, nav link works, Lighthouse ≥ 95.

**PR 2 — Filters, search, sort**

- Add `AppVaultFilterRail`, `AppVaultToolbar`, `AppVaultSortDropdown`, `AppVaultEmptyState`, `AppVaultSearchBar`.
- Add `src/scripts/app-vault.ts` with URL-driven filter/search/sort logic.
- Add `ItemList` JSON-LD on index.
- Add ARIA-live result count, keyboard shortcut `/` focuses search.
- Acceptance: filters update URL, back button restores state, empty state triggers when no matches, a11y checks pass.

**PR 3 — Detail pages**

- Add `src/pages/app-vault/[slug].astro` with `getStaticPaths`.
- Add `AppVaultDetailHero`, `AppVaultProsCons`, `AppVaultRelated`.
- Add `SoftwareApplication` + `BreadcrumbList` JSON-LD per detail page.
- Wire `AppCard` to link to `/app-vault/{slug}` instead of external site (primary CTA to visit site moves inside detail hero).
- Acceptance: every slug resolves, pros/cons render when present and gracefully collapse when absent, related row shows 3 same-category apps.

## 13. Acceptance criteria

- `/app-vault` returns 200 with real data from `src/data/app-vault.ts`.
- Navbar "App Vault" entry in `src/config/navigation.ts` resolves to `/app-vault`.
- Filters produce URL state (`?category=AI+Agents&pricing=free`) that survives page reload and back-button.
- Lighthouse mobile: perf ≥ 95, a11y = 100.
- Side-by-side screenshot vs efficient.app: App Vault feels tighter, denser on desktop, faster, and more opinionated. Dark-native.
- Side-by-side vs openalternative.co: App Vault feels warmer, more editorial, less like a database admin panel.
- No per-app CSS; every card renders through the same `AppCard.astro`.
- Build-time validator throws on bad data (duplicate slug, over-length tagline, etc.).

## 14. Open questions for Rahul

1. **Final category enum** — is the PLACEHOLDER list in §3 right, or should we swap anything (e.g. drop `Data & Analytics`, add `Hardware`, split `Creative / Media` into `Audio` + `Video`)?
2. **Data location** — TypeScript file (proposed), JSON, or Notion export pipeline? If Notion, we need a build step and a cache strategy — not in scope for PR 1.
3. **Affiliate link strategy** — do we disclose affiliate links (recommended, FTC-safe) with a small ℹ︎ icon? Do we want a dedicated "Sponsored" row at the top of the grid, or blend sponsored into Featured?
4. **Detail pages — v1 or v2?** Plan assumes v2 (PR 3). Confirm.
5. **Logo pipeline** — does Rahul upload logos to ImageKit manually (preferred for consistent cropping + CDN), or should the data schema accept external logo URLs and proxy them through ImageKit's remote-fetch feature? Plan assumes ImageKit uploads.
6. **Sort "Most Used"** — what drives this? Rahul's manual `rahulRank`, or aggregated click-through once analytics ship?
7. **Search scope** — match against description too, or just name + tagline + alt-to? (Plan assumes all four.)

## 15. Rollback

Phase 1 is purely additive (new route, new components, new data file, one-line nav edit). Rollback = `git revert <commit>`; no migrations, no data mutations, no deleted shared components. The nav edit that points `app-vault` back to the placeholder is a one-line revert. Safe.

---

## Critical Files for Implementation

- `src/data/app-vault.ts` (new — data + enums, single source of truth)
- `src/data/app-vault.validate.ts` (new — build-time validator)
- `src/pages/app-vault/index.astro` (new — route composition)
- `src/pages/app-vault/[slug].astro` (new, PR 3)
- `src/components/app-vault/*.astro` (new — hero, rail, grid, card, toolbar, etc.)
- `src/scripts/app-vault.ts` (new — URL-driven filters)
- `src/config/navigation.ts` (edit — point `app-vault` entry to `/app-vault`)
- `src/config/imagekit.ts` (edit — add `appLogo`, `appLogo2x`, `appShot` presets)

## 16. Research caveat

The Explore subagent that drafted §2 had WebFetch blocked for both openalternative.co and efficient.app. The audit is based on prior knowledge of both sites. Before PR 2 finalises filter schema and card anatomy, re-verify:

- efficient.app's current card layout (screenshot placement, hover state)
- openalternative.co's latest detail-page field set (does it still include GitHub stats, language, license?)
- Whether either site ships a URL-shareable filter pattern worth cloning

A 15-minute manual review by Rahul is enough.
