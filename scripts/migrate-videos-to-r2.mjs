#!/usr/bin/env node
// scripts/migrate-videos-to-r2.mjs
//
// One-shot helper for the ImageKit → R2 migration of video assets:
//   1. Reads scripts/upload-progress.json
//   2. Finds every entry where status:'uploaded' AND type:'video' AND it's still
//      hosted on ImageKit (has a fileId) — these are the ones to migrate
//   3. Bulk-deletes them from ImageKit (frees video-transformation quota)
//   4. Removes their progress entries so the next upload-gallery.mjs run treats
//      them as fresh and uploads to R2
//
// SAFETY: Pass --confirm to actually run; otherwise it's a dry-run preview.
//
// Usage:
//   node scripts/migrate-videos-to-r2.mjs            # dry-run
//   node scripts/migrate-videos-to-r2.mjs --confirm  # actually delete

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ImageKit from 'imagekit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(PROJECT_ROOT, '.env');
const PROGRESS_FILE = path.join(PROJECT_ROOT, 'scripts/upload-progress.json');

const CONFIRM = process.argv.includes('--confirm');

async function loadEnv() {
	const content = await fs.readFile(ENV_FILE, 'utf-8');
	for (const line of content.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const idx = trimmed.indexOf('=');
		if (idx === -1) continue;
		const key = trimmed.slice(0, idx).trim();
		const val = trimmed.slice(idx + 1).trim();
		if (!process.env[key]) process.env[key] = val;
	}
}

function chunk(arr, n) {
	const out = [];
	for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
	return out;
}

async function main() {
	await loadEnv();

	const ik = new ImageKit({
		publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
		privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
		urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/nexailabs',
	});

	const progress = JSON.parse(await fs.readFile(PROGRESS_FILE, 'utf-8'));

	const targets = [];
	for (const [destPath, p] of Object.entries(progress)) {
		if (p.status !== 'uploaded') continue;
		if (p.type !== 'video') continue;
		if (p.host === 'r2') continue; // already migrated
		if (!p.fileId) {
			console.warn(`[migrate] WARN no fileId for ${destPath}, skipping`);
			continue;
		}
		targets.push({ destPath, fileId: p.fileId });
	}

	console.log(
		`[migrate] ${targets.length} ImageKit-hosted videos to delete${CONFIRM ? '' : ' (DRY RUN — pass --confirm to actually delete)'}`,
	);

	if (!CONFIRM) {
		for (const t of targets) console.log(`  ${t.destPath}`);
		return;
	}

	if (targets.length === 0) {
		console.log('[migrate] nothing to do');
		return;
	}

	const batches = chunk(targets, 100);
	let deleted = 0;
	let failed = 0;

	for (let i = 0; i < batches.length; i++) {
		const batch = batches[i];
		try {
			await ik.bulkDeleteFiles(batch.map((b) => b.fileId));
			deleted += batch.length;
			for (const t of batch) delete progress[t.destPath];
			console.log(`[migrate] batch ${i + 1}/${batches.length} — deleted ${batch.length}`);
		} catch (err) {
			failed += batch.length;
			console.error(`[migrate] batch ${i + 1}/${batches.length} FAILED: ${err?.message || err}`);
		}
		await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
	}

	console.log(`\n[migrate] done — deleted from ImageKit:${deleted} failed:${failed}`);
	console.log(
		'[migrate] progress entries removed. Run scripts/upload-gallery.mjs to upload videos to R2.',
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
