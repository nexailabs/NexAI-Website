# NexAI Website — Agent Rules

This file is auto-loaded by Claude Code (and any agent that respects it) when
working in this repo. It encodes hard rules that future agents — including
Codex, Cursor, Cline, future Claude sessions — must follow.

## Brand fonts (HARD RULE)

The site uses exactly **three** typefaces plus a system mono stack:

| Role    | Font              | CSS token                    |
| ------- | ----------------- | ---------------------------- |
| Display | Montserrat        | `var(--font-display)`        |
| Body    | Inter             | `var(--font-body)`           |
| Accent  | Plus Jakarta Sans | `var(--font-accent-jakarta)` |
| Mono    | system mono stack | `var(--font-mono)`           |

The brand authority is `Brand Guidelines.pdf` at
`file:///C:/Users/junej/Desktop/NexAI%20Labs/Branding/Brand%20Guidelines.pdf`.

### Do NOT

- Add a new `@fontsource/*` package or any font file under `public/`.
- Add a new `<Font cssVariable="…" />` tag in `src/layouts/Layout.astro`.
- Write a literal font-family stack in component CSS, e.g.
  `font-family: 'Anton', 'Cormorant', 'JetBrains Mono', 'Roboto', 'Geist', …`.
- Reintroduce **Anton, Cormorant, Cormorant Garamond, Roboto, Poppins,
  IBM Plex, JetBrains Mono, Geist, Space Grotesk, DM Sans, Manrope**, or any
  typeface not listed above.

If a design genuinely needs a fourth typeface, raise it as a brand decision
(Rahul + `Brand Guidelines.pdf`). Do not ship it.

CI enforces this via `npm run guard:fonts`. If the script fails, the PR is
blocked.

## Typography system

All typography lives in `src/styles/global.css`, organised with
CSS cascade layers:

```
@layer reset, tokens, base, components, utilities;
```

- **Tokens** (in `:root` under `@layer tokens`) — primitive design vars
  (font stacks, weights, line-heights, tracking, sizes) and **role tokens**
  (`--type-h2-size`, `--type-eyebrow-tracking`, …).
- **Base** — element recipes for `h1–h6`, `p`, `small`, `code`, `strong`,
  `body`. A bare `<h2>` in any `.astro` file or `.md` content auto-styles.
- **Components** — `.section-*`, `.btn-ghost`, `.tag-pill`, `.gradient-text`,
  `.prose` (long-form / markdown wrapper).
- **Utilities** — six role-utility classes:
  - `.t-eyebrow` (Plus Jakarta, teal, uppercase tracking)
  - `.t-tag` (Plus Jakarta, smaller, uppercase)
  - `.t-lead` (Inter, larger body)
  - `.t-caption` (Inter, smaller, dim)
  - `.t-numeric` (mono, tabular-nums)
  - `.t-mono` (mono)

### How to write components

- **Default to semantic HTML** — `<h2>`, `<p>`, `<small>`. The element recipes
  do the work.
- **Non-semantic roles** — apply a utility class:
  `<span class="t-eyebrow">[ 03 ] How we engage</span>`.
- **Numbered section labels** — use the `<Eyebrow>` component
  (`src/components/brand/Eyebrow.astro`) for sequential `[ 0N ]` numbering.

### Do NOT

- Add component-level `font-family`, `font-size`, `font-weight`,
  `line-height`, or `letter-spacing` declarations unless the case is a
  documented one-off:
  - HomeHero rotating word
  - AgentOrbit JS-sized labels
  - StudioHero decorative title
  - HomePricing price unit (`/sprint`, `/month`)
  - HomeAnatomy intentional code-style microcopy
- Add new `--font-*` or `--text-*` CSS variables outside `brand.css` /
  `global.css`.

### Mono usage

Mono survives only at:

- `code, kbd, pre, samp` (auto-handled by element recipe)
- `.t-numeric` / `.t-mono` utilities
- HomePricing per-unit text (`/sprint`, `/month`)
- HomeAnatomy chrome-label / code blocks / line tickers / memory tag

Do **NOT** use mono for section eyebrows, tags, or generic UI labels — those
go to Plus Jakarta Sans (the accent face).

## Brand colors

Colors live in `src/styles/brand.css`. Do not introduce new color literals
in component CSS. Use:

- `--brand-teal-bright`, `--brand-teal-dark`, `--brand-ink`
- Quantized alpha scales: `--teal-a05/08/14/25/40/90`,
  `--white-a04/08/14/35/55/90`
- Composite gradient: `--brand-gradient-teal`

## When in doubt

- Read `audits/12-typography-inventory.md` for the current state of
  per-component typography.
- Read `Brand Guidelines.pdf` (path above) for the source of truth.
- Ask Rahul before adding a new face / token / role.
