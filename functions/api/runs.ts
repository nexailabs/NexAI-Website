// Cloudflare Pages Function — Prompt Hub run counter.
// GET  /api/runs       → { total: number }
// POST /api/runs       → { total: number } after incrementing
// Body (optional, all fields optional):
//   { slug?: string, kind?: 'copy' | 'install' | 'try' | 'unlock' }
//
// Storage: a single KV namespace bound as PROMPT_HUB_KV.
// Keys:    runs:total, runs:slug:<slug>, runs:kind:<kind>
//
// KV is eventually-consistent and not transactional. For a public vanity
// counter with low write QPS, optimistic read-then-write is fine; an
// occasional missed +1 doesn't matter. If write traffic ever climbs into
// the high-QPS range, swap to a Durable Object.

interface Env {
	PROMPT_HUB_KV: KVNamespace;
}

interface KVNamespace {
	get(key: string): Promise<string | null>;
	put(key: string, value: string): Promise<void>;
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

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, {
		status: 204,
		headers: {
			'access-control-allow-origin': '*',
			'access-control-allow-methods': 'GET, POST, OPTIONS',
			'access-control-allow-headers': 'content-type',
			'access-control-max-age': '86400',
		},
	});

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
	if (!env?.PROMPT_HUB_KV) return json(503, { total: 0, error: 'kv-unbound' });
	const total = await readTotal(env);
	return json(200, { total });
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
	if (!env?.PROMPT_HUB_KV) return json(503, { total: 0, error: 'kv-unbound' });

	let body: { slug?: unknown; kind?: unknown } = {};
	try {
		body = await request.json();
	} catch {
		// allow empty / non-JSON beacons — they still count as a run
	}

	const slug = typeof body.slug === 'string' && SLUG_RE.test(body.slug) ? body.slug : null;
	const kind =
		typeof body.kind === 'string' && KIND_ALLOWLIST.has(body.kind) ? body.kind : null;

	const total = await increment(env, 'runs:total');
	if (slug) {
		// fire-and-forget per-slug; failure shouldn't break the response
		await increment(env, `runs:slug:${slug}`).catch(() => {});
	}
	if (kind) {
		await increment(env, `runs:kind:${kind}`).catch(() => {});
	}

	return json(200, { total });
};

// Pages Function type shim — keeps the file standalone without pulling
// @cloudflare/workers-types into the project's npm tree.
type PagesFunction<E = unknown, P extends string = string, D = Record<string, unknown>> = (
	context: {
		request: Request;
		env: E;
		params: Record<P, string | string[]>;
		data: D;
		waitUntil: (promise: Promise<unknown>) => void;
		next: () => Promise<Response>;
	},
) => Response | Promise<Response>;
