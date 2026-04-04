# Mobile Before/After Showcase Card Redesign Plan

## Goals

- Remove the split-coordinate bug between tab geometry and image insets.
- Keep the existing mobile interaction model (`--sc3-before-*`, `--sc3-after-*` CSS variables) and tab/drag behavior.
- Preserve current visual language (dark card, teal border, bookmark tab, image bento layouts), while simplifying DOM and CSS architecture.

---

## 1) Proposed HTML Structure (single geometry owner)

Use one shared card shell structure for both BEFORE and AFTER. The shell owns **both** card inset and tab position through one variable (`--sc3-card-inset`).

```astro
<div class="sc3__mobile-stage">
	<article class="sc3__mobile-card sc3__mobile-card--before" data-side="before">
		<div class="sc3__mobile-shell sc3__mobile-shell--before">
			<span class="sc3__mobile-tab">Before</span>

			<div class="sc3__mobile-content sc3__mobile-layout sc3__mobile-layout--before">
				<!-- variant A: single image -->
				<div class="sc3__tile sc3__tile--solo">...</div>

				<!-- variant B: 3-image split -->
				<div class="sc3__tile sc3__tile--main">...</div>
				<div class="sc3__stack">
					<div class="sc3__tile sc3__tile--side">...</div>
					<div class="sc3__tile sc3__tile--side">...</div>
				</div>
			</div>
		</div>
	</article>

	<article class="sc3__mobile-card sc3__mobile-card--after" data-side="after">
		<div class="sc3__mobile-shell sc3__mobile-shell--after">
			<span class="sc3__mobile-tab">After</span>

			<div class="sc3__mobile-content sc3__mobile-layout sc3__mobile-layout--output">
				<div class="sc3__tile sc3__tile--tl">...</div>
				<div class="sc3__tile sc3__tile--tr">...</div>
				<div class="sc3__tile sc3__tile--bl">...</div>
				<div class="sc3__tile sc3__tile--br">...</div>
			</div>
		</div>
	</article>
</div>
```

### Structure notes

- Keep `.sc3__mobile-stage` and `.sc3__mobile-card--before/--after` so `studio-showcase.ts` continues targeting current elements.
- Replace `sc3__mobile-card-frame`, `::before` clipping layer, and `sc3__mobile-card-media` with a single `.sc3__mobile-shell` (one visual owner).
- Move both BEFORE and AFTER internals to a shared `.sc3__mobile-content` container (no extra inset wrappers with competing paddings).

---

## 2) New CSS Architecture

## Core principle

Define one inset token and consume it in both places:

- shell `padding` (content inset)
- tab `left/right` anchor

```css
--sc3-card-inset: 0.56rem;
```

That means tab edge and media edge are mathematically tied by the same property in the same box model.

## Recommended tab implementation: real DOM tab (Approach B)

Avoid clip-path for the whole frame. Use a true shell rectangle and a true tab child.

### Shell

```css
.sc3__mobile-shell {
	--sc3-card-inset: 0.56rem;
	--sc3-tab-h: 1.48rem;
	--sc3-tab-w: 5.5rem;
	--sc3-gap: 0.45rem;
	--sc3-radius: 1.2rem;
	--sc3-tile-radius: 0.9rem;

	position: relative;
	height: 100%;
	border-radius: var(--sc3-radius);
	border: 1px solid rgba(78, 201, 180, 0.4);
	background: rgba(15, 30, 28, 0.9);
	padding: calc(var(--sc3-card-inset) + var(--sc3-tab-h)) var(--sc3-card-inset)
		var(--sc3-card-inset);
	overflow: hidden;
}
```

### Tab

```css
.sc3__mobile-tab {
	position: absolute;
	top: 0;
	height: var(--sc3-tab-h);
	width: var(--sc3-tab-w);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font: 800 0.62rem/1 var(--font, inherit);
	letter-spacing: 0.09em;
	text-transform: uppercase;
	color: #fff;
	background: rgba(78, 201, 180, 0.16);
	border: 1px solid rgba(78, 201, 180, 0.52);
}

/* BEFORE: tab starts exactly where image inset starts */
.sc3__mobile-shell--before .sc3__mobile-tab {
	left: var(--sc3-card-inset);
	border-radius: 0 0 0.65rem 0.65rem;
}

/* AFTER: mirrored anchor */
.sc3__mobile-shell--after .sc3__mobile-tab {
	right: var(--sc3-card-inset);
	border-radius: 0 0 0.65rem 0.65rem;
}
```

### Content area and tiles

```css
.sc3__mobile-content {
	width: 100%;
	height: 100%;
	min-height: 0;
}

.sc3__tile {
	overflow: hidden;
	border-radius: var(--sc3-tile-radius);
	background: rgba(255, 255, 255, 0.04);
}

.sc3__tile > img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center top;
	display: block;
}
```

### Layout variants

- **1 image**: `.sc3__mobile-layout--single { display:block; }` + tile fills area.
- **3 images**: `.sc3__mobile-layout--before` as `grid-template-columns: 1.86fr 1fr`, right side is `.sc3__stack` with one or two rows.
- **4 images (after output)**: keep current asymmetric 2x3 placement via named areas or existing `--tl/tr/bl/br` classes.

```css
.sc3__mobile-layout--before {
	display: grid;
	grid-template-columns: 1.86fr 1fr;
	gap: var(--sc3-gap);
}

.sc3__stack {
	display: grid;
	grid-template-rows: 1fr;
	gap: var(--sc3-gap);
}

.sc3__stack--double {
	grid-template-rows: 1fr 1fr;
}

.sc3__mobile-layout--output {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: repeat(3, 1fr);
	gap: var(--sc3-gap);
}
```

## Animation and active/passive states

Keep current transforms/z-index controlled by `.sc3__mobile-card--before` and `.sc3__mobile-card--after` using existing custom properties.

Migrate shadow/filter/overlay from `.sc3__mobile-card-frame` to `.sc3__mobile-shell`.

---

## 3) Keep vs Rewrite Matrix

## Keep (with little/no change)

- `.sc3__mobile-stage` custom property contract (`--sc3-before-x`, `--sc3-after-x`, etc.).
- `.sc3__mobile-card`, `.sc3__mobile-card--before`, `.sc3__mobile-card--after` transforms and z-index behavior.
- Placeholder SVG/content logic.
- Output image slot ordering `[1,2,0,3]` and output cell mapping.

## Rewrite (required)

- `sc3__mobile-card-frame` and all shape clip-path rules.
- `sc3__mobile-card-frame::before` border illusion and mirrored clip-path override.
- `sc3__mobile-card-media` (tab clearance via `padding-top`) pattern.
- `sc3__mobile-card-frame--collage` separate padding path.
- `sc3__mobile-tab-label--before/--after` offset logic tied to `--sc3-tab-offset`.
- `sc3__mobile-before-grid`/`sc3__mobile-output-grid` wrappers where they duplicate inset responsibility.

---

## 4) studio-showcase.ts impact

Expected JS changes are minimal.

## No behavioral changes needed

- Drag + auto-cycle logic should continue unchanged, because it targets:
  - `.sc3__mobile-stage`
  - `.sc3__mobile-card--before`
  - `.sc3__mobile-card--after`

## Small selector updates likely required

If JS currently queries `.sc3__mobile-card-frame` for visual updates (e.g., transition toggles), retarget to `.sc3__mobile-shell`.

Potential direct replacements:

- `.sc3__mobile-card-frame` → `.sc3__mobile-shell`
- `.sc3__mobile-tab-label--before/--after` → `.sc3__mobile-shell--before .sc3__mobile-tab` and `.sc3__mobile-shell--after .sc3__mobile-tab`

No changes are needed to custom property names or interpolation math.

---

## 5) Migration / Deletion Checklist

Delete these mobile-only legacy pieces after new shell is in place:

1. `--sc3-tab-offset` variable and all calc() usage tied to clip-path polygon points.
2. `.sc3__mobile-card-frame` clip-path polygons (before and mirrored after).
3. `.sc3__mobile-card-frame::before` inset + mirrored clip-path border simulation.
4. `.sc3__mobile-card-media { padding-top: var(--sc3-tab-height) }` compensation layer.
5. Duplicate inset values:
   - `.sc3__mobile-before-grid { padding: 0.5rem }`
   - `.sc3__mobile-card-frame--collage { padding: 0.55rem }`
6. Old tab label offset classes:
   - `.sc3__mobile-tab-label--before`
   - `.sc3__mobile-tab-label--after`

After deletion, there should be exactly one inset authority for mobile cards: `--sc3-card-inset` on `.sc3__mobile-shell`.

---

## Rollout Strategy (safe sequence)

1. Introduce new HTML classes + new CSS behind current mobile media query.
2. Keep JS untouched and verify transforms/drag still function.
3. Move shadow/overlay transitions to `.sc3__mobile-shell`.
4. Delete legacy frame/clip-path CSS.
5. Final visual QA at widths 360, 390, 430, 768, 900.

This sequence avoids breaking interaction while the visual structure is swapped.
