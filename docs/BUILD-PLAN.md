# NexAI Labs Website — Build Plan

## What We're Building

Two pages for NexAI Labs, an AI agency in India:

1. **`/ai-shoots`** — AI Fashion Photography conversion landing page (BUILD FIRST)
2. **`/`** — AI Agency portfolio homepage, inspired by [AEOS Labs](https://labs.aeoscompany.com) (BUILD SECOND)

Complete and get approval on the AI Shoots page before starting the Homepage.

---

## Architecture

| Choice           | Details                                                                    |
| ---------------- | -------------------------------------------------------------------------- |
| Framework        | Astro 5 (SSG, TypeScript strict)                                           |
| Styling          | Vanilla CSS + custom properties (design tokens in `src/styles/global.css`) |
| Animation        | GSAP 3.14 + ScrollTrigger (already installed, `npm install` not needed)    |
| Smooth scroll    | Lenis (wired in `src/scripts/lenis.ts` — **DO NOT MODIFY**)                |
| View Transitions | Astro `ClientRouter` (in `src/layouts/Layout.astro`)                       |
| **DO NOT USE**   | Tailwind, React, Vue, Svelte, or any UI component library                  |

### Key Files (already in repo)

| File                       | Status        | Notes                                                             |
| -------------------------- | ------------- | ----------------------------------------------------------------- |
| `src/scripts/lenis.ts`     | LOCKED        | Lenis + GSAP ticker sync. Touch this and scroll animations break. |
| `src/layouts/Layout.astro` | Extend        | Add Nav, OG meta, etc. — keep existing structure                  |
| `src/styles/global.css`    | Extend        | Add new tokens — keep all existing code                           |
| `src/pages/index.astro`    | Replace later | Current scaffold. Will become Homepage in Phase 14.               |

---

## Workflow

**Each phase = 1 PR.**

```
Build section → Push to feature branch → PR to dev → Review & approval → Merge → Next phase
```

Do not combine multiple phases in one PR. One section at a time.

---

## Before You Start

1. Read `docs/BRAND.md` — colors, typography, logo files, design patterns
2. Read `docs/REFERENCES.md` — competitor sites labeled by what to study from each
3. Read `docs/AI-SHOOTS-CONTENT.md` — full content/copy for the AI Shoots page
4. Read `docs/website-analysis.md` — critique of the current live site (context on what to fix)
5. Run `npm install && npm run dev` — verify scaffold loads at localhost:4321

---

## AI Shoots Page — Phase-by-Phase Build Order

### Phase 1: Nav Bar

**File:** `src/components/nav/Nav.astro`

Fixed navigation bar. Transparent initially, frosted glass (`backdrop-filter: blur(16px)`) after scrolling 50px. Hamburger menu on mobile. "Book a Call" CTA pill button linking to `https://cal.com/nexailabs/15min`.

**Study before building:**

- [AEOS Labs](https://labs.aeoscompany.com) — nav feel, Spline-era aesthetic
- [Resend](https://resend.com) — minimal dark mode nav, whitespace discipline
- [Maison Meta](https://maisonmeta.io) — agency nav with clear CTA

**Quality check:** Does this nav look like it belongs on an Awwwards-winning site? If it looks like every other dark SaaS navbar, redo it.

---

### Phase 2: Hero Section

**File:** `src/components/sections/shoots/HeroShoots.astro`

Full-viewport hero. Trust badge ("Trusted by 15+ D2C Fashion Brands"), headline "Stop Waiting Weeks for Photoshoots" with gradient text, subheadline, CTA button, and before/after product showcase. Animated gradient background with subtle teal glow. GSAP staggered entrance animation.

**Study before building:**

- [Caimera.ai](https://caimera.ai) — how they present AI photoshoots to fashion brands
- [Photoroom](https://photoroom.com) — hero impact, CTA hierarchy
- [Obys Agency](https://obys.agency) — GSAP entrance animation quality

**Quality check:** Does the hero make you stop scrolling? Is the before/after showcase compelling? Do the animations feel premium?

---

### Phase 3: Social Proof Bar

**File:** `src/components/sections/shoots/SocialProofBar.astro`

Infinite marquee scroll of platform logos: Myntra, Flipkart, Amazon, Shopify, Instagram. CSS-only animation, pauses on hover. Text "Powering fashion brands selling on".

**Study:** [AEOS Labs](https://labs.aeoscompany.com) — client logo scroll pattern

---

### Phase 4: Problem → Solution

**File:** `src/components/sections/shoots/ProblemSolution.astro`

Two-column grid. Left: "The Old Way" (red-tinted card, 5 pain points). Right: "The NexAI Way" (green/teal-tinted card, 5 solutions). Cards slide in from opposite sides via GSAP.

**Content:** See `docs/AI-SHOOTS-CONTENT.md` Section 3.

**Study:** [Photoroom](https://photoroom.com), [Botika](https://botika.com) — conversion comparison layouts

---

### Phase 5: Transformation Showcase

**File:** `src/components/sections/shoots/TransformationShowcase.astro`

Grid of 6 before/after cards. Each shows a product transformation (mannequin → on-model, flat-lay → lifestyle, etc.). Use placeholder divs — real images will be added later. Hover: subtle scale + border glow.

**Study:** [Botika](https://botika.com), [Caimera](https://caimera.ai) — before/after presentation

---

### Phase 6: How It Works

**File:** `src/components/sections/shoots/HowItWorks.astro`

3-step horizontal timeline (vertical on mobile). Connecting line that draws on scroll. Steps: Upload Your Photos → Choose Your Look → Receive Studio-Quality Results.

**Content:** See `docs/AI-SHOOTS-CONTENT.md` Section 5.

**Study:** [Claid.ai](https://claid.ai) — 3-step "How it works" section

---

### Phase 7: Testimonials + Stats

**Files:** `src/components/sections/shoots/Testimonials.astro`, `src/components/ui/TestimonialCard.astro`, `src/components/ui/StatsCounter.astro`

Stats bar with animated count-up (5000+ images, 15+ brands, 80% savings, 48hr delivery). Below: testimonial cards in a masonry-like grid. 5 testimonials with star ratings.

**Content:** See `docs/AI-SHOOTS-CONTENT.md` Section 6.

**Study:** [Resend](https://resend.com) — stats bar design and spacing

---

### Phase 8: Pricing

**Files:** `src/components/sections/shoots/Pricing.astro`, `src/components/ui/PricingCard.astro`

3-tier pricing cards. Center card ("Growth" at ₹35,000/mo) is featured — elevated, animated gradient border. Tiers: Pay Per SKU (₹400), Growth, Scale (₹75,000/mo).

**Content:** See `docs/AI-SHOOTS-CONTENT.md` Section 7.

**Study:** [Photoroom](https://photoroom.com), [Claid](https://claid.ai) — pricing card design

---

### Phase 9: Case Studies Preview

**File:** `src/components/sections/shoots/CaseStudiesPreview.astro`

3 cards: BannoSwagger ("Cut Costs by 80%"), Saree Mall ("150 SKUs in 5 Days"), Dhwani Bansal Jewelry ("Premium Quality at 1/5th Cost"). Hover reveals summary overlay.

**Study:** [Maison Meta](https://maisonmeta.io) — "Selected Work" portfolio cards

---

### Phase 10: FAQ

**Files:** `src/components/sections/shoots/FAQ.astro`, `src/components/ui/AccordionItem.astro`

7-question accordion using `<details>`/`<summary>` for accessibility. GSAP smooth height animation. Only one open at a time. Chevron rotates on open.

**Content:** See `docs/AI-SHOOTS-CONTENT.md` Section 9.

---

### Phase 11: Final CTA

**File:** `src/components/sections/shoots/FinalCTA.astro`

Full-width section with gradient background. "Ready to Launch Collections Faster?" headline. Two CTAs: primary "Book Your Free Demo" (pulsing glow) + secondary email. Trust strip: no credit card, 15-min call, free samples.

---

### Phase 12: Footer

**File:** `src/components/ui/Footer.astro`

4-column grid: Brand (logo + tagline + social icons), Product (anchor links), Company (placeholder links), Legal (placeholder links). Bottom bar: "2026 NexAI Labs LLP. Made with AI in India".

**Study:** [Resend](https://resend.com), [Huly](https://huly.io) — footer layout

---

### Phase 13: Polish

Full-page pass:

- GSAP ScrollTrigger on every section (staggered fade-up reveals)
- Responsive QA at 375px, 768px, 1024px, 1440px
- SEO: OG tags, meta description, schema.org, canonical URL
- Accessibility: ARIA labels, focus styles, `noscript` fallback for animated elements
- Performance: Astro `<Image />` for above-fold, `loading="lazy"` below fold
- Lenis smooth scroll works end-to-end

---

## Homepage — Phase-by-Phase Build Order

> Only start after AI Shoots page is approved and merged.

Design reference: [AEOS Labs](https://labs.aeoscompany.com) (primary), [Maison Meta](https://maisonmeta.io) (positioning/copy)

### Phase 14: Hero

3D Spline embed or animated gradient mesh + "We are NexAI Labs" + tagline. Study: AEOS Labs, basement.studio

### Phase 15: Client Logos

Marquee scroll or grid of client/partner logos. Study: AEOS Labs, Maison Meta

### Phase 16: Services

4 service cards: AI Photoshoots (links to /ai-shoots), AI Sales Agents, Workflow Automation, Content Automation. Study: Maison Meta "Capabilities" section

### Phase 17: Work Showcase

Horizontal scroll carousel or grid of project case studies. Study: AEOS Labs carousel, darkroom.engineering

### Phase 18: Process

3-step: Discovery → Build → Deploy. Study: AEOS Labs 3-step section

### Phase 19: Contact CTA

"Ready to Upgrade?" headline + contact form (email, name, company, message). Study: AEOS Labs, Maison Meta

### Phase 20: Footer

Shared component from AI Shoots page.

### Phase 21: Polish

Same checklist as Phase 13 + cross-page View Transitions testing between `/` and `/ai-shoots`.

---

## Design Quality Expectations

- **Premium, editorial, high-end agency feel** — this is NOT a SaaS product, it's an AI agency
- Study the reference sites in `docs/REFERENCES.md` before building each section
- Every section needs: GSAP scroll-triggered animations, responsive design, micro-interactions on hover
- Use brand colors from `docs/BRAND.md` consistently
- Glassmorphism cards, gradient text on headlines, pill-shaped buttons, subtle glow effects
- If a section looks like it could be from any generic template — redo it

## Do NOT

- Install Tailwind or any CSS framework
- Install React, Vue, or Svelte
- Modify `src/scripts/lenis.ts`
- Use generic/default styling
- Combine multiple phases into one PR
