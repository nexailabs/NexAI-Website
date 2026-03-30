# NexAI Labs Website: Old vs New Codebase Comparison

> A senior-level analysis for developers learning from this refactor.

---

## Final Scorecard

| Category                               | OLD (Monolithic) | NEW (Component-based) | Delta    |
| -------------------------------------- | ---------------- | --------------------- | -------- |
| A. Architecture & Code Organization    | 4/10             | 7.5/10                | +3.5     |
| B. Code Quality & Maintainability      | 3/10             | 7/10                  | +4       |
| C. CSS Architecture                    | 4/10             | 7/10                  | +3       |
| D. Animation & Interaction Engineering | 6/10             | 8/10                  | +2       |
| E. Performance Optimization            | 4/10             | 7.5/10                | +3.5     |
| F. Accessibility                       | 3/10             | 6.5/10                | +3.5     |
| G. SEO & Meta                          | 2/10             | 7/10                  | +5       |
| H. DevOps & Tooling                    | 2/10             | 8.5/10                | +6.5     |
| I. Security                            | 2/10             | 7/10                  | +5       |
| J. Website Design & UX                 | 6/10             | 7.5/10                | +1.5     |
| **Weighted Average**                   | **~3.6/10**      | **~7.3/10**           | **+3.7** |

---

## A. Architecture & Code Organization

### OLD Repo: 4/10

The old repo had a **monolithic `ai-shoots.astro` page file** containing all HTML, CSS, and JavaScript for the entire page. No `src/components/` directory, no `src/data/` directory, no separation of content from presentation.

A single page file contained: the Navbar markup and script, the hero section with its ~500-line animation script, the showcase section with its ~400-line mobile touch interaction, the services grid, the client marquee, and all associated CSS.

For a single developer prototyping, this works. For a team planning to grow, it is a dead end.

### NEW Repo: 7.5/10

Thoughtful extraction:

```
src/
  components/
    Navbar.astro          (114 lines HTML + 172 lines script + 466 lines CSS)
    ShootsHero.astro      (71 lines HTML + 497 lines script + 289 lines CSS)
    ClientMarquee.astro   (33 lines HTML + 55 lines CSS)
    ShowcaseV3.astro      (255 lines HTML + 600 lines CSS + 395 lines script)
    ServicesGrid.astro    (34 lines HTML + 118 lines CSS + 32 lines script)
  data/
    ai-shoots.ts          (187 lines of typed data)
  layouts/
    Layout.astro          (70 lines)
  pages/
    ai-shoots.astro       (84 lines - clean composition)
    index.astro           (7 lines - empty scaffold)
    404.astro             (87 lines)
  scripts/
    lenis.ts              (41 lines)
  styles/
    global.css            (436 lines)
```

**What works well:**

- `src/data/ai-shoots.ts` cleanly separates content from presentation. Adding a new brand logo means adding one object to an array -- not hunting through a 2000-line page file.
- The page file `src/pages/ai-shoots.astro` is pure composition. A junior developer can understand the page structure in 30 seconds.
- `Layout.astro` accepts typed props and handles SEO meta, OG tags, canonical URLs, fonts, and global scripts in one place.

**What still needs work:**

- `index.astro` is an empty scaffold. The homepage does not exist yet.
- `ShowcaseV3.astro` is still 1249 lines and could benefit from further decomposition.
- No shared types file. Every TypeScript interface is duplicated between `src/data/ai-shoots.ts` and the corresponding component (NavLink, HeroImage, BrandLogo, ShowcaseSlot, ShowcaseCategory, ServiceCard).

---

## B. Code Quality & Maintainability

### OLD Repo: 3/10

A monolithic page file has zero enforced modularity. No linting, no formatting config, no pre-commit hooks, no CI pipeline.

### NEW Repo: 7/10

**TypeScript usage:**

- `tsconfig.json` extends `astro/tsconfigs/strict` -- the strictest setting available.
- Every component defines `interface Props` in the frontmatter.
- The data layer exports fully typed interfaces for every data shape.

**Linting and formatting:**

- ESLint flat config with `@eslint/js`, `typescript-eslint`, and `eslint-plugin-astro`.
- Prettier enforces tabs, single quotes, 100-char print width, trailing commas, and the Astro plugin.
- Husky + lint-staged runs on every commit.

**CI pipeline:**

- GitHub Actions runs lint, format check, type check, AND build on every push to `dev` and every PR.

**DRY violations to address:**

- Every TypeScript interface is duplicated between data files and components. A shared `src/types/` directory would eliminate this.
- The `schedule()` helper pattern appears in both ShootsHero and ShowcaseV3.
- The `window[cleanupKey]` cleanup pattern is repeated identically across four scripts.

**Naming issue:**

- The `sc3` prefix (ShowcaseV3) is cryptic. Compare `.sc3__ob-card--3x4` with `.shoots-hero__card--1` -- the latter is self-documenting.

---

## C. CSS Architecture

### OLD Repo: 4/10

All CSS inlined in the single page file. No design tokens, no reusable variables, no systematic responsive approach.

### NEW Repo: 7/10

**Design tokens** (`src/styles/global.css`, lines 7-56):
Well-structured with clear categories: backgrounds (4 tokens), brand colors (3 + gradient), accents (2), semantic (2), text (3), borders (2), gradients (2), typography (2), spacing (6), animation (1).

**Scoping strategy:**

- `global.css` handles cross-cutting concerns (reset, Lenis, utilities).
- Components use Astro's `<style>` scoping.
- ShowcaseV3 uses `<style is:global>` because it styles dynamically added classes -- correct Astro pattern.

**Responsive approach:**

- `clamp()` used extensively and correctly throughout.
- Breakpoints are 380px, 600px, 640px, 720px, 768px, 900px, and 1100px.
- **No centralized breakpoint system** -- each component defines its own. The inconsistency between 768px (ServicesGrid) and 720px (ShootsHero) for the "tablet" breakpoint is a potential source of bugs.

**Missing:**

- No `@layer` usage for CSS specificity management.
- Three `!important` declarations in ShowcaseV3 suggest specificity fights that should be resolved structurally.

---

## D. Animation & Interaction Engineering

### OLD Repo: 6/10

The animation code existed in monolithic form and was working correctly. The quality of the animation design was already high -- the refactored version preserves the same choreography.

### NEW Repo: 8/10

**This is the strongest area of the codebase.**

**Hero card animation orchestration (ShootsHero, 497 lines):**

- Epoch-tracked cycle engine: each `runCycle()` increments the epoch, all scheduled callbacks check if their epoch is still current before executing. Prevents stale callbacks on rapid dock clicks.
- Desktop and mobile have completely separate choreographies.
- `schedule()` wraps `setTimeout` with epoch validation AND tracks timer IDs.
- `scheduleRaf()` tracks `requestAnimationFrame` IDs for cleanup.

**Memory management:**

- `window[cleanupKey]` ensures cleanup runs before re-initialization.
- `window[swapListenersKey]` prevents duplicate view transition listeners.
- Every component that registers event listeners cleans them up.

**Resize handling:**

- ShootsHero debounces resize with RAF and detects mobile/desktop mode changes. On mode change, it completely resets and restarts the cycle.

**Touch/pointer event handling:**

- ShowcaseV3 mobile uses Pointer Events API (not touch events).
- Implements pointer capture for reliable drag tracking.
- Axis locking: horizontal intent detected before committing to drag, allowing vertical scrolling to proceed.
- RAF-batched rendering to avoid layout thrashing during drag.

**prefers-reduced-motion:**

- Checked in 6 places: global.css (blanket rule), lenis.ts (skip init), ShootsHero (static first deck), ShowcaseV3 tabs (skip transitions), ShowcaseV3 CSS (disable mobile card transitions), ServicesGrid (instant reveal).

**What could improve:**

- No GSAP usage for hero animation despite GSAP being a dependency. The manual RAF approach is justified (dynamic geometry calculations that GSAP timelines can't replace) but means shipping GSAP while only using it for Lenis+ScrollTrigger sync.
- `window` property pollution for inter-script communication (`window.__initMobShowcaseCycle`) is fragile and untyped.

---

## E. Performance Optimization

### OLD Repo: 4/10

Missing `width`/`height` on images, no LCP preload, no OG meta. 14 images without dimensions causing CLS.

### NEW Repo: 7.5/10

**Image loading:**

- Every `<img>` has explicit `width` and `height` for CLS prevention.
- LCP image preloaded via `<link rel="preload">` in `<head>`.
- LCP image gets `loading="eager"` + `fetchpriority="high"`. All others get `loading="lazy"` + `decoding="async"`.
- ImageKit CDN with `?tr=w-600,f-auto,q-80` serves WebP/AVIF automatically.

**Font loading:**

- Google Fonts with `preconnect` for both domains.
- `display=swap` prevents FOIT.
- Only loads needed weights.

**Caching:**

- `Cache-Control: public, max-age=31536000, immutable` for hashed assets. Optimal.

**Missing:**

- Default OG image (`og-default.jpg`) doesn't exist yet.
- Brand logos are unoptimized PNGs (one is 1479x633).
- No `<link rel="preload">` for critical font files.

---

## F. Accessibility

### OLD Repo: 3/10

No accessibility features described. Monolithic approach = accessibility as afterthought.

### NEW Repo: 6.5/10

**Implemented:**

- ARIA: `aria-expanded`, `aria-controls`, `aria-label` on navbar. `aria-hidden` on decorative elements and marquee clones. Showcase panels get `aria-hidden` during tab switching.
- Screen reader: `.shoots-hero__sr-only` hides the `<h1>` visually while keeping it accessible.
- Keyboard: Escape closes navbar. `:focus-visible` styles present throughout.

**Missing:**

- No skip-to-content link (WCAG 2.1 AA requirement).
- No focus trap in nav takeover overlay.
- ShowcaseV3 tabs lack `role="tab"`, `aria-selected`, `role="tabpanel"`.
- Dock thumbnails lack `aria-pressed` or `aria-current`.
- Focus-visible handlers use `outline: none` with only subtle visual replacements.

---

## G. SEO & Meta

### OLD Repo: 2/10

No OG tags, no canonical URLs, no sitemap integration.

### NEW Repo: 7/10

**Implemented:** Title per page, meta description, canonical URL, Open Graph (type/title/description/image/url), Twitter cards, sitemap via `@astrojs/sitemap`, 404 page, `_redirects`.

**Missing:** No `twitter:image`. Default OG image file doesn't exist. No `robots.txt`. No JSON-LD. Homepage uses generic default description.

---

## H. DevOps & Tooling

### OLD Repo: 2/10

No CI, no hooks, no linting, no deployment config.

### NEW Repo: 8.5/10

**One of the strongest areas:**

- Husky + lint-staged pre-commit hooks.
- GitHub Actions CI with 4 quality gates (lint, format, type-check, build).
- CODEOWNERS, PR templates, issue templates.
- Dependabot for weekly npm + Actions updates.
- `.vscode/` config for consistent IDE experience.
- Cloudflare Pages deployment with `_headers` for security/caching.

**Missing:** Zero tests. No visual regression testing. No `engines.npm` constraint.

---

## I. Security

### OLD Repo: 2/10

No security headers, no CSP, no deployment configuration.

### NEW Repo: 7/10

**Implemented:** `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`, and CSP with appropriate source directives for ImageKit, Google Fonts, and inline scripts.

**Could improve:** No HSTS header (Cloudflare handles it, but defense-in-depth). `X-XSS-Protection` is deprecated. No CSP violation reporting.

---

## J. Website Design & UX

### OLD Repo: 6/10

Visual design at 7.5/10 (its strongest area) but "brand fragmentation," "template feel," and "trying to be everything to everyone."

### NEW Repo: 7.5/10

- Design token system creates consistent dark visual language.
- Typography: Inter body + Cormorant Garamond italic on hover -- striking serif/sans-serif interplay.
- Hero animation (card stacking/spreading/cycling) communicates "we work with multiple brands" through motion rather than static grid.
- Mobile showcase before/after swipe uses 16 CSS custom properties as a state machine. Professional-grade interaction engineering.
- Clear conversion funnel: Hero (attention) -> Logos (trust) -> Showcase (proof) -> Services (details).

---

## Lessons Learned

### What Was Gained

1. **Component extraction pays compound interest.** Adding a new section is now: create a component, drop it in the page. Not: find the right spot in a 2000-line file and pray you don't break adjacent CSS.

2. **A data layer changes everything.** Moving URLs and content to typed data files means content changes are impossible to break. You cannot accidentally delete a CSS rule while updating a brand logo path.

3. **Tooling is infrastructure, not overhead.** Pre-commit hooks, CI, and CODEOWNERS cost ~2 hours to set up. They prevent entire categories of bugs forever.

4. **Security headers are cheap insurance.** 16 lines of `_headers` provides CSP, clickjacking protection, MIME sniffing prevention, and caching.

5. **Documentation is architecture.** The `docs/` directory means a new team member can understand not just what was built, but why.

### What Was Lost (or Nearly Lost)

1. **Visual fidelity during extraction.** The CODEX-1 audit exists specifically because extraction introduced regressions. Extracting a 2000-line file into 5 components means 5 opportunities for CSS values to shift. Lesson: extraction is not a refactoring -- it is a rewrite that must be visually validated at every breakpoint.

2. **Animation continuity.** `is:inline` scripts lost module scope for state sharing. The refactored code uses `window` property pollution as a workaround. It works but is more fragile.

3. **Simplicity.** A junior developer could open one file and see everything in the old version. The new repo requires understanding component composition, Astro scoping, and 12 source files. This complexity is justified for a growing team, but it is real.

### What the Junior Developer Should Internalize

1. **Read the code before you write code.** Every hour spent reading `docs/BUILD-PLAN.md`, `BRAND.md`, and `REFERENCES.md` saves three hours of building the wrong thing.

2. **TypeScript interfaces are documentation.** `interface Props { decks: HeroImage[][] }` tells you exactly what a component needs. Treat interfaces as contracts.

3. **Cleanup is not optional.** Every `<script is:inline>` follows the same pattern: check if cleanup exists, run it, then initialize. If you add a new animation with event listeners or timers, you must provide a cleanup function.

4. **`prefers-reduced-motion` is not a nice-to-have.** This codebase checks it in 6 places because some users have vestibular disorders triggered by animation. Always respect this.

5. **The pre-commit hook is your friend.** Do not bypass it. CI catches the same issues anyway, and you waste more time fixing a failed PR than letting lint-staged fix your code locally.

---

## What's Still Missing (Neither Version Addresses)

1. **Tests.** Zero test coverage. Every change is a manual QA session.
2. **Skip-to-content link.** WCAG 2.1 AA requirement. Neither version has one.
3. **Focus trap in nav takeover.** Keyboard focus can escape to background content.
4. **Image error states.** If ImageKit is down, images show as broken. No fallback.
5. **A working homepage.** `index.astro` is 7 lines with empty `<main></main>`.
6. **`robots.txt`.** Not present in `public/`.
7. **Shared TypeScript types.** Every interface duplicated between data files and components.
8. **Centralized breakpoints.** Six different breakpoint values across four components.
9. **`color-scheme: dark` meta tag.** Tells browsers the site is intentionally dark.
10. **The missing OG image.** `og-default.jpg` is referenced but doesn't exist.
11. **Performance monitoring.** No analytics, no Core Web Vitals tracking, no error tracking.
