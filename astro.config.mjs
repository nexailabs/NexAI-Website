// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.nexailabs.com',
	output: 'static',
	integrations: [sitemap()],
	prefetch: {
		defaultStrategy: 'tap',
		prefetchAll: false,
	},
});
