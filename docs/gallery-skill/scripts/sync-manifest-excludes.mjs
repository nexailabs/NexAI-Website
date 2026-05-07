// ─────────────────────────────────────────────────────────────────────────────
// MIRROR COPY for AI / engineer reference. Do not run this file.
//
// The runtime version is at /scripts/sync-manifest-excludes.mjs. This copy is
// kept in sync manually for the skill bundle (docs/gallery-skill/). If the two
// drift, the runtime version is authoritative.
//
// If you accidentally `node` this file, the runtime guard below will exit.
// ─────────────────────────────────────────────────────────────────────────────

// scripts/sync-manifest-excludes.mjs
//
// Reads scripts/upload-progress.json, finds entries with status:'failed', and
// flips include:false on the matching scripts/gallery-manifest.json rows so
// future upload runs skip them.
//
// Run after an upload that has unrecoverable failures (e.g. file-size limit).

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
if (__filename.replaceAll('\\', '/').includes('docs/gallery-skill/')) {
	console.error(
		'[mirror] This is a reference copy. Run /scripts/sync-manifest-excludes.mjs instead.',
	);
	process.exit(1);
}

const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(PROJECT_ROOT, 'scripts/gallery-manifest.json');
const PROGRESS = path.join(PROJECT_ROOT, 'scripts/upload-progress.json');

const progress = JSON.parse(await fs.readFile(PROGRESS, 'utf-8'));
const manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf-8'));

const failed = Object.entries(progress).filter(([, p]) => p.status === 'failed');
const failedPaths = new Set(failed.map(([k]) => k));

let updated = 0;
for (const entry of manifest) {
	if (failedPaths.has(entry.destPath) && entry.include) {
		entry.include = false;
		entry.excludeReason = `upload-failed: ${progress[entry.destPath].error}`;
		updated++;
	}
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

console.log(`[sync-excludes] marked ${updated} entries as include:false`);
for (const [destPath, p] of failed) {
	console.log(`  ${destPath} — ${p.error}`);
}
