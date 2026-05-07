import { site } from '../config/site';

// ── Hero content ──
export const heroEyebrow = 'Your business on autopilot';
export const heroHeadlineBefore = 'AI Agents for';
export const heroHeadlineAfter = '.';
export const heroRotationWords = [
	'Outreach',
	'Marketing',
	'Research',
	'Finance',
	'Creatives',
	'Sales',
];
export const heroSubtext =
	'We understand your business, then design, develop, and train AI agents to run it for you.';
export const bookingUrl = site.bookingUrl;

// ── Agent orbit data ──
export interface Capability {
	text: string;
	status: 'active' | 'planned';
}

// Each agent's card shows a different operational state. The body is
// rendered by mode (one of the AgentCardState union variants below) using
// the visual primitives in `agent-orbit.ts` (status pip, ring, sparkline,
// network, avatar, continuation button, channel grid, icon row).

export type AgentCardState =
	| {
			mode: 'tool-calls';
			badge: string;
			steps: {
				tool: string;
				iconKey: string;
				status: 'done' | 'running';
				label: string;
			}[];
			progress: { current: number; total: number; unit: string };
	  }
	| {
			mode: 'approval';
			badge: string;
			amount: string;
			avatar: string;
			client: string;
			invoice: string;
			context: string;
			ageMin: number;
			risk: 'green' | 'amber' | 'red';
	  }
	| {
			mode: 'thread';
			badge: string;
			peers: { label: string; dir: 'in' | 'out' }[];
			messages: { dir: 'in' | 'out'; agent: string; text: string }[];
			decision: { text: string; outcome: 'green' | 'amber' | 'red' };
			footer: string;
	  }
	| {
			mode: 'connectors';
			badge: string;
			channels: {
				iconKey: string;
				status: 'done' | 'running' | 'queued';
				label: string;
				caption: string;
				live?: boolean;
			}[];
			recent: { iconKey: string; title: string };
			footer: string;
	  }
	| {
			mode: 'batch';
			badge: string;
			ring: { current: number; total: number; unit: string };
			channels: { iconKey: string; label: string; action: string }[];
			footer: string;
	  }
	| {
			mode: 'metrics';
			badge: string;
			tiles: {
				label: string;
				value: string;
				points?: number[];
				trend?: 'up' | 'down' | 'flat';
				sub?: string;
				featured?: boolean;
			}[];
			footer?: string;
	  }
	| {
			mode: 'pipeline';
			badge: string;
			tools: {
				iconKey: string;
				label: string;
				value: string;
				status: 'done' | 'running';
				pending?: boolean;
			}[];
			deal: {
				name: string;
				stage: string;
				stageNum: number;
				totalStages: number;
				value: string;
				subtext?: string;
			};
			headline: { label: string; value: string; sub?: string; trend?: string; points?: number[] };
			footer: string;
	  };

export interface AgentNode {
	id: string;
	title: string;
	role: string;
	description: string;
	icon: string;
	capabilities: Capability[];
	cardState: AgentCardState;
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
		cardState: {
			mode: 'tool-calls',
			badge: 'running',
			steps: [
				{ tool: 'apollo', iconKey: 'apollo', status: 'done', label: 'query · D2C, Series A, IN' },
				{
					tool: 'clearbit',
					iconKey: 'clearbit',
					status: 'done',
					label: 'enrich · harshita@moshal',
				},
				{ tool: 'score', iconKey: 'brain', status: 'done', label: 'intent · 84/100' },
				{ tool: 'gmail', iconKey: 'gmail', status: 'running', label: 'draft · subject A/B test' },
			],
			progress: { current: 4, total: 12, unit: 'leads processed' },
		},
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
		cardState: {
			mode: 'batch',
			badge: 'batch',
			ring: { current: 11, total: 18, unit: 'posts' },
			channels: [
				{ iconKey: 'linkedin', label: 'LinkedIn', action: 'carousel · live now' },
				{ iconKey: 'x', label: 'X', action: '5-post thread · 4PM' },
				{ iconKey: 'buffer', label: 'Buffer', action: '9 queued · IG + LI' },
				{ iconKey: 'mailchimp', label: 'Mailchimp', action: 'digest → 8AM IST' },
			],
			footer: '~4 posts/min',
		},
	},
	{
		id: 'research',
		title: 'Research',
		role: 'Signals & Insights',
		description:
			'Reads the market, scans competitors, and surfaces signals that change what to ship next.',
		icon: 'M11 19a8 8 0 100-16 8 8 0 000 16zm5.5-2.5L21 21M9 11h4M11 9v4',
		capabilities: [
			{ text: 'Weekly competitor scans', status: 'active' },
			{ text: 'Trend & signal reports', status: 'active' },
			{ text: 'Customer interview synthesis', status: 'planned' },
			{ text: 'Market sizing briefs', status: 'planned' },
		],
		cardState: {
			mode: 'thread',
			badge: 'scanning',
			peers: [
				{ label: 'S', dir: 'in' },
				{ label: 'C', dir: 'out' },
			],
			messages: [
				{ dir: 'in', agent: 'sales', text: 'Banno win, next play?' },
				{ dir: 'out', agent: 'creatives', text: 'Indie jewelry trend?' },
				{ dir: 'in', agent: 'creatives', text: '+28% search · 30d' },
			],
			decision: { text: 'Trend: indie jewelry → adopt', outcome: 'green' },
			footer: '3 signals tracked',
		},
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
		cardState: {
			mode: 'approval',
			badge: 'waiting',
			amount: '$18,500',
			avatar: 'RJ',
			client: 'Rahul Juneja',
			invoice: '#INV-047',
			context: '32 SKUs · jewelry restock',
			ageMin: 14,
			risk: 'amber',
		},
	},
	{
		id: 'creatives',
		title: 'Creatives',
		role: 'Visual & Brand',
		description:
			'Generates cover art, ad variants, and brand visuals on cue. Keeps every channel fed.',
		icon: 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18zM2 2l7.586 7.586M11 11a2 2 0 11-4 0 2 2 0 014 0z',
		capabilities: [
			{ text: 'AI cover art & banners', status: 'active' },
			{ text: 'Ad creative variants', status: 'active' },
			{ text: 'Video edits & motion', status: 'planned' },
			{ text: 'Brand asset library sync', status: 'planned' },
		],
		cardState: {
			mode: 'connectors',
			badge: 'rendering',
			channels: [
				{
					iconKey: 'midjourney',
					status: 'running',
					label: 'Midjourney',
					caption: 'cover · 4 variants',
				},
				{
					iconKey: 'figma',
					status: 'done',
					label: 'Figma',
					caption: 'hero · v3 ready',
					live: true,
				},
				{ iconKey: 'canva', status: 'done', label: 'Canva', caption: 'ad set · 6 sizes' },
				{ iconKey: 'runway', status: 'queued', label: 'Runway', caption: 'reel · 12s queued' },
			],
			recent: { iconKey: 'midjourney', title: 'shore-blue cover · v3 ready' },
			footer: 'last render · 4m ago',
		},
	},
	{
		id: 'sales',
		title: 'Sales',
		role: 'Pipeline & Demos',
		description:
			'Qualifies inbound leads, drafts proposals, and books demos before you remember to.',
		icon: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
		capabilities: [
			{ text: 'Lead qualification scoring', status: 'active' },
			{ text: 'Proposal drafting', status: 'active' },
			{ text: 'Demo scheduling automation', status: 'planned' },
			{ text: 'Pipeline health alerts', status: 'planned' },
		],
		cardState: {
			mode: 'pipeline',
			badge: 'on call',
			tools: [
				{ iconKey: 'phone', value: '18', label: 'calls', status: 'done' },
				{ iconKey: 'clock', value: '12h', label: 'active', status: 'done' },
				{ iconKey: 'gmail', value: '47', label: 'emails', status: 'done' },
				{ iconKey: 'bell', value: '31', label: 'queued', status: 'running', pending: true },
			],
			deal: {
				name: 'Banno · Enterprise',
				stage: 'Negotiation',
				stageNum: 4,
				totalStages: 5,
				value: '$12K',
				subtext: 'Follow-up scheduled May 2 · pricing deck sent',
			},
			headline: {
				label: 'pipeline value',
				value: '$42K',
				sub: '8 deals · 3 closing this week',
				trend: '↑ 18% WoW',
				points: [26, 24, 28, 27, 31, 29, 34, 33, 37, 36, 40, 42],
			},
			footer: 'Agent closed $5.6K today · 2 deals won',
		},
	},
];
