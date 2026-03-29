# Codex Prompt: Fix Desktop Hero Card Spread Animation

## Branch

Create from `dev` → `fix/hero-spread-responsive`

## Problem

The desktop hero animation in `src/components/ShootsHero.astro` has a card spread that doesn't scale properly across viewport widths. When 5 cards fan out horizontally, they fill the entire viewport edge-to-edge with no breathing room — especially on viewports under 1500px. The "NEXAI" and "STUDIO" title words that should remain partially visible during the spread get pushed behind/under the cards.

## Current Architecture

- **File**: `src/components/ShootsHero.astro` (single file — template + scoped CSS + `<script is:inline>`)
- **Layout**: Flex row → `NEXAI [card-stage] STUDIO`. Cards are absolutely positioned inside the stage with `overflow: visible`, spreading outward via JS-computed transforms.
- **Animation cycle**: Cards enter stacked from top → spread horizontally (hold 3s) → stack back → exit upward. Title words animate between 3 states: together (no gap), apart (alongside cards), off-to-sides (during spread).
- **Data**: 4 decks × 5 cards each. Deck thumbnails shown in a dock bar.

## What Needs Fixing

### 1. Card spread must leave room for the title text

When cards spread, NEXAI and STUDIO should remain ~20-30% visible at the viewport edges. Currently the spread fills 95%+ of the viewport. The `getSpreadUnit()` function computes the spread distance — it needs to reserve space on each side for the partially-visible text.

**Key insight**: The title words are flex siblings of the stage. Their natural position is adjacent to the stage. When `setTitleState({ shift: N })` is called, NEXAI moves left by N pixels and STUDIO moves right by N pixels from their natural positions. During spread, the shift should be calculated so the words land at ~10-15% from the viewport edge — NOT off-screen.

### 2. Responsive card sizing

Cards use CSS `clamp()` for width/height. The values must:

- Scale smoothly with viewport width (no jumps at breakpoints)
- Be small enough that 5 cards + gaps + text margins fit in any desktop viewport (1000px–2560px)
- Current values `clamp(11rem, 15vw, 22rem)` may need adjustment

### 3. The spread calculation (`getSpreadUnit`)

This function computes how far apart card centers should be. It also sets `spreadScale` (a CSS `scale()` value applied to cards during spread). Issues:

- The `available` width calculation must account for the title text space, not just a small margin
- `spreadScale` should only go below 1 (shrink), never above 1
- Card width must be measured with `offsetWidth` (not `getBoundingClientRect` which includes transforms)

### 4. `getViewportCenterOffset()`

Cards spread from the stage center, but the stage isn't at the viewport center (it's a flex child between NEXAI and STUDIO). This function offsets cards to center them on the viewport. Currently clamped to ±80px — verify this is sufficient and doesn't cause asymmetric margins.

## Expected Behavior (Desktop Only — Don't Touch Mobile ≤720px)

### Stacked state (cards in center):

```
         NEXAI  [stacked cards]  STUDIO
         ←gap→                   ←gap→
```

NEXAI and STUDIO visible with a small gap between them (controlled by `getTitleShift()` returning a negative value).

### Spread state (cards fanned out):

```
  NEXA  [card] [card] [card] [card] [card]  UDIO
  ↑                                          ↑
  ~15% of word visible                ~15% of word visible
  ↑                                          ↑
  Cards have ~15-20px gaps between them
  Cards centered in viewport
  ~5% margin between outermost card and visible text
```

### Stack-back state:

Same as stacked — title words return to alongside position.

## Constraints

- Only modify `src/components/ShootsHero.astro`
- Only modify the desktop `else` branch in JS (line ~540+). Do NOT touch the mobile `if (isMobile())` branch.
- Do NOT touch the HTML template or the dock thumbnail feature
- Keep all existing animation phases and timing (enter → spread → hold 3s → stack → exit)
- Keep the `forceImmediate` click-to-jump feature working
- Test at: 1000px, 1280px, 1440px, 1536px, 1920px viewport widths

## How to Test

```bash
npm run dev
# Open http://localhost:4321/ai-shoots
# Resize browser to various widths
# Watch full animation cycle at each width
# Click dock thumbnails to verify jump works
# Verify: cards centered, gaps visible, text partially visible, no overflow
```

## Files for Context

- `src/components/ShootsHero.astro` — the only file to modify
- `src/data/ai-shoots.ts` — deck image data (read-only context)
- `src/pages/ai-shoots.astro` — page layout with `.shoots-hero` section (read-only context)
- `src/components/ClientMarquee.astro` — brand logo marquee below hero (read-only context)
