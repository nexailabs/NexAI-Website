/* global console, process */
import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = path.resolve('src/content/blog');
const REQUIRED_PATTERNS = [
	{ key: 'title', pattern: /^title\s*:\s*.+/m },
	{ key: 'description', pattern: /^description\s*:\s*.+/m },
	{ key: 'publishedAt', pattern: /^publishedAt\s*:\s*.+/m },
	{ key: 'author.name', pattern: /^author\s*:[\s\S]*?^\s+name\s*:\s*.+/m },
	{ key: 'cover.src', pattern: /^cover\s*:[\s\S]*?^\s+src\s*:\s*.+/m },
	{ key: 'cover.alt', pattern: /^cover\s*:[\s\S]*?^\s+alt\s*:\s*.+/m },
	{ key: 'category', pattern: /^category\s*:\s*.+/m },
];

const files = fs
	.readdirSync(BLOG_DIR)
	.filter((file) => file.endsWith('.md') && !file.startsWith('_'))
	.map((file) => path.join(BLOG_DIR, file));

const errors = [];

for (const file of files) {
	const raw = fs.readFileSync(file, 'utf8');
	const match = raw.match(/^---\n([\s\S]*?)\n---/);
	if (!match) {
		errors.push(`${file}: missing frontmatter block`);
		continue;
	}
	const frontmatter = match[1];
	for (const requirement of REQUIRED_PATTERNS) {
		if (!requirement.pattern.test(frontmatter)) {
			errors.push(`${file}: missing required field \`${requirement.key}\``);
		}
	}
}

if (errors.length > 0) {
	console.error('Blog frontmatter lint failed:\n');
	for (const error of errors) {
		console.error(`- ${error}`);
	}
	process.exit(1);
}

console.log(`Blog frontmatter lint passed for ${files.length} file(s).`);
