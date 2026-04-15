import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../../config/site';

export async function GET(context: { site?: string | URL }) {
	const posts = (await getCollection('blog', (p) => !p.data.draft))
		.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
		.slice(0, 20);
	return rss({
		title: 'NexAI Labs — Writing',
		description: 'Dispatches on what NexAI Labs is building and learning.',
		site: context.site ?? site.url,
		items: posts.map((p) => ({
			title: p.data.title,
			description: p.data.description,
			link: `/blog/${p.data.slug ?? p.id.replace(/^\d{4}-\d{2}-\d{2}-/, '')}/`,
			pubDate: p.data.publishedAt,
			categories: [p.data.category, ...p.data.tags],
		})),
		customData: '<language>en-us</language>',
	});
}
