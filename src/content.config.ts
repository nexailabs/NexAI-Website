import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CATEGORIES = ['Notes', 'Case Study', 'Research', 'Tutorial', 'Announcement'] as const;

const TAGS = [
	'agents',
	'workflows',
	'automation',
	'llm',
	'evals',
	'rag',
	'tools',
	'api',
	'security',
	'ops',
	'infrastructure',
	'observability',
	'design',
	'ux',
	'engineering',
	'business',
	'strategy',
	'case-study',
] as const;

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string().min(4).max(120),
		description: z.string().min(20).max(240),
		slug: z.string().optional(),
		publishedAt: z.coerce.date(),
		updatedAt: z.coerce.date().optional(),
		draft: z.boolean().default(false),
		author: z.object({
			name: z.string().min(2),
			title: z.string().optional(),
			avatar: z.string().url().optional(),
		}),
		category: z.enum(CATEGORIES).default('Notes'),
		tags: z.array(z.enum(TAGS)).max(5).default([]),
		cover: z.object({
			src: z.string().url(),
			alt: z.string().min(4),
			credit: z.string().optional(),
		}),
		readingTime: z.number().int().positive().optional(),
		ogImage: z.string().url().optional(),
	}),
});

export const collections = { blog };
