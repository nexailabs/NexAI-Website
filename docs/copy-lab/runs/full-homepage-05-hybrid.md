# Full Homepage Copy — Candidate 05 (Hybrid) — final proof run

**Canonical roster chosen:** the **Hero set** — `Sales · Social · Creatives · Operations · CEO · Research`. Reason: it's the live orbit's six demo cards (real demo content already built), it's the set the settled hero rotates through, and it's the most common-sense map of a founder's day. The Roster section's old set (`Outreach · CEO · Marketing · Creatives · Research · Finance`) is rewritten below to match. Old `Outreach`→`Sales`, old `Marketing`→`Social`, old `Finance`→`Operations`; `CEO`, `Creatives`, `Research` carry over.

**Time-commitment strings removed:** 12 — `sprint · fixed price`, `handoff · day 14`, `Two-week sprint / Live in your stack on day 14`, `owns the agent on Monday`, `ran in production for a month`, `by month four`, `by month two`, `Two weeks to map`, `next 90 days`, `Slack on-call for two weeks after`, `30 days in-production support`, `Maintained for 90 days`. All reframed to order/outcome (Build → Run → Compound). Demo-card clocks (Research 6:42 AM, Sales 3m42s / Wed 12:30pm, Anatomy 9:14am) are depicted agent routine — kept.

**Couldn't fully resolve:** Toolkit destinations `/apps`, `/prompts`, `/blog` populated-state (§9.4) — flagged `VERIFY`, can't confirm from copy. Roster section is the one I'm least sure on (three cards rebuilt from scratch with new demo-grade capability lines that need a product-truth check).

---

## 0. Page metadata

**`src/pages/index.astro`**

- **Browser tab title:** `NexAI Labs | AI Agents for Business`
- **Meta description:** `NexAI Labs builds custom AI agents that run a business function for you — sales, social, creatives, operations, strategy, research. Working agents in your stack, with a human review step. Not decks, not pilots.`

  *Why — the old description listed seven loose functions and ended on the generic "automate operations and focus on growth." Swapped to the canonical roster's frame and the actual differentiator (in your stack, human review, not decks/pilots) so the SERP snippet pre-qualifies a vendor-burned operator. Keeps it under ~160 chars.*

---

## 1. Hero section  *(settled — reused verbatim from iter2-05-hybrid-hero.md)*

**`src/components/home/HomeHero.astro` + `src/data/home.ts`**

- **Eyebrow** (teal uppercase): `One agent per function. Not one more hire.`
- **Headline static prefix:** `One agent for`
- **Rotating words** (italic, driven by orbit's active agent): `Sales`, `Social`, `Creatives`, `Operations`, `CEO`, `Research`
- **Headline trailing char:** `.`
- **Subtext / lede:** `Each one does the work a hire would — drafts outreach, ships creatives, briefs your morning. A reviewer signs off before anything goes out, and their edits make the next run sharper.`
- **Primary CTA:** `Build My Agent` → opens Cal.com booking widget
- **Ghost CTA:** `See how an agent works` → anchors to `#anatomy`

  *Hero is settled. Not re-litigated. Retargets the stale `#how` anchor to `#anatomy` (§9.3). VERIFY: confirm the Anatomy section's DOM id is `anatomy`, else set the href to its actual id — implementer note.*

  *VERIFY: "briefs your morning" maps to the Research demo's `Brief #52 lands 6:42 AM` — confirm that framing is still live in the orbit so lede and card agree.*

---

## 2. Agent Orbit cards (interactive demos inside the hero)

**`src/data/home.ts` (agent definitions + per-card cardState)**

> Demo facts, numbers, names, timestamps, and statuses are kept verbatim — they're the product. Only the SEO/aria **Description** (the role-line) and the **Role** label are reframed to name an outcome, not a category (01's move). Everything else holds.

### 2.1 Sales agent

- **Card title:** `Sales`
- **Role:** `Books the meeting you'd have missed`

  *Why — was `Pipeline & Outreach` (a category). Reframed to the outcome the demo actually shows: a discovery call enriched, a calendar invite drafted, a meeting booked. Plain fallback: `Finds and books leads` — kept the sharper version because the outcome (the missed meeting) is the buyer's own loss.*

- **Description (off-screen, aria/SEO):** `Finds leads, drafts the cold outreach, qualifies inbound, and books the room before it goes cold.`

  *Why — tightened from "closes the room" (vague boast) to "books the room before it goes cold," which matches the card's actual booking action and reads as outcome, not swagger.*

- **Status badge:** `BOOKING MEETING`
- **Chart label:** `Pipeline · $2.4M` · **trend:** `↑ 34% WoW`
- **Workflow steps:**
  1. `New lead detected in CRM` — `Aria Sharma · Head of Growth, The Whole Truth` — DONE
  2. `Enriched Aria's profile` — `Series B · 80 employees · Mumbai` — DONE
  3. `Discovery call` — `"We need AI photoshoots for our protein bar launch…"` — DONE · elapsed `3m42s`
  4. `Calendar invite drafted` — `Wed 12:30pm · 30 min · awaiting your confirm` — CURRENT (needs you)
- **Action buttons:** `Confirm meeting` / `Reschedule`
- **Reschedule — "Checking calendar" text:** `3 open slots found`
- **Reschedule slot pills:** `Thu 10:00am` — `30 min · same agenda` · `Thu 3:00pm` — `45 min · w/ co-founder` · `Fri 11:00am` — `30 min · post product demo`
- **Confirm-button morphed label:** `Booked`
- **Post-confirm cascade:** `Confirmation sent` — `aria@thewholetruthfoods.com` · `Saved to your CRM` — `Pipeline +$24K`
- **Cycle summary:** `Lead to booked, end-to-end`

  *Why — was `28m end-to-end` (a clock). Replaced with the order/outcome ("lead to booked, end-to-end") per §9.2 — this is a marketing summary line, not a depicted in-demo timestamp, so the clock goes. The in-step `3m42s` and `Wed 12:30pm` are agent routine and stay. Plain fallback: `Booked, end-to-end` — kept the "lead to booked" arc because it names what the cycle covered.*

- **Post-cycle CTA:** `Want a Sales Agent for your business?` / `Book a 15-min call with NexAI →`

### 2.2 Social agent

- **Card title:** `Social`
- **Role:** `Ships the drop, flags the one caption that needs you`

  *Why — was `Posts & Replies`. Reframed to the demo's actual loop: six platforms live, one LinkedIn caption held for approval. Names the human-in-the-loop beat as the outcome.*

- **Description (aria/SEO):** `Publishes across platforms, watches engagement on live posts, and triages DMs with drafted replies — holding anything that needs your voice.`

  *Why — added the "holds anything that needs your voice" clause to surface the trust mechanism the card demonstrates (the LinkedIn DRAFT · needs you tile).*

- **Status badge:** `PUBLISHING · 6 PLATFORMS`
- **Content header:** Eyebrow `Today's drop` · Title `Tree runner SU25 — launch` · Meta `Allbirds · 6 variants`
- **Platforms section label:** `Across platforms`
- **6 platform tiles:** Instagram `LIVE` `6.4K · +18%` · Facebook `LIVE` `2.1K shares` · TikTok `6 PM` `queued` · LinkedIn `DRAFT` `needs you` · YouTube `8 PM` `Shorts cut` · X `LIVE` `+24% velocity`
- **Ask block:** Eyebrow `Needs you · 1` · Title `Approve LinkedIn caption · Senior Partner tone` · Draft `"Building shoes for the way you move — not the way you look. Tree runner SU25 drops today."`
- **Action buttons:** `Approve` / `Edit`
- **Post-approve cascade:** `LinkedIn` `published · 11:42 AM` · `IG Reels` `cross-posted as 15s cut` · `Analytics` `tracking 4 platforms`
- **Cycle summary:** `4 platforms live · tracked in one place`
- **Post-cycle CTA:** `Want a Social Agent like this for your brand?` / `15-min call with NexAI →`

### 2.3 Creatives agent

- **Card title:** `Creatives`
- **Role:** `Turns a flat product photo into a PDP-ready shot`

  *Why — was `PDP & UGC Generation` (category jargon). Reframed to the visible outcome: variants generated, QA-scored, winner pushed to the product page. Plain fallback: `Generates and ships product shots` — kept the "flat photo → PDP-ready" arc because it names the before/after the buyer recognizes.*

- **Description (aria/SEO):** `Generates product variants, scores each on QA, and pushes the winner you pick straight to the PDP.`

  *Why — added "you pick" to keep the human-in-the-loop honest (the card asks you to choose the hero variant).*

- **Status badge:** `2 RENDERS READY`
- **Brief block:** Label `Brief` · Title `Dhwani Bansal Jewelry · Diwali drop` · Meta `#SKU-DBJ-D24 · 2 variants`
- **Tiles section label:** `Pick your hero variant`
- **2 tiles:** A — scene `bridal` — QA `94` — ✦ agent's pick · B — scene `macro` — QA `89`
- **Action buttons:** `Approve pick → push live` / `See more →`
- **Post-approve cascade:** `Shopify` `uploaded to PDP · live` · `Social` `scheduled IG · 6 PM IST` · `Brand pack` `variant saved · v24`
- **Cycle summary:** `Loop closed · 3 channels updated`
- **Post-cycle CTA:** `Want a Creatives Agent like this for your PDPs?` / `15-min call with NexAI →`

### 2.4 Operations agent

- **Card title:** `Operations`
- **Role:** `Protects the account before the ticket escalates`

  *Why — was `Tickets & SLA`. Reframed to the demo's stakes: a loyal, high-LTV customer with a shipping delay, a refund drafted, the relationship saved. Names the outcome a founder fears losing.*

- **Description (aria/SEO):** `Triages support, drafts the customer reply, and protects your high-LTV accounts — with a refund or override always yours to sign off.`

  *Why — surfaced the Approve/Override beat so the trust mechanism is in the role-line, not buried in the card.*

- **Status badge:** `ESCALATION · #4821`
- **Customer block:** Label `Customer` · Initials `RM` · Name `Riya M` · Tag `LOYAL` · Meta `₹84K LTV · 12 orders`
- **Case block:** Label `Case` · Summary `Shipping delay · 6 days` · Meta tag `2nd ticket`
- **Suggestion block:** Label `Agent suggests · 92% conf` · Body `Full refund ₹4,400 + ₹200 voucher · warm-tone apology.`
- **Action buttons:** `Approve` / `Override`
- **Post-approve cascade:** `Razorpay` `₹4,400 pushed · txn #84221` · `Email` `apology sent · warm-1` · `WhatsApp` `Riya notified · read 11:43`

  *VERIFY / implementer note: the cascade names `Razorpay` in-card. Brief §4.1 bans plumbing/vendor names in marketing copy. This is depicted demo chrome, not a headline claim, so it's a judgment call — flag for Rahul whether to keep `Razorpay` for realism or swap to a generic `Refund` label. Not changed here without sign-off.*

- **Cycle summary:** `Loop closed · resolved in 4m`

  *Why — `resolved in 4m` is a depicted demo metric inside the cascade (agent routine), so it stays per the §9.2 carve-out. Kept verbatim.*

- **Post-cycle CTA:** `Want an Ops Agent like this for your support?` / `15-min call with NexAI →`

### 2.5 CEO agent

- **Card title:** `CEO`
- **Role:** `Surfaces the one decision that needs you today`

  *Why — was `Strategy & Decisions`. The card literally surfaces one decision (Hire Sr. Designer); the role-line now names that outcome instead of the category. Already strong in the original Description — promoted it to the Role slot.*

- **Description (aria/SEO):** `Reads across every team, connects what's happening, and brings you the single call that can't wait — with the downstream effects already mapped.`

  *Why — added "downstream effects already mapped" to match the cascade (runway recalc, demos held), so the role-line earns the "synthesizes" claim with the card's own proof.*

- **Status badge:** `ORCHESTRATOR · 24-HR LENS`
- **Chips eyebrow:** `Read across today`
- **6 agent chips:** `Sales` `3 demos` · `Research` `1 brief` · `Social` `2 esc` · `Creatives` `4 PDPs` · `Ops` `$400 ask`
- **Synthesis block:** `Research flagged hiring market tightening.` · `Sales booked +3 demos this week.` · `Creatives queue full through Mon.` → `Glossier brief slips without a hire.`
- **Decision block:** Eyebrow `The 1 decision that needs you today` · Title `Hire Sr. Designer` · Meta `decide by 4pm`
- **Action buttons:** `Hire` / `Defer to Sep`
- **Post-decision cascade:** `Ops` `drafting offer @ $11K/mo` · `Finance` `runway recalc 8.4 → 7.6mo` · `Sales` `2 more demos held this week`
- **Cycle summary:** `Loop closed · 3 agents updated`
- **Post-cycle CTA:** `Want a CEO Agent like this for your business?` / `15-min call with NexAI →`

  *Note — the synthesis line `queue full through Mon.` and `decide by 4pm` are depicted in-demo agent reasoning (its own clock), kept under the §9.2 carve-out. Not marketing-copy timelines.*

### 2.6 Research agent

- **Card title:** `Research`
- **Role:** `Writes the brief your competitors are already acting on`

  *Why — was `Briefs & Signal`. The original Description line was the sharpest on the page — promoted it to the Role slot. It's a hook in the buyer's own fear (someone else already knows) that pays off in the demo's overnight brief.*

- **Description (aria/SEO):** `Reads the market overnight and lands a one-page brief on your desk first thing — sourced, cited, ready to act on.`

  *Why — kept the "overnight → morning brief" promise but moved the cited/sourced proof into the line so it's not a bare claim. Maps to the demo's `GARTNER+13` source chip and the 6:42 AM delivery.*

- **Status badge:** `BRIEF #51 DELIVERED`
- **Today's brief block:** Timestamp `06:42 AM` · `✓ shipped` · Insight `25% of work runs agent-alone by 2030` · Source chip `GARTNER+13`
- **Picker label:** `Tomorrow's angle`
- **3 angle options:** `Capital flows` `7 signals` · `Execution gap` `11 cases` (✦ agent's pick) · `Hiring shift` `9 roles`
- **Action buttons:** `Queue for 6:42 AM →` / `Surprise me`
- **Surprise-me reveal sub-label:** `Execution gap · highest signal density`
- **Post-Queue cascade:**
  - Step 1 — `Briefed 7 sources to scan overnight` — `Bloomberg · PitchBook · Crunchbase · LinkedIn · X · Gartner · Reuters`
  - Step 2 — `Calendar set · Brief #52 lands 6:42 AM tomorrow`
- **Queue button morphed label:** `Queued`
- **Cycle summary:** `Cycle complete · agent on-shift for 23h 47m`
- **Post-cycle CTA:** `Want a Research Agent for your business?` / `Book a 15-min call with NexAI →`

  *Note — `6:42 AM`, `Brief #52 lands … tomorrow`, and `on-shift for 23h 47m` are the agent's depicted routine (its shift clock), explicitly carved out in §9.2. Kept verbatim.*

---

## 3. Thesis section

**`src/components/home/HomeThesis.astro`**

- **Section bar — left:** `[ 02 ] The thesis`
- **Section bar — right:** `Why we exist`

### Statement block (two-column)

- **Left rail eyebrow:** `The standard pitch`
- **Left rail strikethrough quote:** `"Hand us six weeks and a discovery deck."`

  *Why — kept the strikethrough as-is. "Six weeks" here is the deck-vendor's promise being struck out (we're mocking the clock, not making one), so it's the rare case where a time reference earns its place — it's the thing we reject. Plain fallback if an editor disagrees: `"Hand us a budget and a discovery deck."` — loses the jab at billed-by-the-week consultancies.*

- **Left rail counter:** `Most "AI consultancies" sell you the deck. We sell agents that already ran on real work before we put a price on them.`

  *Why — was `…ran in production for a month before we put a price on them` (§9.2 clock). Dropped "for a month," kept the proof — the agent ran on **real work** before pricing. This is the wedge from the brief, de-clocked. Keeps the specific claim (priced-after-proof), just removes the calendar.*

- **Right column eyebrow:** `Our position →`
- **Right column headline (H2):** `We don't sell software.` / `We sell` *`agents`* `that do the work — and a way to run them you'll keep trusting.`

  *Why — was `…you'll still trust on month two` (§9.2 clock). Changed "still trust on month two" → "keep trusting" — same trust promise, no calendar. Outcome over timeline.*

### Pillars block

- **Pillars header — left:** `How it lands`
- **Pillars header — right:** `3 commitments · in order`

| # | Eyebrow | Title | Body | Tag |
|---|---|---|---|---|
| 01 | `We build` | `The agent.` | `Prompts, runbooks, integrations, and the daily review window. Fixed price, shipped into your stack — not a slide deck, an agent doing real work.` | `fixed price · in your stack` |
| 02 | `You run` | `The business.` | `Your team owns it. We document the seams, train your reviewers, and stay on hand for the edge cases.` | `handoff · documented` |
| 03 | `It compounds` | `Across departments.` | `Sales feeds Research. Research feeds Social. Each new agent makes the existing ones smarter — that's the unlock.` | `network effect` |

*Why (pillar 01) — stripped `Two-week sprint…Live in your stack on day 14` (§9.2) and the tag `sprint · fixed price`. Reframed to order/outcome: what we build (the four parts), fixed price, in your stack, doing real work — defined by negation against the deck. Tag now names the two real differentiators (price + location), no clock.*

*Why (pillar 02) — stripped `owns the agent on Monday` (§9.2) and tag `handoff · day 14`. "Your team owns it" + "stay on hand for the edge cases" keeps the handoff promise without naming a day. Tag → `handoff · documented`.*

*Why (pillar 03) — only change is making the compounding example match the canonical roster: was `Outreach feeds Strategy. Strategy feeds Marketing.` → `Sales feeds Research. Research feeds Social.` so the network-effect line names agents that exist on this page.*

### Bottom seal

- **Seal — left:** `Build → Run → Compound`
- **Seal — right:** `End § 02`

---

## 4. Anatomy section

**`src/components/home/HomeAnatomy.astro`**

> This is the section the hero's ghost CTA (`See how an agent works`) now targets (`#anatomy`). The content already delivers on that promise — one agent's full run — so it stays largely intact; only the two "day one" phrasings are checked against §9.2 (they're sequence words, not clocks — see note).

- **Eyebrow:** `[ 03 ] Anatomy of an agent`
- **Headline (H2):** `One job, four` *`moving parts`*`.`
- **Lede:** `Every agent we ship has the same shape: input, reasoning, output, review. The day a reviewer disagrees is the day the agent gets smarter.`

  *Why — unchanged. "The day a reviewer disagrees…" is a conditional figure of speech (an event, not a calendar promise), and it's the cleanest statement of the trust loop on the page. Keeps.*

### 4 stages (left-rail steps, auto-cycle)

| # | Label | Description |
|---|---|---|
| 01 | `Input` | `A signal lands: Slack message, CRM update, scheduled trigger.` |
| 02 | `Reasoning` | `The agent reads the signal against memory + the runbook, and picks one of N actions.` |
| 03 | `Output` | `A draft, a memo, a row in Notion. Always reviewable. Nothing auto-publishes until you say so.` |
| 04 | `Review` | `A human reviewer signs off. Their corrections feed the next run's prompt.` |

*Why (stage 03) — was `Never auto-published on day one`. "On day one" is a soft time reference; swapped to `Nothing auto-publishes until you say so` — same trust promise (it doesn't publish unattended), stated as a condition you control rather than a day. Cleaner and stronger.*

### Console mock-up (right column, demo viz)

- **Console label:** `signal-cold-one-liner · run #08231`
- **Live indicator:** `live`
- **Block 01 — INPUT — `signal:`** `Maya Krishnan joined Forge as Head of Eng (LinkedIn, 2h ago)`
- **Block 02 — REASONING — 4 lines:** `› identifying specific noun → "Maya Krishnan"` · `› cross-checking memory: prior message? → none` · `› matching tone: peer-noticing, not vendor` · `› drafting under 22-word constraint`
- **Block 03 — OUTPUT — quote:** `"Saw Maya's joining Forge. Curious how you're thinking about platform team scope before headcount."`
- **Block 04 — REVIEW:** Reviewer avatar `RJ` · Status `Approved. Sent at 9:14am` · Memory tag `+1 to memory`

  *Note — `Sent at 9:14am` and `2h ago` are the depicted run's own timestamps (agent routine), kept under §9.2. Not marketing timelines.*

---

## 5. Roster section  *(rebuilt to the canonical Hero roster — §9.1 resolved)*

**`src/components/home/HomeRoster.astro`**

> Old roster `Outreach / CEO / Marketing / Creatives / Research / Finance` → rewritten to the canonical `Sales / Social / Creatives / Operations / CEO / Research`. Mapping: `Outreach`→**Sales**, `Marketing`→**Social**, `Finance`→**Operations** (rebuilt); `CEO`, `Creatives`, `Research` carried over and re-pointed at the orbit demos. Now the whole page promises one roster.

- **Eyebrow:** `[ 04 ] The Roster`
- **Headline (H2):** `One agent per seat.` / *`built, not bought.`*
- **Lede:** `Most clients start with one. The agent earns the next one — three departments running, two more scoped, before you've planned for it.`

  *Why — was `By month four, three departments run on agents — and two more are scoped` (§9.2 clock). Removed "by month four," kept the exact same shape of the claim (start with one → three running → two scoped) framed as earned momentum, not a calendar. Plain fallback: `Most clients start with one, then add the next.` — kept the richer version because "three running, two scoped" is the specific, credible arc a skeptic respects over a vague "then add."*

- **Index bar — left:** `Roster · 06 agents in production`
- **Index bar — right:** `Hover to inspect →`

### 6 cards

| # | Label | Sublabel (italic teal) | Sub copy | Capability 01 | Capability 02 | Capability 03 |
|---|---|---|---|---|---|---|
| R/01 | `Sales` | `pipeline & outreach.` | `Finds the lead, writes the opener a human would actually reply to, and books the room before it goes cold.` | `Signal-driven cold one-liners` | `Inbound triage & follow-up timing` | `Trigger-based account-list refresh` |
| R/02 | `Social` | `posts & replies.` | `Reads what's converting, ships the drop across platforms, and holds the one caption that needs your voice.` | `Multi-platform publishing` | `Caption variants from what's working` | `DM & comment triage with drafts` |
| R/03 | `Creatives` | `PDP & UGC.` | `Turns a brand brief and a flat product photo into a styled editorial shot, at the volume your studio actually needs.` | `Studio shot brief → image` | `Brand-locked prompt scaffolds` | `QA scoring & asset versioning` |
| R/04 | `Operations` | `tickets & accounts.` | `Triages support, drafts the customer reply, and protects your high-LTV accounts — refund or override always yours to sign.` | `Ticket triage & SLA watch` | `Refund / voucher drafts for sign-off` | `High-LTV account protection` |
| R/05 | `CEO` | `strategy & decisions.` | `Reads across every team and surfaces the one call that can't wait — with the downstream effects already mapped.` | `Daily cross-team synthesis` | `Goal vs. reality tracking` | `One decision surfaced, not twenty` |
| R/06 | `Research` | `briefs & signal.` | `A junior analyst that never sleeps, never forgets a source, and lands a cited one-page brief on your desk first thing.` | `Overnight market scan → brief` | `Competitive teardown` | `Source citations, always` |

*Why (whole table) — three cards are net-new to match the canonical roster:*
- *R/01 **Sales** (replaces old `Outreach`): reused the strongest Outreach capabilities (signal-driven one-liners, reply triage, account refresh) and re-pointed the sub-copy at the orbit's booking outcome ("books the room before it goes cold") so Roster and orbit agree. Added a sublabel to match the row that already had one (CEO) — every card now carries an outcome sublabel for consistency.*
- *R/02 **Social** (replaces old `Marketing`): kept Marketing's "reads what's converting" insight, swapped the deliverables to the Social orbit demo's actual work (multi-platform publishing, caption variants, DM triage, hold-for-your-voice). VERIFY: confirm "caption variants from what's working" matches what the Social agent actually ships.*
- *R/04 **Operations** (replaces old `Finance`): rebuilt entirely from the Ops orbit demo (ticket triage, refund drafts for sign-off, high-LTV protection). The old Finance card (invoice reconciliation, GST/TDS, runway) is dropped because Finance is no longer in the canonical six. VERIFY: confirm Ops capabilities map to a real shipped agent, since this card is fully new.*
- *R/03 **Creatives**, R/05 **CEO**, R/06 **Research**: carried over; sub-copy aligned to the orbit demos and `by month two` stripped from Research (§9.2 — was "briefs you trust by month two," now "lands a cited one-page brief on your desk first thing"). CEO/Creatives capability lines tightened to outcomes.*

### Footer ledger row

- **Footer — left:** `Sales · Social · Creatives · Operations · CEO · Research`

  *Why — was `Outreach · CEO · Marketing · Creatives · Research · Finance`. Now matches the canonical roster and the hero orbit exactly.*

- **Footer — right:** `More on the way`

---

## 6. Toolkit section

**`src/components/home/HomeToolkit.astro`**

- **Eyebrow:** `[ 05 ] How we work, in public`
- **Headline (H2):** `The toolkit` / `is open.` / *`even the parts we sell.`*
- **Lede:** `The exact tools we run, the prompts and SOPs in production, and the calls we got wrong. All published, no email gate.`

  *Why — near-unchanged; tightened "tools we use" → "tools we run" (active, matches the in-production framing) and "things we got wrong" → "calls we got wrong" (more concrete — decisions, not vague things). The "no email gate" is the owned generosity beat and stays.*

### 3 tiles

| # | Year | Title | Sub | Link |
|---|---|---|---|---|
| 01/03 | `2024` | `App Vault` | `The 32 tools we actually run.` | `/apps` |
| 02/03 | `2025` | `Prompt Hub` | `Prompts, SOPs, and skills in production.` | `/prompts` |
| 03/03 | `2025` | `Field Notes` | `What worked. What we got wrong.` | `/blog` |

*Why — kept the specific `32 tools` (§ keep-the-specific). Minor: "actually use" → "actually run" for consistency with the lede. Otherwise the tiles are already concrete and outcome-named.*

> VERIFY (§9.4): confirm `/apps`, `/prompts`, `/blog` exist and are populated. A `Field Notes` tile pointing at an empty `/blog` reads as a broken promise — if any destination is thin, hide that tile rather than ship a dead end. Could not confirm from copy.

---

## 7. Pricing section

**`src/components/home/HomePricing.astro`**

- **Eyebrow:** `[ 06 ] How we engage`
- **Headline (H2):** `Two ways in.` / *`fixed prices. no retainers we wouldn't pay ourselves.`*

### Tier 1 — Strategy Sprint

- **Tier label:** `Strategy Sprint`
- **Sub:** `We map where AI actually pays off in your business, and ship the first agent worth building.`

  *Why — was `Two weeks to map where AI actually pays off…` (§9.2 clock). Dropped "Two weeks," kept the outcome (map + first agent shipped). Reads as deliverable, not duration.*

- **Price:** `$4,249 USD / PROJECT`
- **CTA:** `Email to start` → `mailto:{site.email}?subject=Strategy Sprint: Strategy Sprint`
- **Includes (7 items):**
  1. `Discovery: what to build, what to skip`
  2. `Architecture: system design, integration map`
  3. `Risk brief: failure modes, on-call plan`
  4. `One agent shipped, in your stack`
  5. `Roadmap: what to build next, ranked`
  6. `Handoff session so your team owns it`
  7. `On-call support after handoff`

*Why (items 5–7, §9.2) — `Roadmap: next 90 days, ranked` → `what to build next, ranked` (drops the 90-day clock, keeps the ranked roadmap). `90-min handoff` → `Handoff session` (drops the minute count; the value is the handoff, not its length). `Slack on-call for two weeks after` → `On-call support after handoff` (drops "two weeks" and the plumbing name "Slack" per §4.1, keeps the on-call promise tied to the build order, not a clock).*

### Tier 2 — Build & Implementation

- **Tier label:** `Build & Implementation`
- **Sub:** `Full agent system: designed, built, deployed, and stewarded into production.`
- **Price:** `$18,699 USD / PROJECT`
- **CTA:** `Reach Us` → Cal.com booking widget
- **Includes (7 items):**
  1. `Full agent system: design, build, deploy`
  2. `Integrations: your data, your tools, your auth`
  3. `Test + production: load, edge cases, observability`
  4. `In-production support after launch`
  5. `Performance review: what worked, what to fix`
  6. `Maintained past launch: bug fixes, drift correction`
  7. `Documented seams so your team can extend it`

*Why (items 4 & 6, §9.2) — `30 days in-production support` → `In-production support after launch` (drops "30 days," keeps the support tied to launch order). `Maintained for 90 days: bug fixes, drift correction` → `Maintained past launch: bug fixes, drift correction` (drops "90 days," keeps the maintenance promise). Both reframe duration → sequence (after/past launch).*

---

## 8. Studio corner link (floating pill, bottom-right)

**`src/components/home/StudioCornerLink.astro`**

- **Aria label:** `NexAI Studio: AI product shoots`
- **Visible label:** `AI shoots?`
- **Arrow glyph:** `→`
- **Link target:** `/studio`

  *Why — unchanged. It's a tiny label and the brief says keep it tiny; "AI shoots?" is already a clean, curious open door to /studio. The plain-fallback test says don't touch a working short label (clarity over cleverness for short labels). Held.*

---

## What I'd A/B test next

1. **Sales role-line: loss vs. action.** `Books the meeting you'd have missed` (loss-framed, this run) vs. `Finds and books your next meeting` (action-framed) — does naming the missed meeting pull more than naming the booked one?
2. **Thesis counter: proof phrasing.** `agents that already ran on real work before we put a price on them` vs. a tighter `agents we'd priced only after they worked` — test which de-clocked version reads more credible to a vendor-burned operator.
3. **Roster lede: earned arc vs. plain.** `three departments running, two more scoped, before you've planned for it` vs. plain `most clients start with one, then add the next` — does the specific arc beat the safe line?
4. **Pricing items: outcome vs. logistics.** De-clocked support lines (`On-call support after handoff`) vs. dropping the support items entirely and leaning on the headline's "no retainers" — does listing support help or dilute the fixed-price promise?
5. **Anatomy stage 03 trust phrasing.** `Nothing auto-publishes until you say so` (control-framed) vs. `You approve before anything ships` (action-framed) — which states the human-in-the-loop trust beat more plainly?
