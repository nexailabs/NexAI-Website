# Tier 3 audit — 9 open items

Read-only audit against current `main`. Verified every claim against code; multiple items revised from the summary.

## Summary table

| #   | Item                                       | Verified              | Effort | Impact   | Call                         |
| --- | ------------------------------------------ | --------------------- | ------ | -------- | ---------------------------- |
| 1   | Dead code in `src/data/home.ts`            | Yes, fully orphan     | S      | Low      | DO                           |
| 2   | Untracked `nav-and-orbit-*.png` at root    | Yes (4 files)         | S      | Low      | DO (delete + gitignore rule) |
| 3   | `fetchpriority="high"` on navbar logo img  | Yes, missing          | S      | Zero/Neg | SKIP                         |
| 4   | Font preload hints                         | Yes, missing          | S–M    | Med      | DO                           |
| 5   | Non-composited `nodeEntry` filter anim     | Yes (blur filter)     | S      | Low      | DO                           |
| 6   | `/blog` + `/blog/*` redirects              | Yes, still there      | S      | Zero     | DEFER (blog PR owns it)      |
| 7   | Drop CSP `'unsafe-inline'` from script-src | Yes; 5 inline scripts | L      | Med      | SKIP (fragile)               |
| 8   | COOP + Trusted Types headers               | Split                 | S / L  | Low/Med  | DO COOP; SKIP Trusted Types  |
| 9   | Third-party Cal.com issues                 | Yes, all 3p           | —      | —        | NEEDS-HUMAN (product call)   |

Legend: Effort S=<15min, M=15–60min, L=>60min.

## Per-item detail

### 1. Dead code in `src/data/home.ts`

- **Verified**: Yes. Lines 121–148 export `servicesLabel`, `servicesHeading`, `servicesDescription`, `ServiceCard` interface, `serviceCards` (mapped from `agents`), and `whyItems`. Grep across the full repo shows the only references are the definitions themselves plus one mention in `docs/OLD-vs-NEW-REPO-COMPARISON.md` (historical note, not code). `HomeServices.astro` no longer exists in `src/components/home/` (confirmed: only `AgentOrbit.astro` and `HomeHero.astro` are there).
- **Effort**: S. Pure deletion, no refactor of consumers needed.
- **Impact**: Low. Shrinks `home.ts` by ~28 lines; tiny tree-shake win on the TS graph; clearer data boundary for anyone editing the file.
- **Risk**: None — zero consumers. A future HomeServices revival would re-derive from `agents` anyway (the map was 1:1).
- **Recommendation**: DO.
- **Rationale**: Free cleanup with zero blast radius. Deleting orphan exports prevents a future contributor from accidentally importing them and resurrecting a deleted section.

### 2. Untracked screenshots at repo root

- **Verified**: Yes. `git status` shows four untracked PNGs: `nav-and-orbit-{360,440,1000,1280}.png` (116K–276K, total ~770K). `.gitignore` has `test-results/` and `.playwright-mcp/` but **no pattern catches ad-hoc PNGs at repo root**.
- **Effort**: S.
- **Impact**: Low. Keeps the working tree clean and avoids a future `git add .` accidentally committing ~770K of throwaway screenshots.
- **Risk**: None.
- **Recommendation**: DO — delete the 4 files AND add a gitignore rule like `/*.png` (root-only, so `public/`, `src/`, etc. are unaffected) or the more targeted `/nav-and-orbit-*.png`. Prefer the targeted rule; `/*.png` at root is fine since we have no legitimate root-level PNGs.
- **Rationale**: Delete is free — they came from a previous PSI testing session and have no value. Adding a `.gitignore` rule prevents recurrence.

### 3. `fetchpriority="high"` on navbar logo img

- **Verified**: Missing. `src/components/Navbar.astro` lines 32–38 has `<img src srcset alt width height>` with no `fetchpriority` and no `loading="eager"` (though eager is the default). The homepage h1 `.home-hero__heading` is the confirmed LCP element (verified at `src/components/home/HomeHero.astro:19`).
- **Effort**: S.
- **Impact**: Zero or slightly negative. The LCP is a text node in the h1 — it depends on the Inter 400 and Cormorant 600-italic woff2 files, not the logo. `fetchpriority="high"` on the logo would compete with those font downloads for bandwidth on the critical path and could _delay_ LCP on slow links.
- **Risk**: Mild regression risk if promoted.
- **Recommendation**: SKIP.
- **Rationale**: The fix solves a problem we don't have. If we did want to prioritize something above the fold, it should be the font preloads (item 4), not the 80×80 logo. A 40×40 @2x PNG that's already under 10KB is not on anybody's critical path.

### 4. Font preload hints

- **Verified**: No font preload hints exist in `Layout.astro`. Build output `dist/_astro/` contains 7 hashed woff2 files:
  - `cormorant-garamond-latin-600-italic.DCuhXWyK.woff2`
  - `cormorant-garamond-latin-600-normal.Co1r35X9.woff2`
  - `inter-latin-400-normal.C38fXH4l.woff2`
  - `inter-latin-600-normal.LgqL8muc.woff2`
  - `inter-latin-800-normal.BYj_oED-.woff2`
  - `montserrat-latin-600-normal.UVxSCcoG.woff2`
  - `montserrat-latin-700-normal.BdjcYUrC.woff2`

  Note: `inter-latin-800` is being built but nothing in `Layout.astro`'s imports pulls it. Something else is pulling 800 transitively. Worth a 30-second follow-up grep but not in scope here.

  Astro 5.16 ships the first-class `astro:assets` Fonts API with a `<Font cssVariable="..." preload />` component backed by `fontProviders.fontsource()` in `astro.config`. This is the idiomatic fix — no manual hash probing, no filesystem-probe integration, no hardcoded URLs. Astro's Font API writes the correct `<link rel="preload" as="font" type="font/woff2" crossorigin>` into `<head>` at build time and handles cache-busting automatically.

- **Effort**: M. Needs migrating from `@fontsource/*` CSS imports to `astro.config.mjs` `fonts: [...]` entries and adding `<Font cssVariable="..." preload />` in `Layout.astro` head. Plus referencing the CSS variables in `global.css` instead of the current `font-family: 'Inter', ...` declarations. 30–60 min including a local preview sanity check.
- **Impact**: Medium. LCP is the h1, which depends on these exact fonts — preloading Inter-400 and Cormorant-600-italic should move LCP earlier by ~100–400ms depending on network, directly. This is the only item in the list that plausibly moves a headline metric.
- **Risk**: Low. Astro's Fonts API is stable in 5.x and handles the hashing. Only risk: we have to preload _sparingly_ — only the 2 above-fold fonts (Inter-400 and Cormorant-600-italic), not all 7, or we'll blow the critical bandwidth budget in the other direction. Montserrat 600/700 are used below the fold / in headings that are not LCP — do NOT preload.
- **Recommendation**: DO.
- **Rationale**: This is the only LCP-moving item on the list. The Astro 5 first-class API removed every downside the original claim worried about (hashed filenames, build fragility). Budget 45 minutes: 20 for migration, 10 for config, 15 for verification.

### 5. `nodeEntry` non-composited animation

- **Verified**: Yes. `AgentOrbit.astro` lines 181–190 animates `filter: blur(4px)` to `filter: blur(0)` alongside opacity. `filter: blur()` is not composited — it forces paint on every frame during the 0.5s entry. There are 6 nodes staggered at `calc(0.3s + var(--node-i) * 0.1s)`, so the total blur paint window is ~1.3s at page-load.
- **Effort**: S. Swap the blur transition for a pure opacity fade. The nodes already have a complex `transform: rotate(...) translateX(...) rotate(...)` for positioning, so adding a scale is tricky — easiest is to drop the filter entirely and keep only opacity. Opacity-only is the smallest change and still reads as a fade-in.
- **Impact**: Low. Lighthouse flagged it but the paint cost is only for 1.3s at page-load on 6 small 58×58 elements — a yellow warning, not a perf emergency. Removing it cleans the audit though.
- **Risk**: Very low visual regression. The blur is subtle; most users won't notice it's gone. The opacity fade carries the entry by itself.
- **Recommendation**: DO — simplest fix: delete the `filter: blur(4px)` / `filter: blur(0)` lines from the keyframes, leave just `opacity: 0 → 1`. Also update the `prefers-reduced-motion` block's `filter: none` (line 546) since it becomes a no-op.
- **Rationale**: 3-line edit, silences the Lighthouse warning, no meaningful visual loss.

### 6. `/blog` + `/blog/*` redirects

- **Verified**: Yes, lines 9–10 of `public/_redirects`:
  ```
  /blog / 301
  /blog/* / 301
  ```
  (Lines 6–8 are also `/blog/<slug>*` → targets, which will also need pruning when blog lands.)
- **Effort**: S.
- **Impact**: Zero on the current site. Pre-removing would create a window where `/blog` returns 404 before the blog is actually live — which is strictly worse than the current "redirect to home" behavior.
- **Risk**: Removing now = temporary 404s on old blog URLs that external links still point at. Leaving = the blog PR has to remove them. Minimal churn either way; the blog PR is already going to touch `_redirects` to replace these with real blog routing.
- **Recommendation**: DEFER — leave them. The blog PR owns this cleanup. Add a one-line note to the blog plan doc that says "remove lines 6–10 of `public/_redirects` when blog ships."
- **Rationale**: Least-churn principle. Pre-removal introduces a transient 404 gap for no benefit.

### 7. Drop CSP `'unsafe-inline'` from `script-src`

- **Verified**: Partially. `_headers` line 7 does have `'unsafe-inline'` in `script-src`. The built `dist/index.html` contains **5 inline script elements** that would need hash-pinning (or another bypass):
  - 2 plain `<script>` blocks (the Cal bootstrap in `Layout.astro:133–242` is one of them)
  - 3 `<script type="module">` blocks (Astro's hydration shims — auto-emitted by the framework and their content can change across Astro minor versions, vite changes, or content changes in any component)
  - 1 `<script type="application/ld+json">` (doesn't execute, doesn't need a hash under `script-src`)
  - 4 external `<script type="module" src="/_astro/...">` — already allowed under `'self'`
- **Effort**: L. Hash-pinning works in theory (compute SHA-256 of each inline block at build time, write all 5 hashes into `_headers`). In practice this requires either a post-build Cloudflare Pages function or a Node script that modifies `_headers` on every build. Cloudflare Pages does **not** support server-side per-request nonces for static sites — you'd have to move to Pages Functions (Workers) for dynamic header injection, which is a significant architecture shift.

  The fragility: any Astro minor version bump can change the exact bytes of the auto-emitted module shims, silently invalidating 3 of the 5 hashes. You'd only discover this when CSP violations start blocking the client router. That's a deployment-foot-gun.

- **Impact**: Medium security on paper. `'unsafe-inline'` closes a theoretical XSS surface where an attacker injects an inline script into the HTML. But: our HTML is 100% static-generated from our own templates at build time — there is no user input path that could inject inline script tags. The XSS surface is already near-zero by construction. The security upside here is cosmetic (PSI Best Practices score bump), not substantive.
- **Risk**: High deploy fragility (Astro updates silently break CSP); medium rollback difficulty (have to SSH into Cloudflare to restore); zero security benefit for our threat model since we're static.
- **Recommendation**: SKIP.
- **Rationale**: The security benefit is theoretical for a static site with no user-generated HTML, and the deploy fragility is real and recurring. Five inline scripts with at least three of them framework-generated make hash-pinning a maintenance tax, not a one-time fix. Revisit only if (a) we move off static output, or (b) Astro ships a first-class CSP integration that handles the module shim hashes automatically.

### 8. `Cross-Origin-Opener-Policy` + `Trusted Types` headers

- **Verified**: Split the claim.
  - **COOP**: `_headers` currently has no `Cross-Origin-Opener-Policy`. Grepping the whole `src/` tree for `window.open` returns **zero** matches — Cal.com is embedded as an inline iframe inside our own `<dialog>` (`Layout.astro` lines 111–131), not as a popup window. The Cal embed.js script loaded from `app.cal.com` could in principle use a popup for auth flows, but Cal's inline embed mode explicitly uses the iframe only. Safe value: `Cross-Origin-Opener-Policy: same-origin`. If we want extra safety against any edge-case Cal popup, use `same-origin-allow-popups`.
  - **Trusted Types**: Grepping `src/` for `innerHTML`, `insertAdjacentHTML`, and legacy doc-write sinks returns **zero** matches in our own code. That's genuinely clean — but this only counts _our_ code. Cal.com's embed.js and Astro's ClientRouter both use DOM manipulation that is very likely to touch `innerHTML`-equivalent sinks internally. Enabling `require-trusted-types-for 'script'` in CSP would break both.
- **Effort**: COOP is S (add 1 header line). Trusted Types is L (requires a global policy factory shim + testing every third-party script against it + likely breaks Cal embed outright).
- **Impact**: COOP: Low security upside + small Best Practices score bump. Trusted Types: Medium security upside in theory, but breaks third-party scripts in practice.
- **Risk**: COOP `same-origin`: near-zero (no popups). COOP `same-origin-allow-popups`: zero. Trusted Types: high (breaks Cal and potentially Astro's view transitions).
- **Recommendation**:
  - **DO COOP** — add `Cross-Origin-Opener-Policy: same-origin-allow-popups` to `_headers`. S effort, defensive-in-depth value.
  - **SKIP Trusted Types** — not worth breaking third-party dependencies for a score bump we're not even certain we'd get (Cal would report violations).
- **Rationale**: COOP is free. Trusted Types is too invasive for the scope of this audit and would almost certainly regress Cal booking.

### 9. Third-party Cal.com issues

- **Verified**: Yes. The 172 KiB unused JS, SharedStorage deprecation, and third-party cookie warnings are all sourced from `https://app.cal.com/embed/embed.js` and the iframe it creates. None of this code lives in our repo and none of it can be fixed by editing anything in the Website workspace.
- **Effort**: N/A (not a code task).
- **Impact**: The only remediation paths are product-level: (a) replace Cal embed with a custom booking form hitting Cal's API directly, (b) swap Cal for a lighter-weight scheduler (Savvycal, Zcal, custom), (c) load Cal in a separate route so it doesn't hit the homepage PSI score. All three are multi-day product decisions, not cleanup tasks.
- **Risk**: N/A.
- **Recommendation**: NEEDS-HUMAN.
- **Rationale**: This is outside the audit's scope. Surface it to Rahul as a separate conversation: "Cal.com costs us ~172 KiB of unused JS + a Best Practices penalty — do we care enough to explore replacing it?" But don't try to solve it inside this audit's DO list.

## Ordered action list

If the user says "do the DOs," here's the order and ~time budget:

1. **Item 2: Delete screenshots + add gitignore rule** — 3 min. Clean starting point, removes noise from subsequent `git status` checks.
2. **Item 1: Delete orphan exports from `src/data/home.ts`** — 5 min. Pure deletion of lines 121–148 (with a quick final grep to reconfirm zero consumers).
3. **Item 5: Strip `filter: blur` from `nodeEntry` keyframes in `AgentOrbit.astro`** — 5 min. Delete the filter lines from `@keyframes nodeEntry` (lines 181–190) and `prefers-reduced-motion` block (line 546).
4. **Item 8 (COOP only): Add `Cross-Origin-Opener-Policy: same-origin-allow-popups` to `public/_headers`** — 3 min. One-line header addition.
5. **Item 4: Font preload hints via Astro 5 `<Font />` API** — 45 min. Biggest effort, biggest payoff (LCP move). Do last because it's the only item that actually needs browser verification after:
   - Add `fonts: [...]` entry to `astro.config.mjs` for Inter-400, Cormorant-600-italic (skip the rest — they're not above-fold LCP inputs).
   - Add `<Font cssVariable="--font-inter" preload />` and `<Font cssVariable="--font-cormorant" preload />` to `Layout.astro` `<head>`.
   - Update `global.css` font-family declarations to reference the CSS variables.
   - Remove the corresponding `@fontsource/inter/latin-400.css` and `@fontsource/cormorant-garamond/latin-600-italic.css` imports from `Layout.astro`.
   - `npm run build` and grep `dist/index.html` for `rel="preload" as="font"` to confirm the preload links are emitted.
   - Bonus grep: chase down who imports `inter-latin-800` (it's in `dist/_astro/` but not in `Layout.astro`'s import list) — likely a dead import somewhere.

**Total time budget: ~60 min for all 5 DOs.** One commit per item (or group items 1–3 into a "cleanup" commit and items 4 and 8 as separate commits).

**Deferred**: Item 6 (blog redirects — handled by the blog PR whenever that lands).

**Skipped**: Item 3 (logo fetchpriority — counterproductive vs. LCP), Item 7 (CSP unsafe-inline removal — fragility outweighs security for a static site), Item 8 Trusted Types portion (breaks Cal).

**Needs human**: Item 9 (Cal.com — product decision, not cleanup).
