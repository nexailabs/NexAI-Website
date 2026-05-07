#!/usr/bin/env node
// scripts/cleanup-png-uploads.mjs
//
// Deletes PNG/WebP/etc. uploads from ImageKit (status:uploaded entries with
// non-JPG image extensions in destPath) and removes them from upload-progress.json.
// Used to free storage before re-uploading those sources as JPG-converted buffers.
//
// JPG/JPEG uploads are NOT touched — they're already efficient.
// Videos and failed entries are NOT touched.
//
// Usage: node scripts/cleanup-png-uploads.mjs [--dry-run]

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ImageKit from 'imagekit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(PROJECT_ROOT, '.env');
const PROGRESS_FILE = path.join(PROJECT_ROOT, 'scripts/upload-progress.json');

const RECODE_EXTS = new Set(['.png', '.webp', '.avif', '.gif']);
const DRY_RUN = process.argv.includes('--dry-run');

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
		const ext = path.extname(destPath).toLowerCase();
		if (!RECODE_EXTS.has(ext)) continue;
		if (!p.fileId) {
			console.warn(`[cleanup] WARN no fileId for ${destPath}, skipping`);
			continue;
		}
		targets.push({ destPath, fileId: p.fileId });
	}

	console.log(
		`[cleanup] ${targets.length} non-JPG uploads to delete from ImageKit${DRY_RUN ? ' (DRY RUN)' : ''}`,
	);
	if (targets.length === 0) {
		console.log('[cleanup] nothing to do');
		return;
	}

	if (DRY_RUN) {
		for (const t of targets.slice(0, 20)) console.log(`  ${t.destPath}`);
		if (targets.length > 20) console.log(`  ... (${targets.length - 20} more)`);
		return;
	}

	const batches = chunk(targets, 100);
	let deleted = 0;
	let failed = 0;

	for (let i = 0; i < batches.length; i++) {
		const batch = batches[i];
		const ids = batch.map((b) => b.fileId);
		try {
			await ik.bulkDeleteFiles(ids);
			deleted += batch.length;
			for (const t of batch) delete progress[t.destPath];
			console.log(`[cleanup] batch ${i + 1}/${batches.length} — deleted ${batch.length}`);
		} catch (err) {
			failed += batch.length;
			console.error(`[cleanup] batch ${i + 1}/${batches.length} FAILED: ${err?.message || err}`);
		}
		// Persist progress after each batch
		await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
	}

	console.log(`\n[cleanup] done — deleted:${deleted} failed:${failed}`);
	console.log(
		'[cleanup] upload-progress.json updated. Re-run build-gallery-manifest + upload-gallery to recreate as JPG.',
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
