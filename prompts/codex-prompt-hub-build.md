# Codex — Build the Prompt Hub page

You are building the Prompt Hub for the NexAI Labs marketing site. This is an on-site library of prompts, Claude skills, agent system prompts, and MCP configs that NexAI Labs ships with. Unlike App Vault (a directory of _external_ software), **Prompt Hub's content lives on our domain** — users land on a card, click through to a detail page, copy the body into their clipboard, and either paste it into ChatGPT/Claude/Gemini or install it as a Claude Agent Skill / MCP tool. That shift changes the interaction model, the SEO bet, and the component shape versus App Vault.

The full spec lives at `plans/prompt-hub.md`. **Read that file in full before you write a single line of code.** This document is the handoff wrapper — it locks in all defaults, lists what to reuse from App Vault, defines the hard rules, and specifies how to verify when you're done. Every decision is already made. Start coding immediately. The spec is the authority on scope, schema, components, layout, and phases.

The sibling plan at `plans/app-vault.md` is required reading too — Prompt Hub's filter rail, toolbar, grid breakpoints, hover states, a11y pattern, and URL-driven filter script are deliberately parallel. If an App Vault PR has already shipped when you pick this up, reuse its components and CSS patterns wherever you can.

---

## Repo facts you must respect

- Astro 5.18.1 static site, Cloudflare Pages, TypeScript, vanilla CSS.
- No React, no Vue, no Svelte, no Tailwind, no CSS-in-JS. Astro components + scoped `<style>` blocks only.
- Design tokens live in `src/styles/global.css`. Reuse them — do not invent new colors or spacing.
- Global layout wrapper: `src/layouts/Layout.astro`. It already handles `<head>`, SEO, fonts, Cal dialog, View Transitions, Footer. Reuse it.
- Navigation: `src/config/navigation.ts` already has a `prompt-hub` entry. Currently it points at a placeholder. Flip its `href` to `/prompt-hub` as part of PR 1.
- Sitemap: `@astrojs/sitemap` is installed and wired. Verify new routes appear after build.
- Existing homepage composition patterns are the reference for rhythm. Match them.

## Dependency to add

**`shiki`** — build-time syntax highlighting. Zero runtime bundle cost. Install before PR 1:

```bash
npm install shiki
```

Do NOT install `astro-shiki`, `@astrojs/markdown-remark` extras, or any runtime highlighter. Use Shiki directly inside `.astro` frontmatter (`const html = await codeToHtml(body, { lang, theme })`).

If `plans/cozy-sniffing-moth.md` (blog plan) has shipped first and pinned a Shiki version, match that pin. Otherwise pin to the latest stable.

---

## Locked decisions — use these defaults, do not stop to ask

All decisions are locked. Start on a new branch off `main` and proceed straight to Phase 1. Rahul will edit values after PR 1 lands if anything needs tweaking — treat everything here as live, not as a questionnaire.

1. **Categories (frozen, append-only enum):** `['Writing', 'Coding', 'Research', 'Marketing', 'Sales', 'Ops', 'Design', 'Agents', 'Data', 'Meta-Prompts']`.
2. **Tags (frozen, append-only enum, 20 values):** `rag, extraction, classification, writing, refactor, debug, cold-email, outbound, research, summarization, agents, mcp, eval, sop, customer-support, code-review, data-cleanup, spec-writing, planning, onboarding`.
3. **Type enum:** `['prompt', 'skill', 'system-prompt', 'mcp-config']`.
4. **Model enum:** `['chatgpt', 'claude', 'gemini', 'cursor', 'codex', 'any']`.
5. **Variable syntax:** `{var_name}` — single brace, lowercase with underscores (snake case). Validator regex (use this exact pattern, do not paraphrase):

   ```js
   const VAR_RE = /\{([a-z][a-z0-9_]*)\}/g;
   ```

   Bake this into `src/data/prompt-hub.validate.ts` and the PR 3 `PromptVariablesForm`.

6. **Shiki theme:** `css-variables`. Define token colors on `.prompt-body pre` in `src/styles/global.css` — match the dark surface palette. If the blog PR has already pinned a `shiki` version, match it; otherwise pin to the latest stable.
7. **Skill frontmatter enforcement:** strict. The validator throws on any `type: 'skill'` entry whose `body` doesn't start with a YAML frontmatter block containing `name` (kebab-case, ≤64 chars, no reserved words) and `description` (≤1024 chars). This makes every skill in the hub directly installable into Claude Code without post-processing.
8. **Copy-count tracking:** enabled. Wire a Cloudflare Analytics custom event `prompt_hub.copy` on every successful copy (card, detail body, install block), keyed by `slug`, `type`, and surface. Zero PII — no body content in the payload. In PR 1 ship the event-firing code; "Most Copied" sort wiring is PR 3.
9. **Install block for `type: 'prompt'` entries:** render a "Open in ChatGPT" deeplink button that URL-encodes the body into `https://chatgpt.com/?q=<encoded>`. For `type: 'skill'` show the install command per entry's `install` field; for `type: 'mcp-config'` show a "Copy JSON" button pointing at the raw config; for `type: 'system-prompt'` hide the install row entirely (only copy).
10. **Seed data (PR 1 ships with these 5 prompts — write them yourself):** every type must be represented so the card UI is fully exercised on first deploy. Rahul swaps them later.
    - **1. `cold-email-personalization`** (`type: 'prompt'`, models: `[chatgpt, claude, any]`, category: `Sales`, tags: `[cold-email, outbound, writing]`, `featured: true`) — a ~400-word cold-email personalization prompt with `{prospect_name}`, `{company_name}`, `{role}`, `{pain_point}` variables.
    - **2. `invoice-extractor`** (`type: 'skill'`, models: `[claude]`, category: `Data`, tags: `[extraction, automation]`, `featured: true`) — a Claude Agent Skill body starting with valid YAML frontmatter (`name: invoice-extractor`, `description: Extracts line items, totals, vendor info, and tax from PDF/image invoices. Use when processing receipts or AP inboxes.`) followed by a short instruction section.
    - **3. `cursor-astro-system-prompt`** (`type: 'system-prompt'`, models: `[cursor]`, category: `Coding`, tags: `[engineering, spec-writing]`) — a ~300-word Cursor system prompt tuned for Astro 5 + vanilla CSS projects (mirrors the NexAI stack so it feels native).
    - **4. `mcp-filesystem-config`** (`type: 'mcp-config'`, models: `[claude, codex]`, category: `Ops`, tags: `[mcp, tools]`) — a valid JSON MCP server config for the official filesystem MCP with sensible defaults and one comment field as a string property explaining the config shape.
    - **5. `meta-prompt-rewriter`** (`type: 'prompt'`, models: `[claude, chatgpt, any]`, category: `Meta-Prompts`, tags: `[writing, spec-writing]`) — a meta-prompt that takes `{original_prompt}` and `{goal}` variables and rewrites the input for clarity.

    All 5 seed entries use `author: 'NexAI Labs'`, `addedAt: '2026-04-15'`. Bodies are authored as backtick template literals inside `src/data/prompt-hub.ts`.

If any of these values turn out to be wrong after PR 1 ships, they're all 1-line edits. Do not treat them as blockers. Start coding now.

---

## Phase 1 — Foundations (SHIP FIRST)

Goal: `/prompt-hub` returns 200 with 5 seeded entries covering all 4 types. Cards render with copy buttons that work. No detail pages, no filters, no variables form. Lighthouse ≥ 95 / 100 on first deploy.

### 1.1 Data model

Create `src/data/prompt-hub.ts`. Copy the exact TypeScript shape from `plans/prompt-hub.md` §4. Key points:

- Frozen enums: `PROMPT_TYPES`, `PROMPT_MODELS`, `PROMPT_CATEGORIES`, `PROMPT_TAGS`, each `as const` with derived types.
- `PromptEntry` interface with all fields from §4. Do not add per-entry CSS, layout variants, or theme controls. Uniform template discipline.
- `export const prompts: readonly PromptEntry[]` holding the 5 seed entries from "Locked decisions" §10.
- Authors bodies as template literals (backticks). Long prompts are fine — the validator checks length on `title` and `summary`, not `body`.

Create `src/data/prompt-hub.validate.ts`. At module load, iterate `prompts` and throw on:

- Duplicate `slug` values
- `title.length > 80`
- `summary.length > 160`
- `tags.length > 8`
- `models.length === 0`
- `type`, any `model`, `category`, any `tag` outside their enums
- Any `variables[]` entry that doesn't appear as `{var_name}` (or chosen syntax) in `body`
- `type: 'skill'` entries missing a YAML frontmatter block with `name` and `description` at the top of `body` — and `name` violating Anthropic's kebab-case + length rules
- `type: 'mcp-config'` entries whose `body` is not valid JSON (`JSON.parse` inside a try/catch)
- `install.command` containing suspicious shell metacharacters (defense-in-depth, we're not executing — but a hard stop is cheap)

Import the validator at the top of `src/pages/prompt-hub/index.astro` so `npm run build` fails loudly on bad data.

### 1.2 Shared copy handler + toast (Layout edit)

This is the only edit to `src/layouts/Layout.astro` needed for PR 1. Do it once here so App Vault and future surfaces can reuse it.

Add to `Layout.astro` just before the closing `</body>`:

```astro
<div id="copy-toast" class="copy-toast" role="status" aria-live="polite" aria-atomic="true"></div>
```

Styles scoped in Layout's `<style is:global>` block or a small new `<style>` tag:

```css
.copy-toast {
	position: fixed;
	bottom: 2rem;
	left: 50%;
	transform: translate(-50%, 20px);
	padding: 0.75rem 1.5rem;
	background: var(--color-surface-elevated);
	color: var(--color-text-main);
	border: 1px solid var(--color-brand-cyan);
	border-radius: 999px;
	font-family: var(--font-main);
	font-size: 0.9rem;
	opacity: 0;
	pointer-events: none;
	transition:
		opacity 0.2s ease,
		transform 0.2s ease;
	z-index: var(--z-overlay);
}

.copy-toast.is-visible {
	opacity: 1;
	transform: translate(-50%, 0);
}
```

Add an inline script (or a new file `src/scripts/copy-handler.ts` imported from Layout) that:

- Listens for `click` on `document` delegated to `[data-copy-target]`
- Reads the target string from `data-copy-target` attribute (the raw text) OR from a sibling element via `data-copy-source` selector
- Calls `navigator.clipboard.writeText(...)` with a textarea fallback for older browsers
- Sets the toast text to `"Copied to clipboard"`, adds `is-visible`, removes it after 2 s
- Swaps the button's icon to a check mark for 1.5 s via a `.is-copied` class
- Updates `aria-label` to `"Copied"` during the success window

This handler is global and reusable. PR 1 uses it on card copy buttons. PR 2 reuses it on the detail body and install block. Future surfaces can drop a `[data-copy-target]` button anywhere and it just works.

### 1.3 Route + components (PR 1 only)

Create these files:

- `src/pages/prompt-hub/index.astro`
- `src/components/prompt-hub/PromptHubHero.astro`
- `src/components/prompt-hub/PromptCard.astro`
- `src/components/prompt-hub/PromptHubGrid.astro`
- `src/components/prompt-hub/PromptCopyButton.astro`
- `src/components/prompt-hub/icons.ts` (inline SVG map — type badges, model monograms, copy icon, check icon)

**PR 1 scope only — do NOT create** `PromptHubFilterRail`, `PromptHubToolbar`, `PromptHubSortDropdown`, `PromptHubSearchBar`, `PromptHubEmptyState`, `PromptDetailHero`, `PromptBody`, `PromptInstallBlock`, `PromptRelated`, `PromptVariablesForm`, or `src/scripts/prompt-hub.ts`. Those are PR 2 and PR 3.

`src/pages/prompt-hub/index.astro` composition:

```astro
---
import Layout from '../../layouts/Layout.astro';
import PromptHubHero from '../../components/prompt-hub/PromptHubHero.astro';
import PromptHubGrid from '../../components/prompt-hub/PromptHubGrid.astro';
import { prompts } from '../../data/prompt-hub';
import '../../data/prompt-hub.validate';

const featured = prompts.filter((p) => p.featured).slice(0, 4);
---

<Layout
	title="Prompt Hub — prompts and skills for Claude, ChatGPT, Codex | NexAI Labs"
	description="The prompts, Claude skills, and agent instructions we actually ship with. Copy-paste ready. Curated, not crowdsourced."
	mainClass="prompt-hub"
>
	<PromptHubHero featured={featured} />
	<PromptHubGrid prompts={prompts} />
</Layout>
```

`PromptHubHero.astro`:

- Eyebrow pill: `THE PROMPT HUB`
- Headline in Cormorant italic: _"Prompts and skills we actually ship with."_
- Muted sub (Inter, ~1.05rem): _"Copy-paste ready. Curated, not crowdsourced. Battle-tested on real work."_
- Featured strip below headline: 3–4 horizontal `PromptCard`s for `featured: true` entries. No search input in PR 1 (added in PR 2).

`PromptCard.astro` anatomy (different from App Vault — no external wrapping anchor, copy is primary):

- `<article data-prompt-card>` with filter data attributes pre-rendered (`data-type`, `data-models`, `data-category`, `data-tags`, `data-title`, `data-added-at`, `data-search`) so PR 2 can wire filters without touching the card.
- Inner `<a href="/prompt-hub/{slug}">` wraps the title + summary only — not the whole card. In PR 1, this anchor is an inert link target (detail page ships in PR 2); you can either have it navigate to `/prompt-hub/{slug}` and show a 404 (not ideal) or temporarily make it a dead link with `aria-disabled`. **Recommended**: ship PR 1 with the anchor pointing at `/prompt-hub/{slug}` and immediately follow up with PR 2 so the 404 window is minutes not days. Do not link to external content from cards — content lives on-site.
- **Copy button top-right** (`PromptCopyButton.astro`) with `data-copy-target={entry.body}`. Appears on hover/focus on desktop. Always visible on touch (screens < 768 px). 32×32, `aria-label="Copy prompt to clipboard"`. Uses the shared copy handler from Layout.
- **Type badge top-left**: small pill `PROMPT`, `SKILL`, `SYSTEM`, or `MCP` with category color accent.
- Title (Inter 600, 1.05rem, 2-line clamp)
- One-line summary (muted, 0.9rem, 2-line clamp)
- Model badges row: small inline-SVG monograms from `icons.ts` for each `models[]` entry
- Tag pills row (max 3, `+N` overflow chip — reuse `.tag-pill` token)
- Focus ring on the inner `<a>` via an `::after` overlay so the copy button stays independently focusable
- Hover: `transform: translateY(-2px)`, `border-color: rgba(78, 201, 180, 0.4)`, 300ms `var(--ease-out-expo)`. No box-shadow or filter animations.
- Scoped `<style>` block only. No per-entry CSS.

`PromptCopyButton.astro`:

- `<button type="button" data-copy-target={target} aria-label="Copy prompt to clipboard">` containing the copy-icon SVG from `icons.ts`
- On `.is-copied` class: swap to check icon, text color `var(--color-brand-cyan)`
- Scoped style only

`PromptHubGrid.astro`:

- Plain CSS grid. Breakpoints match App Vault: 3 cols ≥ 1100px, 2 cols 768–1099, 1 col < 768. `gap: var(--space-md)`.
- No JS. No pagination. All 5 cards render server-side.

### 1.4 Navigation

Edit `src/config/navigation.ts`. Find the `prompt-hub` entry and flip its `href` to `/prompt-hub`. Do not rename the label. Do not change the icon.

### 1.5 Shiki setup for card preview snippets (optional polish)

The spec allows card preview snippets — first 3 lines of body highlighted in a small `<pre>`. This is worth shipping in PR 1 because it proves Shiki is wired correctly before the full body block lands in PR 2. If time is tight, skip it in PR 1 and ship syntax highlighting only in PR 2 with the detail page.

If shipping: inside `PromptCard.astro` frontmatter, call `codeToHtml` from `shiki` with theme `css-variables` (locked in §6), language inferred from `type` (`markdown` for prompt/skill/system-prompt, `json` for mcp-config), and render the result as `<Fragment set:html={html} />` inside a scoped `<pre class="prompt-card__preview">`.

### 1.6 Styling rules

- Reuse existing tokens for all colors and spacing.
- Component `<style>` blocks only (except the Layout toast styles).
- No new fonts.
- "Quiet observatory" aesthetic: restrained teal, serif italic only on hero headline, Inter for everything else, dark surfaces.
- All transitions use `transform` or `opacity` only. No `filter`, `border-color`, or `box-shadow` animations.

### 1.7 Acceptance — PR 1

- `npm install shiki` clean, `npm run build` clean, validator does not throw.
- `/prompt-hub` returns 200 locally and in deploy preview.
- 5 cards render covering all 4 types. Featured strip shows ≥3 cards.
- Navbar "Prompt Hub" link resolves to `/prompt-hub`.
- Click copy button on any card → clipboard contains the full `body`, toast appears saying "Copied to clipboard", button shows check icon for 1.5 s.
- Toast is announced to screen readers (`role="status" aria-live="polite"`).
- Inner anchor on each card points at `/prompt-hub/{slug}` (expected 404 until PR 2 lands — acceptable if PR 2 lands within days).
- Lighthouse mobile: Performance ≥ 95, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95.
- Visual smoke test at 360, 768, 1100, 1440 px: grid collapses cleanly, copy button is always visible below 768, hover lift works above 768.
- Keyboard: tab through cards, copy button is focusable, `Enter` triggers copy, success announced.

---

## Phase 2 — Detail pages + filters + SEO (follow-up PR)

Do NOT merge Phase 2 into the Phase 1 PR. Detail pages are the heart of Prompt Hub — their shape deserves its own review.

Scope from `plans/prompt-hub.md` §§6, 7, 8, 9:

- `src/pages/prompt-hub/[slug].astro` with `getStaticPaths()` over `prompts`
- `PromptDetailHero.astro` — type badge + category chip + model row + title + author + copy/install buttons
- `PromptBody.astro` — full Shiki-highlighted `<pre>` with corner copy button (reuses `PromptCopyButton` with `data-copy-target={body}`)
- `PromptInstallBlock.astro` — renders when `install` is present, handles CLI / JSON / URL kinds
- `PromptRelated.astro` — 3 cards from same category (or ≥2 shared tags fallback), excludes self, reuses `PromptCard`
- `PromptHubFilterRail.astro`, `PromptHubToolbar.astro`, `PromptHubSortDropdown.astro`, `PromptHubSearchBar.astro`, `PromptHubEmptyState.astro`
- `src/scripts/prompt-hub.ts` — URL-driven filter/search/sort logic, ≤ 3 KB gzip, runs on `astro:page-load`
- `ItemList` JSON-LD on index; `CreativeWork` + `BreadcrumbList` + conditional `HowTo` JSON-LD on detail pages

Filter logic must:

- Read `URLSearchParams` on `astro:page-load`, hydrate filter UI
- Toggle `hidden` on `[data-prompt-card]` nodes based on data attributes
- Debounce search by 150 ms
- Update URL via `replaceState` on keystroke, `pushState` on filter-group change
- Write result count to `aria-live="polite"` region
- Re-sort by reparenting nodes
- Match the App Vault filter script's structure so if both scripts exist, a future refactor can extract a shared base

Add `<meta name="robots" content="noindex, follow">` on `index.astro` when any filter param is present.

Detail page `<head>`:

- `<title>`: `{title} — {typeLabel} for {modelList} | NexAI Labs Prompt Hub`
- `<meta name="description">`: `summary` trimmed to 160
- Canonical always clean slug URL
- `CreativeWork` JSON-LD with `author`, `datePublished: addedAt`, `text: body.slice(0, 500)`, `genre: "prompt engineering"`
- For `type: 'skill'` and `'system-prompt'`: additionally emit `HowTo` JSON-LD with steps derived from numbered sections in `body` (if present; skip if not)
- `BreadcrumbList` JSON-LD
- Reuse the global copy toast — no additional Layout edit

PR 2 also wires the detail-page "Back to hub" CTA and a soft `/catch-us` CTA with `data-open-cal` attribute.

Acceptance — PR 2: every seeded slug resolves to a detail page with a copyable, syntax-highlighted body. Install block renders correctly for `kind: 'cli'` (invoice-extractor skill install), `kind: 'json'` (mcp-filesystem-config), and URL-deeplink for prompts. Filters survive reload + back-button. `HowTo` JSON-LD validates in Google's Rich Results Test on the invoice-extractor skill entry. Lighthouse still ≥ 95 / 100 on both routes.

---

## Phase 3 — Variables + analytics + polish (follow-up PR)

Scope from `plans/prompt-hub.md` §§8, 12 PR 3:

- `PromptVariablesForm.astro` — vanilla `<label>` + `<input>` pairs, one per declared variable, plus a "Copy with variables" button. Progressive enhancement: the raw body is always copyable even if this form is absent or broken. Regex is `/\{([a-z][a-z0-9_]*)\}/g` per §5 — use a **named capture group** so the replacement is safe with special chars in user input.
- Cloudflare Analytics custom event on every successful copy, keyed by `slug`, `type`, and surface (`card | detail | install`). Event name suggestion: `prompt_hub.copy`. Zero PII — no body content in the event payload.
- Wire "Most Copied" sort to `copyCount`. Falls back to Featured when all counts are zero/undefined.
- Optional: `c` key on focused card copies its body (nice-to-have).
- Optional: dynamic per-detail OG image via Satori or Cloudflare OG at build.

Acceptance — PR 3: variable interpolation round-trips cleanly (no broken escapes on `{` inside user input, no XSS via form inputs — inputs are only pasted into clipboard, never into DOM). Cloudflare event visible in dashboard after ~15 min of real traffic. "Most Copied" sort works in dev with mock counts set on a few entries.

---

## Hard don'ts

1. **No frameworks.** No React, Vue, Svelte, Preact, Solid, HTMX, Alpine. Astro + vanilla CSS + vanilla JS only.
2. **No runtime syntax highlighter.** Shiki runs at build time inside `.astro` frontmatter. No `highlight.js`, no `prism-react-renderer`, no client-side Shiki.
3. **No per-entry CSS, layout modes, theme props, or accent controls.** Every card through `PromptCard`, every body through `PromptBody`. Uniform template discipline.
4. **No new fonts.** Inter + Cormorant + Montserrat are enough.
5. **No icon libraries.** Inline SVG from `src/components/prompt-hub/icons.ts`.
6. **No `filter: blur`, `border-color`, or `box-shadow` animations.** Transform + opacity only.
7. **No touching the Cal.com dialog** in `Layout.astro` beyond adding the toast div + copy handler script.
8. **No deleting existing pages.** Only additions + one nav edit + one Layout addition (the copy toast + handler).
9. **Seed data is the 5 prompts in §10 of the Locked decisions section.** You write the bodies yourself. The seed data must exercise all 4 types — no skipping `mcp-config` or `skill` because they're harder. Rahul replaces them after PR 1 ships.
10. **No pulling PR 2 scope into PR 1.** Filters, detail pages, Shiki body block, install block, JSON-LD, `src/scripts/prompt-hub.ts` — all PR 2. Card preview snippets with Shiki are the only PR 1 Shiki use and only if time permits.
11. **No scraping prompts from copyrighted sources.** The 5 seed bodies in §10 are original — you author them yourself in plain language. Don't copy famous prompt templates from Twitter/GitHub without modification.
12. **No rendering user input into the DOM from `PromptVariablesForm`.** Inputs are only used for regex replacement on the body string, which is then written to clipboard. Never `innerHTML` the filled result anywhere.

---

## Verification checklist (run before opening the PR)

### Build + static checks

- `npm install shiki` clean, no peer-dependency warnings.
- `npm run build` clean. No warnings from Astro, Vite, or TypeScript.
- Validator throws on a test bad-data case (temporarily break a slug or enum value → build should fail loudly → revert).
- `dist/prompt-hub/index.html` exists, contains all 5 card `<article>` elements.
- Global copy handler exists in built `Layout` and fires once — use DevTools Sources to verify it's not double-bound.
- `grep -r 'layoutMode\|accent:\|proseWidth' src/components/prompt-hub` returns zero.

### Visual smoke test (dev preview)

- `/prompt-hub` renders dark hero + featured strip + grid.
- 360 px: single column, copy button always visible, no horizontal scroll.
- 768 px: two columns, copy button visible on hover or focus.
- 1100 px: three columns.
- Hover a card: 2 px lift + teal border glow.
- Click copy button: clipboard has full body, toast appears and fades, button icon flips to check then back.
- Screen reader announces "Copied to clipboard" via the live region.
- Tab order: hero → featured card 1 copy → featured card 1 link → featured card 2 … → main grid card 1 copy → main grid card 1 link → … → footer. No traps.

### Accessibility

- Focus ring visible on card `<a>` (inner title/summary link) and on copy button independently.
- Copy button has meaningful `aria-label` that changes to "Copied" during success window.
- Toast has `role="status" aria-live="polite"`.
- No `<h1>` duplication — hero has the only h1, cards use h3.
- Color contrast ≥ 4.5:1 including type badge text, muted summary, tag pills.
- Run axe or equivalent — zero violations.

### Performance

- Lighthouse mobile: Performance ≥ 95, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95.
- Copy handler + (optional) Shiki-rendered card previews add < 4 KB gzip to the route total.
- No CLS when cards enter hover state (use transform, not layout-affecting properties).
- First contentful paint < 1.5 s on simulated 4G.

### SEO

- `<title>` and `<meta description>` set.
- Canonical points at `https://www.nexailabs.com/prompt-hub`.
- Sitemap includes `/prompt-hub` (check `dist/sitemap-0.xml` after build).
- No JSON-LD on PR 1 — that lands in PR 2 with the detail pages.

---

## Rollback

PR 1 is additive: new data file, new route, new components, new Layout addition (toast + copy handler), one-line nav edit. Rollback = `git revert <commit>`. The Layout edit reverts cleanly because no existing code depends on it yet. No migrations, no state. Safe.

PR 2 and PR 3 are also purely additive and revertable the same way. The only destructive-adjacent change across all three PRs is the navigation edit, which is a one-line diff.

---

## Handoff checklist

Before you write code, confirm:

- [ ] You read `plans/prompt-hub.md` end to end.
- [ ] You read `plans/app-vault.md` §§5, 7, 8, 11 so Prompt Hub's filter rail, grid, a11y, and copy-interaction patterns stay parallel.
- [ ] All decisions in the "Locked decisions" section are live — do not re-ask any of them.
- [ ] `shiki` is the only new dependency.
- [ ] You're on a new branch off `main` (e.g. `feat/prompt-hub-pr1`).
- [ ] You understand PR 1 is index-only with working card copy buttons; detail pages = PR 2; variables + analytics = PR 3.
- [ ] You understand the copy toast + handler in `Layout.astro` is a shared piece of infrastructure that App Vault (and every future surface) will reuse — name it neutrally, not `prompt-hub-toast`.

When you're done with PR 1, report back with:

- Branch name + commit SHA
- Lighthouse mobile screenshot for `/prompt-hub`
- Dev-preview URL if Cloudflare Pages has built it
- A 10-second GIF or screenshot of the copy button working end-to-end
- Anything Rahul needs to decide before PR 2 starts
