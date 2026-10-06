import { site } from '../config/site';
import { ik, tr } from '../config/imagekit';

// ── Hero content ──
export const heroEyebrow = 'One agent per function. Not one more hire.';
export const heroHeadlineBefore = 'One agent for';
export const heroHeadlineAfter = '.';
export const heroRotationWords = ['Sales', 'Social', 'Creatives', 'Operations', 'CEO', 'Research'];
export const heroSubtext =
	'Each one does the work a hire would — drafts outreach, ships creatives, briefs your morning. A reviewer signs off before anything goes out, and their edits make the next run sharper.';
export const bookingUrl = site.bookingUrl;

// ── Agent orbit data ──
//
// Each agent's card body is a "working console" — a bespoke layout per agent,
// not a generic state mode. Spec: docs/superpowers/specs/2026-05-23-hero-console-cards-design.md

/** Post-cycle CTA — replaces the action bar after the demo cycle completes,
 *  driving the visitor to NexAI's booking link. Universal across all agents. */
export interface PostCycleCta {
	label: string; // "Want a Sales Agent like this for your business?"
	sub: string; // "Book a call with NexAI →"
	href: string; // booking URL
}

// ─── Sales — War Room ────────────────────────────────────────────────
/** Pipeline value chart — area sparkline + trend label */
export interface SalesPipelineChart {
	valueLabel: string; // "Pipeline · $2.4M"
	trendLabel: string; // "↑ 22% WoW"
	points: number[]; // 8 weekly values, normalised on render
}
/** One step in the agent's workflow timeline */
export interface SalesWorkflowStep {
	iconKey: 'crm' | 'linkedin' | 'phone' | 'calendar' | 'email' | 'crm-save';
	title: string; // "Lead from CRM"
	detail: string; // "Aria Sharma · Founder, Indoera"
	status: 'done' | 'current';
	elapsed?: string; // "3m42s" for phone call
}
/** Two-step morph that fires after Confirm click */
export interface SalesPostConfirm {
	steps: [SalesWorkflowStep, SalesWorkflowStep]; // email + crm-save
	summary: string; // "Lead to booked, end-to-end"
}
export interface SalesRescheduleSlot {
	label: string; // "Thu 10:00am"
	sub: string; // "30 min · same agenda"
}
export interface SalesWarRoomState {
	mode: 'sales-warroom';
	badge: string;
	chart: SalesPipelineChart;
	workflow: SalesWorkflowStep[]; // 4 steps: 3 done + 1 current
	postConfirm: SalesPostConfirm;
	rescheduleSlots: SalesRescheduleSlot[]; // 3 alt times the agent proposes
	rescheduleCheckLabel: string; // "Checking Aria's calendar · 2 conflicts found"
	confirmLabel: string; // "Confirm meeting"
	declineLabel: string; // "Reschedule"
	confirmedLabel: string; // "Booked"
	postCycleCta: PostCycleCta; // replaces action bar after cycle complete
}

// ─── Social — Cross-Platform Publisher ────────────────────────────────
export type SocialPlatformKey = 'ig' | 'fb' | 'tt' | 'li' | 'yt' | 'x';
export type SocialPlatformStatus = 'live' | 'scheduled' | 'draft';
export interface SocialPlatform {
	key: SocialPlatformKey;
	label: string; // "Instagram" — aria
	status: SocialPlatformStatus;
	statusLabel: string; // "LIVE" | "6 PM" | "DRAFT"
	metric: string; // "6.4K · +18%" | "queued" | "needs you"
}
export interface SocialCascadeStep {
	agent: string; // "LinkedIn" | "IG Reels" | "Analytics"
	detail: string;
}
export interface SocialTriageState {
	mode: 'social-triage';
	badge: string;
	contentEyebrow: string; // "Today's drop"
	contentTitle: string; // "Tree runner SU25 — launch"
	contentMeta: string; // "Allbirds · 4 variants"
	platformsLabel: string; // "Across platforms"
	platforms: SocialPlatform[]; // 6 — IG, FB, TT, LI, YT, X
	askLabel: string; // "Needs you · 1"
	askTitle: string; // "Approve LinkedIn caption · Senior Partner tone"
	askDraft: string; // italic preview of the draft copy
	ctaA: string; // "Approve"
	ctaB: string; // "Edit"
	cascade: SocialCascadeStep[];
	cascadeSummary: string;
	postCycleCta: PostCycleCta;
}

// ─── Creatives — Render Bay ──────────────────────────────────────────
export interface CreativesTile {
	id: 'A' | 'B' | 'C' | 'D';
	imageSrc: string; // real Studio image URL
	imageAlt: string;
	scene: string; // "heritage" | "bridal" | "macro" | "flat-lay"
	qaScore: number; // 0–100
	isAgentPick?: boolean;
}
export interface CreativesCascadeStep {
	agent: string; // "Shopify" | "Social" | "Brand pack"
	detail: string;
}
export interface CreativesRenderBayState {
	mode: 'creatives-renderbay';
	badge: string;
	briefLabel: string; // "Brief"
	briefTitle: string; // "Dhwani Bansal Jewelry · Diwali drop"
	briefMeta: string; // "#SKU-DBJ-D24 · 2 variants"
	tilesLabel: string; // "Pick your hero variant"
	tiles: [CreativesTile, CreativesTile];
	ctaA: string; // "Approve pick → push live"
	ctaB: string; // "See more →"
	cascade: CreativesCascadeStep[];
	cascadeSummary: string;
	postCycleCta: PostCycleCta;
}

// ─── Operations — Ticket Resolution ──────────────────────────────────
export interface OpsCustomer {
	initials: string;
	name: string;
	ltv: string;
	orders: number;
	loyal: boolean;
}
export interface OpsCase {
	summary: string; // "Shipping delay · 6 days"
	meta: string; // "2nd ticket"
}
export interface OpsSuggestion {
	text: string;
	confidence: number; // 0–100
}
export interface OpsCascadeStep {
	agent: string; // "Razorpay" | "Email" | "WA"
	detail: string;
}
export interface OpsFloorState {
	mode: 'ops-floor';
	badge: string;
	customerLabel: string; // "Customer"
	customer: OpsCustomer;
	caseLabel: string; // "Case"
	case: OpsCase;
	suggestionLabel: string; // "Agent suggests"
	suggestion: OpsSuggestion;
	ctaA: string; // "Approve"
	ctaB: string; // "Override"
	cascade: OpsCascadeStep[];
	cascadeSummary: string;
	postCycleCta: PostCycleCta;
}

// ─── CEO — The Orchestrator's Daily Filter ───────────────────────────
/** One specialist agent's status ping in the orchestration row */
export interface CeoAgentChip {
	key: 'sales' | 'research' | 'social' | 'creatives' | 'ops';
	label: string; // "Sales"
	ping: string; // "3 demos" | "1 brief" | "2 esc" | "4 PDPs" | "$400 ask"
	tone: 'work' | 'alert' | 'spend';
}
/** Synthesis block — 3 lines linking agent signals + 1 conclusion */
export interface CeoSynthesis {
	lines: string[]; // 3 short signal lines
	conclusion: string; // "Glossier brief slips without a hire."
}
/** One step in the post-decision cascade — CEO routing the call to agents */
export interface CeoCascadeStep {
	agent: string; // "Ops" | "Finance" | "Sales"
	detail: string; // "drafting offer @ $11K/mo"
}
export interface CeoFilterState {
	mode: 'ceo-filter';
	badge: string;
	chipsEyebrow: string; // "Read across today"
	chips: CeoAgentChip[]; // 5 chips
	synthesis: CeoSynthesis;
	decisionEyebrow: string; // "The 1 decision that needs you today"
	decisionTitle: string; // "Hire Sr. Designer"
	decisionMeta: string; // "decide by 4pm"
	ctaA: string; // "Hire"
	ctaB: string; // "Defer to Sep"
	cascade: CeoCascadeStep[];
	cascadeSummary: string; // "Loop closed · 3 agents updated"
	postCycleCta: PostCycleCta;
}

// ─── Research — Tomorrow's Brief Picker ──────────────────────────────
/** Today's brief — the agent's already-shipped deliverable shown at top */
export interface ResearchTodayBrief {
	timestamp: string; // "06:42 AM"
	shippedLabel: string; // "shipped"
	insight: string; // "25% of work runs agent-alone by 2030"
	insightSource: string; // "Gartner+13" — mono attribution chip
}
/** One angle the agent can take for tomorrow's brief — the visitor picks one */
export interface ResearchAngleOption {
	key: string; // "capital" | "execution" | "hiring"
	title: string; // "Capital flows"
	meta: string; // "7 signals" | "11 cases" | "LinkedIn + Greenhouse"
	isDefault?: boolean;
	isAgentPick?: boolean; // used by "Surprise me" to land here
}
/** One step in the post-queue cascade — agent confirming work is queued */
export interface ResearchQueueStep {
	iconKey: 'sources' | 'calendar' | 'brief';
	title: string;
	detail: string;
}
export interface ResearchPostQueue {
	steps: ResearchQueueStep[]; // 2 steps
	summary: string; // "Cycle complete · agent on-shift for 23h 47m"
}
export interface ResearchBriefState {
	mode: 'research-brief';
	badge: string;
	today: ResearchTodayBrief;
	pickerLabel: string; // "TOMORROW'S BRIEF · pick an angle"
	angles: ResearchAngleOption[]; // 3 options
	queueLabel: string; // "Queue for 6:42 AM →"
	queuedLabel: string; // "Queued ✓"
	surpriseLabel: string; // "Surprise me"
	surpriseSubLabel: string; // "Agent picked: Execution gap — highest signal density this week."
	postQueue: ResearchPostQueue;
	postCycleCta: PostCycleCta; // replaces action bar after cycle complete
}

// ─── Discriminated union ─────────────────────────────────────────────
export type AgentCardState =
	| SalesWarRoomState
	| SocialTriageState
	| CreativesRenderBayState
	| OpsFloorState
	| CeoFilterState
	| ResearchBriefState;

export interface AgentNode {
	id: string;
	title: string;
	role: string;
	description: string;
	icon: string;
	cardState: AgentCardState;
}

// ─── Agents (orbit order, agent[0] at checkpoint) ────────────────────
export const agents: AgentNode[] = [
	{
		id: 'sales',
		title: 'Sales',
		role: 'Pipeline & Outreach',
		description:
			'Finds leads, drafts the cold outreach, qualifies inbound, and books the room before it goes cold.',
		icon: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
		cardState: {
			mode: 'sales-warroom',
			badge: 'BOOKING MEETING',
			chart: {
				valueLabel: 'Pipeline · $2.4M',
				trendLabel: '↑ 34% WoW',
				// 8-week weekly pipeline value (in $K) — steep growth curve
				points: [320, 420, 540, 720, 960, 1280, 1820, 2400],
			},
			// Agent's live qualification flow — 3 done, 1 current waiting on user
			workflow: [
				{
					iconKey: 'crm',
					title: 'New lead detected in CRM',
					detail: 'Aria Sharma · Head of Growth, The Whole Truth',
					status: 'done',
				},
				{
					iconKey: 'linkedin',
					title: "Enriched Aria's profile",
					detail: 'Series B · 80 employees · Mumbai',
					status: 'done',
				},
				{
					iconKey: 'phone',
					title: 'Discovery call',
					detail: '"We need AI photoshoots for our protein bar launch…"',
					status: 'done',
					elapsed: '3m42s',
				},
				{
					iconKey: 'calendar',
					title: 'Calendar invite drafted',
					detail: 'Wed 12:30pm · 30 min · awaiting your confirm',
					status: 'current',
				},
			],
			postConfirm: {
				steps: [
					{
						iconKey: 'email',
						title: 'Confirmation sent',
						detail: 'aria@thewholetruthfoods.com',
						status: 'done',
					},
					{
						iconKey: 'crm-save',
						title: 'Saved to your CRM',
						detail: 'Pipeline +$24K',
						status: 'done',
					},
				],
				summary: 'Lead to booked, end-to-end',
			},
			rescheduleSlots: [
				{ label: 'Thu 10:00am', sub: '30 min · same agenda' },
				{ label: 'Thu 3:00pm', sub: '45 min · w/ co-founder' },
				{ label: 'Fri 11:00am', sub: '30 min · post product demo' },
			],
			rescheduleCheckLabel: '3 open slots found',
			confirmLabel: 'Confirm meeting',
			declineLabel: 'Reschedule',
			confirmedLabel: 'Booked',
			postCycleCta: {
				label: 'Want a Sales Agent for your business?',
				sub: 'Book a call with NexAI →',
				href: site.bookingUrl,
			},
		},
	},
	{
		id: 'social',
		title: 'Social',
		role: 'Posts & Replies',
		description:
			'Publishes across platforms, watches engagement on live posts, and triages DMs with drafted replies — holding anything that needs your voice.',
		icon: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
		cardState: {
			mode: 'social-triage',
			badge: 'PUBLISHING · 6 PLATFORMS',
			contentEyebrow: "Today's drop",
			contentTitle: 'Tree runner SU25 — launch',
			contentMeta: 'Allbirds · 6 variants',
			platformsLabel: 'Across platforms',
			platforms: [
				{
					key: 'ig',
					label: 'Instagram',
					status: 'live',
					statusLabel: 'LIVE',
					metric: '6.4K · +18%',
				},
				{
					key: 'fb',
					label: 'Facebook',
					status: 'live',
					statusLabel: 'LIVE',
					metric: '2.1K shares',
				},
				{
					key: 'tt',
					label: 'TikTok',
					status: 'scheduled',
					statusLabel: '6 PM',
					metric: 'queued',
				},
				{
					key: 'li',
					label: 'LinkedIn',
					status: 'draft',
					statusLabel: 'DRAFT',
					metric: 'needs you',
				},
				{
					key: 'yt',
					label: 'YouTube',
					status: 'scheduled',
					statusLabel: '8 PM',
					metric: 'Shorts cut',
				},
				{
					key: 'x',
					label: 'X',
					status: 'live',
					statusLabel: 'LIVE',
					metric: '+24% velocity',
				},
			],
			askLabel: 'Needs you · 1',
			askTitle: 'Approve LinkedIn caption · Senior Partner tone',
			askDraft:
				'"Building shoes for the way you move — not the way you look. Tree runner SU25 drops today."',
			ctaA: 'Approve',
			ctaB: 'Edit',
			cascade: [
				{ agent: 'LinkedIn', detail: 'published · 11:42 AM' },
				{ agent: 'IG Reels', detail: 'cross-posted as 15s cut' },
				{ agent: 'Analytics', detail: 'tracking 4 platforms' },
			],
			cascadeSummary: '4 platforms live · tracked in one place',
			postCycleCta: {
				label: 'Want a Social Agent like this for your brand?',
				sub: 'Book a call with NexAI →',
				href: site.bookingUrl,
			},
		},
	},
	{
		id: 'creatives',
		title: 'Creatives',
		role: 'PDP & UGC',
		description:
			'Generates product variants, scores each on QA, and pushes the winner you pick straight to the PDP.',
		icon: 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18zM2 2l7.586 7.586M11 11a2 2 0 11-4 0 2 2 0 014 0z',
		cardState: {
			mode: 'creatives-renderbay',
			badge: '2 RENDERS READY',
			briefLabel: 'Brief',
			briefTitle: 'Dhwani Bansal Jewelry · Diwali drop',
			briefMeta: '#SKU-DBJ-D24 · 2 variants',
			tilesLabel: 'Pick your hero variant',
			tiles: [
				{
					id: 'A',
					imageSrc: `${ik}/studio/hero/dbj/dbj-04.jpg${tr.thumb}`,
					imageAlt: 'DBJ · bridal styling variant',
					scene: 'bridal',
					qaScore: 94,
					isAgentPick: true,
				},
				{
					id: 'B',
					imageSrc: `${ik}/studio/hero/dbj/dbj-01.jpg${tr.thumb}`,
					imageAlt: 'DBJ · earring macro variant',
					scene: 'macro',
					qaScore: 89,
				},
			],
			ctaA: 'Approve pick → push live',
			ctaB: 'See more →',
			cascade: [
				{ agent: 'Shopify', detail: 'uploaded to PDP · live' },
				{ agent: 'Social', detail: 'scheduled IG · 6 PM IST' },
				{ agent: 'Brand pack', detail: 'variant saved · v24' },
			],
			cascadeSummary: 'Loop closed · 3 channels updated',
			postCycleCta: {
				label: 'Want a Creatives Agent like this for your PDPs?',
				sub: 'Book a call with NexAI →',
				href: site.bookingUrl,
			},
		},
	},
	{
		id: 'ops',
		title: 'Operations',
		role: 'Tickets & Accounts',
		description:
			'Triages support, drafts the customer reply, and protects your high-LTV accounts — with a refund or override always yours to sign off.',
		icon: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		cardState: {
			mode: 'ops-floor',
			badge: 'ESCALATION · #4821',
			customerLabel: 'Customer',
			customer: {
				initials: 'RM',
				name: 'Riya M',
				ltv: '₹84K LTV',
				orders: 12,
				loyal: true,
			},
			caseLabel: 'Case',
			case: {
				summary: 'Shipping delay · 6 days',
				meta: '2nd ticket',
			},
			suggestionLabel: 'Agent suggests · 92% conf',
			suggestion: {
				text: 'Full refund ₹4,400 + ₹200 voucher · warm-tone apology.',
				confidence: 92,
			},
			ctaA: 'Approve',
			ctaB: 'Override',
			cascade: [
				{ agent: 'Razorpay', detail: '₹4,400 pushed · txn #84221' },
				{ agent: 'Email', detail: 'apology sent · warm-1' },
				{ agent: 'WhatsApp', detail: 'Riya notified · read 11:43' },
			],
			cascadeSummary: 'Loop closed · resolved in 4m',
			postCycleCta: {
				label: 'Want an Ops Agent like this for your support?',
				sub: 'Book a call with NexAI →',
				href: site.bookingUrl,
			},
		},
	},
	{
		id: 'ceo',
		title: 'CEO',
		role: 'Strategy & Decisions',
		description:
			"Reads across every team, connects what's happening, and brings you the single call that can't wait — with the downstream effects already mapped.",
		icon: 'M12 1l9 5v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6l9-5z',
		cardState: {
			mode: 'ceo-filter',
			badge: 'ORCHESTRATOR · 24-HR LENS',
			chipsEyebrow: 'Read across today',
			chips: [
				{ key: 'sales', label: 'Sales', ping: '3 demos', tone: 'work' },
				{ key: 'research', label: 'Research', ping: '1 brief', tone: 'work' },
				{ key: 'social', label: 'Social', ping: '2 esc', tone: 'alert' },
				{ key: 'creatives', label: 'Creatives', ping: '4 PDPs', tone: 'work' },
				{ key: 'ops', label: 'Ops', ping: '$400 ask', tone: 'spend' },
			],
			synthesis: {
				lines: [
					'Research flagged hiring market tightening.',
					'Sales booked +3 demos this week.',
					'Creatives queue full through Mon.',
				],
				conclusion: 'Glossier brief slips without a hire.',
			},
			decisionEyebrow: 'The 1 decision that needs you today',
			decisionTitle: 'Hire Sr. Designer',
			decisionMeta: 'decide by 4pm',
			ctaA: 'Hire',
			ctaB: 'Defer to Sep',
			cascade: [
				{ agent: 'Ops', detail: 'drafting offer @ $11K/mo' },
				{ agent: 'Finance', detail: 'runway recalc 8.4 → 7.6mo' },
				{ agent: 'Sales', detail: '2 more demos held this week' },
			],
			cascadeSummary: 'Loop closed · 3 agents updated',
			postCycleCta: {
				label: 'Want a CEO Agent like this for your business?',
				sub: 'Book a call with NexAI →',
				href: site.bookingUrl,
			},
		},
	},
	{
		id: 'research',
		title: 'Research',
		role: 'Briefs & Signal',
		description:
			'Reads the market overnight and lands a one-page brief on your desk first thing — sourced, cited, ready to act on.',
		icon: 'M11 19a8 8 0 100-16 8 8 0 000 16zm5.5-2.5L21 21M9 11h4M11 9v4',
		cardState: {
			mode: 'research-brief',
			badge: 'BRIEF #51 DELIVERED',
			today: {
				timestamp: '06:42 AM',
				shippedLabel: 'shipped',
				insight: '25% of work runs agent-alone by 2030',
				insightSource: 'Gartner+13',
			},
			pickerLabel: "Tomorrow's angle",
			angles: [
				{
					key: 'capital',
					title: 'Capital flows',
					meta: '7 signals',
					isDefault: true,
				},
				{
					key: 'execution',
					title: 'Execution gap',
					meta: '11 cases',
					isAgentPick: true,
				},
				{
					key: 'hiring',
					title: 'Hiring shift',
					meta: '9 roles',
				},
			],
			queueLabel: 'Queue for 6:42 AM →',
			queuedLabel: 'Queued',
			surpriseLabel: 'Surprise me',
			surpriseSubLabel: 'Execution gap · highest signal density',
			postQueue: {
				steps: [
					{
						iconKey: 'sources',
						title: 'Briefed 7 sources to scan overnight',
						detail: 'Bloomberg · PitchBook · Crunchbase · LinkedIn · X · Gartner · Reuters',
					},
					{
						iconKey: 'calendar',
						title: 'Calendar set · Brief #52 lands 6:42 AM tomorrow',
						detail: '',
					},
				],
				summary: 'Cycle complete · agent on-shift for 23h 47m',
			},
			postCycleCta: {
				label: 'Want a Research Agent for your business?',
				sub: 'Book a call with NexAI →',
				href: site.bookingUrl,
			},
		},
	},
];
