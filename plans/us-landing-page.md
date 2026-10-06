# /us landing page — build plan

**Written 2026-09-21.** Target market: US/EU DTC brands. Offer spec lives in
`NexAI Labs/CEO/proposals/US-DTC-Offer-v1.md` — that file is the source of truth for
pricing, turnaround and scope. Do not restate numbers here; import them from there.

## Why this is a day, not a week

Every Studio component already takes props. Nothing needs rewriting:

| Component | Prop | New data needed |
|---|---|---|
| `StudioHero` | `decks` | US spec images |
| `ClientMarquee` | `brands` | **drop it** — no US logos yet, don't fake it |
| `StudioShowcase` | `categories` | US categories |
| `StudioProcess` | `steps` | copy edit only |
| `StudioFAQ` | `items` | full rewrite, see §3 |
| `StudioCTA` | `floats` | US spec images |

**One code change required:** `StudioHero.astro` hardcodes
`<h1 class="shoots-hero__sr-only">AI Photoshoots for Fashion Brands</h1>`. Add a
`heading` prop with the current string as the default so `/studio` is untouched.

## 1. Blocked on the spec batch

The page cannot ship before the 60 spec images exist — hero, showcase and CTA floats are
all image-driven, and every image currently on `/studio` is a saree or kurti. **Images
first, page second.** Pick the best ~24 of the 60 and upload to ImageKit under
`/studio/us/`.

## 2. Files to create

```
src/data/studio-us.ts        heroDecks, showcaseCategories, ctaFloats  (US images)
src/data/studio-copy-us.ts   processSteps, faqItems, pricingTiers
src/pages/us/index.astro     copy of studio/index.astro, US data, no ClientMarquee
```

`src/pages/us/index.astro` also needs its own `Layout` title/description/ogImage and its
own JSON-LD block (copy the `@graph` from `studio/index.astro`, swap the URLs to
`/us/`). Add `<link rel="canonical">` on both pages so the two near-duplicates don't
compete.

## 3. What changes in the copy

**Remove every India signal.** Myntra and Flipkart appear repeatedly on `/studio` and
tell a US brand the page isn't for them. Replace with Shopify and Amazon.

**Categories:** apparel · jewelry · beauty & skincare · supplements.
NOT kurta sets, sarees or lehengas.

**Two things `/studio` doesn't have and this page must:**

1. **Price on the page.** `/studio` answers "how does pricing work?" with "book a call."
   That works for warm Surat referrals and is fatal to cold outbound — a cold prospect
   has nothing to evaluate and leaves. Put the three tiers up.
2. **The guarantee in the hero, in the largest type on the page.**
   *"Your first 20 images free. Keep them either way."* On `/studio` this is buried in a
   subheading and inside FAQ #1. It is the strongest asset on the page.

## 4. The FAQ question that decides the sale

**"Where are you based?"** They will ask. `/studio` has no answer because in India it
never comes up. Dodging it is worse than owning it, so own it:

> We're in Surat — India's textile capital. It's why we cost a fraction of a US studio,
> and why we handle fabric properly when generic AI tools butcher it.

Turn the objection into the proof. Keep the existing "those were tools, this is a
service" answer — it's the best line on the site and it travels.

## 5. Proof numbers — fix before publishing

`/studio` currently claims **500+ creatives**, **60,000+ shipped** and **50+ brands** on
one page. Finance records **44,200 images** across **~20 invoiced entities**. Three
different stories, and a US buyer doing diligence costs more than the bigger number
gains. Agree one defensible set with Rahul and use it on both pages.

## 6. Sequence

| | Step | Owner | Blocked by |
|---|---|---|---|
| 1 | 60 spec images, 10 brands | team | — |
| 2 | Pick 24, upload to ImageKit `/studio/us/` | team | 1 |
| 3 | `heading` prop on StudioHero | dev | — |
| 4 | Two data files + page | dev | 2 |
| 5 | Agree final proof numbers | Rahul | — |
| 6 | Deploy (Cloudflare), mobile QA | dev | 4 |
