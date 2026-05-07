# Gallery — Add Images & Videos (Skill)

Self-contained guide + reference scripts for any AI/engineer to add new creatives to the studio gallery at `/studio/gallery`. **Read top to bottom — everything you need is here.**

This folder is a portable bundle:

```
docs/gallery-skill/
├── README.md         ← you are here
├── .env.example      ← credential template (no real secrets)
└── scripts/          ← mirror copies of the runtime scripts in /scripts/, for AI reference
    ├── build-gallery-manifest.mjs
    ├── upload-gallery.mjs
    └── sync-manifest-excludes.mjs
```

The **runtime scripts** live in `/scripts/` at repo root. The copies here are for reading/reasoning. To execute, always run the `/scripts/` versions.

---

## TL;DR

1. Drop files into the source folder (filename must follow the convention below).
2. Run `node scripts/build-gallery-manifest.mjs` — emits `scripts/gallery-manifest.json`. Inspect the `[failures]` section if any.
3. Run `node scripts/upload-gallery.mjs` — uploads new files only (idempotent). Images → ImageKit, videos → Cloudflare R2.
4. The script writes `src/data/gallery-items.generated.ts`. Commit + deploy, or just refresh dev server.

That's it. The site picks them up automatically.

---

## Architecture

| asset type                       | host              | why                                                                         |
| -------------------------------- | ----------------- | --------------------------------------------------------------------------- |
| Images (`.jpg/.jpeg/.png/.webp`) | **ImageKit**      | Cheap CDN with on-the-fly transforms (srcset 400/800/1200w)                 |
| Videos (`.mp4/.mov/.webm`)       | **Cloudflare R2** | ImageKit free tier blocks video transformations. R2 has zero egress fees.   |
| Video poster `.poster.jpg`       | **Cloudflare R2** | Auto-extracted by ffmpeg at 1 s offset, uploaded as a sibling to each video |

The pipeline reads from local disk, processes (sharp for images, ffmpeg for videos), uploads, and emits `src/data/gallery-items.generated.ts` — a typed `GalleryItem[]` that the page consumes.

**Poster URL derivation (videos)**: posters are not stored as a `thumb` field on each `GalleryItem`. The page derives them at render time by replacing the `.mp4` extension with `.poster.jpg` (see `videoPoster()` in `src/pages/studio/gallery.astro`). The upload script writes the poster as a sibling file in R2 at the same key with `.poster.jpg` suffix, so the derivation always points to a valid URL.

---

## Required credentials

Copy `.env.example` to `.env` at repo root (gitignored) and fill in real values. Keys come from the respective dashboards:

```
# ImageKit (images) — https://imagekit.io/dashboard
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<your-endpoint>

# Cloudflare R2 (videos) — https://dash.cloudflare.com → R2
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=website-videos
R2_PUBLIC_URL=https://pub-<32-char-hash>.r2.dev

# Local source directories the manifest builder walks (recursive). REQUIRED on
# Mac/Linux because the script's defaults are Windows paths. Comma-separated.
GALLERY_SOURCE_DIRS=/Users/me/Drive/Gallery,/Volumes/Shared/VIDEOS
```

The R2 bucket needs **Public Access** enabled (Settings tab in the bucket → Allow Access on the r2.dev subdomain).

ffmpeg/ffprobe ship as bundled binaries via `@ffmpeg-installer/ffmpeg` + `@ffprobe-installer/ffprobe` npm packages — **no system install required**. `npm install` is the only setup step.

If `.env` is missing when you run `upload-gallery.mjs`, the script aborts with a friendly pointer to `.env.example`. If you only need image uploads (no videos), the R2 vars can stay blank — pre-flight check skips R2 when no videos are queued.

---

## Source folders

The manifest builder walks every directory listed in `GALLERY_SOURCE_DIRS` (set in `.env` — see Required credentials above) recursively. If the env var is unset, the script falls back to these Windows defaults:

```
H:\My Drive\AI PHOTOSHOOT BACKUP\Gallery\final gallery\          (master image folder)
G:\Shared drives\AI Photoshoots\VIDEO GALLERY\                   (videos + 3-set bundles in subfolders)
```

Mac/Linux operators must set `GALLERY_SOURCE_DIRS` — the defaults won't work.

To add new files: drop them anywhere in these directories. Subfolders are fine — the walker is recursive. Junk like `desktop.ini` is filtered automatically.

---

## Filename convention (CRITICAL)

Every file MUST follow:

```
{brand}_{category-tokens}_{type}_{variant-tokens...}_{NN}.{ext}
```

### Examples

| filename                                      | brand                   | category     | type  | variant       | index |
| --------------------------------------------- | ----------------------- | ------------ | ----- | ------------- | ----- |
| `yufta_ethnicwear_pdp_navy_blue_03.jpg`       | yufta                   | ethnic-wear  | pdp   | navy blue     | 03    |
| `banno_swagger_westernwear_video_blue_01.mp4` | banno-swagger (2-token) | western-wear | video | blue          | 01    |
| `dbj_earring_ads_gold_hoop_01.png`            | dbj                     | earring      | ad    | gold hoop     | 01    |
| `rasvidha_sarees_pdp_mustard_white_05.jpg`    | rasvidha                | saree        | pdp   | mustard white | 05    |

### Rules the parser handles automatically

- **Lowercasing**: `Banno Swagger_Ethnicwear_PDP_*` works (lowercased on parse).
- **Spaces → underscores**: `banno swagger_*.mp4` is treated as `banno_swagger_*.mp4`.
- **Duplicated extension**: `_01mp4.mp4` → trailing token normalized to `_01`.
- **Two-token brands**: `banno_swagger`, `dhwani_bansal_jewellery`, `xeba_botanica` are recognized as multi-token brand prefixes.
- **Common typos**: `ethicwear` → `ethnicwear`; `hewellery` → `jewellery`.
- **Missing index**: trailing `_NN` missing → auto-renamed to `_01` on upload (source file untouched).

---

## Allowed values (current state)

### Brand slugs → display labels

| slug            | display label         |
| --------------- | --------------------- |
| `banno-swagger` | Banno Swagger         |
| `dbj`           | Dhwani Bansal Jewelry |
| `indoera`       | Indoera               |
| `leemboodi`     | Leemboodi             |
| `muwin`         | Muwin                 |
| `rasvidha`      | Rasvidha              |
| `selvia`        | Selvia                |
| `skylee`        | Skylee                |
| `soie`          | Soie                  |
| `soilearth`     | Soil & Earth          |
| `thrive`        | Thrive                |
| `xeba-botanica` | XEBA Botanica         |
| `xyxx`          | XYXX                  |
| `yufta`         | Yufta                 |

Defined in `src/data/gallery.ts` (`brandLabels`) and mirrored in `scripts/build-gallery-manifest.mjs` (`BRAND_LABELS`).

### Brand-prefix aliases (parser-level multi-token detection)

| filename prefix (after lowercasing + spaces→underscores) | canonical slug |
| -------------------------------------------------------- | -------------- |
| `banno_swagger`                                          | banno-swagger  |
| `dhwani_bansal_jewellery` (UK)                           | dbj            |
| `dhwani_bansal_jewelry` (US)                             | dbj            |
| `xeba_botanica`                                          | xeba-botanica  |

Defined in `BRAND_PREFIX_ALIASES` in `scripts/build-gallery-manifest.mjs`. Add new two-token brands here.

**Single-token brands shadowed by multi-token aliases**: the parser sorts aliases by length (longest first), so a multi-token prefix like `banno_swagger` always wins over a hypothetical single-token brand `banno`. If two brands collide on a leading token, the longer prefix wins.

### Categories (top-level)

`apparel | jewelry | cosmetics | accessories`

### Subcategories (cascade per category)

- **Apparel**: `saree | ethnic-wear | kurta-set | western-dress | western-top | western-bottom | western-wear | co-ord-set | nightsuit | innerwear`
- **Jewelry**: `earring | necklace | bracelet | ring | jewelry-set`
- **Cosmetics**: `skincare | fragrance | lipstick`
- **Accessories**: `bag | belt | sunglasses`

### Filename-token → schema mapping (the parser's source of truth)

| filename token                                                                                                   | category    | subcategory    |
| ---------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `sarees` / `saree`                                                                                               | apparel     | saree          |
| `ethnicwear` (typo `ethicwear`)                                                                                  | apparel     | ethnic-wear    |
| `kurta_sets` / `kurta_set`                                                                                       | apparel     | kurta-set      |
| `westernwear_dress`                                                                                              | apparel     | western-dress  |
| `westernwear_top`                                                                                                | apparel     | western-top    |
| `westernwear_bottom`                                                                                             | apparel     | western-bottom |
| `westernwear_co_ord_set`                                                                                         | apparel     | co-ord-set     |
| `westernwear` (alone)                                                                                            | apparel     | western-wear   |
| `nightsuit`                                                                                                      | apparel     | nightsuit      |
| `boxer`                                                                                                          | apparel     | innerwear      |
| `earring`                                                                                                        | jewelry     | earring        |
| `necklace`                                                                                                       | jewelry     | necklace       |
| `necklace_earring_set`, `earrings_bracelet_set`, `necklace_earring_bracelet_set`, `jewellery` (typo `hewellery`) | jewelry     | jewelry-set    |
| `skincare`                                                                                                       | cosmetics   | skincare       |
| `fragrance`                                                                                                      | cosmetics   | fragrance      |
| `lipstick`                                                                                                       | cosmetics   | lipstick       |
| `bag`                                                                                                            | accessories | bag            |
| `belt`                                                                                                           | accessories | belt           |
| `sunglasses`                                                                                                     | accessories | sunglasses     |

Defined in `CATEGORY_TOKEN_MAP` in `scripts/build-gallery-manifest.mjs`. Order matters — longest matches first.

### Brand-slug derivation rule

When introducing a new brand, derive the slug from the brand's marketing name:

- Lowercase
- Kebab-case (hyphens between words)
- Drop generic suffixes like "Beauty" / "Co" / "Studio" / "Inc" unless they're load-bearing for the brand identity
- Examples: "Nykaa Beauty" → `nykaa`, "Banno Swagger" → `banno-swagger` (kept because it's part of the brand identity), "DBJ" / "Dhwani Bansal Jewelry" → `dbj` (acronym chosen to keep slug short)

### Creative types

`pdp | ad | banner | video | ugc | lifestyle | flat-lay`

| filename token | type                            |
| -------------- | ------------------------------- |
| `pdp`          | pdp (product detail page shoot) |
| `ads` / `ad`   | ad                              |
| `video`        | video                           |

`banner`, `ugc`, `lifestyle`, `flat-lay` are valid in the schema but no current parser tokens — add to `TYPE_TOKEN_MAP` if needed.

---

## Step-by-step: add new content

### 1. Drop the files

Drop them into any directory listed in `GALLERY_SOURCE_DIRS` in your `.env`. Subfolders are fine (e.g. "Full Set 1" for a coordinated bundle). Mixed images and videos in the same directory is fine — the script dispatches by extension.

### 2. Build/refresh the manifest

```bash
node scripts/build-gallery-manifest.mjs
```

Output:

- Total file count, breakdown by brand / brand+subcategory / type
- `[failures]` — files the parser couldn't classify (zero is the goal)
- `[warnings]` — files with minor issues (e.g. missing trailing index — auto-fixed on upload)

If failures appear, common causes:

- Unknown brand prefix → add slug to `brandLabels` in `src/data/gallery.ts` and `BRAND_LABELS` in the script (and `BRAND_PREFIX_ALIASES` if multi-token)
- Unknown category token → add to `CATEGORY_TOKEN_MAP` AND `Subcategory` type AND `subcategoryByCategory` map AND `subcategoryLabels` map in `src/data/gallery.ts`
- Missing `_pdp_` / `_ads_` / `_video_` slot → rename source file

The manifest is **idempotent**: re-running preserves user-edited fields (`include`, `excludeReason`, `manualOverride`, manually-edited `alt` text).

### 3. (Optional) Review `scripts/gallery-manifest.json`

Each row has the parsed shape. To exclude an item, set `"include": false`. Re-runs preserve the override.

### 4. Upload

```bash
node scripts/upload-gallery.mjs
```

Behavior:

- Skips items already present in `scripts/upload-progress.json` (idempotent — safe to re-run).
- Images → resized to max 2000px + JPG q85 via sharp → uploaded to ImageKit at `/studio/gallery/{brand}/{subcategory}/{filename}.jpg`.
- Videos → transcoded to H.264 CRF 23 + max 1920px + 4 Mbps + AAC via ffmpeg → uploaded to R2 at key `{brand}/{subcategory}/{filename}.mp4`. Sibling `.poster.jpg` (1 s offset, 800px wide) is generated and uploaded too.
- Emits `src/data/gallery-items.generated.ts` with the final URLs.
- Failures get `status: "failed"` in `upload-progress.json` — re-run retries them.

### 5. Verify

- Refresh the dev server (`npm run dev` if not running) → `http://localhost:4321/studio/gallery` (or whichever port Astro chose)
- Filter by the new brand/category to find your additions
- Build check: `npm run build`

---

## Common operations

### Add a new brand

1. Drop files with the new brand prefix in source folder.
2. Add slug → label to `brandLabels` in `src/data/gallery.ts`.
3. Mirror it in `BRAND_LABELS` in `scripts/build-gallery-manifest.mjs`.
4. Mirror that mirror — also update `docs/gallery-skill/scripts/build-gallery-manifest.mjs` so the bundle stays in sync.
5. (If multi-token brand name like "Foo Bar") add `[['foo', 'bar'], 'foo-bar']` to `BRAND_PREFIX_ALIASES` in both the runtime script and the bundle mirror.
6. Run the standard workflow (build manifest → upload).

### Add a new subcategory

**Order matters**: edit all five places **before** running the upload. If you run upload first, the regenerated `gallery-items.generated.ts` will reference an unknown `Subcategory` and `npm run type-check` fails.

1. Add to the `Subcategory` type union in `src/data/gallery.ts`.
2. Add to the appropriate array in `subcategoryByCategory` (same file).
3. Add display label to `subcategoryLabels` (same file).
4. Add filename-token mapping to `CATEGORY_TOKEN_MAP` in `scripts/build-gallery-manifest.mjs` (longer matches first).
5. Mirror the change in `docs/gallery-skill/scripts/build-gallery-manifest.mjs` to keep the bundle in sync.
6. Run the standard workflow.

### Override auto-generated alt text

Auto-alt is `"{Brand display label} — {subcategory readable} in {variant tokens joined}"`.

To override one row:

1. Edit `scripts/gallery-manifest.json`.
2. Set the entry's `"alt"` to whatever you want.
3. Set `"manualOverride": true` (so future regen preserves it).
4. Re-run upload.

### Exclude a file from upload

In `scripts/gallery-manifest.json`, set `"include": false` and (optionally) `"excludeReason": "..."`. Preserved across regen.

### Re-run after a failed upload

Just `node scripts/upload-gallery.mjs` again. Failures are stored in `scripts/upload-progress.json` with `status: "failed"`; re-runs retry them. If a failure is permanent (e.g. >100 MB video, >25 MB image) use `node scripts/sync-manifest-excludes.mjs` to flip them to `include: false`.

### Delete content

To remove an item from the gallery:

1. Set `"include": false` on its manifest entry.
2. Manually delete it from ImageKit (Media Library) or R2 (bucket browser).
3. Run upload — generated.ts gets regenerated without it.

For a wholesale wipe of the gallery's CDN content (rare):

- ImageKit: `node scripts/reset-imagekit-gallery.mjs --confirm`
- R2: use the dashboard's bulk-delete

---

## Edge cases & known limits

### ImageKit free-tier limits

- 5 GB storage, ~5 GB/mo bandwidth (delivery)
- **Video transformations are blocked** — that's why videos are on R2.
- Per-file image cap: 25 MB. Sharp's resize keeps us well under (typical output 100–800 KB).

### Cloudflare R2 free-tier limits

- 10 GB storage (we use ~150 MB for current 16 videos)
- Zero egress fees → no bandwidth quota
- ~1M Class A operations / 10M Class B / month — uploads / reads — orders of magnitude over normal use

### Video size constraints

- ffmpeg compresses to max 4 Mbps. A 30-second clip ≈ 15 MB; most are 5–10 MB.
- If a source video is too large to transcode efficiently, manually pre-compress with: `ffmpeg -i in.mp4 -c:v libx264 -crf 28 -vf "scale=1280:-2" out.mp4`

### Non-video poster generation can fail

ffmpeg might fail to extract a frame for very short clips (<1 s) or corrupt files. The pipeline logs a warning and continues without a poster — the gallery falls back to the `<video>` element's default.

### Source file deleted from disk after manifest build

If a file is removed after appearing in `gallery-manifest.json`, upload will fail with `ENOENT`. To clean up:

1. Re-run `node scripts/build-gallery-manifest.mjs` — the missing file drops out of the manifest.
2. If the manifest is locked (e.g. you don't want to regenerate), set `"include": false` on the orphan entry manually.

### Credentials rotated mid-run

ImageKit / R2 credentials revoked or rotated will cause every subsequent upload to fail with a generic auth error. Symptoms: every video item suddenly `status: "failed"` with auth-flavored messages. Fix: refresh `.env`, run `node scripts/upload-gallery.mjs` again.

### Force re-upload of a single item

Open `scripts/upload-progress.json`, delete the entry's destPath key, run `node scripts/upload-gallery.mjs`. The item is treated as fresh.

---

## Troubleshooting

### "I uploaded the file but it's not showing on the page"

Check in order:

1. **Did upload succeed?** Look at `scripts/upload-progress.json` — the entry should have `"status": "uploaded"`. If `"failed"`, see error message.
2. **Was `gallery-items.generated.ts` regenerated?** It writes at the end of every upload run. Check the file's modified timestamp.
3. **Is the dev server picking up the change?** Astro hot-reloads `.ts` files but if you ran build externally, restart `npm run dev`.
4. **Did the schema change?** If you added a new `Subcategory` value but didn't update `subcategoryByCategory` AND `subcategoryLabels` AND the parser map, the type-check will fail or items render with broken cascades. Run `npm run type-check`.
5. **Is the item filtered out?** The page only shows items where `include: true` in the manifest. Check the entry.

### "Gallery page renders but the new brand's filter dropdown is empty"

`galleryBrands` in `src/data/gallery.ts` is auto-derived from items. If your brand has zero items in `galleryItems`, it won't appear. Confirm at least one item with `brand: '<your-slug>'` exists in `gallery-items.generated.ts`.

### "Subcategory is wrong for an item"

The parser inferred from filename. Two fixes:

- **Cleanest**: rename source file to use the correct token, re-run the pipeline.
- **Manual override**: edit `scripts/gallery-manifest.json`, set the entry's `subcategory` and `manualOverride: true`. Future regen preserves it.

### "Build fails after I added a new subcategory"

Likely cause: missing entry in one of the maps in `src/data/gallery.ts`. The Subcategory type union must list it AND `subcategoryByCategory[<category>]` array must include it AND `subcategoryLabels[<sub>]` must have a display label. Run `npm run type-check` for a precise error pointer.

### "Video tile shows wrong aspect ratio"

The aspect was set at upload time from ffprobe. If wrong (e.g. portrait detected as landscape), open `scripts/upload-progress.json` and edit the entry's `aspect` field, then re-run upload — it'll regenerate `gallery-items.generated.ts`. Or delete the upload-progress entry to force a fresh probe + re-upload.

---

## What NOT to do

- ❌ **Don't upload videos to ImageKit** — free tier blocks video transformations. They go to R2.
- ❌ **Don't edit `src/data/gallery-items.generated.ts` manually** — it gets overwritten on the next upload run.
- ❌ **Don't bypass the manifest** by directly uploading to ImageKit/R2 dashboards — orphans don't surface on the site.
- ❌ **Don't rename brand slugs after the fact** — slugs are baked into URLs and folder paths. To rename: full delete + re-upload with the new slug.
- ❌ **Don't add a 5th filter axis** to the gallery — UX is locked at Brand → Category → Subcategory → Type. Discussed and intentional (mobile clutter).
- ❌ **Don't commit `.env`, `scripts/upload-progress.json`, or `scripts/gallery-manifest.json`** — all gitignored. They contain absolute Windows paths and/or secrets.

---

## File map (runtime, in `/scripts/` at repo root)

| file                                  | role                                                                                                                   |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `scripts/build-gallery-manifest.mjs`  | walks source folders → emits `gallery-manifest.json`. Re-runs preserve user edits.                                     |
| `scripts/upload-gallery.mjs`          | reads manifest → processes (sharp/ffmpeg) → uploads to ImageKit + R2 → emits `gallery-items.generated.ts`. Idempotent. |
| `scripts/gallery-manifest.json`       | curation source of truth. Gitignored.                                                                                  |
| `scripts/upload-progress.json`        | per-file upload state cache. Gitignored.                                                                               |
| `scripts/sync-manifest-excludes.mjs`  | flips `include: false` on failed uploads (post-failure helper).                                                        |
| `scripts/migrate-videos-to-r2.mjs`    | one-shot helper from the ImageKit→R2 migration. Keep for reference; not run in normal workflow.                        |
| `scripts/cleanup-png-uploads.mjs`     | one-shot helper from the PNG→JPG re-encode migration. Keep for reference.                                              |
| `scripts/reset-imagekit-gallery.mjs`  | nuclear option — bulk delete ALL gallery entries from ImageKit. `--confirm` to actually run.                           |
| `src/data/gallery.ts`                 | schema + types + brand/subcategory maps + 30 hand-curated legacy items                                                 |
| `src/data/gallery-items.generated.ts` | auto-generated array, do not edit by hand                                                                              |
| `src/pages/studio/gallery.astro`      | the gallery page                                                                                                       |
| `docs/gallery-upgrade-plan.md`        | original plan + locked decisions (filter system, folder structure, labels)                                             |

The three most important runtime scripts are mirrored in this folder under `scripts/` for reading. The runtime versions in `/scripts/` are authoritative.

---

## Need help?

Read in order:

1. This file (you're here)
2. `docs/gallery-upgrade-plan.md` — locked decisions and rationale
3. The mirror copies in `docs/gallery-skill/scripts/` (or the runtime versions in `/scripts/`) — inline comments explain the why

If a parsing failure isn't covered above, check `CATEGORY_TOKEN_MAP` and `BRAND_PREFIX_ALIASES` first — adding a token there fixes 90% of issues.
