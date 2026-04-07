Audit the design, animations, and file architecture of a fashion AI studio website. Be critical and specific — flag real issues with file paths and line numbers, not generic advice.

### Stack

Astro v5, vanilla TypeScript, CSS (scoped + global tokens), Lenis smooth scroll, ImageKit CDN. No frameworks (React/Vue/etc). Hosted on Cloudflare Pages.

### File Structure

```
src/
├── pages/
│   ├── studio/index.astro              # Main studio landing page
│   ├── studio/gallery.astro            # Gallery page (stub)
│   ├── studio/showcase/*.astro         # Category pages (ethnic-wear, saree, jewelry, menswear, unstitched)
│   ├── index.astro                     # Homepage
│   ├── coming-soon.astro               # Placeholder for unreleased products
│   └── 404.astro
├── components/
│   ├── StudioHero.astro                # Hero with 4-deck image rotation + dock thumbnail switcher
│   ├── StudioShowcase.astro            # Tabbed before/after showcase (desktop: bento grid, mobile: swipe cards)
│   ├── StudioProcess.astro             # Scroll-driven "How It Works" — image travels through 4 steps
│   ├── StudioFAQ.astro                 # Accordion FAQ with 8 questions
│   ├── StudioCTA.astro                 # Final CTA section with Book a Call button
│   ├── ClientMarquee.astro             # Infinite-scroll brand logo marquee
│   ├── Navbar.astro                    # Auto-hide navbar with fullscreen takeover menu
│   ├── Footer.astro                    # Global footer (4-col desktop, app-like mobile)
│   ├── CustomCursor.astro              # Custom cursor (desktop only)
│   └── CategoryPage.astro              # Shared layout for category detail pages
├── scripts/
│   ├── studio-hero.ts                  # Orchestrator for hero animation
│   ├── hero/hero-engine.ts             # Core animation: deck cycling, card states, timeline
│   ├── hero/hero-resize.ts             # Breakpoint/orientation adaptation
│   ├── hero/hero-dock.ts               # Dock thumbnail click handlers
│   ├── studio-showcase.ts              # Tab switching, crossfade, mobile swipe carousel
│   ├── studio-process.ts              # Scroll-driven process animation (desktop horizontal, mobile vertical)
│   ├── navbar.ts                       # Scroll hide/reveal, takeover panel, Lenis stop/start
│   ├── custom-cursor.ts               # Pointer-following cursor with idle fade
│   └── lenis.ts                        # Lenis smooth scroll init + exported stop/start helpers
├── config/
│   ├── site.ts                         # Site name, URL, email, booking URL
│   ├── imagekit.ts                     # CDN endpoint, transform presets, srcset helpers
│   └── navigation.ts                   # Nav configs for main site + studio section
├── data/
│   ├── studio.ts                       # Media data: hero decks, brand logos, showcase categories, CTA floats
│   └── studio-copy.ts                  # Text content: process steps, FAQ items
├── types/
│   └── studio.ts                       # TypeScript interfaces for all studio data
├── layouts/
│   └── Layout.astro                    # Base HTML: meta tags, OG, JSON-LD, View Transitions, self-hosted fonts
└── styles/
    └── global.css                      # Design tokens (colors, fonts, weights, line-heights, sizes), resets, utilities
```

### Design Token System (global.css)

```
Fonts:      --font-main (Inter), --font-brand (Montserrat), --font-accent (Cormorant Garamond)
Weights:    --fw-regular (400), --fw-semibold (600), --fw-bold (700), --fw-black (800)
Heights:    --lh-tight (1), --lh-heading (1.15), --lh-ui (1.3), --lh-body (1.6), --lh-reading (1.7)
Sizes:      --text-xs (0.72rem), --text-sm (0.85rem), --text-base (1rem), --text-btn (0.92rem)
Colors:     --color-text-main (#fff), --color-text-muted (0.6), --color-text-subtle (0.55), --color-text-dim (0.4)
Brand:      --color-brand-teal (#1e7e72), --color-brand-cyan (#4ec9b4)
Surfaces:   --color-bg (#050607), --color-surface (#0a0a0a), --color-border (0.12)
Utilities:  .container, .section-header, .section-title, .section-sub, .section-eyebrow, .tag-pill, .btn-ghost, .gradient-text
```

### Breakpoints

```
380px   (tiny phones — navbar text hidden)
600px   (showcase column collapse)
640px   (navbar compact mode)
720px   (hero mobile/desktop switch, JS isMobile())
900px   (showcase mobile/desktop, nav CTA hidden)
1100px  (hero title max-width, FAQ 2-col → 1-col)
```

### What to Audit

1. **Animation quality (mobile + desktop):** Review hero deck rotation, showcase tab crossfade, process scroll-driven image travel, FAQ accordion, mobile before/after swipe, navbar hide/reveal, marquee scroll, and cursor. Flag jank risks, unnecessary repaints, missing `will-change`, `prefers-reduced-motion` gaps, or animations that fight Lenis smooth scroll.

2. **Responsive design:** Breakpoint gaps? Does the mobile showcase degrade well? Is the process scroll animation smooth on real phones? Navbar takeover menu touch-friendly? Overflow or layout-shift risks? Footer mobile layout?

3. **Architecture:** Component/script split clean? Any scripts doing too much? Dead code? Data layer well-structured? CSS scoping consistent (scoped vs global)? Token system complete?

4. **Performance:** Image loading strategy (ImageKit transforms, srcset, lazy loading, preload). CSS delivery (scoped vs global). Script loading (page-specific vs global). `content-visibility` usage. Render-blocking concerns? Core Web Vitals risks (LCP, CLS, INP)?

5. **SEO & Accessibility:** Heading hierarchy (h1 → h2 → h3). ARIA on interactive elements. JSON-LD completeness. Sitemap. Meta tags on all pages. Skip-to-content. Focus management in takeover nav.

6. **Quick wins:** Top 5 highest-impact improvements ranked by effort vs payoff.

### How to Use

Feed this prompt + the contents of any specific files you want audited. For a full audit, include:

- `src/styles/global.css` (token system)
- `src/scripts/studio-hero.ts` + `hero/*.ts` (animation engine)
- `src/components/StudioShowcase.astro` (most complex component)
- `src/scripts/studio-showcase.ts` (most complex script)
- `src/pages/studio/index.astro` (page composition)
