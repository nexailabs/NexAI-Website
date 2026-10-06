# Run 02 — StoryBrand

**Angle:** You're the hero who wants to run the business, not run after it. NexAI is the guide with a plan you can trust — Build → Run → Compound — and proof you can read before you buy.
**Canonical 6-agent roster (used everywhere):** `Sales · Social · Creatives · Operations · CEO · Research` — these are the six the hero can actually *watch work* in the orbit demo, so the promise on the page matches the proof on the page.

---

## 1. Hero section

**`src/components/home/HomeHero.astro` + `src/data/home.ts`**

- **Eyebrow** (above headline, teal uppercase): `A guide for the work you can't get to`
  - *Why: the old eyebrow ("Your business on autopilot") made the product the hero. StoryBrand puts the reader's unmet work at the center and positions NexAI as the guide, not the autopilot.*
- **Headline static prefix:** `Get back to the business. Hand off`
  - *Why: leads with the hero's desire (run the business, not chase it) before naming the function, so the rotating word reads as relief, not a feature list.*
- **Rotating words** (cycle in italic, driven by the orbit's active agent): `Sales`, `Social`, `Creatives`, `Operations`, `CEO`, `Research`
- **Headline trailing char:** `.` (period after the rotating word)
- **Subtext / lede:** `You didn't start this to chase outreach, captions, and tickets. We build agents that do that work in your own stack — every one with a human sign-off before anything goes out — so the day-to-day runs and you don't.`
  - *Why: kills the four empty verbs ("understand, design, develop, train"). Names the stakes of staying stuck (chasing the work), the plan (agents in your stack), and the trust step (human sign-off) — guide showing empathy + authority.*
- **Primary CTA:** `Spec my first agent` → opens Cal.com booking widget
  - *Why: the direct CTA. "Spec my first agent" frames the call as the hero's first step on the plan, not a sales demo. Concrete, low-threat, action-owned-by-the-reader.*
- **Ghost CTA:** `See the plan` → anchors to the Thesis section (`#thesis`)
  - *Why: the transitional/soft CTA. Retargets the stale `#how` anchor to a real section. "See the plan" matches the SB7 beat — the guide has a plan (Build → Run → Compound) and lets the hero read it before committing.*

---

## 2. Sales agent card

**`src/data/home.ts` (Sales agent definition + cardState)**

- **Card title:** `Sales`
- **Role:** `Pipeline & Outreach`
- **Description (off-screen, for SEO/aria):** `Finds the leads, drafts the outreach, and books the meeting — you just say yes.`
  - *Why: reframes from product capabilities ("closes the room") to the hero's role in the loop (you say yes). Keeps the same demo facts.*
- **Status badge:** `BOOKING A MEETING FOR YOU`
  - *Why: adds "for you" so the badge reads as work lifted off the hero, not the agent showing off.*
- **Chart label:** `Pipeline · $2.4M` · **trend:** `↑ 34% WoW`
  - *(Unchanged — illustrative demo content per brief §5.4.)*
- **Workflow steps** (timeline shown above action buttons):
  1. `New lead landed in your CRM` — `Aria Sharma · Head of Growth, The Whole Truth` — DONE
     - *Why: "your CRM" — the work is happening in the hero's own stack, a core trust beat.*
  2. `Pulled Aria's background` — `Series B · 80 employees · Mumbai` — DONE
  3. `Discovery call, handled` — `"We need AI photoshoots for our protein bar launch…"` — DONE · elapsed `3m42s`
  4. `Meeting drafted — your call` — `Wed 12:30pm · 30 min · waiting on you` — CURRENT (needs you)
     - *Why: the human-in-the-loop moment is the hero's moment. "Your call / waiting on you" makes the sign-off feel like control, not a chore.*
- **Action buttons:** `Confirm meeting` (primary) / `Reschedule` (ghost)
- **Reschedule path — "Checking calendar" text:** `Found 3 times that work`
  - *Why: warmer, hero-facing phrasing over the clinical "3 open slots found."*
- **Reschedule slot pills:**
  - `Thu 10:00am` — `30 min · same agenda`
  - `Thu 3:00pm` — `45 min · w/ co-founder`
  - `Fri 11:00am` — `30 min · post product demo`
  - *(Unchanged — demo facts.)*
- **Confirm-button morphed label after click:** `Booked`
- **Post-confirm cascade** (fans in after Confirm click):
  - `Confirmation sent` — `aria@thewholetruthfoods.com`
  - `Logged to your CRM` — `Pipeline +$24K`
  - *Why: "Logged to your CRM" (was "Saved to your CRM") reinforces the work lives in the hero's own system.*
- **Cycle summary:** `Done — start to booked, hands-off`
  - *Why: removes the time commitment "28m end-to-end" (brief §5.1). Sells the outcome and the hands-off order instead of a clock.*
- **Post-cycle CTA:** `Picture this running your pipeline.` / `Spec your Sales Agent with NexAI →`
  - *Why: drops the "15-min call" time reference (brief §5.1). Casts the hero seeing themselves win ("picture this running your pipeline") then offers the first step on the plan.*

---

## What I'd A/B test next

1. **Hero prefix length:** `Get back to the business. Hand off [Sales].` vs. a tighter `Hand off the [Sales].` — does the desire-first framing beat the cleaner line on scroll depth?
2. **Primary CTA verb:** `Spec my first agent` vs. `Show me an agent` — ownership-framed action vs. lower-commitment "show me." Watch click-through to Cal.com.
3. **Ghost CTA label:** `See the plan` vs. `Read before you buy` — does naming the open-toolkit promise pull more than naming the plan?
4. **Sales cycle summary:** `Done — start to booked, hands-off` vs. `One lead, fully handled` — which closing line on the demo card drives more post-cycle CTA clicks without leaning on a timer.
