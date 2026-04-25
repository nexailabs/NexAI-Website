// App Vault — structured data
//
// FILTER DIMENSIONS (every tool MUST have these):
//   category   : 'AI' | 'Build' | 'Ops' | 'Media' | 'Comms'
//   type       : 'SaaS' | 'Open Source' | 'Self-hosted' | 'Hybrid'
//   pricing    : 'Free' | 'Per-seat' | 'Flat' | 'Usage-based'
//   frequency  : 'Daily' | 'Weekly' | 'Sometimes'

export type VaultCategory = 'AI' | 'Build' | 'Ops' | 'Media' | 'Comms';
export type VaultType = 'SaaS' | 'Open Source' | 'Self-hosted' | 'Hybrid';
export type VaultPricing = 'Free' | 'Per-seat' | 'Flat' | 'Usage-based';
export type VaultFrequency = 'Daily' | 'Weekly' | 'Sometimes';

export interface VaultTool {
	slug: string;
	name: string;
	vendor: string;
	verified: boolean;
	category: VaultCategory;
	type: VaultType;
	pricing: VaultPricing;
	frequency: VaultFrequency;
	cost: string;
	inUseSince: string;
	inUseSinceShort: string;
	lead: string;
	titleAccent: string;
	titlePhrase: string;
	tagline: string;
	one: string;
	why: string;
	replaced: string;
	replacedNote?: string;
	altsTo: string[];
	link: string;
	tags: string[];
	builtWith: string[];
	usedFor: string[];
	usedAgainst: string;
	bestFeature: string;
	watchOut: string;
}

export const VAULT_TOOLS: VaultTool[] = [
	{
		slug: 'claude',
		name: 'Claude',
		vendor: 'Anthropic',
		verified: true,
		category: 'AI',
		type: 'SaaS',
		pricing: 'Per-seat',
		frequency: 'Daily',
		cost: '$200/seat/mo',
		inUseSince: 'Sep 2024',
		inUseSinceShort: "Sep '24",
		lead: 'Rahul Juneja',
		titleAccent: 'think',
		titlePhrase: 'Claude — the model we think out loud with.',
		tagline: 'The model and CLI we orchestrate the whole company through.',
		one: 'A general-purpose assistant + CLI we wire into every agent.',
		why: 'The reasoning we trust for production work.',
		replaced: 'ChatGPT',
		replacedNote: 'for our internal work',
		altsTo: ['ChatGPT'],
		link: 'claude.ai',
		tags: ['llm', 'agents', 'cli', 'reasoning', 'orchestration'],
		builtWith: ['n8n', 'Cursor', 'Notion'],
		usedFor: [
			'Drafting agent prompts',
			'Code review',
			'Reading research papers',
			'One-page briefs',
		],
		usedAgainst: "Slop. We don't use it for hot takes or volume content.",
		bestFeature: 'The CLI. Pipe a file in, ask a question, get a useful answer in five seconds.',
		watchOut: 'Long context costs add up. Cap conversations or summarise often.',
	},
	{
		slug: 'cursor',
		name: 'Cursor',
		vendor: 'Anysphere',
		verified: true,
		category: 'Build',
		type: 'SaaS',
		pricing: 'Per-seat',
		frequency: 'Daily',
		cost: '$20/seat/mo',
		inUseSince: 'Mar 2024',
		inUseSinceShort: "Mar '24",
		lead: 'Rahul Juneja',
		titleAccent: 'think',
		titlePhrase: 'Cursor — the editor we think in.',
		tagline: 'Our IDE. Tab-completion that finally feels like a teammate.',
		one: 'AI-native code editor — VS Code fork with multi-file agents.',
		why: 'Tab-completion that finally feels like a teammate.',
		replaced: 'VS Code',
		altsTo: ['VS Code'],
		link: 'cursor.com',
		tags: ['ide', 'editor', 'agent', 'autocomplete', 'pair-programming'],
		builtWith: ['Claude', 'Astro'],
		usedFor: [
			'Daily coding',
			'Refactors across files',
			'Generating boilerplate',
			'Pair-programming with the agent',
		],
		usedAgainst: 'Quick scripts. We still keep nvim for ssh sessions.',
		bestFeature: 'Composer mode — describe a multi-file change, watch it land as a diff.',
		watchOut: 'It will rewrite more than you asked. Always read the diff.',
	},
	{
		slug: 'astro',
		name: 'Astro',
		vendor: 'The Astro Project',
		verified: true,
		category: 'Build',
		type: 'Open Source',
		pricing: 'Free',
		frequency: 'Daily',
		cost: 'Free · OSS',
		inUseSince: 'Jan 2025',
		inUseSinceShort: "Jan '25",
		lead: 'Rahul Juneja',
		titleAccent: 'asked',
		titlePhrase: 'Astro — HTML by default, React when asked.',
		tagline: 'Ships HTML by default; React when we ask for it.',
		one: 'Static-first web framework that hydrates only what you mark.',
		why: 'Pages stay fast without us thinking about it.',
		replaced: 'Next.js',
		replacedNote: 'for static marketing surfaces',
		altsTo: ['Next.js'],
		link: 'astro.build',
		tags: ['framework', 'static-site', 'islands', 'mdx'],
		builtWith: ['Cloudflare Pages', 'ImageKit'],
		usedFor: ['Marketing site', 'Blog (Field Notes)', 'Docs', 'Anything mostly static'],
		usedAgainst: 'Heavily-interactive app shells. We use Vite + React there.',
		bestFeature: 'Islands architecture — every component is opt-in JS.',
		watchOut: 'Plugin ecosystem is younger. Some integrations need elbow grease.',
	},
	{
		slug: 'cloudflare-pages',
		name: 'Cloudflare Pages',
		vendor: 'Cloudflare',
		verified: true,
		category: 'Build',
		type: 'SaaS',
		pricing: 'Free',
		frequency: 'Daily',
		cost: 'Free tier',
		inUseSince: 'Feb 2025',
		inUseSinceShort: "Feb '25",
		lead: 'Rahul Juneja',
		titleAccent: 'forget',
		titlePhrase: 'Cloudflare Pages — hosting we forget exists.',
		tagline: "Hosting we forget exists. That's the compliment.",
		one: 'Git-connected static + edge functions hosting on the Cloudflare network.',
		why: 'Deploys are silent. Bills are too.',
		replaced: 'Vercel',
		replacedNote: 'for our marketing site',
		altsTo: ['Vercel'],
		link: 'pages.cloudflare.com',
		tags: ['hosting', 'edge', 'static', 'cdn', 'deploys'],
		builtWith: ['Astro', 'GitHub Actions'],
		usedFor: ['Marketing deploys', 'Preview branches', 'Edge redirects', 'Image transforms'],
		usedAgainst: 'Long-running backends. Workers fit better there.',
		bestFeature: 'You connect a repo, you forget about hosting forever.',
		watchOut: 'Build limits on the free plan are real for big monorepos.',
	},
	{
		slug: 'imagekit',
		name: 'ImageKit',
		vendor: 'ImageKit.io',
		verified: true,
		category: 'Media',
		type: 'SaaS',
		pricing: 'Flat',
		frequency: 'Daily',
		cost: '$49/mo',
		inUseSince: 'Apr 2024',
		inUseSinceShort: "Apr '24",
		lead: 'Rahul Juneja',
		titleAccent: 'every',
		titlePhrase: 'ImageKit — one URL, every image.',
		tagline: 'DAM + transformation CDN. One URL = every image variant.',
		one: 'Asset library with on-the-fly resize, crop, and format on the URL.',
		why: 'No more manually exporting PNG/WebP/AVIF for every breakpoint.',
		replaced: 'Cloudinary',
		replacedNote: 'a self-rolled mess',
		altsTo: ['Cloudinary'],
		link: 'imagekit.io',
		tags: ['dam', 'cdn', 'images', 'transformations', 'webp'],
		builtWith: ['Astro', 'Cloudflare Pages'],
		usedFor: ['Marketing imagery', 'Studio output delivery', 'Social cropping', 'Auto WebP/AVIF'],
		usedAgainst: 'Raw originals — we keep those in object storage.',
		bestFeature: "URL-based transforms. Change `w-800` to `w-1600` and you're done.",
		watchOut: 'CDN bills creep. Set sane caching defaults.',
	},
	{
		slug: 'notion',
		name: 'Notion',
		vendor: 'Notion Labs',
		verified: true,
		category: 'Ops',
		type: 'SaaS',
		pricing: 'Per-seat',
		frequency: 'Daily',
		cost: '$10/seat/mo',
		inUseSince: 'Aug 2023',
		inUseSinceShort: "Aug '23",
		lead: 'Rahul Juneja',
		titleAccent: 'before',
		titlePhrase: 'Notion — where briefs live before agents read them.',
		tagline: 'Where the briefs live before the agents read them.',
		one: "Wiki + database hybrid. Our company's shared brain.",
		why: 'Agents read it via API; humans edit it via GUI.',
		replaced: 'Google Docs',
		altsTo: ['Google Docs'],
		link: 'notion.so',
		tags: ['wiki', 'database', 'docs', 'briefs'],
		builtWith: ['Claude', 'n8n', 'Attio'],
		usedFor: ['Project briefs', 'Meeting notes', 'Roadmap', 'Feeding context to agents'],
		usedAgainst: 'Real-time collab on the same paragraph. Use Google Docs for that.',
		bestFeature: 'Databases. Every brief becomes a row our agents can query.',
		watchOut: 'Pages get sprawly. Audit the wiki monthly or it rots.',
	},
	{
		slug: 'cal-com',
		name: 'Cal.com',
		vendor: 'Cal.com',
		verified: true,
		category: 'Comms',
		type: 'Open Source',
		pricing: 'Free',
		frequency: 'Weekly',
		cost: 'Free · OSS',
		inUseSince: 'Jun 2024',
		inUseSinceShort: "Jun '24",
		lead: 'Rahul Juneja',
		titleAccent: 'inside',
		titlePhrase: 'Cal.com — booking that lives inside our app.',
		tagline: 'Open-source booking. Embeds inside our own dialog.',
		one: "Calendly-equivalent that's open source and self-hostable.",
		why: 'We can wrap it in our own UI and not feel like we sold a click.',
		replaced: 'Calendly',
		altsTo: ['Calendly'],
		link: 'cal.com',
		tags: ['scheduling', 'booking', 'embeds'],
		builtWith: ['Attio', 'n8n'],
		usedFor: [
			'Discovery calls',
			'Internal scheduling',
			'Embedded "Book a call" CTAs',
			'Webhook into Attio',
		],
		usedAgainst: "High-volume booking. We'd look at hosted Cal Cloud if it grows.",
		bestFeature: 'Embeds via iframe + postMessage — no Calendly chrome leaking in.',
		watchOut: 'Self-host requires care on timezones and DB upgrades.',
	},
	{
		slug: 'attio',
		name: 'Attio',
		vendor: 'Attio',
		verified: true,
		category: 'Ops',
		type: 'SaaS',
		pricing: 'Per-seat',
		frequency: 'Weekly',
		cost: '$34/seat/mo',
		inUseSince: 'Nov 2024',
		inUseSinceShort: "Nov '24",
		lead: 'Rahul Juneja',
		titleAccent: 'drive',
		titlePhrase: 'Attio — a CRM an agent can drive.',
		tagline: 'CRM that an AI agent can actually drive.',
		one: 'Modern CRM with a clean API and a pleasant data model.',
		why: 'Our Outreach agent writes to it without screaming.',
		replaced: 'HubSpot',
		replacedNote: 'free tier',
		altsTo: ['HubSpot'],
		link: 'attio.com',
		tags: ['crm', 'sales', 'pipeline', 'api-first'],
		builtWith: ['n8n', 'Claude', 'Cal.com'],
		usedFor: ['Lead pipeline', 'Deal tracking', 'Agent-driven enrichment', 'Sales notes'],
		usedAgainst: 'Marketing automation. We do that elsewhere.',
		bestFeature: 'The schema. You can model your business, not theirs.',
		watchOut: 'Pricing scales fast at seat count. Plan it.',
	},
	{
		slug: 'n8n',
		name: 'n8n',
		vendor: 'n8n.io',
		verified: true,
		category: 'Ops',
		type: 'Self-hosted',
		pricing: 'Free',
		frequency: 'Weekly',
		cost: 'Self-host · Free',
		inUseSince: 'Jul 2024',
		inUseSinceShort: "Jul '24",
		lead: 'Rahul Juneja',
		titleAccent: 'between',
		titlePhrase: 'n8n — the glue between our agents.',
		tagline: 'Glue between agents. Node-based, self-hostable.',
		one: 'Node-based workflow automation. Self-host it, own your data.',
		why: 'Agents need a postman. n8n is ours.',
		replaced: 'Zapier',
		altsTo: ['Zapier'],
		link: 'n8n.io',
		tags: ['automation', 'workflows', 'no-code', 'glue'],
		builtWith: ['Claude', 'Notion', 'Attio'],
		usedFor: [
			'Webhook routing',
			'Notion ↔ Attio sync',
			'Slack notifications',
			'Cron jobs for agents',
		],
		usedAgainst: 'High-throughput pipelines. Use a real queue there.',
		bestFeature: "Self-hostable. Your data doesn't leak through a vendor.",
		watchOut: 'Versioning workflows is fiddly. Export them to git.',
	},
	{
		slug: 'canva',
		name: 'Canva',
		vendor: 'Canva',
		verified: false,
		category: 'Media',
		type: 'SaaS',
		pricing: 'Per-seat',
		frequency: 'Sometimes',
		cost: '$15/seat/mo',
		inUseSince: 'May 2023',
		inUseSinceShort: "May '23",
		lead: 'Rahul Juneja',
		titleAccent: 'before',
		titlePhrase: 'Canva — a deck out the door before lunch.',
		tagline: 'When we need a deck out the door before lunch.',
		one: 'Drag-drop design tool. Templates for everything.',
		why: 'Speed beats polish for internal decks.',
		replaced: 'Figma',
		replacedNote: 'for non-design work',
		altsTo: ['Figma'],
		link: 'canva.com',
		tags: ['design', 'templates', 'decks', 'social-cards'],
		builtWith: ['ImageKit'],
		usedFor: ['Internal decks', 'Quick social cards', 'One-off PDFs', 'Speaker bios'],
		usedAgainst: 'Anything that ships to a customer-facing surface.',
		bestFeature: 'Brand kit. Drop in colors + fonts and templates respect them.',
		watchOut: 'Template-look is real. Customise or it screams "Canva".',
	},
];

export interface VaultStackItem {
	slug: string;
	rank: number;
	role: string;
	badge: 'Core' | 'Glue' | 'Pair' | 'Source' | 'Tactical';
	note: string;
}

export interface VaultStack {
	slug: string;
	name: string;
	titleAccent: string;
	titlePhrase: string;
	blurb: string;
	overview: string;
	accent: string;
	accentName: string;
	eyebrow: string;
	deals: number;
	savings: string | null;
	items: VaultStackItem[];
}

export const VAULT_STACKS: VaultStack[] = [
	{
		slug: 'agent-stack',
		name: 'Our Agent Stack',
		titleAccent: 'wire',
		titlePhrase: 'How we wire LLMs into a company.',
		blurb: 'How we wire LLMs into the company.',
		overview:
			'Four tools, one loop. The brief lives in Notion, an agent in Claude reads it, the code lands in Cursor, and n8n keeps everything in sync without a person clicking refresh.',
		accent: '#1e7e72',
		accentName: 'teal',
		eyebrow: 'AI · Build · Ops',
		deals: 0,
		savings: null,
		items: [
			{
				slug: 'claude',
				rank: 1,
				role: 'The model',
				badge: 'Core',
				note: 'The reasoning we trust for production work.',
			},
			{
				slug: 'cursor',
				rank: 2,
				role: 'The editor',
				badge: 'Core',
				note: "Where the agent's diffs land before they ship.",
			},
			{
				slug: 'n8n',
				rank: 3,
				role: 'The glue',
				badge: 'Glue',
				note: 'Routes events between Notion, Claude, and Attio.',
			},
			{
				slug: 'notion',
				rank: 4,
				role: 'The shared brain',
				badge: 'Source',
				note: 'Briefs in. Agents read. Decisions logged.',
			},
		],
	},
	{
		slug: 'marketing-stack',
		name: 'Our Marketing Stack',
		titleAccent: 'static',
		titlePhrase: 'Static-first sites. Opinionated tools.',
		blurb: 'Static-first sites, opinionated tools.',
		overview:
			'Astro builds it, Cloudflare ships it, ImageKit handles every variant of every photo. Canva is the escape hatch for decks that need to be out the door before lunch.',
		accent: '#3a6f8a',
		accentName: 'steel',
		eyebrow: 'Build · Media',
		deals: 0,
		savings: null,
		items: [
			{
				slug: 'astro',
				rank: 1,
				role: 'The framework',
				badge: 'Core',
				note: 'Markdown to deploy in under a minute.',
			},
			{
				slug: 'cloudflare-pages',
				rank: 2,
				role: 'The host',
				badge: 'Core',
				note: 'Hosting that gets out of the way.',
			},
			{
				slug: 'imagekit',
				rank: 3,
				role: 'The image CDN',
				badge: 'Pair',
				note: 'One URL, every breakpoint, every format.',
			},
			{
				slug: 'canva',
				rank: 4,
				role: 'The escape hatch',
				badge: 'Tactical',
				note: "For decks the design team won't touch.",
			},
		],
	},
	{
		slug: 'ops-stack',
		name: 'Our Ops Stack',
		titleAccent: 'become',
		titlePhrase: 'Where briefs become tickets become done.',
		blurb: 'Where briefs become tickets become done.',
		overview:
			'Notion is the wiki. Attio is the CRM. Cal.com books the call. n8n stitches them so a discovery call auto-creates a deal and a project page — no human required.',
		accent: '#5a4a8a',
		accentName: 'indigo',
		eyebrow: 'Ops · Comms',
		deals: 0,
		savings: null,
		items: [
			{
				slug: 'notion',
				rank: 1,
				role: 'The wiki',
				badge: 'Core',
				note: 'Where every brief, decision, and post-mortem lives.',
			},
			{
				slug: 'attio',
				rank: 2,
				role: 'The CRM',
				badge: 'Core',
				note: 'A pipeline our agents can write to safely.',
			},
			{
				slug: 'cal-com',
				rank: 3,
				role: 'The booker',
				badge: 'Pair',
				note: 'Embedded in our app — no Calendly chrome.',
			},
			{
				slug: 'n8n',
				rank: 4,
				role: 'The glue',
				badge: 'Glue',
				note: 'Keeps Notion, Attio, and Cal.com in lockstep.',
			},
		],
	},
];

export interface VaultRanking {
	slug: string;
	title: string;
	subtitle: string;
	items: { rank: number; slug: string; badge: 'Pick' | 'Recommended' | null; note: string }[];
}

export const VAULT_RANKINGS: VaultRanking[] = [
	{
		slug: 'best-build',
		title: 'Best Build tools at a glance',
		subtitle: '4 picks · ranked by daily use',
		items: [
			{ rank: 1, slug: 'cursor', badge: 'Pick', note: 'Best AI-native IDE for shipping.' },
			{ rank: 2, slug: 'astro', badge: 'Recommended', note: 'Fastest path from markdown to prod.' },
			{ rank: 3, slug: 'cloudflare-pages', badge: null, note: 'Hosting that gets out of the way.' },
			{ rank: 4, slug: 'imagekit', badge: null, note: 'Pair with Astro to forget about images.' },
		],
	},
];

export const VAULT_FACETS = [
	{ id: 'category', label: 'Category', values: ['AI', 'Build', 'Ops', 'Media', 'Comms'] },
	{ id: 'type', label: 'Type', values: ['SaaS', 'Open Source', 'Self-hosted', 'Hybrid'] },
	{ id: 'pricing', label: 'Pricing', values: ['Free', 'Per-seat', 'Flat', 'Usage-based'] },
	{ id: 'frequency', label: 'Use', values: ['Daily', 'Weekly', 'Sometimes'] },
] as const;

export const VAULT_ALL_TAGS = [...new Set(VAULT_TOOLS.flatMap((t) => t.tags))].sort();

// Flip to true once we negotiate a real vendor discount.
export const VAULT_FEATURES = {
	showDeals: false,
};

// ── Logomark colour map (vendor brand tints, used for letter marks) ───────
export const LOGO_TINTS: Record<string, { letter: string; tint: string }> = {
	Claude: { letter: 'C', tint: '#d97757' },
	Cursor: { letter: 'C', tint: '#e5e5e5' },
	Astro: { letter: 'A', tint: '#ff5d01' },
	'Cloudflare Pages': { letter: 'CF', tint: '#f6821f' },
	Cloudflare: { letter: 'CF', tint: '#f6821f' },
	ImageKit: { letter: 'IK', tint: '#22c55e' },
	Notion: { letter: 'N', tint: '#e5e5e5' },
	'Cal.com': { letter: 'C', tint: '#e5e5e5' },
	Attio: { letter: 'A', tint: '#9ca3af' },
	n8n: { letter: 'n8', tint: '#ff5252' },
	Canva: { letter: 'C', tint: '#7c3aed' },
	// alternatives
	ChatGPT: { letter: 'GPT', tint: '#10a37f' },
	'VS Code': { letter: 'VS', tint: '#3b82f6' },
	'Next.js': { letter: 'NX', tint: '#e5e5e5' },
	Vercel: { letter: 'V', tint: '#e5e5e5' },
	Cloudinary: { letter: 'CL', tint: '#3448c5' },
	'Google Docs': { letter: 'G', tint: '#3b82f6' },
	Calendly: { letter: 'C', tint: '#1e90ff' },
	HubSpot: { letter: 'H', tint: '#ff7a59' },
	Zapier: { letter: 'Z', tint: '#ff4f00' },
	Figma: { letter: 'F', tint: '#a855f7' },
	'GitHub Actions': { letter: 'GH', tint: '#e5e5e5' },
};

export function getTool(slug: string): VaultTool | undefined {
	return VAULT_TOOLS.find((t) => t.slug === slug);
}

export function getStack(slug: string): VaultStack | undefined {
	return VAULT_STACKS.find((s) => s.slug === slug);
}
