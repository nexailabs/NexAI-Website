# Run 03 — Founder / NO-BS (Hero + Sales card only)

**Angle:** Drop the four empty verbs and the "autopilot" gloss. State the actual thing — agents that run a business function, with a human sign-off — then prove it inside the hero with a live demo, not a promise.
**Canonical 6-agent roster (Hero set):** `Sales · Social · Creatives · Operations · CEO · Research` — chosen because these are the cards that actually run in the orbit demo on this page; the roster should name what the visitor can click and watch, not a second list they never see.

---

## 1. Hero section

**`src/components/home/HomeHero.astro` + `src/data/home.ts`**

- **Eyebrow** (teal uppercase): `Agents that do the work`
  - *Why: "Your business on autopilot" is the exact claim a burned buyer distrusts — autopilot implies no one's watching, and our whole pitch is that someone is. State what we ship instead.*
- **Headline static prefix:** `AI agents for`
- **Rotating words** (driven by the orbit's active agent): `Sales`, `Social`, `Creatives`, `Operations`, `CEO`, `Research`
- **Headline trailing char:** `.`
- **Subtext / lede:** `Not chatbots or dashboards. Agents that run one job in your own stack — and don't publish anything until a human signs off.`
  - *Why: replaces "understand, design, develop, train" (four verbs that say nothing). One concrete sentence: what it isn't, where it lives, the trust mechanism. A stranger gets it in one read.*
- **Primary CTA:** `See it run for my business` → opens Cal.com booking widget
  - *Why: "Build My Agent" is fine, but the free-value frame is "watch it work first." The open door beats the imperative.*
- **Ghost CTA:** `Take an agent apart` → anchors to `#anatomy` (the Anatomy section)
  - *Why: the live `#how` anchor is stale. The Anatomy section exists and literally shows the four moving parts — retarget there and let the label promise the payoff.*

---

## 2. Sales agent card

**`src/data/home.ts` (Sales agent definition + cardState)**

- **Card title:** `Sales`
- **Role:** `Pipeline & outreach`
- **Description (off-screen, SEO/aria):** `Finds leads, drafts the cold open, qualifies inbound, books the meeting — you confirm.`
  - *Why: "closes the room" is hype we can't defend; the demo's real action is booking a meeting you confirm. Name the actual step and keep the human in it.*
- **Status badge:** `BOOKING A MEETING`
- **Chart label:** `Pipeline · $2.4M` · **trend:** `↑ 34% WoW`
  - *(Illustrative demo figures — kept as-is per brief §5.4.)*
- **Workflow steps:**
  1. `New lead in CRM` — `Aria Sharma · Head of Growth, The Whole Truth` — DONE
  2. `Profile enriched` — `Series B · 80 employees · Mumbai` — DONE
  3. `Discovery call done` — `"We need AI photoshoots for our protein bar launch…"` — DONE · elapsed `3m42s`
  4. `Invite drafted — your call` — `Wed 12:30pm · 30 min` — CURRENT (needs you)
  - *Why: trimmed each step label to the state change (lead in, profile enriched, call done, draft waiting). Step 4 names the human gate in the label itself, which is the trust story working visually.*
- **Action buttons:** `Confirm meeting` (primary) / `Reschedule` (ghost)
- **Reschedule path — "Checking calendar" text:** `3 open slots`
- **Reschedule slot pills:**
  - `Thu 10:00am` — `30 min · same agenda`
  - `Thu 3:00pm` — `45 min · w/ co-founder`
  - `Fri 11:00am` — `30 min · post product demo`
- **Confirm-button morphed label after click:** `Booked`
- **Post-confirm cascade:**
  - `Confirmation sent` — `aria@thewholetruthfoods.com`
  - `Logged in your CRM` — `Pipeline +$24K`
  - *Why: "Saved to your CRM" → "Logged in your CRM" reports the state change in the same voice as the rest of the cascade. Demo figure kept.*
- **Cycle summary:** `Lead to booked, hands-off until your confirm`
  - *Why: "28m end-to-end" is a time commitment under §5.1. Sell the order and the single human checkpoint instead of the clock — and it's a stronger line anyway.*
- **Post-cycle CTA:** `Want this running your pipeline?` / `See it run for your business →`
  - *Why: drops "15-min call" (a time promise) and matches the hero's open-door verb. Same destination, no clock.*

---

## What I'd A/B test next

1. **Hero lede framing:** "Not chatbots or dashboards…" (define-by-negation) vs. a positive-only "Agents that run one job in your stack and wait for a human to sign off." — does naming the enemy help or sound defensive?
2. **Primary CTA:** `See it run for my business` vs. `Spec my first agent` — watch-first vs. commit-first intent.
3. **Cycle summary line:** the no-clock "hands-off until your confirm" vs. quietly restoring a speed signal as a non-promise ("one human checkpoint, the rest automatic") — does removing all time-feel cost perceived velocity?
4. **Step-4 label:** "Invite drafted — your call" vs. "Awaiting your confirm" — which reads more as control vs. more as a chore.
