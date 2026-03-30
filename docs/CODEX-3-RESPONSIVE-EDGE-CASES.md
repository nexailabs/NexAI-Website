# Codex Task 3: Responsive Edge Cases & Bug Fixes

## Branch

Create from `dev` → `fix/responsive-edge-cases`

## Your Role

Break the `/ai-shoots` page. Find every edge case where the layout breaks, overflows, overlaps, or looks wrong. Then fix them all.

## Test Matrix — Try Every Combination

### Viewport Widths

- 320px (iPhone SE, narrowest phone)
- 375px (iPhone 12/13 mini)
- 390px (iPhone 14)
- 430px (iPhone 14 Pro Max)
- 720px (exactly at mobile/desktop breakpoint)
- 721px (just above breakpoint)
- 900px (showcase mobile/desktop breakpoint)
- 901px (just above showcase breakpoint)
- 1000px (narrow desktop)
- 1100px (another breakpoint)
- 1280px (laptop)
- 1440px (standard desktop)
- 1920px (full HD)
- 2560px (ultrawide)

### Viewport Heights

- 568px (iPhone SE landscape)
- 667px (iPhone SE portrait — very short)
- 740px (short laptop)
- 900px (standard)
- 1080px (full HD)

### Things to Check at EVERY Size

**Layout:**

- [ ] No horizontal scrollbar appears
- [ ] No vertical content overflow below fold (hero should be single viewport)
- [ ] All text readable (not too small, not clipped)
- [ ] Cards fully visible (not cut off by overflow:hidden)
- [ ] Dock thumbnails visible and not overlapping marquee
- [ ] Brand marquee fully visible, not clipped
- [ ] Navbar doesn't overlap hero content

**Spacing:**

- [ ] Consistent gap between navbar and hero content
- [ ] Cards don't touch viewport edges during spread
- [ ] NEXAI/STUDIO text has breathing room from cards
- [ ] Dock has clear space above (from cards) and below (from marquee)

**Breakpoint Transitions:**

- [ ] Slowly resize from 719px → 721px — no layout jump
- [ ] Slowly resize from 899px → 901px — no layout jump
- [ ] Slowly resize from 1099px → 1101px — no layout jump
- [ ] CSS clamp values scale smoothly (no sudden size changes)
- [ ] JS `isMobile()` (720px) matches CSS `@media (max-width: 720px)`

**Interactions:**

- [ ] Dock thumb click works at every width
- [ ] Mobile swipe works from 320px to 900px
- [ ] Desktop spread animation works from 721px to 2560px

## Common Issues to Look For

- `overflow: hidden` clipping content it shouldn't
- `clamp()` min value larger than the preferred value at certain widths (creates jumps)
- `vh` units on mobile (address bar resize issues) — use `svh` instead
- Absolute positioning breaking when container size changes
- CSS Grid/Flex items overflowing their containers
- Touch targets too small on mobile (< 48px)
- Text wrapping where it shouldn't (`white-space: nowrap` missing)
- Z-index stacking issues between hero, dock, marquee, navbar

## Quality Bar

- Zero layout issues across the entire test matrix
- Smooth scaling when resizing — no jumps at any pixel
- Every interactive element works at every viewport size

## Files

- `src/components/ShootsHero.astro`
- `src/components/ShowcaseV3.astro`
- `src/components/ServicesGrid.astro`
- `src/components/ClientMarquee.astro`
- `src/components/Navbar.astro`
- `src/pages/ai-shoots.astro`
- `src/styles/global.css`

## How to Test

```bash
npm run dev
# Use Chrome DevTools responsive mode
# Drag the viewport width handle slowly from 320px to 2560px
# At each width listed above, pause and verify all checklist items
# Test both portrait and landscape orientations on mobile sizes
```
