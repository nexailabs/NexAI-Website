import type { NavConfig } from '../types/navigation';

const main: NavConfig = {
	navGroups: [
		{
			id: 'agent-lab',
			label: 'Agent Lab',
			href: '/coming-soon',
			caption: 'Custom AI agents built for your workflow.',
		},
		{
			id: 'nexai-studio',
			label: 'NexAI Studio',
			href: '/studio',
			caption: 'AI-powered photoshoots for fashion brands.',
		},
		{
			id: 'prompt-hub',
			label: 'Prompt Hub',
			href: '/coming-soon',
			caption: 'Curated prompts, skills, and SOPs we swear by.',
		},
		{
			id: 'app-vault',
			label: 'App Vault',
			href: '/coming-soon',
			caption: 'The best AI tools we use and recommend.',
		},
		{
			id: 'ai-drops',
			label: 'AI Drops',
			href: '/coming-soon',
			caption: "Dispatches on what we're building and learning.",
		},
		{
			id: 'catch-us',
			label: 'Catch Us',
			href: '/coming-soon',
			caption: "Let's talk — no pitch decks, just coffee.",
		},
	],
	topHref: '/',
	brandAriaLabel: 'NexAI Labs home',
};

const studio: NavConfig = {
	navGroups: [
		{
			id: 'showcase',
			label: 'Showcase',
			href: '/studio/showcase',
			caption: 'AI photoshoot portfolio across categories',
			children: [
				{ id: 'ethnic-wear', label: 'Ethnic Wear', href: '/studio/showcase/ethnic-wear' },
				{ id: 'saree', label: 'Saree', href: '/studio/showcase/saree' },
				{ id: 'jewelry', label: 'Jewelry', href: '/studio/showcase/jewelry' },
				{ id: 'menswear', label: 'Menswear', href: '/studio/showcase/menswear' },
				{ id: 'unstitched', label: 'Unstitched', href: '/studio/showcase/unstitched' },
			],
		},
		{
			id: 'gallery',
			label: 'Gallery',
			href: '/studio/gallery',
			caption: 'Before & after transformations',
		},
		{
			id: 'nexai-labs',
			label: 'NexAI Labs',
			href: '/',
			caption: 'Back to our full AI product suite',
		},
	],
	topHref: '/studio',
	brandAriaLabel: 'NexAI Studio home',
};

export const navConfigs: Record<string, NavConfig> = { main, studio };
