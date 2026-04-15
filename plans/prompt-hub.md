# Prompt Hub — Implementation Plan

> Planning-phase deliverable. Codex will implement from this. Sibling to `plans/app-vault.md` — same discipline, same voice.

## 1. Context & goal

Prompt Hub is NexAI Labs' on-site library of the prompts, Claude skills, agent system prompts, and MCP configs Rahul and the team actually ship with. Unlike App Vault (a directory of _external_ software), **Prompt Hub's content lives on our domain** — users land on a card, click through to a detail page, copy the body into their clipboard, and either paste it into ChatGPT/Claude/Gemini or install it as a Claude Agent Skill / MCP tool. That shift — from outbound directory to on-site content — changes the interaction model, the SEO bet, and the component shape versus App Vault.

**Audience**: founders, indie operators, vibe coders, and working prompt engineers who want battle-tested prompts without wading through Twitter screenshots or Notion dumps. Same "quiet observatory" aesthetic as the rest of the site: dark, serif accents (Cormorant), Inter body, restrained teal.

**Why it exists for NexAI**:

1. **Credibility / trust** — showing the actual prompts we use is a stronger signal than claiming expertise.
2. **SEO lead magnet** — detail pages target long-tail queries like _"claude skill for invoice extraction"_, _"chatgpt prompt for cold email personalization"_, _"cursor system prompt for astro"_. Each entry is a ranking asset.
3. **Lead gen** — every detail page carries a soft CTA to `/catch-us` and the Cal dialog, wrapping a useful artifact in a commercial funnel.
4. **Recruiting / community signal** — indie builders who copy a prompt and find it actually works will remember who curated it.

**Content source**: Rahul curates and authors every entry in v1. No user submissions, no moderation queue, no accounts. Content is a typed TypeScript data file validated at build time — the same shape-first discipline as App Vault. v2 may open a "submit a prompt" form that funnels into a GitHub PR or Notion inbox; flagged as an open question, not in scope for v1.

**Differentiation**:

- vs **skillsmp.com**: we're opinionated and curated (not a marketplace), editorial not utilitarian, dark-native, no accounts or pricing, and every entry is copy-paste ready with zero friction.
- vs **mcpmarket.com**: we cover _all_ four content types (prompts, skills, system prompts, MCP configs) in one hub — mcpmarket is MCP-centric. We also ship a variable-interpolation UI for templated prompts, which neither of them do.
- vs **Anthropic's own skills repo**: our hub is broader than Agent Skills and wraps the raw markdown in a browsable UI, with model-agnostic prompts sitting alongside Claude-specific skills.

## 2. Inspiration audit

| Dimension                  | skillsmp.com                                                                                                                                                  | mcpmarket.com/tools/skills                                                                                                                                                                    | Anthropic Agent Skills docs                                                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| IA                         | Marketplace-style index with category tabs, individual skill detail pages, author profiles, search in header. Skills grouped by domain.                       | Two-level: category rail (`Development`, `Productivity`, `Data`, etc.), index grid of tool cards, detail page per tool with install section. Listings are tool-first, skills are a sub-route. | Not a marketplace — it's a spec. Skill = directory with `SKILL.md` + YAML frontmatter (`name`, `description`). Three-level progressive disclosure: metadata → instructions → bundled resources.        |
| Card anatomy               | Title, author, one-line description, usage count, tag chips, category label, optional price or free badge, small author avatar.                               | Tool name, author/publisher, star/install count, short description, category pill, install command teaser, logo/icon.                                                                         | N/A (docs). But it defines the _canonical fields_ a skill entry must have: `name` (≤64 char, kebab-case), `description` (≤1024 char, includes "when to use").                                          |
| Filter UX                  | Left-side category filter + tag chips + search bar. URL state on filters. Sort by popularity / newest.                                                        | Category rail (left), search top, sort dropdown. URL-driven. Chips show active filters.                                                                                                       | N/A.                                                                                                                                                                                                   |
| Detail page                | Title, author, description, full skill body (markdown-rendered), usage instructions, copy button, "related skills" row at bottom. Install is the primary CTA. | Hero (name + author + install CTA), install block with tabs (CLI / JSON / URL), description, README-style body, related tools row. Copy buttons everywhere.                                   | N/A conceptually — but the doc tells us each skill should display: `name`, `description`, SKILL.md body, any bundled scripts, and a clear "how Claude invokes this" note.                              |
| Visual tone                | Light, cheerful, marketplace vibe, medium density. Product-Hunt-adjacent.                                                                                     | Light, technical, medium-high density, logo-heavy, GitHub-README-ish feel.                                                                                                                    | Official dark docs, clean, code-snippet-centric.                                                                                                                                                       |
| "Copy" UX                  | Copy button on detail page body; not consistently on cards.                                                                                                   | Prominent copy buttons on every code block; tabs for install format; success toast.                                                                                                           | Code fences with copy buttons on the docs site; no cards.                                                                                                                                              |
| Weaknesses to leave behind | Marketplace framing (accounts, author pages, pricing) bloats the model and isn't what we need. Low editorial voice. Light mode only.                          | Skill section feels under-curated and MCP-centric; layout leans utilitarian/dense; light mode only; no variable interpolation for templated prompts.                                          | Not a weakness — but we must avoid copying the docs _layout_ onto Prompt Hub. Our detail pages are _shorter and more action-oriented_ than docs pages; the hub is a copy-shop, not a reference manual. |

**Keepers**

- From **skillsmp**: per-entry detail page with a full body + related entries, tag chip filtering, URL-driven filter state, author attribution as metadata (not as a profile page).
- From **mcpmarket**: prominent copy buttons on every code block, install block with format tabs (CLI / JSON / URL), category rail + search + sort trio, sticky desktop rail + mobile drawer.
- From **Anthropic docs**: canonical skill schema — enforce `name`, `description`, SKILL.md body shape on every `type: 'skill'` entry so our UI is native to the Claude Skills taxonomy. Render the YAML frontmatter visibly on detail pages so a developer can copy a real installable skill.

**Leave behind**

- User accounts, author profile pages, pricing, ratings, upvotes (all marketplace cruft — v1 has zero auth).
- Utilitarian light-mode "database" feel from both marketplaces.
- mcpmarket's MCP-first framing — Prompt Hub is model-agnostic first.
- Docs-style long-form layout on detail pages — we're a copy-shop, not a manual.

## 3. Information architecture

- **Primary route**: `/prompt-hub` (index). Update `src/config/navigation.ts` — the existing `prompt-hub` nav entry currently points at `/coming-soon`; flip it to `/prompt-hub` as part of PR 1.
- **Detail route**: `/prompt-hub/[slug]` — **ships in PR 2, not PR 3**. Justification: Prompt Hub's entire value prop depends on on-site content. An index-only launch would be a list of titles with nothing to click through to, which is the exact opposite of our SEO and credibility goals. Detail is the product; the index is the wayfinder.
- **Categories (PLACEHOLDER enum — Rahul to confirm)**:
  `Writing`, `Coding`, `Research`, `Marketing`, `Sales`, `Ops`, `Design`, `Agents`, `Data`, `Meta-Prompts`. Frozen enum, single-select on index.
- **Filter dimensions**:
  - `type` (single-select radio pills: `prompt | skill | system-prompt | mcp-config`) — the primary mental model.
  - `model` (multi-select checkbox pills: `chatgpt | claude | gemini | cursor | codex | any`).
  - `category` (single-select, enum above).
  - `tags` (multi-select, frozen enum ~20: `rag`, `extraction`, `classification`, `writing`, `refactor`, `debug`, `cold-email`, `outbound`, `research`, `summarization`, `agents`, `mcp`, `eval`, `sop`, `customer-support`, `code-review`, `data-cleanup`, `spec-writing`, `planning`, `onboarding`).
  - `q` (search string — matches title, summary, body text, and tags).
- **Sort options**: `Featured` (default — `featured desc` then `addedAt desc`), `Newest` (`addedAt desc`), `Most Copied` (`copyCount desc`, wired in PR 3 — falls back to Featured until analytics are live), `A→Z` (`title asc`).
- **URL state**: `URLSearchParams` is the single source of truth, same pattern as App Vault. Filtered URLs carry `?type=skill&model=claude&category=Agents&q=rag`. Filtered URLs are `noindex, follow`; canonical always points to clean `/prompt-hub`.

## 4. Data model

A plain TypeScript module for v1 — simpler than Astro content collections for a flat list with frozen enums. Migrate to `src/content/prompt-hub/*.md` content collections in a later PR if the list crosses ~100 entries or bodies start needing MDX.

File: `src/data/prompt-hub.ts`

```ts
// Frozen enums — imported everywhere so UI + filters + validation stay in sync.
export const PROMPT_TYPES = ['prompt', 'skill', 'system-prompt', 'mcp-config'] as const;
export type PromptType = (typeof PROMPT_TYPES)[number];

export const PROMPT_MODELS = ['chatgpt', 'claude', 'gemini', 'cursor', 'codex', 'any'] as const;
export type PromptModel = (typeof PROMPT_MODELS)[number];

export const PROMPT_CATEGORIES = [
	'Writing',
	'Coding',
	'Research',
	'Marketing',
	'Sales',
	'Ops',
	'Design',
	'Agents',
	'Data',
	'Meta-Prompts',
] as const;
export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];

export const PROMPT_TAGS = [
	'rag',
	'extraction',
	'classification',
	'writing',
	'refactor',
	'debug',
	'cold-email',
	'outbound',
	'research',
	'summarization',
	'agents',
	'mcp',
	'eval',
	'sop',
	'customer-support',
	'code-review',
	'data-cleanup',
	'spec-writing',
	'planning',
	'onboarding',
] as const;
export type PromptTag = (typeof PROMPT_TAGS)[number];

export interface PromptEntry {
	slug: string; // kebab-case, unique
	title: string; // ≤ 80 chars
	summary: string; // ≤ 160 chars — card subtitle + meta description
	body: string; // the actual prompt / skill markdown / JSON
	type: PromptType;
	models: readonly PromptModel[]; // non-empty
	category: PromptCategory;
	tags: readonly PromptTag[]; // ≤ 8

	author: string; // e.g. 'Rahul Juneja' or 'NexAI Labs'
	addedAt: string; // ISO date
	featured: boolean;
	copyCount?: number; // populated later via analytics pipeline (PR 3)

	variables?: readonly string[]; // declared template vars like ['company_name', 'tone']
	install?: {
		kind: 'cli' | 'json' | 'url';
		command: string; // shown in install block, copyable
		label?: string; // e.g. 'Install in Claude Code'
	};
	exampleOutput?: string; // optional, rendered in a quoted block on detail
	howToUse?: string; // optional ≤ 600 char markdown blurb
}

export const prompts: readonly PromptEntry[] = [
	// Rahul seeds 5 entries in PR 1 (see §12).
];
```

**Build-time validator**: `src/data/prompt-hub.validate.ts`. Throws on:

- Duplicate slugs.
- `title` > 80, `summary` > 160, `tags.length` > 8, `models.length === 0`.
- `type`, `models[]`, `category`, `tags[]` outside their enums.
- `variables[]` entries that don't appear as `{var_name}` inside `body` (or the chosen variable syntax — see §14 open question).
- `type: 'skill'` entries missing a YAML frontmatter block at the top of `body` (enforces the Anthropic Agent Skills shape: `name`, `description`).
- `type: 'mcp-config'` entries whose `body` isn't valid JSON.
- `install.kind === 'cli'` commands containing shell metacharacters we don't expect (defense-in-depth — we're rendering strings, not executing them).

Imported directly by `src/pages/prompt-hub/index.astro` so the build fails loudly on bad data. Same philosophy as `app-vault.validate.ts`.

**Content source of truth**: `src/data/prompt-hub.ts` only. No per-prompt CSS, no component variants per entry. Bodies are authored as template literals with backticks in the data file for v1 — if Rahul prefers, PR 2 can split bodies into `src/data/prompt-hub/bodies/*.md` imported as `?raw` strings, but that's optional polish.

## 5. Page layout — index `/prompt-hub`

1. **Hero section** (`PromptHubHero.astro`)
   - Eyebrow: `THE PROMPT HUB`
   - Headline (Cormorant italic): _"Prompts and skills we actually ship with."_
   - Sub (Inter, muted): one sentence — _"Copy-paste ready. Curated, not crowdsourced. Battle-tested on real work."_
   - Inline search (large pill input, cyan focus ring), wired to `?q=`.
   - Below hero: **Featured strip** — 3–4 horizontal cards for `featured: true`, no filter rail, purely editorial.

2. **Filter rail** (`PromptHubFilterRail.astro`)
   - Desktop: sticky left sidebar, 260px wide, `position: sticky; top: var(--header-height)`.
   - Mobile: collapsible bottom drawer, same pattern as App Vault.
   - Groups (each a `<fieldset><legend>`):
     1. **Type** — 4 radio pills: Prompt / Skill / System / MCP, with small inline-SVG icons.
     2. **Model** — 6 checkbox pills with tiny monogram icons (CG, CL, GM, CR, CX, ∗).
     3. **Category** — 10 radio pills, single-select.
     4. **Tags** — wrapping tag cloud, multi-select, reuses `.tag-pill` tokens.
   - "Clear all" link at top when any filter active.

3. **Results toolbar** (`PromptHubToolbar.astro`)
   - Result count left (`17 prompts`) — ARIA-live `polite`.
   - Active filter chips (removable on click).
   - Sort dropdown right (`PromptHubSortDropdown.astro`, styled native `<select>`).

4. **Results grid** (`PromptHubGrid.astro` + `PromptCard.astro`)
   - Responsive: 3 cols ≥ 1100px, 2 cols 768–1099, 1 col < 768.
   - **Card anatomy** (different from App Vault — no external link, copy is primary):
     - **Type badge top-left** (small pill: `PROMPT`, `SKILL`, `SYSTEM`, `MCP`) with category color accent.
     - **Copy button top-right** (`PromptCopyButton.astro`) — appears on hover/focus, 32×32, cyan on hover, ARIA-labelled. On small screens it's always visible (no hover).
     - **Title** (Inter 600, 1.05rem) — 2-line clamp.
     - **One-line summary** (muted, 0.9rem) — 2-line clamp.
     - **Model badges row** — small inline-SVG monograms for each `models[]` entry.
     - **Tag pills row** (max 3, `+N` overflow chip).
     - Card wrapping element is `<article>` with inner `<a href="/prompt-hub/{slug}">` covering title + summary — _not_ the whole card, so the copy button and tag pills remain independently focusable. Focus ring on the `<a>` via `::after` overlay.
   - Hover: lift 2px, border shifts to `rgba(78, 201, 180, 0.4)`, subtle inner glow, 300ms `var(--ease-out-expo)` — matches App Vault.

5. **Empty state** (`PromptHubEmptyState.astro`)
   - Cormorant italic one-liner: _"Nothing in the hub matches that yet."_
   - "Clear filters" ghost button.

6. **URL-driven state** — identical discipline to App Vault. `URLSearchParams` is the source of truth; filters write URL, URL hydrates filters on page load, supports back/forward and shareable links.

## 6. Page layout — detail `/prompt-hub/[slug]` (v1, PR 2)

Static `getStaticPaths()` over `prompts`. Every card clicks through here.

1. **Breadcrumb**: `Prompt Hub / {category} / {title}` — linked, with `BreadcrumbList` JSON-LD.
2. **Hero** (`PromptDetailHero.astro`):
   - Type badge + category chip + model badges row.
   - Title (Cormorant italic for `prompt`/`system-prompt`, Inter 600 for `skill`/`mcp-config` — matches the content register: prose vs code).
   - Summary (muted, 1.05rem).
   - Author + `addedAt` (e.g. "Rahul Juneja · Apr 8, 2026") right-aligned on desktop, below title on mobile.
   - Primary action row: big **Copy prompt** button (filled, teal gradient) and secondary **Install** button (only if `install` is present).
3. **Body block** (`PromptBody.astro`) — the heart of the page:
   - Syntax-highlighted `<pre>` using **Shiki at build time** (zero runtime JS for highlighting). Theme: reuse `css-variables` so dark background matches our tokens — same decision point as the blog.
   - Language inferred from `type`: `markdown` for `prompt`/`skill`/`system-prompt`, `json` for `mcp-config`.
   - `<pre>` is keyboard-selectable, screen-reader-friendly, max-height with scroll, corner **Copy** button (`PromptCopyButton.astro` reused), toast on success.
4. **Variables form** (`PromptVariablesForm.astro`, PR 3 nice-to-have):
   - Only rendered if `variables?.length`. For each declared variable, a `<label>` + `<input>` pair. Below the inputs: a "Copy with variables" button that runs a regex replace over the body and copies the interpolated result to clipboard.
   - Pure vanilla JS, no framework. Progressive enhancement — the raw body is always copyable even if this form is absent or broken.
5. **How to use** (`<section>` inside `PromptDetailHero`): short markdown blurb from `howToUse`. Only renders if present.
6. **Install block** (`PromptInstallBlock.astro`): renders when `install` is present. Shows a labelled code block (`{install.label ?? 'Install'}`) with the command and a Copy button. For `kind: 'cli'`, rendered as a `<pre>` with monospace + `$` prefix; for `kind: 'json'`, Shiki-highlighted JSON; for `kind: 'url'`, a link + copy button.
7. **Example output** (optional): rendered as a quoted block in Cormorant italic with a subtle left border, only if `exampleOutput` present.
8. **Related prompts** (`PromptRelated.astro`): 3 cards from the same category (or sharing ≥2 tags if <3 in category), excluding self. Reuses `PromptCard.astro`.
9. **Back to hub** CTA: ghost button, plus a small muted line: _"Want something like this for your team? →"_ linking to `/catch-us` with `data-open-cal`.

## 7. Components to build

Uniform discipline: no per-entry CSS, no component variants per entry, all styling via design tokens. Every name mirrors App Vault where possible for Codex consistency.

Pages

- `src/pages/prompt-hub/index.astro` — route, composes hero + rail + grid, reads `prompts`, renders SSG.
- `src/pages/prompt-hub/[slug].astro` — detail route, `getStaticPaths`, reads one entry, composes detail components.

Components (`src/components/prompt-hub/`)

- `PromptHubHero.astro` — headline + sub + search + featured strip.
- `PromptHubSearchBar.astro` — pill-shaped `<input type="search">`, `/` shortcut hint.
- `PromptHubFilterRail.astro` — sticky desktop sidebar + mobile drawer.
- `PromptHubToolbar.astro` — result count + active chips + sort.
- `PromptHubSortDropdown.astro` — styled native `<select>`, 4 options.
- `PromptHubGrid.astro` — responsive CSS grid, no JS.
- `PromptCard.astro` — type badge + title + summary + model badges + tags + copy button.
- `PromptHubEmptyState.astro` — serif italic empty state.
- `PromptDetailHero.astro` — detail hero with badges + title + author + primary actions.
- `PromptBody.astro` — Shiki-highlighted body with corner copy button.
- `PromptVariablesForm.astro` — vanilla inputs + "Copy with variables" (PR 3).
- `PromptInstallBlock.astro` — CLI / JSON / URL install renderer.
- `PromptRelated.astro` — 3-card row.
- `PromptCopyButton.astro` — **shared component** used on card AND body AND install. Single source of truth for clipboard + toast + ARIA-live. This is the most important component in the hub.
- `icons.ts` — inline SVG map for type badges, model badges, copy icon, check icon. Single file, no framework icon library.

Scripts (`src/scripts/`)

- `prompt-hub.ts` — URL-driven filter/search/sort logic + global copy handler that catches `click` on any `[data-copy-target]` and copies the target's text to clipboard. Vanilla, ≤ 4 KB gz.

## 8. Interactivity

- **Static-first rendering**. 100% of the grid is server-rendered at build. Google sees every card. Filters are progressive enhancement.
- **Filter script** (`src/scripts/prompt-hub.ts`):
  - Runs on `astro:page-load` (View-Transitions-safe).
  - Reads `URLSearchParams`, hydrates filter UI state, then runs a single `applyFilters()` pass.
  - Iterates `[data-prompt-card]` nodes, reads `data-type`, `data-models`, `data-category`, `data-tags`, `data-search` attributes, toggles `hidden`.
  - Debounced search (150ms) against `data-search` (lowercased title + summary + tags + body-preview).
  - Sort reparents nodes based on `data-initial-index`, `data-added-at`, `data-title`, `data-copy-count`.
  - URL updates via `history.replaceState` on keystroke, `history.pushState` on filter-group change.
  - Result count written to an `aria-live="polite"` region.
- **Clipboard copy** (shared handler in same script):
  - One delegated listener on `document` for `click` on `[data-copy-target]`.
  - `navigator.clipboard.writeText()` with fallback to a hidden `<textarea>` + `document.execCommand('copy')` for older browsers.
  - Success toast: lightweight vanilla — a fixed `<div>` in Layout with `aria-live="polite"`, fades in for 2s then out. No toast library. Reused across the site.
  - Button micro-state: swap icon to a check for 1.5s after successful copy, then revert. `aria-label` flips to `"Copied"` during the success window.
- **Variable interpolation** (PR 3, `PromptVariablesForm.astro`):
  - Form inputs bound to `{var_name}` regex replacement over the body string (or whichever syntax is chosen — see §14).
  - "Copy with variables" button produces the filled version, writes it to clipboard, and shows the same toast.
  - Zero framework, zero build-time cost.
- **Keyboard**:
  - `/` focuses search (when not in an input).
  - `Esc` clears search when it's focused.
  - `c` on a focused card copies its body to clipboard (nice-to-have, PR 3 if time).
- **Copy-count tracking** (PR 3, nice-to-have): Cloudflare Analytics custom event on every successful copy, with `type`, `slug`, and surface (`card | detail`). Optional — if Rahul opts out in §14 we skip it and leave `copyCount` unset. "Most Copied" sort falls back to Featured when counts are zero.

## 9. SEO

This is where Prompt Hub earns its keep. Each detail page is a long-tail-targeted ranking asset.

- **Index `<title>`**: `Prompt Hub — prompts and skills for Claude, ChatGPT, Codex | NexAI Labs`
- **Index meta description**: 150 chars — _"The prompts, Claude skills, and agent instructions we actually ship with. Copy-paste ready. Curated, not crowdsourced."_
- **Detail `<title>`**: `{title} — {type} for {modelList} | NexAI Labs Prompt Hub`
  - Example: _"Invoice Extractor — Skill for Claude | NexAI Labs Prompt Hub"_
- **Detail meta description**: the `summary` field, trimmed to 160.
- **JSON-LD detail**: `CreativeWork` with `genre: "prompt engineering"`, `author: { "@type": "Person", "name": author }`, `datePublished: addedAt`, `text: body` (truncated). For `type: 'skill'` and `type: 'system-prompt'`, additionally emit a `HowTo` schema with `step[]` derived from numbered sections — Google's rich-results treatment of HowTo is a known long-tail booster.
- **JSON-LD index**: `ItemList` with each prompt as a `ListItem` → `CreativeWork`.
- **JSON-LD detail also**: `BreadcrumbList`.
- **Canonical**: always clean slug URL on detail pages; clean `/prompt-hub` on index. Filtered URLs carry `<meta name="robots" content="noindex, follow">` to avoid thin-duplicate penalties.
- **Big SEO win — call out explicitly**: Prompt Hub detail pages target high-intent long-tail queries like _"claude skill for invoice extraction"_, _"chatgpt prompt for cold email personalization"_, _"cursor system prompt for astro"_. Search volume per query is tiny, but intent is high and competition is low — this is the textbook content-marketing-for-developer-tools play. Rahul should expect 10–30 pages to quietly rank within 90 days if each has a unique body and a clear problem-shaped title.
- **Sitemap**: verify `astro.config.mjs` picks up `/prompt-hub` and `/prompt-hub/[slug]` via `@astrojs/sitemap` (already installed). Add to sitemap config if any filter is excluding them.
- **OG image**: reuse default NexAI OG for v1. Per-detail dynamic OG (with the prompt title rendered as an image) is a later enhancement — flag as v2 polish.

## 10. Performance budget

- **LCP** ≤ 2.0s on mobile (4G). LCP element is the hero headline (text) on both index and detail — cheap.
- **CLS** ≤ 0.05. Shiki `<pre>` blocks have explicit `min-height` fallbacks.
- **Lighthouse**: ≥ 95 perf, 100 a11y, 100 best practices, ≥ 95 SEO on both routes.
- **JS budget**: `prompt-hub.ts` ≤ 4 KB gz total — filter logic + clipboard handler + variable interpolation combined. Nothing else on this route beyond global Lenis / CustomCursor / Cal.
- **Shiki runs at build time**. Zero runtime JS for syntax highlighting. Use the `shiki` package directly inside `.astro` frontmatter — do not use any `astro-shiki` integration that pulls a runtime. Theme: `css-variables` so our existing tokens drive colors; `--shiki-color-text`, `--shiki-token-keyword`, etc. are set in global.css against our teal palette. **Same decision point as the blog** — if the blog hasn't chosen a Shiki theme yet, Prompt Hub forces the call.
- **No framework icon libraries**. Model badges, type badges, copy icon, check icon all ship as inline SVG from `icons.ts`.
- **Fonts**: no additional fonts loaded beyond Layout's existing Inter + Cormorant + Montserrat.
- **CSS**: reuse tokens; ~8 KB of Prompt-Hub-scoped styles split into component `<style>` blocks (Astro scopes them). Shiki CSS adds ~1.5 KB.

## 11. Accessibility

- **Copy button**: `<button type="button">` with `aria-label="Copy prompt to clipboard"`, success announced via a shared `aria-live="polite"` region in Layout (_"Copied to clipboard"_).
- **Shiki `<pre>`**: keyboard-selectable, NOT `aria-hidden`, `role="region"` with `aria-label="{title} prompt body"`, `tabindex="0"` so it's focusable for screen-reader selection.
- **Filter rail**: each group `<fieldset><legend>`; labels programmatically tied to inputs; `aria-live="polite"` on result count.
- **Search input**: visible `<label>` (may be `.sr-only`), `type="search"`, `aria-describedby` for `/` shortcut hint.
- **Cards**: `<article>` with inner `<a>` for title, separate focusable `<button>` for copy, separate focusable tag links. No nested interactive elements. Focus ring: `outline: 2px solid var(--color-brand-cyan); outline-offset: 3px;`.
- **Color contrast**: all text ≥ 4.5:1 on dark bg. Shiki token colors verified for 4.5:1 minimum.
- **Keyboard**: `/` focuses search (when not in an input), `Esc` clears search when focused, `c` on focused card copies body (nice-to-have).
- **Mobile drawer**: focus-trapped while open, `Esc` closes, returns focus to trigger.
- **Reduced-motion**: hover lift, drawer slide, copy-button micro-animation all respect `prefers-reduced-motion: reduce` (already handled globally).

## 12. Phase breakdown (3 PRs)

**PR 1 — Foundations**

- Add `src/data/prompt-hub.ts` with frozen enums, `PromptEntry` interface, and 5 seed entries from Rahul: **at least 1 of each `type`** to exercise all UI paths (e.g. 1 prompt, 1 skill, 1 system-prompt, 1 mcp-config, 1 extra featured prompt).
- Add `src/data/prompt-hub.validate.ts` build-time validator.
- Add `src/pages/prompt-hub/index.astro` with hero + static grid + `PromptCard` + `PromptHubHero` + `PromptCopyButton` on cards.
- Wire Shiki at build time for card preview snippets (first 3 lines of body, highlighted, in a small `<pre>`).
- Add shared copy handler + toast to Layout (or a small script imported by Layout) — `PromptCopyButton` depends on it and so will future hub features.
- Add `src/components/prompt-hub/icons.ts` with inline SVGs.
- Update `src/config/navigation.ts` — flip `prompt-hub` entry `href` from `/coming-soon` to `/prompt-hub`.
- **Acceptance**: route renders 200, 5 cards visible, nav link works, copy button on each card works and announces success, Lighthouse ≥ 95.

**PR 2 — Detail pages + filters + SEO**

- Add `src/pages/prompt-hub/[slug].astro` with `getStaticPaths`.
- Add `PromptDetailHero`, `PromptBody` (full Shiki body with copy), `PromptInstallBlock`, `PromptRelated`.
- Add `PromptHubFilterRail`, `PromptHubToolbar`, `PromptHubSortDropdown`, `PromptHubSearchBar`, `PromptHubEmptyState`.
- Add `src/scripts/prompt-hub.ts` — URL-driven filter + search + sort logic (≤ 3 KB gz of the ≤ 4 KB budget).
- Add `ItemList` JSON-LD on index; `CreativeWork` + `BreadcrumbList` + conditional `HowTo` JSON-LD on detail.
- Wire detail-page "Back to hub" + soft "/catch-us" CTA with `data-open-cal`.
- **Acceptance**: every slug resolves to a detail page with a copyable body, filters update URL and survive reload, back button restores state, empty state triggers when no matches, install block renders correctly for each install kind, JSON-LD validates in Google's Rich Results Test.

**PR 3 — Variables + analytics + polish**

- Add `PromptVariablesForm.astro` — vanilla inputs + "Copy with variables" on detail pages where `variables?.length`.
- Wire Cloudflare Analytics custom event on every successful copy (index card + detail body + install block), keyed by `slug` + `type` + `surface`.
- Wire "Most Copied" sort to `copyCount` — falls back to Featured ordering until counts exist.
- Optional: `c`-key copy shortcut on focused card; `PromptHubSearchBar` keyboard-shortcut polish.
- Optional: dynamic OG image per detail page (Satori or Cloudflare OG at build).
- **Acceptance**: variable interpolation round-trips cleanly (no broken escapes on braces in body), Cloudflare event visible in dashboard, "Most Copied" sort works in dev mode with mock counts.

**Sequencing note**: unlike App Vault, **detail pages land in PR 2, not PR 3**. An index-only Prompt Hub has no product — the content lives on detail pages. PR 1 keeps detail pages behind the index-only launch only long enough to validate card layout and data shape with real content.

## 13. Acceptance criteria

- `/prompt-hub` returns 200 with real data from `src/data/prompt-hub.ts`.
- `/prompt-hub/{slug}` returns 200 for every seeded entry.
- Navbar "Prompt Hub" entry in `src/config/navigation.ts` resolves to `/prompt-hub`.
- Copy button works on card AND detail body AND install block (clipboard API + toast + ARIA-live).
- Shiki highlights render correctly in dark theme — background matches `--color-surface-elevated` within 1 token.
- Filters produce URL state (`?type=skill&model=claude&category=Agents`) that survives reload and back-button.
- Build-time validator throws on duplicate slugs, over-length fields, bad enum values, missing frontmatter on skills, invalid JSON on mcp-configs.
- Lighthouse mobile: perf ≥ 95, a11y = 100 on both routes.
- JSON-LD validates in Google's Rich Results Test on at least one detail page.
- 5 seed entries from Rahul exercise all 4 `type`s plus `featured`, `variables`, and `install` at least once each.
- No per-entry CSS; every card renders through the same `PromptCard.astro`; every body through the same `PromptBody.astro`.

## 14. Open questions for Rahul

1. **Final category enum** — is the placeholder list in §3 correct, or do we swap (e.g. drop `Design`, add `Legal` or `Support`)? Locking this before PR 1 prevents migrations.
2. **Final tag enum** — same question for the 20-tag list in §3.
3. **Which 5 seed entries** — we need at least 1 of each `type` for UI coverage. Rahul to pick topics + types. Candidates: a cold-email prompt, an invoice-extraction Claude skill, a Cursor system prompt for Astro projects, an MCP config for an internal tool, a meta-prompt for writing better prompts.
4. **Variable syntax** — `{var}`, `{{var}}`, or `<var>`? Must pick one, document it in the data file's JSDoc, and bake it into the validator and `PromptVariablesForm` regex. Recommendation: `{var_name}` (single brace, snake_case) — matches how most ChatGPT prompt libraries write them and is Mustache-adjacent without colliding with JSON/JS template literals.
5. **Shiki theme** — reuse blog's `css-variables` setting (recommended — same decision point, one token surface, teal-matched) or a named theme like `github-dark`? Blog hasn't shipped; this PR forces the call.
6. **Copy-count tracking** — opt into Cloudflare Analytics custom events (recommended, zero PII, drives "Most Copied" sort) or skip in v1 to minimize moving parts?
7. **User-submitted prompts** — v1 is curator-only. Flag as v2 research: GitHub-PR inbox vs Notion form vs on-site submit form. Not in scope, but Rahul should weigh in so v1 data shape doesn't paint us into a corner.
8. **Skill frontmatter enforcement** — the Anthropic docs mandate `name` (≤64 char, kebab-case, no reserved words) and `description` (≤1024 char) on every skill. Should our validator enforce these _exactly_ so any `type: 'skill'` entry is installable as-is? Recommendation: yes, and fail the build otherwise. This is the detail that makes Prompt Hub feel native to the Anthropic ecosystem.
9. **Author field** — always "Rahul Juneja" / "NexAI Labs", or do we want to credit external contributors if Rahul is curating from community sources? Affects whether we render an author chip on cards or only on detail.
10. **Install block for prompts** — plain prompts (non-skill, non-mcp) don't really have an "install". Do we hide the install button entirely for `type: 'prompt'`, or repurpose it as a "Open in ChatGPT/Claude" deeplink (`https://chatgpt.com/?q=...`)? Recommendation: deeplink — it's a delightful touch and trivial to wire.

## 15. Rollback

All three PRs are purely additive: new route, new components, new data file, one-line nav edit. Rollback = `git revert <commit>`. No migrations, no data mutations, no deleted shared components. The nav edit that flipped `prompt-hub` from `/coming-soon` to `/prompt-hub` is a one-line revert. Safe.

## 16. Critical files for implementation

**New files**

- `src/data/prompt-hub.ts` — data + enums + `PromptEntry` interface, single source of truth.
- `src/data/prompt-hub.validate.ts` — build-time validator.
- `src/pages/prompt-hub/index.astro` — index route.
- `src/pages/prompt-hub/[slug].astro` — detail route (PR 2).
- `src/components/prompt-hub/PromptHubHero.astro`
- `src/components/prompt-hub/PromptHubSearchBar.astro`
- `src/components/prompt-hub/PromptHubFilterRail.astro`
- `src/components/prompt-hub/PromptHubToolbar.astro`
- `src/components/prompt-hub/PromptHubSortDropdown.astro`
- `src/components/prompt-hub/PromptHubGrid.astro`
- `src/components/prompt-hub/PromptCard.astro`
- `src/components/prompt-hub/PromptHubEmptyState.astro`
- `src/components/prompt-hub/PromptDetailHero.astro` (PR 2)
- `src/components/prompt-hub/PromptBody.astro` (PR 2)
- `src/components/prompt-hub/PromptInstallBlock.astro` (PR 2)
- `src/components/prompt-hub/PromptRelated.astro` (PR 2)
- `src/components/prompt-hub/PromptVariablesForm.astro` (PR 3)
- `src/components/prompt-hub/PromptCopyButton.astro`
- `src/components/prompt-hub/icons.ts`
- `src/scripts/prompt-hub.ts`

**Edited files**

- `src/config/navigation.ts` — flip `prompt-hub` entry `href` from `/coming-soon` to `/prompt-hub`.
- `src/layouts/Layout.astro` — add a single shared `aria-live="polite"` toast region + the global copy handler script import. **This is the only Layout edit needed** and should be done once in PR 1 so App Vault and future surfaces can reuse the same toast.
- `src/styles/global.css` — add Shiki token CSS variables scoped under a `.prompt-body` selector, plus `.tag-pill--sm` variant if not already present.
- `astro.config.mjs` — verify `@astrojs/sitemap` picks up both new routes; add integration config if needed.

**Dependencies to add**

- `shiki` (build-time only, no runtime bundle hit) — required for `PromptBody.astro`. Pin to the version the blog will use if the blog PR lands first.

## Research caveats

- **WebFetch was denied for `skillsmp.com` and `mcpmarket.com/tools/skills`**. The §2 audit for those two sources is drawn from prior knowledge of comparable directories and marketplace patterns. Before PR 2 finalises the card anatomy, install-block layout, and category-rail design, Rahul (or Codex) should spend 15 minutes manually reviewing both sites and confirming the three specific patterns called out as keepers: (1) skillsmp's per-entry detail layout and related-skills row, (2) mcpmarket's install-block tab UX (CLI/JSON/URL), (3) both sites' sort-dropdown + chip-filter toolbar treatment.
- **WebFetch succeeded for the Claude Agent Skills docs**, so the skill-schema, frontmatter fields, progressive-disclosure model, and validator rules in §4 are drawn from the canonical source and can be trusted as-is.
