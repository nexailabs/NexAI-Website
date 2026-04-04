# Mobile Before/After Showcase Card Redesign Plan

## Goal

Rebuild the mobile Before/After cards in `src/components/StudioShowcase.astro` so the bookmark tab edge and media inset are driven by **one geometry system** (single card padding token), while keeping the existing swipe/auto-cycle behavior in `src/scripts/studio-showcase.ts`.

---

## 1) New HTML structure (both cards)

### Design decision

Use **Approach B** (real tab element in DOM; no clip-path card silhouette). This removes dual coordinate systems (clip-path polygon math vs nested padding) and makes tab alignment deterministic.

### Proposed structure (per card)

```astro
<div class="sc3__mobile-card sc3__mobile-card--before">
	<article class="sc3__mcard sc3__mcard--before" data-side="before">
		<span class="sc3__mcard-tab sc3__mcard-tab--before">Before</span>

		<div class="sc3__mcard-inner">
			<!-- media layout root; no extra frame padding anywhere below -->
			<div class="sc3__mcard-layout sc3__mcard-layout--input sc3__mcard-layout--triple">
				<figure class="sc3__mcell sc3__mcell--main">…</figure>
				<div class="sc3__mstack">
					<figure class="sc3__mcell">…</figure>
					<figure class="sc3__mcell">…</figure>
				</div>
			</div>
		</div>
	</article>
</div>

<div class="sc3__mobile-card sc3__mobile-card--after">
	<article class="sc3__mcard sc3__mcard--after" data-side="after">
		<span class="sc3__mcard-tab sc3__mcard-tab--after">After</span>

		<div class="sc3__mcard-inner">
			<div class="sc3__mcard-layout sc3__mcard-layout--output">
				<figure class="sc3__mcell sc3__mcell--tl">…</figure>
				<figure class="sc3__mcell sc3__mcell--tr">…</figure>
				<figure class="sc3__mcell sc3__mcell--bl">…</figure>
				<figure class="sc3__mcell sc3__mcell--br">…</figure>
			</div>
		</div>
	</article>
</div>
```

### Mapping from current DOM

- Keep outer animated wrappers unchanged:
  - `.sc3__mobile-stage`
  - `.sc3__mobile-card`
  - `.sc3__mobile-card--before` / `--after`
- Replace inner frame stack:
  - Remove `.sc3__mobile-card-frame`, `::before` clip shape, and `.sc3__mobile-card-media`
  - Replace with `.sc3__mcard` + `.sc3__mcard-tab` + `.sc3__mcard-inner`
- Keep existing image conditional logic/data model:
  - `cat.inputMain`, `cat.inputSideTop`, `cat.inputSideBottom`, `cat.outputs[]`

---

## 2) New CSS architecture

### Core geometry rule (single source of truth)

At card root:

```css
.sc3__mcard {
	--mcard-pad: 0.56rem;
	--mcard-tab-h: 1.5rem;
	--mcard-tab-w: 5.5rem;
}
```

Then:

- `.sc3__mcard-inner` uses `padding: var(--mcard-pad)` for media inset.
- `.sc3__mcard-tab` is positioned from the **same** padding token:
  - before: `left: var(--mcard-pad)`
  - after: `right: var(--mcard-pad)`

This guarantees tab side edge aligns with media inset edge by construction.

### Card + border rendering (no clip-path)

- `.sc3__mcard` handles shell background, radius, and teal border (real border or inset box-shadow).
- `.sc3__mcard::before` can be the dark fill layer (`inset: 1px; border-radius: inherit`) **without shape clipping math**.
- Tab is a real child block with matching border/fill so it reads as attached bookmark:
  - rounded top corners and squared/butt bottom edge where it meets card top line.

### Layout layers

1. `.sc3__mcard` (positioned shell)
2. `.sc3__mcard-tab` (bookmark)
3. `.sc3__mcard-inner` (single inset region, top padding includes tab clearance)
4. `.sc3__mcard-layout` (grid strategy)
5. `.sc3__mcell` (image cards)

### Media region sizing

- `padding-top` in `.sc3__mcard-inner` should include tab clearance:
  - `padding: calc(var(--mcard-pad) + var(--mcard-tab-h)) var(--mcard-pad) var(--mcard-pad);`
- No additional padding in `.sc3__mcard-layout--input` or `--output`.

### Layout recipes

- **1 image** (`--single`): one cell full-bleed in media region.
- **3 images** (`--triple`): `grid-template-columns: 1.86fr 1fr`; right column stack 1 or 2 rows.
- **4 images** (`--output`): keep current asymmetric 2x3 placement using named areas.

### Overlay/shadow states

Move overlay pseudo from old frame to new card root:

- `.sc3__mcard::after` is the gradient overlay controlled by stage vars.
- Keep `--sc3-before-overlay`, `--sc3-after-overlay`, shadow variables unchanged; only selector targets change from `.sc3__mobile-card-frame` to `.sc3__mcard`.

---

## 3) Keep vs rewrite (selector/property audit)

### Keep as-is

- Stage/controller vars and card transform selectors:
  - `.sc3__mobile-stage` custom properties for x/scale/z/shadow/overlay/tag opacity
  - `.sc3__mobile-card--before` / `--after` transform and z-index wiring
- Drag transition disable hooks:
  - `.sc3__mobile-stage[data-dragging='true'] .sc3__mobile-card { transition: none; }`

### Rewrite

- Entire old frame/tab geometry stack:
  - `.sc3__mobile-card-frame`
  - `.sc3__mobile-card-frame::before`
  - `.sc3__mobile-card--after .sc3__mobile-card-frame`
  - `.sc3__mobile-card--after .sc3__mobile-card-frame::before`
  - `--sc3-tab-offset` usage and all `clip-path` polygons
  - `.sc3__mobile-card-media` tab-height padding coupling
- Old tab label selectors:
  - `.sc3__mobile-tab-label*` replaced by `.sc3__mcard-tab*`
- Nested padding rules causing drift:
  - `.sc3__mobile-before-grid { padding: ... }`
  - `.sc3__mobile-card-frame--collage { padding: ... }`

### Partially keep (rename/refactor)

- `.sc3__mobile-before-grid` / `.sc3__mobile-output-grid` can be retained logically, but should be refactored to new neutral layout classes (`.sc3__mcard-layout*`) with zero outer padding.
- `.sc3__mobile-output--tl/tr/bl/br` area mapping can remain if you prefer minimal template churn.

---

## 4) Changes needed in `studio-showcase.ts`

### Expected JS impact: minimal

No logic changes to cycle/drag math.

Only selector updates if class names change:

- Controller currently queries before/after cards via `.sc3__mobile-card--before/--after` (keep these unchanged to avoid JS edits).
- If overlay/shadow is still applied through stage CSS vars, JS can remain untouched.

### Optional micro-adjustments

- If tab opacity should animate independently on the new `.sc3__mcard-tab`, keep existing vars (`--sc3-before-tag-opacity`, `--sc3-after-tag-opacity`) and just rebind CSS selectors.
- Re-validate passive offset calculation visually after new inner padding (no math rewrite initially).

---

## 5) Migration notes (deletions + sequencing)

### Delete from current CSS

1. All mobile `clip-path` polygons on frame and inset pseudo.
2. `--sc3-tab-offset` variable entirely.
3. `.sc3__mobile-card-frame--collage` special-case padding.
4. `.sc3__mobile-before-grid` outer padding.
5. Old `.sc3__mobile-tab-label--before/--after` positional offsets based on tab-offset.

### Replace with

1. New `.sc3__mcard` shell styles.
2. New `.sc3__mcard-tab` attached element styles.
3. New `.sc3__mcard-inner` single inset + top tab clearance.
4. Layout variants (`--single`, `--triple`, `--output`) with gap-only internals.

### Safe rollout sequence

1. Introduce new markup/classes alongside old styles (feature flag class on stage if needed).
2. Port BEFORE card first; verify tab edge aligns with media inset at multiple widths.
3. Port AFTER as mirrored variant (`right: var(--mcard-pad)`).
4. Rebind overlay/shadow/tag-opacity selectors.
5. Remove old frame/clip-path rules after parity checks.

### QA checklist

- Confirm at `900px`, `768px`, `600px`, `360px` widths:
  - Tab side edge lines up exactly with media inset edge.
  - Before and after cards mirror correctly.
  - Drag + auto-cycle z-swap still works.
  - Placeholder states still render with correct radius/background.

---

## Why this solves the root issue

The prior issue came from tab geometry being drawn in one coordinate system (clip-path on frame) while image inset was controlled in another (nested padding on descendants). This redesign anchors both tab edge and media inset to `--mcard-pad` on the **same positioned card root**, eliminating cross-context drift and nested offset accumulation.
