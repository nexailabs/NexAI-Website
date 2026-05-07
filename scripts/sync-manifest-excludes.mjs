#!/usr/bin/env node
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
