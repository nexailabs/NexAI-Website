# Gallery Upgrade — Metadata + Multi-Filter + Bulk Upload

## Context

Studio gallery has 30 items with minimal metadata (type, category). ~62 more creatives on Google Drive need curation, renaming, upload to ImageKit, and addition to the gallery. Goal: rich metadata on every creative with dropdown filters for brand, content type, and product category.

**Decisions locked:**

- `gallery.ts` = single source of truth (no ImageKit API for metadata)
- JSON manifest for curation workflow
- ImageKit Upload API script for bulk upload
- 3 dropdown filter pickers (brand, content type, product category)
- "Copy of" files are NOT duplicates — all need renaming

---

## Phase 1: Curation Manifest

### 1a. Generate manifest (`scripts/gallery-manifest.json`)

Claude creates a JSON file with all sources:

- **62 G Drive files** — pre-filled with inferred data (Soie brand from filename, `video` type from .mp4 extension, etc.)
- **30 existing ImageKit items** — pre-filled from current gallery.ts

```json
[
	{
		"id": 1,
		"source": "gdrive",
		"originalFile": "Copy of Copy of 03-C08.jpg",
		"include": true,
		"brand": "",
		"contentType": "",
		"productCategory": "",
		"alt": "",
		"newFilename": ""
	},
	{
		"id": 31,
		"source": "imagekit",
		"originalFile": "studio/showcase/yufta/yufta-output-01.jpg",
		"include": true,
		"brand": "yufta",
		"contentType": "photoshoot",
		"productCategory": "apparel",
		"alt": "Kurta set — full-length front view",
		"newFilename": "yufta-photoshoot-01.jpg"
	}
]
```

### 1b. User completes manifest

User fills in `brand`, `contentType`, `productCategory`, `alt` for each G Drive file. Claude pre-fills `newFilename` based on the pattern: `{brand}-{contentType}-{nn}.{ext}`

**Allowed values:**

- `brand`: yufta, selvia, rasvidha, xyxx, dbj, thrive, soilearth, leemboodi, soie, + any new brands
- `contentType`: photoshoot | ad | banner | video | ugc | lifestyle | flat-lay
- `productCategory`: apparel | jewelry | cosmetics | accessories

---

## Phase 2: Upload Pipeline

### 2a. Install ImageKit SDK

```bash
npm install imagekit --save-dev
```

### 2b. Create upload script (`scripts/upload-gallery.ts`)

Uses ImageKit private key stored in `.env`:

```
IMAGEKIT_PRIVATE_KEY=<private key>
IMAGEKIT_PUBLIC_KEY=<public key>
```

Script reads the completed manifest, then for each `include: true` G Drive item:

1. Reads file from `G:\Shared drives\AI Photoshoots\BEST SHOTS\GALLERY\{originalFile}`
2. Uploads to ImageKit folder `/studio/gallery/{brand}/` with `newFilename`
3. Logs the resulting ImageKit URL
4. Detects aspect ratio from image dimensions (portrait/landscape/square)

### 2c. Generate gallery.ts entries

After upload, script outputs the new `galleryItems` array entries ready to paste into `gallery.ts`.

---

## Phase 3: Code Changes

### 3a. Expand schema (`src/data/gallery.ts`)

```typescript
export type ContentType =
	| 'photoshoot'
	| 'ad'
	| 'banner'
	| 'video'
	| 'ugc'
	| 'lifestyle'
	| 'flat-lay';
export type ProductCategory = 'apparel' | 'jewelry' | 'cosmetics' | 'accessories';

export interface GalleryItem {
	src: string;
	alt: string;
	brand: string;
	contentType: ContentType;
	productCategory: ProductCategory;
	subcategory?: string; // granular: 'kurta-sets', 'saree', 'western-wear', etc.
	aspect: 'portrait' | 'landscape' | 'square';
	thumb?: string; // video poster frame
}
```

Migrate all 30 existing items to new schema:

- `category: 'kurta-sets'` → `productCategory: 'apparel', subcategory: 'kurta-sets', brand: 'yufta'`
- `category: 'jewelry'` → `productCategory: 'jewelry', brand: 'dbj'`
- `type: 'photo'` → `contentType: 'photoshoot'`
- Add `aspect` based on image dimensions

### 3b. Update filter definitions (`src/data/gallery.ts`)

```typescript
export const galleryFilters = {
	brand: [
		{ id: 'all', label: 'All Brands' },
		// populated from unique brands in galleryItems
	],
	contentType: [
		{ id: 'all', label: 'All Types' },
		{ id: 'photoshoot', label: 'Photoshoots' },
		{ id: 'ad', label: 'Ads' },
		{ id: 'banner', label: 'Banners' },
		{ id: 'video', label: 'Videos' },
		{ id: 'ugc', label: 'UGC' },
		{ id: 'lifestyle', label: 'Lifestyle' },
		{ id: 'flat-lay', label: 'Flat Lay' },
	],
	productCategory: [
		{ id: 'all', label: 'All Products' },
		{ id: 'apparel', label: 'Apparel' },
		{ id: 'jewelry', label: 'Jewelry' },
		{ id: 'cosmetics', label: 'Cosmetics' },
		{ id: 'accessories', label: 'Accessories' },
	],
};
```

### 3c. Update gallery page (`src/pages/studio/gallery.astro`)

**HTML changes:**

- Replace pill filter buttons with 3 styled `<select>` dropdowns
- Each dropdown gets a small muted label ("Brand", "Type", "Product")
- Add data attributes: `data-brand`, `data-content-type`, `data-product-category`
- Wire in `showcaseSrcset()` for responsive image loading (400w/800w/1200w)
- For `contentType === 'video'`: render `<video>` with `poster` + `preload="none"` instead of `<img>`

**JS changes:**

- Track 3 active filter values (activeBrand, activeType, activeCat)
- AND logic: item visible if ALL filters match
- `<select>` change event listeners update filters + call `applyFilters()`
- Masonry recalculation after filter change (existing logic)

**CSS changes:**

- Style the 3 dropdowns to match site aesthetic (dark bg, cyan accent)
- Video items: play icon overlay

---

## Files to create/modify

| File                             | Action | Description                                 |
| -------------------------------- | ------ | ------------------------------------------- |
| `scripts/gallery-manifest.json`  | CREATE | Curation spreadsheet for user to fill       |
| `scripts/upload-gallery.ts`      | CREATE | ImageKit bulk upload + rename script        |
| `.env`                           | CREATE | ImageKit API keys (gitignored)              |
| `src/data/gallery.ts`            | MODIFY | New schema, new items, new filters          |
| `src/pages/studio/gallery.astro` | MODIFY | Dropdown filters, video support, updated JS |
| `package.json`                   | MODIFY | Add `imagekit` dev dependency               |

---

## Execution Order

1. Generate manifest → User fills it → User confirms
2. Install SDK + create upload script → Run upload → Verify in ImageKit dashboard
3. Update gallery.ts schema + migrate existing 30 items
4. Add new items from upload results
5. Update gallery.astro filter UI + JS
6. Test all filters, masonry, video playback
7. Build + deploy

## Verification

1. `npm run build` — clean
2. All ~90 items display in gallery
3. Each dropdown filter works independently
4. Combined filters (AND) narrow correctly
5. Videos play inline with poster frames
6. Masonry handles mixed aspects
7. Mobile: dropdowns usable, 2-col grid works
8. Existing showcase/hero sections unaffected
