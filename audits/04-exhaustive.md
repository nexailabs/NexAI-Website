# NexAI Labs Marketing Site: Exhaustive Audit

Date: 2026-04-26

Method:

- I read the requested source areas in `src/components/**`, `src/pages/**`, `src/data/**`, `src/scripts/**`, `src/styles/**`, `functions/**`, `src/content/blog/**`, plus config and public edge files.
- I also audited the checked-in `dist/` tree. A fresh `astro build` could not complete in this sandbox because Astro content sync is blocked by a child-process `spawn EPERM`. That is an environment limitation, not a code defect.

## Executive Summary

- The blog is built and effectively broken at the same time. `dist/` contains `/blog` plus five post pages, while `public/_redirects:9` and `public/_redirects:10` still 301 `/blog` and `/blog/*` to `/`.
- Draft handling is non-functional. Four of the five blog posts in `src/content/blog` are `draft: true`, yet `src/pages/blog/index.astro:10`, `src/pages/blog/[...slug].astro:13`, and the generated sitemap still publish them.
- Prompt Hub paid content is not gated. Full paid prompt, SOP, and `SKILL.md` payloads are shipped in page HTML and client JS, while the "checkout" is a fake timer and the "unlock" is `sessionStorage`.
- `POST /api/runs` is a public write endpoint with wildcard CORS, no origin enforcement, no rate limiting, and permissive empty-body increments. The counter is trivially spoofable, so any reported usage numbers are not trustworthy.
- The router bundle is doing more than the source config admits. `astro.config.mjs:17-20` says `prefetchAll: false`, but the shipped router bundle in `dist/_astro/index.C1MYpbAX.js:1` initializes with `prefetchAll: true`.
- Schema and social coverage are thin. Only 3 of 35 HTML pages ship JSON-LD, and 33 of 35 pages share the exact same default OG image.
- Conversion plumbing is unfinished. The homepage has a dead "Pay Now" button, App Vault detail pages ship dead Save/Flag/Embed/Share controls, and Cal booking is completely uninstrumented.
- Performance is HTML-heavy, not JS-heavy. The checked-in `dist/` is 3.13 MB total, with 1.91 MB of HTML and only 60.2 KB of JS. The site's weight comes from repeated static markup and global head payload, not large bundles.

## Refined Plan

1. Fix routing and indexation integrity first.
   Rationale: the blog is simultaneously published, redirected away, and leaking drafts. That poisons crawl quality before any schema work matters.

2. Replace fake Prompt Hub commerce with real entitlements.
   Rationale: shipping paid content in the page source while simulating payment is a trust problem, not just a product gap.

3. Harden `/api/runs` and make metrics trustworthy.
   Rationale: every downstream funnel or demand decision is garbage if the only live counter can be spammed by anyone.

4. Finish route-family SEO semantics.
   Rationale: the home and Studio pages are partially done; the real coverage gap is blog, Prompt Hub, App Vault, tool detail, and stack detail pages.

5. Remove dead and placeholder interactions.
   Rationale: fake controls train users to ignore the interface and make the site feel less real than the work it is trying to sell.

6. Move CSP from permissive to deliberate.
   Rationale: the header baseline is already decent; the remaining browser-hardening step is removing raw inline script/style dependency and switching to nonces or hashes.

7. Make client navigation behavior explicit.
   Rationale: the shipped router is prefetching more aggressively than the source config claims, and some page scripts are written as if full-page reloads are the only navigation path.

8. Rebuild the homepage-to-product funnel.
   Rationale: the hero pushes "book a call" and Studio first, while Prompt Hub and App Vault are buried lower on the page even though they are stronger proof and better scalable entry points.

9. Reduce artifact weight and repeated markup.
   Rationale: the biggest weight problem is large HTML pages with duplicated explanatory scaffolding, not JavaScript.

10. Add real operating infrastructure.
    Rationale: there is no analytics, no error tracking, no uptime, no email capture, and no payment entitlement workflow. You cannot run growth or trust paid distribution without that layer.

## Scoring Matrix

| Area                              | Score / 10 | Notes                                                                                                       |
| --------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| Routing & Indexation              | 3          | Real pages exist, but blog redirects, draft leakage, and hostname inconsistency undermine crawl integrity.  |
| Security & Abuse Resistance       | 4          | Header baseline is decent; application-layer abuse protection is weak where it matters.                     |
| Structured Data & Social Metadata | 2          | Only 3 pages ship JSON-LD; 33 of 35 pages reuse the same OG image.                                          |
| Conversion Funnel                 | 4          | Strong raw offer, weak CTA sequencing, dead controls, fake checkout, and no booking instrumentation.        |
| UX & Interaction Reliability      | 5          | Visual polish is solid, but some controls are fake and some client scripts are more brittle than they look. |
| Performance & Build Efficiency    | 6          | JS is light, but HTML is heavy and the head carries too much repeated inline logic.                         |
| Data Integrity & Content Ops      | 5          | Tool/prompt slugs resolve cleanly; taxonomy, freshness metadata, and draft discipline do not.               |
| Observability & Growth Ops        | 1          | No analytics, no error tracking, no uptime monitoring, no capture layer, no payment ops.                    |

## Artifact Snapshot

- `dist/` contains 35 HTML routes and 91 files total.
- Total checked-in `dist/` size: 3.13 MB.
- Asset mix by size: 1.91 MB HTML, 736.1 KB PNG, 264.6 KB fonts, 217.8 KB CSS, 60.2 KB JS.
- Heaviest HTML routes: `/studio` 133.4 KB, `/` 105.2 KB, `/apps` 101.0 KB, `/prompts` 71.8 KB, individual app pages ~50-61 KB each.
- Heaviest shipped JS/CSS chunks: `Layout.*.js` 17.9 KB, `ClientRouter.*.js` 13.3 KB, `StudioHero.*.js` 9.3 KB, `StudioShowcase.*.js` 8.1 KB, `DeepFilterBar.*.js` 4.2 KB, top CSS chunk 48.2 KB.
- Unique OG images in built HTML: 3 total. One default image is used on 33 pages.
- Pages without JSON-LD in built HTML: 32 of 35.
- Positive check: `coming-soon`, `apps/empty`, and `prompts/empty` already have route-level `noindex`; the problem is not missing `noindex`, it is routing and draft leakage.

## Top 20 Ranked Fixes

| Rank | Fix                                                                                                          | Why                                                                                                                 | Refs                                                                                                                                                                                                                     | Effort |
| ---- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 1    | Remove the blog catch-all redirects.                                                                         | They override real Astro blog routes and can make the entire blog unreachable in production.                        | `public/_redirects:9`, `public/_redirects:10`                                                                                                                                                                            | S      |
| 2    | Respect `draft` everywhere: blog index, static paths, related posts, and sitemap.                            | Four draft posts are currently built, linked, and indexed.                                                          | `src/pages/blog/index.astro:10`, `src/pages/blog/[...slug].astro:13`, `src/pages/blog/[...slug].astro:32`, `astro.config.mjs:10`                                                                                         | S      |
| 3    | Stop shipping paid Prompt Hub content to the client; gate it server-side after verified payment.             | The current "paywall" is cosmetic. The paid payload is already in the page source.                                  | `src/pages/prompts/[...slug].astro:89`, `src/pages/prompts/[...slug].astro:167`, `src/pages/prompts/[...slug].astro:284`, `src/components/promptHub/BuyModal.astro:114`, `src/components/promptHub/BuyTriggers.astro:36` | L      |
| 4    | Lock `POST /api/runs` to same-origin writes and add rate limiting.                                           | Counter data is trivially forgeable and therefore operationally useless.                                            | `functions/api/runs.ts:27`, `functions/api/runs.ts:54`, `functions/api/runs.ts:71`                                                                                                                                       | M      |
| 5    | Remove `'unsafe-inline'` from CSP and migrate inline head logic/styles to nonceable assets.                  | Browser hardening is blocked by the site's own inline Cal bootstrap and global style block.                         | `public/_headers:8`, `src/layouts/Layout.astro:166`, `src/layouts/Layout.astro:242`                                                                                                                                      | L      |
| 6    | Unify canonical host, sitemap host, and robots host; 301 one hostname.                                       | Canonicals are `www`, robots points to apex, and the sitemap index mixes hosts.                                     | `src/config/site.ts:5`, `astro.config.mjs:7`, `public/robots.txt:4`                                                                                                                                                      | S      |
| 7    | Add route-family JSON-LD to blog, prompts, apps, tool detail, and stack detail pages.                        | Right now the site is mostly invisible to rich-result parsers.                                                      | `src/pages/apps/index.astro:12`, `src/pages/apps/[...slug].astro:27`, `src/pages/apps/stacks/[...slug].astro:24`, `src/pages/blog/[...slug].astro:41`, `src/pages/prompts/[...slug].astro:370`                           | M      |
| 8    | Generate per-route or per-family OG images instead of one default image.                                     | 33 of 35 pages currently look identical in social previews.                                                         | `src/layouts/Layout.astro:23`, `src/pages/studio/index.astro:25`, `src/pages/studio/gallery.astro:12`                                                                                                                    | M      |
| 9    | Make router prefetch behavior match source intent or remove `ClientRouter` where it is not earning its keep. | The shipped bundle is more aggressive than the source config suggests.                                              | `astro.config.mjs:17`, `src/layouts/Layout.astro:84`, `dist/_astro/index.C1MYpbAX.js:1`                                                                                                                                  | M      |
| 10   | Fix App Vault filter reliability: no double-binding, no string-based "recent" sort.                          | It is easy to ship a polished-looking filter that behaves inconsistently under navigation and sorting.              | `src/components/vault/DeepFilterBar.astro:550`, `src/components/vault/DeepFilterBar.astro:585`, `src/components/vault/DeepFilterBar.astro:657`                                                                           | M      |
| 11   | Remove or wire the dead App Vault action pills and share buttons.                                            | Save/Flag/Embed/Share are currently decorative, not functional.                                                     | `src/pages/apps/[...slug].astro:50`, `src/pages/apps/[...slug].astro:155`, `src/components/vault/ActionPill.astro:10`                                                                                                    | M      |
| 12   | Remove or wire "Watch the full breakdown" and hidden deals CTAs.                                             | Disabled-looking links and feature-flagged dead ends make the product pages feel unfinished.                        | `src/components/vault/RankedListModule.astro:69`, `src/pages/apps/stacks/[...slug].astro:190`, `src/pages/apps/stacks/[...slug].astro:247`, `src/data/vault.ts:542`                                                      | S      |
| 13   | Wire or delete the homepage "Pay Now" button.                                                                | A dead primary CTA on the pricing section is an immediate conversion leak.                                          | `src/components/home/HomePricing.astro:22`, `src/components/home/HomePricing.astro:120`                                                                                                                                  | S      |
| 14   | Move Prompt Hub/App Vault handoff higher in the homepage funnel.                                             | The hero pushes calls and Studio first; the most scalable proof assets are buried later.                            | `src/components/home/HomeHero.astro:32`, `src/pages/index.astro:46`, `src/components/home/HomeToolkit.astro:37`                                                                                                          | M      |
| 15   | Add explicit accessible labels to the Prompt Hub and App Vault search inputs.                                | Placeholder-only search inputs are weak for accessibility and weaker for trust.                                     | `src/pages/prompts/index.astro:58`, `src/components/vault/DeepFilterBar.astro:21`                                                                                                                                        | S      |
| 16   | Instrument Cal modal opens, closes, and successful bookings.                                                 | Every commercial CTA currently disappears into an unmeasured modal flow.                                            | `src/layouts/Layout.astro:205`, `src/components/vault/CTABar.astro:24`, `src/components/promptHub/BottomCta.astro:15`                                                                                                    | M      |
| 17   | Make BuyModal mobile-safe with max-height, internal scrolling, and stronger focus management.                | The current dialog sizing is desktop-centric and fragile on short mobile viewports.                                 | `src/components/promptHub/BuyModal.astro:165`, `src/components/promptHub/BuyModal.astro:177`                                                                                                                             | S      |
| 18   | Add `manifest.json` and link it from the global layout.                                                      | The favicon set exists; the web app manifest is simply missing.                                                     | `src/layouts/Layout.astro:45`, `public/` (no `manifest.json`)                                                                                                                                                            | S      |
| 19   | Trim the font budget and verify display-font loading consistently.                                           | Four configured families emit 12 font files, and the site's display typography is broader than the visible payback. | `astro.config.mjs:21`, `src/layouts/Layout.astro:50`, `src/components/home/HomePricing.astro:199`                                                                                                                        | M      |
| 20   | Fix taxonomy drift and stale "freshness" metadata.                                                           | Category lists and "last verified / last updated" strings are hard-coded and not trustworthy.                       | `src/content.config.ts:10`, `src/pages/blog/index.astro:20`, `src/pages/apps/[...slug].astro:182`, `src/data/promptHub.ts:497`                                                                                           | S      |

## What the Prior Audits Missed

- The deployment layer is fighting the content layer. The earlier audits focused on page files; the real blog break lives in `public/_redirects`, not in the blog components.
- The router bundle does not match the source config. `prefetchAll` is off in `astro.config.mjs`, but on in the shipped client router bundle.
- Prompt Hub's paid flow is not just weak; it is counterfeit. The modal pretends to process payment, pretends to send a receipt, and then unlocks with `sessionStorage`.
- The site's trust story is internally inconsistent. `HomeToolkit` says "All published, no email gate" while `BuyModal` immediately asks for an email and pretends to transact.
- App Vault's most complex client-side module is also its least disciplined one. `DeepFilterBar` both sorts "recent" incorrectly and binds handlers without a real initialization contract.
- The build artifact profile changes the performance diagnosis. JS is small; HTML is the heavy layer. Earlier narrow audits understandably focused on animations, but the bigger waste is repeated static markup and global inline head payload.
- Header hardening is not the primary security problem. The more serious issue is app-layer abuse: an open write endpoint and a fake entitlement system.

## Operational Gaps

Missing, not merely weak:

- No product analytics stack. There is no event pipeline for page views, CTA clicks, filter usage, or prompt unlock attempts.
- No Cal funnel instrumentation. You cannot tell which page, CTA, or route family produces booked calls.
- No error tracking. There is no Sentry, Rollbar, Bugsnag, or equivalent.
- No uptime or synthetic monitoring for `/`, `/studio`, `/prompts`, `/apps`, `/blog`, or `/api/runs`.
- No email capture workflow. The current site uses `mailto:` and a fake checkout email field instead of a real CRM or newsletter path.
- No payment operations layer. There is no verified payment callback, entitlement storage, receipt pipeline, or refund/reconciliation path for Prompt Hub paid items.
- No deploy health/reporting layer. There is nothing visible here for post-deploy smoke checks, alerting, or rollback confidence.
