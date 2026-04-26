# NexAI Website — Agent Rules

This file mirrors `CLAUDE.md` and is auto-loaded by Codex, Cursor, Cline,
and other agent tools that follow the AGENTS.md convention. The rules are
identical regardless of which agent is reading.

> **See `./CLAUDE.md` for the canonical version. Both files are kept in sync.**

## Brand fonts (HARD RULE)

The site uses exactly **three** typefaces plus a system mono stack:

| Role    | Font              | CSS token                    |
| ------- | ----------------- | ---------------------------- |
| Display | Montserrat        | `var(--font-display)`        |
| Body    | Inter             | `var(--font-body)`           |
| Accent  | Plus Jakarta Sans | `var(--font-accent-jakarta)` |
| Mono    | system mono stack | `var(--font-mono)`           |

Brand authority: `Brand Guidelines.pdf` at
`file:///C:/Users/junej/Desktop/NexAI%20Labs/Branding/Brand%20Guidelines.pdf`.

### Do NOT

- Add a new `@fontsource/*` package or any font file under `public/`.
- Add a new `<Font cssVariable="…" />` to `src/layouts/Layout.astro`.
- Write a literal font-family stack in component CSS.
- Reintroduce **Anton, Cormorant, Cormorant Garamond, Roboto, Poppins,
  IBM Plex, JetBrains Mono, Geist, Space Grotesk, DM Sans, Manrope**, or
  any typeface not listed above.

CI enforces this via `npm run guard:fonts`.

## Typography system

All typography lives in `src/styles/global.css` under
`@layer reset, tokens, base, components, utilities;`.

- Use semantic HTML (`<h1>–<h6>`, `<p>`, `<small>`). Element recipes auto-style.
- For non-semantic roles use the utility classes: `.t-eyebrow`, `.t-tag`,
  `.t-lead`, `.t-caption`, `.t-numeric`, `.t-mono`.
- Use the `<Eyebrow>` component for sequential numbered section labels.

### Do NOT

- Add component-level `font-family` / `font-size` / `font-weight` /
  `line-height` / `letter-spacing` declarations unless the case is a
  documented one-off (rotating word, AgentOrbit dynamic labels, StudioHero
  decorative title, HomePricing per-unit text, HomeAnatomy code microcopy).
- Add new `--font-*` or `--text-*` CSS variables outside `brand.css` /
  `global.css`.

### Mono usage

Mono is reserved for code, numeric/runtime contexts, and the pricing per-unit
line. Section eyebrows / tags / labels use Plus Jakarta Sans, not mono.

## Brand colors

Defined in `src/styles/brand.css`. No new color literals in component CSS.
Use `--brand-teal-bright` / `--brand-teal-dark` / `--brand-ink` and the
quantized `--teal-aXX` / `--white-aXX` scales.

## Cross-references

- `CLAUDE.md` — canonical version of this file.
- `audits/12-typography-inventory.md` — current typography state.
- `CONTRIBUTING.md` — workflow, commit conventions, key files.
- `Brand Guidelines.pdf` — typography + color source of truth.
