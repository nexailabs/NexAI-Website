# Copy Lab — homepage copywriter bake-off

A harness for choosing a copywriter agent by **watching it write the actual homepage**,
not by trusting a description. Four candidate agents, one shared brief, one rubric, one winner.

## Why a bake-off and not one agent

Copy voice is a taste decision. The fastest way to make it is to hold everything constant
(brief, audience, constraints, the page being rewritten) and vary only the **approach** —
then read the four rewrites side by side. The winner's prompt graduates to a reusable
`/skill`; the losers stay as reference for ideas worth grafting.

## Files

| File | Role |
|------|------|
| `brief.md` | Shared context **every** candidate reads. Company, audience, positioning, voice rules, hard constraints, the job. The only thing held constant. |
| `rubric.md` | Six scoring dimensions (1–5 each) + how to judge each. Used to rank the runs. |
| `candidates/01-direct-response.md` | PAS + AIDA, benefit-led, multiple CTAs, risk reversal. The conversion classic. |
| `candidates/02-storybrand.md` | Customer-as-hero, NexAI as the guide, clear plan, stakes. |
| `candidates/03-founder-nobs.md` | Encodes the house voice: first principles, concrete nouns + numbers, free value > CTA pressure. |
| `candidates/04-minimalist.md` | Radical concision. One idea per line. Confident understatement. |
| `runs/` | Each candidate's homepage rewrite lands here, named to match its candidate file. |
| `DECISION.md` | Scorecard + winner + why. Filled after a bake-off. |

## How to run a bake-off

1. Make sure `brief.md` is current (it points at `../homepage-copy.md` for the live strings).
2. Dispatch each candidate as a subagent: give it `brief.md` + its own `candidates/NN-*.md`
   prompt, tell it to write a full homepage rewrite into `runs/NN-*.md` using the same
   section structure as `homepage-copy.md`.
3. Run a judge pass: score all four runs against `rubric.md`, write the table into `DECISION.md`.
4. Read the four runs + scorecard. Pick the winner (or merge the best of two).
5. Promote the winning prompt to an invokable Claude skill.

## Ground rules baked into every candidate

- **No time commitments.** No "two weeks", "day 14", "by month four", "30 days". (See `brief.md`.)
- **No fluff adjectives.** Banned list in `brief.md`.
- **One canonical roster.** The Hero and Roster currently name two different sets of 6 agents.
  Every candidate must pick one set and use it everywhere.
- **Free value over CTA pressure.** Teach, don't push.
