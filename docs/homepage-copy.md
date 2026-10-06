# NexAI Labs — Homepage Copy (current live on localhost)

> This document is the source of truth for every user-facing string on the homepage as of today. Mark up, rewrite, comment freely. Nothing here ships to the site until you say so.
>
> File mappings are noted next to each section so any approved change can be applied directly.

---

## 0. Page metadata

**`src/pages/index.astro`**

- **Browser tab title:** `NexAI Labs | AI Agents for Business`
- **Meta description:** `NexAI Labs builds custom AI agents for outreach, marketing, strategy, finance, content, and sales, so you can automate operations and focus on growth.`

---

## 1. Hero section

**`src/components/home/HomeHero.astro` + `src/data/home.ts`**

- **Eyebrow** (above headline, teal uppercase): `Your business on autopilot`
- **Headline static prefix:** `AI Agents for`
- **Rotating words** (cycle in italic, driven by the orbit's active agent): `Sales`, `Social`, `Creatives`, `Operations`, `CEO`, `Research`
- **Headline trailing char:** `.` (period after the rotating word)
- **Subtext / lede:** `We understand your business, then design, develop, and train AI agents to run it for you.`
- **Primary CTA:** `Build My Agent` → opens Cal.com booking widget
- **Ghost CTA:** `See how it works` → anchors to `#how` (anchor target may be stale, verify)

---

## 2. Agent Orbit cards (interactive demos inside the hero)

**`src/data/home.ts` (agent definitions + per-card cardState)**

These appear as 6 cards orbiting in the hero — visitor clicks any one to see its demo cycle.

### 2.1 Sales agent

- **Card title:** `Sales`
- **Role:** `Pipeline & Outreach`
- **Description (off-screen, for SEO/aria):** `Finds leads, drafts cold outreach, qualifies inbound, and closes the room.`
- **Status badge:** `BOOKING MEETING`
- **Chart label:** `Pipeline · $2.4M` · **trend:** `↑ 34% WoW`
- **Workflow steps** (timeline shown above action buttons):
  1. `New lead detected in CRM` — `Aria Sharma · Head of Growth, The Whole Truth` — DONE
  2. `Enriched Aria's profile` — `Series B · 80 employees · Mumbai` — DONE
  3. `Discovery call` — `"We need AI photoshoots for our protein bar launch…"` — DONE · elapsed `3m42s`
  4. `Calendar invite drafted` — `Wed 12:30pm · 30 min · awaiting your confirm` — CURRENT (needs you)
- **Action buttons:** `Confirm meeting` (primary) / `Reschedule` (ghost)
- **Reschedule path — "Checking calendar" text:** `3 open slots found`
- **Reschedule slot pills:**
  - `Thu 10:00am` — `30 min · same agenda`
  - `Thu 3:00pm` — `45 min · w/ co-founder`
  - `Fri 11:00am` — `30 min · post product demo`
- **Confirm-button morphed label after click:** `Booked`
- **Post-confirm cascade** (fans in after Confirm click):
  - `Confirmation sent` — `aria@thewholetruthfoods.com`
  - `Saved to your CRM` — `Pipeline +$24K`
- **Cycle summary:** `28m end-to-end`
- **Post-cycle CTA:** `Want a Sales Agent for your business?` / `Book a 15-min call with NexAI →`

### 2.2 Social agent

- **Card title:** `Social`
- **Role:** `Posts & Replies`
- **Description:** `Watches engagement on live posts and triages DMs with drafted replies.`
- **Status badge:** `PUBLISHING · 6 PLATFORMS`
- **Content header:**
  - Eyebrow: `Today's drop`
  - Title: `Tree runner SU25 — launch`
  - Meta: `Allbirds · 6 variants`
- **Platforms section label:** `Across platforms`
- **6 platform tiles** (status / metric):
  - **Instagram** — `LIVE` — `6.4K · +18%`
  - **Facebook** — `LIVE` — `2.1K shares`
  - **TikTok** — `6 PM` — `queued`
  - **LinkedIn** — `DRAFT` — `needs you` (gold accent)
  - **YouTube** — `8 PM` — `Shorts cut`
  - **X** — `LIVE` — `+24% velocity`
- **Ask block** (the human-in-the-loop item):
  - Eyebrow: `Needs you · 1`
  - Title: `Approve LinkedIn caption · Senior Partner tone`
  - Draft preview: `"Building shoes for the way you move — not the way you look. Tree runner SU25 drops today."`
- **Action buttons:** `Approve` / `Edit`
- **Post-approve cascade:**
  - `LinkedIn` — `published · 11:42 AM`
  - `IG Reels` — `cross-posted as 15s cut`
  - `Analytics` — `tracking 4 platforms`
- **Cycle summary:** `4 platforms live · tracked in one place`
- **Post-cycle CTA:** `Want a Social Agent like this for your brand?` / `15-min call with NexAI →`

### 2.3 Creatives agent

- **Card title:** `Creatives`
- **Role:** `PDP & UGC Generation`
- **Description:** `Generates product variants, scores QA, and pushes the winner to PDP.`
- **Status badge:** `2 RENDERS READY`
- **Brief block:**
  - Label: `Brief`
  - Title: `Dhwani Bansal Jewelry · Diwali drop`
  - Meta: `#SKU-DBJ-D24 · 2 variants`
- **Tiles section label:** `Pick your hero variant` (gold — "needs you")
- **2 tiles** (real Studio images):
  - **A** — scene: `bridal` — QA `94` — ✦ agent's pick (teal ring)
  - **B** — scene: `macro` — QA `89`
- **Action buttons:** `Approve pick → push live` / `See more →`
- **Post-approve cascade:**
  - `Shopify` — `uploaded to PDP · live`
  - `Social` — `scheduled IG · 6 PM IST`
  - `Brand pack` — `variant saved · v24`
- **Cycle summary:** `Loop closed · 3 channels updated`
- **Post-cycle CTA:** `Want a Creatives Agent like this for your PDPs?` / `15-min call with NexAI →`

### 2.4 Operations agent

- **Card title:** `Operations`
- **Role:** `Tickets & SLA`
- **Description:** `Triages support, drafts customer comms, and protects high-LTV accounts.`
- **Status badge:** `ESCALATION · #4821`
- **Customer block:**
  - Label: `Customer`
  - Avatar initials: `RM`
  - Name: `Riya M`
  - Tag: `LOYAL`
  - Meta: `₹84K LTV · 12 orders`
- **Case block:**
  - Label: `Case`
  - Summary: `Shipping delay · 6 days` (amber left border)
  - Meta tag (gold): `2nd ticket`
- **Suggestion block** (teal-bordered):
  - Label: `Agent suggests · 92% conf`
  - Body: `Full refund ₹4,400 + ₹200 voucher · warm-tone apology.`
- **Action buttons:** `Approve` / `Override`
- **Post-approve cascade:**
  - `Razorpay` — `₹4,400 pushed · txn #84221`
  - `Email` — `apology sent · warm-1`
  - `WhatsApp` — `Riya notified · read 11:43`
- **Cycle summary:** `Loop closed · resolved in 4m`
- **Post-cycle CTA:** `Want an Ops Agent like this for your support?` / `15-min call with NexAI →`

### 2.5 CEO agent

- **Card title:** `CEO`
- **Role:** `Strategy & Decisions`
- **Description:** `Synthesizes across teams and surfaces the one decision that needs you today.`
- **Status badge:** `ORCHESTRATOR · 24-HR LENS`
- **Chips eyebrow:** `Read across today`
- **6 agent chips** (cross-team status):
  - `Sales` — `3 demos` (teal)
  - `Research` — `1 brief` (teal)
  - `Social` — `2 esc` (gold, alert tone)
  - `Creatives` — `4 PDPs` (teal)
  - `Ops` — `$400 ask` (teal, spend tone)
- **Synthesis block** (3 lines linked → conclusion):
  - Line 1: `Research flagged hiring market tightening.`
  - Line 2: `Sales booked +3 demos this week.`
  - Line 3: `Creatives queue full through Mon.`
  - Conclusion (after arrow): `Glossier brief slips without a hire.`
- **Decision block:**
  - Eyebrow: `The 1 decision that needs you today`
  - Title: `Hire Sr. Designer`
  - Meta: `decide by 4pm`
- **Action buttons:** `Hire` / `Defer to Sep`
- **Post-decision cascade:**
  - `Ops` — `drafting offer @ $11K/mo`
  - `Finance` — `runway recalc 8.4 → 7.6mo`
  - `Sales` — `2 more demos held this week`
- **Cycle summary:** `Loop closed · 3 agents updated`
- **Post-cycle CTA:** `Want a CEO Agent like this for your business?` / `15-min call with NexAI →`

### 2.6 Research agent

- **Card title:** `Research`
- **Role:** `Briefs & Signal`
- **Description:** `Reads the market overnight. Writes the brief your competitors are already acting on.`
- **Status badge:** `BRIEF #51 DELIVERED`
- **Today's brief block:**
  - Timestamp: `06:42 AM` · status: `✓ shipped`
  - Insight (single line): `25% of work runs agent-alone by 2030`
  - Source chip (mono uppercase): `GARTNER+13`
- **Picker label (gold — "needs you"):** `Tomorrow's angle`
- **3 angle options** (visitor picks one):
  - `Capital flows` — `7 signals` (default-selected)
  - `Execution gap` — `11 cases` (agent's pick, marked ✦)
  - `Hiring shift` — `9 roles`
- **Action buttons:** `Queue for 6:42 AM →` (primary) / `Surprise me` (ghost)
- **Surprise-me reveal sub-label:** `Execution gap · highest signal density`
- **Post-Queue cascade (research-specific richer pattern):**
  - Step 1 — title: `Briefed 7 sources to scan overnight` — detail: `Bloomberg · PitchBook · Crunchbase · LinkedIn · X · Gartner · Reuters`
  - Step 2 — title: `Calendar set · Brief #52 lands 6:42 AM tomorrow`
- **Queue button morphed label after click:** `Queued`
- **Cycle summary:** `Cycle complete · agent on-shift for 23h 47m`
- **Post-cycle CTA:** `Want a Research Agent for your business?` / `Book a 15-min call with NexAI →`

---

## 3. Thesis section

**`src/components/home/HomeThesis.astro`**

- **Section bar — left:** `[ 02 ] The thesis`
- **Section bar — right:** `Why we exist`

### Statement block (two-column)

- **Left rail eyebrow:** `The standard pitch`
- **Left rail strikethrough quote:** `"Hand us six weeks and a discovery deck."`
- **Left rail counter:** `Most "AI consultancies" sell decks. We sell agents that ran in production for a month before we put a price on them.`
- **Right column eyebrow:** `Our position →`
- **Right column headline (H2):** `We don't sell software.` / `We sell` *`agents`* `that do the work — and a way to run them you'll still trust on month two.`

### Pillars block

- **Pillars header — left:** `How it lands`
- **Pillars header — right:** `3 commitments · in order`

| # | Eyebrow | Title | Body | Tag |
|---|---|---|---|---|
| 01 | `We build` | `The agent.` | `Prompts, runbooks, integrations, the daily review window. Two-week sprint, fixed price. Live in your stack on day 14.` | `sprint · fixed price` |
| 02 | `You run` | `The business.` | `Your team owns the agent on Monday. We document the seams, train your reviewers, and stay on Slack for edge cases.` | `handoff · day 14` |
| 03 | `It compounds` | `Across departments.` | `Outreach feeds Strategy. Strategy feeds Marketing. Each new agent makes the existing ones smarter; that's the unlock.` | `network effect` |

### Bottom seal

- **Seal — left:** `Build → Run → Compound`
- **Seal — right:** `End § 02`

---

## 4. Anatomy section

**`src/components/home/HomeAnatomy.astro`**

- **Eyebrow:** `[ 03 ] Anatomy of an agent`
- **Headline (H2):** `One job, four` *`moving parts`*`.`
- **Lede:** `Every agent we ship has the same shape: input, reasoning, output, review. The day a reviewer disagrees is the day the agent gets smarter.`

### 4 stages (left-rail steps, auto-cycle every 2.8s)

| # | Label | Description |
|---|---|---|
| 01 | `Input` | `A signal lands: Slack message, CRM update, scheduled trigger.` |
| 02 | `Reasoning` | `The agent reads the signal against memory + the runbook, and picks one of N actions.` |
| 03 | `Output` | `A draft, a memo, a row in Notion. Always reviewable. Never auto-published on day one.` |
| 04 | `Review` | `A human reviewer signs off. Their corrections feed the next run's prompt.` |

### Console mock-up (right column, demo viz)

- **Console label:** `signal-cold-one-liner · run #08231`
- **Live indicator:** `live`
- **Block 01 — INPUT — `signal:`** `Maya Krishnan joined Forge as Head of Eng (LinkedIn, 2h ago)`
- **Block 02 — REASONING — 4 lines:**
  - `› identifying specific noun → "Maya Krishnan"`
  - `› cross-checking memory: prior message? → none`
  - `› matching tone: peer-noticing, not vendor`
  - `› drafting under 22-word constraint`
- **Block 03 — OUTPUT — quote:** `"Saw Maya's joining Forge. Curious how you're thinking about platform team scope before headcount."`
- **Block 04 — REVIEW:**
  - Reviewer avatar: `RJ`
  - Status: `Approved. Sent at 9:14am`
  - Memory tag: `+1 to memory`

---

## 5. Roster section

**`src/components/home/HomeRoster.astro`**

> ⚠️ **Content bug flagged:** The Roster names 6 agents that **do not match** the Hero's 6 agents. Hero says `Sales / Social / Creatives / Operations / CEO / Research`. Roster says `Outreach / CEO / Marketing / Creatives / Research / Finance`. Two different brand promises on the same page.

- **Eyebrow:** `[ 04 ] The Roster`
- **Headline (H2):** `One agent per seat.` / *`built, not bought.`*
- **Lede:** `Most clients start with one. By month four, three departments run on agents — and two more are scoped.`
- **Index bar — left:** `Roster · 06 agents in production`
- **Index bar — right:** `Hover to inspect →`

### 6 cards

| # | Label | Sublabel (italic teal) | Sub copy | Capability 01 | Capability 02 | Capability 03 |
|---|---|---|---|---|---|---|
| R/01 | `Outreach` | — | `Synthesizes signals across the web and writes opening lines a human would actually reply to.` | `Signal-driven cold one-liners` | `Reply triage & follow-up timing` | `Trigger-based account list refresh` |
| R/02 | `CEO` | `strategy & decisions.` | `Synthesizes what's happening across every team and surfaces the one thing that needs your attention.` | `Daily cross-team briefings` | `Goal vs. reality tracking` | `Task delegation by department` |
| R/03 | `Marketing` | — | `Reads what's converting, what's not, and writes the next experiment before the standup.` | `Channel performance synthesis` | `Ad copy variants from receipts` | `Landing-page CRO suggestions` |
| R/04 | `Creatives` | — | `Turns a brand brief and a flat product photo into a styled editorial shot, at the volume your studio actually needs.` | `Studio shot brief → image` | `Brand-locked prompt scaffolds` | `Asset versioning & QA` |
| R/05 | `Research` | — | `A junior analyst that never sleeps, never forgets a source, and writes one-page briefs you trust by month two.` | `Discovery-call → one-page brief` | `Competitive teardown` | `Source citations, always` |
| R/06 | `Finance` | — | `Reads the bank feed, reconciles invoices, and asks the founder one question a week, never twenty.` | `Invoice reconciliation` | `GST / TDS prep` | `Cash runway projections` |

### Footer ledger row

- **Footer — left:** `Outreach · CEO · Marketing · Creatives · Research · Finance`
- **Footer — right:** `More on the way`

---

## 6. Toolkit section

**`src/components/home/HomeToolkit.astro`**

- **Eyebrow:** `[ 05 ] How we work, in public`
- **Headline (H2):** `The toolkit` / `is open.` / *`even the parts we sell.`*
- **Lede:** `The exact tools we use, the prompts and SOPs in production, and the things we got wrong. All published, no email gate.`

### 3 tiles

| # | Year | Title | Sub | Link |
|---|---|---|---|---|
| 01/03 | `2024` | `App Vault` | `The 32 tools we actually use.` | `/apps` |
| 02/03 | `2025` | `Prompt Hub` | `Prompts, SOPs, skills in production.` | `/prompts` |
| 03/03 | `2025` | `Field Notes` | `What worked. What we got wrong.` | `/blog` |

> ⚠️ Flag for verification: confirm `/apps`, `/prompts`, `/blog` exist and are populated. An empty destination is worse than no tile.

---

## 7. Pricing section

**`src/components/home/HomePricing.astro`**

- **Eyebrow:** `[ 06 ] How we engage`
- **Headline (H2):** `Two ways in.` / *`fixed prices. no retainers we wouldn't pay ourselves.`*

### Tier 1 — Strategy Sprint

- **Tier label:** `Strategy Sprint`
- **Sub:** `Two weeks to map where AI actually pays off in your business, and what to build first.`
- **Price:** `$4,249 USD / PROJECT`
- **CTA:** `Email to start` → `mailto:{site.email}?subject=Strategy Sprint: Strategy Sprint`
- **Includes (7 items):**
  1. `Discovery: what to build, what to skip`
  2. `Architecture: system design, integration map`
  3. `Risk brief: failure modes, on-call plan`
  4. `One agent shipped, in your stack`
  5. `Roadmap: next 90 days, ranked`
  6. `90-min handoff so your team owns it`
  7. `Slack on-call for two weeks after`

### Tier 2 — Build & Implementation

- **Tier label:** `Build & Implementation`
- **Sub:** `Full agent system: designed, built, deployed, and stewarded into production.`
- **Price:** `$18,699 USD / PROJECT`
- **CTA:** `Reach Us` → Cal.com booking widget
- **Includes (7 items):**
  1. `Full agent system: design, build, deploy`
  2. `Integrations: your data, your tools, your auth`
  3. `Test + production: load, edge cases, observability`
  4. `30 days in-production support`
  5. `Performance review: what worked, what to fix`
  6. `Maintained for 90 days: bug fixes, drift correction`
  7. `Documented seams so your team can extend it`

---

## 8. Studio corner link (floating pill, bottom-right)

**`src/components/home/StudioCornerLink.astro`**

- **Aria label:** `NexAI Studio: AI product shoots`
- **Visible label:** `AI shoots?`
- **Arrow glyph:** `→`
- **Link target:** `/studio`

---

## 9. Cross-page anomalies + flagged items

These were spotted in the audit pass. Worth deciding on before any rewrite.

1. **Roster ↔ Hero name mismatch.** Hero has `Sales / Social / Creatives / Operations / CEO / Research`. Roster has `Outreach / CEO / Marketing / Creatives / Research / Finance`. Same page, different rosters. Highest priority to align.
2. **Time commitments everywhere.** Per your "no time commitments in marketing copy" rule, the following strings violate:
   - Thesis pillar tags: `sprint · fixed price`, `handoff · day 14`
   - Thesis pillar 01 body: `Two-week sprint…Live in your stack on day 14.`
   - Thesis pillar 02 body: `…owns the agent on Monday.`
   - Thesis statement counter: `…ran in production for a month before we put a price on them.`
   - Roster lede: `…by month four, three departments run on agents…`
   - Roster R/05 Research sub: `…writes one-page briefs you trust by month two.`
   - Pricing Tier 1 sub: `Two weeks to map where AI actually pays off…`
   - Pricing Tier 1 includes: `Roadmap: next 90 days…`, `Slack on-call for two weeks after`
   - Pricing Tier 2 includes: `30 days in-production support`, `Maintained for 90 days…`
3. **Hero ghost CTA target.** Goes to `#how` — that anchor doesn't appear on the page (probably stale).
4. **Toolkit destinations.** `/apps`, `/prompts`, `/blog` — confirm each is populated. A blog tile pointing to an empty `/blog` reads as a broken promise.
5. **Hero CTA primary copy.** `Build My Agent` is decent. Alternative if you want to test softer: `Show me an agent`, `See it for my business`, `Spec my first agent`.
6. **Hero subtext.** Current copy uses four verbs (`understand, design, develop, train`) that say nothing. Candidate for the simplification pass.

---

## How to use this doc

1. **Mark up in place** — strike out, comment, rewrite directly in the markdown.
2. When a section is final, I'll apply the changes to the actual files (filenames noted under each section header).
3. The ⚠️ flags above are independent of copy edits — they're structural bugs that should resolve regardless of voice direction.
