# Hero Console Cards — Design Spec

**Date:** 2026-05-23
**Owner:** Rahul (approval) · Claude (build)
**Status:** Built. Historical — not maintained.
**Note:** This spec captures the original design intent. Sales card has diverged since: IST timestamps stripped (timezone-agnostic), workflow step copy rewritten in owner-language, the 7px amber pulse-dot pending indicator replaced with an 11px rotating ring spinner (`orbitWfSpin`), and a post-cycle CTA now replaces the action bar after the demo completes. Source of truth for current behavior is `src/scripts/agent-orbit.ts` (`renderSalesWarRoom`) and `src/data/home.ts` (`SalesWarRoomState`).
**Scope:** Replace the `AgentOrbit` rotating detail card content with 6 agent-specific "working console" cards, one per orbit node. The orbit motion, neutron star, and node animations stay unchanged.

## Purpose

The current orbit detail card cycles through 7 generic state modes (`tool-calls`, `batch`, `thread`, `approval`, `connectors`, `metrics`, `pipeline`). Each is rich but generic. The new design replaces them with **6 bespoke consoles** — one per agent — so every checkpoint pass on the orbit lands on something that reads like a screenshot of a real operator's working dashboard, not a marketing illustration.

## Roster (locked)

In orbit order, agent[0] at checkpoint on first paint:

1. **Sales** (absorbs Outreach — first-touch + pipeline)
2. **Social Media**
3. **Creatives**
4. **Operations**
5. **CEO**
6. **Research**

## Success criteria

- Each card answers, at a glance: *what is the agent doing right now · what does it need from a human · what just happened*.
- Each card has its own visual hero moment — a single element that grabs the eye first.
- Each card runs a small state-machine animation during the dwell window (post-action morph: Approve → Processing → Confirmed, etc.).
- All 6 read as instances of the **same UI grammar** — shared shell, panels, badges, mono numerals.
- All 6 stay strictly on-brand: Montserrat / Inter / Plus Jakarta Sans / system mono. Zero Cormorant.

## Architecture

Replace the 7 generic mode variants with **6 agent-specific** variants:

```ts
type AgentCardState =
  | { mode: 'sales-warroom';      /* ...sales-shaped data... */ }
  | { mode: 'social-triage';      /* ... */ }
  | { mode: 'creatives-renderbay';/* ... */ }
  | { mode: 'ops-floor';          /* ... */ }
  | { mode: 'ceo-filter';         /* ... */ }
  | { mode: 'research-brief';     /* ... */ };
```

`src/scripts/agent-orbit.ts` gets 6 renderer functions, dispatched by `cardState.mode`. The existing global primitives (`.orbit__pip`, `.orbit__btn`, `.orbit__btn--processing/--confirmed`) stay — they're reusable. New per-agent patterns get new classes.

Keep orbital rotation, neutron star, node entry — unchanged.

## Brand rules — non-negotiable

| Role | Font | Token |
|---|---|---|
| Title (card name, top-left of header) | Inter 700 | `var(--font-body)` |
| Section header / eyebrow / status pill / caps labels | Montserrat caps | `var(--font-display)` |
| UI / body / button labels | Inter | `var(--font-body)` |
| Italic emotional payload (quotes, decision questions, italic signals) | **Montserrat italic** | `var(--font-display)` + `font-style: italic` |
| Numerals (timestamps, $, %, IDs, QA scores) | System mono | `var(--font-mono)` + `font-variant-numeric: tabular-nums` |
| Tag pill (small accent tag) | Plus Jakarta Sans | `var(--font-accent-jakarta)` |

**Banned:** Cormorant Garamond, Anton, Roboto, JetBrains Mono, Geist, Poppins, Space Grotesk — any face not above. `npm run guard:fonts` enforces.

## Color rules

Use brand tokens only — no new color literals.

| Token | Use |
|---|---|
| `var(--brand-teal-bright)` (`#4ec9b4`) | Done · positive · gradient end · agent-cyan |
| `var(--brand-teal-dark)` (`#1e7e72`) | Gradient start |
| `var(--brand-ink)` | Card body deep background |
| `#f5b660` (already used in orbit CSS — keep) | Amber: pending · approval · hot deal · "needs you" · processing |
| `#ef6a6a` (already used in orbit CSS — keep) | Red: angry · lost · `−` cons · LIVE pulse (Social only) |
| `var(--white-a04 … --white-a90)` | Quantized alpha layers — never raw rgba |

## Card shell grammar (shared by all 6)

- **Width:** `clamp(280px, 26vw, 310px)` (up from current `clamp(240px, 24vw, 280px)`). Hero text column `padding-right` bumps from `clamp(80px, 9vw, 140px)` → `clamp(100px, 11vw, 170px)`.
- **Min-height:** `260px` (currently 248)
- **Background, border, radius, shadow, top-edge teal highlight, backdrop blur:** unchanged from current `.orbit__detail`
- **Inner padding:** `1.1rem 1.15rem 1rem` — unchanged

**Header (top row of every card):**
```
[ Title (Inter 700, 1rem)                         ]  [ Status pill (outlined) ]
[ Subtitle / category (Montserrat caps, 0.55rem, brand-cyan, tracking 0.1em) ]
```

**Status pill grammar:**
- Always outlined (transparent fill, 1px border tinted to tone)
- Padding: `3px 8px`, radius: `9999px`
- Font: `0.5rem` Montserrat 700 caps, tracking `0.14em`
- Tone rules:
  - **Teal outline + pulsing dot** = live · in-flight
  - **Teal outline (static)** = done
  - **Amber outline + dot** = needs decision · waiting
  - **Amber outline + pulse** = processing
  - **Red outline + pulse** = LIVE (Social only — IG reel)

**Body panels:**
- Each major content block is a "panel within the card": `5–8px` border-radius inset, 1px hairline border at `--white-a08`, padding `7–10px`
- Stack gap between panels: `9–11px`
- Panels can take a semantic tint: amber for "needs you" callouts, teal for "agent suggests" / post-action confirmations

## Class naming convention

```
.orbit__<agent-key>__<element>
```

Where `<agent-key>` is one of: `sales`, `social`, `creatives`, `ops`, `ceo`, `research`.

Examples: `.orbit__sales__tape`, `.orbit__sales__tape-row`, `.orbit__creatives__tile`, `.orbit__social__live-dot`, `.orbit__ops__refund-slider`, `.orbit__ceo__compare`, `.orbit__research__masthead`.

**Reuse existing utilities:** `.orbit__pip`, `.orbit__pip--running/done/queued`, `.orbit__btn`, `.orbit__btn--primary`, `.orbit__btn--ghost`, `.orbit__btn--processing`, `.orbit__btn--confirmed`, the existing keyframes (`orbitPulse`, `orbitPipPulse`, `orbitToolRing`, `orbitSpin`).

CSS placement: same as existing card body styles — append to the `<style is:global>` block at the bottom of `src/components/home/AgentOrbit.astro`.

## Motion + state behavior

- **Dwell window:** orbit rotation cadence unchanged. If a card's content density exceeds what's readable in the dwell window, slow rotation in a follow-up tweak. Don't change cadence in this build.
- **During dwell:** each card runs its own animations — live-dot pulses, slider thumb halo, like-counter ticking, etc.
- **Hover-pause:** pointer-over-the-detail-card pauses orbit rotation; pointer-leave resumes. Mouse-only (no effect on touch). Implementation: existing rotation script needs a small hook — flag this as a stretch goal; ship without it first if it adds scope.
- **Post-action morph:** every card with a primary CTA shows a 3-stage state on click: idle → processing (gradient fill + spinner) → confirmed (✓). Use existing `.orbit__btn--processing` / `--confirmed` classes.
- **Reduced motion:** all pulses off, content static, post-action morph instant — already wired in existing CSS, extend the same pattern to new keyframes.
- **Buttons are decorative** — no navigation. Click triggers visual morph only.

## Real-content rules

- **Brand names** — real NexAI clients (Banno Swagger, Yufta, Leemboodi, DBJ, Soie, Indoera, Selvia, Rasvidha) + global brands (LinkedIn, Razorpay, The Whole Truth, Tesla, Westside, Zara India, Aza Fashions, Slack, Midjourney, Nano Banana, Seedance, Figma, Canva, Runway, Apollo, Clearbit, Gmail, Buffer, Mailchimp).
- **Person names** — fictional only — Aria J, Rhea S, Riya M, Ankit K, Rohan, Harshita, etc. Never real customer names.
- **Money** — plausible but never real deal values. Mix USD ($) and INR (₹) by context.
- **Quotes** — fictional, written to feel like real call / DM / Slack snippets.
- **Timestamps** — indicative: `09:42 IST`, `14:32`, `4m ago`, `14m left`.

## The 6 cards — concept seeds

(Subagents produce final content + code per card. These are seeds.)

### Sales — *War Room*
- Today's tape (4 rows · time · brand · label · ± $) → net running total
- Hot Deal callout, amber, countdown — headline $ + italic call-quote
- Agents · live trio (Hunter / Writer / Closer)
- [Approve $X] [Counter]
- **Hero:** amber $ + italic quote

### Social Media — *Inbox Triage*
- LIVE · IG REEL banner (red pulse)
- Live engagement counters (auto-tick during dwell)
- Sentiment bar (love / question / angry stacked)
- 3 DM triage rows with drafted replies
- [Send N replies] [Pause auto]
- **Hero:** red LIVE pulse over ticking like count

### Creatives — *Render Bay*
- PDP brief chip (brand · category · SKU)
- 2×2 variant tile grid — done / rendering / queued
- Cost ticker ($ today · imgs · ROI ×)
- [Push variant →] [Regen]
- **Hero:** 4 gradient variant tiles

### Operations — *Triage Floor*
- SLA strip (96% vs 95% target)
- Escalation callout (amber)
- Customer plate + LTV + LOYAL star
- Agent suggests italic (conf 92%)
- Refund slider
- [Approve refund] [Call customer]
- **Hero:** customer plate (avatar + LTV)

### CEO — *The Filter*
- "The filter · today" eyebrow
- Italic binary decision question
- HIRE / DEFER side-by-side compare card (`+` teal / `−` red)
- Runway impact bar-chart equalizer
- [Decide A] [Decide B]
- **Hero:** italic question (largest single line on card)

### Research — *Dawn Brief*
- Memo masthead (date · time)
- Italic signal headline + gradient phrase
- 4-col stat strip (Scanned / Kept / Moves / Flags)
- Competitor moves list (1 row amber-hot)
- [Push → Slack] [Open brief]
- **Hero:** italic gradient headline

## Light mode

Each card needs parallel light-mode tokens under `.home-hero--light .orbit__<agent-key>__<element>`. Strategy:
- Panels invert: dark inset → near-white inset
- Tints stay (amber stays amber, teal stays teal, red stays red)
- Mono numerals keep tabular feel
- Hairline borders use `rgba(0,0,0,0.06–0.12)` literals (existing pattern allows these specific values)

Append to the existing `<style is:global>` light-mode block in `AgentOrbit.astro`.

## Files touched

- `src/data/home.ts` — rewrite `agents[]` (6 new agents, new `AgentCardState` union)
- `src/scripts/agent-orbit.ts` — replace 7 mode renderers with 6 agent renderers + helpers
- `src/components/home/AgentOrbit.astro` — new CSS for new patterns, extended light-mode block, widen card shell clamp
- `src/components/home/HomeHero.astro` — bump text-column `padding-right` clamp to match new card width

No new files. No new dependencies. No new font imports. No new SVG sprite files (inline SVGs where each card needs them).

## Out of scope

- Changing orbit rotation cadence/motion beyond hover-pause (stretch)
- Modifying NeutronStar
- Touching HomeRoster / HomeThesis / HomeAnatomy / HomeToolkit / HomePricing
- Real navigation on card buttons (decorative only)
- Mobile redesign — existing responsive rules apply (card stacks below orbit ≤900px)
- Replacing the orbit node icons or labels — those stay as-is

## Verification before commit

- `npm run guard:fonts` — no banned fonts
- `npm run type-check` — clean
- `npm run lint` — clean
- `npm run format:check` — clean
- `npm run build` — 31 pages built clean
- `npm test` — Playwright passes (or accept snapshot updates if the orbit visual changed intentionally)
- Visual check on localhost — all 6 cards visible by rotating orbit, hover-pause works (if shipped), post-action morphs fire, reduced-motion works

## Build strategy

6 subagents in parallel — one per card. Each receives this spec, the existing renderer file, two reference screenshots, and a first-principles brief for their vertical. Subagents return TypeScript data shapes + renderer functions + CSS blocks + sample content. Claude integrates the outputs into the three target files in one coherent commit.
