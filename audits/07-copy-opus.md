# 07 — Copy + Tone-of-Voice Audit (Opus)

**Auditor:** Claude (Opus 4.7, 1M)
**Date:** 2026-04-25
**Standard:** NO-BS Lens (`~/.claude/CLAUDE.md`, `~/Desktop/NexAI Labs/CEO/CLAUDE.md`)
**Scope:** All user-facing strings across home, prompts, apps, blog, studio, navbar, footer, 404, coming-soon.
**Headline finding:** The site has a real voice. It is not consistently applied. Roughly **70% on-brand, 25% drift, 5% pure brochure**. The drift is concentrated in two surfaces — the homepage hero and the homepage pricing block — both of which read like they were written by a different company than the one that wrote `HomeAnatomy.astro` or `signal-cold-one-liner`.

---

## 1. Voice definition

### What we are

- **Founder-direct.** A person who has shipped the thing is writing about the thing. First person plural ("we"), not third person ("the company").
- **Anti-hype.** Numbers, durations, named tools, named outputs. Not adjectives.
- **Opinionated, then qualified.** Make the call, then name the trade-off. Never trail off.
- **Specific noun > category.** "Maya joined Forge" not "team growth". "₹4 / commit" not "affordable pricing".
- **Commit-first.** Verdict in the first 6 words. Reasoning after.
- **Receipts, not promises.** "Ran in production for a month" beats "production-ready".

### What we are NOT

- Brochure-formal ("Strategic AI Use-Case Definition")
- Conference-stage ("the next layer of the NexAI stack")
- Hedged ("AI-powered photoshoots")
- Decorative ("Something's Brewing")
- Title-cased category lists pretending to be benefits
- Excited about the technology

### 5 anti-examples (banned from this site)

| #   | Banned phrase                                | Why it fails                                                                    | Where it appears                               |
| --- | -------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1   | "Building AI Agents for Businesses"          | Generic, no specific noun, sounds like a directory listing.                     | `site.ts:8` (description)                      |
| 2   | "Strategic AI Use-Case Definition"           | Title-cased pseudo-deliverable; can't picture what's in the file.               | `HomePricing.astro` (Strategy Sprint includes) |
| 3   | "the next layer of the NexAI stack"          | Phantom architecture, no noun a buyer can repeat.                               | `coming-soon.astro:21`                         |
| 4   | "Custom AI agents built for your workflow."  | Three filler words ("custom", "AI agents", "your workflow") and zero specifics. | `navigation.ts:10` (Agent Lab caption)         |
| 5   | "AI-powered photoshoots for fashion brands." | Banned word ("AI-powered") + generic.                                           | `navigation.ts:15` (Studio caption)            |

---

## 2. Page-family scorecard

Scores 1–5 (5 = on-brand). Lower in **jargon density** and **hedging frequency** is better.

| Page family                     | Voice (1–5) | Jargon density | Hedging | Sentence rhythm                                        | Headline scannability | Notes                                                                                                                           |
| ------------------------------- | ----------- | -------------- | ------- | ------------------------------------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Home Hero**                   | 2           | Medium         | Low     | Choppy (rotating word)                                 | High                  | "AI Agents as a Service" eyebrow betrays the whole thesis. Sub is good.                                                         |
| **Home Thesis**                 | **5**       | Low            | None    | Clean, two-state                                       | High                  | The model. "We don't sell software. We sell agents that did the work for a month before we put a price on them."                |
| **Home Anatomy**                | **5**       | Low            | None    | Punchy ("identifying specific noun → 'Maya Krishnan'") | High                  | Best section on the site. Demo carries voice.                                                                                   |
| **Home Roster**                 | 4           | Low            | None    | Tight                                                  | High                  | Cards are fine; "[ 04 ] The Roster" eyebrow collides with Toolkit.                                                              |
| **Home Toolkit**                | 4           | Low            | None    | Tight                                                  | High                  | "even the parts we sell" lands. Same `[ 04 ]` collision.                                                                        |
| **Home Pricing**                | **1**       | **High**       | None    | Marketing-deck cadence                                 | Medium                | Includes-list reads like a brochure. Tier names are corporate. CTA "Reach Us" is anemic.                                        |
| **Prompt Hub index**            | **5**       | Low            | None    | Strong                                                 | High                  | "Prompts that survived a month of real work." is template voice.                                                                |
| **Prompt Hub artifacts (data)** | **5**       | Low            | None    | Founder-tight                                          | High                  | `signal-cold-one-liner` is the most consistent block on the site. Treat as canon.                                               |
| **App Vault index**             | 4           | Low            | None    | Tight                                                  | High                  | "Curated, tested, written by us — not affiliate links." good.                                                                   |
| **App Vault tool entries**      | 4           | Low            | None    | Tight                                                  | High                  | `bestFeature`/`watchOut` cadence is reusable.                                                                                   |
| **Studio Hero**                 | 3           | Low            | None    | N/A (3 words)                                          | High                  | Just "NEXAI · STUDIO" + image stack. Visually carries. SEO H1 is a brochure line.                                               |
| **Studio FAQ**                  | **5**       | Low            | None    | Conversational                                         | High                  | The "tools vs service" answer is the voice in one paragraph.                                                                    |
| **Studio Process**              | 3           | Low            | Low     | OK                                                     | High                  | "We Handle the Prep" is fine; "AI Generates Your Shoot" is loud. Showcase intro "See the difference" is generic.                |
| **Studio CTA**                  | 3           | Low            | None    | OK                                                     | Medium                | "Launch your next collection without booking a shoot." → fine.                                                                  |
| **Blog index + six-agents.md**  | **5**       | Low            | None    | Founder essay                                          | High                  | Written like a person who runs the company.                                                                                     |
| **Footer**                      | 3           | Low            | None    | Fine                                                   | N/A                   | "AI Drops" caption is on-brand; product list is dry.                                                                            |
| **Navbar captions**             | **2**       | Medium         | None    | Marketing-deck                                         | N/A                   | "AI-powered photoshoots", "Custom AI agents", "AI tools we use and recommend" — three captions out of six need to be rewritten. |
| **404**                         | 3           | None           | Low     | Fine                                                   | High                  | Generic-fine. Could be funnier in voice.                                                                                        |
| **Coming-soon**                 | **1**       | Medium         | None    | Brochure                                               | Low                   | "Something's Brewing" + "next layer of the NexAI stack" + "get in before the queue" — all three lines are off.                  |

**Aggregate:** 6 page-families scoring **5**, 7 at **3–4**, 4 at **1–2**. The 1–2s are concentrated in the **front door** (hero, coming-soon, nav captions, pricing block) — the surfaces buyers hit first.

---

## 3. Top 10 weakest copy blocks (with rewrites)

Ranked by visibility × voice-drift severity.

### 1. Home hero eyebrow & site description

**File:** `src/data/home.ts:4`, `src/config/site.ts:8`
**Current:**

```
heroEyebrow = 'AI Agents as a Service'
description = 'Building AI Agents for Businesses'
```

**Why it fails:** "Agents as a Service" is brochure language, contradicts the thesis ("We don't sell software"). "Building AI Agents for Businesses" is a directory entry — three filler words, zero specifics.
**Rewrite (eyebrow):** `Six agents. One company. Three humans.`
or `Built, not bought · Live in 14 days`
**Rewrite (description / OG):** `Six AI agents we built to run our own company. We'll build yours next.`

### 2. Coming-soon page (every line)

**File:** `src/pages/coming-soon.astro:16–23`
**Current:**

```
IN THE PIPELINE
Something's Brewing
We're building the next layer of the NexAI stack.
Early access opens soon — get in before the queue.
```

**Why it fails:** "Something's Brewing" is a coffee-shop tagline. "Next layer of the NexAI stack" is phantom architecture. "Get in before the queue" implies a queue that does not exist.
**Rewrite:**

```
EYEBROW: Shipping next
HEAD:    Not ready to ship.
SUB:     Agent Lab, Prompt Hub, and App Vault are halfway through real
         client work. We publish here when one's been used by 10 teams.
         Drop your email if you want the link the day it lands.
CTA:     Tell me when it ships
```

(If you want to keep "Get Early Access", at least change the sub to name the bar — _"…opens once 10 teams have used it for a month."_)

### 3. Pricing tier "includes" lists

**File:** `src/components/home/HomePricing.astro:24–32, 42–50`
**Current (Strategy Sprint):**

```
Brand & Workflow Discovery
Strategic AI Use-Case Definition
Technical Feasibility Assessment
System Architecture Planning
Risk, Compliance & Reliability Review
Clear Roadmap & Execution Blueprint
1 Production-Ready Agent
```

**Why it fails:** Title-cased corporate-deck items. "Strategic AI Use-Case Definition" is meaningless to a founder. Every line could be on a Big-4 SOW. This is the single biggest tonal collapse on the site.
**Rewrite (Strategy Sprint, ₹4,249):**

```
2 hours of deep workflow audit (recorded, transcripted)
A map of where AI pays off in your stack — ranked by ROI
A 1-page architecture sketch the next eng can read
A list of what NOT to automate, and why
1 prompt or runbook we wrote for you, working on day 5
A 30-min handoff call before we send the invoice
```

**Rewrite (Build & Implementation, ₹18,699):**

```
1 production agent in your stack on day 14
Read-only data access in week 1; write access in week 3
Daily 15-min review window for the first two weeks
The full prompt library, runbooks, and SOPs in your repo
Slack support for 60 days after handoff
A teardown if it doesn't work — and your money back
```

### 4. Pricing CTA labels

**File:** `src/components/home/HomePricing.astro:23, 41`
**Current:** `"Email to start"` and `"Reach Us"`
**Why it fails:** "Reach Us" is the weakest CTA on the site. It's the _primary_ CTA on the _primary_ commercial page. "Reach" is what TV shows have. "Email to start" is fine but flat.
**Rewrite:** `"Email — we'll reply in 24h"` (outline) and `"Book the kickoff call"` (gradient).

### 5. Navbar caption: Agent Lab

**File:** `src/config/navigation.ts:10`
**Current:** `"Custom AI agents built for your workflow."`
**Why it fails:** Three filler words, zero specifics, hedged. "Custom" + "AI agents" + "your workflow" = fully meaningless.
**Rewrite:** `"Six agents we run on. Yours next."` or `"Outreach, Strategy, Finance — built for your stack."`

### 6. Navbar caption: NexAI Studio

**File:** `src/config/navigation.ts:15`
**Current:** `"AI-powered photoshoots for fashion brands."`
**Why it fails:** Banned word ("AI-powered"). Generic.
**Rewrite:** `"Mannequin → on-model in 3 days, 80% cheaper than a studio."`

### 7. Navbar caption: App Vault

**File:** `src/config/navigation.ts:27`
**Current:** `"The best AI tools we use and recommend."`
**Why it fails:** "The best" is unearned. "Use and recommend" is two verbs doing one job.
**Rewrite:** `"The 10 tools we run our company on — what each one replaced."`

### 8. Navbar caption: Catch Us

**File:** `src/config/navigation.ts:39`
**Current:** `"Let's talk — no pitch decks, just coffee."`
**Why it fails:** "Just coffee" is LinkedIn-bro, not founder-direct. Also, the link goes to `/coming-soon`, which is a contradiction.
**Rewrite:** `"15-minute call. We come with one question, you bring one."`
(And fix the link — either point at `cal.com` or rename it.)

### 9. Studio CTA copy

**File:** `src/components/StudioCTA.astro:13–17`
**Current:**

```
Launch your next collection without booking a shoot.
We'll show you samples from brands in your category — before you commit to anything.
```

**Why it fails:** First line is fine, second line is hedge-soup ("samples", "category", "commit to anything"). The "50+ brands" proof line below it works; the body line above it doesn't.
**Rewrite:**

```
Launch your next collection without a shoot day.
We'll send 6 samples in your category before you sign anything.
```

### 10. App Vault page title (H1)

**File:** `src/pages/apps/index.astro:22–28`
**Current:**

```
The stack we actually run on.
A short, opinionated catalog of the software we use every day.
What it is, why we picked it, what it replaced. Curated, tested,
written by us — not affiliate links.
```

**Why it fails:** Actually mostly fine — the only weakness is "Curated, tested" lands twice (also in the credit footer). Pick one location. Also "what it replaced" is the strongest hook and is buried; lead with it.
**Rewrite (H1 unchanged, sub):**

```
10 tools we run our company on. What each one replaced, what it cost,
and what we'd switch to if it died tomorrow. Not affiliate links.
```

---

## 4. Repeated phrases (tics)

These have become house-words and now read as filler. Audit them.

| Phrase                                     | Count | Files (sample)                                                                                                                    | Verdict                                                                                                          |
| ------------------------------------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **"actually"** as intensifier              | 8+    | `apps/index.astro` ("we actually run on"), `vault.ts` ("a CRM an agent can actually drive"), `home-pricing` (implied), studio FAQ | Keep 2, kill 6. Becomes a verbal tic.                                                                            |
| **"… that survived a month of real work"** | 3     | `prompts/index.astro` description, `PromptHubHero`, `ph-index__credit`                                                            | Excellent voice — but 3 instances on one page is over-quoting yourself. Use it as the page H1, then never again. |
| **"ran in production for a month"**        | 4     | `HomeThesis`, `promptHub.ts` ("it shipped real work for a month"), prompts empty state                                            | Same idea, 4 phrasings. Pick one canonical version and reuse verbatim.                                           |
| **"opinionated"**                          | 3     | `apps/index.astro` H1 sub, `vault-index__sub`, marketing-stack blurb                                                              | Trip-wire word. Two is character; three is performative.                                                         |
| **"in production"**                        | 6+    | thesis, anatomy, roster, vault, prompt hub                                                                                        | Fine — it's a noun, not a tic.                                                                                   |
| **"by us — not affiliate links"**          | 2     | `apps/index.astro` header sub, credit footer                                                                                      | Cut from the footer.                                                                                             |
| **"production-ready"**                     | 2     | pricing tier 1 + 2 includes                                                                                                       | Both instances are weak. Replace with a date or a state change.                                                  |
| **"the agent" (singular, generic)**        | many  | ubiquitous                                                                                                                        | Fine.                                                                                                            |
| **"the founder"**                          | 2     | promptHub `friday-strategy-memo` ("the founder reads with end-of-week tea")                                                       | Cute once.                                                                                                       |
| **Title-cased category-slop**              | many  | `HomePricing.astro` includes lists                                                                                                | Single biggest jargon source on the site.                                                                        |
| **"AI-powered"**                           | 1     | `navigation.ts:15`                                                                                                                | One is one too many. Banned word.                                                                                |

---

## 5. Headlines that should be one (or split)

### Should be ONE headline (currently two competing)

- **Studio Process section:** `"How It Works" + "Product to photoshoot. Days, not weeks."` (`StudioProcess.astro:16–17`). The H2 is filler — the sub is the actual headline. Drop "How It Works", promote the sub: `"Product in. Photoshoot out. Days, not weeks."`
- **Studio Showcase:** `"See the difference" + "Product in, photoshoot out. Pick a category to explore."` (`StudioShowcase.astro:25–26`). Same problem. "See the difference" is generic. Use: `"Same garment. Different category. Pick one."`

### Should be SPLIT (currently one headline carrying two ideas)

- **Home Pricing H2:** `"Two ways in. fixed prices. no retainers we wouldn't pay ourselves."` (`HomePricing.astro:60–63`). The "no retainers" idea is the actual differentiator and gets crammed into a sub-line. Lift it: `"Two ways in. (No retainers.)"` as H2, then put the price-promise as a one-liner under each card, e.g. _"Fixed price. Quoted in dollars. Paid in two installments."_

### Should be DELETED

- **Coming-soon "IN THE PIPELINE"** + **"Something's Brewing"**: pick one (kill both, replace per §3.2).
- **Studio FAQ H2:** `"Common Questions"` (`StudioFAQ.astro:17`). The eyebrow already says "Got questions?" — H2 is dead. Make it carry weight: `"What every founder asks before signing."`

---

## 6. Decorative vs convertible CTAs

Tracking every link/button on the homepage and primary product pages.

| CTA label                                | File                   | Verdict                                          | Suggested fix                                                                     |
| ---------------------------------------- | ---------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| **Book a Call**                          | navbar, footer, hero   | **Convertible.** Clear next step.                | Keep.                                                                             |
| **See Our Work**                         | hero                   | **Convertible** if it lands on Studio gallery.   | Keep — but rename to `"See real outputs"` since "work" is vague.                  |
| **Email to start**                       | pricing                | **Decorative.** Doesn't say what happens next.   | `"Email — reply in 24h"`                                                          |
| **Reach Us**                             | pricing                | **Decorative.** Vague verb.                      | `"Book the kickoff call"`                                                         |
| **Get Early Access**                     | coming-soon            | **Decorative.** No bar set.                      | `"Tell me when it ships"`                                                         |
| **Back to Home**                         | coming-soon, 404       | **Functional.** Fine.                            | Keep.                                                                             |
| **See all stacks →**                     | apps index             | **Decorative.** Anchor scrolls to the same page. | Drop or repoint.                                                                  |
| **Read take →**                          | every ToolTile         | **Convertible.** Specific and brand-tone.        | Keep.                                                                             |
| **See the stack →**                      | every StackCard        | **Convertible.**                                 | Keep.                                                                             |
| **Submit →** (Prompt Hub sidebar)        | prompts/index          | **Convertible.** Specific.                       | Keep.                                                                             |
| **Submit your own →** (Prompt Hub empty) | prompts/index          | **Convertible.**                                 | Keep.                                                                             |
| **Catch us** (Prompt Hub bottom CTA)     | `BottomCta.astro:16`   | **Decorative-ish.** Cute but ambiguous.          | `"Wire this into our agent"` matches the H3 promise.                              |
| **Read the playbook**                    | blog FeaturedPost      | **Convertible.** Better than "Read more".        | Keep.                                                                             |
| **Suggest a tool →**                     | App Vault empty        | **Convertible.**                                 | Keep.                                                                             |
| **How we pick →**                        | App Vault credit       | **Convertible.** Promises a specific page.       | Verify it lands on the actual "how we pick" post; otherwise kill.                 |
| **More on the way** (Roster footer)      | `HomeRoster.astro:165` | **Decorative.** No link, no date, no count.      | Either link to a roadmap or drop.                                                 |
| **Hover to inspect →**                   | Roster bar             | **Decorative + lying** on touch devices.         | Use `"Tap to expand"` on mobile / `"Hover for capabilities"` on desktop, or drop. |

**Pattern:** every "Learn more" / "Read more" / "Click here" verb is gone — good. The remaining decorative tells are all in the **commercial path** (pricing, coming-soon). That's the one place where decoration is most expensive.

---

## 7. Section eyebrows that contradict

The site uses bracketed numbered eyebrows (`[ 04 ] How we work, in public`) to signal section order. They are **out of sync**.

| Section          | File                   | Eyebrow as written                |
| ---------------- | ---------------------- | --------------------------------- |
| Home Thesis      | `HomeThesis.astro:42`  | `§ 02 · The thesis`               |
| Home Anatomy     | `HomeAnatomy.astro:37` | `Anatomy of an agent` (no number) |
| **Home Roster**  | `HomeRoster.astro:79`  | `[ 04 ] The Roster`               |
| **Home Toolkit** | `HomeToolkit.astro:37` | `[ 04 ] How we work, in public`   |
| Home Pricing     | `HomePricing.astro:58` | `[ 06 ] How we engage`            |

**Problems:**

1. **Roster and Toolkit both claim `[ 04 ]`.** This is the most concrete contradiction in the audit. One is wrong. Toolkit is rendered fourth on `index.astro` after Roster (Roster is the actual `[ 04 ]`). Toolkit should be `[ 05 ]`.
2. **Three different eyebrow grammars** are competing: `§ 02`, `[ 04 ]`, and a wordless `Anatomy of an agent`. Pick one. The bracketed-numeral form is the most distinct — extend it everywhere or drop it everywhere.
3. **Pricing is `[ 06 ]`** but only 5 sections exist (Hero is implicit `[ 01 ]`, Thesis `[ 02 ]`, Anatomy `[ 03 ]`, Roster `[ 04 ]`, Toolkit `[ 05 ]`, Pricing `[ 06 ]`). So `[ 06 ]` is correct _if_ the system is anchored at 01 — but Anatomy is missing its number, breaking the count.

**Fix:** apply the bracketed system uniformly:

- `[ 01 ] Hero` — silent (already the page open)
- `[ 02 ] The thesis` — replace `§ 02 · The thesis`
- `[ 03 ] Anatomy of an agent` — add number
- `[ 04 ] The roster`
- `[ 05 ] The toolkit, in public`
- `[ 06 ] How we engage`

---

## 8. Tone shifts mid-page

### Homepage (index.astro)

| Section | Voice                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------ |
| Hero    | **Brochure** ("AI Agents as a Service")                                                          |
| Thesis  | **Founder** ("We sell agents that ran in production for a month before we put a price on them.") |
| Anatomy | **Founder + receipts** ("identifying specific noun → 'Maya Krishnan'")                           |
| Roster  | **Founder**                                                                                      |
| Toolkit | **Founder** ("even the parts we sell")                                                           |
| Pricing | **Brochure** ("Strategic AI Use-Case Definition")                                                |

The homepage is a **U-shape**: brochure-founder-founder-founder-founder-brochure. The user's opinion of the company is set by Hero (entry) and Pricing (exit). Both are off. The middle three sections — which carry the actual differentiation — are wasted because the brochure bookends override them.

### Studio page

| Section                               | Voice                                          |
| ------------------------------------- | ---------------------------------------------- |
| Hero (`NEXAI · STUDIO`)               | **Visual** (no copy to score)                  |
| Showcase intro ("See the difference") | **Brochure**                                   |
| Process section ("How It Works")      | **Brochure** title, founder content underneath |
| FAQ                                   | **Founder** (especially the featured Q)        |
| CTA                                   | **Founder, hedged** ("commit to anything")     |

The Studio page is **inverted-U**: the FAQ is the soul, and the surfaces around it are weaker.

### Prompt Hub page

**Stable.** Founder voice from H1 to credit footer. Treat as the template.

### Blog (six-agents.md)

**Stable.** Treat as the template.

---

## 9. Five cleanest examples to model on

These are the canonical voice. Copy this rhythm anywhere voice drifts.

### Example 1 — `HomeThesis.astro` (statement block)

> "We don't sell software. We sell _agents_ that do the work — and a way to run them you'll still trust on month two."

**Why it works:**

- Negation first ("We don't sell X")
- Specific claim, not category ("agents that do the work")
- Built-in time horizon ("month two") — receipts, not promises
- One italic emphasis. No adjectives.

### Example 2 — `HomeThesis.astro` rail counter (the strikethrough quote setup)

> _"Hand us six weeks and a discovery deck."_
> Most "AI consultancies" sell decks. We sell agents that ran in production for a month before we put a price on them.

**Why it works:**

- Names the enemy in the enemy's own words
- Strikethrough is the rhetorical move; copy carries it
- "Ran in production for a month" — receipt
- Quotes around "AI consultancies" — opinion declared, not hidden

### Example 3 — `signal-cold-one-liner` failure-mode copy

**File:** `src/data/promptHub.ts:149`

> "If the {{SIGNAL}} is too generic ('they raised a Series B'), the model defaults to flattery. The specific noun rule kills the slop — feed it a person, a feature name, or a number, never a category."

**Why it works:**

- Names the failure first
- "Slop" — specific, slangy, founder-direct
- "A person, a feature name, or a number" — three concrete examples
- Ends with the rule

### Example 4 — Studio FAQ, featured Q

**File:** `src/data/studio-copy.ts:70–73`

> "Because those were tools. This is a service. You don't write prompts or fiddle with settings. Our team handles your brief, runs the shoot, reviews it, and sends it over. Think of it as a real studio that happens to use AI, not an AI app pretending to be one."

**Why it works:**

- One-sentence opener, declarative.
- Inverts the framing in 9 words ("not an AI app pretending to be one")
- Specific verbs (handles, runs, reviews, sends)
- No adjective in the entire paragraph

### Example 5 — `cursor` Vault entry

**File:** `src/data/vault.ts:108–110`

> bestFeature: "Composer mode — describe a multi-file change, watch it land as a diff."
> watchOut: "It will rewrite more than you asked. Always read the diff."

**Why it works:**

- bestFeature names a feature + describes the action
- watchOut admits a real failure mode out loud
- 6-word "Always read the diff." is a rule the reader will remember

---

## 10. Top 15 ranked fixes (S/M/L effort)

Ordered by impact ÷ effort. **S** = under 15 min, **M** = 15 min–2 hr, **L** = half-day plus.

| #   | Fix                                                                                                                                                                                 | Effort | Impact                                                                                         | Files                                                                                                                |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | Replace `heroEyebrow` and `site.description` with founder-voice versions (§3.1)                                                                                                     | **S**  | Highest — entry surface                                                                        | `data/home.ts:4`, `config/site.ts:8`                                                                                 |
| 2   | Rewrite all 6 navbar captions to specific nouns (§3.5–8)                                                                                                                            | **S**  | High — every page header sees these                                                            | `config/navigation.ts:6–40`                                                                                          |
| 3   | Fix the duplicate `[ 04 ]` eyebrow on Roster vs Toolkit and unify the eyebrow grammar across home (§7)                                                                              | **S**  | Medium — credibility tic                                                                       | `HomeRoster.astro:79`, `HomeToolkit.astro:37`, `HomeThesis.astro:42`, `HomeAnatomy.astro:37`, `HomePricing.astro:58` |
| 4   | Rewrite both pricing tier `includes` lists from category-slop to verbs+receipts (§3.3)                                                                                              | **M**  | Highest — primary commercial page                                                              | `HomePricing.astro:24–32, 42–50`                                                                                     |
| 5   | Rewrite pricing CTA labels (§3.4)                                                                                                                                                   | **S**  | High — every conversion routes here                                                            | `HomePricing.astro:23, 41`                                                                                           |
| 6   | Rewrite coming-soon page entirely (§3.2)                                                                                                                                            | **S**  | High — Agent Lab + Catch-Us links land here, so it's the _second_ most-visited page after home | `pages/coming-soon.astro:16–37`                                                                                      |
| 7   | Fix `Catch Us` nav link (currently points at `/coming-soon` while pretending to offer a coffee)                                                                                     | **S**  | High — dishonest CTA                                                                           | `config/navigation.ts:36–40`                                                                                         |
| 8   | Promote sub-headlines, kill generic H2s on Studio Process + Showcase + FAQ (§5)                                                                                                     | **M**  | Medium — section scannability                                                                  | `StudioProcess.astro:16–17`, `StudioShowcase.astro:25–26`, `StudioFAQ.astro:14–17`                                   |
| 9   | Reduce "actually" + "opinionated" + "ran in production for a month" tic-counts to canonical-once-each (§4)                                                                          | **M**  | Medium — keeps voice from sounding rehearsed                                                   | global; ~15 sites                                                                                                    |
| 10  | Rewrite Studio CTA body line (§3.9)                                                                                                                                                 | **S**  | Medium — Studio page is the highest-converting commercial surface                              | `StudioCTA.astro:16`                                                                                                 |
| 11  | Fix `Hover to inspect →` on Roster (touch-device contradiction) and `More on the way` empty CTA (§6)                                                                                | **S**  | Low–Medium — small credibility leak                                                            | `HomeRoster.astro:94, 165`                                                                                           |
| 12  | Tighten App Vault sub: kill "Curated, tested, written by us — not affiliate links" duplication; rewrite per §3.10                                                                   | **S**  | Low–Medium                                                                                     | `pages/apps/index.astro:25–28, 86–88`                                                                                |
| 13  | Rewrite Footer tagline `site.description` propagates through here too (covered by fix #1, listed for traceability)                                                                  | **S**  | Low                                                                                            | `Footer.astro:22` (reads `site.description`)                                                                         |
| 14  | Add a real bar to "Submit your own →" empty state (e.g. _"We publish artifacts after they've shipped real work for a month."_) — already half-there, just add the rule              | **S**  | Low — but the rule reinforces voice                                                            | `pages/prompts/index.astro:140`                                                                                      |
| 15  | Audit and tighten product names: "AI Drops" (footer) vs "Field Notes" (nav, blog) vs "Blog (Field Notes)" (vault.ts:136). The site is calling the same thing three names. Pick one. | **M**  | Medium — name drift compounds                                                                  | `Footer.astro:47`, `navigation.ts:32`, `data/vault.ts:136`                                                           |

---

## Closing note for the lead

The voice is **already in the building** — it lives in the Thesis section, the Anatomy demo, the Prompt Hub data, the Studio FAQ, and the blog. Those five surfaces are not the problem. The problem is that the surfaces buyers hit _first_ (hero, nav captions, coming-soon, pricing) were written like a marketing-deck. Fix the four entry-point surfaces (items 1, 2, 4, 6 in §10) and the site's voice goes from 70% on-brand to 95% in roughly **3 hours of editing, no rebuilds**.

The duplicate `[ 04 ]` is a **15-second fix**. Do it before you commit anything else — it's the cheapest credibility win on the list.
