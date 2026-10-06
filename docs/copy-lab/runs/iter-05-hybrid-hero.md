# iter-05 — Hybrid — Hero section only

**Roster (held constant, hero set):** `Sales · Social · Creatives · Operations · CEO · Research` — unchanged. The six rotating words are not touched.

**Angle (2 lines):**
The headline stays a noun-frame (`AI Agents for [seat].`) because that's the only frame that takes all six rotating words — including the bare noun `CEO` — without bending grammar. The hook moves to the eyebrow and the lede, where it speaks the buyer's own math (one seat filled, not one more hire to manage) and pays off immediately with the concrete trust mechanism (a reviewer signs off; nothing publishes on its own).

---

## 1. Hero section

**`src/components/home/HomeHero.astro` + `src/data/home.ts`**

- **Eyebrow** (teal uppercase): `One agent per function. Not one more hire.`

  *Why — kept clever over plain. Plain fallback I rejected: `Custom AI agents for your business`. The plain line is true but says nothing the buyer doesn't already assume from the headline; it's wallpaper. The kept line maps to the buyer's own economics — they're problem-aware and the expensive thing they feel is headcount and the management tax that comes with it. "Not one more hire" is the founder's actual math, and it sets up the no-retainer, no-management-overhead story the rest of the page pays off. A skeptic respects it because it names a cost, not a category.*

- **Headline static prefix:** `AI Agents for`

  *Why — unchanged. This noun-frame is the one frame that takes every rotating word as-is. Test against the hard word: "AI Agents for **CEO**." reads clean (CEO = the seat). Verb-frames break it: "An agent that runs your CEO" / "Put an agent on CEO" force a grammar bend. Per Guardrail #2, I changed the frame's job (push the hook to eyebrow + lede), not the word.*

- **Rotating words** (unchanged set, italic, driven by orbit's active agent): `Sales`, `Social`, `Creatives`, `Operations`, `CEO`, `Research`

  *Why — no change. Each word slots into "AI Agents for [ ]." cleanly. Reads aloud across all six: Sales / Social / Creatives / Operations / CEO / Research — every one is a grammatical seat the prefix can name.*

- **Headline trailing char:** `.` (period after the rotating word)

  *Why — unchanged. The full stop is the founder's flat, declarative tone. No exclamation, no ellipsis.*

- **Subtext / lede:** `Each one does the work a hire would — drafts outreach, ships creatives, briefs your morning. A reviewer signs off before anything goes out, and their edits make the next run sharper.`

  *Why — replaces the four empty verbs (`understand, design, develop, train`), which is the §9.6 flagged weak spot. Plain fallback I rejected: `Custom agents that run a business function for you, with a human review step.` That plain version is accurate but abstract — "a business function" is a category, not a result. The kept line pays off the eyebrow's "does the work a hire would" with three concrete outcomes (drafts outreach, ships creatives, briefs your morning — drawn straight from the live orbit demos), then names the one trust mechanism this ICP cares about: a human signs off, nothing auto-publishes, the corrections compound. That's the owned beat — I name the limitation (it doesn't run unattended; a person reviews) and frame it as the feature it actually is. A skeptic burned by "pilots that never ship" trusts the line that admits a human is in the loop.*

  *VERIFY: "briefs your morning" maps to the Research demo's `Brief #52 lands 6:42 AM` — confirm that 6:42 AM brief framing is still live in the orbit before shipping, so the lede and the card agree.*

- **Primary CTA:** `Build My Agent` → opens Cal.com booking widget

  *Why — unchanged. Plain fallback considered: `Spec my first agent`. "Build My Agent" is already concrete (a verb + the artifact), maps to the booking widget, and matches the eyebrow's "one agent per function" — you book to build one. No reason to soften a line that already names the thing. Link target unchanged (Cal.com).*

- **Ghost CTA:** `See how an agent works` → anchors to `#anatomy` (the Anatomy of an agent section)

  *Why — retargets the stale `#how` anchor (§5.5 / §9.3 hard constraint: don't break real links). The Anatomy section literally shows one agent's input → reasoning → output → review run, so "See how an agent works" delivers exactly what it promises. Plain fallback rejected: `See how it works` (the current label) — "it" is vague and the old anchor is dead; "an agent" is the specific noun and points at the section that proves it. VERIFY: confirm the Anatomy section's DOM id is `anatomy` (or set the ghost CTA href to whatever that section's actual id is).*

---

## What I'd A/B test next

1. **Eyebrow economics vs. eyebrow speed.** `One agent per function. Not one more hire.` (cost frame) vs. `One agent per function. Working the day you ship it.` — does the headcount-cost angle or the time-to-value angle pull more bookings from funded operators?
2. **Lede length.** The two-sentence lede (outcome + trust) vs. a one-sentence cut that drops the three examples (`Each one does the work a hire would, and a reviewer signs off before anything goes out.`) — test whether the concrete examples earn their length or slow the scan.
3. **Primary CTA.** `Build My Agent` vs. `See an agent for my business` — does the commit-to-build verb or the softer see-it-first verb convert better on a problem-aware, vendor-burned ICP?
