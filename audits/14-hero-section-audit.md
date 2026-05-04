# Hero Section Audit — Codex Pass (2026-04-27)

## 1. Loading Performance

Score: 3/5

Findings:

- (unconfirmed) The likely LCP candidate is the hero heading text rather than an image: the first viewport renders the H1 immediately (`src/components/home/HomeHero.astro:30`), and the global H1 recipe uses the display font (`src/styles/global.css:286`). Only Inter is preloaded in the layout (`src/layouts/Layout.astro:52`), while Montserrat, the display face, is loaded without `preload` (`src/layouts/Layout.astro:53`).
- The hero's only images are the ghost-CTA thumbnails, all below the primary text path and marked `loading="lazy"` / `decoding="async"` (`src/components/home/HomeHero.astro:53`). This is good for initial load, but there is no `fetchpriority` distinction if one tile becomes visually important after interaction (`src/components/home/HomeHero.astro:53`).
- The thumbnail transform is small and compressed (`src/config/imagekit.ts:6`), and ImageKit is preconnected globally (`src/layouts/Layout.astro:56`). The inline tile list still duplicates Studio imagery instead of sharing the Studio deck source (`src/components/home/HomeHero.astro:16`, `src/data/studio.ts:94`).
- CLS risk is mostly handled for the rotating word through a fixed `min-width: 7em` (`src/components/home/HomeHero.astro:124`), fixed CTA tile boxes (`src/components/home/HomeHero.astro:267`), and the orbit `aspect-ratio: 1` wrapper (`src/components/home/AgentOrbit.astro:92`). The fixed 7em assumption is tied to today's word list (`src/data/home.ts:7`) and could fail if copy changes.
- AgentOrbit ships a large interactive script on the hero path (`src/components/home/AgentOrbit.astro:653`) that handles card positioning, DOM creation, focus, resize, and outside-click behavior (`src/components/home/AgentOrbit.astro:674`, `src/components/home/AgentOrbit.astro:732`, `src/components/home/AgentOrbit.astro:882`, `src/components/home/AgentOrbit.astro:890`).
- Cal.com is correctly deferred until a `[data-open-cal]` click (`src/layouts/Layout.astro:196`, `src/layouts/Layout.astro:205`), but the inline bootstrap still appends the third-party script when initialized (`src/layouts/Layout.astro:147`, `src/layouts/Layout.astro:165`). A page-load preload would likely hurt the hero path.

Recommendations:

1. Validate the real LCP in Lighthouse/WebPageTest; if the H1 is LCP, consider preloading Montserrat 600 rather than any ImageKit thumbnail (`src/components/home/HomeHero.astro:30`, `src/layouts/Layout.astro:53`, `astro.config.mjs:31`).
2. Keep CTA thumbnails lazy/async by default, but add explicit dimensions and consider intent-based prefetch only on hover/focus if reveal blankness appears in testing (`src/components/home/HomeHero.astro:53`, `src/components/home/HomeHero.astro:288`).
3. Do not preload Cal.com on initial load. If booking latency matters, add an interaction-only preconnect/prefetch after CTA hover/focus or first tap intent (`src/components/home/HomeHero.astro:44`, `src/layouts/Layout.astro:165`).

## 2. Architecture & Separation of Concerns

Score: 2.5/5

Findings:

- `HomeHero.astro` owns content imports, CTA markup, Studio thumbnail data, scoped CSS, light-mode overrides, and the rotating-word script in one file (`src/components/home/HomeHero.astro:2`, `src/components/home/HomeHero.astro:16`, `src/components/home/HomeHero.astro:70`, `src/components/home/HomeHero.astro:495`).
- The Studio reveal tile URLs are hard-coded inside `HomeHero.astro` (`src/components/home/HomeHero.astro:16`), even though Studio hero decks already centralize the same ImageKit source family with meaningful alt text (`src/data/studio.ts:14`, `src/data/studio.ts:84`, `src/data/studio.ts:94`).
- The tile reveal is a natural component split: it has its own data, markup, transition model, reduced-motion rule, mobile cutoff, and per-tile offsets (`src/components/home/HomeHero.astro:47`, `src/components/home/HomeHero.astro:255`, `src/components/home/HomeHero.astro:336`, `src/components/home/HomeHero.astro:342`).
- `AgentOrbit.astro` is also a natural split candidate: static orbit nodes and dialog markup sit above a long style block and a long DOM script (`src/components/home/AgentOrbit.astro:13`, `src/components/home/AgentOrbit.astro:91`, `src/components/home/AgentOrbit.astro:653`).
- Hard-coded light-mode teal and neutral values bypass the brand token layer that already defines canonical colors (`src/components/home/HomeHero.astro:448`, `src/components/home/AgentOrbit.astro:593`, `src/styles/brand.css:18`).

Recommendations:

1. Extract a `StudioRevealTiles` component and feed it shared data derived from `src/data/studio.ts`, keeping `HomeHero.astro` focused on hero composition (`src/components/home/HomeHero.astro:16`, `src/data/studio.ts:94`).
2. Split `AgentOrbit.astro` around stable boundaries: node list, detail dialog, global capability styles, and behavior script (`src/components/home/AgentOrbit.astro:20`, `src/components/home/AgentOrbit.astro:52`, `src/components/home/AgentOrbit.astro:905`).
3. Replace local light-mode hex/rgba values with tokens or new brand-layer tokens before adding more theme states (`src/components/home/HomeHero.astro:442`, `src/components/home/AgentOrbit.astro:555`, `src/styles/brand.css:24`).

## 3. Accessibility

Score: 3.5/5

Findings:

- The rotating visual word is hidden from assistive tech (`src/components/home/HomeHero.astro:35`) and mirrored through an `aria-live="polite"` screen-reader span (`src/components/home/HomeHero.astro:40`). The script updates that live text on every rotation (`src/components/home/HomeHero.astro:588`), which may be chatty for users who stay on the hero.
- Reduced motion is handled in both hero CSS and script (`src/components/home/HomeHero.astro:153`, `src/components/home/HomeHero.astro:512`), and the global reset also suppresses animations/transitions (`src/styles/global.css:565`). AgentOrbit disables the track/node animations under reduced motion (`src/components/home/AgentOrbit.astro:537`).
- The Studio reveal is decorative to assistive tech via `aria-hidden="true"` and empty image alt text (`src/components/home/HomeHero.astro:49`, `src/components/home/HomeHero.astro:53`). That matches its decorative role, but the reveal also appears on keyboard focus without a dedicated CTA focus style (`src/components/home/HomeHero.astro:288`).
- Orbit nodes have usable button semantics and labels (`src/components/home/AgentOrbit.astro:25`, `src/components/home/AgentOrbit.astro:30`), and the detail panel uses dialog semantics with `aria-hidden`/`inert` toggling (`src/components/home/AgentOrbit.astro:52`, `src/components/home/AgentOrbit.astro:824`, `src/components/home/AgentOrbit.astro:848`).
- (unconfirmed) The frosted ghost pill contrast should be measured in dark and light states: its fill/border are very transparent (`src/components/home/HomeHero.astro:225`, `src/components/home/HomeHero.astro:228`), and light-mode overrides change surrounding contrast with raw values (`src/components/home/HomeHero.astro:469`).
- CTA copy is understandable but not fully explicit about the booking action: "Build My Agent" opens the Cal dialog through `data-open-cal` (`src/components/home/HomeHero.astro:44`), while the accessible dialog label is "Book a call" (`src/layouts/Layout.astro:111`).
- Skip-link and landmark structure are present: the skip link targets `#main-content`, and page content is wrapped in `<main>` (`src/layouts/Layout.astro:90`, `src/layouts/Layout.astro:101`).

Recommendations:

1. Consider making the rotating-word live region announce only the settled phrase or disabling repeated announcements after first paint (`src/components/home/HomeHero.astro:40`, `src/components/home/HomeHero.astro:588`).
2. Add an explicit CTA `:focus-visible` treatment separate from the thumbnail reveal so keyboard users get a clear control boundary (`src/components/home/HomeHero.astro:175`, `src/components/home/HomeHero.astro:288`).
3. Align primary CTA text with the dialog outcome, such as a booking-oriented label, if conversion copy tests allow it (`src/components/home/HomeHero.astro:44`, `src/layouts/Layout.astro:111`).

## 4. CSS Quality

Score: 2.5/5

Findings:

- The global stylesheet declares the intended cascade layer order (`src/styles/global.css:10`), but both hero components place large scoped style blocks outside explicit `@layer` wrappers (`src/components/home/HomeHero.astro:70`, `src/components/home/AgentOrbit.astro:91`).
- `!important` appears in reduced-motion and theme/mobile overrides (`src/components/home/HomeHero.astro:155`, `src/components/home/HomeHero.astro:443`, `src/components/home/AgentOrbit.astro:525`, `src/components/home/AgentOrbit.astro:540`). Some usage is defensible, but it increases the cost of future theme changes.
- Backdrop filters have solid-ish backgrounds but no explicit `@supports` fallback path (`src/components/home/HomeHero.astro:225`, `src/components/home/HomeHero.astro:226`, `src/components/home/AgentOrbit.astro:257`, `src/components/home/AgentOrbit.astro:258`).
- Per-tile offsets duplicate `--x`, `--y`, and `--r` across five selectors (`src/components/home/HomeHero.astro:310`, `src/components/home/HomeHero.astro:315`, `src/components/home/HomeHero.astro:320`, `src/components/home/HomeHero.astro:325`, `src/components/home/HomeHero.astro:330`).
- Component CSS still declares local typography details even though global semantic and utility typography recipes exist (`src/components/home/AgentOrbit.astro:244`, `src/components/home/AgentOrbit.astro:366`, `src/styles/global.css:286`, `src/styles/global.css:506`).

Recommendations:

1. Put large component style blocks into the intended cascade layer or document why Astro-scoped component CSS stays outside it (`src/styles/global.css:10`, `src/components/home/HomeHero.astro:70`).
2. Reduce `!important` by increasing selector design clarity for light mode and mobile dialog placement where possible (`src/components/home/HomeHero.astro:442`, `src/components/home/AgentOrbit.astro:522`).
3. Move tile offsets into data/style props or derive them from `--i` so adding/removing tiles does not require selector surgery (`src/components/home/HomeHero.astro:52`, `src/components/home/HomeHero.astro:310`).

## 5. Robustness & Edge Cases

Score: 3/5

Findings:

- ImageKit thumbnail failures on slow networks would reveal empty/broken mini-cards because the images are lazy and have no visible fallback beyond the tile background (`src/components/home/HomeHero.astro:53`, `src/components/home/HomeHero.astro:273`).
- The reveal is disabled at `max-width: 720px` (`src/components/home/HomeHero.astro:342`), but between 721px and desktop a touch/no-hover device may have no practical preview before navigation because the animation is only tied to hover/focus (`src/components/home/HomeHero.astro:288`).
- The rotating-word width is fixed to 7em based on current copy (`src/components/home/HomeHero.astro:118`, `src/components/home/HomeHero.astro:124`), while the word list lives in data and can grow independently (`src/data/home.ts:7`).
- Orbit mobile logic uses `window.innerWidth <= 900` (`src/components/home/AgentOrbit.astro:670`), matching the 900px CSS card mode (`src/components/home/AgentOrbit.astro:523`) but not the 720px hero tile cutoff (`src/components/home/HomeHero.astro:342`).
- Reduced-motion users get static hero/orbit states (`src/components/home/HomeHero.astro:512`, `src/components/home/AgentOrbit.astro:537`), but the first visible rotating word remains only the initial data value rather than a non-animated summary of all categories (`src/components/home/HomeHero.astro:37`, `src/data/home.ts:7`).

Recommendations:

1. Add failure-tolerant thumbnail behavior: fixed `width`/`height`, `sizes`, and a subtle non-image fallback state for the reveal tiles (`src/components/home/HomeHero.astro:53`, `src/config/imagekit.ts:6`).
2. Treat touch/no-hover as a first-class path around the 721-900px range; either suppress the reveal there or make it trigger on intentional focus/tap without blocking navigation (`src/components/home/HomeHero.astro:288`, `src/components/home/HomeHero.astro:342`).
3. Make the rotating-word width data-aware or constrain future words with a documented copy budget near the data definition (`src/components/home/HomeHero.astro:124`, `src/data/home.ts:7`).

## Top 5 Wins

1. Preload the actual LCP dependency. If lab data confirms the H1 as LCP, preload Montserrat 600 instead of chasing non-LCP thumbnails (`src/components/home/HomeHero.astro:30`, `src/layouts/Layout.astro:53`).
2. Extract Studio reveal data/component. Small refactor, large maintainability gain, and it removes duplicated ImageKit URLs from the hero (`src/components/home/HomeHero.astro:16`, `src/data/studio.ts:94`).
3. Tokenize hard-coded light-mode colors. Low effort and directly restores the brand-token contract (`src/components/home/HomeHero.astro:442`, `src/components/home/AgentOrbit.astro:593`, `src/styles/brand.css:18`).
4. Add explicit focus styling for hero CTAs. Improves keyboard clarity without changing layout or copy (`src/components/home/HomeHero.astro:175`, `src/components/home/HomeHero.astro:288`).
5. Defer or split AgentOrbit behavior. The script is the biggest hero-path behavior block, and splitting it gives better options for idle/interaction loading later (`src/components/home/AgentOrbit.astro:653`, `src/components/home/AgentOrbit.astro:791`).

## Out of Scope / Deferred

- Running Lighthouse, WebPageTest, bundle analyzer, or real-user performance traces; all performance sizing notes above are source-level and marked unconfirmed where needed.
- Rewriting component code, changing Cal.com behavior, changing fonts, or moving data; this pass is recommendations only.
- Auditing `NeutronStar.astro`, navbar behavior, full Cal dialog UX, or the Studio page beyond the data references cited here.
