# Hero + Research — Candidate 05 (Hybrid: Founder spine + Direct-Response hook)

**Angle:** Lead with the buyer's own math — the headcount they can't afford and the work that slips while they sleep — then state the plain thing (agents that run a function, with a human sign-off) and back it with evidence, not credentials.
**Canonical 6 (used everywhere — hero rotating words, orbit cards, roster):** `Sales · Social · Creatives · Operations · CEO · Research` — chosen because the interactive orbit cards are built from this set and Research (the in-scope card) lives here; the Roster's competing set gets retired to this one.

---

## 1. Hero section

**`src/components/home/HomeHero.astro` + `src/data/home.ts`**

- **Eyebrow** (teal uppercase): `Hire the first agent, not the fifth employee`
  *why — swaps the vague "business on autopilot" promise for the buyer's actual P&L decision; it's the one line a founder repeats to a co-founder.*

- **Headline static prefix:** `An AI agent that runs your`

- **Rotating words** (cycle in italic, driven by the orbit's active agent): `Sales`, `Social`, `Creatives`, `Operations`, `CEO desk`, `Research`
  *why — keeps the canonical 6; "CEO desk" reads as a function a person owns rather than a job title, so the rotation stays parallel ("runs your CEO desk" vs. the awkward "runs your CEO").*

- **Headline trailing char:** `.` (period after the rotating word)

- **Subtext / lede:** `Not a chatbot, not a dashboard, not a deck. A working agent that does the job, shipped into your stack — and a human signs off before anything goes out.`
  *why — kills the four empty verbs (understand/design/develop/train). Defines by negation to disarm the "burned by a consultancy" scar, names where it lives, and leads with the trust mechanism (human sign-off) as the proof, not a credential.*

- **Owned trade-off (one per page, placed in the lede's second beat):** the clause `a human signs off before anything goes out` is the deliberate limitation — it is slower than "fully autonomous," and that is the point. *This is where an "AI research/AI agents" skeptic is most suspicious: they assume you mean it auto-publishes and breaks something with their name on it. Naming the human gate up front is the trust beat.*

- **Primary CTA:** `Spec my first agent` → opens Cal.com booking widget
  *why — an open door framed as a working session, not a sales close; "spec" tells the buyer they leave with a defined first agent, not a pitch.*

- **Ghost CTA:** `See one run end-to-end` → anchors to `#anatomy` (the Anatomy section — a real target; replaces the stale `#how`)
  *why — fixes the dead `#how` anchor and names the payoff (watch a real run: input → reasoning → output → review) instead of the generic "how it works."*

---

## 2. Research agent card

**`src/data/home.ts` (Research card definitions + cardState)**

- **Card title:** `Research`

- **Role:** `Writes the brief before your competitor does`
  *why — outcome-framed label replacing the category "Briefs & Signal"; names the result (you act first) in the buyer's competitive terms.*

- **Description (off-screen, SEO/aria):** `Reads the market overnight and hands you a one-page brief — sourced, ranked, ready to act on — before the day starts.`
  *why — keeps the overnight demo flavor; trades the boast for the concrete artifact (one page, sourced, ranked) so it reads as a deliverable, not a slogan.*

- **Status badge:** `BRIEF #51 DELIVERED`
  *unchanged — demo fact.*

- **Today's brief block:**
  - Timestamp: `06:42 AM` · status: `✓ on your desk`
    *why — "shipped" is internal jargon; "on your desk" is the buyer's experience of it. Keeps the demo time.*
  - Insight (single line): `25% of work runs agent-alone by 2030`
    *unchanged — Gartner-cited demo content stays as demo content.*
  - Source chip (mono uppercase): `GARTNER +13`
    *unchanged — demo source.*

- **Picker label (gold — "needs you"):** `Pick tomorrow's angle`
  *why — adds the verb so the human-in-the-loop ask is unmistakable; it's a decision, not a header.*

- **3 angle options** (visitor picks one):
  - `Where the money's moving` — `7 signals` (default-selected)
    *why — reframes the dry "Capital flows" into what the founder actually wants to know.*
  - `Who's shipping, who's stalling` — `11 cases` (agent's pick, marked ✦)
    *why — "Execution gap" → the readable version of the same idea; keeps the 11-case count and the ✦ pick.*
  - `Where the talent's going` — `9 roles`
    *why — "Hiring shift" → outcome-framed; keeps the 9-role count.*

- **Action buttons:** `Queue it for 6:42 AM →` (primary) / `Let the agent choose` (ghost)
  *why — keeps the demo schedule; "Let the agent choose" is plainer and more honest than the cute "Surprise me" — it tells the buyer what actually happens (the agent picks the highest-signal angle).*

- **"Let the agent choose" reveal sub-label:** `Who's shipping, who's stalling · highest signal density`
  *why — mirrors the renamed angle; keeps "highest signal density" as the agent's stated reason.*

- **Post-Queue cascade:**
  - Step 1 — title: `Lined up 7 sources to scan overnight` — detail: `Bloomberg · PitchBook · Crunchbase · LinkedIn · X · Gartner · Reuters`
    *why — "Briefed 7 sources" reads like the agent is instructing the sources; "Lined up … to scan" states what it's doing. Source list is demo content the agent reads (not internal plumbing) — it stays.*
  - Step 2 — title: `Calendar set · Brief #52 on your desk 6:42 AM tomorrow`
    *why — keeps Brief #52 and the demo time; matches the "on your desk" framing from above.*

- **Queue button morphed label after click:** `Queued`
  *unchanged.*

- **Cycle summary:** `Cycle complete · agent on-shift 23h 47m`
  *why — keeps the 23h 47m demo schedule; trims "for" for the ticker rhythm.*

- **Post-cycle CTA:** `Want a Research Agent reading the market for your business?` / `Show me how it'd work →` → opens Cal.com booking widget
  *why — strips the banned "Book a 15-min call" clock-claim (the one time reference the task flagged). The new line is an open door that names the payoff and keeps the real booking link intact.*

**Sharpest Research-card line (for reference):** the role label — `Writes the brief before your competitor does.`

---

## What I'd A/B test next
1. **Hero eyebrow vs. headline as the hook carrier** — test "Hire the first agent, not the fifth employee" as the *headline* and a plainer functional eyebrow, to see which placement of the money-math lands harder.
2. **Primary CTA: `Spec my first agent` vs. `See it for my business`** — "spec" promises a deliverable but may read as work; the softer line may convert more cold traffic.
3. **Research role label: `Writes the brief before your competitor does` vs. `A junior analyst that never sleeps`** — competitive-fear framing vs. the cheaper-headcount framing; both are true, different buyers bite on different ones.
4. **Ghost angle copy: outcome-framed (`Who's shipping, who's stalling`) vs. category (`Execution gap`)** — outcome reads warmer but the terse category may signal more rigor to an analytical buyer.
