# Codex Task 1: Visual Alignment Audit

## Branch

Create from `dev` → `fix/visual-alignment`

## Your Role

Compare the current `/ai-shoots` page against the reference implementation and fix any visual misalignment. You have access to a reference repo with the original working version.

## Reference

`C:\Users\junej\Downloads\NexAI-Website\NexAI-Website\src\pages\ai-shoots.astro` — the original monolithic page that was working correctly. Our current repo extracted this into components. Things may have been lost or broken in the extraction.

## What to Do

1. **Read both versions** — the reference file AND our current components:
   - `src/components/ShootsHero.astro` (hero animation)
   - `src/components/ShowcaseV3.astro` (showcase section with mobile before/after cards)
   - `src/components/ServicesGrid.astro` (services section)
   - `src/components/ClientMarquee.astro` (brand marquee)
   - `src/pages/ai-shoots.astro` (page composition)

2. **Diff the visual output** — For each section, compare:
   - CSS values (spacing, sizing, colors, shadows, borders, gradients)
   - HTML structure (class names, data attributes, element hierarchy)
   - Animation timing and easing curves
   - Responsive breakpoints and mobile styles
   - Any hardcoded values that should match

3. **Fix discrepancies** — Anything that looks different from the reference, align it. Common things to check:
   - Background gradients on the page
   - Section padding/margins
   - Font sizes, weights, letter-spacing
   - Card border-radius, shadows, borders
   - Marquee speed and styling
   - Navbar integration with hero

4. **Don't break what works** — If something was intentionally improved during extraction (e.g., responsive scaling, centering offsets), keep the improvement.

## Quality Bar

- Side-by-side comparison at 1536px desktop and 390px mobile should look identical to reference
- No missing CSS rules, gradients, or visual effects
- Section transitions (hero → showcase → services) flow naturally

## Files

- Reference: `C:\Users\junej\Downloads\NexAI-Website\NexAI-Website\src\pages\ai-shoots.astro`
- Current: all files in `src/components/`, `src/pages/ai-shoots.astro`, `src/styles/global.css`

## How to Test

```bash
npm run dev
# Compare localhost:4321/ai-shoots against reference visually
# Check at 390px, 768px, 1280px, 1536px widths
```
