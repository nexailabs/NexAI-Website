export const PROMPT_TYPES = ['prompt', 'skill', 'system-prompt', 'mcp-config'] as const;
export type PromptType = (typeof PROMPT_TYPES)[number];

export const PROMPT_MODELS = ['chatgpt', 'claude', 'gemini', 'cursor', 'codex', 'any'] as const;
export type PromptModel = (typeof PROMPT_MODELS)[number];

export const PROMPT_CATEGORIES = [
	'Writing',
	'Coding',
	'Research',
	'Marketing',
	'Sales',
	'Ops',
	'Design',
	'Agents',
	'Data',
	'Meta-Prompts',
] as const;
export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];

export const PROMPT_TAGS = [
	'rag',
	'extraction',
	'classification',
	'writing',
	'refactor',
	'debug',
	'cold-email',
	'outbound',
	'research',
	'summarization',
	'agents',
	'mcp',
	'eval',
	'sop',
	'customer-support',
	'code-review',
	'data-cleanup',
	'spec-writing',
	'planning',
	'onboarding',
] as const;
export type PromptTag = (typeof PROMPT_TAGS)[number];

export interface PromptEntry {
	slug: string;
	title: string;
	summary: string;
	body: string;
	type: PromptType;
	models: readonly PromptModel[];
	category: PromptCategory;
	tags: readonly PromptTag[];
	author: string;
	addedAt: string;
	featured: boolean;
	copyCount?: number;
	variables?: readonly string[];
	install?: {
		kind: 'cli' | 'json' | 'url';
		command: string;
		label?: string;
	};
	exampleOutput?: string;
	howToUse?: string;
}

export const prompts: readonly PromptEntry[] = [
	{
		slug: 'cold-email-personalization',
		title: 'Cold Email Personalization Engine',
		summary:
			'Generate deeply personalized outbound emails with pain-point framing and proof-driven CTA variants.',
		body: `You are an outbound personalization strategist for B2B sales. Your job is to write one hyper-relevant cold email for a specific buyer.

Context to use:
- Prospect name: {prospect_name}
- Company name: {company_name}
- Role: {role}
- Pain point to focus on: {pain_point}

Instructions:
1. Start with a first line that proves relevance in plain language. No fake compliments. No fluff.
2. Connect the pain point to a believable business consequence (lost revenue, slower velocity, lower retention, inefficient ops, etc.).
3. Offer one clear outcome our solution can create. Keep it concrete.
4. Add lightweight social proof (a result pattern, not made-up logos).
5. End with a low-friction CTA: either "worth a 10-minute walkthrough?" or "open to a quick async breakdown?"

Tone requirements:
- Crisp, confident, and human.
- Avoid hype words like "revolutionary" or "game-changing".
- Avoid long paragraphs. Keep each line short and readable on mobile.
- No em dashes.

Output format:
A) Subject line options (3)
B) Email draft (90-140 words)
C) Alternate CTA line (2 options)
D) One sentence saying why this message fits this buyer

Quality checks before final output:
- Prospect/company/role are used naturally.
- Pain point appears once and is translated into impact.
- CTA asks for a tiny next step.
- No generic filler like "I hope this finds you well."

If input details are sparse, make the most conservative assumptions and keep wording specific but non-fabricated.`,
		type: 'prompt',
		models: ['chatgpt', 'claude', 'any'],
		category: 'Sales',
		tags: ['cold-email', 'outbound', 'writing'],
		author: 'NexAI Labs',
		addedAt: '2026-04-15',
		featured: true,
		variables: ['prospect_name', 'company_name', 'role', 'pain_point'],
		install: {
			kind: 'url',
			label: 'Open in ChatGPT',
			command:
				'https://chatgpt.com/?q=You%20are%20an%20outbound%20personalization%20strategist%20for%20B2B%20sales...',
		},
	},
	{
		slug: 'invoice-extractor',
		title: 'Invoice Extractor Claude Skill',
		summary:
			'Claude Agent Skill for turning invoice PDFs or images into normalized accounting-ready JSON.',
		body: `---
name: invoice-extractor
description: Extracts line items, totals, vendor info, and tax from PDF/image invoices. Use when processing receipts or AP inboxes.
---

## Purpose
Convert a raw invoice document into a structured JSON payload with vendor, totals, tax, due date, and line items.

## Instructions
1. Read the invoice carefully and extract only visible facts.
2. Normalize currency values to decimal numbers with two digits.
3. Include uncertainty notes when fields are unreadable or missing.
4. Return strict JSON with keys: vendor, invoice_number, invoice_date, due_date, subtotal, tax, total, currency, line_items, confidence.
5. Do not hallucinate line items. If not present, use an empty array and set confidence lower.

## Output rule
Respond with JSON only, no markdown wrapper.`,
		type: 'skill',
		models: ['claude'],
		category: 'Data',
		tags: ['extraction', 'data-cleanup'],
		author: 'NexAI Labs',
		addedAt: '2026-04-15',
		featured: true,
		install: {
			kind: 'cli',
			label: 'Install in Claude Code',
			command:
				'claude skill add invoice-extractor --from https://www.nexailabs.com/prompt-hub/invoice-extractor',
		},
	},
	{
		slug: 'cursor-astro-system-prompt',
		title: 'Cursor System Prompt for Astro + Vanilla CSS',
		summary:
			'System prompt tuned for Astro 5 static projects using design tokens and scoped component styles.',
		body: `You are the system coding partner for an Astro 5 marketing site that uses TypeScript and vanilla CSS only.

Project principles:
- Prefer static-first pages and server-rendered markup.
- Build with Astro components and scoped style blocks.
- Use tokens from src/styles/global.css; do not introduce new color systems.
- Keep motion subtle and transform/opacity based.
- Maintain semantic HTML and excellent keyboard accessibility.

Implementation rules:
1. Reuse existing layout and navigation patterns before creating new ones.
2. Avoid framework dependencies (React, Vue, Svelte, Tailwind are disallowed).
3. Keep scripts tiny and progressive-enhancement oriented.
4. When adding route pages, provide clear SEO metadata and canonical URLs.
5. Favor composable components with predictable props and no hidden side effects.
6. Preserve visual tone: dark surfaces, restrained teal accents, serif only for intentional headings.

Quality bar:
- Lighthouse should remain high on performance and accessibility.
- Ensure focus states are visible and ARIA attributes are meaningful.
- Keep copy concise, practical, and free of buzzword stuffing.

Output expectations:
- Provide a short plan before edits.
- After edits, list changed files, testing steps, and any known limitations.
- If a requirement conflicts with project constraints, call it out and choose the safest path.

You are optimizing for maintainability and clarity, not cleverness.`,
		type: 'system-prompt',
		models: ['cursor'],
		category: 'Coding',
		tags: ['code-review', 'spec-writing'],
		author: 'NexAI Labs',
		addedAt: '2026-04-15',
		featured: false,
	},
	{
		slug: 'mcp-filesystem-config',
		title: 'Filesystem MCP Server Config',
		summary:
			'Baseline MCP configuration for safe project-scoped filesystem access in Claude and Codex.',
		body: `{
  "_comment": "MCP config uses a top-level mcpServers map. Each server has command, args, and optional env.",
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/workspace",
        "/tmp"
      ],
      "env": {
        "MCP_LOG_LEVEL": "info"
      }
    }
  }
}`,
		type: 'mcp-config',
		models: ['claude', 'codex'],
		category: 'Ops',
		tags: ['mcp', 'agents'],
		author: 'NexAI Labs',
		addedAt: '2026-04-15',
		featured: true,
		install: {
			kind: 'json',
			label: 'Copy JSON config',
			command:
				'{"mcpServers":{"filesystem":{"command":"npx","args":["-y","@modelcontextprotocol/server-filesystem","/workspace","/tmp"]}}}',
		},
	},
	{
		slug: 'meta-prompt-rewriter',
		title: 'Meta Prompt Rewriter',
		summary:
			'Rewrite rough prompts into crisp, constraint-aware instructions with clear outputs and evaluation checks.',
		body: `You are a prompt editor. Your task is to transform a rough prompt into a high-clarity version that is easier for an AI model to execute reliably.

Inputs:
- Original prompt: {original_prompt}
- Goal: {goal}

Rewrite method:
1. Infer the user's true objective and restate it in one sentence.
2. Convert vague language into explicit constraints.
3. Add required context assumptions and non-goals.
4. Specify output format (sections, bullets, table, JSON, etc.).
5. Include quality checks so the model can self-verify before final output.

Guardrails:
- Keep meaning intact; do not change intent.
- Remove ambiguity and filler.
- Avoid over-constraining creativity unless the goal demands precision.
- If the original prompt misses critical information, add a short "Missing Inputs" list.

Return exactly:
A) Rewritten Prompt
B) Why this version is stronger (3 bullets)
C) Optional follow-up questions (max 3)

Goal context to prioritize:
{goal}

Original prompt to rewrite:
{original_prompt}`,
		type: 'prompt',
		models: ['claude', 'chatgpt', 'any'],
		category: 'Meta-Prompts',
		tags: ['writing', 'spec-writing'],
		author: 'NexAI Labs',
		addedAt: '2026-04-15',
		featured: false,
		variables: ['original_prompt', 'goal'],
		install: {
			kind: 'url',
			label: 'Open in ChatGPT',
			command: 'https://chatgpt.com/?q=You%20are%20a%20prompt%20editor...',
		},
	},
];
