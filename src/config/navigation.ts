import type { NavConfig } from '../types/navigation';

export const navConfigs: Record<string, NavConfig> = {
	main: {
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
	},
	studio: {
		navGroups: [
			{
				label: 'Showcase',
				href: '/studio/showcase',
				caption: 'AI photoshoot portfolio across categories.',
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
				caption: 'Before & after transformations.',
			},
			{
				label: 'NexAI Labs',
				href: '/',
				caption: 'Explore our full suite of AI products.',
			},
		],
		topHref: '/studio',
		brandAriaLabel: 'NexAI Studio home',
		panelId: 'studio-nav-takeover',
	},
};

export function resolveNavConfig(pathname: string): NavConfig {
	const section = pathname.split('/')[1] || 'main';
	return navConfigs[section] ?? navConfigs.main;
}
