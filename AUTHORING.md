# NexAI Labs Blog Authoring (Phase 1)

## Where posts live

- Collection path: `src/content/blog/`
- Naming convention: `YYYY-MM-DD-slug.md`
- Copy from template: `src/content/blog/_template.md`

## Required frontmatter

Every post must include:

- `title`
- `description`
- `publishedAt`
- `author.name`
- `cover.src`
- `cover.alt`
- `category`

The pre-commit frontmatter lint blocks commits if any required field is missing.

## Categories and tags

- Categories (append-only): `Notes`, `Case Study`, `Research`, `Tutorial`, `Announcement`
- Tags (append-only):
  `agents, workflows, automation, llm, evals, rag, tools, api, security, ops, infrastructure, observability, design, ux, engineering, business, strategy, case-study`

## Covers and inline media

- ImageKit endpoint: `https://ik.imagekit.io/nexailabs`
- Blog asset path: `nexailabs/blog/`
- Use full source URLs in frontmatter (no `?tr=` suffix in `cover.src`)
- Render-time transforms are applied by components.

## Draft workflow

- Set `draft: true` while editing.
- Drafts are visible in development, filtered out in production builds.

## Preview and publish

1. Create a post file from `_template.md`.
2. Run `npm run dev` and review `/blog` and the post URL.
3. Run `npm run type-check` and `npm run build`.
4. Set `draft: false` to publish.
5. Merge to `main` and deploy.
