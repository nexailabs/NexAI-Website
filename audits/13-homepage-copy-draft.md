# Homepage Copy Draft — Holistic Rewrite (Studio voice pass)

**Status:** Draft, ready for review.
**Date:** 2026-04-26
**Author:** Claude (Sonnet 4.6).
**Scope:** Hero, Thesis, Anatomy, Roster, Toolkit, Pricing — full Studio-voice pass. Corrected NexAI-Labs-as-AI-Labs positioning throughout.

---

## Voice fingerprints (verbatim snippets I'll match)

These are receipts from the Studio source files. Every homepage recommendation below echoes one of these patterns.

1. `studio-copy.ts` — process step 02: **"Our team cleans backgrounds, stitches the garment, and builds the model map. You do nothing."**
   Pattern: We do the work. You get the result. Subject-verb lists, then a two-word payoff.

2. `studio-copy.ts` — process step 04: **"Our team reviews every shot, touches it up if needed, then ships it ready for Myntra, Amazon, or your Shopify."**
   Pattern: Concrete destination named at the end. "Ready for [real thing]" not "optimised for deployment."

3. `studio-copy.ts` — FAQ item 08 (featured): **"Because those were tools. This is a service."**
   Pattern: Short reframe. Two sentences, four words total. The second sentence lands the category.

4. `StudioCTA.astro` — headline: **"Launch your next collection without booking a shoot."**
   Pattern: Affirmative action + negation of the old way. Tells you what you get and what you skip.

5. `StudioProcess.astro` — section subtitle: **"Product to photoshoot. Days, not weeks."**
   Pattern: Parallel two-beat. What goes in, what comes out, and the number that beats the alternative.

---

## Voice principles (5 bullets, derived from the Studio fingerprints)

- **We do the work; you get the result.** Every slot names what we handle, not what the client has to figure out.
- **Two-beat parallel endings.** The sharpest lines close with a contrast: "Days, not weeks." / "You do nothing." / "Built, not rented."
- **Name the concrete destination.** "Live in your stack" beats "deployed." "Owned on day 44" beats "fully handed over."
- **Reframe by stating the category.** "Those were tools. This is a service." Claim the right box; let the contrast do the work.
- **Affirmative action + negation of the old way.** "Build one agent without hiring a team." The Studio CTA structure works everywhere.

---

## Positioning summary

NexAI Labs is an AI labs company. We custom-build AI agents for businesses: 14-day Strategy Sprint to design and ship the first one, then ~30 days of supervised production in the client's stack before final handover. The client's team owns the agent outright — no platform, no subscription, no lock-in. NexAI Studio (AI fashion photoshoots for D2C brands) runs as a parallel service line. Two apps ship when 10 teams use each in production.

---

## Section 01 — Hero

**Slot: Eyebrow** (≤6 words; kindergarten grammar; subject-verb-object or noun-prep-noun)

- A. **AI agents for your business.** — _why:_ noun-prep-noun, five words, states the product and the recipient in plain language. Echoes "AI Photoshoots for Fashion Brands" — Studio's own eyebrow pattern.
- B. **We build AI agents for businesses.** — _why:_ subject-verb-object, six words flat. Same declarative confidence as "Our team reviews every shot… then ships it."
- ★ C. **Custom AI agents for your business.** — _why:_ noun-prep-noun, five words. "Custom" locks the non-SaaS category without a sentence of explanation — like "AI Photoshoots" locked "not a filter app." Rahul approved noun-prep-noun; this is the cleanest instance of it.

**Slot: Headline** (pattern locked: `AI agents for [rotating word].`)

Keep as-is. Words: Outreach / Marketing / Finance / Research / Strategy / Creatives. These are the six departments we currently ship for. Do not add or remove words.

**Slot: Subtext**

- A. **We design it, build it, and run it in your stack for 30 days. Then your team owns it outright.** — _why:_ "We handle X. You get Y." is the Studio process-step structure. Two sentences. Real number. Echoes "Our team cleans… You do nothing."
- B. **One 14-day sprint to ship the first agent. Thirty days running in your stack. Your team owns it on day 44.** — _why:_ the three-beat timeline is the homepage's core claim. Numbered, concrete, no hedge.
- ★ C. **14-day sprint to design and ship. 30 days running in your stack. Your team owns the agent on day 44.** — _why:_ same three-beat structure, starts with the number (fingerprint 5: "Days, not weeks" leads with the concrete). Replaces the false "We built six to run our own company" line with a verifiable timeline. Day 44 = 14 + 30.

**Slot: Primary CTA** (must point to Cal.com)

- A. **Book a 15-min call** — _why:_ matches the cal.com `/15min` slug, names the time cost. Echoes Studio's "Book a Free Call" — same intent, stripped of "Free" since the agent product is not free-sample-first.
- ★ B. **Book a call** — _why:_ Studio's CTA is "Book a Free Call" — that precision and directness is the right register. "Book a call" is shorter, same register, appropriate for a paid-project context.

**Slot: Ghost CTA**

- A. **See the work** — _why:_ echoes Studio gallery "Real brands, real shoots." Honest, no fluff.
- ★ B. **See the roster** — _why:_ homepage primary purpose is the agent product. Ghost CTA should anchor to the roster section (`#home-roster-h2`), not the parallel Studio service. "See the roster" is three words, subject-verb-object.

---

## Section 02 — Thesis

**Slot: Bar header** (the right-side label next to "[ 02 ] The thesis")

- ★ A. **What you get** — _why:_ service-direct register — answers the client question. Echoes the Studio process section, which never asks "Why do we exist?" — it just shows you the steps.
- B. **How it works** — _why:_ directly mirrors Studio's "How It Works" section header. Works here too.

**Slot: Rail — struck-through quote** (left column, "The standard pitch")

Keep current: _"Hand us six weeks and a discovery deck."_ — accurate, in voice.

**Slot: Rail counter** (CRITICAL — current line is false; implies agents were pre-built and priced after production)

Current: _"Most 'AI consultancies' sell decks. We sell agents that ran in production for a month before we put a price on them."_

- A. **Most "AI consultancies" sell decks and pilots. We design one agent for your business, build it in 14 days, run it in your stack for 30, then hand it to your team.** — _why:_ four verbs in order. Kills the pre-built implication outright.
- ★ B. **Most "AI consultancies" sell a deck. We build one agent for your business — in your stack, on your data. You own it on day 44.** — _why:_ "those were tools. This is a service." structure (fingerprint 3). Short first sentence. Short second. One number. The phrase "in your stack, on your data" is the Studio equivalent of "ready for Myntra, Amazon, or your Shopify" (fingerprint 2) — naming the client's actual environment.

**Slot: Position H2**

Current: _"We don't sell software. We sell agents that do the work — and a way to run them you'll still trust on month two."_

- A. **We don't sell software. We build one agent for your business — custom, in 14 days, handed back to you.** — _why:_ two sentences, period after "software" (fingerprint 3 structure), then the three-beat delivery in the second.
- ★ B. **We don't sell software, seats, or subscriptions. We build one custom agent for your business — and hand it back when the work is done.** — _why:_ explicitly kills the three wrong-category framings. "Hand it back when the work is done" echoes "ships it ready for Myntra, Amazon" (fingerprint 2) — a clear endpoint. Fixes "NOT true" #2.

**Slot: Pillar 01 body** (eyebrow "We build" / title "The agent." — keep both)

★ **We map your workflow, design the agent against it, and wire it to your tools. 14-day Strategy Sprint, fixed price. Live in your stack on day 14.** — _why:_ "We map… design… wire." Subject-verb chain. Echoes "Our team cleans backgrounds, stitches the garment, and builds the model map" (fingerprint 1). Ends with the number.

Alt: **Two weeks. We design the agent around your real workflow, wire it to your tools, and ship it live by day 14. Fixed price, no surprises.**

**Slot: Pillar 02 body** (eyebrow "You run" / title "The business." — keep both)

★ **30 days running in your stack while we watch the outputs, fix the edge cases, and tune the prompts. Your team owns the agent on day 44.** — _why:_ "we watch… fix… tune" mirrors the Studio process chain. Ends at a named day. Removes the false "Monday" handover reference.

Alt: **We run the agent in your stack for 30 days. We fix every edge case. On day 44, your team takes the keys — prompts, runbooks, on-call docs.**

**Slot: Pillar 03 body** (eyebrow "It compounds" / title "Across departments." — keep)

★ **Outreach feeds Strategy. Strategy feeds Marketing. Each new agent makes the existing ones sharper — that's the compounding most consultancies skip.** — _why:_ current ending "that's the unlock" is generic. "Compounding most consultancies skip" is the pointed competitive claim, consistent with the rail's framing.

**Slot: Bottom seal**

★ Keep: **Build → Run → Compound · End § 02** — already in the right voice register.

---

## Section 03 — Anatomy

**Slot: Eyebrow** (auto-numbered `[ 03 ]`)

★ Keep: **Anatomy of an agent** — already in voice.

**Slot: H2**

Current: _"One job, four moving parts."_

★ **One job. Four moving parts.** — _why:_ period > comma. Two declarative sentences. Matches fingerprint 3's short-sentence structure ("Because those were tools. This is a service.").

**Slot: Lede**

★ Keep: **Every agent we ship has the same shape — input, reasoning, output, review. The day a reviewer disagrees is the day the agent gets smarter.** — already in voice. The second sentence is the Studio FAQ's "honestly, it should be" moment — the honest, direct thing most companies won't say.

**Slot: Stage 01 — Input desc**

★ **A signal lands — Slack message, CRM update, scheduled trigger.** (current) — keep. Concrete noun list.

**Slot: Stage 02 — Reasoning desc**

Current: _"The agent reads the signal against memory + the runbook, and picks one of N actions."_

★ **The agent reads the signal against memory and the runbook, then picks one of N actions.** — drops the inline `+`, tightens the conjunction chain. One small edit, same slot.

**Slot: Stage 03 — Output desc**

★ Keep: **A draft, a memo, a row in Notion. Always reviewable. Never auto-published on day one.** — two-beat parallel, echoes "Days, not weeks." structure (fingerprint 5).

**Slot: Stage 04 — Review desc**

★ Keep: **A human reviewer signs off. Their corrections feed the next run's prompt.** — short declarative pair. In voice.

---

## Section 04 — Roster

**Slot: Eyebrow** (auto-numbered `[ 04 ]`)

★ Keep: **The Roster**

**Slot: H2**

Current: _"One agent per seat. built, not bought."_

- A. **One agent per role. Custom-built, not bought.** — _why:_ "per seat" implies SaaS seat pricing. "Per role" matches the project model.
- ★ B. **One agent per role. Built, not rented.** — _why:_ "rented" lands the SaaS rejection more sharply than "bought" — you can buy things outright, but renting implies recurring dependency. Echoes fingerprint 5's two-beat contrast structure. Fixes "NOT true" #2.

**Slot: Lede**

Current: _"Most clients start with one. By month four, three departments run on agents — and two more are scoped."_

- A. **Most engagements start with one agent. By month four, three departments are running on theirs.** — _why:_ "engagements" is more accurate for the project model.
- ★ B. **Start with the one that's costing you the most time. Add the next when that one's earning its keep.** — _why:_ action imperative opening ("Start with the one…") echoes Studio's "Share your product photos" (fingerprint 1). "Earning its keep" is Rahul's idiom. Removes the synthetic stat. No bundle-selling claim needed here — the two-sentence structure implies it.

**Slot: Roster index bar**

Current: _"Roster · 06 agents in production · Hover to inspect →"_

★ **Roster · 06 builds in flight · Hover to inspect →** — _why:_ "in production" implies client deployments running today, which may not be true for all six. "In flight" is honest about active development. One word change.

**Per-card rewrites** (agent names locked; capabilities are illustrative)

#### Outreach

★ Sub: **Reads the signal — who raised, who hired, who shipped — then writes the opener a human would actually reply to.** — _why:_ "Reads the signal" is an action opener. The triplet "who raised, who hired, who shipped" is the sharpest concrete in the product corpus. "A human would actually reply to" is the Studio FAQ register: honest, a little self-deprecating, true.

Capabilities:

- Signal-driven cold one-liners
- Reply triage and follow-up timing
- Account list refresh on trigger

#### CEO (sublabel: Strategy & Decisions)

★ Sub: **Reads what every other agent produced this week. Writes the one memo that tells you what moved, what stalled, and what to try next.** — _why:_ "Reads… Writes." Two-verb structure. "The one memo" echoes fingerprint 4's "without booking a shoot" — it names what you get and eliminates the alternative (20 memos).

Capabilities:

- Daily cross-team briefings
- Goal vs. reality tracking
- Task delegation by department

#### Marketing

★ Sub: **Reads what converted, what didn't, and drafts the next experiment before your standup.** — _why:_ three-verb chain, ending with a time anchor ("before your standup") that echoes "Days, not weeks." (fingerprint 5) — concrete timeline beats vague promise.

Capabilities:

- Channel performance synthesis
- Ad copy variants from receipts
- Landing-page CRO suggestions

#### Creatives

★ Sub: **Takes a flat product photo and turns it into a styled editorial shot — brand-locked, alt-tagged, sized for every channel.** — _why:_ "Takes… turns." Exactly the Studio process step pattern (fingerprint 2: takes your photo, delivers the ready asset). Names three output properties instead of one.

Capabilities:

- Brief to on-model image
- Brand-locked prompt scaffolds
- Asset versioning and QA

#### Research

★ Sub: **Monitors competitors, reads the market, and writes a one-page brief instead of a 40-page report.** — _why:_ "instead of a 40-page report" is the homepage equivalent of "without booking a shoot" (fingerprint 4). Names what you skip. The number 40 makes it concrete.

Capabilities:

- Discovery call to one-page brief
- Competitor teardown
- Source citations, every time

#### Finance

★ Sub: **Reads the bank feed, reconciles the invoices, and asks you one question a week — not twenty.** — _why:_ current copy is already close. "Not twenty" is the two-beat contrast (fingerprint 5). One word change from current.

Capabilities:

- Invoice reconciliation
- GST and TDS prep
- Cash runway projections

**Slot: Footer ledger row**

★ Keep: **Outreach · CEO · Marketing · Creatives · Research · Finance** with **More on the way** on the right.

---

## Section 05 — Toolkit

**Slot: Eyebrow** (auto-numbered `[ 05 ]`)

★ Keep: **How we work, in public** — already in voice.

**Slot: H2**

★ Keep: **The toolkit is open. even the parts we sell.** — "even the parts we sell" is the Studio FAQ equivalent: the honest thing most companies won't say. Do not soften it.

**Slot: Lede**

★ Keep: **The exact tools we use, the prompts and SOPs in production, and the things we got wrong. All published, no email gate.** — "no email gate" is the crisp commitment. "Things we got wrong" is the Studio FAQ honesty register. Already in voice.

**Tile 01 — App Vault**

★ Sub: **The 32 tools we run on.** — _why:_ "run on" is more declarative than "actually use." Short. Action verb.

**Tile 02 — Prompt Hub**

★ Sub: **Prompts, SOPs, skills — in production.** — _why:_ the em-dash makes "in production" land as a status stamp, not a modifier. Echoes "then ships it ready for Myntra" (fingerprint 2) — the "in production" claim is the delivery proof.

**Tile 03 — Field Notes**

★ Sub: **What worked. What we got wrong.** — _why:_ two-beat parallel, period-stopped. Fingerprint 5 structure. Keep.

---

## Section 06 — Pricing

**Slot: Eyebrow** (auto-numbered `[ 06 ]`)

★ Keep: **How we engage**

**Slot: H2**

Current: _"Two ways in. fixed prices. no retainers we wouldn't pay ourselves."_

- A. **Two ways in. Fixed prices. No monthly retainers.** — _why:_ clean and short.
- ★ B. **Two ways in. Fixed prices. One project, one number.** — _why:_ "one project, one number" kills the SaaS implication and the retainer implication simultaneously. It is the pricing equivalent of "This is a service" (fingerprint 3) — reframes the category in one phrase.

**Tier 01 — Strategy Sprint** (name locked)

★ Sub: **Two weeks to find where AI pays off in your business — and ship the first agent into your stack.** — _why:_ current sub says "map where AI actually pays off… and what to build first." The Strategy Sprint _does_ ship one agent (it's in the includes list). The sub should commit to the ship, not stop at the map. Echoes fingerprint 2: "ships it ready for [destination]."

Includes list (declarative noun-first, 7 items):

1. Discovery — what to build, what to skip
2. Architecture — system design and integration map
3. Risk brief — failure modes and on-call plan
4. One agent shipped, live in your stack
5. 90-day roadmap, ranked by impact
6. 90-min handoff — your team owns it from day one
7. Slack on-call for two weeks after

★ CTA: **Email to start** — _why:_ current label is correct in register. Keeps the mailto action. Do not change to "Email Rahul" — the email goes to `hello@nexailabs.com`, not Rahul's personal address; naming him is misleading.

**Tier 02 — Build & Implementation** (name locked)

★ Sub: **Full agent system — designed, built, deployed, and running in your stack for 30 days. Your team owns it on day 44.** — _why:_ replaces "stewarded into production" (vague) with the named 30-day window and the day-44 handover. "Your team owns it on day 44" is the homepage's consistent endpoint — it appears in Hero, Pillar 02, and now Pricing. Repetition is intentional.

Includes list (declarative noun-first, 7 items):

1. Full agent system — design, build, deploy
2. Integrations — your data, your tools, your auth
3. Test and production — load, edge cases, observability
4. 30 days running in your stack, supervised
5. Performance review — what worked, what to fix
6. 90 days of bug fixes and drift correction
7. Documented seams — your team can extend it

★ CTA: **Book a call** — _why:_ matches the Hero primary CTA; points to Cal.com (`site.bookingUrl`); consistent with Studio's "Book a Free Call" register. Replaces "Reach Us" which is hand-wavy. Component already wires `data-open-cal` to the Cal.com URL.

---

## Recommended set (final-locked spec)

| Section    | Slot                | Recommended copy                                                                                                                                    |
| ---------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01 Hero    | Eyebrow             | Custom AI agents for your business.                                                                                                                 |
| 01 Hero    | Headline            | `AI agents for [Outreach / Marketing / Finance / Research / Strategy / Creatives].` (no change)                                                     |
| 01 Hero    | Subtext             | 14-day sprint to design and ship. 30 days running in your stack. Your team owns the agent on day 44.                                                |
| 01 Hero    | Primary CTA         | Book a call → cal.com/rahul-juneja/15min                                                                                                            |
| 01 Hero    | Ghost CTA           | See the roster → `#home-roster-h2`                                                                                                                  |
| 02 Thesis  | Bar header right    | What you get                                                                                                                                        |
| 02 Thesis  | Rail counter        | Most "AI consultancies" sell a deck. We build one agent for your business — in your stack, on your data. You own it on day 44.                      |
| 02 Thesis  | Position H2         | We don't sell software, seats, or subscriptions. We build one custom agent for your business — and hand it back when the work is done.              |
| 02 Thesis  | Pillar 01 body      | We map your workflow, design the agent against it, and wire it to your tools. 14-day Strategy Sprint, fixed price. Live in your stack on day 14.    |
| 02 Thesis  | Pillar 02 body      | 30 days running in your stack while we watch the outputs, fix the edge cases, and tune the prompts. Your team owns the agent on day 44.             |
| 02 Thesis  | Pillar 03 body      | Outreach feeds Strategy. Strategy feeds Marketing. Each new agent makes the existing ones sharper — that's the compounding most consultancies skip. |
| 03 Anatomy | H2                  | One job. Four moving parts.                                                                                                                         |
| 03 Anatomy | Lede                | (keep current)                                                                                                                                      |
| 03 Anatomy | Stage 02 desc       | The agent reads the signal against memory and the runbook, then picks one of N actions.                                                             |
| 04 Roster  | H2                  | One agent per role. Built, not rented.                                                                                                              |
| 04 Roster  | Lede                | Start with the one that's costing you the most time. Add the next when that one's earning its keep.                                                 |
| 04 Roster  | Index bar           | Roster · 06 builds in flight · Hover to inspect →                                                                                                   |
| 04 Roster  | Outreach sub        | Reads the signal — who raised, who hired, who shipped — then writes the opener a human would actually reply to.                                     |
| 04 Roster  | CEO sub             | Reads what every other agent produced this week. Writes the one memo that tells you what moved, what stalled, and what to try next.                 |
| 04 Roster  | Marketing sub       | Reads what converted, what didn't, and drafts the next experiment before your standup.                                                              |
| 04 Roster  | Creatives sub       | Takes a flat product photo and turns it into a styled editorial shot — brand-locked, alt-tagged, sized for every channel.                           |
| 04 Roster  | Research sub        | Monitors competitors, reads the market, and writes a one-page brief instead of a 40-page report.                                                    |
| 04 Roster  | Finance sub         | Reads the bank feed, reconciles the invoices, and asks you one question a week — not twenty.                                                        |
| 05 Toolkit | App Vault sub       | The 32 tools we run on.                                                                                                                             |
| 05 Toolkit | Prompt Hub sub      | Prompts, SOPs, skills — in production.                                                                                                              |
| 05 Toolkit | Field Notes sub     | (keep) What worked. What we got wrong.                                                                                                              |
| 06 Pricing | H2                  | Two ways in. Fixed prices. One project, one number.                                                                                                 |
| 06 Pricing | Strategy Sprint sub | Two weeks to find where AI pays off in your business — and ship the first agent into your stack.                                                    |
| 06 Pricing | Strategy Sprint CTA | Email to start                                                                                                                                      |
| 06 Pricing | Build & Impl sub    | Full agent system — designed, built, deployed, and running in your stack for 30 days. Your team owns it on day 44.                                  |
| 06 Pricing | Build & Impl CTA    | Book a call                                                                                                                                         |

---

## Diff against current copy

| Section    | Slot                | Current                                                                                                               | Recommended                                                                                                                                          | Why changed                                                                                                                                                                                                                |
| ---------- | ------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01 Hero    | Eyebrow             | Six agents. One company. Three humans.                                                                                | **Custom AI agents for your business.**                                                                                                              | **Fixes "NOT true" #1.** Current claim anchors to "six agents we built for ourselves" — false. New eyebrow states the product (custom AI agents) and the recipient (your business). Noun-prep-noun pattern Rahul approved. |
| 01 Hero    | Subtext             | We built six to run our own company. We'll build yours next — live in your stack on day 14.                           | **14-day sprint to design and ship. 30 days running in your stack. Your team owns the agent on day 44.**                                             | **Fixes "NOT true" #1 + #3.** Removes the false "we built six" claim and the implicit pre-built framing. Replaces with the real three-beat timeline (14 days + 30 days = day 44).                                          |
| 01 Hero    | Primary CTA         | Book a Call                                                                                                           | **Book a call**                                                                                                                                      | Minor: lowercase "call" matches Studio's register ("Book a Free Call"). Same length, cleaner.                                                                                                                              |
| 01 Hero    | Ghost CTA           | See Our Work → /studio                                                                                                | **See the roster → #home-roster-h2**                                                                                                                 | Homepage primary purpose is the agent product. Ghost CTA should anchor to the roster, not the parallel Studio service. Studio belongs in nav.                                                                              |
| 02 Thesis  | Bar header right    | Why we exist                                                                                                          | **What you get**                                                                                                                                     | Service-direct register. Answers the client question, not the brand question.                                                                                                                                              |
| 02 Thesis  | Rail counter        | Most "AI consultancies" sell decks. We sell agents that ran in production for a month before we put a price on them.  | **Most "AI consultancies" sell a deck. We build one agent for your business — in your stack, on your data. You own it on day 44.**                   | **Fixes "NOT true" #3.** Current line implies pre-built agents were priced after running in production. False. New line uses "This is a service" reframe structure (fingerprint 3).                                        |
| 02 Thesis  | Position H2         | We don't sell software. We sell agents that do the work — and a way to run them you'll still trust on month two.      | **We don't sell software, seats, or subscriptions. We build one custom agent for your business — and hand it back when the work is done.**           | **Fixes "NOT true" #2.** Explicitly rejects the SaaS/seat/subscription category. "Hand it back when the work is done" is a concrete endpoint vs. vague "trust on month two."                                               |
| 02 Thesis  | Pillar 01 body      | Prompts, runbooks, integrations, the daily review window. Two-week sprint, fixed price. Live in your stack on day 14. | **We map your workflow, design the agent against it, and wire it to your tools. 14-day Strategy Sprint, fixed price. Live in your stack on day 14.** | Adds a subject-verb chain opener (fingerprint 1 pattern). Uses the locked tier name "Strategy Sprint." Adds "map your workflow" as the first phase.                                                                        |
| 02 Thesis  | Pillar 02 body      | Your team owns the agent on Monday. We document the seams, train your reviewers, and stay on Slack for edge cases.    | **30 days running in your stack while we watch the outputs, fix the edge cases, and tune the prompts. Your team owns the agent on day 44.**          | **Fixes "NOT true" #3.** "Owns it on Monday" is undefined. New version names the 30-day window and day-44 handover, consistent with Hero and Pricing.                                                                      |
| 02 Thesis  | Pillar 03 body      | …that's the unlock.                                                                                                   | **…that's the compounding most consultancies skip.**                                                                                                 | "The unlock" is generic SaaS-speak. "Compounding most consultancies skip" is the pointed competitive claim consistent with the rail's framing.                                                                             |
| 03 Anatomy | H2                  | One job, four moving parts.                                                                                           | **One job. Four moving parts.**                                                                                                                      | Period > comma. Two declarative sentences. Fingerprint 3 structure.                                                                                                                                                        |
| 03 Anatomy | Stage 02 desc       | …memory + the runbook, and picks…                                                                                     | **…memory and the runbook, then picks…**                                                                                                             | Drops inline `+`. Cleaner conjunction chain.                                                                                                                                                                               |
| 04 Roster  | H2                  | One agent per seat. built, not bought.                                                                                | **One agent per role. Built, not rented.**                                                                                                           | **Fixes "NOT true" #2.** "Per seat" implies SaaS seat-pricing. "Per role" matches the project model. "Rented" lands the SaaS rejection sharper than "bought."                                                              |
| 04 Roster  | Lede                | Most clients start with one. By month four, three departments run on agents — and two more are scoped.                | **Start with the one that's costing you the most time. Add the next when that one's earning its keep.**                                              | Action imperative opening. Removes the synthetic stat. "Earning its keep" is Rahul's idiom.                                                                                                                                |
| 04 Roster  | Index bar           | Roster · 06 agents in production · Hover to inspect →                                                                 | **Roster · 06 builds in flight · Hover to inspect →**                                                                                                | "In production" implies client deployments running today. "In flight" is honest about active development.                                                                                                                  |
| 04 Roster  | Outreach sub        | Synthesizes signals across the web and writes opening lines a human would actually reply to.                          | **Reads the signal — who raised, who hired, who shipped — then writes the opener a human would actually reply to.**                                  | Action opener. "Who raised, who hired, who shipped" triplet is the strongest concrete in the agent product corpus.                                                                                                         |
| 04 Roster  | CEO sub             | Synthesizes what's happening across every team and surfaces the one thing that needs your attention.                  | **Reads what every other agent produced this week. Writes the one memo that tells you what moved, what stalled, and what to try next.**              | "The one memo" eliminates the alternative (fingerprint 4 pattern). Concrete, dated.                                                                                                                                        |
| 04 Roster  | Marketing sub       | Reads what's converting, what's not, and writes the next experiment before the standup.                               | **Reads what converted, what didn't, and drafts the next experiment before your standup.**                                                           | Minor tightening. Past tense on the reads ("converted / didn't") is crisper. "Your standup" is more direct than "the standup."                                                                                             |
| 04 Roster  | Creatives sub       | Turns a brand brief and a flat product photo into a styled editorial shot — at the volume your studio actually needs. | **Takes a flat product photo and turns it into a styled editorial shot — brand-locked, alt-tagged, sized for every channel.**                        | Names three output properties (fingerprint 2: "ships it ready for…"). Removes "at the volume your studio actually needs" which implies a volume play we haven't proven.                                                    |
| 04 Roster  | Research sub        | A junior analyst that never sleeps, never forgets a source, and writes one-page briefs you trust by month two.        | **Monitors competitors, reads the market, and writes a one-page brief instead of a 40-page report.**                                                 | "Instead of a 40-page report" is fingerprint 4 ("without booking a shoot") — names what you skip. The number 40 is concrete. Removes the unverifiable "trust by month two."                                                |
| 04 Roster  | Finance sub         | Reads the bank feed, reconciles invoices, and asks the founder one question a week — never twenty.                    | **Reads the bank feed, reconciles the invoices, and asks you one question a week — not twenty.**                                                     | "Not twenty" is the two-beat contrast (fingerprint 5). "You" is more direct than "the founder." One edit.                                                                                                                  |
| 05 Toolkit | App Vault sub       | The 32 tools we actually use.                                                                                         | **The 32 tools we run on.**                                                                                                                          | "Run on" is more declarative than "actually use." Same length, higher confidence.                                                                                                                                          |
| 05 Toolkit | Prompt Hub sub      | Prompts, SOPs, skills in production.                                                                                  | **Prompts, SOPs, skills — in production.**                                                                                                           | Em-dash makes "in production" land as a status stamp (fingerprint 2 pattern).                                                                                                                                              |
| 06 Pricing | H2                  | Two ways in. fixed prices. no retainers we wouldn't pay ourselves.                                                    | **Two ways in. Fixed prices. One project, one number.**                                                                                              | "One project, one number" is the project-pricing reframe (fingerprint 3 structure). Kills SaaS and retainer implications in five words.                                                                                    |
| 06 Pricing | Strategy Sprint sub | Two weeks to map where AI actually pays off in your business — and what to build first.                               | **Two weeks to find where AI pays off in your business — and ship the first agent into your stack.**                                                 | Strategy Sprint ships an agent (it's in the includes list). Sub should commit to the ship. "Ship the first agent into your stack" echoes fingerprint 2's "ships it ready for [destination]."                               |
| 06 Pricing | Build & Impl sub    | Full agent system — designed, built, deployed, and stewarded into production.                                         | **Full agent system — designed, built, deployed, and running in your stack for 30 days. Your team owns it on day 44.**                               | "Stewarded into production" is vague. New version names the 30-day window and the day-44 handover. Consistent with Hero and Pillar 02.                                                                                     |
| 06 Pricing | Build & Impl CTA    | Reach Us                                                                                                              | **Book a call**                                                                                                                                      | "Reach Us" is hand-wavy. "Book a call" names the action, matches the Hero CTA, and lands on the Cal.com URL the component already uses.                                                                                    |

**Rows that fix the three "NOT true" claims** are bolded above: Hero Eyebrow, Hero Subtext, Thesis Rail Counter, Thesis Position H2, Thesis Pillar 02 body, Roster H2.

---

## Implementation notes

- All copy lives in `src/data/home.ts`, `HomeHero.astro`, `HomeThesis.astro`, `HomeAnatomy.astro`, `HomeRoster.astro`, `HomeToolkit.astro`, `HomePricing.astro`. No layout changes required.
- Hero ghost CTA href: `/studio` → `#home-roster-h2`.
- Pricing Build CTA label: "Reach Us" → "Book a call". Href is already `site.bookingUrl` — no URL change.
- Strategy Sprint CTA remains mailto. Label stays "Email to start".
- No banned words anywhere in the recommended set: no "powerful," "robust," "leverage," "seamless," "cutting-edge," "world-class," "AI-powered," "simply," "just."
- No emojis. Mono-font usage unchanged (price units only, per typography policy).
