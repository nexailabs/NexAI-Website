// ─────────────────────────────────────────────────────────────────────────────
// MIRROR COPY for AI / engineer reference. Do not run this file.
//
// The runtime version is at /scripts/build-gallery-manifest.mjs. This copy is
// kept in sync manually for the skill bundle (docs/gallery-skill/). If the two
// drift, the runtime version is authoritative.
//
// If you accidentally `node` this file, the runtime guard below will exit.
// ─────────────────────────────────────────────────────────────────────────────

// scripts/build-gallery-manifest.mjs
//
// Walks every configured source folder, parses each filename into
// brand/category/subcategory/type/variant, generates auto-alt text, and writes
// scripts/gallery-manifest.json.
//
// Pure metadata work — no ImageKit/R2 calls. Run before scripts/upload-gallery.mjs.
//
// Re-runs are safe: existing manifest entries' user-edited fields
// (`include`, `excludeReason`, `manualOverride`, and `alt` when
// `manualOverride: true`) are preserved across regenerations.
//
// Usage: node scripts/build-gallery-manifest.mjs

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
if (__filename.replaceAll('\\', '/').includes('docs/gallery-skill/')) {
	console.error(
		'[mirror] This is a reference copy. Run /scripts/build-gallery-manifest.mjs instead.',
	);
	process.exit(1);
}

const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUT_FILE = path.join(PROJECT_ROOT, 'scripts/gallery-manifest.json');

// Source directories: comma-separated list in env var GALLERY_SOURCE_DIRS,
// or fall back to local defaults. Override via .env at repo root for portability
// across machines / OS — see docs/gallery-skill/.env.example.
const DEFAULT_SOURCE_DIRS = [
	String.raw`H:\My Drive\AI PHOTOSHOOT BACKUP\Gallery\final gallery`,
	String.raw`G:\Shared drives\AI Photoshoots\VIDEO GALLERY`,
];

async function loadEnv() {
	try {
		const content = await fs.readFile(path.join(PROJECT_ROOT, '.env'), 'utf-8');
		for (const line of content.split(/\r?\n/)) {
			const t = line.trim();
			if (!t || t.startsWith('#')) continue;
			const i = t.indexOf('=');
			if (i === -1) continue;
			const key = t.slice(0, i).trim();
			const val = t
				.slice(i + 1)
				.trim()
				.replace(/^"(.*)"$/, '$1')
				.replace(/^'(.*)'$/, '$1');
			if (!process.env[key]) process.env[key] = val;
		}
	} catch (err) {
		if (err.code !== 'ENOENT') throw err;
	}
}

// Multi-token brand aliases. Order matters — longest first.
// Each entry maps a sequence of leading tokens (after lowercase + space-to-underscore)
// to the canonical kebab-case brand slug.
const BRAND_PREFIX_ALIASES = [
	// "Dhwani Bansal Jewelry" — register both UK ('jewellery') and US ('jewelry') spellings
	// because source filenames have shipped under both.
	[['dhwani', 'bansal', 'jewellery'], 'dbj'],
	[['dhwani', 'bansal', 'jewelry'], 'dbj'],
	[['banno', 'swagger'], 'banno-swagger'],
	[['xeba', 'botanica'], 'xeba-botanica'],
];

const BRAND_LABELS = {
	'banno-swagger': 'Banno Swagger',
	dbj: 'Dhwani Bansal Jewelry',
	indoera: 'Indoera',
	leemboodi: 'Leemboodi',
	muwin: 'Muwin',
	rasvidha: 'Rasvidha',
	skylee: 'Skylee',
	'xeba-botanica': 'XEBA Botanica',
	yufta: 'Yufta',
	soie: 'Soie',
	selvia: 'Selvia',
	xyxx: 'XYXX',
	thrive: 'Thrive',
	soilearth: 'Soil & Earth',
};

// Token-level typo normalization, applied after lowercase + space-to-underscore.
const TOKEN_TYPO_ALIASES = {
	ethicwear: 'ethnicwear',
	hewellery: 'jewellery',
};

// [tokenSequence, category, subcategory] — longest match first.
const CATEGORY_TOKEN_MAP = [
	// Apparel — multi-token
	[['westernwear', 'co', 'ord', 'set'], 'apparel', 'co-ord-set'],
	[['westernwear', 'bottom'], 'apparel', 'western-bottom'],
	[['westernwear', 'dress'], 'apparel', 'western-dress'],
	[['westernwear', 'top'], 'apparel', 'western-top'],
	[['kurta', 'sets'], 'apparel', 'kurta-set'],
	[['kurta', 'set'], 'apparel', 'kurta-set'],

	// Apparel — single-token (fallback)
	[['westernwear'], 'apparel', 'western-wear'],
	[['ethnicwear'], 'apparel', 'ethnic-wear'],
	[['nightsuit'], 'apparel', 'nightsuit'],
	[['boxer'], 'apparel', 'innerwear'],
	[['sarees'], 'apparel', 'saree'],
	[['saree'], 'apparel', 'saree'],

	// Jewelry
	[['necklace', 'earring', 'bracelet', 'set'], 'jewelry', 'jewelry-set'],
	[['earrings', 'bracelet', 'set'], 'jewelry', 'jewelry-set'],
	[['necklace', 'earring', 'set'], 'jewelry', 'jewelry-set'],
	[['necklace'], 'jewelry', 'necklace'],
	[['earring'], 'jewelry', 'earring'],
	[['jewellery'], 'jewelry', 'jewelry-set'],

	// Cosmetics
	[['skincare'], 'cosmetics', 'skincare'],
	[['fragrance'], 'cosmetics', 'fragrance'],
	[['lipstick'], 'cosmetics', 'lipstick'],

	// Accessories
	[['bag'], 'accessories', 'bag'],
	[['belt'], 'accessories', 'belt'],
	[['sunglasses'], 'accessories', 'sunglasses'],
];

const TYPE_TOKEN_MAP = {
	pdp: 'pdp',
	ads: 'ad',
	ad: 'ad',
	video: 'video',
};

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm']);
const ALLOWED_EXTS = new Set([...IMAGE_EXTS, ...VIDEO_EXTS]);

function preprocessTokens(rawBaseName) {
	const normalized = rawBaseName.toLowerCase().replaceAll(' ', '_');
	let tokens = normalized.split('_').filter((t) => t.length > 0);
	if (tokens.length > 0) {
		const last = tokens[tokens.length - 1];
		const m = last.match(/^(\d+)(mp4|mov|webm|jpg|jpeg|png|webp|avif|gif)$/i);
		if (m) tokens[tokens.length - 1] = m[1];
	}
	tokens = tokens.map((t) => TOKEN_TYPO_ALIASES[t] || t);
	return tokens;
}

function detectBrand(tokens) {
	const sorted = [...BRAND_PREFIX_ALIASES].sort((a, b) => b[0].length - a[0].length);
	for (const [prefix, slug] of sorted) {
		if (tokens.length >= prefix.length && prefix.every((p, i) => tokens[i] === p)) {
			return { brand: slug, consumed: prefix.length };
		}
	}
	return { brand: tokens[0], consumed: 1 };
}

function detectCategory(tokens) {
	for (const [seq, category, subcategory] of CATEGORY_TOKEN_MAP) {
		if (tokens.length >= seq.length && seq.every((p, i) => tokens[i] === p)) {
			return { category, subcategory, consumed: seq.length };
		}
	}
	return null;
}

function subcategoryLabel(sub) {
	return sub.replaceAll('-', ' ');
}

function buildAlt(brand, subcategory, variantTokens) {
	const label = BRAND_LABELS[brand] || brand;
	const sub = subcategoryLabel(subcategory);
	const variant = variantTokens.join(' ').trim();
	return variant ? `${label} — ${sub} in ${variant}` : `${label} — ${sub}`;
}

async function walkDir(dir) {
	const out = [];
	let entries;
	try {
		entries = await fs.readdir(dir, { withFileTypes: true });
	} catch (err) {
		if (err.code === 'ENOENT') {
			console.warn(`[manifest] WARN source dir not found, skipping: ${dir}`);
			return out;
		}
		throw err;
	}
	for (const e of entries) {
		const full = path.join(dir, e.name);
		if (e.isDirectory()) {
			out.push(...(await walkDir(full)));
		} else if (e.isFile()) {
			const ext = path.extname(e.name).toLowerCase();
			if (ALLOWED_EXTS.has(ext)) out.push(full);
		}
	}
	return out;
}

function parseFilename(filename) {
	const base = path.basename(filename, path.extname(filename));
	const tokens = preprocessTokens(base);
	const warnings = [];

	const { brand, consumed: brandConsumed } = detectBrand(tokens);
	let rest = tokens.slice(brandConsumed);

	const cat = detectCategory(rest);
	if (!cat) {
		return { ok: false, error: 'no-category-match', brand, tokens: rest };
	}
	rest = rest.slice(cat.consumed);

	let type = null;
	if (rest.length > 0 && TYPE_TOKEN_MAP[rest[0]]) {
		type = TYPE_TOKEN_MAP[rest[0]];
		rest = rest.slice(1);
	} else {
		return { ok: false, error: 'no-type-match', brand, tokens: rest };
	}

	let index;
	let variantTokens = rest.slice();
	const tail = rest[rest.length - 1];
	if (tail && /^\d+$/.test(tail)) {
		index = tail.padStart(2, '0');
		variantTokens = rest.slice(0, -1);
	} else {
		index = '01';
		warnings.push('missing-trailing-index');
	}

	return {
		ok: true,
		brand,
		category: cat.category,
		subcategory: cat.subcategory,
		type,
		variantTokens,
		index,
		warnings,
	};
}

function buildDestFilename(parsed, originalName) {
	const sourceExt = path.extname(originalName).toLowerCase();
	const ext = VIDEO_EXTS.has(sourceExt) ? '.mp4' : '.jpg';

	const tokens = preprocessTokens(path.basename(originalName, path.extname(originalName)));
	let core = tokens.join('_');

	const sorted = [...BRAND_PREFIX_ALIASES].sort((a, b) => b[0].length - a[0].length);
	for (const [prefix, slug] of sorted) {
		const prefixStr = prefix.join('_');
		if (core.startsWith(prefixStr + '_') || core === prefixStr) {
			core = slug.replaceAll('-', '_') + core.slice(prefixStr.length);
			break;
		}
	}

	if (parsed.warnings.includes('missing-trailing-index')) {
		core = `${core}_${parsed.index}`;
	}

	return `${core}${ext}`;
}

function buildDestPath(parsed, destFilename) {
	return `/studio/gallery/${parsed.brand}/${parsed.subcategory}/${destFilename}`;
}

async function loadExistingManifest() {
	try {
		const content = await fs.readFile(OUT_FILE, 'utf-8');
		return JSON.parse(content);
	} catch (err) {
		if (err.code === 'ENOENT') return [];
		throw err;
	}
}

async function main() {
	await loadEnv();

	const SOURCE_DIRS = process.env.GALLERY_SOURCE_DIRS
		? process.env.GALLERY_SOURCE_DIRS.split(',')
				.map((p) => p.trim())
				.filter(Boolean)
		: DEFAULT_SOURCE_DIRS;

	console.log(`[manifest] sources:`);
	for (const d of SOURCE_DIRS) console.log(`  ${d}`);

	const allFiles = [];
	for (const dir of SOURCE_DIRS) {
		const files = await walkDir(dir);
		console.log(`[manifest] ${files.length} files in ${dir}`);
		allFiles.push(...files);
	}

	if (allFiles.length === 0) {
		console.warn('\n[manifest] WARN: 0 source files found across all configured directories.');
		console.warn(
			'[manifest] Check GALLERY_SOURCE_DIRS in .env or DEFAULT_SOURCE_DIRS in this script.',
		);
	}

	const existing = await loadExistingManifest();
	const existingByDest = new Map(existing.map((e) => [e.destPath, e]));

	const manifest = [];
	const failures = [];
	let preserved = 0;

	for (const file of allFiles) {
		const filename = path.basename(file);
		const parsed = parseFilename(filename);

		if (!parsed.ok) {
			failures.push({ file: filename, error: parsed.error, tokens: parsed.tokens });
			continue;
		}

		const destFilename = buildDestFilename(parsed, filename);
		const destPath = buildDestPath(parsed, destFilename);

		const fresh = {
			id: 0,
			source: 'gdrive',
			originalPath: file,
			destPath,
			include: true,
			brand: parsed.brand,
			category: parsed.category,
			subcategory: parsed.subcategory,
			type: parsed.type,
			alt: buildAlt(parsed.brand, parsed.subcategory, parsed.variantTokens),
			manualOverride: false,
			...(parsed.warnings.length ? { warnings: parsed.warnings } : {}),
		};

		const prior = existingByDest.get(destPath);
		if (prior) {
			fresh.include = prior.include ?? fresh.include;
			fresh.manualOverride = prior.manualOverride ?? fresh.manualOverride;
			if (prior.excludeReason) fresh.excludeReason = prior.excludeReason;
			if (prior.manualOverride && prior.alt) fresh.alt = prior.alt;
			preserved++;
		}

		manifest.push(fresh);
	}

	manifest.sort((a, b) => {
		if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
		if (a.subcategory !== b.subcategory) return a.subcategory.localeCompare(b.subcategory);
		return a.originalPath.localeCompare(b.originalPath);
	});
	manifest.forEach((m, i) => (m.id = i + 1));

	await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
	await fs.writeFile(OUT_FILE, JSON.stringify(manifest, null, 2));
	console.log(
		`[manifest] wrote ${manifest.length} entries to ${OUT_FILE} (${preserved} preserved from existing)`,
	);

	const byBrand = {};
	const bySub = {};
	const byType = {};
	const byInclude = { yes: 0, no: 0 };
	for (const m of manifest) {
		byBrand[m.brand] = (byBrand[m.brand] || 0) + 1;
		bySub[`${m.brand}/${m.subcategory}`] = (bySub[`${m.brand}/${m.subcategory}`] || 0) + 1;
		byType[m.type] = (byType[m.type] || 0) + 1;
		byInclude[m.include ? 'yes' : 'no']++;
	}
	console.log('\n[summary] include yes/no');
	console.log(`  yes: ${byInclude.yes}, no: ${byInclude.no}`);
	console.log('\n[summary] by brand');
	for (const k of Object.keys(byBrand).sort()) console.log(`  ${k}: ${byBrand[k]}`);
	console.log('\n[summary] by brand/subcategory');
	for (const k of Object.keys(bySub).sort()) console.log(`  ${k}: ${bySub[k]}`);
	console.log('\n[summary] by type');
	for (const k of Object.keys(byType).sort()) console.log(`  ${k}: ${byType[k]}`);

	if (failures.length) {
		console.log(`\n[failures] ${failures.length} files could not be parsed:`);
		for (const f of failures) {
			console.log(`  ${f.file} — ${f.error}; remaining tokens: ${(f.tokens || []).join('_')}`);
		}
	} else {
		console.log('\n[failures] none — all files parsed cleanly');
	}

	const withWarnings = manifest.filter((m) => m.warnings);
	if (withWarnings.length) {
		console.log(`\n[warnings] ${withWarnings.length} entries have warnings:`);
		for (const w of withWarnings) {
			console.log(`  ${path.basename(w.originalPath)} — ${w.warnings.join(', ')}`);
		}
	}

	// destPath collision detection: two source files normalizing to the same dest
	// would silently overwrite on R2. Surface duplicates so operator can rename.
	const seenDests = new Map();
	const collisions = [];
	for (const m of manifest) {
		if (seenDests.has(m.destPath)) {
			collisions.push({
				destPath: m.destPath,
				first: seenDests.get(m.destPath),
				second: m.originalPath,
			});
		} else {
			seenDests.set(m.destPath, m.originalPath);
		}
	}
	if (collisions.length) {
		console.warn(
			`\n[duplicates] ${collisions.length} destPath collisions — these will overwrite each other on upload:`,
		);
		for (const c of collisions) {
			console.warn(`  ${c.destPath}`);
			console.warn(`    first:  ${c.first}`);
			console.warn(`    second: ${c.second}`);
		}
		console.warn(
			'\nResolve by renaming one source file. Otherwise R2 silently overwrites and ImageKit rejects the second.',
		);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
