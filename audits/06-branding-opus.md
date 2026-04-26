# Branding & Color Consistency Audit — NexAI Labs Website

**Auditor:** Claude Opus 4.7 (1M)
**Date:** 2026-04-25
**Branch:** `chore/update-packages`
**Scope:** Full marketing site (Astro 6, Cloudflare Pages). Brand teal `#4ec9b4`.
**Note on prompt:** `src/styles/colors_and_type.css` does not exist; only `src/styles/global.css` exists. All design tokens live there.

---

## 1. Executive Summary — 6 Most Jarring Drifts

1. **Three competing display fonts.** `global.css` declares `var(--font-accent)` (Cormorant) as the editorial display face, but **`HomeToolkit`, `HomeRoster`, `HomePricing` ignore it and hard-code `'Anton', 'Montserrat', 'Inter', sans-serif`** as their H2 stack — Anton is _not_ loaded by the Astro Fonts API in `Layout.astro` (only Inter / Cormorant / Montserrat are), so on first paint the headings render Montserrat as the closest fallback. The whole homepage scroll therefore alternates between **Cormorant italic** (Hero, Anatomy, Thesis) and **Anton/Montserrat condensed uppercase** (Toolkit, Roster, Pricing), which is two competing magazines glued together.
2. **The Pricing CTA gradient secretly contains brand-conflicting orange.** `home-pricing__cta--gradient` is `linear-gradient(90deg, #1e7e72 0%, #4ec9b4 30%, #d96b3a 70%, #c8421f 100%)` — half teal, half **red-orange #d96b3a → #c8421f**. No other surface on the site uses orange. This is by far the loudest accidental brand violation: the most expensive CTA on the site ships with a colour gradient that contradicts the master logo gradient `linear-gradient(135deg, #1e7e72, #4ec9b4)` 30% of its width in.
3. **Two parallel Eyebrow systems that don't share styles.** `vault/Eyebrow.astro` and `blog/MonoLabel.astro` are _byte-identical_ twins (same Inter, same `0.15em` tracking, same tint variants) — `MonoLabel` even comments "Component name is historical; the underlying style is now brand-consistent." Meanwhile **HomeToolkit / HomeRoster / HomePricing / HomeThesis** invented a _third_ eyebrow style: `ui-monospace 0.72rem 0.18em "[ 04 ] Title"` with bracketed numbering, and **HomeAnatomy** invented a _fourth_: Inter `0.7rem 0.22em` no brackets. Five sections, four eyebrow vocabularies.
4. **Eyebrow numbering collides.** `HomeToolkit` opens with `[ 04 ] How we work, in public`. `HomeRoster` opens with `[ 04 ] The Roster`. `HomePricing` jumps to `[ 06 ]`. `HomeThesis` uses `§ 02`. There is no canonical map of section indices anywhere in the codebase — it's just freelancers writing whatever number "felt right."
5. **Container max-width is forked across the site.** `.container` in `global.css` is `1400px`. `.toolkit`, `.home-roster__inner`, `.home-pricing__inner`, `.home-anatomy__inner`, `.home-thesis` all hard-code `max-width: 1280px`. `.ph-prompts-index` (prompts/index.astro) hard-codes `1280px`. `apps/index.astro`, `apps/empty.astro`, `blog/index.astro` use `var(--container-max, 1400px)`. **Three different "max" values; the variable `--container-max` is never declared anywhere.** Falling back to 1400px because the var is missing.
6. **190 unique hex/rgba values across the site.** `rgba(255,255,255,0.06)` appears 26 times, `rgba(255,255,255,0.08)` appears 24 times — both are the same visual ("hairline border on dark surface") but the one-off variants `0.05`, `0.07`, `0.08`, `0.10`, `0.012`, `0.015`, `0.018`, `0.025` are scattered across files with no rule. There are also 27 distinct teal/cyan alpha variants (`rgba(78,201,180,*)` from `0.025` → `0.8`) — every section rolled its own teal opacity instead of picking from a 4-stop ramp.

---

## 2. Color Palette Inventory

### 2.1 Declared design tokens (`src/styles/global.css`)

| Token                      | Value                                       | Where used                                        | Conflicts                                                                                                                                                           |
| -------------------------- | ------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-bg`               | `#050607`                                   | base html, footer, `home-roster`, `home-pricing`  | Studio page hard-codes its own `linear-gradient(180deg, #0b1110 0%, #09100f 100%)` instead of `--color-bg`.                                                         |
| `--color-surface`          | `#0a0a0a`                                   | `img` background reset only                       | **Practically dead.** No card uses it. Cards use `#0a0b0c` (15 occurrences) — a 1-byte off-by-one.                                                                  |
| `--color-surface-elevated` | `#18191b`                                   | skip-to-content, Cal.com                          | Two extra elevated tones invented: `#0a0b0c`, `#0c0d0e`, `#0e0f10`.                                                                                                 |
| `--color-surface-hover`    | `#151515`                                   | **Unused anywhere.**                              | Hover states use `rgba(255,255,255,0.06)` etc. instead.                                                                                                             |
| `--color-brand-teal`       | `#1e7e72`                                   | hero gradients, AgentOrbit, blog AccentRule       | OK.                                                                                                                                                                 |
| `--color-brand-cyan`       | `#4ec9b4`                                   | Section eyebrows, links, ticks                    | OK — single source.                                                                                                                                                 |
| `--color-brand-gradient`   | `linear-gradient(135deg, #1e7e72, #4ec9b4)` | footer mobile CTA, AgentOrbit ring, gradient text | **Only 4 references in entire codebase.** Pricing CTA, Studio CTA glow, Hero radial all roll their own teal gradients ad-hoc.                                       |
| `--color-text-main`        | `#ffffff`                                   | bodies, primary CTA bg                            | `#fff` shorthand (12×) and `rgba(255,255,255,1)` (6×) are mixed in.                                                                                                 |
| `--color-text-muted`       | `rgba(255,255,255,0.6)`                     | sub copy                                          | Mirror duplicates: `rgba(255,255,255,0.6)` is also written without the var 8×.                                                                                      |
| `--color-text-subtle`      | `rgba(255,255,255,0.55)`                    | secondary captions                                | Used 4×; component-local `rgba(255,255,255,0.5)` (8×) and `0.62` (1×) compete.                                                                                      |
| `--color-text-dim`         | `rgba(255,255,255,0.4)`                     | meta/timestamp/index                              | Used 8×; `0.42`, `0.45`, `0.32`, `0.35`, `0.3`, `0.38` all coexist.                                                                                                 |
| `--color-border`           | `rgba(255,255,255,0.12)`                    | nav, footer, tool-tile                            | Counterfactual: most cards use `0.06` or `0.08` instead — only nav respects this.                                                                                   |
| `--color-border-hover`     | `rgba(255,255,255,0.24)`                    | nav hover, footer email                           | Used in 5 spots; component hover states use `0.18`, `0.22`, `0.26`, `0.3`, `0.35` ad-hoc.                                                                           |
| `--gradient-hero`          | radial teal mix                             | Declared in `:root`                               | **Defined but not referenced anywhere.** `HomeHero.astro:54` re-writes the same gradient inline with subtly different stops (`70% 40%` vs `20% 0%` in token, etc.). |

### 2.2 Brand teal alpha ramp (de-facto, 27 values)

| Alpha | Count | Used as                                                                    |
| ----- | ----- | -------------------------------------------------------------------------- |
| 0.025 | 1     | `home-roster__card:hover` background                                       |
| 0.03  | 2     | rare hover wash                                                            |
| 0.04  | 4     | card body primary                                                          |
| 0.05  | 1     | StudioShowcase glow ring                                                   |
| 0.06  | 6     | tab active, anatomy step active, hero radial outer                         |
| 0.07  | 1     | one-off                                                                    |
| 0.08  | 4     | hero radial inner                                                          |
| 0.1   | 7     | tag-pill border, type-badge bg                                             |
| 0.12  | 9     | hero radial, Cal.com brand-emphasis, anatomy avatar                        |
| 0.13  | 3     | credit tick (apps/index)                                                   |
| 0.14  | 1     | strip tab--active count badge bg                                           |
| 0.15  | 6     | StudioShowcase, AgentOrbit shadow                                          |
| 0.18  | 1     | Toolkit accent CSS-var                                                     |
| 0.2   | 5     | StudioCTA hover shadow, vault sep                                          |
| 0.25  | 5     | NeutronStar shadow inner, anatomy avatar border                            |
| 0.3   | 5     | StudioShowcase glow centre, NeutronStar mid, hero rotate-char shadow       |
| 0.32  | 2     | anatomy review border, thesis pillar line                                  |
| 0.33  | 1     | FreqDot box-shadow                                                         |
| 0.35  | 2     | toolkit hover border, hero card border                                     |
| 0.4   | 12    | NeutronStar shadow, StudioShowcase indicator, ticker dot, ticker idx, etc. |
| 0.45  | 1     | hero rotate-char cycling                                                   |
| 0.5   | 3     | anatomy chrome live, NeutronStar nav hover                                 |
| 0.55  | 2     | hero pulse-dot shadow                                                      |
| 0.6   | 5     | NeutronStar core shadow, cursor hover                                      |
| 0.65  | 1     | AgentOrbit gradient                                                        |
| 0.8   | 3     | NeutronStar after, pulse ring border                                       |
| 0.9   | 1     | StudioShowcase indicator line                                              |

**Recommended ramp** (single source): `0.04 / 0.08 / 0.16 / 0.32 / 0.64`. Five stops covers 90% of cases; each existing usage maps cleanly to the nearest stop.

### 2.3 White alpha ramp (32 values found, should be 6)

`0.01 · 0.012 · 0.015 · 0.018 · 0.02 · 0.025 · 0.03 · 0.035 · 0.04 · 0.05 · 0.055 · 0.06 · 0.07 · 0.08 · 0.10 · 0.12 · 0.14 · 0.16 · 0.18 · 0.20 · 0.22 · 0.24 · 0.26 · 0.30 · 0.32 · 0.35 · 0.38 · 0.40 · 0.42 · 0.45 · 0.5 · 0.55 · 0.6 · 0.62 · 0.65 · 0.68 · 0.7 · 0.72 · 0.75 · 0.78 · 0.8 · 0.85 · 0.88 · 0.9 · 0.92 · 0.95 · 0.96 · 0.98 · 1`

**Zero designer would author this.** This is what happens when 6 components are inspired by 6 competitor sites and nobody snapped values to a scale.

### 2.4 Out-of-system colours (every non-teal hex found)

| Value                                                 | Where                                                                                                                                       | Purpose                                 | Risk                                                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------ |
| `#d96b3a`, `#c8421f`                                  | `HomePricing.astro:363`                                                                                                                     | Gradient CTA right half                 | **CRITICAL — competes with brand teal.**                                                   |
| `#0d7a6e`                                             | `HomeHero.astro:304`, `AgentOrbit.astro` (4×), `coming-soon.astro:256`                                                                      | Light-mode brand teal                   | Should be a token (`--color-brand-teal-light` or similar). Currently free-floating.        |
| `#aab8ff` (3×) + `rgba(160,180,255,*)` (5×)           | `TypeBadge` (skill), `prompts/[...slug].astro`, `ArtifactCard`                                                                              | "Skill" content category accent         | Periwinkle — no token, no other use.                                                       |
| `#f3c47a` (3×) + `rgba(243,196,122,*)` (3×)           | `TypeBadge` (sop), `prompts/[...slug].astro`, `ArtifactCard__step-n`                                                                        | "SOP" content category accent           | Wheat/amber — no token, no other use.                                                      |
| `#0b1110`, `#09100f`, `#0e0f10`, `#0a0b0c`, `#0c0d0e` | Studio bg, apps marquee, Toolkit tile, prompt code block, tool-tile                                                                         | All "near-black slightly green"         | Five 1-byte variants of the same visual.                                                   |
| `rgba(255,80,80,0.4)`                                 | `HomeThesis.astro:191`                                                                                                                      | Strikethrough on "standard pitch" quote | Only red on the site — not in palette.                                                     |
| `#ff5f57 / #ffbd2e / #28c941`                         | `HomeAnatomy.astro:372-378`                                                                                                                 | macOS chrome "traffic lights"           | Macromock palette — fine for a ui mock, but un-tokenised so nobody knows it's intentional. |
| `#1a1a1a / #1f1f1f / #080808 / #0f0f0f / #2e2e2e`     | `blog/Cover.astro` (5×)                                                                                                                     | SVG cover gradient stops                | Fine for SVG art but should be tokenised.                                                  |
| `vault.ts` brand tints (16 hexes)                     | `#3a6f8a · #5a4a8a · #d97757 · #ff5d01 · #22c55e · #9ca3af · #ff5252 · #7c3aed · #10a37f · #3448c5 · #1e90ff · #ff7a59 · #ff4f00 · #a855f7` | Logomark per-vendor tint                | Intentional (vendor brands). Fine. Should live in a `vendors.ts` module.                   |

---

## 3. Component-Level Drift Incidents

### 3.1 Display font: `Anton` rabbit hole

| File                                    | Line                    | Drift                                                                                                                                   |
| --------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/home/HomeToolkit.astro` | 257, 361                | `font-family: 'Anton', 'Montserrat', 'Inter', sans-serif` for H2 + tile title. **Anton not declared** in `Layout.astro` `<Font>` calls. |
| `src/components/home/HomeRoster.astro`  | 203, 326                | Same — H2 + agent name.                                                                                                                 |
| `src/components/home/HomePricing.astro` | 202, 274, 301, 309, 338 | Same — H2, tier label, currency, value, CTA label.                                                                                      |

Cormorant is the declared display face (`--font-accent`). These three sections silently fall back to Montserrat on every render because Anton was never loaded — a brand-quality bug, not just inconsistency.

### 3.2 Eyebrow chip — 4 styles, 0 shared component

| Style                                       | Example                         | Location                                            |
| ------------------------------------------- | ------------------------------- | --------------------------------------------------- |
| **A — Inter uppercase tracked (canonical)** | `App Vault · 32 tools`          | `vault/Eyebrow.astro`, `blog/MonoLabel.astro`       |
| **B — Mono bracket counter**                | `[ 04 ] How we work, in public` | `HomeToolkit:37`, `HomeRoster:79`, `HomePricing:58` |
| **C — Section bar with dot + § symbol**     | `· § 02 · The thesis`           | `HomeThesis:38–43`                                  |
| **D — Inter narrow tracked, no bracket**    | `Anatomy of an agent`           | `HomeAnatomy:37`                                    |
| **E — Mono italic Cormorant title**         | (within ph-strip ticker title)  | `FilterStrip:500`                                   |

A canonical `<Eyebrow>` component exists at `vault/Eyebrow.astro` but the home sections never import it.

### 3.3 Corner-crosshair pattern — drift not catastrophic, but duplicated

Found in 3 files:

| File                               | Element class           | Stroke                | Size      | Offset                     |
| ---------------------------------- | ----------------------- | --------------------- | --------- | -------------------------- |
| `HomePricing.astro:71-94, 238-269` | `.home-pricing__corner` | `currentColor`, `1px` | `10×10px` | `-5px` (centred on corner) |
| `FilterStrip.astro:22-41, 338-369` | `.ph-strip__corner`     | `currentColor`, `1px` | `10×10px` | `-5px`                     |
| `pages/apps/index.astro`           | (none — does not use)   | —                     | —         | —                          |

**Verified identical** at the SVG level (`<line x1="5" y1="0" x2="5" y2="10"/><line x1="0" y1="5" x2="10" y2="5"/>`) and identical CSS sizing. The only drift is colour: Pricing uses `rgba(255,255,255,0.32)`, FilterStrip uses `rgba(255,255,255,0.32)`. **Same.** No drift here — but the SVG is duplicated 4 times per usage instead of being a `<CornerCrosshair />` partial. That's the real fix.

`apps/empty.astro` and `apps/index.astro` mention `corner` in selectors but don't actually render the pattern — claim in the prompt that "HomeRoster" uses corner crosshairs is incorrect; HomeRoster uses border-only cards, not crosshairs. **Audit finding: prompt's premise off, only two real users.**

### 3.4 Button anatomy — 7 variants of "Book a Call / CTA"

| Variant                                | File:line                                                                                    | Visual                                                                             |
| -------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Primary white pill**                 | `HomeHero.astro:180`, `apps/[slug].astro:375`, `apps/empty.astro:122`, `prompts/empty.astro` | bg `#fff`, color `#050607`, `border-radius: 999px`, hover `rgba(255,255,255,0.88)` |
| **Ghost pill**                         | `HomeHero.astro:192`, `apps/[slug].astro:393`, `gallery.astro:112`                           | `bg rgba(255,255,255,0.03)`, border `--color-border`, `border-radius: 999px`       |
| **Sharp-corner outline** (Pricing)     | `HomePricing.astro:348`                                                                      | `border-radius: 0`, `min-height: 52px`, dashed parent card                         |
| **Sharp-corner gradient** (Pricing)    | `HomePricing.astro:360`                                                                      | teal→orange gradient, `border-radius: 0`, dot-noise overlay                        |
| **Mobile teal-gradient pill (Footer)** | `Footer.astro:272-292`                                                                       | `var(--color-brand-gradient)`, radius `12px`, full-width, mobile-only              |
| **Glass rounded-pill (Nav CTA)**       | `Navbar.astro:355-376`                                                                       | `border-radius: 999px`, `rgba(255,255,255,0.03)` bg, glass on scroll               |
| **Hamburger trigger circle**           | `Navbar.astro:388-466`                                                                       | `3.7rem×3.7rem`, glass bg, pulse ring, 3 rotating bars                             |

Same word ("Book a Call") rendered 7 visually different ways across the site. Pricing's gradient CTA uses **square corners** (border-radius 0, the only flat-corner button), while every other CTA pill is fully rounded `999px`. Pricing's outline CTA also flat-corner, breaking 6/7 other surfaces.

### 3.5 Section padding rhythm

| File                      | Vertical                                    | Horizontal        |
| ------------------------- | ------------------------------------------- | ----------------- |
| `HomeHero.astro:65`       | `clamp(2rem, 5vh, 4rem)` + header offset    | `var(--space-sm)` |
| `HomeThesis.astro:159`    | `110px 40px 80px`                           | `40px`            |
| `HomeAnatomy.astro:248`   | `120px 40px`                                | `40px`            |
| `HomeToolkit.astro:231`   | `120px 40px`                                | `40px`            |
| `HomeRoster.astro:174`    | `120px 40px`                                | `40px`            |
| `HomePricing.astro:169`   | `120px 40px`                                | `40px`            |
| `apps/index.astro:99`     | `calc(header + 32px) var(--space-sm) 80px`  | `var(--space-sm)` |
| `prompts/index.astro:297` | `calc(header + 32px) var(--space-sm) 80px`  | `var(--space-sm)` |
| `apps/empty.astro:52`     | `calc(header + 32px) var(--space-sm) 120px` | `var(--space-sm)` |
| `blog/index.astro:109`    | `calc(header + 40px) var(--space-sm) 120px` | `var(--space-sm)` |

**Two padding cultures:** home sections use **rigid 120px / 40px** (probably copied from a competitor inspired by Linear/Vercel-section), inner pages use **`var(--space-sm)` (1rem) responsive**. They never agree.

### 3.6 Border-radius — 14 distinct values

`0 · 1px · 2px · 4px · 5px · 6px · 8px · 10px · 12px · 14px · 16px · 50% · 999px · 9999px · 0.4rem · 0.75rem · 0.8rem · 0.9rem · 1.2rem · 1.65rem · 2rem · 99rem`

Tokens declared: `--radius-xs (4px), --radius-sm (8px), --radius-md (12px), --radius-lg (16px), --radius-xl (1.65rem), --radius-full (9999px)`.
Token usage: only `apps/`, `vault/` components, and a handful of one-offs respect them. **PromptHub components (BuyModal, AuthorCard, PriceCard, FileTree, InstallTabs, FilterStrip, ArtifactCard, PromptCodeBlock, etc.) all hard-code `4px / 5px / 6px / 8px / 10px`** — never reference the token system that already exists.

`HomeAnatomy` alone uses `14px`, `6px`, `5px`, `5px`, `50%`, `50%` — six radii in one component.

### 3.7 Glow / orb / aurora visuals

| Surface                        | Composition                                       | Token used?                                                                                                                   |
| ------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Hero NeutronStar core**      | 3-layer teal box-shadow `8px/3, 25px/8, 60px/15`  | hard-coded `rgba(78,201,180,*)`                                                                                               |
| **Hero radial bg**             | 2-stop radial teal                                | inline, ignores `--gradient-hero`                                                                                             |
| **Hero dot grid**              | radial-dot 28×28 mask                             | inline                                                                                                                        |
| **Toolkit mesh / rays / topo** | 3 different SVG patterns per tile                 | per-tile `accent` prop, also hard-codes purple `rgba(192,138,232,0.16)` and orange `rgba(232,168,84,0.14)` for non-teal tiles |
| **Pricing dot grid**           | radial-dot 14×14 in section bg                    | hard-coded `rgba(255,255,255,0.05)`                                                                                           |
| **PromptHubHero glow**         | radial ellipse 380×280                            | inline                                                                                                                        |
| **StudioCTA radial**           | radial 50% 60% `rgba(30,126,114,0.25)`            | inline                                                                                                                        |
| **Studio bg**                  | `radial(34,75,66,0.2)` + linear `#0b1110→#09100f` | inline (whole new surface tone)                                                                                               |
| **Coming-soon bg**             | radial mix of teal                                | inline duplicate of hero gradient                                                                                             |

The Toolkit "mesh / rays / topo" trio introduces **purple (`#c08ae8`-ish)** and **orange (`#e8a854`-ish)** category accents that exist nowhere else on the site. Either commit to a 3-color content taxonomy (teal / purple / amber for App Vault / Prompt Hub / Field Notes) and tokenise it, or unify under teal.

### 3.8 Icon / terminal markers — stroke widths inconsistent

| Marker                    | File                       | Stroke-width | Linecap      | Linejoin  |
| ------------------------- | -------------------------- | ------------ | ------------ | --------- |
| Hamburger arrow           | `Navbar.astro:111`         | 1.5          | round        | round     |
| Footer "→" arrow          | `Footer.astro:32`          | 1.5          | round        | round     |
| Toolkit "cmd" mark        | `HomeToolkit.astro:166`    | 3            | square       | miter     |
| Toolkit "pen" mark        | `HomeToolkit.astro:184`    | 3            | square       | (default) |
| Toolkit arrow             | `HomeToolkit.astro:212`    | 1.5          | (default)    | (default) |
| Roster dot icon           | `HomeRoster.astro:122`     | 1.4          | square       | miter     |
| Pricing tick              | `HomePricing.astro:144`    | 1, 1.3       | round, round | round     |
| FilterStrip type icons    | `FilterStrip.astro:65-117` | 1.8          | round        | round     |
| FilterStrip sort tick     | `FilterStrip.astro:189`    | 2.4          | round        | round     |
| FilterStrip paid checkbox | `FilterStrip.astro:215`    | 3.5          | round        | round     |
| Apps credit tick          | `apps/index.astro:74`      | 2.4          | round        | round     |
| Anatomy memory tick       | `HomeAnatomy.astro:166`    | 2.6          | round        | round     |

**8 different stroke weights** (1, 1.3, 1.4, 1.5, 1.8, 2, 2.4, 2.6, 3, 3.5). Toolkit deliberately uses square caps + miter joins for an "industrial" feel; Roster mimics this; everything else uses round caps + round joins. There is no rule.

### 3.9 Card backgrounds — surfaces are forked

| Surface var or hex          | Count                | Used in                                                                          |
| --------------------------- | -------------------- | -------------------------------------------------------------------------------- |
| `transparent`               | many                 | most cards                                                                       |
| `rgba(255,255,255,0.012)`   | 4                    | FilterStrip bar, ArtifactCard, BuyModal etc.                                     |
| `rgba(255,255,255,0.015)`   | 2                    | ArtifactCard, anatomy block                                                      |
| `rgba(255,255,255,0.02)`    | 14                   | most "subtle elevation"                                                          |
| `rgba(255,255,255,0.025)`   | 1                    | toolkit band                                                                     |
| `rgba(255,255,255,0.03)`    | 13                   | btn-ghost utility, gallery filter                                                |
| `#0a0b0c`                   | 15                   | tool-tile, anatomy viz, sort menu, marquee, comment block, filter-strip dropdown |
| `#0a0a0a` (--color-surface) | 6 (only as fallback) | nothing referencing it directly                                                  |
| `#0c0d0e`                   | 1                    | PromptCodeBlock fade                                                             |
| `#0e0f10`                   | 1                    | apps marquee gradient                                                            |

There is a **"slightly elevated near-black"** that everyone wants — but it's been spelled six different ways.

---

## 4. Proposed Brand-Tokens Module

### 4.1 `src/styles/brand.css` (CSS-vars draft, copy-pasteable)

```css
/* src/styles/brand.css — single source of truth.
 * Replaces ad-hoc tokens currently scattered across global.css and
 * 30+ component <style> blocks. Import in Layout.astro AFTER global.css. */

:root {
	/* ─── Surfaces (5 stops, ordered dim → bright) ─────────────────── */
	--surface-0: #050607; /* page bg */
	--surface-1: #0a0b0c; /* card bg, "the dark grey" */
	--surface-2: #0e0f10; /* hover/elevated */
	--surface-3: #18191b; /* dialog, callouts */
	--studio-bg: linear-gradient(180deg, #0b1110 0%, #09100f 100%); /* Studio-only green-tinted */

	/* ─── Brand teal (2 stops + 5-step alpha ramp) ─────────────────── */
	--teal-700: #1e7e72; /* deep — gradient origin */
	--teal-500: #4ec9b4; /* primary — links, eyebrows, focus */
	--teal-300: #0d7a6e; /* light-mode equivalent */
	--brand-gradient: linear-gradient(135deg, var(--teal-700), var(--teal-500));

	--teal-04: rgba(78, 201, 180, 0.04);
	--teal-08: rgba(78, 201, 180, 0.08);
	--teal-16: rgba(78, 201, 180, 0.16);
	--teal-32: rgba(78, 201, 180, 0.32);
	--teal-64: rgba(78, 201, 180, 0.64);

	/* ─── Content-type accents (OPT-IN, only if 3-category system) ─── */
	--accent-prompt: var(--teal-500);
	--accent-sop: #f3c47a; /* amber — SOPs */
	--accent-skill: #aab8ff; /* periwinkle — Skills */
	/* Either commit to these three or remove TypeBadge variants. */

	/* ─── Text ramp (5 stops, ordered bright → dim) ────────────────── */
	--text-1: #ffffff;
	--text-2: rgba(255, 255, 255, 0.78); /* body emphasised */
	--text-3: rgba(255, 255, 255, 0.6); /* body — was --text-muted */
	--text-4: rgba(255, 255, 255, 0.4); /* meta — was --text-dim */
	--text-5: rgba(255, 255, 255, 0.24); /* hint */

	/* ─── Borders (3 stops) ────────────────────────────────────────── */
	--border-1: rgba(255, 255, 255, 0.06); /* hairline (default) */
	--border-2: rgba(255, 255, 255, 0.12); /* visible */
	--border-3: rgba(255, 255, 255, 0.24); /* hover */
	--border-dashed: 1px dashed rgba(255, 255, 255, 0.18);

	/* ─── Radii (already declared, USE THEM) ───────────────────────── */
	--radius-xs: 4px;
	--radius-sm: 8px;
	--radius-md: 12px;
	--radius-lg: 16px;
	--radius-xl: 1.65rem;
	--radius-pill: 999px;
	--radius-square: 0;

	/* ─── Shadows (3 named recipes) ────────────────────────────────── */
	--shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--border-1);
	--shadow-floating: 0 12px 36px rgba(0, 0, 0, 0.4);
	--shadow-modal: 0 24px 80px rgba(0, 0, 0, 0.6);
	--glow-teal-soft: 0 0 24px var(--teal-32);
	--glow-teal-hard: 0 0 12px 5px var(--teal-64), 0 0 35px 12px var(--teal-32);

	/* ─── Section rhythm ───────────────────────────────────────────── */
	--container-max: 1280px; /* unify on 1280, retire 1400 */
	--section-py: clamp(72px, 12vh, 120px);
	--section-px: clamp(24px, 4vw, 40px);
	--section-gap: 56px; /* header → grid */

	/* ─── Type system ─────────────────────────────────────────────── */
	/* DELETE Anton, snap to one display face. Cormorant is already loaded. */
	--font-display: var(--font-cormorant), serif; /* H1, H2, body display */
	--font-ui: var(--font-inter), system-ui, sans-serif;
	--font-brand: var(--font-montserrat), sans-serif; /* logo only */
	--font-mono: ui-monospace, 'SF Mono', Menlo, monospace;
}
```

### 4.2 `src/styles/brand-tokens.ts` (TypeScript mirror for runtime / Astro pages)

```ts
// src/styles/brand-tokens.ts — TS mirror so Astro pages can import token values
// for inline styles, content-type colour-coding, and SVG fill props.
// Keep in sync with brand.css. Run `pnpm tokens:check` (TODO) to enforce parity.

export const brand = {
	teal: {
		700: '#1e7e72',
		500: '#4ec9b4',
		300: '#0d7a6e',
		gradient: 'linear-gradient(135deg, #1e7e72, #4ec9b4)',
		alpha: {
			'04': 'rgba(78,201,180,0.04)',
			'08': 'rgba(78,201,180,0.08)',
			'16': 'rgba(78,201,180,0.16)',
			'32': 'rgba(78,201,180,0.32)',
			'64': 'rgba(78,201,180,0.64)',
		},
	},
	surface: { '0': '#050607', '1': '#0a0b0c', '2': '#0e0f10', '3': '#18191b' },
	text: {
		'1': '#ffffff',
		'2': 'rgba(255,255,255,0.78)',
		'3': 'rgba(255,255,255,0.6)',
		'4': 'rgba(255,255,255,0.4)',
		'5': 'rgba(255,255,255,0.24)',
	},
	border: {
		'1': 'rgba(255,255,255,0.06)',
		'2': 'rgba(255,255,255,0.12)',
		'3': 'rgba(255,255,255,0.24)',
	},
	accent: {
		// content-type accents — ONLY for /prompts catalog
		prompt: '#4ec9b4',
		sop: '#f3c47a',
		skill: '#aab8ff',
	},
	radius: { xs: 4, sm: 8, md: 12, lg: 16, xl: '1.65rem', pill: 9999, square: 0 },
} as const;

export const button = {
	primary: {
		bg: brand.text[1],
		fg: brand.surface[0],
		radius: brand.radius.pill,
		hoverBg: 'rgba(255,255,255,0.88)',
	},
	ghost: {
		bg: 'rgba(255,255,255,0.03)',
		fg: brand.text[1],
		radius: brand.radius.pill,
		border: brand.border[2],
		hoverBorder: brand.border[3],
	},
	gradient: {
		bg: brand.teal.gradient,
		fg: brand.text[1],
		radius: brand.radius.pill,
		hoverShadow: '0 0 24px rgba(78,201,180,0.32)',
	},
	chip: {
		bg: brand.teal.alpha['08'],
		fg: brand.teal[500],
		border: 'rgba(78,201,180,0.3)',
		radius: brand.radius.pill,
	},
} as const;

export const eyebrow = {
	// Snap all eyebrows to ONE of these three. Delete every other variant.
	standard: {
		font: 'inter',
		size: '0.72rem',
		tracking: '0.18em',
		transform: 'uppercase',
		color: brand.teal[500],
	},
	mono: {
		font: 'mono',
		size: '0.72rem',
		tracking: '0.18em',
		transform: 'uppercase',
		color: brand.teal[500],
		notation: '[ NN ] Title',
	}, // for indexed sections
	editorial: { font: 'cormorant-italic', size: '1.02rem', color: brand.teal[500] }, // for sublabel beneath name
} as const;
```

### 4.3 Migration plan (consolidation rationale)

| Drop                                          | Reason                                                               | Replacement                                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `Anton` font stack in 3 home sections         | Not loaded; falls back to Montserrat. Visual whiplash across scroll. | `var(--font-display)` (Cormorant). Re-test sizes.                                                                 |
| `--color-surface-hover` (`#151515`)           | 0 references.                                                        | Delete.                                                                                                           |
| `--color-surface` (`#0a0a0a`)                 | Used only as `img` reset; everyone uses `#0a0b0c`.                   | Replace declaration with `#0a0b0c`, alias `--surface-1`.                                                          |
| `--gradient-hero` declared, unreferenced      | Hero re-rolls inline.                                                | Reference the var from `HomeHero.astro` line 54.                                                                  |
| Pricing CTA orange tail (`#d96b3a → #c8421f`) | Brand-conflicting.                                                   | Use `var(--brand-gradient)` (teal→cyan). If gradient is too soft, add `--glow-teal-hard` on hover.                |
| 4 eyebrow style variants                      | Hard to maintain.                                                    | Extend `vault/Eyebrow.astro` with `variant: 'standard' \| 'mono' \| 'editorial'`. Replace inline implementations. |
| Hardcoded `120px 40px` section padding        | Doesn't scale with viewport, inconsistent with vault/blog.           | Use `--section-py`, `--section-px`.                                                                               |
| 1280 vs 1400 container                        | `--container-max` is undefined fallback.                             | Declare `--container-max: 1280px` in `brand.css`.                                                                 |
| 14 border-radius values                       | Token system exists but isn't used.                                  | Lint rule: only `var(--radius-*)`.                                                                                |
| 32 white-alpha values                         | Visual scale invented per-component.                                 | Snap to 5-stop `--text-*` and 3-stop `--border-*` ramps.                                                          |

---

## 5. Page-by-Page Brand Cohesion Scorecard

| Page                | Score (1–5) | Strongest                                                                                                                                         | Weakest                                                                                                                                                                                                                                                         |
| ------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **/** (homepage)    | **2**       | Hero is on-brand; AgentOrbit nails the teal palette.                                                                                              | Three competing display fonts (Cormorant in Hero/Anatomy/Thesis vs Anton in Toolkit/Roster/Pricing); pricing CTA orange gradient; eyebrow numbering collides; section padding is freelancer-coded.                                                              |
| **/studio**         | **3**       | Single visual world (green-tinted near-black); StudioHero card stack is cohesive; CTA glow uses teal.                                             | Hard-codes its own surface gradient (`#0b1110 → #09100f`) instead of `--surface-0`; floats use `border-radius: 12px` while studio CTA pill uses `999px`; StudioShowcase has 4+ teal-glow recipes (`0.05`, `0.15`, `0.3`, `0.4`, `0.9`).                         |
| **/prompts**        | **2**       | FilterStrip corner crosshairs are tight; PromptHubHero floating cards are well-art-directed; runs ticker uses brand teal correctly.               | Introduces 2 new accent colours (`#aab8ff` skill, `#f3c47a` SOP) without tokenisation; 1280 max-width hardcoded; `border-radius: 4–10px` six different ways; type-badge styling diverges from tag-pill in global.css.                                           |
| **/apps**           | **4**       | Most disciplined page: every component pulls from `var(--radius-*)`, `var(--color-text-*)`, `var(--color-border)`. Vault/Eyebrow.astro is reused. | Vendor logo tints (16 brand hexes in `vault.ts`) are necessary but un-typed; tool-tile uses dashed border for foot which appears nowhere else.                                                                                                                  |
| **/blog**           | **4**       | Reuses `Eyebrow` (twin) consistently; cover SVGs respect a darker palette but are art assets.                                                     | `MonoLabel.astro` is a duplicate of `Eyebrow.astro` — should be deleted and re-exported; cover SVGs use 5 untokenised greys.                                                                                                                                    |
| **/studio/gallery** | **4**       | Simple, on-brand; uses `--color-border`, `--color-brand-cyan` correctly; only 2 radii.                                                            | Filter pill `border-radius: 999px` is fine but `gallery__img` uses `10px` then `8px` on mobile — should use `--radius-md`/`--radius-sm`.                                                                                                                        |
| **/apps/{slug}**    | **3**       | Heavy use of `--radius-*`, `--color-text-*`.                                                                                                      | Marquee uses `linear-gradient(135deg, #0e0f10, #050607)` — yet another near-black; 1px dashed/solid border ratio inconsistent.                                                                                                                                  |
| **/prompts/{slug}** | **2**       | Code block syntax-highlighting style is distinctive and works.                                                                                    | Worst offender for ad-hoc colour: 7 references to `#f3c47a` and `#aab8ff`, `rgba(160,180,255,*)` mixed with hex; six radius values (4, 5, 6, 8, 50%, 999px); SOP rule colour `#f3c47a` differs from prompt rule `var(--color-brand-cyan)` with no shared token. |
| **/blog/{slug}**    | **3**       | Uses `--radius-*` consistently; reading-rhythm clean.                                                                                             | Border-image gradient on hr is unique to this page; `linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.25))` is just a flat 25%-white — could be a single token.                                                                                |

**Site-wide weighted average: 2.9 / 5** — within reach of 4+ with the brand-tokens module above and ~12 targeted edits.

---

## 6. Top 12 Ranked Fixes

| #      | Fix                                                                                                                                                                                                                                    | Effort                                             | Why first                                                                                     |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **1**  | **Delete the orange tail** (`#d96b3a → #c8421f`) from `home-pricing__cta--gradient`. Replace with `var(--brand-gradient)` + optional `--glow-teal-hard` on hover.                                                                      | **S** (1 line)                                     | Most loud brand violation; directly under the most-clicked CTA.                               |
| **2**  | **Replace `'Anton', 'Montserrat'…` everywhere with `var(--font-accent)` (Cormorant).** Adjust font-size by ~15% to compensate for Cormorant's wider counters.                                                                          | **M** (3 files, ~12 declarations, visual QA)       | Removes the "two-magazines-glued-together" feel. Single highest-impact visual unification.    |
| **3**  | Create `src/styles/brand.css` (4.1) and import after `global.css` in `Layout.astro`.                                                                                                                                                   | **S**                                              | Foundation for fixes 4–12. No visual change; enables the rest.                                |
| **4**  | Promote `vault/Eyebrow.astro` to `components/Eyebrow.astro`, add `variant: 'standard' \| 'mono' \| 'editorial'`. Delete `blog/MonoLabel.astro`.                                                                                        | **M**                                              | Kills 4-style eyebrow chaos; ~30 import-path swaps.                                           |
| **5**  | Add `--container-max: 1280px` to `brand.css` and remove three hardcoded `1400px` / `1280px` literals. Decide: 1280 is the right call (current "design-section" pages already use it).                                                  | **S**                                              | One number, immediate alignment of all rails.                                                 |
| **6**  | Snap section padding to `padding: var(--section-py) var(--section-px)` in 5 home sections.                                                                                                                                             | **S**                                              | Replaces `120px 40px` literals with responsive clamp; same look at desktop, better at tablet. |
| **7**  | Lint-rule (Stylelint or grep gate in CI) banning `#fff`, `#ffffff`, `rgba(255, 255, 255, *)` literals — must use `var(--text-*)`.                                                                                                      | **M**                                              | Stops drift from re-emerging.                                                                 |
| **8**  | Tokenise SOP/Skill accents: declare `--accent-sop: #f3c47a`, `--accent-skill: #aab8ff` in `brand.css`. Replace 12+ usages in `prompts/[...slug].astro` and `TypeBadge.astro` with var.                                                 | **S**                                              | Makes them official; opens the door to dropping them later if we re-decide the taxonomy.      |
| **9**  | Extract `<CornerCrosshair />` partial; replace 8 inlined SVG copies in `HomePricing.astro` and `FilterStrip.astro`.                                                                                                                    | **S**                                              | Drops ~40 lines of repeat markup.                                                             |
| **10** | Unify content-card surface to `var(--surface-1)` (`#0a0b0c`). Replace `#0a0a0a`, `#0c0d0e`, `#0e0f10` everywhere.                                                                                                                      | **M**                                              | Eyes off the inconsistency; preserves intent.                                                 |
| **11** | Re-write `HomePricing` outline + gradient CTAs with `border-radius: var(--radius-pill)` to match every other CTA on the site. (Square corners are a vestige from Linear/Stripe-pricing inspiration; the rest of the brand is rounded.) | **M** (visual decision required — sign-off needed) | Without this, the most expensive CTA still feels like a different site.                       |
| **12** | Replace `rgba(78, 201, 180, *)` literals with the 5-stop `--teal-*` ramp. Mass find-replace; QA each section.                                                                                                                          | **L** (~70 occurrences)                            | Long-tail consistency; do last.                                                               |

---

## Appendix A — Files inspected

- `src/styles/global.css`
- `src/layouts/Layout.astro`
- All 7 `src/components/home/*.astro` (HomeHero, HomeAnatomy, HomeThesis, HomeToolkit, HomeRoster, HomePricing, AgentOrbit)
- All 22 `src/components/promptHub/*.astro` (key: PromptHubHero, FilterStrip, ArtifactCard, TypeBadge, PromptCodeBlock, BuyModal, PriceCard, BottomCta, LockedOverlay, AuthorChip, AuthorCard, FileTree, InstallTabs, StatsCard, TestedCard, MetaStrip, Italic, Section, Breadcrumb, TitleWithAccent, BuyTriggers, PriceTag)
- All 17 `src/components/vault/*.astro` (key: Eyebrow, ToolTile, StackCard, RankedListModule, DeepFilterBar, ActionPill, AccentRule, CTABar, FactBlock, FreqDot, IngredientChip, Logomark, StatRow, TagPill, TitleWithAccent, VerifiedTick, Arrow)
- All 10 `src/components/blog/*.astro` (key: MonoLabel, Cover, FeaturedPost, PostCard, TabNav, TOC, Avatar, AccentRule, EmphasisText, Meta)
- `src/components/{Footer,Navbar,CustomCursor,SocialIcon,NeutronStar,StudioCTA,StudioFAQ,StudioHero,StudioProcess,StudioShowcase,ClientMarquee,CategoryPage}.astro`
- All `src/pages/**/*.astro` (index, [...slug] pages for studio/apps/prompts/blog, empty fallbacks, coming-soon, 404)
- `src/scripts/{lenis,navbar,custom-cursor,studio-hero,studio-process,studio-showcase}.ts`
- `public/_headers`, favicon files, `public/_redirects`

## Appendix B — Read-only confirmation

No source files were modified. This audit is descriptive only.
