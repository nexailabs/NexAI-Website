// Cloudflare Worker entry — wraps the static Astro build (env.ASSETS) with a
// single API route for the Prompt Hub run counter. Replaces the legacy Pages
// Function at functions/api/runs.ts when deploying via Workers Static Assets.
//
// Routes:
//   GET  /api/runs   → { total: number }
//   POST /api/runs   → { total: number } after incrementing
//                      Body (optional):
//                        { slug?: string, kind?: 'copy' | 'install' | 'try' | 'unlock' }
//   *                → env.ASSETS.fetch(request) — the static site
//
// KV layout (unchanged from the Pages Function):
//   runs:total, runs:slug:<slug>, runs:kind:<kind>

interface KVNamespace {
	get(key: string): Promise<string | null>;
	put(key: string, value: string): Promise<void>;
}

interface Env {
	ASSETS: Fetcher;
	PROMPT_HUB_KV: KVNamespace;
}

const SLUG_RE = /^[a-z0-9-]{1,64}$/;
const KIND_ALLOWLIST = new Set(['copy', 'install', 'try', 'unlock']);

const json = (status: number, body: unknown, extra: HeadersInit = {}) =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
			'cache-control': 'no-store',
			'access-control-allow-origin': '*',
			'access-control-allow-methods': 'GET, POST, OPTIONS',
			'access-control-allow-headers': 'content-type',
			...extra,
		},
	});

async function readTotal(env: Env): Promise<number> {
	const raw = await env.PROMPT_HUB_KV.get('runs:total');
	const n = raw ? parseInt(raw, 10) : 0;
	return Number.isFinite(n) && n >= 0 ? n : 0;
}

async function increment(env: Env, key: string): Promise<number> {
	const raw = await env.PROMPT_HUB_KV.get(key);
	const n = raw ? parseInt(raw, 10) : 0;
	const next = (Number.isFinite(n) && n >= 0 ? n : 0) + 1;
	await env.PROMPT_HUB_KV.put(key, String(next));
	return next;
}

async function handleRuns(request: Request, env: Env): Promise<Response> {
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: {
				'access-control-allow-origin': '*',
				'access-control-allow-methods': 'GET, POST, OPTIONS',
				'access-control-allow-headers': 'content-type',
				'access-control-max-age': '86400',
			},
		});
	}

	if (!env?.PROMPT_HUB_KV) return json(503, { total: 0, error: 'kv-unbound' });

	if (request.method === 'GET') {
		const total = await readTotal(env);
		return json(200, { total });
	}

	if (request.method === 'POST') {
		let body: { slug?: unknown; kind?: unknown } = {};
		try {
			body = await request.json();
		} catch {
			// allow empty / non-JSON beacons — they still count as a run
		}

		const slug = typeof body.slug === 'string' && SLUG_RE.test(body.slug) ? body.slug : null;
		const kind = typeof body.kind === 'string' && KIND_ALLOWLIST.has(body.kind) ? body.kind : null;

		const total = await increment(env, 'runs:total');
		if (slug) {
			await increment(env, `runs:slug:${slug}`).catch(() => {});
		}
		if (kind) {
			await increment(env, `runs:kind:${kind}`).catch(() => {});
		}

		return json(200, { total });
	}

	return json(405, { error: 'method-not-allowed' }, { allow: 'GET, POST, OPTIONS' });
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === '/api/runs') return handleRuns(request, env);
		return env.ASSETS.fetch(request);
	},
};
