# Post-Audit Hardening & Deployment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 8 validated issues from 3 AI audits (config, CLS, LCP, accessibility, scroll timing) and deploy the current codebase to Cloudflare Pages.

**Architecture:** Astro 5 SSG with `<script is:inline>` for DOM-dependent animations, ImageKit CDN for images, Lenis + GSAP for smooth scroll, Cloudflare Pages for hosting. All changes are additive — no architectural refactors.

**Tech Stack:** Astro 5, TypeScript, GSAP, Lenis, Cloudflare Pages

**Spec:** `docs/superpowers/specs/2026-03-30-post-audit-hardening-design.md`

---

## File Map

| File                                 | Action | Responsibility                                                     |
| ------------------------------------ | ------ | ------------------------------------------------------------------ |
| `astro.config.mjs`                   | Modify | Remove placeholder comment                                         |
| `src/layouts/Layout.astro`           | Modify | Add OG/Twitter/canonical meta tags                                 |
| `src/pages/ai-shoots.astro`          | Modify | Add LCP preload link                                               |
| `src/components/ShootsHero.astro`    | Modify | Add `width`/`height` to `<img>` tags, `fetchpriority` on LCP image |
| `src/components/ShowcaseV3.astro`    | Modify | Add `width`/`height` to `<img>` tags                               |
| `src/components/ClientMarquee.astro` | Modify | Add `width`/`height` to `<img>` tags                               |
| `src/styles/global.css`              | Modify | Add `prefers-reduced-motion` rule                                  |
| `src/scripts/lenis.ts`               | Modify | Add reduced-motion guard + image decode wait                       |
| `.nvmrc`                             | Create | Pin Node 22 for Cloudflare Pages                                   |

---

## Task 1: Clean `astro.config.mjs` + Create `.nvmrc`

**Files:**

- Modify: `astro.config.mjs:7`
- Create: `.nvmrc`

- [ ] **Step 1: Remove placeholder comment from astro.config.mjs**

Change line 7 from:

```javascript
	site: 'https://nexailabs.com', // Placeholder
```

To:

```javascript
	site: 'https://nexailabs.com',
```

- [ ] **Step 2: Create `.nvmrc`**

Create `.nvmrc` in the project root with content:

```
22
```

This tells Cloudflare Pages (and local dev) which Node version to use.

- [ ] **Step 3: Verify build still works**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs .nvmrc
git commit -m "chore: clean astro config placeholder, add .nvmrc for Node 22"
```

---

## Task 2: Add OG & Social Meta to Layout

**Files:**

- Modify: `src/layouts/Layout.astro`

The Layout currently has `title` and `description` props but no Open Graph, Twitter, or canonical meta. We add optional `ogImage` and `canonicalUrl` props with sensible defaults.

- [ ] **Step 1: Update the Props interface**

In `src/layouts/Layout.astro`, change the Props interface (lines 6-10) from:

```typescript
interface Props {
	title: string;
	description?: string;
	showNavbar?: boolean;
}
```

To:

```typescript
interface Props {
	title: string;
	description?: string;
	ogImage?: string;
	canonicalUrl?: string;
	showNavbar?: boolean;
}
```

- [ ] **Step 2: Destructure the new props**

Change the destructuring (lines 12-16) from:

```typescript
const {
	title,
	description = 'NexAI Labs - Business Growth on Autopilot',
	showNavbar = true,
} = Astro.props;
```

To:

```typescript
const {
	title,
	description = 'NexAI Labs - Business Growth on Autopilot',
	ogImage = '/assets/og-default.jpg',
	canonicalUrl,
	showNavbar = true,
} = Astro.props;

const resolvedCanonical = canonicalUrl || Astro.url.href;
const resolvedOgImage = ogImage.startsWith('http') ? ogImage : new URL(ogImage, Astro.site).href;
```

- [ ] **Step 3: Add meta tags to `<head>`**

After `<title>{title}</title>` (line 27) and before `<!-- View Transitions -->` (line 29), add:

```html
<!-- SEO -->
<link rel="canonical" href="{resolvedCanonical}" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
<meta property="og:image" content="{resolvedOgImage}" />
<meta property="og:url" content="{resolvedCanonical}" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{description}" />
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds. Check `dist/ai-shoots/index.html` contains the OG meta tags.

```bash
npm run build && grep -c "og:title" dist/ai-shoots/index.html
```

Expected output: `1`

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add OG, Twitter, and canonical meta tags to Layout"
```

**Note:** A default OG image (`public/assets/og-default.jpg`, 1200x630) should be created separately. Until then, the meta tag will point to a 404 — this is fine for now and doesn't block deployment.

---

## Task 3: Add `width`/`height` to ShootsHero Images + `fetchpriority`

**Files:**

- Modify: `src/components/ShootsHero.astro:34-38, 61`

Hero deck images come from ImageKit with `?tr=w-600`. They are 3:4 fashion portraits (600x800). Dock thumbnails use the first card of each deck (same source).

- [ ] **Step 1: Add dimensions + fetchpriority to deck card images**

In `src/components/ShootsHero.astro`, change lines 34-38 from:

```html
										<img
											src={item.src}
											alt={item.alt}
											loading={deckIndex === 0 && index === deck.length - 1 ? 'eager' : 'lazy'}
											decoding="async"
										/>
```

To:

```html
										<img
											src={item.src}
											alt={item.alt}
											width="600"
											height="800"
											loading={deckIndex === 0 && index === deck.length - 1 ? 'eager' : 'lazy'}
											decoding="async"
											fetchpriority={deckIndex === 0 && index === deck.length - 1 ? 'high' : undefined}
										/>
```

The `fetchpriority="high"` only applies to the first visible card (deck 0, last index = top of stack).

- [ ] **Step 2: Add dimensions to dock thumbnail images**

Change line 61 from:

```html
<img src="{deck[0].src}" alt="" loading="lazy" decoding="async" />
```

To:

```html
<img src="{deck[0].src}" alt="" width="600" height="800" loading="lazy" decoding="async" />
```

- [ ] **Step 3: Verify no visual regression**

Run: `npm run dev`
Open `http://localhost:4321/ai-shoots` in Chrome DevTools at 1440px. Cards should look identical. Check that no new CLS appears in Lighthouse Performance panel.

- [ ] **Step 4: Commit**

```bash
git add src/components/ShootsHero.astro
git commit -m "perf: add width/height and fetchpriority to hero images"
```

---

## Task 4: Add `width`/`height` to ShowcaseV3 Images

**Files:**

- Modify: `src/components/ShowcaseV3.astro:53, 65, 83, 92, 99, 137, 161, 184`

ShowcaseV3 has images in multiple contexts. Aspect ratios are defined in the data (`3x4`=600x800, `2x3`=600x900, `1x1`=600x600). Input images are 3:4 from ImageKit.

- [ ] **Step 1: Add dimensions to mobile stage "Before" card (line 53)**

Change:

```html
<img src="{cat.inputMain}" alt="{`${cat.label}" raw input`} loading="lazy" />
```

To:

```html
<img
	src="{cat.inputMain}"
	alt="{`${cat.label}"
	raw
	input`}
	width="600"
	height="800"
	loading="lazy"
/>
```

- [ ] **Step 2: Add dimensions to mobile stage "After" grid images (line 65)**

Change:

```html
<img src="{slot.src}" alt="{slot.alt}" loading="lazy" />
```

To:

```html
<img src="{slot.src}" alt="{slot.alt}" width="600" height="800" loading="lazy" />
```

- [ ] **Step 3: Add dimensions to desktop input images (lines 83, 92, 99)**

Line 83 — main input:

```html
<img src="{cat.inputMain}" alt="Raw Garment" />
```

To:

```html
<img src="{cat.inputMain}" alt="Raw Garment" width="600" height="800" loading="lazy" />
```

Line 92 — side input top:

```html
<img src="{cat.inputSideTop}" alt="Side input" />
```

To:

```html
<img src="{cat.inputSideTop}" alt="Side input" width="600" height="800" loading="lazy" />
```

Line 99 — side input bottom:

```html
<img src="{cat.inputSideBottom}" alt="Side input" />
```

To:

```html
<img src="{cat.inputSideBottom}" alt="Side input" width="600" height="800" loading="lazy" />
```

- [ ] **Step 4: Add dimensions to output grid images (lines 137, 161, 184)**

For output images, the dimensions depend on the `aspect` prop. Use a helper to map aspect to dimensions.

Add this helper after line 24 (after `placeholderSvgLg` declaration) in the frontmatter:

```typescript
const aspectDims: Record<string, { w: number; h: number }> = {
	'3x4': { w: 600, h: 800 },
	'2x3': { w: 600, h: 900 },
	'1x1': { w: 600, h: 600 },
};
```

Then for each output `<img>` at lines 137, 161, 184, change from:

```html
<img src="{slot.src}" alt="{slot.alt}" loading="lazy" />
```

To:

```html
<img
	src="{slot.src}"
	alt="{slot.alt}"
	width="{aspectDims[slot.aspect].w}"
	height="{aspectDims[slot.aspect].h}"
	loading="lazy"
/>
```

Apply this change to all three locations (lines 137, 161, 184).

- [ ] **Step 5: Verify no visual regression**

Run: `npm run dev`
Check showcase section at 390px (mobile) and 1440px (desktop). Images should render identically.

- [ ] **Step 6: Commit**

```bash
git add src/components/ShowcaseV3.astro
git commit -m "perf: add width/height to all showcase images"
```

---

## Task 5: Add `width`/`height` to ClientMarquee Images

**Files:**

- Modify: `src/components/ClientMarquee.astro:17, 20`
- Modify: `src/data/ai-shoots.ts` (BrandLogo interface + data)

Brand logos are local PNGs of varying dimensions. CSS constrains them to `height: clamp(3.5rem, 6vw, 5.5rem); width: auto`. The most accurate approach: add actual dimensions from the source files to the data.

- [ ] **Step 1: Extend BrandLogo interface**

In `src/data/ai-shoots.ts`, change the interface (around line 18):

```typescript
export interface BrandLogo {
	src: string;
	alt: string;
}
```

To:

```typescript
export interface BrandLogo {
	src: string;
	alt: string;
	width: number;
	height: number;
}
```

- [ ] **Step 2: Add dimensions to brand logo data**

Update the `brandLogos` array (starting at line 96) with measured dimensions:

```typescript
export const brandLogos: BrandLogo[] = [
	{ src: '/assets/brands/Banno.png', alt: 'Banno', width: 282, height: 199 },
	{ src: '/assets/brands/DBJ.png', alt: 'DBJ', width: 275, height: 168 },
	{ src: '/assets/brands/GANGA ONG.png', alt: 'Ganga', width: 307, height: 212 },
	{ src: '/assets/brands/INDO ERA PNG.png', alt: 'Indo Era', width: 370, height: 223 },
	{ src: '/assets/brands/JANASYA.png', alt: 'Janasya', width: 260, height: 208 },
	{ src: '/assets/brands/JUGO.png', alt: 'Jugo', width: 203, height: 180 },
	{ src: '/assets/brands/STF.png', alt: 'STF', width: 389, height: 162 },
	{ src: '/assets/brands/leemboodi.png', alt: 'Leemboodi', width: 1479, height: 633 },
	{ src: '/assets/brands/skylee.png', alt: 'Skylee', width: 303, height: 143 },
	{ src: '/assets/brands/xyxx.png', alt: 'XYXX', width: 240, height: 151 },
	{ src: '/assets/brands/yufta.png', alt: 'Yufta', width: 253, height: 208 },
];
```

- [ ] **Step 3: Update ClientMarquee.astro interface and `<img>` tags**

Update the interface at the top of `src/components/ClientMarquee.astro` (lines 2-5):

```typescript
interface BrandLogo {
	src: string;
	alt: string;
	width: number;
	height: number;
}
```

Change line 17 (primary list) from:

```html
{brands.map((b) => <img src="{b.src}" alt="{b.alt}" loading="lazy" />)}
```

To:

```html
{brands.map((b) =>
<img src="{b.src}" alt="{b.alt}" width="{b.width}" height="{b.height}" loading="lazy" />)}
```

Change line 20 (aria-hidden clone) from:

```html
{brands.map((b) => <img src="{b.src}" alt="" loading="lazy" />)}
```

To:

```html
{brands.map((b) =>
<img src="{b.src}" alt="" width="{b.width}" height="{b.height}" loading="lazy" />)}
```

- [ ] **Step 4: Verify marquee looks correct**

Run: `npm run dev`
Check marquee at bottom of hero at 390px and 1440px. Logos should scroll identically — CSS `height: clamp(...)` + `width: auto` still controls visual sizing.

- [ ] **Step 5: Commit**

```bash
git add src/data/ai-shoots.ts src/components/ClientMarquee.astro
git commit -m "perf: add width/height to brand logo images"
```

---

## Task 6: Add LCP Preload Link

**Files:**

- Modify: `src/pages/ai-shoots.astro`

The first visible hero card (deck 0, last index) is the LCP element. Preloading it in `<head>` via Layout's `<slot name="head" />` lets the browser fetch it before discovering the `<img>` tag in the DOM.

- [ ] **Step 1: Add preload link to ai-shoots.astro**

In `src/pages/ai-shoots.astro`, add inside the `<Layout>` tag (after line 23, before `<main>`):

```html
<link slot="head" rel="preload" as="image" href="{heroDecks[0][heroDecks[0].length" - 1].src} />
```

The `fetchpriority="high"` is already on the `<img>` itself (Task 3). The preload tells the browser's preload scanner to start the fetch earlier.

- [ ] **Step 2: Verify preload appears in HTML**

```bash
npm run build && grep "rel=\"preload\"" dist/ai-shoots/index.html
```

Expected: One line containing `rel="preload"` with the ImageKit URL of the first deck's last card.

- [ ] **Step 3: Commit**

```bash
git add src/pages/ai-shoots.astro
git commit -m "perf: preload hero LCP image in head"
```

---

## Task 7: Add Global `prefers-reduced-motion`

**Files:**

- Modify: `src/styles/global.css` (append)
- Modify: `src/scripts/lenis.ts:11`

ShootsHero already handles this in JS. This task covers the global CSS fallback and Lenis.

- [ ] **Step 1: Add reduced-motion CSS to global.css**

Append at the end of `src/styles/global.css` (after line 424):

```css
/* ── Reduced Motion ─────────────────────────────────────────────────────── */

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

- [ ] **Step 2: Add reduced-motion guard to lenis.ts**

In `src/scripts/lenis.ts`, add a guard at the top of the `initLenis()` function (line 11). Change from:

```typescript
function initLenis() {
	lenis = new Lenis({
```

To:

```typescript
function initLenis() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	lenis = new Lenis({
```

This prevents Lenis from initializing at all when the user prefers reduced motion, falling back to native scroll.

- [ ] **Step 3: Verify reduced motion works**

Run: `npm run dev`
In Chrome DevTools → Rendering → check "Emulate CSS media feature prefers-reduced-motion: reduce". Reload the page. All animations should be effectively instant, and scrolling should use native behavior (no smooth scroll).

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/scripts/lenis.ts
git commit -m "a11y: respect prefers-reduced-motion globally"
```

---

## Task 8: Fix ScrollTrigger.refresh() Timing

**Files:**

- Modify: `src/scripts/lenis.ts:32-37`

Currently `ScrollTrigger.refresh()` fires on `astro:page-load` before images have decoded, causing miscalculated scroll positions.

- [ ] **Step 1: Replace the page-load handler**

In `src/scripts/lenis.ts`, change lines 32-37 from:

```typescript
document.addEventListener('astro:page-load', () => {
	// If we needed to re-init specific page logic, we'd do it here.
	// Since Lenis is global and we want it to persist smoothly,
	// we might just need to refresh ScrollTrigger.
	ScrollTrigger.refresh();
});
```

To:

```typescript
document.addEventListener('astro:page-load', async () => {
	// Wait for all images to decode before recalculating scroll positions.
	// This prevents ScrollTrigger from measuring the page height before
	// images have loaded, which causes broken trigger positions.
	await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
	ScrollTrigger.refresh();
});
```

- [ ] **Step 2: Verify ScrollTrigger still works**

Run: `npm run dev`
Open `/ai-shoots`, scroll down past the hero to the showcase section. The `reveal-up` animations on ServicesGrid should trigger at the correct scroll position (not too early or too late).

- [ ] **Step 3: Commit**

```bash
git add src/scripts/lenis.ts
git commit -m "fix: wait for image decode before ScrollTrigger.refresh()"
```

---

## Task 9: Run Codex Agents

**Files:** None (delegated to Codex)

Three audit prompts are already pushed to `dev` in the `docs/` folder.

- [ ] **Step 1: Run 3 Codex agents in parallel**

Create 3 Codex tasks, each starting from the `dev` branch:

**Agent 1 — Visual Alignment:**

```
Read docs/CODEX-1-VISUAL-ALIGNMENT.md and follow the instructions. The reference file is at C:\Users\junej\Downloads\NexAI-Website\NexAI-Website\src\pages\ai-shoots.astro. Branch: fix/visual-alignment
```

**Agent 2 — Animation Polish:**

```
Read docs/CODEX-2-ANIMATION-POLISH.md and follow the instructions. Branch: fix/animation-polish
```

**Agent 3 — Responsive Edge Cases:**

```
Read docs/CODEX-3-RESPONSIVE-EDGE-CASES.md and follow the instructions. Branch: fix/responsive-edge-cases
```

- [ ] **Step 2: Review PRs**

For each PR, check:

- Does it address the quality bar in its respective CODEX doc?
- Does it introduce regressions at 390px mobile and 1440px desktop?
- Are there merge conflicts with other PRs or with Tasks 1-8?

- [ ] **Step 3: Resolve conflicts and merge**

Merge each PR to `dev` one at a time. Likely conflict areas:

- `ShootsHero.astro` — hero animation changes from all 3 agents may overlap
- `ShowcaseV3.astro` — mobile stage from animation polish vs responsive edge cases

After each merge, run `npm run build` to verify no breakage.

---

## Task 10: Deploy to Cloudflare Pages

**Files:**

- None (dashboard configuration)

- [ ] **Step 1: Merge dev to main**

```bash
git checkout main
git merge dev
git push origin main
```

- [ ] **Step 2: Configure Cloudflare Pages**

In the Cloudflare dashboard:

- Go to Workers & Pages → Create → Connect to Git
- Select repository: `nexailabs/NexAI-Website`
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist/`
- Environment variable: `NODE_VERSION` = `22`

- [ ] **Step 3: Verify deployment**

After the first build completes:

1. Confirm site loads at `https://nexailabs.com`
2. Navigate to `/ai-shoots` — hero animation plays, showcase loads, services grid visible
3. Check security headers:
   ```bash
   curl -I https://nexailabs.com/ai-shoots | grep -E "(X-Frame|Content-Security|X-Content-Type)"
   ```
   Expected: headers from `public/_headers` are served
4. Check sitemap: `https://nexailabs.com/sitemap-index.xml` should exist
5. Test OG preview: paste `https://nexailabs.com/ai-shoots` into https://www.opengraph.xyz/ — should show title, description, and image (once OG image is created)

- [ ] **Step 4: Commit any deploy fixes if needed**

If Cloudflare build fails (e.g., Node version mismatch), fix and push again.
