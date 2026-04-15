// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.nexailabs.com',
	output: 'static',
	integrations: [sitemap()],
	markdown: {
		shikiConfig: {
			theme: 'css-variables',
			wrap: true,
		},
	},
	prefetch: {
		defaultStrategy: 'tap',
		prefetchAll: false,
	},
	experimental: {
		fonts: [
			{
				provider: fontProviders.fontsource(),
				name: 'Inter',
				cssVariable: '--font-inter',
				weights: [400, 600, 700, 800],
				styles: ['normal'],
				subsets: ['latin'],
			},
			{
				provider: fontProviders.fontsource(),
				name: 'Cormorant Garamond',
				cssVariable: '--font-cormorant',
				weights: [600],
				styles: ['normal', 'italic'],
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
		],
	},
});
