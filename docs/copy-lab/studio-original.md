# /studio — current copy (live), FAQ excluded

> Every user-facing string on the Studio page except the FAQ, in reading order, with source files.
> This is the "original" column for the bake-off. Mirror these headings in each run.

---

## 0. Page metadata
**`src/pages/studio/index.astro`** (Layout title/description)
- **Browser tab title:** `AI Photoshoots for Fashion Brands | NexAI Labs`
- **Meta description:** `Turn mannequin shots into on-model photos in 3-5 days. 80% cheaper than studios. Trusted by 50+ Indian fashion brands.`

## 1. Hero
**`src/components/StudioHero.astro`**
- **Screen-reader H1:** `AI Photoshoots for Fashion Brands`
- **Visible title (split around the image stack):** `NEXAI` · [rotating brand image decks] · `STUDIO`
- *(No body copy — the hero is the wordmark + an interactive image stack with a brand thumbnail dock.)*

## 2. Bridge line + client logos
**`src/pages/studio/index.astro`** + `ClientMarquee`
- **Bridge headline:** `AI shoots for D2C brands.`
- **Below it:** scrolling marquee of client logos (Banno, DBJ, Ganga, Indo Era, Janasya, Jugo, STF, Leemboodi, Skylee, XYXX, Yufta).

## 3. Showcase (before/after by category)
**`src/components/StudioShowcase.astro`**
- **Section title:** `Product in, campaign out.`
- **Section sub:** `Pick a category to see the work.`
- **Category tabs:** `Kurta Sets` · `Western Wear` · `Saree` · `Menswear` · `Jewelry` · `Cosmetics`

## 4. Reel (video showcase)
**`src/components/StudioReel.astro`**
- **Section title:** `Stills are half the story.`
- **Section sub:** `The same product, ad-ready in video, no second crew, no second invoice.`

## 5. Process (how it works)
**`src/components/StudioProcess.astro`** + `src/data/studio-copy.ts`

Desktop:
- **Section title:** `Product in. Campaign out.`  ⚠️ *near-duplicate of the Showcase title (§3)*
- **Section sub:** `Upload the product. Approve the looks. Get your assets. No casting, no location, no lighting.`
- **Steps** (numbered `Day 1` → `Day 4` ⚠️ *decorative day-numbering — see studio-brief §4*):
  1. **`Product Images`** — `Share your product photos. Mannequin, flat-lay, or ghost. Whatever you already have.`
  2. **`We Handle the Prep`** — `Our team cleans backgrounds, stitches the garment, and builds the model map. You do nothing.`
  3. **`AI Generates Your Shoot`** — `Models, poses, scenes - everything matched to your brand. Whatever skin tones, body types, and vibes you need.`
  4. **`QA'd and Delivered`** — `Our team reviews every shot, touches it up if needed, then ships it ready for Myntra, Amazon, or your Shopify.`

Mobile (same steps, different header):
- **Section title:** `How It Works`
- **Section sub:** `Product to photoshoot. Days, not weeks.`

## 6. Gallery CTA
**`src/components/StudioGalleryCTA.astro`**
- **Mobile lead:** `500+ creatives` *(count auto-rounds from the live gallery total)*
- **Headline:** `500+ creatives from 20+ brands.`
- **Sub (desktop):** `A curated cut from 60,000+ shipped. Filter by brand, category, or type to find a shoot that matches yours.`
- **Sub (mobile):** `Filter by brand, category, or type.`
- **Button:** `Open Gallery` → `/studio/gallery`

## 7. Final CTA
**`src/components/StudioCTA.astro`**
- **Headline:** `Launch the collection. Skip the shoot.`
- **Sub (desktop):** `Get sample shoots on the house. See your category in action before you commit.`
- **Sub (mobile):** `Get sample shoots on the house.`
- **Button:** `Book a Free Call` → Cal.com booking
- **Proof line:** `50+ brands trust NexAI Studio`

---

## Flagged for the rewrite
1. **Duplicate headers.** §3 Showcase `Product in, campaign out.` vs §5 Process `Product in. Campaign out.` — almost identical. Differentiate.
2. **Day-numbering.** Process steps say `Day 1`–`Day 4`; mobile sub says `Days, not weeks.` Decide: keep factual turnaround (studio-brief §4 allows it) but lose the implied fixed 4-day calendar, or flag.
3. **Two near-identical "on the house" subs** in the final CTA (desktop/mobile) — fine, but keep them aligned if reworded.
