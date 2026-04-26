# Broken Links Audit

**Date:** 2026-04-26
**Branch:** feat/brand-unification (PR #59)
**Method:** grep across `src/`, glob `src/pages/`, `src/content/`, `public/` — no external fetches

---

## Summary

| Category               | Total | Broken                         |
| ---------------------- | ----- | ------------------------------ |
| Internal routes        | ~40   | **0**                          |
| Anchor links           | 11    | **6**                          |
| Placeholder `href="#"` | 8     | **6 dead, 2 intentional**      |
| External (https)       | ~14   | 0                              |
| `mailto:` / `tel:`     | 8 / 0 | 0                              |
| `data-open-cal` CTAs   | 11    | 1 with `#` fallback (cosmetic) |

Net: **0 broken internal page routes**. **6 broken category anchors** in the Studio nav. **6 placeholder `href="#"`** that should either be wired up or removed.

---

## Critical — broken anchor links

The Studio nav config promises 6 category anchor links on `/studio`, but none of those `id`s exist on the studio page.

`src/config/navigation.ts:69` — `/studio#kurta-sets` → no `id="kurta-sets"` on `/studio`
`src/config/navigation.ts:75` — `/studio#western-wear` → no `id="western-wear"` on `/studio`
`src/config/navigation.ts:81` — `/studio#saree` → no `id="saree"` on `/studio`
`src/config/navigation.ts:87` — `/studio#menswear` → no `id="menswear"` on `/studio`
`src/config/navigation.ts:93` — `/studio#jewelry` → no `id="jewelry"` on `/studio`
`src/config/navigation.ts:99` — `/studio#cosmetics` → no `id="cosmetics"` on `/studio`

**What works on `/studio`:** `id="top"` (`src/pages/studio/index.astro:93`), `id="showcase"` (`src/components/StudioShowcase.astro:22`).

**Fix options (pick one):**

1. Add the 6 category `id`s to `StudioShowcase.astro` (each category card / row).
2. Drop the 6 `children` entries from the Studio nav config (the categories still render as visual chips on the studio page; nav anchor jumps just disappear).
3. Point all 6 to `/studio#showcase` for now and revisit when the showcase grid gets per-category sections.

---

## Placeholder `href="#"` — broken or intentional

`src/pages/apps/[...slug].astro:155` — **5 fake share buttons** (X, M, B, Li, R). All `href="#"`. No share intent URL wired (e.g. `https://twitter.com/intent/tweet?...`).
→ **Fix:** wire to real share intents OR remove the row. As-is, they look functional but reload the page to top.

`src/pages/apps/stacks/[...slug].astro:247` — `<a href="#" class="stack-page__deals-cta">` "deals" CTA dead.
→ **Fix:** point to `/apps`, a deal page, or remove.

`src/components/vault/RankedListModule.astro:69` — `<a href="#" aria-disabled="true">▶ Watch the full breakdown</a>`.
→ Marked `aria-disabled` so AT users skip it, but visually clickable. **Either** style as disabled (cursor + faded) **or** remove until video exists.

`src/components/promptHub/BottomCta.astro:15` — `<a href="#" data-open-cal>` Cal trigger with bare `#` fallback. Every other Cal CTA on the site falls back to `site.bookingUrl`.
→ **Fix:** change to `href={site.bookingUrl}` for graceful no-JS fallback.

---

## Suspect query-string link

`src/pages/apps/[...slug].astro:239` — `href={`/apps?category=${tool.category}`}`
The apps index page (`src/pages/apps/index.astro`) does **not** read `Astro.url.searchParams.category` and the grid has no client-side category filter wired to URL state. The query string is silently dropped — visitors land on the unfiltered grid.
→ **Fix:** either implement the filter or change link to `/apps#all-tools`.

---

## External links — all valid format

All `https://` references either resolve to known active domains or are user-controlled config:

| URL                                                       | Source                           | Status                                         |
| --------------------------------------------------------- | -------------------------------- | ---------------------------------------------- |
| `https://cal.com/rahul-juneja/15min`                      | navigation.ts:38, site.ts        | OK                                             |
| `https://www.instagram.com/nexailabs/`                    | site.ts:14, navigation.ts:47     | OK                                             |
| `https://www.instagram.com/nexai.photoshoots/`            | navigation.ts:122                | OK                                             |
| `https://www.linkedin.com/company/nexailabs/`             | site.ts:19, navigation.ts:52,127 | OK                                             |
| `https://www.youtube.com/@nexailabs`                      | site.ts:24                       | OK                                             |
| `https://ik.imagekit.io` (preconnect/dns-prefetch)        | Layout.astro:56-57               | OK                                             |
| `https://ik.imagekit.io/nexailabs/nexai/og/default.png`   | Layout.astro:24                  | OK                                             |
| `https://ik.imagekit.io/nexailabs/nexai/og/ai-shoots.png` | studio/index.astro:25            | OK                                             |
| App Vault tool domains via `tool.link`                    | apps/[...slug].astro:76,175      | depends on `vault.ts` data — not literal hrefs |

No http (insecure) links found. No `localhost` or `example.com` placeholders found.

---

## Mailto / tel

Mailto valid. No tel links on the site.

| Source                                      | Address                                                  |
| ------------------------------------------- | -------------------------------------------------------- |
| `src/config/site.ts:6`                      | `hello@nexailabs.com`                                    |
| `src/components/Footer.astro:78`            | `mailto:${site.email}`                                   |
| `src/components/Navbar.astro:188`           | `mailto:${email}` (panel)                                |
| `src/pages/apps/index.astro:58`             | `mailto:hello@nexailabs.com?subject=Suggest%20a%20tool…` |
| `src/pages/apps/empty.astro:37`             | `mailto:hello@nexailabs.com?subject=Suggest…`            |
| `src/pages/prompts/index.astro:102,144`     | `mailto:hello@nexailabs.com?subject=Prompt%20Hub…`       |
| `src/pages/prompts/empty.astro:38`          | `mailto:hello@nexailabs.com?subject=Prompt%20Hub…`       |
| `src/components/home/HomePricing.astro:122` | `mailto:${site.email}?subject=Strategy%20Sprint…`        |

---

## `data-open-cal` review

11 elements use `data-open-cal` (handler in `Layout.astro:198–207`). 10 have `site.bookingUrl` as fallback. The one outlier (`promptHub/BottomCta.astro:15`) uses `#` — flagged above.

---

## Internal routes verified

All file-based routes resolve:

- `/` ← `src/pages/index.astro`
- `/404` ← `src/pages/404.astro`
- `/coming-soon` ← `src/pages/coming-soon.astro`
- `/studio`, `/studio/gallery`
- `/prompts`, `/prompts/empty`, `/prompts/[...slug]`
- `/apps`, `/apps/empty`, `/apps/[...slug]`, `/apps/stacks/[...slug]`
- `/blog`, `/blog/[...slug]`

Dynamic blog slugs (`cold-outreach`, `invoicing`, `one-page-brief`, `product-shots`, `six-agents`) all have content files in `src/content/blog/`.

`#main-content` (skip-to-content link) resolves to `Layout.astro:101`.
`#showcase` resolves to `StudioShowcase.astro:22`.
`#all-tools` resolves to `apps/index.astro:48`.

---

## Recommended fix order

1. **Now:** Drop the 6 category `children` from Studio nav OR add the 6 `id`s to the showcase. Without one of these, the desktop nav flyout has 6 dead jumps.
2. **Now:** Change `BottomCta.astro` `href="#"` → `href={site.bookingUrl}`.
3. **Soon:** Wire `apps/[...slug].astro` share buttons or delete the row.
4. **Soon:** Decide on the "deals" CTA in `apps/stacks/[...slug].astro:247` (delete or wire).
5. **Soon:** Either implement `?category=` filter on `/apps` or change the deep-link.

---

## Audit method

```
glob src/pages/**/*.astro
glob src/content/**/*.{md,mdx}
glob public/**/*
grep "href=\"" src/  (all .astro/.ts)
grep "href={"  src/
grep "href:"   src/  (data + config files)
grep "data-open-cal" src/
grep "id=\"(known anchor list)\"" src/
```

No external HTTP requests issued. All findings derive from static analysis of the source tree on branch `feat/brand-unification`.
