# Toolkit heroes brief — App Vault · Prompt Hub · Field Notes (HERO TEXT ONLY)

Voice + banned words: [`brief.md`](brief.md) §4–5 (house voice). This file adds the context for the
three "open toolkit" pages and gives you the current hero copy to rewrite. **Scope: the hero block
only** — eyebrow, headline, sub, and any signature line. Do NOT touch stat numbers, cards, filters,
or body content below the hero.

---

## 1. What these three pages are (the "open toolkit")

On the homepage, the Toolkit section promises: *"The exact tools we use, the prompts and SOPs in
production, and the things we got wrong. All published, no email gate."* These are the three
destinations. They are the **free-value / proof play** — they exist to earn trust by giving real
work away, not to sell. The hero of each should make the value obvious in one beat and reinforce
"these people actually ship."

- **App Vault** (`/apps`) — an opinionated catalog of the software NexAI runs on. What it is, why
  picked, what it replaced. Not affiliate links.
- **Prompt Hub** (`/prompts`) — prompts, runbooks (SOPs), and installable skills that ran on real
  client work. Some free, some paid via Razorpay.
- **Field Notes** (`/blog`) — essays, playbooks, build logs, written by the founders.

## 2. Who reads them (ICP)

Same core buyer as the homepage (Seed–Series B founders/operators), **plus** a practitioner tail —
other builders and operators who find these by search or sharing. This reader is hands-on and
allergic to fluff; they can smell a content-marketing funnel. The hero wins by being concrete and a
little generous, never gated or salesy. Free value over CTA pressure applies double here.

## 3. Constraints

- House voice + banned adjectives (`brief.md` §5.2).
- **The "proof of time" lines are the toolkit's whole wedge** — e.g. Prompt Hub's *"survived a
  month of real work."* This is a **credibility claim** (battle-tested), not a delivery promise, so
  it is NOT the banned kind of time commitment. Keep that battle-tested proof framing; you may
  rephrase the words, but don't gut the "this ran in production before we published it" signal.
- Don't invent stats. The numbers (tool count, prompt/SOP/skill counts, total runs) are injected
  live — write headline/sub copy that works around them, don't hardcode fake numbers.
- Keep it no-gate, no-pressure. These pages give value away; the hero should feel like an open door.

---

## 4. Current hero copy (the "original" you're rewriting)

### App Vault — `/apps` (`src/pages/apps/index.astro`)
- **Eyebrow:** `App Vault · {N} tools`
- **Headline (H1):** `The stack we *actually* run on.`
- **Sub:** `A short, opinionated catalog of the software we use every day. What it is, why we picked it, what it replaced. Curated, tested, written by us, not affiliate links.`

### Prompt Hub — `/prompts` (`src/components/promptHub/PromptHubHero.astro`)
- **Eyebrow:** `Prompt Hub`
- **Headline (H1):** `*[Prompts | SOPs | skills.md]* that *survived* a month of real work.`
  *(the first word rotates through Prompts / SOPs / skills.md)*
- **Sub:** `Single-shot prompts, human runbooks, and packaged skills your agent installs. Some free, some paid via Razorpay.`

### Field Notes — `/blog` (`src/pages/blog/index.astro`)
- **Eyebrow:** `Field Notes`
- **Headline (H1):** `Essays, playbooks, and *build logs* from a company run on agents.`
- **Sub:** `Written by the founders. No ghostwriters, no SEO fluff, no hot takes.`
- **Signature line:** `from the lab in Bengaluru.`

---

## 5. The job + output contract

Rewrite the **hero block** of all three pages. For each page give: eyebrow, headline (preserve the
rotating-word mechanic on Prompt Hub if you keep it — list the rotation words), sub, and (Field
Notes) the signature line. Where you change intent, add a one-line italic *why*.

- Write to the run path the dispatch names you (e.g. `runs/toolkit-03-founder-nobs.md`).
- 2-line angle statement up top.
- Three `##` sections: `App Vault`, `Prompt Hub`, `Field Notes` — in that order.
- End with a 3-line "what I'd A/B test next" note.
