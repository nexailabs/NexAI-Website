# Gallery Upgrade — Final Plan

## Context

The studio gallery (`src/pages/studio/gallery.astro`) currently shows 30 hand-picked items with a 2-axis filter (type, category). We're scaling it to ~1,041 curated files from `H:\My Drive\AI PHOTOSHOOT BACKUP\Gallery\final gallery`, which arrive already cleanly named and brand-tagged.

**Goals**

1. Rich metadata on every item: brand, category, subcategory, type.
2. Four dropdown filters (Brand → Category → Subcategory → Type), with subcategory cascading from category.
3. Auto-generated curation manifest (filenames already encode the metadata).
4. Bulk upload script targeting a hierarchical ImageKit folder structure.

---

## Decisions locked

- **Source folder:** `H:\My Drive\AI PHOTOSHOOT BACKUP\Gallery\final gallery` — 1,041 files, all cleanly named except 1 missing `_01` suffix; 0 videos at present (videos arrive later).
- **`gallery.ts` is the single source of truth.** The website never queries the ImageKit API for metadata.
- **JSON manifest** (`scripts/gallery-manifest.json`) drives the curation workflow.
- **ImageKit folder structure:** `/studio/gallery/{brand}/{subcategory}/{filename}`. Existing `/studio/showcase/` and `/studio/hero/` trees are NOT touched.
- **4 dropdown filters:** Brand → Category → Subcategory → Type. Subcategory cascades from active Category.
- **Schema field names:** `brand`, `category`, `subcategory`, `type`. (Replaces old `contentType` / `productCategory`.)
- **Brand allowlist:** open. Any new brand auto-joins. Display labels live in a `brandLabels` map.
- **Two-token brand slugs:** `banno-swagger` is currently the only one. Parser maintains an explicit list.
- **No per-brand cap.** Use lazy-loading (`<img loading="lazy">`) and a "See more" pagination button.
- **Videos:** schema-supported (`type: 'video'`), placed in the same `{brand}/{subcategory}/` folder as images. None in the current batch.
- **Existing 30 ImageKit items:** migrated to new schema. URLs unchanged.

---

## Brand display labels

Used by the Brand dropdown and any brand-name surface in the UI.

| slug          | display label         |
| ------------- | --------------------- |
| banno-swagger | Banno Swagger         |
| dbj           | Dhwani Bansal Jewelry |
| indoera       | Indoera               |
| leemboodi     | Leemboodi             |
| muwin         | Muwin                 |
| rasvidha      | Rasvidha              |
| skylee        | Skylee                |
| xeba-botanica | XEBA Botanica         |
| yufta         | Yufta                 |
| soie          | Soie                  |
| selvia        | Selvia                |
| xyxx          | XYXX                  |
| thrive        | Thrive                |
| soilearth     | Soil & Earth          |

---

## Filter system

### 1. Brand

Open enum, auto-populated from data. Rendered via `brandLabels`.

### 2. Category (top-level)

```ts
type Category = 'apparel' | 'jewelry' | 'cosmetics' | 'accessories';
```

Labels: All Categories, Apparel, Jewelry, Cosmetics, Accessories.

### 3. Subcategory (cascades from Category)

```ts
type Subcategory =
	// Apparel
	| 'saree'
	| 'ethnic-wear'
	| 'kurta-set'
	| 'western-dress'
	| 'western-top'
	| 'western-bottom'
	| 'western-wear'
	| 'co-ord-set'
	| 'nightsuit'
	| 'innerwear'
	// Jewelry
	| 'earring'
	| 'necklace'
	| 'bracelet'
	| 'ring'
	| 'jewelry-set'
	// Cosmetics (future)
	| 'lipstick'
	| 'fragrance'
	| 'skincare'
	// Accessories (future)
	| 'bag'
	| 'belt'
	| 'sunglasses';
```

The Subcategory dropdown only shows options whose Category matches the active Category. Resets to "All" if the current value is invalid for the new Category.

### 4. Type

```ts
type CreativeType = 'pdp' | 'ad' | 'banner' | 'video' | 'ugc' | 'lifestyle' | 'flat-lay';
```

Labels: All Types, PDP, Ad, Banner, Video, UGC, Lifestyle, Flat Lay.

Filter logic across all four: AND.

---

## Filename → metadata parser

Source files follow `{brand}_{categoryToken}_{typeToken}_{variantTokens...}_{nn}.{ext}` (with `banno_swagger` as a two-token brand).

### Parser steps

1. Lowercase the filename.
2. Strip extension. Split on `_`.
3. **Brand:** if the first two tokens equal `banno_swagger`, brand slug = `banno-swagger`, consume 2 tokens. Otherwise brand slug = first token.
4. **Category/subcategory tokens:** depends on the brand:
   - apparel brands: `sarees|saree`, `ethnicwear`, `westernwear_dress`, `westernwear_top`, `westernwear_co_ord_set`, `nightsuit`, `kurta_sets|kurta_set`
   - jewelry brand `dbj`: `earring`, `necklace`, `necklace_earring_set`, `earrings_bracelet_set`, `necklace_earring_bracelet_set`
5. **Type:** `pdp` → `pdp`, `ads|ad` → `ad`.
6. **Variant tokens:** the remainder before the trailing `_NN`. Joined with spaces for alt text.
7. **Trailing index:** the `_NN` suffix. The one missing-index file (`dbj_earring_ads_gold_hoop`) is auto-renamed to `_01` on upload.

### Token → schema mapping

| filename token                  | category | subcategory    |
| ------------------------------- | -------- | -------------- |
| `sarees`, `saree`               | apparel  | saree          |
| `ethnicwear`                    | apparel  | ethnic-wear    |
| `kurta_sets`, `kurta_set`       | apparel  | kurta-set      |
| `westernwear_dress`             | apparel  | western-dress  |
| `westernwear_top`               | apparel  | western-top    |
| `westernwear_bottom`            | apparel  | western-bottom |
| `westernwear_co_ord_set`        | apparel  | co-ord-set     |
| `nightsuit`                     | apparel  | nightsuit      |
| `boxer`                         | apparel  | innerwear      |
| `earring`                       | jewelry  | earring        |
| `necklace`                      | jewelry  | necklace       |
| `necklace_earring_set`          | jewelry  | jewelry-set    |
| `earrings_bracelet_set`         | jewelry  | jewelry-set    |
| `necklace_earring_bracelet_set` | jewelry  | jewelry-set    |

| filename token | type |
| -------------- | ---- |
| `pdp`          | pdp  |
| `ads`, `ad`    | ad   |

### Canonicalization on upload

- Lowercase all output filenames (DBJ folder has mixed `Earrings_*_Ads_*` casing).
- `sarees` and `saree` both map to `subcategory: 'saree'`. Source filenames are preserved as-is on disk; uploaded filenames are lowercased.
- One rename: `dbj_earring_ads_gold_hoop.png` → `dbj_earring_ads_gold_hoop_01.png`. Done by the upload script when invoked with `--fix-names`.

---

## Auto-generated alt text

Pattern:

```
{Brand display label} — {subcategory label} in {variant tokens, joined with spaces}
```

Examples:

- `Banno Swagger — saree in maroon gold` (file `banno_swagger_saree_pdp_maroon_gold_01.jpeg`)
- `Dhwani Bansal Jewelry — earring in orange crystal hoop` (file `dbj_earring_pdp_orange_crystal_hoop_01.jpg`)
- `Leemboodi — ethnic wear in pink floral` (file `leemboodi_ethnicwear_pdp_pink_floral_03.jpg`)

Per-image overrides supported in the manifest: if a row has `manualOverride: true`, its `alt` is preserved across regeneration.

---

## Schema (`src/data/gallery.ts`)

```typescript
export type Category = 'apparel' | 'jewelry' | 'cosmetics' | 'accessories';

export type Subcategory =
	| 'saree'
	| 'ethnic-wear'
	| 'kurta-set'
	| 'western-dress'
	| 'western-top'
	| 'western-bottom'
	| 'western-wear'
	| 'co-ord-set'
	| 'nightsuit'
	| 'innerwear'
	| 'earring'
	| 'necklace'
	| 'bracelet'
	| 'ring'
	| 'jewelry-set'
	| 'lipstick'
	| 'fragrance'
	| 'skincare'
	| 'bag'
	| 'belt'
	| 'sunglasses';

export type CreativeType = 'pdp' | 'ad' | 'banner' | 'video' | 'ugc' | 'lifestyle' | 'flat-lay';

export interface GalleryItem {
	src: string;
	alt: string;
	brand: string;
	category: Category;
	subcategory: Subcategory;
	type: CreativeType;
	aspect: 'portrait' | 'landscape' | 'square';
	thumb?: string; // video poster frame
}

export const brandLabels: Record<string, string> = {
	'banno-swagger': 'Banno Swagger',
	dbj: 'Dhwani Bansal Jewelry',
	leemboodi: 'Leemboodi',
	rasvidha: 'Rasvidha',
	yufta: 'Yufta',
	soie: 'Soie',
	selvia: 'Selvia',
	xyxx: 'XYXX',
	thrive: 'Thrive',
	soilearth: 'Soil & Earth',
};

export const subcategoryByCategory: Record<Category, Subcategory[]> = {
	apparel: [
		'saree',
		'ethnic-wear',
		'kurta-set',
		'western-dress',
		'western-top',
		'western-bottom',
		'western-wear',
		'co-ord-set',
		'nightsuit',
		'innerwear',
	],
	jewelry: ['earring', 'necklace', 'bracelet', 'ring', 'jewelry-set'],
	cosmetics: ['lipstick', 'fragrance', 'skincare'],
	accessories: ['bag', 'belt', 'sunglasses'],
};
```

If the array grows past ~1,200 lines, split generated items into `gallery-items.generated.ts` and re-export.

### Migration of existing 30 items

| Old shape                  | New shape                                                           |
| -------------------------- | ------------------------------------------------------------------- |
| `category: 'kurta-sets'`   | brand `yufta`, category `apparel`, subcategory `kurta-set`          |
| `category: 'western-wear'` | brand `selvia`, category `apparel`, subcategory `western-dress`     |
| `category: 'saree'`        | brand `rasvidha` or `leemboodi`, category `apparel`, sub `saree`    |
| `category: 'menswear'`     | brand `xyxx`, category `apparel`, sub `western-top` (TBD)           |
| `category: 'jewelry'`      | brand `dbj`, category `jewelry`, sub inferred per file              |
| `category: 'cosmetics'`    | brand `thrive` or `soilearth`, category `cosmetics`, sub `skincare` |
| `type: 'photo'`            | `type: 'pdp'`                                                       |
| (no aspect)                | `aspect`: detected from image dims by upload script                 |

URLs unchanged — existing items keep their `/studio/showcase/...` and `/studio/hero/...` paths.

---

## Phase 1 — Curation manifest

### 1a. Auto-generate manifest (`scripts/build-gallery-manifest.ts`)

1. Lists all files in the source folder.
2. Parses each filename via the parser above.
3. Generates auto-alt text.
4. Computes `destPath = /studio/gallery/{brand}/{subcategory}/{lowercased-filename}`.
5. Writes `scripts/gallery-manifest.json` with `include: true` and `manualOverride: false` defaults.

Example entry:

```json
{
	"id": 1,
	"source": "gdrive",
	"originalPath": "H:\\My Drive\\AI PHOTOSHOOT BACKUP\\Gallery\\final gallery\\banno_swagger_saree_pdp_maroon_gold_01.jpeg",
	"destPath": "/studio/gallery/banno-swagger/saree/banno_swagger_saree_pdp_maroon_gold_01.jpeg",
	"include": true,
	"brand": "banno-swagger",
	"category": "apparel",
	"subcategory": "saree",
	"type": "pdp",
	"alt": "Banno Swagger — saree in maroon gold",
	"manualOverride": false
}
```

### 1b. Review

Rahul scans the manifest. Most rows are correct (filenames are trustworthy). Edits any wrong inferences (set `manualOverride: true` so future regenerations preserve the edit). Toggles `include: false` for any rejects.

---

## Phase 2 — Upload pipeline

### 2a. Install ImageKit SDK

```bash
npm install imagekit --save-dev
```

### 2b. `.env`

```
IMAGEKIT_PRIVATE_KEY=<from reference_imagekit memory>
IMAGEKIT_PUBLIC_KEY=<from reference_imagekit memory>
```

(`.env` is gitignored.)

### 2c. `scripts/upload-gallery.ts`

For each manifest entry where `include: true`:

1. Skip if file is already at `destPath` on ImageKit (idempotent — safe to re-run).
2. Read source file from disk.
3. Upload to ImageKit at `destPath` (`folder = /studio/gallery/{brand}/{subcategory}`, `fileName = lowercased filename`).
4. Read returned dimensions, classify aspect (portrait/landscape/square).
5. Append a typed entry to `scripts/gallery-items.generated.ts`.

Run output:

- `gallery-items.generated.ts` — paste-ready array of `GalleryItem`.
- Console summary: total uploaded, skipped, failed; aspect ratio breakdown; any parser warnings.

### 2d. Source-folder rename

Before running upload (or via `--fix-names`): rename `dbj_earring_ads_gold_hoop.png` → `dbj_earring_ads_gold_hoop_01.png`.

---

## Phase 3 — Code changes

### 3a. `src/data/gallery.ts`

- Add new types (`Category`, `Subcategory`, `CreativeType`).
- Replace `GalleryItem` interface.
- Migrate the existing 30 entries to the new shape (URLs unchanged).
- Append generated entries from `gallery-items.generated.ts` (or import + re-export).
- Add `brandLabels` and `subcategoryByCategory` exports.

### 3b. `src/pages/studio/gallery.astro`

**Filter UI**

- Replace pill filter buttons with 4 styled `<select>` dropdowns.
- Mobile: collapse into a single "Filters" button → bottom sheet with all 4 controls.
- Desktop: 4 inline dropdowns above the grid, each with a small Plus-Jakarta-Sans label.
- Subcategory dropdown's options refresh whenever Category changes.

**JS logic**

- Track `activeBrand`, `activeCategory`, `activeSubcategory`, `activeType`.
- AND filter logic.
- Masonry recalculates after each filter change.
- Pagination: render 60 items at a time. "See more" button reveals next 60. All images use `loading="lazy"`.

**Video rendering**

- `type === 'video'` → `<video preload="none" poster={thumb}>` with play-on-click.
- Otherwise → `<img loading="lazy">`.

**CSS**

- Dropdowns styled to match site aesthetic (dark surface, teal accent on hover/focus).
- Video items get a play-icon overlay.
- No per-component font declarations — rely on `global.css` recipes + utilities.

---

## Files to create / modify

| File                                 | Action | Description                                                |
| ------------------------------------ | ------ | ---------------------------------------------------------- |
| `scripts/build-gallery-manifest.ts`  | CREATE | Parses source folder, writes manifest.                     |
| `scripts/gallery-manifest.json`      | CREATE | Curation source of truth (committed for review).           |
| `scripts/upload-gallery.ts`          | CREATE | Reads manifest, uploads to ImageKit, emits generated.ts.   |
| `scripts/gallery-items.generated.ts` | CREATE | Auto-generated array of `GalleryItem` entries.             |
| `.env`                               | UPDATE | Add ImageKit keys (gitignored).                            |
| `src/data/gallery.ts`                | MODIFY | New schema, migrated existing items, brandLabels, cascade. |
| `src/pages/studio/gallery.astro`     | MODIFY | 4 cascading dropdowns, video support, pagination.          |
| `package.json`                       | MODIFY | Add `imagekit` dev dependency.                             |

Memories already saved:

- `project_brand_display_labels.md` — slug → display label table.
- `project_gallery_filters.md` — locked 4-filter system.

---

## Execution order

1. **Phase 1** — Build manifest builder + manifest. Rahul reviews. (Manifest is the gate; nothing uploads until reviewed.)
2. **Phase 2** — Install SDK, write `.env`, run upload script, verify in ImageKit dashboard.
3. **Phase 3a** — Migrate existing 30 items. Append generated items. Add `brandLabels` + `subcategoryByCategory`.
4. **Phase 3b** — Rewrite gallery.astro filter UI + JS for 4 cascading dropdowns + video + pagination.
5. **Test** — All filters work independently; AND logic correct; cascade behavior correct; pagination works; mobile sheet works; no regression on showcase / hero strips on home / studio pages.
6. **Build** — `npm run build`, sanity-check page count, font-guard clean.
7. **Deploy** — push to main; Cloudflare Pages auto-deploys.

---

## Verification

- `npm run build` is clean (no type errors, no font-guard failures).
- ~1,071 items render in the gallery (30 existing + ~1,041 new, minus any rejects).
- Brand dropdown auto-populates with all unique brands in data, displayed via `brandLabels`.
- Subcategory dropdown cascades correctly from Category; resets if invalid.
- AND filter logic narrows correctly across all 4 axes.
- Videos: when added later, render with poster + play-on-click.
- Masonry handles mixed aspects without layout flicker.
- Mobile: filter sheet usable, 2-column grid, dropdowns thumb-friendly.
- Existing showcase / hero strips on home / studio pages render identically (no URL drift).

---

## Future work (explicit non-goals for this batch)

- Refactor tripartite `/showcase/`, `/hero/`, `/gallery/` into `/studio/{brand}/{purpose}/...` (would group all assets per brand in a single tree).
- Add a Shot Style filter (on-model / flat-lay / detail / on-form).
- Adopt aspect ratio as a sort/layout toggle.
- Per-brand featured strip at top of gallery.
- Before/after pairs for AI shoots.
- Cosmetics / accessories subcategories will be filled in once content arrives.
- Videos will arrive in a later batch and be processed through the same pipeline.
