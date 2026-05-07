import type { NavConfig } from '../types/navigation';

const main: NavConfig = {
	navGroups: [
		{
			id: 'agent-lab',
			label: 'Agent Lab',
			href: '/coming-soon',
			caption: 'Six agents we run on: Outreach, Strategy, Finance. Yours next.',
		},
		{
			id: 'nexai-studio',
			label: 'NexAI Studio',
			href: '/studio',
			caption: 'Mannequin in, on-model out. 3 days, 80% cheaper than a studio day.',
		},
		{
			id: 'prompt-hub',
			label: 'Prompt Hub',
			href: '/prompts',
			caption: 'Prompts that survived a month of real work. Copy, paste, ship.',
		},
		{
			id: 'app-vault',
			label: 'App Vault',
			href: '/apps',
			caption: 'Ten tools we run our company on. What each one replaced.',
		},
		{
			id: 'field-notes',
			label: 'Field Notes',
			href: '/blog',
			caption: "Essays on what shipped, what didn't, what we'd do again.",
		},
		{
			id: 'catch-us',
			label: 'Catch Us',
			href: 'https://cal.com/rahul-juneja/15min',
			caption: '15-minute call with Rahul. One question from us. One from you.',
		},
	],
	topHref: '/',
	brandAriaLabel: 'NexAI Labs home',
	socials: [
		{
			platform: 'instagram',
			href: 'https://www.instagram.com/nexailabs/',
			label: 'NexAI Labs on Instagram',
		},
		{
			platform: 'linkedin',
			href: 'https://www.linkedin.com/company/nexailabs/',
			label: 'NexAI Labs on LinkedIn',
		},
	],
};

const studio: NavConfig = {
	navGroups: [
		{
			id: 'images',
			label: 'Images',
			href: '/studio#showcase',
			caption: 'On-model stills, any category.',
			children: [
				{
					id: 'kurta-sets',
					label: 'Kurta Sets',
					href: '/studio#kurta-sets',
					caption: 'Kurtas, lehengas, and salwar suits.',
				},
				{
					id: 'western-wear',
					label: 'Western Wear',
					href: '/studio#western-wear',
					caption: 'Dresses, tops, and contemporary fits.',
				},
				{
					id: 'saree',
					label: 'Saree',
					href: '/studio#saree',
					caption: 'Drapes perfected by AI.',
				},
				{
					id: 'menswear',
					label: 'Menswear',
					href: '/studio#menswear',
					caption: 'Shirts, suits, and kurtas.',
				},
				{
					id: 'jewelry',
					label: 'Jewelry',
					href: '/studio#jewelry',
					caption: 'Rings, necklaces, and accessories.',
				},
				{
					id: 'cosmetics',
					label: 'Cosmetics',
					href: '/studio#cosmetics',
					caption: 'Beauty and skincare products.',
				},
			],
		},
		{
			id: 'videos',
			label: 'Videos',
			href: '/studio#motion',
			caption: 'Same product, in motion.',
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
	socials: [
		{
			platform: 'instagram',
			href: 'https://www.instagram.com/nexai.photoshoots/',
			label: 'NexAI Studio on Instagram',
		},
		{
			platform: 'linkedin',
			href: 'https://www.linkedin.com/company/nexailabs/',
			label: 'NexAI Labs on LinkedIn',
		},
	],
};

export const navConfigs: Record<string, NavConfig> = { main, studio };
