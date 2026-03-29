# Hero Section — Desktop Audit & Fix

## Your Role

Audit and fix the DESKTOP hero animation on `/ai-shoots`. Read all the code yourself, understand the full architecture, find issues independently, then fix them. This doc gives you the design spec and quality bar — not a step-by-step prescription.

## Branch

Create from `dev` → `fix/hero-desktop`

## Scope

**Desktop only** (viewport width > 720px). Do NOT modify mobile behavior (the `if (isMobile())` JS branch or `@media (max-width: 720px)` CSS). Another agent handles mobile.

## Architecture Overview

- `src/components/ShootsHero.astro` — single file: Astro template + scoped `<style>` + `<script is:inline>`
- Flex row layout: `NEXAI [card-stage] STUDIO` — stage holds absolutely-positioned cards with `overflow: visible`
- 4 decks × 5 cards each, cycling automatically
- Dock thumbnails (macOS-style bar) below cards — click to jump to a deck
- Brand marquee at bottom of hero section (separate component)

## Design Spec — What "Done" Looks Like

### Centering

- **Every element must be viewport-centered**: stacked cards, spread cards, NEXAI/STUDIO text, dock
- The stage sits between NEXAI and STUDIO in a flex row. STUDIO is wider → stage is naturally ~48px left of viewport center. A `centerOffset` mechanism exists to compensate — verify it works for ALL states (entry, hold, spread, exit), not just spread

### Card Spread

- 5 cards fan out with **visible gaps** (~15-20px) between them
- **Breathing room on each side** — cards should NOT fill edge-to-edge
- Cards **scale smoothly** with viewport width — no jumps at any CSS breakpoint
- At narrow desktops (1000-1280px), cards may scale down via `spreadScale` — verify this looks good
- At wide viewports (1920-2560px), verify cards don't spread too far or look tiny

### Title Animation (3 phases per deck cycle)

1. **No cards visible**: NEXAI STUDIO close together with a small gap
2. **Cards stacked**: NEXAI [cards] STUDIO — text alongside the stack
3. **Cards spread**: NEXAI/STUDIO pushed outward, **~20-30% visible** at viewport edges, **not overlapping cards**, with a clear gap between outermost card and visible text

### Timing & Feel

- Enter → spread (hold 3s) → stack back → exit — all phases smooth
- Title and card transitions should feel synchronized (same easing, completing at similar times)
- Dock click → instant jump to deck, no delay
- Resize mid-animation → next cycle adapts without glitches

### Spacing

- Consistent gap between navbar and hero content at all viewport heights
- Dock sits between cards and marquee with clear separation from both
- No element overlaps (cards/text, dock/marquee, content/navbar)
- `--header-height` CSS variable should be properly defined/used

## Quality Bar

- Zero horizontal overflow at any viewport width (1000px–2560px)
- Cards always visually centered (stacked AND spread)
- Smooth scaling — resize browser slowly from 1000px to 2560px, no jumps
- Full 4-deck cycle looks polished at 1280px, 1440px, 1536px, 1920px
- `prefers-reduced-motion` still works

## Files

- `src/components/ShootsHero.astro` — primary (template + CSS + JS)
- `src/pages/ai-shoots.astro` — page wrapper, hero section styles
- `src/components/ClientMarquee.astro` — brand marquee (modify if needed for spacing)
- `src/styles/global.css` — `.container`, CSS variables

## How to Test

```bash
npm run dev
# Open http://localhost:4321/ai-shoots
```

Test at: 1000px, 1280px, 1440px, 1536px, 1920px widths × 700px, 900px, 1080px heights.
Watch full cycle, click dock thumbs, resize mid-animation.
