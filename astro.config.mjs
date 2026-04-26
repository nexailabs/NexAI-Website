// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.nexailabs.com',
	output: 'static',
	integrations: [
		sitemap({
			filter: (page) =>
				!page.includes('/coming-soon') &&
				!page.includes('/prompts/empty') &&
				!page.includes('/apps/empty'),
		}),
	],
	prefetch: {
		defaultStrategy: 'tap',
		prefetchAll: false,
	},
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Inter',
			cssVariable: '--font-inter',
			weights: [400, 500, 600, 700, 800],
			styles: ['normal'],
			subsets: ['latin'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Montserrat',
			cssVariable: '--font-montserrat',
			weights: [600, 700],
			styles: ['normal'],
			subsets: ['latin'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Plus Jakarta Sans',
			cssVariable: '--font-jakarta',
			weights: [400, 500, 600, 700],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
		},
	],
});
