#!/usr/bin/env node
/**
 * Brand-font guard.
 *
 * Fails CI if any banned typeface name appears in `src/`, or if a new
 * `@fontsource/*` package is declared in `package.json` outside the allow-list.
 *
 * Brand authority: `Brand Guidelines.pdf` (Montserrat, Inter, Plus Jakarta Sans + system mono).
 * Rules: see ./CLAUDE.md and ./AGENTS.md at repo root.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, '..');

const SRC_DIR = join(root, 'src');
const PKG_JSON = join(root, 'package.json');

/* -------------------------------------------------------------------------- */
/*  Banned typeface names (regex, case-insensitive, word-boundary)            */
/* -------------------------------------------------------------------------- */

const BANNED_FONTS = [
	'Anton',
	'Cormorant',
	'Cormorant Garamond',
	'Roboto',
	'Poppins',
	'IBM Plex',
	'JetBrains Mono',
	'Geist',
	'Space Grotesk',
	'DM Sans',
	'Manrope',
	'Lato',
	'Open Sans',
	'Source Sans',
	'Source Serif',
	'Playfair',
	'Bebas Neue',
	'Oswald',
	'Raleway',
	'Nunito',
];

const ALLOW_FONTSOURCE = new Set([
	'@fontsource/inter',
	'@fontsource/montserrat',
	'@fontsource/plus-jakarta-sans',
	'@fontsource-variable/inter',
	'@fontsource-variable/montserrat',
	'@fontsource-variable/plus-jakarta-sans',
]);

/* -------------------------------------------------------------------------- */
/*  Walk src/                                                                  */
/* -------------------------------------------------------------------------- */

const SCANNED_EXTS = new Set(['.astro', '.ts', '.tsx', '.js', '.jsx', '.css', '.md', '.mdx']);

/** @returns {string[]} */
function walk(dir) {
	const out = [];
	for (const name of readdirSync(dir)) {
		if (name === 'node_modules' || name.startsWith('.')) continue;
		const full = join(dir, name);
		const st = statSync(full);
		if (st.isDirectory()) {
			out.push(...walk(full));
		} else {
			const dot = name.lastIndexOf('.');
			const ext = dot >= 0 ? name.slice(dot) : '';
			if (SCANNED_EXTS.has(ext)) out.push(full);
		}
	}
	return out;
}

/* -------------------------------------------------------------------------- */
/*  Scan                                                                       */
/* -------------------------------------------------------------------------- */

/** @type {{file: string, line: number, match: string, context: string}[]} */
const violations = [];

const files = walk(SRC_DIR);
const fontPattern = new RegExp(
	`\\b(${BANNED_FONTS.map((f) => f.replace(/ /g, '\\s+')).join('|')})\\b`,
	'i',
);

for (const file of files) {
	const content = readFileSync(file, 'utf8');
	const lines = content.split(/\r?\n/);
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const m = line.match(fontPattern);
		if (m) {
			violations.push({
				file: relative(root, file).split(sep).join('/'),
				line: i + 1,
				match: m[0],
				context: line.trim().slice(0, 120),
			});
		}
	}
}

/* -------------------------------------------------------------------------- */
/*  package.json fontsource allow-list                                         */
/* -------------------------------------------------------------------------- */

/** @type {{name: string}[]} */
const pkgViolations = [];
try {
	const pkg = JSON.parse(readFileSync(PKG_JSON, 'utf8'));
	const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
	for (const name of Object.keys(allDeps)) {
		if (
			(name.startsWith('@fontsource/') || name.startsWith('@fontsource-variable/')) &&
			!ALLOW_FONTSOURCE.has(name)
		) {
			pkgViolations.push({ name });
		}
	}
} catch (e) {
	console.error('[guard:fonts] could not read package.json:', e.message);
	process.exit(2);
}

/* -------------------------------------------------------------------------- */
/*  Report                                                                     */
/* -------------------------------------------------------------------------- */

if (violations.length === 0 && pkgViolations.length === 0) {
	console.log('[guard:fonts] OK — no banned typefaces found.');
	process.exit(0);
}

console.error('[guard:fonts] FAIL — banned typeface usage detected.');
console.error('\nBrand fonts (only): Montserrat, Inter, Plus Jakarta Sans, system mono.');
console.error('See ./CLAUDE.md and ./AGENTS.md.\n');

if (violations.length > 0) {
	console.error(`Source-file violations (${violations.length}):`);
	for (const v of violations) {
		console.error(`  ${v.file}:${v.line}  [${v.match}]  → ${v.context}`);
	}
}

if (pkgViolations.length > 0) {
	console.error(`\npackage.json fontsource violations (${pkgViolations.length}):`);
	for (const v of pkgViolations) {
		console.error(`  ${v.name}  (allowed: ${[...ALLOW_FONTSOURCE].join(', ')})`);
	}
}

process.exit(1);
