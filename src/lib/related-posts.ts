import { getCollection, type CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

const isVisible = (post: BlogPost) => (import.meta.env.PROD ? !post.data.draft : true);

export const relatedPosts = async (currentPost: BlogPost, limit = 3) => {
	const posts = await getCollection('blog', isVisible);
	const now = new Date();
	const currentTags = new Set(currentPost.data.tags);

	return posts
		.filter((post) => post.id !== currentPost.id)
		.map((post) => {
			const overlap = post.data.tags.filter((tag) => currentTags.has(tag)).length;
			const ageDays = (now.valueOf() - post.data.publishedAt.valueOf()) / (1000 * 60 * 60 * 24);
			const recencyBoost = Math.max(0, 120 - ageDays) / 120;
			const score = overlap * 3 + recencyBoost;
			return { post, score };
		})
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			return b.post.data.publishedAt.valueOf() - a.post.data.publishedAt.valueOf();
		})
		.slice(0, limit)
		.map(({ post }) => post);
};
