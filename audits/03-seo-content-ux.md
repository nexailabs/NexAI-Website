# SEO + Content + UX Audit

Date: 2026-04-25
Scope: `src/layouts/Layout.astro`, `src/config/site.ts`, `src/pages/index.astro`, all `src/pages/prompts/*.astro`, all `src/pages/apps/*.astro`, all `src/pages/blog/*.astro`, `src/components/home/*.astro`, `src/components/Footer.astro`, `src/components/Navbar.astro`, `public/robots.txt`, `public/_headers`, `astro.config.mjs`, `src/data/promptHub.ts`, `src/data/vault.ts`, and `src/content/blog/*.md`.

## Executive Summary

The site has good bones: clean route structure, canonical URLs handled in one place, and baseline OG/Twitter tags already wired into `Layout.astro`. The biggest problems are not foundational SEO mistakes; they are crawl quality, thin-content leakage, and conversion dilution.

Right now the highest-risk issue is indexable low-value content: draft blog posts with live URLs, an indexable `/coming-soon`, and no sitemap exclusions for empty/noindex routes. The next biggest issue is that the site sounds more polished than specific. Home, Prompt Hub, App Vault, and blog pages all repeat the same "real work / fixed price / no hard sell / month two" rhetoric, and too many CTAs are decorative instead of actionable.

On mobile, the weakest experiences are the Prompt Hub filter strip, the buy modal, the home Anatomy stepper, and the stacked pricing cards. Accessibility is mostly salvageable, but unlabeled search inputs, placeholder share links, weak link text, and low-contrast microcopy need cleanup.

## Top 10 Ranked Fixes

| Rank | Fix                                                                                                                   | Impact | Effort | Why it matters                                                                                                                |
| ---- | --------------------------------------------------------------------------------------------------------------------- | ------ | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 1    | Remove draft blog posts, `/coming-soon`, and noindex empty-state routes from crawl + sitemap                          | 5      | M      | `getCollection('blog')` currently ships drafts, `/coming-soon` is indexable, and `astro.config.mjs` has no sitemap excludes.  |
| 2    | Fix broken internal links in the footer/nav and add cross-links between Prompt Hub, App Vault, and Blog               | 5      | S      | The footer still sends users to `/coming-soon` for live products, and cross-silo discovery is weaker than it should be.       |
| 3    | Add route-level structured data for blog posts, prompt detail pages, app detail pages, and breadcrumbed detail routes | 4      | M      | Home already has Organization/WebSite schema; content routes are the obvious next gap.                                        |
| 4    | Repair mojibake/encoding issues in titles, UI copy, and CTA strings                                                   | 4      | S      | Strings like `Aú`, `ƒ+?`, and broken glyphs are showing up in title templates and UI copy, which hurts snippets and trust.    |
| 5    | Replace decorative CTAs with task-specific CTAs that match intent                                                     | 4      | S      | `Pay Now`, `Catch us`, `See it`, and `#` share links waste high-intent moments.                                               |
| 6    | Rework Prompt Hub mobile filters and the BuyModal for short screens                                                   | 4      | M      | Current mobile behavior creates hidden horizontal overflow, crowded controls, and dialog-height risk when the keyboard opens. |
| 7    | Reorder the homepage after Hero so proof appears earlier than manifesto copy                                          | 4      | M      | Hero goes straight into thesis/anatomy. The site earns trust too late.                                                        |
| 8    | Tone down Cormorant/italic emphasis and cut repeated stock phrases across sections                                    | 3      | M      | The visual voice is distinctive, but emphasis is now overused enough that it no longer signals importance.                    |
| 9    | Add explicit labels and contrast fixes for search/filter/form UI                                                      | 3      | S      | Search inputs, low-alpha text, and vague link text are the biggest accessibility misses.                                      |
| 10   | Align `robots.txt`, host config, and OG/article metadata strategy                                                     | 3      | S      | `robots.txt` points to the non-`www` sitemap while `site.url` uses `www`, and content routes still rely on generic OG cards.  |

## Per-Page Scorecard

| Path                  | Title                                                                                 | Desc                                               | OG                       | Structured-data                                                          | A11y                                                          | Mobile                                                   | Verdict                                                                          |
| --------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `/`                   | `NexAI Labs \| AI Agents for Business` is unique and concise                          | Good, but still generic brand positioning          | Global default card only | `Organization` + `WebSite` only                                          | One H1, but contrast is weak in supporting copy               | Hero is usable; post-hero flow is too concept-heavy      | Strong base, but needs proof earlier and richer schema                           |
| `/prompts`            | `Prompt Hub \| NexAI Labs` is unique and clean                                        | Strong and specific                                | Global default card only | None                                                                     | Search input is unlabeled                                     | Filter strip is the weakest mobile UX in the repo        | Good hub page that needs mobile and a11y work                                    |
| `/prompts/[slug]`     | Good template pattern, but current title string contains mojibake in source           | Usually specific from artifact data                | Global default card only | None; missing `BreadcrumbList`, and paid pages miss `Product/Offer`      | Heading structure is fine; modal and action labels are weaker | Detail layout stacks okay; BuyModal is weak on phones    | High-value content type that is under-marked for SEO                             |
| `/prompts/empty`      | Title is fine but low-value                                                           | Fine, but should never rank                        | Global default card only | None                                                                     | Structurally fine                                             | Fine                                                     | Keep noindex and also remove from sitemap                                        |
| `/apps`               | `App Vault \| NexAI Labs` is unique and clean                                         | Good and specific                                  | Global default card only | None                                                                     | Search label is implicit only; contrast is soft               | Dense but workable; filter bar is better than Prompt Hub | Solid index page that needs schema and labels                                    |
| `/apps/[slug]`        | Good intent, but title template currently contains mojibake in source                 | Data-driven and generally decent                   | Global default card only | None; good candidate for `SoftwareApplication` or `Product`-style schema | Placeholder share links and vague CTA text hurt usability     | Mobile stacking is acceptable                            | Valuable detail page type held back by generic copy + missing schema             |
| `/apps/stacks/[slug]` | Current title template contains mojibake in source                                    | Usually specific from stack overview               | Global default card only | None; should at least emit `BreadcrumbList` and possibly `ItemList`      | Link text and encoded symbols are noisy                       | Responsive behavior is mostly okay                       | Needs encoding cleanup and stronger metadata                                     |
| `/apps/empty`         | Title is fine but low-value                                                           | Fine, but should never rank                        | Global default card only | None                                                                     | Structurally fine                                             | Fine                                                     | Keep noindex and remove from sitemap                                             |
| `/blog`               | `Field Notes \| NexAI Labs` is unique and strong                                      | Good and on-brand                                  | Global default card only | None                                                                     | Fine structurally; muted text is low-contrast                 | Good                                                     | Good archive page, but draft filtering is the blocker                            |
| `/blog/six-agents`    | Strong article title pattern, but current template includes mojibake in source        | Good from frontmatter                              | Global default card only | None; missing `Article` schema                                           | Body structure is good; CTA and contrast need work            | Good                                                     | Best content page, but still missing article SEO basics                          |
| `/blog/{draft posts}` | Strong titles and descriptions, but body is only "Draft in progress. Come back soon." | Metadata overpromises the page                     | Global default card only | None                                                                     | Fine structurally                                             | Fine                                                     | Do not ship these routes live                                                    |
| `/coming-soon`        | Title is unique, but page is placeholder-grade                                        | Description is placeholder-grade and encoded badly | Global default card only | None                                                                     | Fine structurally                                             | Fine                                                     | Add `noIndex`, remove from sitemap, and stop linking to it from live product nav |
| `/404`                | Correct special-case title, but source string contains mojibake                       | Fine                                               | Global default card only | None                                                                     | Fine                                                          | Fine                                                     | Keep noindex; verify it stays out of the sitemap                                 |

## 1. SEO Mechanics

- `Layout.astro` is doing the right foundational work for canonicals. The default canonical is derived from `Astro.url.pathname` and `Astro.site`, which is exactly the right centralization for a site this size.
- Baseline OG/Twitter coverage exists on all audited pages through `Layout.astro`. That means the problem is not missing tags; it is missing route-specific overrides. Blog posts should not share the same "website" treatment as static hubs, and paid prompt pages should not look identical to free content in social previews.
- Title uniqueness is generally good across the main route templates. Most titles are in a healthy range. The exceptions are low-value routable states and the mojibake strings leaking into several templates (`/apps/[slug]`, `/apps/stacks/[slug]`, `/blog/[...slug]`, `/404`, `/coming-soon` source strings).
- Meta descriptions are mostly better than average for a small site. The dynamic routes usually inherit useful, specific copy from prompt/app/blog data. The weak spots are placeholder routes and draft blog pages whose metadata promises depth the body does not deliver.
- `hreflang` is absent. That is not urgent if this is still effectively a single-language site, but it is still a missing SEO signal. A self-referencing `en-IN` or `en` pair is enough for now.
- `astro.config.mjs` uses `sitemap()` with no excludes. That matters because noindex alone does not guarantee removal from the sitemap. The routes I would treat as likely sitemap leakage are `/coming-soon`, `/prompts/empty`, `/apps/empty`, and the draft blog slugs.
- `public/robots.txt` points to `https://nexailabs.com/sitemap-index.xml`, while `site.url` and `astro.config.mjs` are set to `https://www.nexailabs.com`. Pick one host and make robots, canonicals, and sitemap agree.
- Structured data is the biggest missed upside:
  - `/` already emits `Organization` and `WebSite`.
  - Blog posts emit no `Article` schema.
  - Prompt/App detail pages emit no `BreadcrumbList`.
  - Paid prompt pages have all the information needed for `Product` + `Offer` but ship none of it.
  - The Studio route already has much better schema coverage than the rest of the marketing site, which makes the gap more noticeable.
- Internal-link graph:
  - Home does a decent job of linking into `/apps`, `/prompts`, and `/blog`.
  - App Vault detail pages link back to `/blog` and related apps.
  - Prompt Hub detail pages mostly dead-end into booking, not discovery.
  - Blog posts keep users inside blog but do not surface matching Prompt Hub or App Vault assets.
  - The footer still links Prompt Hub and App Vault to `/coming-soon`, which is the single worst internal-link mistake in the repo.

## 2. Content Quality

- The site's core voice is clear: operator-first, anti-fluff, practical, hands-on. That is a good foundation.
- The inconsistency is tonal, not strategic. Pages drift between sharp operator language and fashion-editorial theater. The home page, Prompt Hub, App Vault, and blog all lean on the same swagger phrases until they start to sound templated.
- Repeated phrases and concepts show up too often:
  - "real work"
  - "fixed price"
  - "month two"
  - "no slides"
  - "no hard sell"
  - "what we actually use"
  - "not theoretical"
  - "in production"
- Headlines are usually scannable. Supporting paragraphs are where the copy slows down: too many sections need two sentences to say one thing.
- Cormorant/italic styling is overused across home, Prompt Hub, App Vault, and blog. When every key noun is italicized, nothing actually stands out.
- CTA quality is mixed:
  - Converting / clear: `Book a Call`, `See Our Work`, `Buy with Razorpay`, `Visit {tool}`.
  - Decorative / weak: `Pay Now`, `Catch us`, `See it`, `How we wired it`, placeholder share icons.
- Jargon density is highest in the pricing and App Vault detail pages. The site often talks like an internal strategy memo rather than like a page trying to convert a first-time buyer.

## 3. UX and Responsiveness

- Homepage flow after Hero:
  - Hero -> Thesis -> Anatomy -> Roster -> Toolkit -> Pricing is too explanation-heavy before proof-heavy.
  - The user gets worldview and process before seeing enough shipping proof.
  - One proof block should move up earlier: a case/result strip, Studio showcase, or a "what shipped this month" module.
- Prompt Hub `FilterStrip`:
  - At `<900px>` the tabs become horizontally scrollable, but there is no overflow hint, snap cue, or fade edge.
  - The ticker disappears, which is fine, but the remaining controls lose hierarchy.
  - Sort and Paid-only controls feel detached from the tab state on smaller screens.
- `BuyModal`:
  - No dedicated mobile breakpoint styles.
  - No `max-height`, no internal scroll container, no sticky footer/action, and no safe-area handling.
  - The close icon is visibly broken, which makes the modal feel less trustworthy on a payment path.
- `HomeAnatomy` at `<600px>`:
  - The component only meaningfully adapts at `720px`.
  - The dense step labels and the viz still compete for attention on small screens.
  - Auto-cycling content is hard to read on mobile even if the layout itself technically fits.
- Dual-card pricing stack:
  - The cards collapse to one column at `900px`, which is the correct move.
  - The problem is not stacking; it is density. Both cards still carry uppercase list treatment, long consulting copy, and weak CTA semantics.
  - The first card's `Pay Now` button feels like a dead-end, not a next step.
- Font-size clamps:
  - The site uses too many `0.62rem` to `0.78rem` values for labels, tickers, footnotes, filter chrome, and footer content.
  - On mobile, these read as decorative metadata instead of actual readable content.

## 4. Accessibility for Content

- Heading hierarchy is mostly sane on the primary templates:
  - One H1 on home.
  - One H1 on Prompt Hub/App Vault/blog routes.
  - Section H2s inside content blocks are mostly logical.
- The noisy exception is the global footer. Repeated `h2` headings for "Products", "Studio", and "Connect" are not catastrophic, but they do add outline noise on every page for what is basically utility navigation.
- Image/text observations:
  - Decorative logo images in Navbar/Footer correctly use empty `alt=""`.
  - The meaningful ImageKit issue is not missing alt on those assets; it is weak descriptive quality on the richer editorial image sets elsewhere in the site.
- Form labels:
  - Prompt Hub search input has no explicit label.
  - App Vault search input is wrapped in a `label`, but there is no visible or screen-reader-only label text.
  - BuyModal email input is correctly labeled.
- Link text quality needs work:
  - `Catch us`
  - `See it`
  - `How we wired it`
  - icon-only share links on `#`
  - category/filter chrome that relies on visual context
- Contrast is a recurring problem:
  - `HomeThesis` uses `rgba(255,255,255,0.45-0.6)` repeatedly on a near-black background.
  - Blog subtitles and meta lines do the same.
  - App Vault and footer microcopy live too close to the edge.
  - The design language wants subtlety, but it is overusing low-alpha white.

## 5. Performance Signals

- Likely LCP candidates by route:
  - `/`: hero H1 / rotating word block, with `AgentOrbit` as the visual contender.
  - `/prompts`: Prompt Hub hero H1.
  - `/prompts/[slug]`: H1 plus the top prompt/code area.
  - `/apps`: H1 plus first visible stack/tool module.
  - `/apps/[slug]`: H1 and faux screenshot marquee.
  - `/apps/stacks/[slug]`: H1 and diamond graphic.
  - `/blog`: H1 or featured post card.
  - `/blog/[slug]`: H1 and cover block.
  - `/coming-soon`: H1 and glow block.
- Layout shift / motion risks:
  - Home hero scramble word rotator.
  - Prompt Hub hero rotator.
  - Prompt Hub ticker swapping rows in/out.
  - Home Anatomy auto-cycle.
  - Navbar pulse/takeover motion.
- The scramble word rotators partially reserve width, which helps, but they still spend CPU in the first viewport and can create perceived instability.
- The biggest performance cost is not image format. Where ImageKit is used, URLs already request `f-auto`, which is the right baseline. The bigger problem is motion, font weight spread, and first-viewport script work.
- Font loading is centralized through Astro's font integration, which is good. What I do not see is explicit route scoping or explicit `font-display` control in repo config. Verify the generated CSS is `swap`, and consider not shipping Anton + Cormorant weights to routes that barely use them.
- `_headers` is strong from a caching/security perspective and is not the performance bottleneck here.

## 5 Weakest Copy Blocks

1. `src/components/home/HomeThesis.astro:51`

Current problem: the rail + statement block is stylish but over-assertive. It asks the reader to trust a lot of abstract positioning language before the page has shown enough proof.

Suggested rewrite:

```text
Most AI firms start with an audit deck. We start with one working agent:
scoped, wired into your stack, and reviewed by your team before it goes live.
```

2. `src/components/home/HomePricing.astro:14`

Current problem: the Strategy Sprint card reads like consulting boilerplate, and `Pay Now` is the wrong ask for a high-trust service.

Suggested rewrite:

```text
Strategy Sprint
Find the highest-ROI automation opportunity, map the workflow, and leave with
a build-ready plan for your first agent.

CTA: Start the sprint
```

3. `src/components/promptHub/BottomCta.astro:7`

Current problem: "Want this running, not just sitting in a tab?" is clever but vague, and `Catch us` says nothing about the next step.

Suggested rewrite:

```text
Want this prompt turned into a working workflow?
We'll wire the prompt, SOP, or skill into your stack, add the reviewer rules,
and hand over the operating docs.

CTA: Book the implementation call
```

4. `src/components/vault/CTABar.astro:23`

Current problem: the reused App Vault CTA leans on filler (`Catch us`, `no hard sell`) instead of the concrete value of the call.

Suggested rewrite:

```text
Want this stack wired into your workflow?
We'll show you the stack, the handoffs, and the first implementation step on a
15-minute call.

CTA: See the stack plan
```

5. `src/pages/blog/[...slug].astro:118`

Current problem: the blog CTA breaks editorial momentum and sends every post to the same generic sales action instead of a contextual next step.

Suggested rewrite:

```text
Want the setup behind this post?
Open the matching Prompt Hub asset or App Vault stack, or book a call if you
want it implemented for your team.

CTA options: View the prompt / View the stack / Book a call
```

## Short Notes on Specific Source Issues

- `src/pages/blog/index.astro` and `src/pages/blog/[...slug].astro` both build every markdown file. Because four blog entries are still `draft: true` and contain only "Draft in progress. Come back soon.", they should not be in the built site at all.
- `src/pages/coming-soon.astro` should be `noIndex`. Right now it is one of the most linked low-value pages in the repo.
- `src/components/Footer.astro` is still routing users to `/coming-soon` for live products.
- `src/pages/apps/[...slug].astro`, `src/pages/apps/stacks/[...slug].astro`, `src/pages/blog/[...slug].astro`, `src/pages/apps/empty.astro`, `src/pages/prompts/empty.astro`, `src/pages/404.astro`, and `src/pages/coming-soon.astro` all show mojibake in user-facing strings in source. This is worth fixing before anything else in copy polish.
