# Codex Task 2: Animation & Interaction Polish

## Branch

Create from `dev` → `fix/animation-polish`

## Your Role

Audit every animation and interaction on the `/ai-shoots` page. Find timing issues, jank, broken transitions, and interaction bugs. Make everything feel premium and smooth.

## Animations to Audit

### Hero Card Animation (ShootsHero.astro)

- **Desktop**: Cards enter stacked → spread horizontally (3s hold) → stack back → exit up
- **Mobile**: Cards deal one-by-one with bounce-in → exit up together
- Questions to investigate:
  - Do title transitions (NEXAI/STUDIO) sync with card transitions? Same completion time?
  - Is the spread-to-stack-back transition smooth or does it jerk?
  - Does the exit animation feel natural or abrupt?
  - When clicking dock thumbnails rapidly, do animations break or overlap?
  - Does the 2s initial delay on first load feel right, or should it be shorter?
  - After resize, does the next animation cycle adapt cleanly?

### Showcase Mobile Cards (ShowcaseV3.astro)

- **Before/After swipe**: Drag between Before and After cards
- Questions to investigate:
  - Does the drag feel responsive? Is there input lag?
  - Does the settle animation (snap to Before or After) feel natural?
  - Does the auto-cycle timing feel right (2s before, 2.4s after)?
  - When switching category tabs, does the mobile stage reset cleanly?
  - Are z-index swaps during transitions smooth or do they flash?

### Showcase Tab Switching (ShowcaseV3.astro)

- Does the crossfade between panels feel smooth?
- Is there a flash of unstyled content during transition?
- Do images lazy-load fast enough when switching tabs?

### Scroll Reveal Animations

- Does `reveal-up` class animate correctly on ServicesGrid?
- Is the Lenis smooth scroll integrated properly?

## What to Fix

- Mismatched easing curves between related animations
- Transitions that feel too fast or too slow
- Z-index flicker during card swaps
- Layout shifts during animation (CLS)
- Memory leaks from timers/RAF not cleaned up
- Any interaction that doesn't respond within 100ms

## Quality Bar

- Every animation should feel intentional and polished
- No jank on 60fps devices
- Rapid clicking/tapping doesn't break state
- Resize mid-animation → clean recovery
- `prefers-reduced-motion` disables all motion

## Files

- `src/components/ShootsHero.astro`
- `src/components/ShowcaseV3.astro`
- `src/components/ServicesGrid.astro`
- `src/scripts/lenis.ts` (DO NOT MODIFY — locked file)

## How to Test

```bash
npm run dev
# Test at 390px mobile + 1536px desktop
# Watch full 4-deck cycle at each size
# Rapidly click dock thumbs
# Swipe before/after cards on mobile
# Resize browser mid-animation
# Enable prefers-reduced-motion in DevTools
```
