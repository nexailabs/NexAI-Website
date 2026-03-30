# Post-Audit Hardening & Deployment

## Context

Three independent AI audits (ChatGPT, Claude-via-repo, second Claude deep-scan) produced ~30 findings against the `/ai-shoots` page and site infrastructure. After validating every claim against the actual codebase, **8 are real issues**. The rest were stale (auditing an old Cloudflare deployment), architecturally wrong for Astro, or fabricated metrics.

This spec covers the validated fixes + Codex agent execution + Cloudflare deployment.

## Out of Scope

These were suggested by audits but explicitly rejected (with reasoning):

- **Extract ShootsHero JS to TypeScript class**: `is:inline` is required for DOM-dependent animation; removing it breaks every `querySelector` call
- **GSAP timeline refactor**: Manual RAF is needed for dynamic geometry calculations (`getSpreadUnit`, `getViewportCenterOffset`) that GSAP timelines can't replace
- **Lenis scrollerProxy**: Not needed with modern Lenis (v1.3+) which uses native scroll
- **CSS design token overhaul**: Current tokens work; different easings per component are intentional
- **`client:visible` on Astro components**: Invalid Astro — `client:*` directives only work on framework components (React/Svelte/Vue)
- **Font self-hosting via Fontsource**: `preconnect` already exists in Layout.astro; marginal gain (~20-50ms cold load)
- **Enterprise CI/CD** (Lighthouse CI, Percy, Sentry, CODEOWNERS, PR templates): Premature for 2-person team with 3-page static site
- **Secrets scanning**: Zero secrets in codebase; all images are public ImageKit URLs
- **JSON-LD structured data**: Feature work, not a bug fix

## Phase 1 — Config & Meta Fixes

### 1a. Clean `astro.config.mjs`

Remove the `// Placeholder` comment from `site`. The URL `https://nexailabs.com` is correct. The comment signals uncertainty.

**File**: `astro.config.mjs`
**Change**: Remove comment on line 7

### 1b. Add OG & Social Meta to Layout

Currently missing: Open Graph tags, Twitter card meta, canonical link.

**File**: `src/layouts/Layout.astro`

Add props to the Layout interface:

- `ogImage?: string` (default: a branded fallback image, 1200x630)
- `canonicalUrl?: string` (default: derived from `Astro.url`)

Add to `<head>`:

```html
<link rel="canonical" href={canonicalUrl || Astro.url.href} />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage || '/assets/og-default.jpg'} />
<meta property="og:url" content={canonicalUrl || Astro.url.href} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
```

**Prerequisite**: Create or source a 1200x630 default OG image at `public/assets/og-default.jpg`.

### 1c. Node Engine Compatibility

`package.json` says `>=22`. Cloudflare Pages respects `.nvmrc` for build Node version.

**File**: Create `.nvmrc` with content `22`
**File**: No change to `package.json` (keep `>=22` since that's what we develop with)

**Verification**: Check Cloudflare Pages build logs after first deploy to confirm Node 22 is picked up.

## Phase 2 — Performance Fixes

### 2a. Add `width` / `height` to All `<img>` Tags

14 images across 4 components are missing dimensions. This causes CLS (Cumulative Layout Shift).

Images use ImageKit with `?tr=w-600` transforms. Aspect ratios are known from the content:

**File**: `src/components/ShootsHero.astro`

- Hero deck cards: `width="600" height="800"` (3:4 fashion portraits)
- Dock thumbnails: `width="600" height="800"` (same source, displayed small)

**File**: `src/components/ShowcaseV3.astro`

- Input/output images: dimensions based on `aspect` prop (`3x4` = 600x800, `2x3` = 600x900, `1x1` = 600x600)
- Mobile stage cards: same as their source images

**File**: `src/components/ClientMarquee.astro`

- Brand logos: CSS constrains height via `clamp(3.5rem, 6vw, 5.5rem)` with `width: auto`. Logos are variable-width PNGs (~282x199 etc). Adding `height="199" width="282"` per-logo is low CLS risk (positioned at bottom of hero, CSS-constrained). Add approximate dimensions for the intrinsic size hint — measure each logo during implementation.

### 2b. Preload Hero LCP Image + `fetchpriority`

The first visible card (last item in deck A, rendered on top of the stack) is the LCP element.

**File**: `src/pages/ai-shoots.astro`
Add inside `<Layout>` using the `head` slot:

```html
<link
	slot="head"
	rel="preload"
	as="image"
	href="{heroDecks[0][heroDecks[0].length"
	-
	1].src}
	fetchpriority="high"
/>
```

Also add `fetchpriority="high"` to that specific `<img>` tag in ShootsHero (the eager-loaded one).

### 2c. Global `prefers-reduced-motion`

ShootsHero already checks this and skips all animations. Gaps:

**File**: `src/styles/global.css`
Add at the end:

```css
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}
}
```

**File**: `src/scripts/lenis.ts` (marked DO NOT MODIFY in CODEX-2, but this is a 2-line guard)
Add at the top of `initLenis()`:

```typescript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
```

This skips smooth scroll entirely for users who prefer reduced motion.

### 2d. `ScrollTrigger.refresh()` — Wait for Images

Currently fires on `astro:page-load` before images decode.

**File**: `src/scripts/lenis.ts`
Replace the `astro:page-load` handler:

```typescript
document.addEventListener('astro:page-load', async () => {
	await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
	ScrollTrigger.refresh();
});
```

## Phase 3 — Codex Agents

Run the 3 Codex agents using prompts already pushed to `dev`:

1. **CODEX-1-VISUAL-ALIGNMENT.md** — Diff against reference repo, fix CSS/HTML discrepancies
2. **CODEX-2-ANIMATION-POLISH.md** — Audit timing, jank, interactions, `prefers-reduced-motion`
3. **CODEX-3-RESPONSIVE-EDGE-CASES.md** — Test matrix from 320px to 2560px

**Process**:

- Run all 3 in parallel on Codex
- Review each PR against its quality bar
- Resolve merge conflicts (likely in ShootsHero.astro)
- Merge to `dev`

## Phase 4 — Deploy

### 4a. Push `dev` to `main`

After all phases merged to `dev`, fast-forward merge to `main`.

### 4b. Configure Cloudflare Pages

In Cloudflare dashboard:

- **Repository**: `nexailabs/NexAI-Website`
- **Production branch**: `main`
- **Build command**: `npm run build`
- **Output directory**: `dist/`
- **Node version**: Set `NODE_VERSION=22` in environment variables (backup for `.nvmrc`)

### 4c. Verify Deployment

After first deploy:

- Confirm site loads at `nexailabs.com`
- Check `/ai-shoots` page renders correctly
- Verify `_headers` security headers are served (check with `curl -I`)
- Confirm sitemap.xml is generated at `/sitemap-index.xml`
- Test OG meta with a social preview validator

## Verification Checklist

- [ ] `astro.config.mjs` has clean `site` (no placeholder comment)
- [ ] Layout has OG, Twitter, canonical meta tags
- [ ] `.nvmrc` exists with `22`
- [ ] All `<img>` tags have `width` and `height`
- [ ] Hero LCP image has `<link rel="preload">` and `fetchpriority="high"`
- [ ] `global.css` has `prefers-reduced-motion` rule
- [ ] `lenis.ts` skips init when reduced motion preferred
- [ ] `ScrollTrigger.refresh()` waits for image decode
- [ ] 3 Codex PRs reviewed and merged
- [ ] `dev` merged to `main`
- [ ] Cloudflare Pages deploys successfully from `main`
- [ ] Live site serves correct security headers
- [ ] OG previews render correctly
