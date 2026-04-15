export const APP_CATEGORIES = [
	'AI Writing',
	'AI Agents',
	'Vibe Coding',
	'Dev Tools',
	'Design',
	'Productivity',
	'Research',
	'Marketing',
	'Data & Analytics',
	'Creative / Media',
] as const;
export type AppCategory = (typeof APP_CATEGORIES)[number];

export const APP_PRICING = ['free', 'freemium', 'paid', 'open-source'] as const;
export type AppPricing = (typeof APP_PRICING)[number];

export const APP_PLATFORMS = [
	'web',
	'mac',
	'windows',
	'linux',
	'ios',
	'android',
	'cli',
	'api',
] as const;
export type AppPlatform = (typeof APP_PLATFORMS)[number];

export const APP_TAGS = [
	'llm',
	'rag',
	'agents',
	'image-gen',
	'video-gen',
	'voice',
	'automation',
	'notes',
	'browser',
	'terminal',
	'ide',
	'no-code',
	'analytics',
	'scraping',
	'email',
	'crm',
	'design-system',
	'prototyping',
	'docs',
	'search',
] as const;
export type AppTag = (typeof APP_TAGS)[number];

export interface AppEntry {
	slug: string;
	name: string;
	tagline: string;
	description: string;
	logo: string;
	screenshot?: string;
	category: AppCategory;
	tags: readonly AppTag[];
	pricing: AppPricing;
	platforms: readonly AppPlatform[];
	websiteUrl: string;
	affiliateUrl?: string;
	alternativeTo?: readonly string[];
	featured: boolean;
	addedAt: string;
	rating?: 1 | 2 | 3 | 4 | 5;
	rahulRank?: number;
	pros?: readonly string[];
	cons?: readonly string[];
	useCase?: string;
}

const proxy = (url: string) => `https://ik.imagekit.io/nexailabs/proxy/${encodeURIComponent(url)}`;

export const apps: readonly AppEntry[] = [
	{
		slug: 'claude',
		name: 'Claude',
		tagline: 'Reasoning-heavy assistant for writing, coding, and ops.',
		description:
			'Excellent for long-context planning, careful analysis, and agent workflows where instruction-following and structured output quality matter.',
		logo: proxy('https://www.anthropic.com/images/icons/apple-touch-icon.png'),
		category: 'AI Agents',
		tags: ['llm', 'agents', 'automation', 'docs'],
		pricing: 'paid',
		platforms: ['web', 'mac', 'windows', 'ios', 'android', 'api'],
		websiteUrl: 'https://claude.ai',
		featured: true,
		addedAt: '2026-04-15',
	},
	{
		slug: 'chatgpt',
		name: 'ChatGPT',
		tagline: 'General-purpose AI workspace for writing and ideation.',
		description:
			'Fast everyday copilot for drafting, brainstorming, and multimodal tasks, with a mature ecosystem of tools and model options.',
		logo: proxy('https://cdn.oaistatic.com/assets/favicon-miwirzcw.ico'),
		category: 'AI Writing',
		tags: ['llm', 'agents', 'voice', 'search'],
		pricing: 'freemium',
		platforms: ['web', 'mac', 'windows', 'ios', 'android', 'api'],
		websiteUrl: 'https://chatgpt.com',
		featured: true,
		addedAt: '2026-04-14',
	},
	{
		slug: 'cursor',
		name: 'Cursor',
		tagline: 'AI-native code editor built for fast shipping loops.',
		description:
			'Strong for vibe coding and repo-wide edits with inline chat, diff-aware workflows, and tooling tuned for daily software delivery.',
		logo: proxy('https://www.cursor.com/favicon.ico'),
		category: 'Vibe Coding',
		tags: ['ide', 'agents', 'automation', 'terminal'],
		pricing: 'freemium',
		platforms: ['mac', 'windows', 'linux'],
		websiteUrl: 'https://www.cursor.com',
		featured: true,
		addedAt: '2026-04-13',
	},
	{
		slug: 'codex-cli',
		name: 'Codex CLI',
		tagline: 'Terminal-first coding agent for repo-level execution.',
		description:
			'Best when you want fast command-line iteration, patch generation, and autonomous code changes directly where engineering work happens.',
		logo: proxy('https://openai.com/favicon.ico'),
		category: 'Vibe Coding',
		tags: ['agents', 'terminal', 'automation', 'ide'],
		pricing: 'free',
		platforms: ['cli'],
		websiteUrl: 'https://developers.openai.com/codex/cli',
		featured: true,
		addedAt: '2026-04-12',
	},
	{
		slug: 'linear',
		name: 'Linear',
		tagline: 'Issue tracking that keeps product and engineering aligned.',
		description:
			'A clean execution layer for sprint planning, bug triage, and roadmap flow when speed and clear ownership are non-negotiable.',
		logo: proxy('https://linear.app/favicon.ico'),
		category: 'Productivity',
		tags: ['automation', 'docs', 'analytics'],
		pricing: 'freemium',
		platforms: ['web', 'mac', 'windows', 'ios'],
		websiteUrl: 'https://linear.app',
		featured: false,
		addedAt: '2026-04-11',
	},
	{
		slug: 'notion',
		name: 'Notion',
		tagline: 'Docs, wikis, and project spaces in one living workspace.',
		description:
			'Flexible for SOPs, research notes, and team knowledge bases, especially when you need structure without heavyweight setup.',
		logo: proxy('https://www.notion.so/images/favicon.ico'),
		category: 'Productivity',
		tags: ['notes', 'docs', 'search', 'automation'],
		pricing: 'freemium',
		platforms: ['web', 'mac', 'windows', 'ios', 'android'],
		websiteUrl: 'https://www.notion.so',
		featured: false,
		addedAt: '2026-04-10',
	},
	{
		slug: 'framer',
		name: 'Framer',
		tagline: 'Design and ship polished marketing sites without friction.',
		description:
			'Great for high-velocity landing pages, motion-rich layouts, and web experiences where visual quality and launch speed both matter.',
		logo: proxy('https://www.framer.com/favicon.ico'),
		category: 'Design',
		tags: ['design-system', 'prototyping', 'no-code'],
		pricing: 'freemium',
		platforms: ['web'],
		websiteUrl: 'https://www.framer.com',
		featured: false,
		addedAt: '2026-04-09',
	},
	{
		slug: 'figma',
		name: 'Figma',
		tagline: 'Collaborative product design and handoff standard.',
		description:
			'Our default for interface design, component systems, and fast design reviews with product and engineering in the same file.',
		logo: proxy('https://static.figma.com/app/icon/1/favicon.png'),
		category: 'Design',
		tags: ['design-system', 'prototyping', 'docs'],
		pricing: 'freemium',
		platforms: ['web', 'mac', 'windows'],
		websiteUrl: 'https://www.figma.com',
		featured: false,
		addedAt: '2026-04-08',
	},
	{
		slug: 'v0-by-vercel',
		name: 'v0 by Vercel',
		tagline: 'Prompt-to-UI generation for rapid front-end direction.',
		description:
			'Useful for quickly exploring layout directions and generating production-leaning UI scaffolds before refining in your main codebase.',
		logo: proxy('https://v0.dev/favicon.ico'),
		category: 'Vibe Coding',
		tags: ['ide', 'no-code', 'prototyping', 'agents'],
		pricing: 'freemium',
		platforms: ['web'],
		websiteUrl: 'https://v0.dev',
		featured: false,
		addedAt: '2026-04-07',
	},
	{
		slug: 'raycast',
		name: 'Raycast',
		tagline: 'Command center for keyboard-native productivity on Mac.',
		description:
			'Central launcher for snippets, links, scripts, and AI commands that reduces context switching throughout the entire workday.',
		logo: proxy('https://www.raycast.com/favicon.ico'),
		category: 'Productivity',
		tags: ['automation', 'notes', 'search', 'docs'],
		pricing: 'freemium',
		platforms: ['mac'],
		websiteUrl: 'https://www.raycast.com',
		featured: false,
		addedAt: '2026-04-06',
	},
];
