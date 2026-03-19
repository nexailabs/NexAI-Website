# BUILD: Nav Bar + Hero Section — AI Photography Landing Page

## PROJECT

Existing Astro 5 website. You are building 2 components and assembling them into a single page at `/ai-shoots`.

**Stack:** Astro 5.16.15, TypeScript strict, GSAP 3.14 + ScrollTrigger, Lenis smooth scroll, vanilla CSS with design tokens. No Tailwind. No React/Vue/Svelte.

**Do NOT touch these files:**
- `src/scripts/lenis.ts` — working smooth scroll + GSAP sync
- `tsconfig.json`
- `src/pages/index.astro` — leave existing homepage alone

---

## BRAND

**Company:** NexAI Labs — AI-powered product photography for D2C fashion brands
**Logo:** Hexagonal geometric teal icon. Logo files at `public/assets/nexai-icon.png` (user will add).
For now, use the text "NexAI Labs" as the logo with a teal accent on "Nex".

### Colors

```css
/* Add these to :root in src/styles/global.css (keep all existing tokens) */

/* Backgrounds */
--color-bg: #050607;
--color-surface: #0a0a0a;
--color-surface-elevated: #18191b;

/* Brand teal (from logo gradient) */
--color-brand-teal: #1E7E72;
--color-brand-cyan: #4EC9B4;
--color-brand-gradient: linear-gradient(135deg, #1E7E72, #4EC9B4);

/* Accent */
--color-accent: #DCEA22;

/* Text */
--color-text-main: #ffffff;
--color-text-muted: rgba(255, 255, 255, 0.6);
--color-text-subtle: rgba(255, 255, 255, 0.4);

/* Borders */
--color-border: rgba(255, 255, 255, 0.12);
--color-border-hover: rgba(255, 255, 255, 0.24);

/* Semantic */
--color-success: #10b981;

/* Hero background */
--gradient-hero: radial-gradient(ellipse at 20% 0%, rgba(30, 126, 114, 0.15) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 100%, rgba(78, 201, 180, 0.08) 0%, transparent 50%);
```

### Typography
- Font: Inter (400, 600, 800) — already loaded via Google Fonts in Layout.astro
- Hero headline: `clamp(2.5rem, 6vw, 5rem)`, weight 800, line-height 1.08
- Subheadline: `clamp(1rem, 2vw, 1.25rem)`, weight 400, line-height 1.6
- Nav links: 0.9rem, weight 500
- Labels/badges: 0.8rem, weight 600, uppercase, letter-spacing 0.06em

### Design language
- Pure black background, teal accent glow, white text
- Glassmorphism on nav: `backdrop-filter: blur(16px)`, `bg: rgba(5,6,7,0.8)`
- Buttons: pill shape (`border-radius: 999px`), hover scale + glow
- Smooth GSAP entrance animations, not CSS — the project uses GSAP for all motion
- Responsive: 375px (mobile), 768px (tablet), 1024px+ (desktop)

---

## EXISTING FILES (for context — read these, extend global.css)

### `src/styles/global.css`

```css
:root {
  --color-bg: #000000;
  --color-surface: #0a0a0a;
  --color-surface-hover: #151515;
  --color-text-main: #ffffff;
  --color-text-muted: #9ca3af;
  --color-accent: #00e5ff;
  --color-border: #222222;
  --font-main: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Inter', sans-serif;
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
  --space-xl: 8rem;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-family: var(--font-main);
  background: var(--color-bg);
  color: var(--color-text-main);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}

html.lenis { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
.lenis.lenis-stopped { overflow: hidden; }
.lenis.lenis-scrolling iframe { pointer-events: none; }

.container { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 var(--space-sm); }

.text-gradient {
  background: linear-gradient(to right, #fff, #999);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### `src/layouts/Layout.astro`

```astro
---
import { ClientRouter } from 'astro:transitions';
import '../styles/global.css';
interface Props { title: string; description?: string; }
const { title, description = "NexAI Labs - Business Growth on Autopilot" } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <ClientRouter />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <slot />
    <script src="../scripts/lenis.ts"></script>
  </body>
</html>
```

---

## WHAT TO BUILD

### 1. NAV — `src/components/nav/Nav.astro`

Full-width fixed navigation bar.

**Behavior:**
- `position: fixed`, `top: 0`, `left: 0`, `width: 100%`, `z-index: 1000`
- **Initial state:** Fully transparent background, no border
- **After 50px scroll:** Transition to frosted glass — `background: rgba(5, 6, 7, 0.8)`, `backdrop-filter: blur(16px)`, `border-bottom: 1px solid var(--color-border)`. Toggle via JS `scroll` event adding a `.scrolled` class to the `<nav>`.
- **Transition:** `transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s`
- **Height:** ~64px desktop, ~56px mobile
- **Padding:** `0 clamp(1rem, 3vw, 3rem)`

**Layout (desktop ≥768px):**
```
[ Logo ]                    [ How It Works  |  Pricing  |  FAQ ]    [ Book a Call → ]
```
- **Left:** "NexAI Labs" text logo. Style "Nex" in white, "AI" in brand teal (`--color-brand-cyan`), " Labs" in `--color-text-muted`. Font-size 1.25rem, weight 700. Wrap in `<a href="/">`.
- **Center-right links:** `<a>` tags linking to `#how-it-works`, `#pricing`, `#faq`. Style: `color: var(--color-text-muted)`, hover: `color: var(--color-text-main)`, `transition: color 0.2s`. Use `font-size: 0.9rem`, `font-weight: 500`.
- **Right CTA:** "Book a Call" — `<a href="https://cal.com/nexailabs/15min" class="nav-cta">`. Style: `background: var(--color-brand-gradient)`, `color: white`, `padding: 0.5rem 1.25rem`, `border-radius: 999px`, `font-size: 0.85rem`, `font-weight: 600`. Hover: `transform: scale(1.05)`, `box-shadow: 0 0 20px rgba(78, 201, 180, 0.4)`.

**Layout (mobile <768px):**
- **Left:** Logo (same)
- **Right:** Hamburger button — 3 lines, animated to X on open. Pure CSS + JS toggle.
  - Lines: `width: 24px`, `height: 2px`, `background: white`, `border-radius: 2px`
  - Open state: top line rotates 45deg, middle fades, bottom rotates -45deg
  - Transition: `transition: transform 0.3s, opacity 0.2s`
- **Menu overlay:** Full-screen fixed overlay, `background: rgba(5, 6, 7, 0.95)`, `backdrop-filter: blur(20px)`. Links stack vertically centered, `font-size: 1.5rem`, `font-weight: 600`. "Book a Call" CTA at bottom. Links fade in with stagger on open.
- **Body scroll lock:** Add `data-lenis-prevent` to overlay div so Lenis doesn't scroll behind it.

**GSAP entrance (runs once on page load):**
```javascript
gsap.from('.nav', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 });
```

---

### 2. HERO — `src/components/sections/shoots/HeroShoots.astro`

Full-viewport hero section. This is the first thing visitors see. It must be visually stunning.

**Container:**
- `min-height: 100svh` (use `svh` for mobile accuracy, fallback `100vh`)
- `display: flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`
- `text-align: center`
- `padding: 6rem var(--space-sm) var(--space-lg)`
- `position: relative`, `overflow: hidden`

**Background layers (behind content, `position: absolute`, `inset: 0`, `z-index: 0`):**
1. Base: `background: var(--color-bg)` (`#050607`)
2. Gradient layer: `var(--gradient-hero)` — two subtle radial gradients creating a teal glow at top-left and bottom-right
3. Grid overlay (optional, subtle): A faint CSS grid pattern using `background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, `background-size: 60px 60px`. This adds depth without being distracting.
4. Animated glow orb: A `<div>` with `width: 500px`, `height: 500px`, `background: radial-gradient(circle, rgba(30,126,114,0.2) 0%, transparent 70%)`, `border-radius: 50%`, `filter: blur(80px)`, `position: absolute`, animated slowly with CSS `@keyframes float` moving between positions. Very subtle.

**Content (inside `.hero-content`, `position: relative`, `z-index: 1`, `max-width: 900px`):**

**Element 1 — Trust badge:**
```html
<span class="trust-badge">
  <span class="trust-dot"></span>
  Trusted by 15+ D2C Fashion Brands
</span>
```
- `.trust-badge`: `display: inline-flex`, `align-items: center`, `gap: 0.5rem`, `padding: 0.4rem 1rem`, `border-radius: 999px`, `background: rgba(16, 185, 129, 0.1)`, `border: 1px solid rgba(16, 185, 129, 0.3)`, `font-size: 0.8rem`, `font-weight: 600`, `color: var(--color-success)`, `letter-spacing: 0.02em`
- `.trust-dot`: `width: 6px`, `height: 6px`, `border-radius: 50%`, `background: var(--color-success)`, `animation: pulse 2s infinite` (simple opacity pulse)

**Element 2 — Headline:**
```html
<h1 class="hero-title">
  Stop Waiting Weeks<br/>
  for <span class="gradient-text">Photoshoots</span>
</h1>
```
- `.hero-title`: `font-size: clamp(2.5rem, 6vw, 5rem)`, `font-weight: 800`, `line-height: 1.08`, `letter-spacing: -0.03em`, `margin-top: 1.5rem`
- `.gradient-text`: `background: var(--color-brand-gradient)`, `-webkit-background-clip: text`, `-webkit-text-fill-color: transparent`, `background-clip: text`

**Element 3 — Subheadline:**
```html
<p class="hero-subtitle">
  Transform mannequin shots into stunning on-model photos in 48 hours.<br class="desktop-only"/>
  80% cheaper than traditional shoots.
</p>
```
- `.hero-subtitle`: `font-size: clamp(1rem, 2vw, 1.25rem)`, `line-height: 1.6`, `color: var(--color-text-muted)`, `max-width: 640px`, `margin: 1.5rem auto 0`
- `.desktop-only`: `display: none` below 768px

**Element 4 — CTA group:**
```html
<div class="hero-cta">
  <a href="https://cal.com/nexailabs/15min" class="btn-primary">
    Get Free Sample Images
    <svg><!-- right arrow icon, 16x16 --></svg>
  </a>
  <p class="hero-cta-sub">No commitment. See results before you pay.</p>
</div>
```
- `.hero-cta`: `margin-top: 2.5rem`, `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 0.75rem`
- `.btn-primary`: White bg, dark text, `padding: 1rem 2rem`, `border-radius: 999px`, `font-weight: 600`, `font-size: 1.05rem`. Hover: `transform: scale(1.04)`, `box-shadow: 0 0 30px rgba(78, 201, 180, 0.3)`
- `.hero-cta-sub`: `font-size: 0.85rem`, `color: var(--color-text-subtle)`
- Arrow SVG: simple `→` or chevron-right, `width: 18px`, `height: 18px`, `stroke: currentColor`

**Element 5 — Before/After showcase:**
```html
<div class="hero-showcase">
  <div class="showcase-card before">
    <div class="showcase-image placeholder-before">
      <span>Mannequin Shot</span>
    </div>
    <span class="showcase-label">Your Product Photo</span>
  </div>
  <div class="showcase-arrow">
    <svg><!-- animated arrow pointing right --></svg>
  </div>
  <div class="showcase-card after">
    <div class="showcase-image placeholder-after">
      <span>On-Model Photo</span>
    </div>
    <span class="showcase-label">48 Hours Later</span>
  </div>
</div>
```
- `.hero-showcase`: `display: flex`, `align-items: center`, `gap: 1.5rem`, `margin-top: 3.5rem`, `justify-content: center`. On mobile (<768px): `flex-direction: column`, `gap: 1rem`
- `.showcase-card`: `border-radius: 16px`, `overflow: hidden`, `border: 1px solid var(--color-border)`, `background: var(--color-surface)`
- `.showcase-image`: `width: clamp(200px, 30vw, 320px)`, `aspect-ratio: 3/4`, `display: flex`, `align-items: center`, `justify-content: center`
- `.placeholder-before`: `background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)`, text: `color: var(--color-text-subtle)`, `font-size: 0.85rem`
- `.placeholder-after`: `background: linear-gradient(135deg, rgba(30,126,114,0.15) 0%, rgba(78,201,180,0.08) 100%)`, text: `color: var(--color-brand-cyan)`, `font-size: 0.85rem`
- `.showcase-label`: `display: block`, `padding: 0.75rem`, `font-size: 0.8rem`, `font-weight: 600`, `color: var(--color-text-muted)`, `text-align: center`, `text-transform: uppercase`, `letter-spacing: 0.05em`
- `.showcase-arrow`: `font-size: 1.5rem`, `color: var(--color-brand-cyan)`. On mobile: rotate 90deg. Use a simple SVG arrow or the text "→".

**GSAP animation (in a `<script>` tag at bottom of component):**

```javascript
import { gsap } from 'gsap';

function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.trust-badge', { y: 20, opacity: 0, duration: 0.6 }, 0.2)
    .from('.hero-title', { y: 30, opacity: 0, duration: 0.8 }, 0.4)
    .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8 }, 0.65)
    .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6 }, 0.85)
    .from('.showcase-card.before', { x: -30, opacity: 0, duration: 0.8 }, 1.0)
    .from('.showcase-arrow', { scale: 0, opacity: 0, duration: 0.4 }, 1.2)
    .from('.showcase-card.after', { x: 30, opacity: 0, duration: 0.8 }, 1.0);
}

initHeroAnimations();

document.addEventListener('astro:page-load', () => {
  initHeroAnimations();
});
```

**Set initial CSS states for animated elements (prevents flash):**
```css
.trust-badge, .hero-title, .hero-subtitle, .hero-cta {
  opacity: 0;
}
.showcase-card { opacity: 0; }
```

---

### 3. GLOBAL.CSS ADDITIONS

Append these to the bottom of `src/styles/global.css`. Do NOT remove or modify any existing code.

```css
/* -------------------------------------------------------------------------- */
/*                         NEW TOKENS & UTILITIES                             */
/* -------------------------------------------------------------------------- */

/* Override/extend existing tokens - add to :root */
/* (See color tokens above in BRAND section) */

.gradient-text {
  background: var(--color-brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #fff;
  color: #050607;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
  transition: transform 0.2s var(--ease-out-expo), box-shadow 0.3s;
  cursor: pointer;
  border: none;
}
.btn-primary:hover {
  transform: scale(1.04);
  box-shadow: 0 0 30px rgba(78, 201, 180, 0.3);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(30px, -20px); }
  66% { transform: translate(-20px, 15px); }
}
```

---

### 4. PAGE ASSEMBLY — `src/pages/ai-shoots.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/nav/Nav.astro';
import HeroShoots from '../components/sections/shoots/HeroShoots.astro';
---

<Layout
  title="AI Photoshoots for Fashion Brands | NexAI Labs"
  description="Transform mannequin shots into studio-quality on-model photos in 48 hours. 80% cheaper. Trusted by 15+ D2C brands."
>
  <Nav />
  <main>
    <HeroShoots />
  </main>
</Layout>
```

---

## ACCEPTANCE CRITERIA

- [ ] `npm run build` — zero errors
- [ ] `localhost:4321/ai-shoots` loads the page
- [ ] Nav is fixed at top, transparent on load, frosted glass after scrolling
- [ ] Nav "Book a Call" links to cal.com/nexailabs/15min
- [ ] Hamburger menu works on mobile (<768px), opens full-screen overlay
- [ ] Hero fills viewport height on all screen sizes
- [ ] Teal gradient glow visible in hero background (subtle, not overpowering)
- [ ] Trust badge visible with green dot pulse
- [ ] Headline renders large with "Photoshoots" in teal gradient text
- [ ] CTA button is white pill, hover shows teal glow shadow
- [ ] Before/After cards render side by side (desktop) or stacked (mobile)
- [ ] All GSAP animations play on page load — staggered, smooth entrance
- [ ] No console errors
- [ ] No horizontal scroll on any viewport width
- [ ] Looks beautiful and premium — not generic, not template-like

## DO NOT

- Do not install any new npm packages
- Do not use Tailwind or any CSS framework
- Do not modify `src/scripts/lenis.ts`
- Do not create any other pages
- Do not add a footer or additional sections — just Nav + Hero
