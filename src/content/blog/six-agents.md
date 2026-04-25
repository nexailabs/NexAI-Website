---
title: 'The six agents we run our company on.'
emphasis: 'six agents'
category: Playbook
date: 2026-04-22
read: '8 min'
seed: 0
featured: true
excerpt: 'A tour of the Outreach, Marketing, Finance, Research, Strategy, and Creatives agents — what each one does and how they talk to each other.'
description: 'The six AI agents that run NexAI Labs — Outreach, Marketing, Finance, Research, Strategy, Creatives — and how they hand work to each other.'
---

We don't have a 20-person team. We have six agents and three humans. Here's what each agent does, what it doesn't do, and how they hand work to each other without a single standup.

Every agent lives inside a shared context store. Outputs from one become inputs to another. When something breaks, the human gets a ping — not a dashboard.

> The agents aren't tools. They're colleagues. The difference shows up in how you design the seams between them.

## Outreach.

Finds leads, writes cold messages, tracks follow-ups, and flags deals going cold. It reads signal — who raised, who hired, who shipped — then drafts a one-liner that references the signal. The human approves before send.

Under the hood it runs a scoring pass (`lead-score`), a message-draft pass, and a follow-up scheduler. We cap it at 40 sends a day per inbox to keep warm.

## Marketing.

Turns a thesis into a week of posts. Drafts, schedules, watches engagement, then feeds winners back into the next cycle. We never let it publish — a human still clicks send on everything public-facing.

## Finance.

Watches your numbers, flags overruns, drafts invoices before you remember to. Reads our bank feed, categorizes, reconciles. The monthly close that used to take a day takes twenty minutes.

## Research.

We stopped reading 40-page reports. Research Agent writes a one-page brief for every question we ask it — claim, evidence, counter, next step. If we need the long version, it's a link away.

## Strategy.

The quietest of the six. Reads everything the other agents produce and writes us a Friday memo: what moved, what stalled, what to try next week. It doesn't make decisions — it makes the decisions legible.

## Creatives.

NexAI Studio, essentially. Turns mannequin shots into studio photography, writes alt text, generates variant crops for every platform. Runs before a campaign; runs again the week after for retargeting creative.

## How they talk to each other.

Every agent writes to a shared log we call the `brief`. It's the closest thing we have to a company wiki — one entry per piece of work, written in agent voice, read by the next agent in line.

That's the whole system. Six agents. One brief. Three humans who approve, edit, and occasionally laugh at what the agents try to ship.
