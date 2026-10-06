# iter2-05 — Hybrid — Hero section (headline iteration)

**Roster (held constant, hero set):** `Sales · Social · Creatives · Operations · CEO · Research` — unchanged. The six rotating words are not touched.

**Angle (2 lines):**
Prior iter parked the headline at the plain original (`AI Agents for [seat].`) and pushed all the hook into the eyebrow. This pass hunts for a prefix-first frame that is *punchier* than the plain original and still takes all six rotating words — including the bare noun `CEO` — with zero grammar bend. Found one: `One agent for [seat].` — same scaffolding, sharper point of view (singular commitment, not a plural category), and it pays off the eyebrow's "one agent per function."

---

## Headline frame bake-off (the actual work)

The scaffolding is fixed: **static prefix + rotating word + trailing char**, prefix-first. A winning frame must take all six words as-is. The hard word is `CEO` — it is a *person/seat*, not a function, so any frame that implies "do the work of X" or "run X" strains on it (and on `Creatives`). I tested each frame out loud against `CEO` first.

| # | Frame (shown with CEO) | CEO read-aloud test | Verdict |
|---|---|---|---|
| A | **Put an agent on CEO.** | "Put an agent on CEO" — you put an agent on a *task/desk*, not "on CEO." Bends. | ❌ bends CEO |
| B | **An agent that runs CEO.** | "runs CEO" — you run *sales*, you don't "run CEO." Bends hard. | ❌ bends CEO |
| C | **Your CEO, as one agent.** | "Your CEO, as one agent" reads — but it's *word-first*, which inverts the prefix→word rig. Structural change to fit a hook. | ❌ Guardrail #2 (structural) |
| D | **Hire an agent for CEO.** | "Hire an agent for CEO" reads clean (for the CEO seat), but barely punchier than "AI Agents for," and "Hire" fights the eyebrow's "Not one more hire." | ⚠️ clean but self-conflicting / flat |
| **F** | **One agent for CEO.** | "One agent for CEO" — clean. CEO = the seat, exactly like the original "for." | ✅ **winner** |

Frame F across all six, read aloud — every one a grammatical seat the prefix can name:
`One agent for Sales.` / `One agent for Social.` / `One agent for Creatives.` / `One agent for Operations.` / `One agent for CEO.` / `One agent for Research.`

**Why F wins (one line):** it keeps the only structure that takes the bare `CEO`, but trades the flat plural category `AI Agents for` for a singular commitment `One agent for` — which *is* the positioning (one seat filled, not a swarm) and echoes the eyebrow, so it's punchier without bending a word or the rig.

**Did it beat the plain original? Yes — narrowly, and without a tax.**

*Plain-fallback note (Guardrail #1).* Plain version = the original `AI Agents for [seat].`. I kept `One agent for [seat].` because a skeptic respects it more: "AI Agents for" is a plural product category (wallpaper — every AI shop says it); "One agent for" makes a *claim* — you get one agent per seat, not a vague fleet — which is the page's actual no-swarm, no-retainer positioning and sets up "one agent per function" in the eyebrow. It's tighter (3 words vs. 3 incl. "AI") and singular = more concrete. If the editor wants maximum safety, the plain `AI Agents for [seat].` is a clean overrule — it loses nothing but the point of view.

*Guardrail #2 check.* No structural, grammar, or scope change. Same prefix-first rig, same six words untouched, same trailing period. Word-first frames (C) and verb frames (A, B) were rejected precisely because they'd tax the system. The hook fits the scaffolding exactly as it is.

---

## 1. Hero section

**`src/components/home/HomeHero.astro` + `src/data/home.ts`**

- **Eyebrow** (teal uppercase): `One agent per function. Not one more hire.`

  *Why — unchanged from iter-05, and now it rhymes with the headline. The headline says `One agent for [seat]`, the eyebrow says `One agent per function` — same promise stated twice from two angles (the seat / the function), then "Not one more hire" lands the buyer's own headcount math. Plain fallback rejected: `Custom AI agents for your business` — wallpaper, says nothing the headline doesn't.*

- **Headline static prefix:** `One agent for`

  *Why — CHANGED from `AI Agents for`. This is the only edit of substance this pass. Tested against the hard word first: "One agent for **CEO**." reads clean (CEO = the seat). All six slot in with no bend. It beats the plain original by swapping a plural category for a singular commitment that matches the positioning and the eyebrow. Plain fallback shown above; kept clever (lightly) because a skeptic respects the claim over the category.*

- **Rotating words** (unchanged set, italic, driven by orbit's active agent): `Sales`, `Social`, `Creatives`, `Operations`, `CEO`, `Research`

  *Why — no change. Each word slots into "One agent for [ ]." cleanly. Read aloud across all six: Sales / Social / Creatives / Operations / CEO / Research — every one a grammatical seat the prefix can name. Guardrail #2: not one word bent to fit the new prefix.*

- **Headline trailing char:** `.` (period after the rotating word)

  *Why — unchanged. Flat, declarative founder tone. No exclamation, no ellipsis.*

- **Subtext / lede:** `Each one does the work a hire would — drafts outreach, ships creatives, briefs your morning. A reviewer signs off before anything goes out, and their edits make the next run sharper.`

  *Why — unchanged from iter-05. Replaces the four empty verbs (`understand, design, develop, train`, the §9.6 flagged weak spot). Pays off "one agent" with three concrete outcomes pulled from the live orbit demos, then names the one trust mechanism this ICP cares about — a human signs off, nothing auto-publishes, corrections compound. That's the owned trade-off (it doesn't run unattended) framed as the feature it actually is.*

  *VERIFY: "briefs your morning" maps to the Research demo's `Brief #52 lands 6:42 AM` — confirm that framing is still live in the orbit before shipping, so the lede and the card agree.*

- **Primary CTA:** `Build My Agent` → opens Cal.com booking widget

  *Why — unchanged. Concrete (verb + artifact), maps to the booking widget, and now reads even tighter against `One agent for [seat]` → "Build My Agent." Link target unchanged (Cal.com).*

- **Ghost CTA:** `See how an agent works` → anchors to `#anatomy` (the Anatomy of an agent section)

  *Why — unchanged from iter-05. Retargets the stale `#how` anchor (§5.5 / §9.3). The Anatomy section shows one agent's input → reasoning → output → review run, so the label delivers what it promises. VERIFY: confirm the Anatomy section's DOM id is `anatomy` (or set the href to the section's actual id).*

---

## What I'd A/B test next

1. **Headline: claim vs. category.** `One agent for [seat].` (singular commitment, this iter) vs. the plain `AI Agents for [seat].` (original) — does the no-swarm "one agent" framing or the familiar category line pull more bookings from vendor-burned operators?
2. **Headline echo vs. variety.** Headline `One agent for` + eyebrow `One agent per function` rhyme on purpose — test against a non-rhyming eyebrow (`Built for your stack, not a slide deck.`) to see if the double-tap reinforces or feels repetitive.
3. **Lede length.** Two-sentence lede (outcome + trust) vs. a one-sentence cut dropping the three examples (`Each one does the work a hire would, and a reviewer signs off before anything goes out.`).
