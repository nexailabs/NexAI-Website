# Typography Audit — NexAI Labs Marketing Site

**Auditor:** Claude (Opus 4.7, 1M ctx)
**Date:** 2026-04-25
**Scope:** Read-only typography drift audit across `src/**` for the Astro 6 marketing site.
**Tools:** Grep + Read on every `.astro` and `.css` file under `src/`.

---

## 1. Executive Summary — Five biggest inconsistencies

1. **Two competing display systems are fighting on the homepage.** `HomeHero`, `HomeAnatomy`, `section-title`, and the `studio` family use **Cormorant Garamond** as the H2 font. `HomeToolkit`, `HomePricing`, and `HomeRoster` use **Anton** at a much louder weight/scale (`clamp(2.8rem, 5.6vw, 4.6rem)` vs. `clamp(2.2rem, 4vw, 3.4rem)`). One page renders with two visually irreconcilable display voices stacked vertically.

2. **`var(--font-anton)` is registered in `astro.config.mjs` but the variable is never used.** Anton is wired through `cssVariable: '--font-anton'` (line 49) — but every consumer hard-codes `font-family: 'Anton', 'Montserrat', 'Inter', sans-serif;` (15+ call sites in `HomePricing`, `HomeToolkit`, `HomeRoster`). Result: the Astro Fonts API loads Anton, declarations bypass it, browser falls back to nothing if the @font-face name doesn't literally resolve to "Anton". A self-hosted asset is being treated as a system font.

3. **Eyebrow / mono-label is the most-drifted role in the codebase.** Every page invents its own. Counted variants: `0.54rem` / `0.58rem` / `0.6rem` / `0.62rem` / `0.65rem` / `0.66rem` / `0.68rem` / `0.7rem` / `0.72rem` / `0.74rem` / `0.78rem` / `0.82rem` — twelve distinct sizes, with letter-spacing ranging `0.08em` through `0.22em`, weights split between `400 / 500 / 600 / var(--fw-semibold)`, font-family split between `var(--font-main)`, `ui-monospace, 'SF Mono', Menlo, monospace`, and the `tag-pill` global. The token `--text-xs: 0.72rem` exists but is used in only ~10% of eyebrows.

4. **Hard-coded mono stack repeated 40+ times.** `font-family: ui-monospace, 'SF Mono', Menlo, monospace;` is duplicated in `HomeAnatomy`, `HomePricing`, `HomeRoster`, `HomeThesis`, `HomeToolkit`, `ArtifactCard`, `BuyModal`, `DeepFilterBar`, `prompts/[...slug]`, `apps/[...slug]`, `apps/stacks/[...slug]`, `Avatar`, `prompts/index`, `FilterStrip`, `PriceTag`, `PriceCard`, `LockedOverlay`, `MetaStrip`, `PromptHubHero`, `PromptCodeBlock`, `FileTree`, `InstallTabs`, `blog/[...slug]`. There is **no** `--font-mono` token.

5. **Body and lede sizes are improvised everywhere.** Lede paragraphs across components use `0.86rem` / `0.88rem` / `0.9rem` / `0.92rem` / `0.94rem` / `0.95rem` / `0.96rem` / `0.98rem` / `1rem` / `1.02rem` / `1.05rem` — eleven sizes for what is essentially the same role. Tokens `--text-base`, `--text-lg`, `--text-xl` exist; `--text-base` is referenced **3 times** total in the codebase.

---

## 2. Current-state Inventory

### 2A. Font families registered (`astro.config.mjs`)

| Variable            | Family             | Weights              | Loaded via Layout.astro `<Font>` |
| ------------------- | ------------------ | -------------------- | -------------------------------- |
| `--font-inter`      | Inter              | 400/500/600/700/800  | yes                              |
| `--font-cormorant`  | Cormorant Garamond | 400/600 (italic too) | yes (preload)                    |
| `--font-montserrat` | Montserrat         | 600/700              | yes                              |
| `--font-anton`      | Anton              | 400                  | **NO `<Font>` tag emitted**      |

`global.css` exposes only three abstractions:

```css
--font-main: var(--font-inter), system-ui, -apple-system, sans-serif;
--font-brand: var(--font-montserrat), sans-serif;
--font-accent: var(--font-cormorant), serif;
/* --font-anton has no abstraction */
/* --font-mono does not exist */
```

### 2B. Sizes — every distinct value found

**CSS-var tokens (defined, used inconsistently):**
`--text-xs: 0.72rem`, `--text-sm: 0.85rem`, `--text-base: 1rem`, `--text-btn: 0.92rem`,
`--text-lg: clamp(0.95rem, 1.15vw, 1.1rem)`, `--text-xl: clamp(1.05rem, 1.3vw, 1.25rem)`.

**Raw rem values (count of distinct values found in components/pages): 60+**
0.54, 0.58, 0.6, 0.62, 0.64, 0.65, 0.66, 0.68, 0.7, 0.72, 0.74, 0.75, 0.76, 0.78, 0.8, 0.82, 0.84, 0.85, 0.86, 0.88, 0.9, 0.92, 0.94, 0.95, 0.96, 0.98, 1, 1.02, 1.05, 1.08, 1.1, 1.15, 1.18, 1.2, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.75, 1.85, 1.9, 1.95, 2, 2.1, 2.15, 2.2, 2.4 — **plus** `0.62em`, `0.68em`, `0.88em`, `2em`, `18px`, `0.9rem`, `16px`.

**Clamp pairs in use (15 distinct):**

- `clamp(2.2rem, 4.5vw, 3.4rem)` — `section-title` (global)
- `clamp(0.9rem, 1.1vw, 1.05rem)` — `section-sub` (global)
- `clamp(2rem, 3.8vw, 3.2rem)` — `home-hero__heading`, `coming-soon`
- `clamp(0.95rem, 1.2vw, 1.1rem)` — `home-hero__sub`, `coming-soon`
- `clamp(2.2rem, 4vw, 3.4rem)` — `anatomy__h2`
- `clamp(2.4rem, 4.6vw, 3.6rem)` — `apps/index`, `blog/[...slug]` H1
- `clamp(2.4rem, 4.8vw, 3.8rem)` — `blog/index` H1
- `clamp(2.4rem, 5vw, 4.6rem)` — `prompts/[...slug]` H1
- `clamp(2rem, 4.2vw, 3.6rem)` — `prompts/[...slug]` secondary
- `clamp(2rem, 4vw, 3rem)` — `apps/empty`, `prompts/empty`, `apps/stacks/[...slug]` H1
- `clamp(2.8rem, 5.6vw, 4.6rem)` — `home-pricing__h2`, `toolkit__h2`, `roster__h2` (Anton)
- `clamp(2.4rem, 4.6vw, 4rem)` — `HomeThesis` H2
- `clamp(3.4rem, 5.4vw, 4.8rem)` — `home-pricing__price-value` (Anton)
- `clamp(1.8rem, 3.2vw, 2.6rem)` — `PromptHubHero`, `blog/[...slug]` related-h2
- `clamp(1.6rem, 3vw, 2.3rem)` — `vault/CTABar`
- `clamp(3.6rem, 7vw, 7.4rem)` — `StudioHero` h1
- `clamp(3rem, 7vw, 5.6rem)` — `StudioHero` mobile h1
- `clamp(2rem, 10.2vw, 3.8rem)` — `StudioHero` (yet another)
- `clamp(6rem, 20vw, 10rem)` — 404 numerals
- `clamp(1.6rem, 4dvh, 4rem)` — `Navbar` mobile menu link (different unit `dvh`)
- `clamp(0.78rem, 1.4dvh, 1rem)` — `Navbar` mobile menu sub (`dvh`)

The `vw`/`dvh` mix means typography rescales differently on mobile depending on whether you are inside the navbar or the body.

### 2C. Weights — distribution

| Value                   | Count             | Notes                                              |
| ----------------------- | ----------------- | -------------------------------------------------- |
| `400` (`--fw-regular`)  | ~25 raw + ~10 var | mostly Anton + Cormorant                           |
| `500`                   | ~80 raw           | the "default subdued" weight, never tokenised      |
| `600` (`--fw-semibold`) | ~80 var + ~25 raw | mixed both ways across single components           |
| `700` (`--fw-bold`)     | 4 var + 1 raw     | rare                                               |
| `800` (`--fw-black`)    | 4 var + 1 raw     | only StudioHero, CategoryPage, 404, StudioShowcase |

**There is no `--fw-medium: 500` token even though 500 is the most-used raw weight in the codebase.**

### 2D. Letter-spacing — distribution

| Range          | Use                             | Sample values                                                                                    |
| -------------- | ------------------------------- | ------------------------------------------------------------------------------------------------ |
| Negative       | display H1/H2 (visual condense) | `-0.005`, `-0.01`, `-0.015`, `-0.018`, `-0.02`, `-0.025`, `-0.03`, `-0.04`, `-0.045`, `-0.06` em |
| 0 / `0.005em`  | Anton h2 (technically nominal)  | `0.005em`                                                                                        |
| Eyebrow / caps | uppercase pills + mono labels   | `0.04`, `0.05`, `0.08`, `0.09`, `0.1`, `0.12`, `0.14`, `0.15`, `0.16`, `0.18`, `0.2`, `0.22` em  |

That's 22 distinct letter-spacing values for what should be ~5 roles.

### 2E. Line-heights — token vs. raw

Tokens defined: `--lh-tight: 1`, `--lh-heading: 1.15`, `--lh-ui: 1.3`, `--lh-body: 1.6`, `--lh-reading: 1.7`.

Raw values found in components: `0.92`, `0.96`, `1.04`, `1.08`, `1.1`, `1.15`, `1.2`, `1.25`, `1.3`, `1.35`, `1.4`, `1.45`, `1.5`, `1.55`, `1.6`, `1.65`, `1.7`, `1.75`. **At least 18 raw line-heights** in active use; tokens are referenced only in `global.css`, `Layout.astro`, and `HomeHero`.

### 2F. Roles in active use (intended → actual)

| Role                 | Intended font       | Actual fonts seen                                                                                                         |
| -------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Display H1 (hero)    | Cormorant           | Cormorant (HomeHero), Cormorant (StudioHero h1), `--font-accent` (apps/blog), Anton (HomeToolkit/Pricing/Roster)          |
| Section H2           | Cormorant           | Cormorant (Anatomy, section-title), Cormorant (PromptHubHero), Anton (Pricing/Toolkit/Roster), Inter (PostCard secondary) |
| Eyebrow / kicker     | Inter `--text-xs`   | Inter+`var(--text-xs)`, Inter raw `0.7-0.84rem`, Mono `0.6-0.74rem`, `tag-pill`                                           |
| Body                 | Inter `--text-base` | Inter raw 0.86–1.05rem (no var)                                                                                           |
| Lead/sub paragraph   | Inter `--text-lg`   | Inter raw 0.92–1.18rem (no var), one clamp variant                                                                        |
| Mono label / badge   | (no token)          | Mono stack hard-coded 40+ times                                                                                           |
| Italic emphasis      | Cormorant italic    | Cormorant italic (correct), but inline literal `'Cormorant Garamond'` fallback in 6 home components                       |
| Button text          | Inter `--text-btn`  | Mostly correct, except button-like elements in BuyModal/PriceCard use raw `0.84-0.92rem`                                  |
| Caption / micro-text | (no token)          | Inter raw 0.66–0.76rem in vault, promptHub                                                                                |

---

## 3. Drift incidents — concrete file:line pairs

### 3.1 Hard-coded `'Anton'` stacks bypassing Astro Fonts

`'Anton', 'Montserrat', 'Inter', sans-serif` — the `--font-anton` cssVariable is never referenced.

- `src/components/home/HomePricing.astro:202, 274, 301, 309, 338`
- `src/components/home/HomeToolkit.astro:257, 361`
- `src/components/home/HomeRoster.astro:203, 326`

### 3.2 Hard-coded `'Cormorant Garamond'` fallback (already covered by `var(--font-accent)`)

Pattern `var(--font-accent), 'Cormorant Garamond', serif` — the literal string is redundant once Astro injects the @font-face.

- `src/components/home/HomeThesis.astro:184, 220, 317`
- `src/components/home/HomeRoster.astro:212, 336`
- `src/components/home/HomePricing.astro:212` (with `var(--font-cormorant)` directly — bypasses `--font-accent`)
- `src/components/blog/EmphasisText.astro:30` (`var(--font-accent), Georgia, serif`)

### 3.3 Hard-coded mono stack (no `--font-mono` token)

40+ occurrences of `font-family: ui-monospace, 'SF Mono', Menlo, monospace;` across:

- `src/components/home/HomeAnatomy.astro:317, 382, 422, 437, 455, 523`
- `src/components/home/HomePricing.astro:192, 317, 414`
- `src/components/home/HomeRoster.astro:193, 238, 246, 296, 369, 387`
- `src/components/home/HomeThesis.astro:133, 147, 172, 211, 248, 256, 286, 298, 308, 340`
- `src/components/home/HomeToolkit.astro:247, 318, 329, 370`
- `src/components/promptHub/ArtifactCard.astro:129, 143, 178, 197, 212`
- `src/components/promptHub/BuyModal.astro` (mono variants)
- `src/components/vault/DeepFilterBar.astro:293`
- `src/pages/prompts/[...slug].astro:485, 500, 513, 603, 696, 732, 778, 836, 865`
- `src/pages/apps/[...slug].astro:437, 553`
- `src/pages/apps/stacks/[...slug].astro:668, 702`
- `src/pages/blog/[...slug].astro:317, 327`
- `src/components/blog/Avatar.astro:33`
- `src/pages/prompts/index.astro:358, 413`

### 3.4 Same role, different font/size — homepage display split

| Class                     | File:line                                       | Font             | Size                                | LS        |
| ------------------------- | ----------------------------------------------- | ---------------- | ----------------------------------- | --------- |
| `.section-title`          | `src/styles/global.css:211-216`                 | accent           | `clamp(2.2rem, 4.5vw, 3.4rem)` @600 | (none)    |
| `.home-hero__heading`     | `src/components/home/HomeHero.astro:88-94`      | accent           | `clamp(2rem, 3.8vw, 3.2rem)` @600   | (none)    |
| `.anatomy__h2`            | `src/components/home/HomeAnatomy.astro:272-280` | accent           | `clamp(2.2rem, 4vw, 3.4rem)` @400   | `-0.02em` |
| `.toolkit__h2`            | `src/components/home/HomeToolkit.astro:254-264` | **Anton**        | `clamp(2.8rem, 5.6vw, 4.6rem)` @400 | `0.005em` |
| `.home-pricing__h2`       | `src/components/home/HomePricing.astro:200-209` | **Anton**        | `clamp(2.8rem, 5.6vw, 4.6rem)` @400 | `0.005em` |
| `.home-roster__h2`        | `src/components/home/HomeRoster.astro:200-208`  | **Anton**        | `clamp(2.8rem, 5.6vw, 4.6rem)` @400 | `0.005em` |
| `.home-thesis__h2`        | `src/components/home/HomeThesis.astro:218-226`  | accent           | `clamp(2.4rem, 4.6vw, 4rem)` @400   | `-0.02em` |
| `.featured-post__title`   | `src/components/blog/FeaturedPost.astro:83-89`  | accent           | `clamp(2rem, 3.2vw, 2.8rem)` @600   | `-0.01em` |
| `.blog-index-hero__title` | `src/pages/blog/index.astro:122-127`            | accent           | `clamp(2.4rem, 4.8vw, 3.8rem)` @600 | `-0.01em` |
| `.studio-hero__title`     | `src/components/StudioHero.astro:134-136`       | (`--font-brand`) | `clamp(3.6rem, 7vw, 7.4rem)` @800   | `-0.06em` |
| `.category-h1`            | `src/components/CategoryPage.astro:45-53`       | accent           | `clamp(3rem, 10vw, 6rem)` @800      | `-0.04em` |

11 H2/H1 declarations. 3 different fonts. 8 different clamp pairs. 4 different weights. 6 different letter-spacings.

### 3.5 Eyebrow drift — same intent, completely different specs

| Class                        | File:line                                             | Font | Size                   | Weight | LS                     |
| ---------------------------- | ----------------------------------------------------- | ---- | ---------------------- | ------ | ---------------------- |
| `.section-eyebrow`           | `global.css:201-208`                                  | main | `--text-sm`            | 400    | (none)                 |
| `.tag-pill`                  | `global.css:232-242`                                  | main | `--text-xs`            | 600    | 0.22em                 |
| `.home-hero__eyebrow`        | `HomeHero.astro:79-86`                                | main | `--text-xs`            | 600    | 0.15em                 |
| `.anatomy__eyebrow`          | `HomeAnatomy.astro:263-271`                           | main | `0.7rem`               | 600    | 0.22em                 |
| `.home-pricing__eyebrow`     | `HomePricing.astro:190-198`                           | mono | `0.72rem`              | 500    | 0.18em                 |
| `.toolkit__eyebrow`          | `HomeToolkit.astro:245-253`                           | mono | `0.72rem`              | 500    | 0.18em                 |
| `.home-roster__eyebrow`      | `HomeRoster.astro:193-198`                            | mono | `0.72rem`              | 500    | 0.18em                 |
| `.home-thesis` various       | `HomeThesis.astro:133-136, 147-150, 211-214, 248-251` | mono | `0.6/0.62/0.66/0.7rem` | 500    | `0.16/0.18/0.2/0.22em` |
| `.vault-eyebrow`             | `vault/Eyebrow.astro:16-19`                           | main | `--text-xs`            | 600    | 0.15em                 |
| `.coming-soon__eyebrow`      | `coming-soon.astro:85-88`                             | main | `--text-xs`            | 600    | 0.15em                 |
| `.apps/index hero eyebrow`   | `apps/index.astro:163, 168`                           | main | `0.78rem`              | 600    | (varies)               |
| `.prompts/[...slug] eyebrow` | `prompts/[...slug].astro:471-473`                     | main | `0.65rem`              | 600    | 0.18em                 |
| `.featured-post__meta`       | `blog/FeaturedPost.astro:100`                         | main | n/a                    | 600    | n/a                    |
| `.tab-meta` etc              | `blog/Meta.astro:31-34`, `blog/MonoLabel.astro:19-22` | main | `--text-xs`            | 600    | 0.15em                 |

Same role → 4 fonts, 9+ sizes, 3 weights, 8+ letter-spacings.

### 3.6 Variables defined but barely used

- `--text-base` — used 3 times: `CategoryPage:57`, `vault/CTABar:65`, `blog/[...slug]:471`. Most "1rem" body text is hard-coded.
- `--text-lg` (`clamp(0.95rem, 1.15vw, 1.1rem)`) — never referenced anywhere outside `global.css`.
- `--text-xl` (`clamp(1.05rem, 1.3vw, 1.25rem)`) — never referenced anywhere outside `global.css`.
- `--lh-ui`, `--lh-reading` — never referenced outside `global.css`.

### 3.7 Navbar uses raw weights instead of tokens

`src/components/Navbar.astro:320, 364, 579, 613, 704, 772, 801, 873` all use raw `font-weight: 700/600` instead of `var(--fw-bold)`/`var(--fw-semibold)`. Same family — `Navbar.astro:1003, 1004` mixes raw `font-size: 0.92rem` with raw `letter-spacing: 0.1em` while `--text-btn` exists for that exact purpose.

### 3.8 Inline-italic fallback duplication

`'Cormorant Garamond'` appears as a literal string in:
`HomeRoster.astro:212`, `HomeRoster.astro:336`, `HomeThesis.astro:184`, `HomeThesis.astro:220`, `HomeThesis.astro:317`, `HomePricing.astro:212` — all places that should just use `var(--font-accent)` (which already chains a serif fallback).

### 3.9 `dvh` used for clamp() in Navbar mobile menu only

`Navbar.astro:577, 591, 703, 711, 770, 784, 972, 977` use `clamp(.., dvh, ..)` while the rest of the app uses `vw`. Consequence: when keyboard is open on mobile or when address bar collapses, navbar text rescales but body text doesn't, producing a visible jump.

### 3.10 404 page typography is fully ad-hoc

`src/pages/404.astro:39, 50, 57` define `font-size: clamp(6rem, 20vw, 10rem)`, `clamp(1.5rem, 4vw, 2rem)`, `1rem` with raw `font-weight: 800/600` and `letter-spacing: -0.04em/-0.02em`. No tokens used.

---

## 4. Proposed typography template (copy-pasteable)

```css
/* ---------------------------------------------------------------------- */
/*  TYPOGRAPHY TOKENS — single source of truth                            */
/* ---------------------------------------------------------------------- */
:root {
	/* ── Families ────────────────────────────────────────────────────── */
	--font-main: var(--font-inter), system-ui, -apple-system, sans-serif;
	--font-brand: var(--font-montserrat), Inter, sans-serif;
	--font-accent: var(--font-cormorant), Georgia, serif;
	--font-display: var(--font-anton), 'Montserrat', Inter, sans-serif; /* NEW */
	--font-mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; /* NEW */

	/* ── Weights ─────────────────────────────────────────────────────── */
	--fw-regular: 400;
	--fw-medium: 500; /* NEW — most-used raw weight in codebase */
	--fw-semibold: 600;
	--fw-bold: 700;
	--fw-black: 800;

	/* ── Line heights ────────────────────────────────────────────────── */
	--lh-tight: 1;
	--lh-display: 1.04; /* NEW — Anton-style condensed */
	--lh-heading: 1.15;
	--lh-ui: 1.3;
	--lh-body: 1.6;
	--lh-reading: 1.7;

	/* ── Letter spacing ──────────────────────────────────────────────── */
	--ls-display: -0.02em; /* H1 condensed */
	--ls-heading: -0.01em; /* H2 cormorant */
	--ls-anton: 0.005em; /* Anton h2 (almost-zero) */
	--ls-tight: -0.005em; /* body-rich tracking */
	--ls-button: 0.04em; /* uppercase button text */
	--ls-eyebrow: 0.15em; /* default kicker */
	--ls-eyebrow-tight: 0.12em; /* compact kicker */
	--ls-mono: 0.16em; /* mono-label ALL CAPS */
	--ls-pill: 0.22em; /* shoutiest pill */

	/* ── Sizes (ramp) ────────────────────────────────────────────────── */
	--text-3xs: 0.62rem; /* micro-label */
	--text-2xs: 0.7rem; /* mono kicker */
	--text-xs: 0.78rem; /* eyebrow / caption */
	--text-sm: 0.85rem; /* small body */
	--text-base: 1rem; /* body */
	--text-btn: 0.92rem; /* button text */
	--text-md: clamp(0.95rem, 1.15vw, 1.1rem); /* lede / sub */
	--text-lg: clamp(1.05rem, 1.3vw, 1.25rem); /* big lede */
	--text-xl: clamp(1.35rem, 2vw, 1.6rem); /* section subhead */
	--text-2xl: clamp(1.65rem, 2.6vw, 2.1rem); /* small h2 */
	--text-3xl: clamp(2rem, 3.2vw, 2.6rem); /* h2 */
	--text-4xl: clamp(2.4rem, 4.6vw, 3.6rem); /* h1 */
	--text-display: clamp(2.8rem, 5.6vw, 4.6rem); /* hero / Anton h2 */
	--text-mega: clamp(3.6rem, 7vw, 7.4rem); /* studio hero */
}

/* ---------------------------------------------------------------------- */
/*  ROLE CLASSES — apply once, override never                             */
/* ---------------------------------------------------------------------- */

/* Display family — Anton, hero loud */
.t-display-mega {
	font-family: var(--font-display);
	font-weight: var(--fw-regular);
	font-size: var(--text-mega);
	line-height: var(--lh-display);
	letter-spacing: var(--ls-anton);
	text-transform: uppercase;
	color: var(--color-text-main);
}
.t-display-xl {
	font-family: var(--font-display);
	font-weight: var(--fw-regular);
	font-size: var(--text-display);
	line-height: var(--lh-display);
	letter-spacing: var(--ls-anton);
	text-transform: uppercase;
	color: var(--color-text-main);
}
.t-display-xl-em {
	/* serif italic accent inside Anton */
	font-family: var(--font-accent);
	font-style: italic;
	font-weight: var(--fw-regular);
	font-size: 0.62em;
	letter-spacing: -0.02em;
	text-transform: lowercase;
	color: var(--color-brand-cyan);
}

/* Heading family — Cormorant, editorial */
.t-h1 {
	font-family: var(--font-accent);
	font-weight: var(--fw-semibold);
	font-size: var(--text-4xl);
	line-height: var(--lh-heading);
	letter-spacing: var(--ls-heading);
	color: var(--color-text-main);
}
.t-h2 {
	font-family: var(--font-accent);
	font-weight: var(--fw-regular);
	font-size: var(--text-3xl);
	line-height: var(--lh-heading);
	letter-spacing: var(--ls-heading);
	color: var(--color-text-main);
}
.t-h3 {
	font-family: var(--font-accent);
	font-weight: var(--fw-semibold);
	font-size: var(--text-2xl);
	line-height: var(--lh-heading);
	letter-spacing: var(--ls-tight);
	color: var(--color-text-main);
}
.t-h2 em,
.t-h3 em {
	font-style: italic;
	color: var(--color-brand-cyan);
}

/* Eyebrows / kickers */
.t-eyebrow {
	font-family: var(--font-main);
	font-size: var(--text-xs);
	font-weight: var(--fw-semibold);
	letter-spacing: var(--ls-eyebrow);
	text-transform: uppercase;
	color: var(--color-brand-cyan);
}
.t-mono-label {
	font-family: var(--font-mono);
	font-size: var(--text-2xs);
	font-weight: var(--fw-medium);
	letter-spacing: var(--ls-mono);
	text-transform: uppercase;
	color: var(--color-text-muted);
}
.t-mono-tag {
	font-family: var(--font-mono);
	font-size: var(--text-3xs);
	font-weight: var(--fw-medium);
	letter-spacing: var(--ls-mono);
	text-transform: uppercase;
	color: var(--color-brand-cyan);
}

/* Body */
.t-lede {
	font-family: var(--font-main);
	font-size: var(--text-md);
	font-weight: var(--fw-regular);
	line-height: var(--lh-body);
	color: var(--color-text-muted);
}
.t-body {
	font-family: var(--font-main);
	font-size: var(--text-base);
	font-weight: var(--fw-regular);
	line-height: var(--lh-body);
	color: var(--color-text-main);
}
.t-body-sm {
	font-family: var(--font-main);
	font-size: var(--text-sm);
	font-weight: var(--fw-regular);
	line-height: var(--lh-body);
	color: var(--color-text-muted);
}

/* UI atoms */
.t-button {
	font-family: var(--font-main);
	font-size: var(--text-btn);
	font-weight: var(--fw-semibold);
	letter-spacing: var(--ls-button);
	text-transform: uppercase;
	line-height: var(--lh-ui);
}
.t-caption {
	font-family: var(--font-main);
	font-size: var(--text-3xs);
	font-weight: var(--fw-regular);
	line-height: var(--lh-ui);
	color: var(--color-text-dim);
}
.t-italic-quote {
	font-family: var(--font-accent);
	font-style: italic;
	font-weight: var(--fw-regular);
	letter-spacing: var(--ls-tight);
}

/* Code / mono */
.t-mono-code {
	font-family: var(--font-mono);
	font-size: 0.88em; /* relative to context */
	letter-spacing: 0;
}
```

### Layout-level wiring (Layout.astro)

Add a `<Font cssVariable="--font-anton" />` tag — currently Anton is registered in `astro.config.mjs` but never emitted by `<Font>`. Without this tag, the `--font-anton` CSS variable resolves to nothing.

---

## 5. Migration map — every existing class → new token

### Display / H1 / H2

| Existing class              | File                           | New role                                                                                               | Notes                                                         |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `.section-title`            | `global.css:211`               | `.t-h2`                                                                                                | already accent, just consolidate                              |
| `.home-hero__heading`       | `HomeHero.astro:88`            | `.t-h1`                                                                                                | currently `clamp(2rem, 3.8vw, 3.2rem)` — bump to `--text-4xl` |
| `.anatomy__h2`              | `HomeAnatomy.astro:272`        | `.t-h2`                                                                                                | drop `letter-spacing:-0.02em`                                 |
| `.toolkit__h2`              | `HomeToolkit.astro:254`        | `.t-display-xl`                                                                                        | uses Anton — convert to `--font-display`                      |
| `.home-pricing__h2`         | `HomePricing.astro:200`        | `.t-display-xl`                                                                                        | same                                                          |
| `.home-roster__h2`          | `HomeRoster.astro:200`         | `.t-display-xl`                                                                                        | same                                                          |
| `.home-thesis__h2`          | `HomeThesis.astro:218`         | `.t-h1` (decision needed: editorial or display)                                                        |
| `.featured-post__title`     | `blog/FeaturedPost.astro:83`   | `.t-h2`                                                                                                |
| `.post-card__title` (large) | `blog/PostCard.astro:111-113`  | `.t-h3`                                                                                                |
| `.blog-index-hero__title`   | `blog/index.astro:122`         | `.t-h1`                                                                                                |
| `.studio-hero__title`       | `StudioHero.astro:134`         | `.t-display-mega` — but keep brand font (Montserrat); add a `.t-display-mega--brand` variant if needed |
| `.category-h1`              | `CategoryPage.astro:45`        | `.t-display-mega` (accent variant)                                                                     |
| `.error-404__numerals`      | `404.astro:39`                 | `.t-display-mega`                                                                                      |
| `.coming-soon__title`       | `coming-soon.astro:94`         | `.t-h1`                                                                                                |
| `.prompt-hub-hero__title`   | `PromptHubHero.astro:263`      | `.t-h2`                                                                                                |
| `.prompts-detail__title` h1 | `prompts/[...slug].astro:493`  | `.t-h1` (or display variant)                                                                           |
| `.apps-index-hero__title`   | `apps/index.astro:115`         | `.t-h1`                                                                                                |
| `.apps-detail__title`       | `apps/[...slug].astro:312-318` | `.t-h1`                                                                                                |
| `.cta-bar__title`           | `vault/CTABar.astro:54`        | `.t-h3`                                                                                                |

### Eyebrows / kickers / mono labels

| Existing class                     | File                                                              | New role                                               |
| ---------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| `.section-eyebrow`                 | `global.css:201`                                                  | `.t-eyebrow` (re-spec)                                 |
| `.tag-pill`                        | `global.css:232`                                                  | `.t-eyebrow` + `.is-pill` modifier (background/border) |
| `.home-hero__eyebrow`              | `HomeHero.astro:79`                                               | `.t-eyebrow`                                           |
| `.anatomy__eyebrow`                | `HomeAnatomy.astro:263`                                           | `.t-eyebrow`                                           |
| `.home-pricing__eyebrow`           | `HomePricing.astro:190`                                           | `.t-mono-tag`                                          |
| `.toolkit__eyebrow`                | `HomeToolkit.astro:245`                                           | `.t-mono-tag`                                          |
| `.home-roster__eyebrow`            | `HomeRoster.astro:193`                                            | `.t-mono-tag`                                          |
| `.home-thesis__*` mono kickers     | `HomeThesis.astro:133/147/172/211/248/256/286/298/308/340`        | `.t-mono-label` (some) / `.t-mono-tag` (smaller)       |
| `.toolkit__year` / `.toolkit__idx` | `HomeToolkit.astro:313/325`                                       | `.t-mono-label`                                        |
| `.home-pricing__price-unit`        | `HomePricing.astro:316`                                           | `.t-mono-label`                                        |
| `.vault-eyebrow`                   | `vault/Eyebrow.astro:16`                                          | `.t-eyebrow`                                           |
| `.coming-soon__eyebrow`            | `coming-soon.astro:85`                                            | `.t-eyebrow`                                           |
| `.blog-meta` etc                   | `blog/Meta.astro`, `blog/MonoLabel.astro`, `blog/TOC.astro:31-34` | `.t-eyebrow`                                           |
| `.featured-post__meta`             | `blog/FeaturedPost.astro:100`                                     | `.t-mono-label`                                        |
| `.artifact-card__kicker`           | `promptHub/ArtifactCard.astro:108-111`                            | `.t-eyebrow`                                           |
| `.artifact-card__index`            | `promptHub/ArtifactCard.astro:128-131`                            | `.t-mono-label`                                        |
| `.tested-card`                     | `promptHub/TestedCard.astro:44`                                   | `.t-mono-label`                                        |
| `.author-chip__role`               | `promptHub/AuthorChip.astro:34`                                   | `.t-mono-tag`                                          |
| `.type-badge`                      | `promptHub/TypeBadge.astro:22-24`                                 | `.t-mono-tag`                                          |
| `.price-tag__label`                | `promptHub/PriceTag.astro:23-25`                                  | `.t-mono-tag`                                          |
| `.deep-filter-bar__label`          | `vault/DeepFilterBar.astro:194-198`                               | `.t-mono-label`                                        |
| `.tag-pill--vault`                 | `vault/TagPill.astro`                                             | `.t-mono-tag` (if uppercase)                           |
| `.freq-dot`                        | `vault/FreqDot.astro`                                             | `.t-mono-tag`                                          |
| `.fact-block__label`               | `vault/FactBlock.astro:39-42`                                     | `.t-mono-tag`                                          |

### Lede / body / sub

| Existing class              | File                           | New role                                          |
| --------------------------- | ------------------------------ | ------------------------------------------------- |
| `.section-sub`              | `global.css:222`               | `.t-lede`                                         |
| `.home-hero__sub`           | `HomeHero.astro:143`           | `.t-lede`                                         |
| `.anatomy__lede`            | `HomeAnatomy.astro:285`        | `.t-lede`                                         |
| `.toolkit__lede`            | `HomeToolkit.astro:273`        | `.t-lede`                                         |
| `.home-pricing__sub`        | `HomePricing.astro:283`        | `.t-lede`                                         |
| `.home-thesis__lede` family | `HomeThesis.astro:184/220/317` | `.t-lede` or `.t-italic-quote` (decision per use) |
| `.featured-post__excerpt`   | `blog/FeaturedPost.astro:112`  | `.t-body-sm`                                      |
| `.post-card__excerpt`       | `blog/PostCard.astro:133`      | `.t-body-sm`                                      |
| `.blog-index-hero__sub`     | `blog/index.astro:140`         | `.t-lede`                                         |
| `.studio-cta__sub`          | `StudioCTA.astro:122`          | `.t-body-sm`                                      |
| `.coming-soon__sub`         | `coming-soon.astro:110`        | `.t-lede`                                         |
| `.apps-empty__lede`         | `apps/empty.astro:104`         | `.t-lede`                                         |
| `.apps-detail__lede`        | `apps/[...slug].astro:332`     | `.t-lede`                                         |
| `.prompts-detail__lede`     | `prompts/[...slug].astro:521`  | `.t-lede`                                         |

### Buttons

| Existing class                    | File                            | New role                                         |
| --------------------------------- | ------------------------------- | ------------------------------------------------ |
| `.btn-ghost`                      | `global.css:245`                | `.t-button` + structural styles                  |
| `.home-hero__cta`                 | `HomeHero.astro:158`            | `.t-button`                                      |
| `.home-pricing__cta`              | `HomePricing.astro:331`         | `.t-button` + `.t-display-xl`-styled? (decision) |
| `.coming-soon__cta`               | `coming-soon.astro:152`         | `.t-button`                                      |
| `.cal-dialog__back`               | `Layout.astro:303`              | `.t-button` (small variant)                      |
| `.studio-cta__btn`                | `StudioCTA.astro:82-84`         | `.t-button`                                      |
| `.cta-bar__btn`                   | `vault/CTABar.astro:74-77`      | `.t-button`                                      |
| `.action-pill`                    | `vault/ActionPill.astro:73-75`  | `.t-button` (small)                              |
| `.navbar-*-cta` (700/600 weights) | `Navbar.astro:319-321, 363-364` | `.t-button` (with brand font variant)            |

### Italic emphasis / quote

| Existing class                  | File                                                                   | New role           |
| ------------------------------- | ---------------------------------------------------------------------- | ------------------ |
| `.emphasis-text`                | `blog/EmphasisText.astro:30-33`                                        | `.t-italic-quote`  |
| `.toolkit__h2-em`               | `HomeToolkit.astro:265-272`                                            | `.t-display-xl-em` |
| `.home-pricing__h2-em`          | `HomePricing.astro:211-218`                                            | `.t-display-xl-em` |
| `.home-roster__h2-em` (similar) | `HomeRoster.astro:212-216`                                             | `.t-display-xl-em` |
| `.italic` (promptHub)           | `promptHub/Italic.astro:11-12`                                         | `.t-italic-quote`  |
| `.title-with-accent__accent`    | `vault/TitleWithAccent.astro:29-32`, `promptHub/TitleWithAccent.astro` | `.t-italic-quote`  |

### Code blocks

| Existing class           | File                              | New role       |
| ------------------------ | --------------------------------- | -------------- |
| `.prompt-code-block`     | `promptHub/PromptCodeBlock.astro` | `.t-mono-code` |
| `.file-tree`             | `promptHub/FileTree.astro`        | `.t-mono-code` |
| `.install-tabs__code`    | `promptHub/InstallTabs.astro`     | `.t-mono-code` |
| `inline code` (blog mdx) | `blog/[...slug].astro:317, 327`   | `.t-mono-code` |

---

## 6. Top 10 ranked fixes (S/M/L effort)

| #   | Fix                                                                                                                                                                                                                                                                                                                 | Effort | Impact                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Add `--font-mono` and `--font-display` CSS vars in `global.css`; add `<Font cssVariable="--font-anton" />` in `Layout.astro` head.** Without this, the existing `--font-anton` registration in `astro.config.mjs` is dead weight — Astro registers the family but never emits the `@font-face`.                   | **S**  | High — instantly fixes a registered-but-unused asset and makes the next migrations possible.                                  |
| 2   | **Replace 40+ hard-coded `ui-monospace, 'SF Mono', Menlo, monospace` with `var(--font-mono)`.** Pure search-and-replace; zero visual change.                                                                                                                                                                        | **S**  | Medium — removes the largest single source of duplication.                                                                    |
| 3   | **Add `--fw-medium: 500` token and replace ~80 raw `font-weight: 500;` declarations.** Most-used weight in codebase has no token.                                                                                                                                                                                   | **S**  | Medium — token hygiene; touches every "500" call site.                                                                        |
| 4   | **Unify the `home-pricing__h2`, `toolkit__h2`, `home-roster__h2` declarations** into a single `.t-display-xl` class (or one `.toolkit-display` shared partial). Currently three byte-identical declarations live in three files.                                                                                    | **S**  | Medium — DRY win, but needs structural class re-spec in three components.                                                     |
| 5   | **Pick ONE display direction for the homepage:** either Anton dominates (HomeHero/HomeAnatomy/HomeThesis migrate to Anton) or Cormorant dominates (HomePricing/HomeToolkit/HomeRoster migrate to Cormorant). Both stacked on one page reads as two unrelated sites. **Decision required from Rahul before action.** | **M**  | High — this is the visible drift, biggest brand-cohesion lever.                                                               |
| 6   | **Consolidate the eyebrow zoo into `.t-eyebrow` + `.t-mono-label` + `.t-mono-tag`.** ~25 components have ad-hoc eyebrow specs.                                                                                                                                                                                      | **M**  | High — eyebrows are the most repeated micro-element on the site.                                                              |
| 7   | **Fix the seven literal `'Cormorant Garamond'` fallback strings** that follow `var(--font-accent)` (already chains a serif fallback). Cosmetic but signals "two engineers wrote this differently".                                                                                                                  | **S**  | Low.                                                                                                                          |
| 8   | **Bring Navbar `font-weight: 600/700` and `letter-spacing: 0.04em` to `var(--fw-semibold)/var(--ls-button)` tokens.** 8 raw call sites.                                                                                                                                                                             | **S**  | Low–Medium.                                                                                                                   |
| 9   | **Adopt the size ramp `--text-3xs … --text-mega`** and migrate the ~60 raw rem values into the closest ramp token. Run as a sweep one component-folder at a time (`vault/`, then `promptHub/`, then `home/`, then pages).                                                                                           | **L**  | Highest long-term — reduces the size space from ~60 values to ~13 ramp tokens, eliminating typographic shimmer between cards. |
| 10  | **Decide on `vw` vs `dvh` for fluid type and pick one.** Currently Navbar uses `dvh`, the rest uses `vw`. Either commit to `dvh` everywhere (better for keyboard-up mobile) or kill the navbar overrides.                                                                                                           | **M**  | Medium — affects mobile-only behaviour; users likely don't notice but it's a latent foot-gun.                                 |

---

## Notes & caveats

- Audit covered: `src/styles/`, `src/layouts/Layout.astro`, all `.astro` under `src/components/{home,promptHub,vault,blog}` plus `Footer/Navbar/StudioHero/StudioFAQ/StudioShowcase/StudioCTA/StudioProcess/CategoryPage/CustomCursor`, all `.astro` under `src/pages/**`, plus `astro.config.mjs`. There is **no `colors_and_type.css`** — only `global.css`. Codex couldn't find this file because it doesn't exist; design tokens live in `global.css:33-124`.
- Counts (`~25`, `~80`, etc.) are approximate from grep — exact distribution can be re-derived from the files in `C:\Users\junej\.claude\projects\C--Users-junej-Desktop-NexAI-Labs-Website\dd28e97e-147f-457b-85db-2904daf4e2af\tool-results\` if needed.
- Source code was **not modified**.
- Recommendation: pair this report with the existing `04-exhaustive.md` audit before proposing the migration sweep — some "drift" may be intentional differentiation (e.g. mono vs sans for vault vs blog).

---

_End of audit. File path: `C:\Users\junej\Desktop\NexAI Labs\Website\audits\05-typography-opus.md`_
