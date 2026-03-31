import type { NavConfig } from '../types/navigation';

const main: NavConfig = {
	navGroups: [
		{
			label: 'Agent Lab',
			href: '/coming-soon',
			caption: 'Custom AI agents built for your workflow.',
		},
		{
			label: 'NexAI Studio',
			href: '/studio',
			caption: 'AI-powered photoshoots for fashion brands.',
		},
		{
			label: 'Prompt Hub',
			href: '/coming-soon',
			caption: 'Curated prompts, skills, and SOPs we swear by.',
		},
		{
			label: 'App Vault',
			href: '/coming-soon',
			caption: 'The best AI tools we use and recommend.',
		},
		{
			label: 'AI Drops',
			href: '/coming-soon',
			caption: "Dispatches on what we're building and learning.",
		},
		{
			label: 'Catch Us',
			href: '/coming-soon',
			caption: "Let's talk — no pitch decks, just coffee.",
		},
	],
	topHref: '#top',
	brandAriaLabel: 'NexAI Labs home',
};

const studio: NavConfig = {
	navGroups: [
		{
			label: 'Showcase',
			href: '/studio/showcase',
			caption: 'AI photoshoot portfolio across categories',
			children: [
				{ label: 'Ethnic Wear', href: '/studio/showcase/ethnic-wear' },
				{ label: 'Saree', href: '/studio/showcase/saree' },
				{ label: 'Jewelry', href: '/studio/showcase/jewelry' },
				{ label: 'Menswear', href: '/studio/showcase/menswear' },
				{ label: 'Unstitched', href: '/studio/showcase/unstitched' },
			],
		},
		{
			label: 'Gallery',
			href: '/studio/gallery',
			caption: 'Before & after transformations',
		},
		{
			label: 'NexAI Labs',
			href: '/',
			caption: 'Back to our full AI product suite',
		},
	],
	topHref: '/studio',
	brandAriaLabel: 'NexAI Studio home',
};

export const navConfigs: Record<string, NavConfig> = { main, studio };
