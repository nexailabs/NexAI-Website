# Run 03 — Founder / NO-BS — Hero + Research card

**Angle:** Drop the "autopilot" fantasy. Lead with the one true claim — agents that do a real job in your stack, with a human sign-off — and prove it in the next breath. CTAs are open doors, not closers.
**Canonical 6-agent roster (Hero set, used everywhere):** Sales · Social · Creatives · Operations · CEO · Research. *Chosen over the Roster set because every word is a job a founder already pays for and instantly pictures; "Outreach/Marketing/Finance" reads like an org chart, not a demo you can click.*

---

## 1. Hero section

**`src/components/home/HomeHero.astro` + `src/data/home.ts`**

- **Eyebrow:** `Agents that do the work`
  *Why: "Your business on autopilot" promises hands-off; we explicitly don't auto-publish on day one. Sell the true thing — they do the work, you still sign off.*

- **Headline static prefix:** `An AI agent for`
  *Why: singular "an agent for [Sales]" reads truer than the plural "AI Agents for Sales" when one word is rotating; you buy one seat at a time.*

- **Rotating words** (driven by the orbit's active agent): `Sales`, `Social`, `Creatives`, `Operations`, `CEO`, `Research`
  *Why: matches the orbit cards and the roster — one promise across the page.*

- **Headline trailing char:** `.`

- **Subtext / lede:** `It runs a real job in your stack — drafts the work, you sign off, the corrections make the next run sharper.`
  *Why: replaces four empty verbs (understand, design, develop, train) with one concrete sentence. Claim (runs a real job) → proof (you sign off; corrections feed back) → so-what (it gets off your plate and gets better). A stranger gets it in one read.*

- **Primary CTA:** `See it run for your business` → opens Cal.com booking widget
  *Why: "Build My Agent" is fine but generic; this is the open-door frame and tells them exactly what the call is — a live look, not a pitch.*

- **Ghost CTA:** `How an agent is built` → `#anatomy`
  *Why: retargets the dead `#how` anchor to the Anatomy section, which actually answers the question the label asks. NOTE for implementer: the Anatomy `<section>` has no `id` yet — add `id="anatomy"` to it in `HomeAnatomy.astro` so this link resolves. If that change isn't made, point the ghost CTA at `#anatomy-h2` (a real existing id) instead.*

---

## 2. Research agent card

**`src/data/home.ts` (Research card definition + cardState)**

- **Card title:** `Research`

- **Role:** `Briefs & Signal`

- **Description (off-screen, aria/SEO):** `Scans the market overnight and writes the one-page brief, with every source cited.`
  *Why: keeps the "overnight" demo fact; cuts the competitor-bait framing ("the brief your competitors are already acting on") for the concrete deliverable — one page, sources cited. Proof over posture.*

- **Status badge:** `BRIEF #51 SHIPPED`
  *Why: "DELIVERED" → "SHIPPED" matches the house word used elsewhere (ship working agents). Keeps Brief #51 demo fact.*

### Today's brief block

- **Timestamp:** `06:42 AM` · **status:** `✓ shipped`
  *Why: align status verb with the badge.*

- **Insight (single line):** `By 2030, a quarter of business work runs agent-alone`
  *Why: same Gartner-cited demo stat, said in plain words. "25% … runs agent-alone by 2030" is jargon-dense; "a quarter … runs agent-alone" reads like a person and lands faster.*

- **Source chip (mono uppercase):** `GARTNER +13`
  *Why: same sources; a thin space so it reads as "Gartner plus 13 others," not a part number.*

### Picker

- **Picker label (gold — "needs you"):** `Pick tomorrow's angle`
  *Why: "Tomorrow's angle" is a noun; the gold state means it needs a click, so make it a verb that says so. Clarity over cleverness for a short label.*

- **3 angle options:**
  - `Capital flows` — `7 signals` (default-selected)
  - `Execution gap` — `11 cases` (agent's pick, ✦)
  - `Hiring shift` — `9 roles`
  *Why: unchanged — these are clean demo facts and the counts carry the weight.*

### Actions

- **Primary button:** `Queue for 6:42 AM →`
  *Why: keep. The clock here is the agent's depicted routine, not a marketing promise — and it's the most concrete button on the card.*

- **Ghost button:** `Surprise me`
  *Why: keep. Earns the click without pressure; lets the agent show its own call.*

- **Surprise-me reveal sub-label:** `Execution gap — highest signal density`
  *Why: keep; it's the agent stating why it chose, which is the trust mechanic on this card.*

### Post-Queue cascade

- **Step 1 — title:** `Briefed 7 sources to scan overnight`
  **detail:** `Bloomberg · PitchBook · Crunchbase · LinkedIn · X · Gartner · Reuters`
  *Why: keep — named sources are the proof. Concrete nouns beat any adjective here.*

- **Step 2 — title:** `Next brief lands 6:42 AM — Brief #52`
  *Why: tightens "Calendar set · Brief #52 lands 6:42 AM tomorrow." Same facts, fewer words; the schedule is depicted agent routine, kept on purpose.*

- **Queue button morphed label after click:** `Queued`

### Cycle summary

- **Cycle summary:** `Cycle complete · on-shift 23h 47m`
  *Why: trims "agent on-shift for 23h 47m" to the numeric. The on-shift hours are demo flavor of the routine — kept.*

### Post-cycle CTA

- **Line 1:** `Want a Research agent reading your market overnight?`
  *Why: sharpens the flat "Want a Research Agent for your business?" by naming the job it does — the proof is in the verb.*

- **Line 2:** `See it run for your market →` → Cal.com booking widget
  *Why: strips the one banned time-claim ("Book a 15-min call"). Becomes an open door that matches the hero CTA, and the link target is unchanged.*

---

## What I'd A/B test next

1. Hero prefix singular vs. plural: `An AI agent for [Sales].` vs. `AI agents for [Sales].` — does one rotating word read better singular?
2. Hero lede: the full claim→proof line above vs. a shorter cut — `It runs a real job in your stack. You sign off; it gets sharper.`
3. Ghost CTA framing: `How an agent is built` (curiosity) vs. `See the anatomy` (concrete) — which gets more scroll-through to Anatomy.
4. Research CTA verb: `See it run for your market →` vs. `Spec my Research agent →` — open-door vs. ownership framing on the same booking link.
