# Hero Section — Mobile Audit & Fix

## Your Role

Audit and fix the MOBILE hero animation on `/ai-shoots`. Read all the code yourself, understand the full architecture, find issues independently, then fix them. This doc gives you the design spec and quality bar — not a step-by-step prescription.

## Branch

Create from `dev` → `fix/hero-mobile`

## Scope

**Mobile only** (viewport width ≤ 720px). Do NOT modify desktop behavior (the `else` branch in JS or CSS above the `@media (max-width: 720px)` breakpoint). Another agent handles desktop.

## Architecture Overview

- `src/components/ShootsHero.astro` — single file: Astro template + scoped `<style>` + `<script is:inline>`
- Mobile animation: cards deal one-by-one (not horizontal spread)
- Title: NEXAI [card] STUDIO with mobile-specific shifts
- Dock thumbnails below cards — click to jump to a deck
- Brand marquee at bottom of hero section
- `isMobile()` in JS checks `window.innerWidth <= 720`

## Design Spec — What "Done" Looks Like

### Layout

- **Everything centered** on the viewport: card stack, title text, dock
- Card takes up most of the viewport width but with margins (~5-8% per side)
- NEXAI and STUDIO text flanking the card, visible during appropriate phases
- Dock below the card area, fully visible, not overlapping marquee
- Marquee at bottom, fully visible, not clipped

### Card Animation

- Cards deal one-by-one from the stack (existing deal animation)
- Each card appears with a bounce-in effect
- After all cards dealt, they exit upward together
- Animation should feel smooth on low-end phones (no jank)
- Deal timing should be consistent regardless of number of cards in a deck

### Title Animation

- Title splits and joins appropriately with the card animation
- Text readable on narrow phones (320px–414px width)
- No text overflow or wrapping — NEXAI and STUDIO should fit

### Touch & Interaction

- Dock thumbnails must be **≥ 48px** touch targets (both width and height)
- Tapping a dock thumb jumps immediately to that deck
- No accidental taps — sufficient spacing between thumbs

### Spacing & Sizing

- Card sizing works across phone widths: 320px, 375px, 390px, 414px, 428px
- No content overlaps at any phone height (667px to 932px)
- Dock and marquee have clear separation
- Hero section doesn't require scrolling — everything fits in one viewport
- Safe area / notch considerations (if applicable)

### Edge Cases

- Very short phones (667px height, e.g. iPhone SE) — verify nothing overflows vertically
- Very narrow phones (320px) — verify card and text fit
- Landscape orientation — graceful degradation (doesn't need to look perfect, but shouldn't break)
- `prefers-reduced-motion` still works on mobile

## Quality Bar

- Zero overflow (horizontal or vertical) on any phone size
- All elements centered and visible
- Touch targets ≥ 48px
- Animation feels smooth on a real device (test with Chrome DevTools throttling)
- Full 4-deck cycle looks good on iPhone 14 (390×844) and Galaxy S21 (360×800) sizes

## Files

- `src/components/ShootsHero.astro` — primary (template + CSS + JS)
- `src/pages/ai-shoots.astro` — page wrapper, hero section styles (mobile media query)
- `src/components/ClientMarquee.astro` — brand marquee
- `src/styles/global.css` — `.container`, CSS variables

## How to Test

```bash
npm run dev
# Open http://localhost:4321/ai-shoots
# Use Chrome DevTools → Device toolbar
```

Test devices: iPhone SE (375×667), iPhone 14 (390×844), iPhone 14 Pro Max (430×932), Galaxy S21 (360×800), Pixel 7 (412×915).
Watch full cycle, tap dock thumbs, rotate to landscape.
