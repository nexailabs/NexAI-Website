# iter-05 — Hybrid (Founder bones + Direct-Response hook) — /studio rewrite

**Angle:** Hook the buyer on the math they already run — cost per shot, turnaround, and the AI tool that
last butchered their product — then pay it off with a real studio that QAs every shot before it ships.
Fidelity is the trust spine, and it's product-agnostic: weave, facet, bottle, and skin all render true.

---

## 0. Page metadata

- **Browser tab title:** `AI Product Photoshoots for D2C Brands | NexAI Labs`
- **Meta description:** `On-model and styled product shots in 3–5 days, 80% cheaper than a studio. Apparel, jewelry, cosmetics. Trusted by 50+ Indian D2C brands.`

*why:* original title says "Fashion Brands" and the showcase already runs Jewelry and Cosmetics tabs — the
old meta silently drops two-thirds of the ICP. Widened to "D2C / product" and named all three categories.
Kept "3–5 days," "80% cheaper," "50+" verbatim (Guardrail #3).
`VERIFY: 80% cheaper than a studio — confirm this is the live, defensible figure before ship.`

## 1. Hero

- **Screen-reader H1:** `AI Product Photoshoots for D2C Brands`
- **Visible title:** `NEXAI` · [rotating brand image decks] · `STUDIO` *(unchanged — wordmark + image stack)*

*why:* the visible hero is the wordmark and live image deck, so the only editable string is the SR H1.
Changed "Fashion Brands" → "Product … D2C Brands" so screen-reader and SEO match the actual product range.
No structural change to the rotating stack (Guardrail #2).

## 2. Bridge line + client logos

- **Bridge headline:** `Catalogue-ready product shots. No shoot.`
- **Below it:** scrolling marquee of client logos *(unchanged: Banno, DBJ, Ganga, Indo Era, Janasya, Jugo, STF, Leemboodi, Skylee, XYXX, Yufta).*

*why:* "AI shoots for D2C brands" labels the category; this names the outcome the buyer is buying
(images they can list) and the thing they get to skip (the shoot). Plain fallback I rejected:
`AI shoots for D2C brands.` — accurate but it's a category label, not a result. Kept clever because a
catalogue manager respects "catalogue-ready / no shoot" more than the generic version. (Guardrail #1.)

## 3. Showcase (before/after by category)

- **Section title:** `Your product, rendered true.`
- **Section sub:** `Pick a category. See the before and after.`
- **Category tabs:** `Kurta Sets` · `Western Wear` · `Saree` · `Menswear` · `Jewelry` · `Cosmetics` *(unchanged)*

*why:* resolves the duplicate-header flag — Showcase now owns **fidelity** (the proof you can see), Process
owns **the workflow** (§5). "Rendered true" is product-agnostic on purpose: it covers a saree's weave, a
gemstone's facets, and a bottle's label, not just fabric. Plain fallback rejected: `See the work by category.`
— fine, but it makes no promise. Kept "rendered true" because this exact buyer was burned by a tool that
rendered their product *false*, so the word does work the plain line doesn't. (Guardrail #1.)

## 4. Reel (video showcase)

- **Section title:** `Stills are half the story.`
- **Section sub:** `The same product, ad-ready in video — no second crew, no second invoice.`

*why:* the original line already lands; kept the title verbatim and only tightened the sub's punctuation
(em-dash). "No second crew, no second invoice" is the buyer's cost math, so it stays. No intent change.

## 5. Process (how it works)

Desktop:
- **Section title:** `A real studio. You just approve.`
- **Section sub:** `Send what you've got. Approve the looks. Get your assets. No casting, no location, no lighting.`

*why:* second half of the duplicate-header fix — Process now states the **done-for-you** truth (a studio
that happens to use AI, not a tool you operate), which is the differentiator the brief leans on. Plain
fallback rejected: `How it works.` — clear but says nothing the buyer can't guess. Kept "A real studio. You
just approve." because the #2 objection after fidelity is "is this just another prompt tool I have to babysit?"
— this answers it in the header. (Guardrail #1.)

- **Steps** (renumbered `01` → `04` — **decorative "Day 1–4" removed**, see *why* below):
  1. **`Send your product photos`** — `Mannequin, flat-lay, ghost, or packshot — whatever you already have.`
  2. **`We prep it`** — `Our team cleans backgrounds, sets the product right, and builds the model map. You do nothing.`
  3. **`We generate your shoot`** — `Models, poses, and scenes matched to your brand — any skin tone, body type, or vibe you need.`
  4. **`We QA, then ship`** — `A human reviews every shot, retouches if needed, and ships it ready for Myntra, Amazon, or your Shopify.`

*why (numbering):* swapped `Day 1`–`Day 4` for `01`–`04`. The day-labels imply a fixed 4-day calendar that
isn't a real SLA, and the brief (§4) flags it. The actual turnaround claim ("3–5 days" / "days, not weeks")
is true and lives in the metadata and mobile sub, so the page keeps its honest speed claim without inventing
a per-step timeline. (Resolves flag #2.)

*why (step labels):* reframed each label to the outcome/action ("We QA, then ship" vs "QA'd and Delivered").
Also de-fabric'd step 2: original said "stitches the garment" — that drops jewelry and cosmetics. Changed to
"sets the product right" so prep reads true for a necklace or a serum bottle, not only a kurta.

Mobile (same steps, different header):
- **Section title:** `How it works`
- **Section sub:** `Product to photoshoot in days, not weeks.`

*why:* "days, not weeks" is an allowed factual turnaround claim (brief §4) — kept it. Tightened the sub to
one line.

## 6. Gallery CTA

- **Mobile lead:** `500+ creatives` *(unchanged — auto-rounds from live gallery total)*
- **Headline:** `500+ creatives from 20+ brands.`
- **Sub (desktop):** `A curated cut from 60,000+ shipped. Filter by brand, category, or type to find a shoot like yours.`
- **Sub (mobile):** `Filter by brand, category, or type.`
- **Button:** `Open Gallery` → `/studio/gallery` *(unchanged)*

*why:* kept every number verbatim — "500+", "20+", "60,000+" (Guardrail #3). Only edit: "that matches yours"
→ "like yours" for rhythm. No claim softened.
`VERIFY: 60,000+ shipped and 20+ brands — confirm both still match the live gallery total.`

## 7. Final CTA

- **Headline:** `See your product shot before you pay.`
- **Sub (desktop):** `Free sample shoots in your category. If the fidelity isn't there, you walk — no invoice, no hard feelings.`
- **Sub (mobile):** `Free sample shoots in your category — on the house.`
- **Button:** `Book a Free Call` → Cal.com *(unchanged)*
- **Proof line:** `50+ brands trust NexAI Studio` *(unchanged)*

*why (the owned trade-off):* this is where the burned buyer is most suspicious — "will it wreck *my* product,
and am I locked in once I pay?" The owned limitation: **we don't ask you to trust the output sight-unseen —
you see a sample in your own category first, and if the fidelity's off, you walk.** That admits the real risk
(AI can miss) instead of over-promising, which is the trust beat for an ICP that's been burned. Plain fallback
rejected: `Get sample shoots on the house.` — friendly but it dodges the fear. Kept the sharper line because a
skeptic respects "you walk if it's off" far more than "on the house." (Guardrails #1 + the one owned trade-off.)
Headline plain fallback rejected: `Launch the collection. Skip the shoot.` — clever but generic; the new
headline maps to the exact risk (paying before seeing) this buyer is scared of.

---

## A/B note (what I'd test next)

1. **Hero SR H1 / meta scope:** "Product / D2C Brands" vs the live "Fashion Brands" — does broadening to
   jewelry + cosmetics lift qualified bookings from non-apparel ICP, or dilute apparel intent?
2. **Final CTA trade-off line:** "If the fidelity isn't there, you walk" vs the softer "on the house" — does
   naming the risk raise booking rate with burned buyers, or read as defensive?
3. **Showcase header:** "Your product, rendered true." vs plain "See the work by category." — does the
   fidelity promise above the gallery lift category-tab engagement?
4. **Process header:** "A real studio. You just approve." vs "How it works." — does framing done-for-you
   up front cut the "is this a prompt tool" objection on calls?
