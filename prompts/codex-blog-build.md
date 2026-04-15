# Codex build prompt — NexAI Labs blog (Phase 1)

Build the NexAI Labs `/blog` section on the existing Astro 5 marketing site. This is a production build for a site that ships 3-4 posts per week (~200 posts/year), so the architecture must scale but Phase 1 ships the smallest surface that plugs into nav, footer, homepage, RSS, and sitemap. The site is static, hosted on Cloudflare Pages, uses vanilla CSS with design tokens in `src/styles/global.css`, and has zero frontend frameworks (no React, Vue, Svelte, Tailwind). You will reuse `src/layouts/Layout.astro` (it already has a `head` slot, SEO meta, and a Cal.com dialog — do not touch the dialog). Uniform template discipline is non-negotiable: every post uses the same layout, same prose width, same chrome. No per-post layout modes, no per-post CSS, no per-post accent colors.

---

## 1. Locked decisions — use these defaults, do not stop to ask

All decisions are locked. Start by creating branch `feat/blog-phase-1` off `main` and proceed straight to the Phase 1 scope in §2. Rahul will edit values after PR 1 lands if anything needs tweaking — treat everything in this section as live, not as a questionnaire.

1. **Categories (frozen, append-only enum):** `['Notes', 'Case Study', 'Research', 'Tutorial', 'Announcement']`.
2. **Tags (frozen, append-only enum, 18 values):** `agents, workflows, automation, llm, evals, rag, tools, api, security, ops, infrastructure, observability, design, ux, engineering, business, strategy, case-study`.
3. **ImageKit:** covers live under `nexailabs/blog/` on endpoint `https://ik.imagekit.io/nexailabs`. Document this path in `AUTHORING.md`.
4. **Seed content:** ship ONE dummy seed post titled _"Hello from the NexAI blog"_, ~600 words of lorem-style placeholder prose that exercises every style in the template — one cover image (pick any ImageKit-hosted placeholder), one inline figure, one fenced code block, one blockquote, one H2 and one H3, one bullet list, one ordered list, one inline link. Its only job is to validate the template end-to-end. Rahul replaces it with the first real post after PR 1 lands. Use `publishedAt: '2026-04-15'`, `category: 'Notes'`, `tags: ['agents', 'workflows']`, `author.name: 'Rahul Juneja'`, `draft: false`.
5. **Shiki theme:** `css-variables`. Define token colors under `.prose pre` in `src/styles/global.css` — match the existing dark surface palette (see §8 prose block). No inline per-token `style` attributes in the HTML.
6. **Frontmatter lint (hard-block on missing):** `title`, `description`, `publishedAt`, `author.name`, `cover.src`, `cover.alt`, `category`. Everything else is optional. The lint hook runs via husky pre-commit and fails the commit — not just the build.

If any of these values turn out to be wrong after PR 1 ships, they're all 1-line edits. Do not treat them as blockers. Start coding now.

---

## 2. Phase 1 scope — ship in this PR

Everything in this list ships together. No staging across PRs.

1. Content collection with frozen Zod schema at `src/content.config.ts`, plain Markdown (not MDX).
2. `src/content/blog/_template.md` (underscore-prefixed, excluded from the glob) + one dummy seed post per §1 item 4, using the `YYYY-MM-DD-slug.md` naming convention.
3. `src/pages/blog/[...page].astro` — index + pagination via Astro's `paginate()` helper, 12 posts per page, no `/blog/1` alias.
4. `src/pages/blog/[slug].astro` — single article template.
5. `src/pages/blog/archive.astro` — flat, unpaginated per-year list (SEO crawl surface).
6. `src/pages/blog/rss.xml.ts` — RSS 2.0 feed capped at the 20 most recent non-draft posts. Install `@astrojs/rss`.
7. Thirteen new components under `src/components/blog/` plus one new `src/components/home/HomeLatestWriting.astro` strip for the homepage.
8. Append the `.prose` block (Section 8 below) to `src/styles/global.css`. Do not invent new tokens.
9. Wire navbar (`src/config/navigation.ts`), footer (`src/components/Footer.astro`), homepage (`src/pages/index.astro`), and RSS `<link rel="alternate">` in `Layout.astro` head.
10. Delete `public/_redirects` lines 9-10 (the two that currently 301 `/blog` and `/blog/*` to `/`).
11. `BlogPosting` + `Blog` + `BreadcrumbList` JSON-LD on article and index pages via `slot="head"`.
12. Helpers: `src/lib/reading-time.ts` (200 wpm) and `src/lib/related-posts.ts` (tag-overlap + recency scorer).
13. `AUTHORING.md` at repo root — how to create a post, upload covers, preview drafts, publish.
14. Frontmatter lint hook — Node script run via husky pre-commit that fails if any required field from §1 item 6 is missing on any file in `src/content/blog/`.

Phase 1 does not include: MDX, tag archive pages, Pagefind search, authors collection, comments, share buttons, newsletter embeds. Those are Phase 2.

---

## 3. Phase 2 scope — specify now, build later (not in this PR)

Phase 2 lands in a separate PR after Phase 1 is shipped and at least five posts are live. Do not implement any of this now. The specification exists here only so Phase 1 does not paint Phase 2 into a corner.

### 3.1 MDX conversion

- Install `@astrojs/mdx` and register it in `astro.config.mjs`.
- Change `src/content.config.ts` glob pattern from `**/*.md` to `**/*.{md,mdx}`.
- Existing Phase 1 posts stay as plain `.md` — they opt in to richer blocks only by renaming to `.mdx`.
- Schema stays identical. No new frontmatter fields are introduced.

### 3.2 Eleven MDX component kit

Build these as new files under `src/components/blog/mdx/`. Each is a dark-themed, vanilla-CSS Astro component that slots into a post's prose. One-sentence spec each:

1. **`YouTubeEmbed.astro`** — lite-YT facade: static poster image + play button that swaps to the real iframe on click.
2. **`VideoEmbed.astro`** — self-hosted `<video>` with `preload="metadata"`, custom poster, native controls, lazy intersection-observer attach.
3. **`Figure.astro`** — ImageKit `<img>` + figcaption + optional `credit` line, enforces non-empty `alt`, obeys 65ch column.
4. **`Gallery.astro`** — 2- or 3-column image grid inside the prose column with equal row gaps and aspect-ratio enforcement.
5. **`FullBleed.astro`** — breakout wrapper that escapes the 65ch column using negative-margin + viewport-width math, lets any child span the full viewport.
6. **`Callout.astro`** — `variant: 'note' | 'warn' | 'tip'`, teal left border for note/tip, amber for warn, renders slot contents.
7. **`PullQuote.astro`** — oversized Cormorant Garamond italic quote at ~2rem, centered, with optional attribution.
8. **`StatGrid.astro`** — 2-4 column grid of big numbers + small labels for metrics displays.
9. **`InlineCTA.astro`** — boxed "book a call" CTA that uses the existing `data-open-cal` attribute to trigger the site-wide Cal.com dialog. Do not re-embed Cal.
10. **`EmbedFrame.astro`** — sandboxed `<iframe>` wrapper with `loading="lazy"`, `sandbox="allow-scripts allow-same-origin"`, aspect-ratio prop, for CodePen/Figma/Loom embeds.
11. **`BeforeAfter.astro`** — draggable slider comparing two ImageKit images, vanilla JS pointer events, respects reduced motion.

### 3.3 Other Phase 2 items

- `/blog/tag/[tag].astro` static tag archive pages via `getStaticPaths()`.
- Pagefind static search mounted at `/blog` (~10 min setup).
- Promote `author` to a real `authors` collection if ≥2 recurring authors exist.

### 3.4 Explicitly rejected from the competing plan

The following ideas from ChatGPT's "controlled freedom" proposal are **rejected** and must not appear in Phase 1 or Phase 2:

- **`layoutMode` frontmatter** (`standard` / `editorial` / `immersive`). Rejected. One template for all posts.
- **Per-post `accent`, `chrome`, `proseWidth` overrides.** Rejected. These create visual sprawl at 200 posts.
- **Per-post CSS files** or `style` frontmatter blocks. Rejected. All styling lives in `global.css` and component `<style>` blocks.
- **Per-post dark/light mode toggle.** Rejected. Dark-only site.

If a future post genuinely needs a different layout, it gets a new `/essays/<slug>` route, not a layoutMode flag.

---

## 4. Schema — exact Zod shape

Create `src/content.config.ts` with this file contents exactly. Do not add layout fields. Do not add accent fields. The enum contents are locked in §1 items 1 and 2 — use them verbatim.

```ts
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
```

Schema rules:

- `cover.src` is a full ImageKit URL with no `?tr=` suffix. Transforms are applied at render time in `BlogCard.astro` and `PostHeader.astro` using the existing `tr` presets from `src/config/imagekit.ts`.
- `readingTime` is optional; when absent, compute it from body text at 200 wpm via `src/lib/reading-time.ts`.
- `ogImage` defaults to `${cover.src}${tr.og}` when absent.
- Drafts are filtered out in production using `import.meta.env.PROD ? !p.data.draft : true` inside every `getCollection('blog', ...)` call.
- Underscore-prefixed files (`_template.md`) are excluded by the `glob` loader automatically.

---

## 5. Component list — thirteen blog components

Create all thirteen files under `src/components/blog/`. One-line responsibility each:

1. `BlogHero.astro` — page hero for `/blog`: eyebrow + italic `section-title` + sub-copy. Reuses `.section-eyebrow` / `.section-title` utilities from homepage.
2. `BlogGrid.astro` — responsive 3/2/1 column shell. Takes `posts[]`, renders `BlogCard` with `variant="default"`.
3. `BlogCard.astro` — single preview card. Props: `{ post, variant: 'default' | 'compact' | 'related' }`. Image top (16:10 aspect-ratio), uppercase meta line `category · date`, title, 2-line clamped excerpt (default only).
4. `BlogPagination.astro` — prev / next buttons. Hidden when only one page exists. Reuses `.btn-ghost` utility.
5. `BlogArchive.astro` — flat per-year list rendered by `/blog/archive.astro`. No images, no excerpts.
6. `PostHeader.astro` — article hero: breadcrumb, cover image (full-bleed), h1 title, meta row (`date · author · reading time · category`). Injects `<link rel="prev">` / `<link rel="next">` into the head slot.
7. `PostBody.astro` — wraps the default slot in `<article class="prose">...</article>` at 65ch max-width.
8. `PostToc.astro` — right-rail sticky TOC. Client script walks `h2`/`h3` inside `.prose`, highlights the active section via IntersectionObserver. Hidden below 1100px viewport width. Renders nothing when the post has fewer than 3 `h2` headings.
9. `PostPrevNext.astro` — previous / next chronological post links at the bottom of the article.
10. `PostFooter.astro` — composes `PostPrevNext` + `RelatedPosts` + a Cal.com CTA button using `data-open-cal`.
11. `RelatedPosts.astro` — 2-3 related posts computed by `src/lib/related-posts.ts`, rendered via `BlogCard variant="related"`.
12. `ReadingProgress.astro` — fixed-top 1px bar. Uses `transform: scaleX(var(--progress))` with `transform-origin: left`. Color `var(--color-brand-cyan)`.
13. (home) `src/components/home/HomeLatestWriting.astro` — homepage "latest 3" strip rendered below the hero. Uses `BlogCard variant="compact"`. Lives under `home/` because it's a homepage section.

Reuse existing homepage composition patterns: `.section`, `.section-eyebrow`, `.section-title`, `.btn-ghost`, `.container`. Do not invent new utility classes.

---

## 6. Routes — four files

### 6.1 `src/pages/blog/[...page].astro`

Single file handles `/blog` (page 1) and `/blog/2`, `/blog/3`, ... via Astro's rest-parameter pagination:

```ts
export async function getStaticPaths({ paginate }) {
	const posts = (
		await getCollection('blog', (p) => (import.meta.env.PROD ? !p.data.draft : true))
	).sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
	return paginate(posts, { pageSize: 12 });
}
```

Renders `BlogHero` + `BlogGrid` + `BlogPagination`. Emits `Blog` + `BreadcrumbList` JSON-LD via `slot="head"`. Each paginated page emits its own `<link rel="canonical">` pointing to itself plus `rel="prev"` / `rel="next"` link tags. Do not `noindex` paginated pages.

### 6.2 `src/pages/blog/[slug].astro`

Renders one article. `getStaticPaths` iterates every non-draft (in prod) post. Renders `ReadingProgress` + `PostHeader` + `PostBody` + `PostToc` + `PostFooter`. Emits `BlogPosting` + `BreadcrumbList` JSON-LD.

Skeleton (fill in the head slot + component wiring):

```astro
---
import { getCollection, getEntry } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import PostHeader from '../../components/blog/PostHeader.astro';
import PostBody from '../../components/blog/PostBody.astro';
import PostToc from '../../components/blog/PostToc.astro';
import PostFooter from '../../components/blog/PostFooter.astro';
import ReadingProgress from '../../components/blog/ReadingProgress.astro';
import { readingTime } from '../../lib/reading-time';
import { relatedPosts } from '../../lib/related-posts';
import { tr } from '../../config/imagekit';
import { site } from '../../config/site';

export async function getStaticPaths() {
	const posts = await getCollection('blog', (p) => (import.meta.env.PROD ? !p.data.draft : true));
	return posts.map((post) => ({
		params: {
			slug: post.data.slug ?? post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),
		},
		props: { post },
	}));
}

const { post } = Astro.props;
const { Content, body } = await post.render();
const minutes = post.data.readingTime ?? readingTime(body);
const related = await relatedPosts(post);
const canonical = new URL(`/blog/${post.data.slug ?? post.id}`, Astro.site).href;
const ogImage = post.data.ogImage ?? `${post.data.cover.src}${tr.og}`;

const blogPostingJsonLd = {
	'@context': 'https://schema.org',
	'@graph': [
		{ '@type': 'WebSite', '@id': `${site.url}/#website` },
		{ '@type': 'Organization', '@id': `${site.url}/#org` },
		{
			'@type': 'BlogPosting',
			'@id': `${canonical}#post`,
			headline: post.data.title,
			description: post.data.description,
			image: ogImage,
			datePublished: post.data.publishedAt.toISOString(),
			dateModified: (post.data.updatedAt ?? post.data.publishedAt).toISOString(),
			author: { '@type': 'Person', name: post.data.author.name },
			publisher: { '@id': `${site.url}/#org` },
			mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
			keywords: post.data.tags.join(', '),
			articleSection: post.data.category,
		},
		{
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
				{ '@type': 'ListItem', position: 2, name: 'Writing', item: `${site.url}/blog` },
				{ '@type': 'ListItem', position: 3, name: post.data.title, item: canonical },
			],
		},
	],
};
---

<Layout
	title={`${post.data.title} — NexAI Labs`}
	description={post.data.description}
	ogImage={ogImage}
	canonicalUrl={canonical}
>
	<script slot="head" type="application/ld+json" set:html={JSON.stringify(blogPostingJsonLd)} />
	<ReadingProgress />
	<article>
		<PostHeader post={post} minutes={minutes} />
		<div class="post-layout">
			<PostBody>
				<Content />
			</PostBody>
			<PostToc />
		</div>
		<PostFooter post={post} related={related} />
	</article>
</Layout>

<style>
	.post-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0;
	}
	@media (min-width: 1100px) {
		.post-layout {
			grid-template-columns: minmax(0, 1fr) 14rem;
			gap: 3rem;
			max-width: 72rem;
			margin-inline: auto;
			padding-inline: 2rem;
		}
	}
</style>
```

### 6.3 `src/pages/blog/archive.astro`

Renders every non-draft post as a flat list grouped by year, newest first. Title + date + category per row. Linked from the footer "Writing" column. No pagination. No images. Emits a simple `Blog` JSON-LD.

### 6.4 `src/pages/blog/rss.xml.ts`

Uses `@astrojs/rss` and `src/config/site.ts`. Returns the 20 most recent non-draft posts sorted descending by `publishedAt`. Item fields: `title`, `description`, `link`, `pubDate`, `categories: [category, ...tags]`. Install the package first: `npm install @astrojs/rss`.

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../../config/site';

export async function GET(context) {
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
			link: `/blog/${p.data.slug ?? p.id}/`,
			pubDate: p.data.publishedAt,
			categories: [p.data.category, ...p.data.tags],
		})),
		customData: '<language>en-us</language>',
	});
}
```

---

## 7. Integration — wire nav, footer, homepage, head

### 7.1 Navigation — `src/config/navigation.ts`

Replace the `ai-drops` entry with a `writing` entry. Diff:

```diff
 		{
-			id: 'ai-drops',
-			label: 'AI Drops',
-			href: '/coming-soon',
-			caption: "Dispatches on what we're building and learning.",
+			id: 'writing',
+			label: 'Writing',
+			href: '/blog',
+			caption: "Dispatches on what we're building and learning.",
 		},
```

Do not touch the `studio` config. Do not modify `.prod-signal-nav__bar` margins in `Navbar.astro`.

### 7.2 Footer — `src/components/Footer.astro`

Add a fourth column titled `Writing` with three links:

- `Latest` → `/blog`
- `All posts` → `/blog/archive`
- `RSS` → `/blog/rss.xml`

Update the desktop grid from `grid-template-columns: 1.2fr repeat(3, 1fr)` to `1.2fr repeat(4, 1fr)`. The mobile flex layout already stacks columns vertically and needs no further change.

### 7.3 Homepage — `src/pages/index.astro`

Import `HomeLatestWriting` and render it after `<HomeHero />`:

```astro
import HomeHero from '../components/home/HomeHero.astro'; import HomeLatestWriting from
'../components/home/HomeLatestWriting.astro';
```

```astro
<HomeHero />
<HomeLatestWriting />
```

`HomeLatestWriting.astro` fetches the 3 most recent non-draft posts via `getCollection('blog', ...)`, renders a `.section` block with an eyebrow + italic title (`Latest _writing_`) + a 3-card row using `BlogCard variant="compact"`, and a "Read more" link to `/blog`.

### 7.4 Layout head — `src/layouts/Layout.astro`

Do not restructure the file. Do not touch the Cal.com dialog. Do not touch the existing `<Font>`, SEO, or OG/Twitter blocks. The only addition is a conditional RSS `<link rel="alternate">` that renders when the current URL is a blog route. Add this inside the existing `<head>` block, above `<slot name="head" />`:

```astro
{
	Astro.url.pathname.startsWith('/blog') && (
		<link
			rel="alternate"
			type="application/rss+xml"
			title="NexAI Labs — Writing"
			href="/blog/rss.xml"
		/>
	)
}
```

No other Layout changes.

### 7.5 Astro config — `astro.config.mjs`

Add a `markdown` block for Shiki. Theme is locked to `css-variables` per §1 item 5.

```js
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
	// ...existing prefetch + experimental.fonts blocks unchanged
});
```

Do not install `@astrojs/mdx`. Do not add `rehype-slug` — Astro 5 auto-generates heading ids via github-slugger.

### 7.6 Redirects — `public/_redirects`

Delete the two lines that block `/blog`. Before:

```
# Old pages → current site
/home / 301
/home/ / 301
/ai-photoshoot /studio 301
/home-joi / 301
/blog/how-ai-is-replacing* /studio 301
/blog/how-ai-sales-agents* / 301
/blog/cracking-the-code-j* / 301
/blog / 301
/blog/* / 301
```

After:

```
# Old pages → current site
/home / 301
/home/ / 301
/ai-photoshoot /studio 301
/home-joi / 301
/blog/how-ai-is-replacing* /studio 301
/blog/how-ai-sales-agents* / 301
/blog/cracking-the-code-j* / 301
```

Keep the three legacy slug-specific redirects (lines 6-8) — those point to old published URLs that are not being republished under new slugs. Only the two catch-all `/blog` and `/blog/*` lines are removed. Do not touch `public/_headers`; the existing CSP already allows ImageKit.

---

## 8. Prose styles — append to `src/styles/global.css`

Append this block at the bottom of `global.css`. Do not inline it into components. Do not introduce new custom properties — everything references existing tokens.

```css
/* ═══════════════════════════════════════════════════════════════════ */
/*  Blog prose (article body)                                          */
/*  Quiet observatory: 65ch prose, Cormorant italic accent on h2,      */
/*  Inter body at 17px/1.7, teal restrained to links + progress bar.   */
/* ═══════════════════════════════════════════════════════════════════ */
.prose {
	max-width: 65ch;
	margin-inline: auto;
	font-family: var(--font-main);
	font-size: 1.0625rem; /* 17px */
	line-height: var(--lh-reading);
	color: rgba(255, 255, 255, 0.82);
}

.prose h2 {
	font-family: var(--font-accent);
	font-size: clamp(1.75rem, 2.6vw, 2.2rem);
	font-weight: var(--fw-semibold);
	line-height: var(--lh-heading);
	color: var(--color-text-main);
	margin-top: 2.5em;
	margin-bottom: 0.6em;
}
.prose h2 em {
	font-style: italic;
}

.prose h3 {
	font-family: var(--font-main);
	font-size: 1.25rem;
	font-weight: var(--fw-semibold);
	color: var(--color-text-main);
	margin-top: 2em;
	margin-bottom: 0.4em;
}

.prose p {
	margin-bottom: 1.2em;
}

.prose a {
	color: var(--color-brand-cyan);
	text-decoration: underline;
	text-decoration-thickness: 1px;
	text-underline-offset: 0.22em;
	transition: color 0.2s var(--ease-out-expo);
}
.prose a:hover {
	color: #fff;
}

.prose blockquote {
	border-left: 2px solid var(--color-brand-cyan);
	padding-left: var(--space-sm);
	margin: 1.6em 0;
	font-family: var(--font-accent);
	font-style: italic;
	font-size: 1.25rem;
	color: var(--color-text-muted);
}

.prose code:not(pre > code) {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 0.88em;
	padding: 0.15em 0.4em;
	border-radius: var(--radius-xs);
	background: rgba(255, 255, 255, 0.06);
	color: var(--color-brand-cyan);
}

.prose pre {
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	padding: var(--space-sm);
	overflow-x: auto;
	margin: 1.6em 0;
	font-size: 0.92rem;
	line-height: var(--lh-ui);
}
.prose pre code {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	color: var(--color-text-main);
}

.prose img,
.prose figure {
	margin: 2em 0;
	border-radius: var(--radius-md);
}

.prose ul,
.prose ol {
	padding-left: 1.25em;
	margin: 1em 0 1.2em;
}
.prose li {
	margin-bottom: 0.4em;
}

.prose hr {
	border: 0;
	border-top: 1px solid var(--color-border);
	margin: 2.4em 0;
}

/* Deliberate teal hierarchy: blog surfaces keep teal restrained to
   hover, reading-progress, prose links, and CTAs. AgentOrbit and
   NeutronStar keep their existing brighter teal usage. This split is
   intentional — blog = calm reading room, homepage = active workshop. */
```

---

## 9. Seed post — frontmatter example

Create `src/content/blog/_template.md` with this exact frontmatter (body content is a short placeholder). Authors duplicate this file for every new post. The underscore prefix excludes it from the content collection glob.

```md
---
title: 'The hidden cost of single-purpose agents'
description: 'Most agent failures are cheap to predict and expensive to fix. Here is the pattern we keep hitting and the rule we now ship with.'
publishedAt: 2026-04-15
draft: true
author:
  name: 'Rahul Juneja'
  title: 'Co-founder, NexAI Labs'
category: 'Notes'
tags:
  - agents
  - workflows
  - evals
cover:
  src: 'https://ik.imagekit.io/nexailabs/nexai/blog/hidden-cost-agents.jpg'
  alt: 'Abstract diagram of agent loops with one broken edge highlighted in teal'
  credit: 'NexAI Labs'
---

Write the post here. First paragraph is the hook. Prose is capped at 65ch,
Cormorant italic accent on h2, Inter body at 17/1.7, teal restrained to
links and the reading-progress bar. Do not add any custom CSS. Do not add
any frontmatter fields beyond the schema.

## What we saw

First finding.

## What we changed

Second finding.
```

File naming convention: `YYYY-MM-DD-slug.md`. The date prefix keeps the content directory chronologically browsable in an editor. The actual URL slug comes from frontmatter `slug` if present, otherwise the filename minus the date prefix.

---

## 10. Design direction — one paragraph

Aesthetic is "quiet observatory." Dark-only, disciplined, serif-accented — the homepage hero's visual vocabulary plus the rhythm of Off Menu's article grid and the prose discipline of Orchid Template. Display typography uses Cormorant Garamond italic on accent words (`Our _writing_`, `Latest _notes_`) following the existing `.section-title em { font-style: italic }` pattern. Body is Inter at 17px / 1.7. Prose column is locked at 65ch (~640-680px) — narrower than Tailwind's 768px, matches Orchid Template. Cards use a 16:10 cover aspect ratio enforced via CSS `aspect-ratio`. Teal is restrained: hover states, reading-progress bar, inline prose links, CTA buttons. The AgentOrbit and NeutronStar components on the homepage keep their existing brighter teal — the split is deliberate. Three reference sites to internalize before coding: **Daemon Agency articles** (daemon-agency.framer.ai/articles — dense 3-col grid + oversized display h1), **Orchid Template journal** (orchid-template.framer.website/journal — tight prose column + image-over-title cards), **Off Menu design blog** (offmenu.design/blog — italic display accent + sticky TOC). Borrow the rhythm, not the colors.

---

## 11. Hard don'ts

- No `@astrojs/mdx` in Phase 1. Plain Markdown only.
- No React, Vue, Svelte, or Tailwind anywhere. Vanilla CSS + Astro components.
- No per-post CSS files. No `style` frontmatter block. No per-post `layoutMode`, `accent`, `chrome`, or `proseWidth`.
- No new design tokens in `global.css`. Reuse existing `--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--ease-*`, `--fw-*`, `--lh-*`.
- No `rehype-slug` plugin. Astro 5 auto-slugs heading ids via github-slugger.
- No touching the Cal.com dialog in `Layout.astro`. No touching `.prod-signal-nav__bar` margins in `Navbar.astro`.
- No deleting or editing `/studio`, `/home-joi`, `/coming-soon`, or any existing page.
- No editing `src/components/home/HomeHero.astro` or `src/components/home/AgentOrbit.astro` styling.
- No infinite scroll, no comments, no share buttons, no newsletter embed, no featured-post slab in Phase 1.
- No `/blog/1` alias — page 1 lives at `/blog` only.
- No hand-curated `related: [slug]` frontmatter. The related-posts algorithm is computed.
- No uncapped RSS feed. Hard cap at 20 items.
- No image transforms that upload to the repo. All covers are served from ImageKit via URL.

---

## 12. Acceptance criteria

The PR is ready to merge when every one of these passes:

1. `npm run build` completes with zero warnings on any new file.
2. `npm run type-check` passes.
3. `dist/blog/index.html` exists.
4. `dist/blog/<slug>/index.html` exists for every non-draft seed post.
5. `dist/blog/archive/index.html` exists.
6. `dist/blog/rss.xml` exists and contains exactly the 20 most recent items (or all items if fewer than 20 exist).
7. `dist/sitemap-0.xml` contains `/blog`, `/blog/archive`, and every `/blog/<slug>` URL.
8. `public/_redirects` no longer contains the lines `/blog / 301` or `/blog/* / 301`.
9. `curl -I <preview>/blog` returns `200`, not `301`.
10. Navbar on `/` shows `Writing` and links to `/blog`.
11. Footer on every page shows a `Writing` column with Latest / All posts / RSS links.
12. Homepage `/` renders `HomeLatestWriting` below the hero with three cards.
13. `/blog/rss.xml` validates via the W3C feed validator.
14. `/blog/<slug>` passes Google Rich Results Test as a valid `BlogPosting` with no errors.
15. Lighthouse on `/blog` and one article: Performance ≥ 95, Accessibility = 100, SEO ≥ 95.
16. Responsive sweep at 360 / 768 / 1280 viewport widths: card grid collapses 3→2→1, prose stays at 65ch, TOC hides below 1100px.
17. `prefers-reduced-motion: reduce` kills every stagger and translate animation — cards appear immediately in their final state.
18. Keyboard nav: Tab reaches every card, every link, every CTA. Focus rings visible. Skip link works.
19. Frontmatter lint hook blocks a commit when a required field is missing.

---

## 13. Verification checklist

Run these in order before opening the PR:

**Local dev**

- [ ] `npm install` (pulls `@astrojs/rss` + any new transitive deps).
- [ ] `npm run dev` → open `http://localhost:4321/blog`.
- [ ] Hero renders with italic serif accent.
- [ ] 3-col grid collapses to 2 at 900px, 1 at 640px.
- [ ] Hover raises card, subtle image scale, cyan edge appears.
- [ ] Click a card → article loads.
- [ ] Article shows cover, title, meta row, prose at 65ch, sticky TOC at ≥1100px viewport, hidden below.
- [ ] Reading-progress bar fills as you scroll.
- [ ] Prev / next links at bottom, related posts, CTA.
- [ ] `/blog/rss.xml` loads.
- [ ] `/blog/archive` lists all seed posts grouped by year.

**Build**

- [ ] `npm run build` clean.
- [ ] `npm run type-check` clean.
- [ ] Inspect one built post's `<head>`: `BlogPosting` JSON-LD valid, OG image is the ImageKit OG crop, canonical matches deploy host.

**Responsive + a11y**

- [ ] Sweep 1280 / 1024 / 900 / 640 / 380 viewport widths.
- [ ] Force `prefers-reduced-motion: reduce`, reload, confirm no stagger.
- [ ] Tab through nav → hero → cards → article. Focus rings visible.
- [ ] Axe or Lighthouse a11y audit = 100 on `/blog` and one article.

**Validation**

- [ ] RSS through W3C feed validator → valid.
- [ ] Post URL through Google Rich Results Test → valid `BlogPosting`, zero errors.

**Deploy preview**

- [ ] `curl -I <preview>/blog` → 200.
- [ ] CSP does not block any ImageKit cover (DevTools console clean).
- [ ] Soft nav via view transitions between blog pages is smooth.

---

## 14. Rollback

Phase 1 is almost entirely additive. The only destructive edit is deleting two lines from `public/_redirects`. Rollback plan:

1. `git revert <phase-1-commit-sha>` — reverts all new files and the redirects deletion in one shot.
2. Re-deploy. Cloudflare Pages will rebuild from the reverted tree and restore the old `/blog / 301` catch-all.
3. No database migration, no cache invalidation beyond CF Pages' own.

If only the redirects need to come back without reverting the whole feature (e.g. an emergency content takedown), re-add these two lines at the bottom of `public/_redirects` and redeploy:

```
/blog / 301
/blog/* / 301
```

---

## Handoff checklist — Codex ticks before starting

- [ ] Read this entire file end to end.
- [ ] All decisions in §1 are locked — do not stop to re-ask any of them.
- [ ] Current branch is `feat/blog-phase-1` cut fresh from `main`.
- [ ] `package.json` has `@astrojs/rss` installed (`npm install @astrojs/rss`).
- [ ] `src/content.config.ts` does not yet exist (confirm — Phase 1 creates it).
- [ ] `public/_redirects` lines 9-10 still present (confirm — Phase 1 deletes them).
- [ ] Dummy seed post cover uses any existing ImageKit placeholder under `nexailabs/` — do not block on uploading a dedicated image. Rahul swaps the cover when replacing the dummy post.
- [ ] You will ship in the order: schema → helpers → components → routes → RSS → archive → nav/footer/home → redirects → lint hook → AUTHORING.md.
- [ ] You will not touch `Layout.astro` beyond the single RSS `<link rel="alternate">` addition in Section 7.4.
- [ ] You will not install `@astrojs/mdx` in this PR.
- [ ] You will open the PR against `main` with the acceptance criteria from Section 12 as the PR body checklist.

Go.
