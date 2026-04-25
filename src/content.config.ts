import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		// One word or short phrase inside `title` to render in italic Cormorant.
		emphasis: z.string().optional(),
		category: z.enum([
			'Playbook',
			'Outreach',
			'Marketing',
			'Research',
			'Finance',
			'Creatives',
			'Strategy',
		]),
		date: z.date(),
		read: z.string(),
		excerpt: z.string(),
		// Cover tile composition 0–5 (B&W editorial, no colour).
		seed: z.number().int().min(0).max(5),
		author: z.string().default('Rahul Juneja'),
		authorRole: z.string().default('Founder'),
		draft: z.boolean().default(false),
		featured: z.boolean().default(false),
		description: z.string().optional(),
	}),
});

export const collections = { blog };
