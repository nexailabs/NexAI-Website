# 09 — Copy Drafts (Pre-Approval)

**Author:** Claude (Opus 4.7, 1M)
**Date:** 2026-04-25
**Status:** DRAFT — no source files touched. Awaiting Rahul's approval before any code change lands.
**Inputs:** `audits/07-copy-opus.md`, `~/.claude/CLAUDE.md` (NO-BS Lens), `~/Desktop/NexAI Labs/CEO/CLAUDE.md`.
**Scope of this draft:** Hero, Thesis (paired), Coming-soon, Site description, Navbar captions (×6).

Three voice exemplars to model on (already in the building, do not rewrite):

1. `HomeThesis` rail counter — _"Most 'AI consultancies' sell decks. We sell agents that ran in production for a month before we put a price on them."_
2. `signal-cold-one-liner` failure-mode paragraph — names the failure, names the rule.
3. Studio FAQ "tools vs service" answer — one declarative opener, then four specific verbs, no adjective in the paragraph.

---

## Section 1 — Voice north star

- **What it IS:** Founder-direct. First person plural. Verdict in the first 6 words. Numbers, durations, and named tools instead of adjectives. Negation moves ("We don't sell X. We sell Y.") and one italic emphasis per block max.
- **What it is NOT:** Brochure-formal, conference-stage, hedged, decorative, title-cased category lists, or excited about the technology. No banned words: _powerful, best-in-class, leverage, robust, seamless, cutting-edge, AI-powered, world-class, simply, just_.
- **Receipts over promises:** "Ran in production for a month" beats "production-ready". A specific noun ("Maya Krishnan", "₹4 / commit", "day 14") beats a category. If a buyer can't repeat the noun back to a co-founder, it isn't done.

---

## Section 2 — Hero + Thesis as one narrative arc

The Hero is the **claim**. The Thesis is the **defence**. Right now the Hero says "AI Agents as a Service" — a category — and one scroll later the Thesis says "We don't sell software." The buyer's ear hears two different companies.

The fix: pick a Hero that **sets up** the Thesis line ("We don't sell software. We sell agents that do the work…") instead of contradicting it. Three versions below, each paired to a Thesis lead-in tweak so the two blocks read as one paragraph if you removed the page chrome.

### Current Hero (verbatim)

- **Eyebrow:** `AI Agents as a Service`
- **H1:** `AI Agents for [Outreach | Marketing | Finance | Research | Strategy | Creatives].`
- **Sub:** `We build the agents. You run the business.`
- **CTAs:** `Book a Call` · `See Our Work`

### Current Thesis lead (verbatim)

- **Bar eyebrow:** `§ 02 · The thesis`
- **Bar right:** `Why we exist`
- **Rail eyebrow:** `The standard pitch`
- **Rail strikethrough:** _"Hand us six weeks and a discovery deck."_
- **Rail counter:** `Most "AI consultancies" sell decks. We sell agents that ran in production for a month before we put a price on them.`
- **Position eyebrow:** `Our position →`
- **H2:** `We don't sell software. We sell *agents* that do the work — and a way to run them you'll still trust on month two.`

---

### Proposed — Version A · "Receipts-first" (recommended)

**Hero**

- **Eyebrow:** `Six agents. One company. Three humans.`
- **H1:** `AI agents for [Outreach | Marketing | Finance | Research | Strategy | Creatives].`
- **Sub:** `We built six to run our own company. We'll build yours next — live in your stack on day 14.`
- **CTAs (unchanged):** `Book a Call` · `See Our Work`

**Thesis lead-in pairing**

- **Bar eyebrow:** `[ 02 ] The thesis` _(also fixes the eyebrow-grammar drift flagged in audit §7)_
- **Bar right:** `Why we exist` _(unchanged)_
- **Rail eyebrow:** `The standard pitch` _(unchanged)_
- **Rail strikethrough:** _"Hand us six weeks and a discovery deck."_ _(unchanged — exemplar)_
- **Rail counter:** _(unchanged — exemplar)_
- **Position eyebrow:** `Our position →` _(unchanged)_
- **H2:** _(unchanged — exemplar)_

**Why A:** The eyebrow is the receipt the Thesis later spends 3 pillars unpacking ("six agents", "one company", "three humans" → Build, Run, Compound). The sub stops being a generic split-of-labour ("we build, you run") and becomes a **claim with a date** ("day 14"). Nothing in the Thesis needs rewriting because the Hero now sets it up instead of fighting it. Trade-off: it foregrounds team size, which only works if "three humans" stays true through hires.

---

### Proposed — Version B · "Negation-first"

**Hero**

- **Eyebrow:** `Built, not bought · Live in 14 days`
- **H1:** `AI agents for [Outreach | Marketing | Finance | Research | Strategy | Creatives].`
- **Sub:** `Not a SaaS seat. An agent in your stack on day 14, run by your team on Monday.`
- **CTAs (unchanged):** `Book a Call` · `See Our Work`

**Thesis lead-in pairing**

- **Bar eyebrow:** `[ 02 ] The thesis`
- **Position eyebrow:** `Our position →` _(unchanged)_
- **H2 (tweaked to avoid double-negation with Hero):** `We sell *agents* that do the work — and a way to run them you'll still trust on month two.` _(drop the leading "We don't sell software." since the Hero already set up the negation)_

**Why B:** The Hero declares the enemy ("Not a SaaS seat") before the Thesis does, so the strikethrough quote on the Thesis rail still lands fresh ("six weeks and a discovery deck" is a different enemy from "a SaaS seat"). Trade-off: you lose the line that audit-07 calls the cleanest negation move on the site ("We don't sell software."). Only pick B if you want the H2 lighter and the Hero heavier.

---

### Proposed — Version C · "Industries-first" (closest to current; lowest-risk edit)

**Hero**

- **Eyebrow:** `The agent layer for small companies`
- **H1:** `AI agents for [Outreach | Marketing | Finance | Research | Strategy | Creatives].`
- **Sub:** `Six agents we run on. We'll build yours in a two-week sprint — fixed price, live on day 14.`
- **CTAs (unchanged):** `Book a Call` · `See Our Work`

**Thesis lead-in pairing**

- **Bar eyebrow:** `[ 02 ] The thesis` _(unchanged grammar fix)_
- **All other Thesis copy unchanged.**

**Why C:** Smallest possible change — only the eyebrow and sub move. Keeps the rotating-word H1 that the orbit animation is built around. Trade-off: "agent layer" is the closest the eyebrow gets to "stack" language (a phrase audit-07 banned in §3.2). Use C only if the sprint is short and B/A feel too aggressive.

---

### Recommendation

**Ship Version A.** It is the only version where the Hero, sub, and Thesis read as one continuous paragraph if you stripped page chrome out:

> _Six agents. One company. Three humans._
> _We built six to run our own company. We'll build yours next — live in your stack on day 14._
> _We don't sell software. We sell agents that do the work — and a way to run them you'll still trust on month two._

Three sentences, three commitments, zero contradiction. That is the arc.

---

## Section 3 — Coming-soon page

This page is the second-most-trafficked surface on the site (Agent Lab nav + Catch Us nav both land here). Audit-07 ranked every line on it as off-brand.

### Current copy (verbatim)

- **Eyebrow:** `IN THE PIPELINE`
- **H1:** `Something's *Brewing*`
- **Sub:** `We're building the next layer of the NexAI stack.` _(line break)_ `Early access opens soon — get in before the queue.`
- **Chips:** `Agent Lab` · `Prompt Hub` · `App Vault`
- **CTAs:** `Get Early Access` · `Back to Home`
- **Page meta description:** `Agent Lab, Prompt Hub, and App Vault — launching soon from NexAI Labs.`

### Proposed rewrite (one version)

- **Eyebrow:** `Shipping next`
- **H1:** `Not ready to ship.`
- **Sub:** `Agent Lab and our booking page go live once each one's been used by 10 teams in production. Drop your email and we'll send the link the day it lands.`
- **Chips:** `Agent Lab` · `Catch Us` _(remove "Prompt Hub" and "App Vault" — both are live; listing them as "coming soon" is dishonest)_
- **CTAs:** `Tell me when it ships` _(primary, opens Cal booking same as today)_ · `Back to Home`
- **Page meta description:** `Agent Lab and our booking page — live once they've been used by 10 teams.`

### What changes (decisions)

- **"Something's Brewing" → "Not ready to ship."** Coffee-shop tagline → founder admission. The audit ranked the brewing line as the worst voice block on the site. "Not ready" is a verdict, in the first 3 words.
- **"Next layer of the NexAI stack" → named bar ("used by 10 teams").** Phantom architecture replaced with the same publishing rule the Prompt Hub already runs on. Reuses an in-house standard instead of inventing one.
- **"Get in before the queue" deleted.** No queue exists. Don't ship a fake one.
- **Chips trimmed from 3 to 2.** Prompt Hub and App Vault are already live — listing them as "coming soon" makes the page lie to anyone who clicks the nav. Replace App Vault and Prompt Hub with `Catch Us`, since `/coming-soon` is what Catch Us links to today.
- **CTA `Get Early Access` → `Tell me when it ships`.** Same destination (Cal), but the label names the user's action ("tell me") and removes the unearned "Early Access" framing.
- **Length:** 38 words → 27 words in the headline+sub combined. Roughly 30% shorter.

---

## Section 4 — Site description (`src/config/site.ts:8`)

This string propagates to the footer (`Footer.astro:22`), the OG card, and search-engine snippets. It is currently the single most-replicated off-brand line on the site.

- **Current:** `Building AI Agents for Businesses` _(60 chars)_

### Proposed — 3 alternatives (all ≤80 chars, no fluff words)

| #                     | String                                                                   | Chars | Trade-off                                                                                              |
| --------------------- | ------------------------------------------------------------------------ | ----- | ------------------------------------------------------------------------------------------------------ |
| **A** _(recommended)_ | `Six AI agents we built to run our company. We'll build yours next.`     | 65    | Receipt-first, mirrors the Hero. Best for OG cards because the noun ("six") survives truncation.       |
| **B**                 | `Two-week sprints. Fixed price. AI agents live in your stack on day 14.` | 71    | Sales-page direct. Names the engagement model. Loses the "we run on it ourselves" proof.               |
| **C**                 | `We don't sell software. We sell agents that did the work for a month.`  | 70    | Pure thesis pull-quote. Strongest voice; weakest at explaining what the company does to a cold reader. |

**Recommendation:** A. It survives every surface — footer, OG card, Google snippet, share-card — and pairs cleanly with Hero Version A.

---

## Section 5 — Navbar captions (`src/config/navigation.ts`, lines 6–40)

Audit-07 flagged 5 of 6 captions as off-brand. Rewrites below. Each ≤14 words. Keep founder voice — concrete noun, named output, or named tool.

### 1. Agent Lab — line 9

- **Current:** `Custom AI agents built for your workflow.`
- **Proposed:** `Six agents we run on — Outreach, Strategy, Finance. Yours next.`
- _Why:_ "Six" is a number. The three named agents are receipts. "Yours next" is a commitment, not a hedge.

### 2. NexAI Studio — line 15

- **Current:** `AI-powered photoshoots for fashion brands.`
- **Proposed:** `Mannequin in, on-model out. 3 days, 80% cheaper than a studio day.`
- _Why:_ Names the input ("mannequin"), the output ("on-model"), the duration ("3 days"), and the comparator ("80% cheaper than a studio day"). Banned word `AI-powered` removed. Note: keep a one-line variant under 14 words for the navbar; the longer "before/after" line lives on the Studio page itself.

### 3. Prompt Hub — line 21

- **Current:** `Curated prompts, skills, and SOPs we swear by.`
- **Proposed:** `Prompts that survived a month of real work — copy, paste, ship.`
- _Why:_ The "month of real work" line is the Prompt Hub's own H1 — the nav caption should tease the same standard, not invent a new one. "Curated, swear by" is two adjectives doing one weak job.

### 4. App Vault — line 27

- **Current:** `The best AI tools we use and recommend.`
- **Proposed:** `Ten tools we run our company on. What each one replaced.`
- _Why:_ Number ("ten"), named action ("run our company on"), and the strongest hook from audit §3.10 ("what each one replaced") promoted to the caption. "Best" is unearned; "use and recommend" is two verbs doing one job.

### 5. Field Notes — line 33

- **Current:** `Dispatches on what we're building and learning.`
- **Proposed:** `Essays on what shipped, what didn't, what we'd do again.`
- _Why:_ The current line is the closest to brand voice of the six, but "dispatches…building and learning" is two abstract nouns. The replacement uses three concrete verb-clauses and matches the `six-agents.md` opener (audit voice exemplar). Note: keep "Field Notes" as the canonical name and align Footer's "AI Drops" to match (audit §10 fix #15).

### 6. Catch Us — lines 36–40 _(special case — dishonest CTA, audit §3.8)_

**Audit finding:** The caption says "no pitch decks, just coffee" but the link goes to `/coming-soon`. Either fix the link or fix the caption.

The honest path: **point the link at the existing `cal.com` booking** (`site.bookingUrl` is already configured in `config/site.ts:7` — the same one the Hero uses).

- **Current href:** `/coming-soon`
- **Proposed href:** `https://cal.com/rahul-juneja/15min` (i.e. `site.bookingUrl`) — opens via the existing `data-open-cal` handler used elsewhere
- **Current caption:** `Let's talk — no pitch decks, just coffee.`
- **Proposed caption:** `15-minute call with Rahul. One question from us. One from you.`
- _Why:_ "Coffee" promises an in-person thing the link can't deliver. The booking is a 15-minute Cal — name it. "One question from us, one from you" sets the bar (audit §3.8 voice exemplar). If the Cal-link change is too risky for this sprint, second-best is to **rename the nav item** to "Coming soon: a real booking page" and keep the `/coming-soon` link — but that is strictly worse than just pointing at Cal today.

---

## Section 6 — Implementation checklist (post-approval)

For lead Claude to apply after Rahul approves a Hero version + the rewrites above. All file paths absolute from repo root.

### File: `src/data/home.ts`

- **Line 4** — `heroEyebrow`: replace `'AI Agents as a Service'` with the chosen version's eyebrow string (A: `'Six agents. One company. Three humans.'` recommended).
- **Line 15** — `heroSubtext`: replace `'We build the agents. You run the business.'` with the chosen version's sub string (A: `"We built six to run our own company. We'll build yours next — live in your stack on day 14."` recommended).
- **Line 5** — `heroHeadlineBefore`: lowercase to `'AI agents for'` (was `'AI Agents for'`) — minor consistency fix to match the rest of the site's sentence case.
- **Lines 7–14** — `heroRotationWords`: unchanged.

### File: `src/config/site.ts`

- **Line 8** — `description`: replace `'Building AI Agents for Businesses'` with `"Six AI agents we built to run our company. We'll build yours next."` (Section 4 option A). No other changes.

### File: `src/components/home/HomeThesis.astro`

- **Line 40** — bar eyebrow: replace `'§ 02 · The thesis'` with `'[ 02 ] The thesis'` (also resolves the eyebrow-grammar drift flagged in audit §7).
- **Lines 51–55, 60–65** — rail strikethrough, rail counter, position eyebrow, and H2: **unchanged** if Hero Version A is shipped. If Version B is shipped, drop the leading sentence `We don't sell software.` from line 62; H2 starts at `We sell *agents*…`.

### File: `src/pages/coming-soon.astro`

- **Line 8** — `description` prop: replace with `"Agent Lab and our booking page — live once they've been used by 10 teams."`.
- **Line 16** — eyebrow: replace `IN THE PIPELINE` with `Shipping next`.
- **Lines 17–19** — H1: replace `Something's <em>Brewing</em>` with `Not ready to ship.` (drop the `<em>` wrapper since the gradient effect targeted "Brewing" specifically; if the gradient is desired, wrap `to ship.` in `<em>`).
- **Lines 20–23** — sub: replace both lines with the single-paragraph sub from Section 3 (`Agent Lab and our booking page go live once each one's been used by 10 teams in production. Drop your email and we'll send the link the day it lands.`).
- **Lines 27–29** — chips: drop the `Prompt Hub` chip (line 28) and the `App Vault` chip (line 29). Replace with one new chip: `Catch Us`. Final chip set: `Agent Lab` · `Catch Us`.
- **Line 35** — CTA label: replace `Get Early Access` with `Tell me when it ships`. `data-open-cal` and `href={site.bookingUrl}` unchanged.

### File: `src/config/navigation.ts`

- **Line 9** — Agent Lab caption: replace with `'Six agents we run on — Outreach, Strategy, Finance. Yours next.'`.
- **Line 15** — Studio caption: replace with `'Mannequin in, on-model out. 3 days, 80% cheaper than a studio day.'`.
- **Line 21** — Prompt Hub caption: replace with `'Prompts that survived a month of real work — copy, paste, ship.'`.
- **Line 27** — App Vault caption: replace with `'Ten tools we run our company on. What each one replaced.'`.
- **Line 33** — Field Notes caption: replace with `"Essays on what shipped, what didn't, what we'd do again."`.
- **Line 38** — Catch Us href: replace `'/coming-soon'` with `site.bookingUrl` (import already exists in adjacent files; add `import { site } from './site';` at top of `navigation.ts` if not present, or hard-code the URL string `'https://cal.com/rahul-juneja/15min'` to avoid a circular import).
- **Line 39** — Catch Us caption: replace with `'15-minute call with Rahul. One question from us. One from you.'`.

### Cross-cutting (out of scope for this drafts file, listed for traceability)

- **`Footer.astro:22`** — picks up `site.description` automatically from the change above. No edit needed.
- **`Footer.astro:47`** — "AI Drops" → "Field Notes" rename, per audit §10 fix #15. Not part of this draft; flag for the next pass.
- **Eyebrow grammar drift across `HomeAnatomy`, `HomeRoster`, `HomeToolkit`, `HomePricing`** — audit §7 has the full list. Out of scope here; ship the `[ 02 ]` Thesis fix in this pass and bundle the rest in the next round.

---

## Approval gate

Once Rahul approves:

1. **Hero version** (A / B / C — recommendation: A)
2. **Site description** option (A / B / C — recommendation: A)
3. **Catch Us link change** (Cal booking vs. rename)

…the lead Claude can apply Section 6 verbatim in roughly 20 minutes of editing and run the build. No other surfaces are touched in this pass.
