// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://nexailabs.com',
	integrations: [sitemap()],
	prefetch: true, // Enable prefetching for faster navigation
	experimental: {
		// View Transitions are stable in Astro 3+, but just in case we need flags
	},
});
