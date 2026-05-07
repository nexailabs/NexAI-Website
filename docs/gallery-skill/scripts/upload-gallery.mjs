// ─────────────────────────────────────────────────────────────────────────────
// MIRROR COPY for AI / engineer reference. Do not run this file.
//
// The runtime version is at /scripts/upload-gallery.mjs. This copy is kept in
// sync manually for the skill bundle (docs/gallery-skill/). If the two drift,
// the runtime version is authoritative.
//
// Credentials are read from .env at repo root — never hardcoded. See
// docs/gallery-skill/.env.example for the template.
//
// If you accidentally `node` this file, the runtime guard below will exit.
// ─────────────────────────────────────────────────────────────────────────────

// scripts/upload-gallery.mjs
//
// Reads scripts/gallery-manifest.json and uploads every `include: true` entry.
// Idempotent: tracks success in scripts/upload-progress.json and skips
// already-uploaded files on re-run.
//
// Pipeline:
// - Images (.jpg/.jpeg/.png/.webp/.avif/.gif): sharp resize to fit max 2000x2000 +
//   re-encode as JPG q85 (mozjpeg). Uploaded to ImageKit.
// - Videos (.mp4/.mov/.webm): ffmpeg transcode to H.264 + AAC, scale to fit max
//   1920x1920, CRF 23, max 4 Mbps. Uploaded to Cloudflare R2 (ImageKit free tier
//   blocks video transformations). Sibling .poster.jpg generated and uploaded too.
//
// On completion, emits src/data/gallery-items.generated.ts — a typed array of
// GalleryItem entries the page consumes.
//
// Usage: node scripts/upload-gallery.mjs

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import ImageKit from 'imagekit';
import sharp from 'sharp';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

function probeDimensions(file) {
	return new Promise((resolve, reject) => {
		ffmpeg.ffprobe(file, (err, data) => {
			if (err) return reject(err);
			const stream = data?.streams?.find((s) => s.codec_type === 'video');
			if (!stream || !stream.width || !stream.height) {
				return reject(new Error('no video stream with dimensions'));
			}
			resolve({ width: stream.width, height: stream.height });
		});
	});
}

const JPEG_QUALITY = 85;
const IMAGE_MAX_DIM = 2000;
const VIDEO_MAX_DIM = 1920;
const VIDEO_CRF = 23;
const VIDEO_MAX_BITRATE = '4M';

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm']);

const __filename = fileURLToPath(import.meta.url);
if (__filename.replaceAll('\\', '/').includes('docs/gallery-skill/')) {
	console.error('[mirror] This is a reference copy. Run /scripts/upload-gallery.mjs instead.');
	process.exit(1);
}

const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(PROJECT_ROOT, '.env');
const MANIFEST_FILE = path.join(PROJECT_ROOT, 'scripts/gallery-manifest.json');
const PROGRESS_FILE = path.join(PROJECT_ROOT, 'scripts/upload-progress.json');
const OUT_FILE = path.join(PROJECT_ROOT, 'src/data/gallery-items.generated.ts');

async function loadEnv() {
	let content;
	try {
		content = await fs.readFile(ENV_FILE, 'utf-8');
	} catch (err) {
		if (err.code === 'ENOENT') {
			console.error(`[upload] FATAL: .env not found at ${ENV_FILE}`);
			console.error(
				'[upload] Copy docs/gallery-skill/.env.example to .env at repo root and fill in real credentials.',
			);
			process.exit(1);
		}
		throw err;
	}
	for (const line of content.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const idx = trimmed.indexOf('=');
		if (idx === -1) continue;
		const key = trimmed.slice(0, idx).trim();
		// Strip surrounding quotes (common .env convention but breaks our consumers).
		const val = trimmed
			.slice(idx + 1)
			.trim()
			.replace(/^"(.*)"$/, '$1')
			.replace(/^'(.*)'$/, '$1');
		if (!process.env[key]) process.env[key] = val;
	}
}

async function loadJson(file, fallback) {
	try {
		const content = await fs.readFile(file, 'utf-8');
		return JSON.parse(content);
	} catch (err) {
		if (err.code === 'ENOENT') return fallback;
		throw err;
	}
}

function classifyAspect(width, height) {
	if (!width || !height) return 'portrait';
	const ratio = width / height;
	if (Math.abs(ratio - 1) < 0.05) return 'square';
	return ratio > 1 ? 'landscape' : 'portrait';
}

function buildSrcUrl(endpoint, destPath) {
	return `${endpoint.replace(/\/$/, '')}${destPath}`;
}

async function processImage(srcBuf) {
	const pipeline = sharp(srcBuf, { failOn: 'none' })
		.rotate() // honor EXIF orientation
		.resize({
			width: IMAGE_MAX_DIM,
			height: IMAGE_MAX_DIM,
			fit: 'inside',
			withoutEnlargement: true,
		})
		.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
	const buf = await pipeline.toBuffer({ resolveWithObject: true });
	return { buffer: buf.data, width: buf.info.width, height: buf.info.height };
}

async function processVideo(srcBuf, sourceExt) {
	const id = randomBytes(8).toString('hex');
	const tmpIn = path.join(os.tmpdir(), `gallery-in-${id}${sourceExt}`);
	const tmpOut = path.join(os.tmpdir(), `gallery-out-${id}.mp4`);

	await fs.writeFile(tmpIn, srcBuf);

	try {
		await new Promise((resolve, reject) => {
			ffmpeg(tmpIn)
				.videoCodec('libx264')
				.audioCodec('aac')
				.audioBitrate('128k')
				.addOption('-crf', String(VIDEO_CRF))
				.addOption('-preset', 'medium')
				.addOption('-maxrate', VIDEO_MAX_BITRATE)
				.addOption('-bufsize', '8M')
				.addOption('-pix_fmt', 'yuv420p')
				.addOption('-movflags', '+faststart')
				.videoFilter(
					`scale='min(${VIDEO_MAX_DIM},iw)':'min(${VIDEO_MAX_DIM},ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2`,
				)
				.format('mp4')
				.save(tmpOut)
				.on('end', resolve)
				.on('error', reject);
		});

		const outBuf = await fs.readFile(tmpOut);

		// Probe the transcoded output for real dimensions.
		let dims = null;
		try {
			dims = await probeDimensions(tmpOut);
		} catch {
			// ignore — caller falls back to portrait default
		}

		// Generate a poster image at 1s offset, max 800px wide.
		const tmpPoster = path.join(os.tmpdir(), `gallery-poster-${id}.jpg`);
		let posterBuf = null;
		try {
			await new Promise((resolve, reject) => {
				ffmpeg(tmpOut)
					.seekInput(1)
					.outputOption('-frames:v', '1')
					.videoFilter("scale='min(800,iw)':-2")
					.outputOption('-q:v', '4')
					.save(tmpPoster)
					.on('end', resolve)
					.on('error', reject);
			});
			posterBuf = await fs.readFile(tmpPoster);
		} catch {
			// ignore — caller will fall back to no poster
		} finally {
			await fs.unlink(tmpPoster).catch(() => {});
		}

		return {
			buffer: outBuf,
			width: dims?.width ?? null,
			height: dims?.height ?? null,
			poster: posterBuf,
		};
	} finally {
		await fs.unlink(tmpIn).catch(() => {});
		await fs.unlink(tmpOut).catch(() => {});
	}
}

async function main() {
	await loadEnv();

	const endpoint = process.env.IMAGEKIT_URL_ENDPOINT;
	const ik = new ImageKit({
		publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
		privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
		urlEndpoint: endpoint,
	});

	// Cloudflare R2 client — videos go here (ImageKit free tier blocks video transformations).
	// Client is null unless ALL four vars are present, so the pre-flight check below catches
	// any missing piece before per-video failures pile up.
	const r2Endpoint = process.env.R2_ENDPOINT;
	const r2Bucket = process.env.R2_BUCKET;
	const r2PublicUrl = process.env.R2_PUBLIC_URL;
	const r2AccessKey = process.env.R2_ACCESS_KEY_ID;
	const r2SecretKey = process.env.R2_SECRET_ACCESS_KEY;
	const r2 =
		r2Endpoint && r2Bucket && r2PublicUrl && r2AccessKey && r2SecretKey
			? new S3Client({
					region: 'auto',
					endpoint: r2Endpoint,
					credentials: { accessKeyId: r2AccessKey, secretAccessKey: r2SecretKey },
				})
			: null;

	// Convert /studio/gallery/{brand}/{sub}/{file} → {brand}/{sub}/{file} for R2 keys.
	function r2KeyFromDestPath(destPath) {
		return destPath.replace(/^\/studio\/gallery\//, '');
	}
	function r2UrlFromKey(key) {
		return `${r2PublicUrl.replace(/\/$/, '')}/${key}`;
	}

	const manifest = await loadJson(MANIFEST_FILE);
	const progress = await loadJson(PROGRESS_FILE, {});

	const items = manifest.filter((m) => m.include);
	console.log(
		`[upload] manifest has ${manifest.length} entries; ${items.length} flagged include:true`,
	);

	// Pre-flight: if any video items are queued and R2 isn't configured, fail fast.
	const pendingVideoCount = items.filter(
		(it) =>
			VIDEO_EXTS.has(path.extname(it.originalPath).toLowerCase()) &&
			progress[it.destPath]?.status !== 'uploaded',
	).length;
	if (pendingVideoCount > 0 && (!r2 || !r2PublicUrl)) {
		console.error(
			`[upload] FATAL: ${pendingVideoCount} video item(s) need uploading but R2 is not configured.`,
		);
		console.error(
			'[upload] Set R2_ENDPOINT, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL in .env',
		);
		console.error('[upload] See docs/gallery-skill/.env.example for the template.');
		process.exit(1);
	}

	let uploaded = 0;
	let skipped = 0;
	let failed = 0;
	const startedAt = Date.now();

	for (let i = 0; i < items.length; i++) {
		const item = items[i];

		if (progress[item.destPath]?.status === 'uploaded') {
			skipped++;
			continue;
		}

		const folder = path.posix.dirname(item.destPath);
		const fileName = path.posix.basename(item.destPath);

		try {
			const srcBuf = await fs.readFile(item.originalPath);
			const sourceExt = path.extname(item.originalPath).toLowerCase();
			const isVideoSrc = VIDEO_EXTS.has(sourceExt);

			if (isVideoSrc) {
				if (!r2 || !r2PublicUrl) {
					throw new Error('R2 not configured — cannot upload video');
				}

				const out = await processVideo(srcBuf, sourceExt);
				const key = r2KeyFromDestPath(item.destPath);

				// Upload .mp4
				await r2.send(
					new PutObjectCommand({
						Bucket: r2Bucket,
						Key: key,
						Body: out.buffer,
						ContentType: 'video/mp4',
						CacheControl: 'public, max-age=31536000, immutable',
					}),
				);

				// Upload poster .jpg sibling — naming: {basename}.poster.jpg
				let posterUrl = null;
				if (out.poster) {
					const posterKey = key.replace(/\.[^./]+$/, '.poster.jpg');
					await r2.send(
						new PutObjectCommand({
							Bucket: r2Bucket,
							Key: posterKey,
							Body: out.poster,
							ContentType: 'image/jpeg',
							CacheControl: 'public, max-age=31536000, immutable',
						}),
					);
					posterUrl = r2UrlFromKey(posterKey);
				}

				const aspect = classifyAspect(out.width, out.height);

				progress[item.destPath] = {
					status: 'uploaded',
					host: 'r2',
					src: r2UrlFromKey(key),
					poster: posterUrl,
					width: out.width,
					height: out.height,
					aspect,
					brand: item.brand,
					category: item.category,
					subcategory: item.subcategory,
					type: item.type,
					alt: item.alt,
					uploadedAt: new Date().toISOString(),
				};
			} else if (IMAGE_EXTS.has(sourceExt)) {
				const out = await processImage(srcBuf);
				const result = await ik.upload({
					file: out.buffer,
					fileName,
					folder,
					useUniqueFileName: false,
					overwriteFile: false,
				});

				const width = result.width || out.width;
				const height = result.height || out.height;
				const aspect = classifyAspect(width, height);
				const src = result.url || buildSrcUrl(endpoint, item.destPath);

				progress[item.destPath] = {
					status: 'uploaded',
					host: 'imagekit',
					fileId: result.fileId,
					src,
					width,
					height,
					aspect,
					brand: item.brand,
					category: item.category,
					subcategory: item.subcategory,
					type: item.type,
					alt: item.alt,
					uploadedAt: new Date().toISOString(),
				};
			} else {
				throw new Error(`Unsupported source extension: ${sourceExt}`);
			}
			uploaded++;
		} catch (err) {
			const msg = err?.message || String(err);
			progress[item.destPath] = {
				status: 'failed',
				error: msg,
				attemptedAt: new Date().toISOString(),
			};
			failed++;
			console.error(`[upload] FAIL ${item.destPath}: ${msg}`);
		}

		const done = uploaded + skipped + failed;
		if (done % 10 === 0 || done === items.length) {
			await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
			const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
			console.log(
				`[upload] ${done}/${items.length} — uploaded:${uploaded} skipped:${skipped} failed:${failed} (${elapsed}s)`,
			);
		}
	}

	await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));

	// Backfill: probe video sources for any uploaded entries that didn't capture
	// real width/height. Only works on the machine that has source files at originalPath.
	let backfilled = 0;
	for (const item of items) {
		if (item.type !== 'video') continue;
		const p = progress[item.destPath];
		if (!p || p.status !== 'uploaded') continue;
		if (p.width && p.height) continue;
		try {
			const dims = await probeDimensions(item.originalPath);
			p.width = dims.width;
			p.height = dims.height;
			p.aspect = classifyAspect(dims.width, dims.height);
			backfilled++;
		} catch (e) {
			console.warn(`[backfill] ffprobe failed for ${item.destPath}: ${e?.message || e}`);
		}
	}
	if (backfilled > 0) {
		await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
		console.log(`[backfill] probed ${backfilled} videos for real aspect`);
	}

	const generatedItems = items
		.map((item) => progress[item.destPath])
		.filter((p) => p && p.status === 'uploaded')
		.map((p) => ({
			src: p.src,
			alt: p.alt,
			brand: p.brand,
			category: p.category,
			subcategory: p.subcategory,
			type: p.type,
			aspect: p.aspect,
		}));

	const tsContent = `// AUTO-GENERATED by scripts/upload-gallery.mjs — do not edit by hand.
// Regenerate by re-running the upload script.

import type { GalleryItem } from './gallery';

export const generatedGalleryItems: GalleryItem[] = ${JSON.stringify(generatedItems, null, 2)};
`;
	await fs.writeFile(OUT_FILE, tsContent);

	const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
	console.log(
		`\n[upload] done in ${elapsed}s — uploaded:${uploaded} skipped:${skipped} failed:${failed}`,
	);
	console.log(`[upload] generated items: ${generatedItems.length} → ${OUT_FILE}`);

	if (failed > 0) {
		console.log(
			`\n[upload] ${failed} failures in ${PROGRESS_FILE} (status:failed). Re-run to retry.`,
		);
		process.exit(1);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
