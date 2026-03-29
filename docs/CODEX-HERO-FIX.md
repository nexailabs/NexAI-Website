# Hero Section — Quality Audit & Fix

## Your Role

You are auditing and fixing the hero animation on the `/ai-shoots` page. Do your own analysis first — read all the code, understand the architecture, identify issues independently, then fix them. Don't assume this doc lists everything.

## Branch

Create from `dev` → `fix/hero-section-quality`

## Design Spec — What "Done" Looks Like

### Layout (all viewport widths 1000px–2560px)

- Everything is **viewport-centered**: stacked cards, spread cards, title text, thumbnail dock
- The card stage sits between NEXAI and STUDIO in a flex row. Because STUDIO is wider than NEXAI, the stage is NOT at viewport center by default. **You must fix this** — cards should always appear centered in the viewport regardless of title text widths.
- The dock thumbnails are centered below the cards
- The brand marquee scrolls at the bottom, fully visible (not clipped)

### Card Spread Animation

- 5 cards fan out horizontally with **visible gaps** (~15-20px) between them
- Cards + gaps + margins must fit within the viewport with **breathing room on each side**
- NEXAI and STUDIO text should remain **~20-30% visible** at viewport edges during spread — not hidden, not overlapping the cards
- Cards should **scale smoothly** with viewport width — no size jumps at any breakpoint
- The spread must work correctly from 1000px to 2560px viewport width

### Title Animation (3 phases per deck)

1. **No cards**: NEXAI STUDIO together with a small gap (no overlap)
2. **Cards stacked**: NEXAI [cards] STUDIO — visible alongside
3. **Cards spread**: NEXAI/STUDIO pushed outward, partially visible at edges, NOT overlapping cards

### Timing

- Cards enter → hold stacked → spread (hold 3s) → stack back → exit upward
- Title transitions sync with card transitions (same easing, same completion time)
- Clicking dock thumbnail jumps immediately to that deck (no 2s delay)

### Mobile (≤720px)

- Cards deal one-by-one (existing behavior, don't break it)
- Dock and marquee don't overlap
- Touch targets ≥ 48px

### Accessibility

- Dock thumbs have visible `:focus-visible` state
- `prefers-reduced-motion` respected (already implemented)

## Known Problem Areas (investigate these, but don't limit yourself to them)

### Centering

- The stage is ~48px off viewport center because STUDIO > NEXAI width. `getViewportCenterOffset()` tries to compensate but is clamped to ±80px and only applies during spread — **stacked cards are off-center too**.
- Consider: should the offset apply to ALL card states, not just spread?

### Responsive Card Sizing

- CSS `clamp()` values may not scale smoothly across all widths
- Check for jumps at the 1100px and 720px media query boundaries
- 5 cards × card_width must fit in the viewport with margins at every width

### Performance

- `requestAnimationFrame` IDs stored in single vars (rafA, rafB) — if `showDeck()` is called rapidly (dock clicks), old RAFs aren't cancelled
- `timers` array grows unbounded across cycles
- `getBoundingClientRect()` called during animation (layout thrashing)
- Cleanup should run on `astro:before-swap`, not just `after-swap`

### Overflow

- `.shoots-hero` has `overflow: hidden` — verify this doesn't clip cards during spread, title during animation, or marquee at bottom

### Spacing

- `--header-height` CSS variable is used but may not be defined
- `margin-top: 12.5vh` on `.shoots-hero__copy` — is this the right approach?
- Dock and marquee spacing on mobile

## Files

- `src/components/ShootsHero.astro` — **primary file** (template + CSS + JS)
- `src/pages/ai-shoots.astro` — page wrapper, `.shoots-hero` section styles
- `src/components/ClientMarquee.astro` — brand marquee (modify if needed for spacing/clipping)
- `src/styles/global.css` — `.container` class, CSS variables

## How to Test

```bash
npm run dev
# Open http://localhost:4321/ai-shoots
```

Test matrix:

- **Widths**: 1000px, 1280px, 1440px, 1536px, 1920px, 2560px
- **Heights**: 700px, 900px, 1080px
- **Mobile**: 375px, 414px (verify no regressions)
- **Interactions**: click each dock thumbnail, verify instant jump + correct active state
- **Full cycle**: watch all 4 decks animate through, verify centering + spacing at every phase
- **Resize**: resize browser mid-animation, verify no visual glitches on next cycle

## Quality Bar

- Zero horizontal overflow at any viewport width
- Cards always visually centered in viewport (stacked AND spread)
- No element overlaps (cards/text, dock/marquee, content/navbar)
- Smooth scaling — no jumps when resizing browser
- Animation feels polished: title and cards move in sync, no jank
