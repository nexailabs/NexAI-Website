# NexAI Labs — Brand Identity

## Colors

Extracted from the live site (nexailabs.com) and logo assets.

| Token                      | Value                                       | Usage                                          |
| -------------------------- | ------------------------------------------- | ---------------------------------------------- |
| `--color-bg`               | `#050607`                                   | Page background                                |
| `--color-surface`          | `#0a0a0a`                                   | Card/section backgrounds                       |
| `--color-surface-elevated` | `#18191b`                                   | Elevated cards, nav on scroll                  |
| `--color-brand-teal`       | `#1E7E72`                                   | Brand gradient start (darker teal)             |
| `--color-brand-cyan`       | `#4EC9B4`                                   | Brand gradient end (lighter cyan)              |
| `--color-brand-gradient`   | `linear-gradient(135deg, #1E7E72, #4EC9B4)` | Gradient text, CTA buttons                     |
| `--color-accent`           | `#DCEA22`                                   | Lime/chartreuse accent (from live site ticker) |
| `--color-text-main`        | `#ffffff`                                   | Primary text                                   |
| `--color-text-muted`       | `rgba(255,255,255,0.6)`                     | Secondary text                                 |
| `--color-text-subtle`      | `rgba(255,255,255,0.4)`                     | Tertiary text, labels                          |
| `--color-border`           | `rgba(255,255,255,0.12)`                    | Default borders                                |
| `--color-border-hover`     | `rgba(255,255,255,0.24)`                    | Hover border state                             |
| `--color-success`          | `#10b981`                                   | Trust badges, positive indicators              |
| `--color-error`            | `#ef4444`                                   | Negative indicators, "Old Way" cards           |

### Gradients

```css
/* Hero background — subtle teal glow */
--gradient-hero:
	radial-gradient(ellipse at 20% 0%, rgba(30, 126, 114, 0.15) 0%, transparent 50%),
	radial-gradient(ellipse at 80% 100%, rgba(78, 201, 180, 0.08) 0%, transparent 50%);

/* CTA section background */
--gradient-cta: linear-gradient(135deg, #050607 0%, #0a1a17 50%, #050607 100%);
```

---

## Typography

**Font:** Inter (weights 400, 600, 800) via Google Fonts — already loaded in Layout.astro

| Element         | Size                       | Weight | Line-height | Notes                                 |
| --------------- | -------------------------- | ------ | ----------- | ------------------------------------- |
| Hero headline   | `clamp(2.5rem, 6vw, 5rem)` | 800    | 1.08        | `letter-spacing: -0.03em`             |
| Section headers | `clamp(2rem, 4vw, 3rem)`   | 800    | 1.1         | —                                     |
| Body text       | `1.125rem`                 | 400    | 1.7         | —                                     |
| Labels/badges   | `0.8rem`                   | 600    | —           | `uppercase`, `letter-spacing: 0.06em` |
| Nav links       | `0.9rem`                   | 500    | —           | —                                     |

---

## Logo Files

All logos are in `public/assets/logo/`.

| File                            | Description                                     | Usage                           |
| ------------------------------- | ----------------------------------------------- | ------------------------------- |
| `nexai-icon.png`                | Hexagonal icon, teal gradient fill              | Favicons, avatars, small spaces |
| `nexai-logo-white.png`          | White icon + "NexAI Labs" wordmark              | Website nav, dark backgrounds   |
| `nexai-logo-black.png`          | Black icon + "NexAI Labs" wordmark (horizontal) | Light backgrounds, documents    |
| `nexai-logo-variants-bw.png`    | Black & white variants (dark bg + light bg)     | Reference only                  |
| `nexai-logo-variants-color.png` | Teal gradient bg + cream bg variants            | Reference only                  |

---

## Design Patterns

### Glassmorphism Cards

```css
backdrop-filter: blur(12px);
background: rgba(255, 255, 255, 0.03);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 16px;
```

### Buttons

- **Primary:** White bg, dark text, `border-radius: 999px` (pill), hover `scale(1.04)` + teal glow shadow
- **Ghost:** Transparent bg, white text, `border: 1px solid rgba(255,255,255,0.2)`, hover border brightens
- **Brand:** Teal gradient bg, white text, hover `scale(1.04)` + glow

### Gradient Text

```css
background: var(--color-brand-gradient);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Nav — Frosted Glass on Scroll

```css
/* Initial: transparent */
/* After 50px scroll — add class via JS: */
background: rgba(5, 6, 7, 0.8);
backdrop-filter: blur(16px);
border-bottom: 1px solid rgba(255, 255, 255, 0.12);
```

### Animations

- All motion via **GSAP + ScrollTrigger** (already installed)
- Entrance: `y: 30 -> 0, opacity: 0 -> 1, ease: power3.out`
- Stagger children by `0.1s`
- Smooth scroll via **Lenis** (already wired in `src/scripts/lenis.ts`)

### Responsive Breakpoints

| Name    | Width  |
| ------- | ------ |
| Mobile  | 375px  |
| Tablet  | 768px  |
| Desktop | 1024px |
| Wide    | 1440px |

---

## Contact & Links

| Property     | Value                           |
| ------------ | ------------------------------- |
| Booking      | https://cal.com/nexailabs/15min |
| Email        | hello@nexailabs.com             |
| LinkedIn     | linkedin.com/company/nexailabs  |
| Instagram    | instagram.com/nexailabs         |
| YouTube      | youtube.com/@nexailabs          |
| Legal entity | NexAI Labs LLP                  |
| Location     | India                           |

---

## Design Quality Bar

This website should look like it was designed by a premium agency. NOT like a SaaS template, NOT like Bootstrap, NOT like default AI-generated output.

Study the reference sites in `docs/REFERENCES.md` before building any section. Every element should feel intentionally designed with micro-interactions, smooth animations, and the brand color palette applied consistently.
