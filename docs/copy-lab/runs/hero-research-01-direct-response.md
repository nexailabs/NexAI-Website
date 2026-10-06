# Hero + Research — Run 01 · Direct-Response

**Angle:** Sell the outcome a problem-aware founder already feels — "work that should run itself, finally does" — then prove it with a live agent they can drive, not a deck. Benefit-led headline, one-line how, two doors (book + see proof). Risk reversal baked into the Research card: nothing ships without your sign-off.
**Canonical 6-agent roster (used everywhere):** `Sales · Social · Creatives · Operations · CEO · Research` — chosen because these six are the *built, clickable* orbit cards; the Hero already promises exactly them, so aligning the page to this set means every rotating word maps to a working demo, not a name with no card behind it.

---

## 1. Hero section

**`src/components/home/HomeHero.astro` + `src/data/home.ts`**

- **Eyebrow** (teal uppercase): `The work that should run itself`
  *why — "Your business on autopilot" is a category promise everyone makes; this names the exact pain the reader feels (work that should be automated but isn't) in their words, setting up the headline as the payoff.*

- **Headline static prefix:** `Hire an AI agent for`
  *why — "AI Agents for {Sales}." labels a product. "Hire an agent for {Sales}." casts it as a teammate that does the job — the benefit, not the feature — and reads as an action the founder takes.*

- **Rotating words** (cycle in italic, driven by the orbit's active agent): `Sales`, `Social`, `Creatives`, `Operations`, `CEO`, `Research`
  *why — unchanged; this is the canonical roster and each word maps to a live orbit card.*

- **Headline trailing char:** `.` (period after the rotating word)
  *why — kept; the full stop makes each rotation read as a flat claim, not a question.*

- **Subtext / lede:** `It runs the function end to end and hands you the one call that needs a human. You approve. It ships. Nothing goes out without you.`
  *why — replaces four empty verbs ("understand, design, develop, train") with what the buyer actually gets: full-function work, one decision left for them, and the trust guarantee (risk reversal) that nothing auto-publishes. Present tense, second person, one idea per sentence.*

- **Primary CTA:** `Show me an agent for my business` → opens Cal.com booking widget
  *why — "Build My Agent" is a command; this is the founder's own question answered. Benefit-loaded, reads as an open door, same booking target — no link change.*

- **Ghost CTA:** `Watch one work` → anchors to `#anatomy` (the Anatomy of an agent section)
  *why — retargets the stale `#how` anchor to a section that exists. "See how it works" describes a doc; "Watch one work" promises proof of a live run — and the Anatomy section is exactly that (input → reasoning → output → review).*

---

## 2. Research agent card

**`src/data/home.ts` (Research agent definition + cardState)**

- **Card title:** `Research`
  *why — unchanged; canonical roster name.*

- **Role:** `Briefs & Signal`
  *why — kept; clear, concrete, not a plumbing name.*

- **Description (off-screen, for SEO/aria):** `Scans the market every night and ships the one-page brief your competitors are still scheduling a meeting to write.`
  *why — sharpens the existing "writes the brief your competitors are already acting on" into a sharper proof of speed-to-insight without inventing a metric; keeps the overnight-routine demo fact.*

- **Status badge:** `BRIEF #51 SHIPPED`
  *why — "DELIVERED" is vendor-speak; "SHIPPED" matches the house verb (build → run → ship) and reads as work done, not a package mailed.*

### Today's brief block

- **Timestamp / status:** `06:42 AM` · `✓ shipped`
  *why — demo flavor of the agent's routine, kept per scope; "shipped" aligned to the badge verb.*

- **Insight (single line):** `25% of business work runs agent-only by 2030`
  *why — keeps the Gartner-cited demo stat; "agent-alone" → "agent-only" reads cleaner and the added "business" anchors it to the reader's world. No new claim.*

- **Source chip (mono uppercase):** `GARTNER+13`
  *why — unchanged; the citation is the proof, kept verbatim.*

### Tomorrow's angle

- **Picker label (gold — "needs you"):** `You pick tonight's angle`
  *why — "Tomorrow's angle" is passive; this hands the reader the decision and reinforces the human-in-the-loop story — the agent does the scan, you choose the lens.*

- **3 angle options** (visitor picks one):
  - `Capital flows` — `7 signals` (default-selected)
  - `Execution gap` — `11 cases` (agent's pick, marked ✦)
  - `Hiring shift` — `9 roles`
  *why — unchanged; signal counts are demo content and the three lenses are concrete nouns the reader can weigh.*

- **Action buttons:** `Queue for 6:42 AM →` (primary) / `Surprise me` (ghost)
  *why — kept; the time here is the agent's recurring schedule (demo routine), not a marketing time-commitment. Clear action label.*

- **Surprise-me reveal sub-label:** `Execution gap · highest signal density`
  *why — unchanged; concrete, names the winning lens and why.*

### Post-Queue cascade

- **Step 1 — title:** `Sent 7 sources to scan overnight` — **detail:** `Bloomberg · PitchBook · Crunchbase · LinkedIn · X · Gartner · Reuters`
  *why — "Briefed 7 sources" reads like the sources got briefed; "Sent 7 sources to scan" states what actually happened. Source list kept as demo content.*

- **Step 2 — title:** `Next brief lands 6:42 AM — on your desk before the standup`
  *why — keeps the agent's overnight schedule (demo routine, allowed), drops "Brief #52 / Calendar set" plumbing, and adds the concrete benefit: it's ready before your first meeting.*

- **Queue button morphed label after click:** `Queued`
  *why — unchanged; tight, correct.*

- **Cycle summary:** `Cycle complete · agent on-shift 23h 47m`
  *why — kept (overnight on-shift count is demo routine per scope); dropped "for" for a tighter ledger line.*

- **Post-cycle CTA:** `Want a Research Agent reading the market while you sleep?` / `Show me one for my business →`
  *why — strips the banned "Book a 15-min call" time-claim (the one to remove per scope). The question now leads with the benefit the reader just watched happen; the action mirrors the hero CTA and reads as an open door, not a pressured booking.*

---

## What I'd A/B test next

1. Hero headline frame: `Hire an AI agent for {Sales}.` vs. outcome-first `Never let {Sales} pile up again.` — does "hire a teammate" or "remove the pain" pull more clicks from a problem-aware founder?
2. Hero subtext length: the 3-sentence trust version above vs. a one-liner (`It runs the function and leaves you one call. Nothing ships without you.`) — test whether the risk-reversal beat earns its line or slows the scroll.
3. Research post-cycle CTA: `reading the market while you sleep?` vs. flat `Want a Research Agent for your business?` — does the vivid overnight image lift intent or read as gimmick?
4. Ghost CTA label: `Watch one work` vs. `See proof, not a deck` — test the implicit consultancy contrast against the literal "see it run."
