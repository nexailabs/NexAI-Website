#!/usr/bin/env node
// scripts/reset-imagekit-gallery.mjs
//
// Bulk-deletes EVERY uploaded gallery file from ImageKit (using fileIds in
// upload-progress.json) and wipes the progress file so the next upload runs
// from scratch. Use before re-uploading with the new compression pipeline.
//
// SAFETY: This deletes files. Pass --confirm to actually run; otherwise dry-run.
//
// Usage:
//   node scripts/reset-imagekit-gallery.mjs            # dry-run
//   node scripts/reset-imagekit-gallery.mjs --confirm  # actually delete

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
		if (p.status === 'uploaded' && p.fileId) {
			targets.push({ destPath, fileId: p.fileId });
		}
	}

	console.log(
		`[reset] ${targets.length} uploaded files to delete from ImageKit${CONFIRM ? '' : ' (DRY RUN — pass --confirm to actually delete)'}`,
	);

	if (!CONFIRM) {
		for (const t of targets.slice(0, 10)) console.log(`  ${t.destPath}`);
		if (targets.length > 10) console.log(`  ... (${targets.length - 10} more)`);
		return;
	}

	if (targets.length === 0) {
		console.log('[reset] nothing to delete');
	} else {
		const batches = chunk(targets, 100);
		let deleted = 0;
		let failed = 0;

		for (let i = 0; i < batches.length; i++) {
			const batch = batches[i];
			try {
				await ik.bulkDeleteFiles(batch.map((b) => b.fileId));
				deleted += batch.length;
				console.log(`[reset] batch ${i + 1}/${batches.length} — deleted ${batch.length}`);
			} catch (err) {
				failed += batch.length;
				console.error(`[reset] batch ${i + 1}/${batches.length} FAILED: ${err?.message || err}`);
			}
		}

		console.log(`[reset] ImageKit deletes done — deleted:${deleted} failed:${failed}`);
	}

	await fs.writeFile(PROGRESS_FILE, '{}\n');
	console.log('[reset] cleared scripts/upload-progress.json');
	console.log(
		'\n[reset] next: node scripts/build-gallery-manifest.mjs && node scripts/upload-gallery.mjs',
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
