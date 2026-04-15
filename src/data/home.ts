import { site } from '../config/site';

// ── Hero content ──
export const heroEyebrow = 'AI Agents as a Service';
export const heroHeadlineBefore = 'AI Agents for';
export const heroHeadlineAfter = '.';
export const heroRotationWords = [
	'Outreach',
	'Marketing',
	'Finance',
	'Research',
	'Strategy',
	'Creatives',
];
export const heroSubtext = 'We build the agents. You run the business.';
export const bookingUrl = site.bookingUrl;

// ── Agent orbit data ──
export interface Capability {
	text: string;
	status: 'active' | 'planned';
}

export interface AgentNode {
	id: string;
	title: string;
	role: string;
	description: string;
	icon: string;
	capabilities: Capability[];
}

export const agents: AgentNode[] = [
	{
		id: 'outreach',
		title: 'Outreach',
		role: 'Sales & Partnerships',
		description:
			'Finds leads, writes cold messages, tracks follow-ups, and flags deals that are going cold.',
		icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
		capabilities: [
			{ text: 'Cold outreach sequences', status: 'active' },
			{ text: 'CRM updates via chat', status: 'active' },
			{ text: 'Follow-up reminders', status: 'planned' },
			{ text: 'Partnership discovery', status: 'planned' },
		],
	},
	{
		id: 'marketing',
		title: 'Marketing',
		role: 'Content & Campaigns',
		description:
			"Runs content pipelines, schedules posts, and tells you what's actually driving traffic.",
		icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
		capabilities: [
			{ text: 'Social post scheduling', status: 'active' },
			{ text: 'SEO audit reports', status: 'active' },
			{ text: 'Campaign performance summaries', status: 'active' },
			{ text: 'Ad creative A/B testing', status: 'planned' },
		],
	},
	{
		id: 'ceo',
		title: 'CEO',
		role: 'Strategy & Decisions',
		description:
			"Synthesizes what's happening across every team and surfaces the one thing that needs your attention.",
		icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
		capabilities: [
			{ text: 'Daily cross-team briefings', status: 'active' },
			{ text: 'Goal vs. reality tracking', status: 'active' },
			{ text: 'Task delegation by department', status: 'active' },
			{ text: 'Scenario planning assistant', status: 'active' },
		],
	},
	{
		id: 'finance',
		title: 'Finance',
		role: 'P&L & Cash Flow',
		description:
			'Watches your numbers, flags overruns, and drafts invoices before you remember to.',
		icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
		capabilities: [
			{ text: 'Monthly P&L summaries', status: 'active' },
			{ text: 'Invoice generation', status: 'active' },
			{ text: 'Expense categorization', status: 'planned' },
			{ text: 'Revenue forecast modeling', status: 'planned' },
		],
	},
	{
		id: 'research',
		title: 'Research',
		role: 'Intel & Trends',
		description:
			'Monitors competitors, reads the market, and delivers a tight brief instead of a 40-page report.',
		icon: 'M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5zM16 16l4.5 4.5',
		capabilities: [
			{ text: 'Competitor monitoring', status: 'active' },
			{ text: 'Weekly trend digests', status: 'planned' },
			{ text: 'On-demand research briefs', status: 'planned' },
			{ text: 'Patent & whitespace analysis', status: 'planned' },
		],
	},
	{
		id: 'creatives',
		title: 'Creatives',
		role: 'Visuals & Brand',
		description:
			'Produces product shots, brand assets, and video edits without a studio or a shoot day.',
		icon: 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586',
		capabilities: [
			{ text: 'AI product photoshoots', status: 'active' },
			{ text: 'Brand asset generation', status: 'active' },
			{ text: 'Video workflow automation', status: 'active' },
			{ text: 'Motion graphics via prompt', status: 'planned' },
		],
	},
];

// ── Services section (derived from agents — single source of truth) ──
export const servicesLabel = 'What We Build';
export const servicesHeading = 'Six agents. One operating layer.';
export const servicesDescription =
	'Each agent is custom-built to the way your business already runs. Pick one to start, add more as they earn their keep.';

export interface ServiceCard {
	id: string;
	title: string;
	role: string;
	description: string;
	href?: string;
}

// Mirrors `agents` 1:1 so taxonomy never drifts.
// Outreach is featured (first card) because it's the most common entry point.
export const serviceCards: ServiceCard[] = agents.map((agent) => ({
	id: agent.id,
	title: `${agent.title} Agent`,
	role: agent.role,
	description: agent.description,
}));

export const whyItems: string[] = [
	'Built to your workflow — not a SaaS you contort around',
	'You own the agent outright — your data stays in your stack',
	'Ship in weeks, not months',
	'Fixed scope, fixed price, no per-seat creep',
];
