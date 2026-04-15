import { PROMPT_CATEGORIES, PROMPT_MODELS, PROMPT_TAGS, PROMPT_TYPES, prompts } from './prompt-hub';

const VAR_RE = /\{([a-z][a-z0-9_]*)\}/g;
const SUSPICIOUS_COMMAND_CHARS = /[;&|`$><\\]/;
const SKILL_FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;
const SKILL_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED_SKILL_NAMES = new Set(['default', 'global', 'shared']);

const promptTypes = new Set<string>(PROMPT_TYPES);
const promptModels = new Set<string>(PROMPT_MODELS);
const promptCategories = new Set<string>(PROMPT_CATEGORIES);
const promptTags = new Set<string>(PROMPT_TAGS);

const seenSlugs = new Set<string>();

for (const entry of prompts) {
	if (seenSlugs.has(entry.slug)) {
		throw new Error(`Duplicate prompt slug: ${entry.slug}`);
	}
	seenSlugs.add(entry.slug);

	if (entry.title.length > 80) {
		throw new Error(`Prompt title exceeds 80 chars: ${entry.slug}`);
	}

	if (entry.summary.length > 160) {
		throw new Error(`Prompt summary exceeds 160 chars: ${entry.slug}`);
	}

	if (entry.tags.length > 8) {
		throw new Error(`Prompt tags exceed 8 entries: ${entry.slug}`);
	}

	if (entry.models.length === 0) {
		throw new Error(`Prompt models must not be empty: ${entry.slug}`);
	}

	if (!promptTypes.has(entry.type)) {
		throw new Error(`Prompt type is invalid: ${entry.slug}`);
	}

	for (const model of entry.models) {
		if (!promptModels.has(model)) {
			throw new Error(`Prompt model is invalid (${model}): ${entry.slug}`);
		}
	}

	if (!promptCategories.has(entry.category)) {
		throw new Error(`Prompt category is invalid (${entry.category}): ${entry.slug}`);
	}

	for (const tag of entry.tags) {
		if (!promptTags.has(tag)) {
			throw new Error(`Prompt tag is invalid (${tag}): ${entry.slug}`);
		}
	}

	if (entry.variables) {
		const variablesInBody = new Set<string>();
		for (const match of entry.body.matchAll(VAR_RE)) {
			if (match[1]) variablesInBody.add(match[1]);
		}

		for (const variable of entry.variables) {
			if (!variablesInBody.has(variable)) {
				throw new Error(`Variable "${variable}" not found in body: ${entry.slug}`);
			}
		}
	}

	if (entry.type === 'skill') {
		const frontmatterMatch = entry.body.match(SKILL_FRONTMATTER_RE);
		if (!frontmatterMatch) {
			throw new Error(`Skill body must start with YAML frontmatter: ${entry.slug}`);
		}

		const frontmatter = frontmatterMatch[1];
		const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
		const descriptionMatch = frontmatter.match(/^description:\s*(.+)$/m);

		if (!nameMatch || !descriptionMatch) {
			throw new Error(`Skill frontmatter requires name and description: ${entry.slug}`);
		}

		const name = nameMatch[1].trim();
		const description = descriptionMatch[1].trim();

		if (name.length > 64 || !SKILL_NAME_RE.test(name) || RESERVED_SKILL_NAMES.has(name)) {
			throw new Error(`Skill frontmatter name is invalid: ${entry.slug}`);
		}

		if (description.length > 1024) {
			throw new Error(`Skill frontmatter description exceeds 1024 chars: ${entry.slug}`);
		}
	}

	if (entry.type === 'mcp-config') {
		try {
			JSON.parse(entry.body);
		} catch {
			throw new Error(`MCP config body must be valid JSON: ${entry.slug}`);
		}
	}

	if (entry.install?.command && SUSPICIOUS_COMMAND_CHARS.test(entry.install.command)) {
		throw new Error(`Install command contains suspicious shell metacharacters: ${entry.slug}`);
	}
}
