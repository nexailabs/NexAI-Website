# Shared brief — read this before writing a single line

Every candidate agent reads **this file** plus the current copy at
[`../homepage-copy.md`](../homepage-copy.md). This is the only context held constant across
the bake-off. Do not invent facts that contradict it.

---

## 1. What NexAI Labs does (the one thing)

NexAI Labs builds custom AI agents that **run a business function for you** — sales, social,
creatives, operations, strategy, research, finance. Not chatbots, not dashboards, not decks.
Agents that do the work, with a human review step, shipped into the client's own stack.

The wedge: **"We sell agents that ran in production for a month before we put a price on them."**
(That sentence is good. The *month* reference violates the no-time-commitments rule — keep the
spirit, drop the clock.)

## 2. Who reads the homepage (ICP)

- **Primary:** founders and operators at funded startups (Seed–Series B) and growing D2C/brands.
  They run the business day-to-day and feel the cost of work that should be automated.
- **They are problem-aware, not solution-aware.** They know "AI could help" but have been
  burned by consultancies that sell slide decks and pilots that never ship.
- **The decision-maker is the reader.** No procurement committee. Write to one smart, busy person.

## 3. Positioning (what makes us not-a-consultancy)

- We ship **working agents**, not strategy decks. Live in your stack, doing real work.
- **Human-in-the-loop by design.** Nothing auto-publishes on day one. A reviewer signs off;
  their corrections make the next run smarter. (This is the trust story — lean on it.)
- **Fixed price, two ways in.** Strategy Sprint (map + one agent shipped) and
  Build & Implementation (full agent system). No open-ended retainers.
- **Open toolkit.** We publish the tools, prompts, and SOPs we use — even the parts we sell.
- **Agents compound.** Each new agent makes the others smarter (shared memory, cross-team signal).

## 4. Voice rules (the house style — non-negotiable)

- **First principles, not analogy.** Say the actual thing. If you can't name it, you don't
  understand it yet.
- **Concrete nouns and numbers over adjectives.** "32 tools, one page" beats "a comprehensive toolkit."
- **No hedging.** State the position, then the trade-off. Never trail off.
- **Casual and simple.** Short sentences. A smart friend explaining, not a brand shouting.
- **Free value over CTA pressure.** Teach the reader something true and useful. Earn the click;
  don't beg for it. CTAs should feel like an open door, not a closing pitch.
- **Clarity over cleverness for short labels** (nav, tooltips, captions). Save rhythm and wordplay
  for hero headlines.

## 4.1 Refinements (learned from review — apply on every surface)

- **Proof over credentials.** A claim is earned by *evidence*, not by who made it. "Written by the
  founders" / "a founder wrote it" is a credential, and this ICP discounts credentials — it is NOT a
  reason something is good. The real reason is proof: it **ran in production / was tested on real
  work before we published it / produced a result.** Lead with the evidence, not the author.
- **No plumbing in the copy.** Don't name internal infrastructure or vendors — payment processors
  (e.g. **Razorpay**), hosting, model providers, internal tool names — in hero/marketing copy unless
  that vendor *is* the selling point. "Some free, some paid" is fine; "paid via Razorpay" is noise
  the buyer doesn't care about.
- **Sharpen, don't contort.** If the original line is already true and clean, "improving" it means
  making it tighter or more concrete — not bending it into a clever phrase that reads worse.
  ("runs on its own agents" was a contortion of a fine line.) When tempted to be clever, check it
  against the plain version and keep whichever a skeptic respects more.

## 5. Hard constraints (a rewrite that breaks these is disqualified)

1. **No time commitments.** Strip every clock and calendar promise. Banned patterns include:
   "two weeks", "day 14", "by month four", "by month two", "30 days", "next 90 days",
   "for two weeks after", "month two", "live on day 14", "owns it on Monday".
   Sell the *outcome and the order* (build → run → compound), never the timeline.
2. **No fluff adjectives.** Banned: powerful, best-in-class, leverage, robust, seamless,
   cutting-edge, AI-powered, revolutionary, game-changing, supercharge, elevate, empower,
   world-class, next-gen, transform(ative), synergy, frictionless, turnkey.
3. **One canonical roster of 6 agents.** Right now the **Hero** lists
   `Sales · Social · Creatives · Operations · CEO · Research` and the **Roster section** lists
   `Outreach · CEO · Marketing · Creatives · Research · Finance`. Two different promises on one
   page. **Pick one set of 6 and use it everywhere** (hero rotating words, orbit cards, roster).
   State your chosen set at the top of your run and justify it in one line.
4. **No invented metrics that read as claims.** The orbit-card demo numbers (pipeline $2.4M, QA 94,
   ₹84K LTV) are illustrative *demo* content and may stay as demo content. Do not add new
   company-performance claims ("trusted by 200 brands") that aren't true.
5. **Don't break real links.** CTAs map to Cal.com booking or `mailto:`. The hero ghost CTA
   currently points at a stale `#how` anchor — retarget it to a section that exists
   (e.g. the Anatomy or Thesis section) or change the label.

## 6. The job

Produce a **full homepage copy rewrite**, section by section, in the **same structure and order
as `../homepage-copy.md`** (Metadata → Hero → 6 orbit cards → Thesis → Anatomy → Roster →
Toolkit → Pricing → Studio pill). For each string, give the new copy. Where you change intent
(not just words), add a one-line *why* in italics beneath it.

Resolve the flagged anomalies in `homepage-copy.md` §9 as part of the rewrite — especially the
roster mismatch, the time-commitment strings, and the weak hero subtext (four empty verbs:
"understand, design, develop, train").

## 7. Output contract

- Write to `runs/<your-candidate-number-and-name>.md`.
- Start with: your chosen 6-agent roster + a 2-line statement of the angle you took.
- Mirror the section headings of `homepage-copy.md` so the four runs diff cleanly.
- Keep the brand/demo facts; change the **words and the frame**, not the product.
- End with a 5-line "what I'd A/B test next" note.
