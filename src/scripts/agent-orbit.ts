// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Agent orbit behavior — snap-and-dwell carousel.
//
// Each card body is a bespoke "working console" per agent — one renderer per
// agent, not a generic state-mode system. Orbit motion, neutron star, and node
// entry stay unchanged; only the body content swaps.
// Spec: docs/superpowers/specs/2026-05-23-hero-console-cards-design.md
//
// All DOM construction goes through the el() builder — no innerHTML on user
// data paths. The few places we need raw markup (SVG attribute snippets) use
// document.createElementNS directly.

import { agents } from '../data/home';

const DWELL_MS = 3000;
const TRANSITION_MS = 1100;
const REDUCED_CYCLE_MS = 4000;
const CONTENT_SWAP_MS = 200;

let cleanupCurrent: (() => void) | null = null;

document.addEventListener('astro:before-swap', function () {
	if (cleanupCurrent) {
		cleanupCurrent();
		cleanupCurrent = null;
	}
});

document.addEventListener('astro:page-load', function () {
	if (cleanupCurrent) {
		cleanupCurrent();
		cleanupCurrent = null;
	}
	const orbit = document.querySelector('[data-orbit]');
	const detail = document.querySelector('[data-orbit-detail]');
	const nodes = document.querySelectorAll('[data-orbit-node]');
	if (!orbit || !detail || !nodes.length) return;

	const titleEl = detail.querySelector('[data-orbit-detail-title]');
	const roleEl = detail.querySelector('[data-orbit-detail-role]');
	const badgeEl = detail.querySelector('[data-orbit-badge]');
	const bodyEl = detail.querySelector('[data-orbit-body]');

	const NODE_COUNT = nodes.length;
	const ARC_PER_NODE = 360 / NODE_COUNT;
	const NS = 'http://www.w3.org/2000/svg';

	let rotation = 0;
	let activeId = null;
	let currentIdx = 0;
	let targetIdx = 0;
	let state = 'dwelling';
	let stateStart = 0;
	let rotationFrom = 0;
	let rotationTo = 0;
	let rafHandle = 0;
	let intervalHandle: number | null = null;
	let contentSwapped = true;
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// ── Timer registry: cleared at every body swap so a late callback never
	// mutates a detached node.
	const pendingTimers: number[] = [];
	const pendingIntervals: number[] = [];
	function trackTimeout(id: number): number {
		pendingTimers.push(id);
		return id;
	}
	function trackInterval(id: number): number {
		pendingIntervals.push(id);
		return id;
	}
	function clearPending() {
		while (pendingTimers.length) {
			const id = pendingTimers.pop();
			if (id != null) window.clearTimeout(id);
		}
		while (pendingIntervals.length) {
			const id = pendingIntervals.pop();
			if (id != null) window.clearInterval(id);
		}
	}

	function applyRotation(deg) {
		orbit.style.setProperty('--orbit-rotation', deg + 'deg');
	}

	function targetRotationForIndex(i) {
		let t = (-i * ARC_PER_NODE) % 360;
		if (t < 0) t += 360;
		return t;
	}

	function formatNum(n) {
		return n.toLocaleString('en-IN');
	}

	// DOM builder — keeps renderers short while staying off innerHTML.
	function el(tag, attrs, children) {
		const e = document.createElement(tag);
		if (attrs) {
			for (const k in attrs) {
				if (attrs[k] == null) continue;
				if (k === 'class') e.className = attrs[k];
				else if (k === 'text') e.appendChild(document.createTextNode(String(attrs[k])));
				else if (k === 'style') e.setAttribute('style', attrs[k]);
				else e.setAttribute(k, attrs[k]);
			}
		}
		if (children) {
			children.forEach(function (c) {
				if (c == null || c === false) return;
				if (typeof c === 'string') e.appendChild(document.createTextNode(c));
				else e.appendChild(c);
			});
		}
		return e;
	}

	function svgIconCheck(size?) {
		const s = document.createElementNS(NS, 'svg');
		s.setAttribute('viewBox', '0 0 16 16');
		s.setAttribute('width', String(size || 12));
		s.setAttribute('height', String(size || 12));
		s.setAttribute('fill', 'none');
		s.setAttribute('stroke', 'currentColor');
		s.setAttribute('stroke-width', '2.2');
		s.setAttribute('stroke-linecap', 'round');
		s.setAttribute('stroke-linejoin', 'round');
		const p = document.createElementNS(NS, 'path');
		p.setAttribute('d', 'M3.5 8.5l3 3 6-6.5');
		s.appendChild(p);
		return s;
	}

	function svgSpinner() {
		const s = document.createElementNS(NS, 'svg');
		s.setAttribute('viewBox', '0 0 16 16');
		s.setAttribute('width', '14');
		s.setAttribute('height', '14');
		s.setAttribute('fill', 'none');
		s.setAttribute('stroke', 'currentColor');
		s.setAttribute('stroke-width', '1.6');
		s.setAttribute('stroke-linecap', 'round');
		s.setAttribute('class', 'orbit__btn-spinner');
		const c = document.createElementNS(NS, 'circle');
		c.setAttribute('cx', '8');
		c.setAttribute('cy', '8');
		c.setAttribute('r', '6');
		c.setAttribute('opacity', '0.25');
		const p = document.createElementNS(NS, 'path');
		p.setAttribute('d', 'M14 8a6 6 0 00-6-6');
		s.appendChild(c);
		s.appendChild(p);
		return s;
	}

	function svgHeart() {
		const s = document.createElementNS(NS, 'svg');
		s.setAttribute('viewBox', '0 0 16 16');
		s.setAttribute('width', '12');
		s.setAttribute('height', '12');
		s.setAttribute('fill', 'currentColor');
		const p = document.createElementNS(NS, 'path');
		p.setAttribute(
			'd',
			'M8 13.7C7.5 13.4 1.5 9.4 1.5 5.5a3 3 0 015.3-1.9l1.2 1.6 1.2-1.6A3 3 0 0114.5 5.5c0 3.9-6 7.9-6.5 8.2z',
		);
		s.appendChild(p);
		return s;
	}

	function svgComment() {
		const s = document.createElementNS(NS, 'svg');
		s.setAttribute('viewBox', '0 0 16 16');
		s.setAttribute('width', '12');
		s.setAttribute('height', '12');
		s.setAttribute('fill', 'none');
		s.setAttribute('stroke', 'currentColor');
		s.setAttribute('stroke-width', '1.5');
		s.setAttribute('stroke-linecap', 'round');
		const p = document.createElementNS(NS, 'path');
		p.setAttribute('d', 'M13 8A5 5 0 113 8a5 5 0 0110 0zM5 12l-2 2.5V12');
		s.appendChild(p);
		return s;
	}

	function svgShare() {
		const s = document.createElementNS(NS, 'svg');
		s.setAttribute('viewBox', '0 0 16 16');
		s.setAttribute('width', '12');
		s.setAttribute('height', '12');
		s.setAttribute('fill', 'none');
		s.setAttribute('stroke', 'currentColor');
		s.setAttribute('stroke-width', '1.5');
		s.setAttribute('stroke-linecap', 'round');
		s.setAttribute('stroke-linejoin', 'round');
		const p = document.createElementNS(NS, 'path');
		p.setAttribute('d', 'M11 2l3 3-3 3M14 5H6a4 4 0 000 8h1');
		s.appendChild(p);
		return s;
	}

	// Sales-ops tool icons — 12px, currentColor stroke.
	function svgToolIcon(key: string, size = 12) {
		const s = document.createElementNS(NS, 'svg');
		s.setAttribute('viewBox', '0 0 16 16');
		s.setAttribute('width', String(size));
		s.setAttribute('height', String(size));
		// LinkedIn — official "in" bug rendered in currentColor (rounded square
		// with "in" knocked out via evenodd, so it inherits the row's tint).
		if (key === 'linkedin') {
			s.setAttribute('viewBox', '0 0 24 24');
			s.setAttribute('fill', 'currentColor');
			const mark = document.createElementNS(NS, 'path');
			mark.setAttribute('fill-rule', 'evenodd');
			mark.setAttribute('clip-rule', 'evenodd');
			mark.setAttribute(
				'd',
				'M3 0h18a3 3 0 013 3v18a3 3 0 01-3 3H3a3 3 0 01-3-3V3a3 3 0 013-3zm3.94 8.5a1.94 1.94 0 10-.001-3.879A1.94 1.94 0 006.94 8.5zM5.13 19.5h3.63V9.99H5.13V19.5zm5.94-9.51h3.48v1.3h.05c.49-.87 1.68-1.79 3.46-1.79 3.7 0 4.38 2.32 4.38 5.34v4.66h-3.63v-4.13c0-.99-.02-2.26-1.4-2.26-1.4 0-1.62 1.06-1.62 2.18v4.21h-3.63V9.99z'
			);
			s.appendChild(mark);
			return s;
		}
		// CRM renders as the literal letters "CRM" in currentColor.
		// Wider canvas (≈1.7:1) so 3 chars stay legible at 11px height.
		if (key === 'crm') {
			s.setAttribute('viewBox', '0 0 28 16');
			s.setAttribute('width', String(Math.round(size * 1.75)));
			s.setAttribute('height', String(size));
			s.setAttribute('fill', 'currentColor');
			const t = document.createElementNS(NS, 'text');
			t.setAttribute('x', '14');
			t.setAttribute('y', '8.5');
			t.setAttribute('text-anchor', 'middle');
			t.setAttribute('dominant-baseline', 'central');
			t.setAttribute(
				'font-family',
				'"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
			);
			t.setAttribute('font-size', '12');
			t.setAttribute('font-weight', '400');
			t.setAttribute('letter-spacing', '-0.2');
			t.textContent = 'CRM';
			s.appendChild(t);
			return s;
		}
		s.setAttribute('fill', 'none');
		s.setAttribute('stroke', 'currentColor');
		s.setAttribute('stroke-width', '1.5');
		s.setAttribute('stroke-linecap', 'round');
		s.setAttribute('stroke-linejoin', 'round');
		let d = '';
		if (key === 'phone') {
			d = 'M3 3.5a1 1 0 011-1h2l1 3-1.5 1a8 8 0 003.5 3.5l1-1.5 3 1v2a1 1 0 01-1 1A10 10 0 013 3.5z';
		} else if (key === 'email') {
			d = 'M2 4.5h12v8H2zM2 4.5l6 4.5 6-4.5';
		} else if (key === 'screen') {
			// monitor / demo screenshare
			d = 'M2 3h12v8H2zM5.5 13.5h5M8 11v2.5';
		} else if (key === 'calendar') {
			// calendar grid w/ binding tick + top edge
			d = 'M2.5 4.5h11v9h-11zM5 2.5v3M11 2.5v3M2.5 7.5h11';
		} else if (key === 'crm-save') {
			// stacked rows + tick = CRM-write
			d = 'M2.5 4h11M2.5 8h7M2.5 12h5M11 11l1.5 1.5L15 9.5';
		} else if (key === 'sources') {
			// stacked rectangles — incoming feeds
			d = 'M2.5 4.5h11v2h-11zM2.5 8h11v2h-11zM2.5 11.5h11v2h-11z';
		} else if (key === 'filter') {
			// funnel
			d = 'M2 3h12l-4.5 5.5v5l-3-1.5v-3.5z';
		} else if (key === 'cluster') {
			// 3 grouped nodes
			d = 'M5 4l-2 3 2 3M11 4l2 3-2 3M5 7h6M8 7v3';
		} else if (key === 'brief') {
			// document w/ folded corner
			d = 'M3.5 2.5h6L13 6v8H3.5zM9.5 2.5v3.5H13M5.5 9h6M5.5 12h4';
		} else if (key === 'slack') {
			// hash — Slack channel
			d = 'M5 2v12M11 2v12M2 5.5h12M2 10.5h12';
		} else if (key === 'notion') {
			// page w/ folded corner — Notion
			d = 'M3.5 2.5h6L13 6v8H3.5zM9.5 2.5v3.5H13';
		} else if (key === 'bloomberg') {
			// stylized B
			d = 'M4 3h4a2 2 0 010 4H4M4 7h5a2 2 0 010 4H4zM4 3v8';
		} else if (key === 'x') {
			// X — Twitter rebrand
			d = 'M3.5 3.5l9 9M12.5 3.5l-9 9';
		} else if (key === 'crunchbase') {
			// rising chart
			d = 'M2 12l3-4 3 2 3-5 3 3M11 6h2v2';
		}
		const p = document.createElementNS(NS, 'path');
		p.setAttribute('d', d);
		s.appendChild(p);
		return s;
	}

	// Brand-color platform logos for the Social card — white mark, brand-color
	// background applied by the wrapping chip's CSS class. One SVG per platform.
	function svgPlatformLogo(key: string, size = 14) {
		const s = document.createElementNS(NS, 'svg');
		s.setAttribute('viewBox', '0 0 24 24');
		s.setAttribute('width', String(size));
		s.setAttribute('height', String(size));
		s.setAttribute('aria-hidden', 'true');
		if (key === 'ig') {
			s.setAttribute('fill', 'none');
			s.setAttribute('stroke', '#fff');
			s.setAttribute('stroke-width', '2');
			s.setAttribute('stroke-linecap', 'round');
			s.setAttribute('stroke-linejoin', 'round');
			const rect = document.createElementNS(NS, 'rect');
			rect.setAttribute('x', '3');
			rect.setAttribute('y', '3');
			rect.setAttribute('width', '18');
			rect.setAttribute('height', '18');
			rect.setAttribute('rx', '5');
			const c1 = document.createElementNS(NS, 'circle');
			c1.setAttribute('cx', '12');
			c1.setAttribute('cy', '12');
			c1.setAttribute('r', '4');
			const dot = document.createElementNS(NS, 'circle');
			dot.setAttribute('cx', '17.5');
			dot.setAttribute('cy', '6.5');
			dot.setAttribute('r', '1');
			dot.setAttribute('fill', '#fff');
			dot.setAttribute('stroke', 'none');
			s.appendChild(rect);
			s.appendChild(c1);
			s.appendChild(dot);
			return s;
		}
		if (key === 'fb') {
			s.setAttribute('fill', '#fff');
			const p = document.createElementNS(NS, 'path');
			p.setAttribute(
				'd',
				'M13.5 21v-8H16l.5-3H13.5V8.2c0-.8.3-1.5 1.6-1.5h1.6V4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.1H8v3h2.5v8h3z',
			);
			s.appendChild(p);
			return s;
		}
		if (key === 'tt') {
			s.setAttribute('fill', '#fff');
			const p = document.createElementNS(NS, 'path');
			p.setAttribute(
				'd',
				'M16.5 2v.7c0 2.1 1.7 3.8 3.8 3.8h.7v3.6c-1.7 0-3.4-.5-4.8-1.4v6a6.1 6.1 0 11-6.1-6.1c.4 0 .7 0 1 .1v3.8a2.5 2.5 0 102 2.3V2h3.4z',
			);
			s.appendChild(p);
			return s;
		}
		if (key === 'li') {
			s.setAttribute('fill', '#fff');
			const p = document.createElementNS(NS, 'path');
			p.setAttribute(
				'd',
				'M7 9.5v9H4v-9h3zM5.5 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM18 12.5v6h-3v-5.4c0-1.3-.5-2-1.5-2s-1.5.8-1.5 2v5.4h-3v-9h3v1.3c.5-.7 1.4-1.5 2.8-1.5 1.9 0 3.2 1.2 3.2 3.7z',
			);
			s.appendChild(p);
			return s;
		}
		if (key === 'yt') {
			s.setAttribute('fill', '#fff');
			const p = document.createElementNS(NS, 'path');
			p.setAttribute('d', 'M10 8.5v7L16 12 10 8.5z');
			s.appendChild(p);
			return s;
		}
		if (key === 'x') {
			s.setAttribute('fill', '#fff');
			const p = document.createElementNS(NS, 'path');
			p.setAttribute(
				'd',
				'M17.6 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L2 3h6.4l4.4 5.8L17.6 3zm-1.1 16.2h1.7L7.6 4.7H5.8l10.7 14.5z',
			);
			s.appendChild(p);
			return s;
		}
		return s;
	}

	// Lean area sparkline — gradient fill + line + endpoint dot.
	// Used by Sales for the pipeline-value chart. Inherits currentColor.
	let sparkSeq = 0;
	function buildAreaSparkline(points: number[], width = 180, height = 38) {
		sparkSeq++;
		const max = Math.max.apply(null, points);
		const min = Math.min.apply(null, points);
		const range = max - min || 1;
		const n = points.length;
		const xs: number[] = [];
		const ys: number[] = [];
		for (let i = 0; i < n; i++) {
			xs.push((i / (n - 1)) * width);
			ys.push(height - 3 - ((points[i] - min) / range) * (height - 8));
		}
		// Catmull-Rom → cubic bezier for a natural smooth curve.
		const tension = 0.22;
		function path(closeToBaseline: boolean) {
			let d = 'M ' + xs[0].toFixed(2) + ' ' + ys[0].toFixed(2);
			for (let i = 0; i < n - 1; i++) {
				const x0 = i > 0 ? xs[i - 1] : xs[i];
				const y0 = i > 0 ? ys[i - 1] : ys[i];
				const x1 = xs[i];
				const y1 = ys[i];
				const x2 = xs[i + 1];
				const y2 = ys[i + 1];
				const x3 = i + 2 < n ? xs[i + 2] : xs[i + 1];
				const y3 = i + 2 < n ? ys[i + 2] : ys[i + 1];
				const cp1x = x1 + (x2 - x0) * tension;
				const cp1y = y1 + (y2 - y0) * tension;
				const cp2x = x2 - (x3 - x1) * tension;
				const cp2y = y2 - (y3 - y1) * tension;
				d +=
					' C ' +
					cp1x.toFixed(2) +
					' ' +
					cp1y.toFixed(2) +
					', ' +
					cp2x.toFixed(2) +
					' ' +
					cp2y.toFixed(2) +
					', ' +
					x2.toFixed(2) +
					' ' +
					y2.toFixed(2);
			}
			if (closeToBaseline) {
				d +=
					' L ' +
					xs[n - 1].toFixed(2) +
					' ' +
					height +
					' L ' +
					xs[0].toFixed(2) +
					' ' +
					height +
					' Z';
			}
			return d;
		}
		const svg = document.createElementNS(NS, 'svg');
		svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
		svg.setAttribute('preserveAspectRatio', 'none');
		svg.setAttribute('class', 'orbit__sales__spark');
		const gradId = 'sales-spark-grad-' + sparkSeq;
		const defs = document.createElementNS(NS, 'defs');
		const grad = document.createElementNS(NS, 'linearGradient');
		grad.setAttribute('id', gradId);
		grad.setAttribute('x1', '0');
		grad.setAttribute('y1', '0');
		grad.setAttribute('x2', '0');
		grad.setAttribute('y2', '1');
		const stop1 = document.createElementNS(NS, 'stop');
		stop1.setAttribute('offset', '0%');
		stop1.setAttribute('stop-color', 'currentColor');
		stop1.setAttribute('stop-opacity', '0.45');
		const stop2 = document.createElementNS(NS, 'stop');
		stop2.setAttribute('offset', '100%');
		stop2.setAttribute('stop-color', 'currentColor');
		stop2.setAttribute('stop-opacity', '0');
		grad.appendChild(stop1);
		grad.appendChild(stop2);
		defs.appendChild(grad);
		svg.appendChild(defs);
		const area = document.createElementNS(NS, 'path');
		area.setAttribute('d', path(true));
		area.setAttribute('fill', 'url(#' + gradId + ')');
		area.setAttribute('stroke', 'none');
		svg.appendChild(area);
		const line = document.createElementNS(NS, 'path');
		line.setAttribute('d', path(false));
		line.setAttribute('fill', 'none');
		line.setAttribute('stroke', 'currentColor');
		line.setAttribute('stroke-width', '1.6');
		line.setAttribute('stroke-linecap', 'round');
		line.setAttribute('stroke-linejoin', 'round');
		line.setAttribute('vector-effect', 'non-scaling-stroke');
		svg.appendChild(line);
		const dot = document.createElementNS(NS, 'circle');
		dot.setAttribute('cx', xs[n - 1].toFixed(1));
		dot.setAttribute('cy', ys[n - 1].toFixed(1));
		dot.setAttribute('r', '2.6');
		dot.setAttribute('fill', 'currentColor');
		dot.setAttribute('stroke', 'rgba(0,0,0,0.55)');
		dot.setAttribute('stroke-width', '1');
		dot.setAttribute('vector-effect', 'non-scaling-stroke');
		svg.appendChild(dot);
		return svg;
	}

	// Hook a click → processing → confirmed morph onto any primary button.
	// onConfirm runs once after the processing delay; cleanup is via the timer
	// registry above so a swap during processing doesn't leak callbacks.
	function attachMorphButton(btn: HTMLButtonElement, delayMs: number, onConfirm: () => void) {
		// Spinner is appended on click (not at attach time) so the DOM never
		// contains a stale spinner on initial render. Removed when the morph
		// transitions to its --confirmed state.
		btn.addEventListener('click', function () {
			if (btn.classList.contains('orbit__btn--processing')) return;
			if (btn.classList.contains('orbit__btn--confirmed')) return;
			btn.classList.add('orbit__btn--processing');
			btn.appendChild(svgSpinner());
			trackTimeout(
				window.setTimeout(function () {
					if (!btn.isConnected) return;
					btn.classList.remove('orbit__btn--processing');
					btn.classList.add('orbit__btn--confirmed');
					const sp = btn.querySelector('.orbit__btn-spinner');
					if (sp && sp.parentNode) sp.parentNode.removeChild(sp);
					onConfirm();
				}, delayMs),
			);
		});
	}

	function setConfirmedLabel(btn: HTMLButtonElement, text: string) {
		const lbl = btn.querySelector('.orbit__btn-label');
		if (!lbl) return;
		while (lbl.firstChild) lbl.removeChild(lbl.firstChild);
		lbl.appendChild(svgIconCheck(11));
		lbl.appendChild(document.createTextNode(' ' + text));
	}

	function setBadge(text: string, mode: string) {
		if (!badgeEl) return;
		badgeEl.textContent = text;
		badgeEl.setAttribute('data-mode', mode);
	}

	// Build the universal post-cycle CTA — primary teal pill that replaces an
	// agent's action bar after its demo cycle completes. Visually identical to
	// the Research brief CTA so the pattern reads consistently across agents.
	function buildPostCycleCta(cta: { label: string; sub: string; href: string }) {
		return el(
			'a',
			{
				class: 'orbit__post-cycle-cta',
				href: cta.href,
				'data-open-cal': '',
			},
			[
				el('span', { class: 'orbit__post-cycle-cta-label', text: cta.label }, null),
				el('span', { class: 'orbit__post-cycle-cta-sub', text: cta.sub }, null),
			],
		);
	}

	// Reveal the CTA, dim/hide the action buttons. Idempotent — safe to call
	// multiple times. Caller is responsible for appending the CTA element to
	// the actions wrapper before invoking (so it can fade in).
	function swapToPostCycleCta(actionsWrap: HTMLElement) {
		if (actionsWrap.classList.contains('orbit__actions--post-cycle')) return;
		// If a button inside is focused, move focus to the CTA so the user
		// isn't left tabbing into a visibility:hidden element.
		const active = document.activeElement as HTMLElement | null;
		if (active && actionsWrap.contains(active) && active.classList.contains('orbit__btn')) {
			const cta = actionsWrap.querySelector(
				'.orbit__post-cycle-cta',
			) as HTMLElement | null;
			if (cta) cta.focus();
			else active.blur();
		}
		actionsWrap.classList.add('orbit__actions--post-cycle');
	}

	// Shared cascade-step builder. Used by Social / Creatives / Ops / CEO.
	// Sales (orbit__sales__wf-*) and Research (orbit__research__cq-*) use
	// bespoke step DOM and stay on their own builders.
	function buildCascadeStep(step: { agent: string; detail: string }): HTMLElement {
		return el('div', { class: 'orbit__cascade__step' }, [
			el('span', { class: 'orbit__cascade__arrow', text: '→' }, null),
			el('span', { class: 'orbit__cascade__agent', text: step.agent }, null),
			el('span', { class: 'orbit__cascade__detail', text: step.detail }, null),
		]) as HTMLElement;
	}

	// Shared cascade-cycle runner. Used by Social / Creatives / Ops / CEO.
	// Idempotent — first invocation runs the cascade; further calls are no-ops.
	// Calls swapToPostCycleCta at the final timeout (load-bearing for the
	// sequential fade fix — do not duplicate that logic here).
	function runCascadeCycle(opts: {
		cascadeWrap: HTMLElement;
		actionsWrap: HTMLElement;
		steps: { agent: string; detail: string }[];
		summary: string;
		stagger?: number;
		beforeCascade?: () => void;
	}): void {
		const STEP_LEAD = 220;
		const SUMMARY_LAG = 200;
		const CTA_LAG = 900;
		const stagger = opts.stagger != null ? opts.stagger : 360;
		const summaryAt = STEP_LEAD + opts.steps.length * stagger + SUMMARY_LAG;
		const ctaAt = summaryAt + CTA_LAG;
		const flag = '__cascadeFired';
		const wrap = opts.cascadeWrap as HTMLElement & { [k: string]: unknown };
		if (wrap[flag]) return;
		wrap[flag] = true;
		if (opts.beforeCascade) opts.beforeCascade();
		// Reduced-motion path — append steps + summary synchronously in their
		// final visible state, then swap to the post-cycle CTA. No staggered
		// timers fire, so users with vestibular sensitivity see the end state
		// immediately rather than the timed cascade playing out.
		if (reducedMotion) {
			opts.steps.forEach(function (step) {
				if (!opts.cascadeWrap.isConnected) return;
				const stepEl = buildCascadeStep(step);
				stepEl.classList.add(
					'orbit__cascade__step--enter',
					'orbit__cascade__step--enter-visible',
				);
				opts.cascadeWrap.appendChild(stepEl);
			});
			if (opts.cascadeWrap.isConnected) {
				const summary = el(
					'div',
					{ class: 'orbit__cascade__summary', text: opts.summary },
					null,
				);
				summary.classList.add(
					'orbit__cascade__summary--enter',
					'orbit__cascade__summary--enter-visible',
				);
				opts.cascadeWrap.appendChild(summary);
			}
			if (opts.actionsWrap.isConnected) {
				swapToPostCycleCta(opts.actionsWrap);
			}
			return;
		}
		opts.steps.forEach(function (step, i) {
			trackTimeout(
				window.setTimeout(function () {
					if (!opts.cascadeWrap.isConnected) return;
					const stepEl = buildCascadeStep(step);
					stepEl.classList.add('orbit__cascade__step--enter');
					opts.cascadeWrap.appendChild(stepEl);
					void stepEl.offsetWidth;
					stepEl.classList.add('orbit__cascade__step--enter-visible');
				}, STEP_LEAD + i * stagger),
			);
		});
		trackTimeout(
			window.setTimeout(function () {
				if (!opts.cascadeWrap.isConnected) return;
				const summary = el(
					'div',
					{ class: 'orbit__cascade__summary', text: opts.summary },
					null,
				);
				summary.classList.add('orbit__cascade__summary--enter');
				opts.cascadeWrap.appendChild(summary);
				void (summary as HTMLElement).offsetWidth;
				summary.classList.add('orbit__cascade__summary--enter-visible');
			}, summaryAt),
		);
		trackTimeout(
			window.setTimeout(function () {
				if (!opts.actionsWrap.isConnected) return;
				swapToPostCycleCta(opts.actionsWrap);
			}, ctaAt),
		);
	}

	// Attach the morph→confirm pattern to a pair of primary/secondary buttons;
	// clicking either disables the other and fires onConfirm exactly once.
	function attachDualMorphButtons(
		primary: HTMLButtonElement,
		secondary: HTMLButtonElement,
		delayMs: number,
		onConfirm: () => void,
	): void {
		attachMorphButton(primary, delayMs, function () {
			secondary.setAttribute('disabled', '');
			onConfirm();
		});
		attachMorphButton(secondary, delayMs, function () {
			primary.setAttribute('disabled', '');
			onConfirm();
		});
	}

	// ════════════════════════════════════════════════════════════════════════
	// RENDERERS — one per agent
	// ════════════════════════════════════════════════════════════════════════

	// ── Sales — Agent Workflow ──────────────────────────────────────────────
	function renderSalesWarRoom(s, body) {
		// 1. Pipeline value chart — icons-only tool strip (no labels = no overflow)
		const chart = s.chart;
		const chartHead = el('div', { class: 'orbit__sales__chart-head' }, [
			el('span', { class: 'orbit__sales__chart-label', text: chart.valueLabel }, null),
			el('span', { class: 'orbit__sales__chart-trend', text: chart.trendLabel }, null),
		]);
		const sparkWrap = el('div', { class: 'orbit__sales__chart-spark' }, [
			buildAreaSparkline(chart.points, 200, 36),
		]);
		const chartBlock = el('div', { class: 'orbit__sales__chart' }, [
			chartHead,
			sparkWrap,
		]);

		// 2. Workflow timeline — sequential steps, agent's live work
		function buildStep(step, isLast: boolean) {
			const isDone = step.status === 'done';
			const isCurrent = step.status === 'current';

			const iconBubble = el(
				'span',
				{
					class:
						'orbit__sales__wf-bubble orbit__sales__wf-bubble--' +
						(isDone ? 'done' : 'current'),
				},
				[svgToolIcon(step.iconKey, 11)],
			);

			const rail = el('span', { class: 'orbit__sales__wf-rail' }, [
				iconBubble,
				isLast
					? null
					: el(
							'span',
							{
								class:
									'orbit__sales__wf-rail-line' +
									(isDone ? ' orbit__sales__wf-rail-line--done' : ''),
							},
							null,
						),
			]);

			const titleRow = el('div', { class: 'orbit__sales__wf-title-row' }, [
				el('span', { class: 'orbit__sales__wf-title', text: step.title }, null),
				step.elapsed
					? el('span', { class: 'orbit__sales__wf-elapsed', text: step.elapsed }, null)
					: null,
				isDone
					? el('span', { class: 'orbit__sales__wf-check' }, [svgIconCheck(9)])
					: el('span', { class: 'orbit__sales__wf-pending' }, null),
			]);
			const detailRow = el(
				'div',
				{ class: 'orbit__sales__wf-detail', text: step.detail },
				null,
			);

			return el(
				'div',
				{
					class:
						'orbit__sales__wf-step orbit__sales__wf-step--' +
						(isDone ? 'done' : 'current'),
				},
				[rail, el('div', { class: 'orbit__sales__wf-body' }, [titleRow, detailRow])],
			);
		}

		const workflow = el('div', { class: 'orbit__sales__workflow' }, []);
		s.workflow.forEach(function (step, i) {
			workflow.appendChild(buildStep(step, i === s.workflow.length - 1));
		});

		// 3. Reschedule slot picker — hidden until Reschedule click
		const slotPicker = el(
			'div',
			{ class: 'orbit__sales__reslot-panel', hidden: '' },
			[
				el(
					'div',
					{ class: 'orbit__sales__reslot-head' },
					[
						el('span', { class: 'orbit__sales__reslot-dot' }, null),
						el(
							'span',
							{ class: 'orbit__sales__reslot-check', text: s.rescheduleCheckLabel },
							null,
						),
					],
				),
				el(
					'div',
					{ class: 'orbit__sales__reslot-list' },
					s.rescheduleSlots.map(function (slot, i) {
						return el(
							'button',
							{
								class: 'orbit__sales__reslot-pill',
								type: 'button',
								'data-slot-index': String(i),
							},
							[
								el('span', { class: 'orbit__sales__reslot-pill-time', text: slot.label }, null),
								el('span', { class: 'orbit__sales__reslot-pill-sub', text: slot.sub }, null),
							],
						);
					}),
				),
			],
		);

		// 4. Action bar
		const confirmBtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--primary orbit__sales__confirm', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.confirmLabel }, null)],
		);
		const declineBtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--ghost orbit__sales__decline', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.declineLabel }, null)],
		);
		const postCta = buildPostCycleCta(s.postCycleCta);
		const actions = el('div', { class: 'orbit__sales__actions orbit__actions' }, [
			confirmBtn,
			declineBtn,
			postCta,
		]);

		body.appendChild(chartBlock);
		body.appendChild(workflow);
		body.appendChild(slotPicker);
		body.appendChild(actions);

		// ── Reschedule flow ──
		// Click Reschedule → button processes ~500ms → picker slides in below
		// step 4. Click a slot pill → step 4 title morphs to new time + brief
		// teal flash on the step → picker stays open in case user re-picks.
		let pickerOpen = false;
		let slotPicked = false;
		declineBtn.addEventListener('click', function () {
			if (declineBtn.classList.contains('orbit__btn--processing')) return;
			// Lock out reschedule once Confirm is processing OR the cycle has
			// begun via either path — otherwise the picker can pop in mid-cascade.
			if (confirmBtn.classList.contains('orbit__btn--processing')) return;
			if (confirmBtn.classList.contains('orbit__btn--confirmed')) return;
			if (cycleCompleted) return;

			if (pickerOpen) {
				// Toggle closed
				slotPicker.classList.remove('orbit__sales__reslot-panel--visible');
				trackTimeout(
					window.setTimeout(function () {
						if (!slotPicker.isConnected) return;
						slotPicker.setAttribute('hidden', '');
					}, 280),
				);
				pickerOpen = false;
				return;
			}

			declineBtn.classList.add('orbit__btn--processing');
			declineBtn.appendChild(svgSpinner());
			trackTimeout(
				window.setTimeout(function () {
					if (!declineBtn.isConnected) return;
					declineBtn.classList.remove('orbit__btn--processing');
					const sp = declineBtn.querySelector('.orbit__btn-spinner');
					if (sp && sp.parentNode) sp.parentNode.removeChild(sp);
					// Reveal picker
					slotPicker.removeAttribute('hidden');
					void (slotPicker as HTMLElement).offsetWidth;
					slotPicker.classList.add('orbit__sales__reslot-panel--visible');
					pickerOpen = true;
				}, 520),
			);
		});

		// Cycle-completion sequence — fires after either Confirm OR a
		// reschedule slot pick. Both paths converge on the same end state:
		// step 4 ticked done, post-confirm steps cascade in, summary lands,
		// action bar swaps to the post-cycle CTA. Idempotent.
		// Timings (ms) — single source of truth so cascade can't desync.
		const STEP_LEAD = 220; // delay before 1st post-confirm step enters
		const STEP_STAGGER = 380; // gap between successive steps
		const SUMMARY_LAG = 200; // pause after last step before summary lands
		const CTA_LAG = 900; // pause after summary before CTA swap
		const stepsDuration = STEP_LEAD + s.postConfirm.steps.length * STEP_STAGGER;
		const summaryAt = stepsDuration + SUMMARY_LAG;
		const ctaAt = summaryAt + CTA_LAG;
		let cycleCompleted = false;
		function runCycleCompletion() {
			if (cycleCompleted) return;
			cycleCompleted = true;

			// Tick the current step to done
			const currentStep = workflow.querySelector('.orbit__sales__wf-step--current');
			if (currentStep) {
				currentStep.classList.remove('orbit__sales__wf-step--current');
				currentStep.classList.add('orbit__sales__wf-step--done');
				const bubble = currentStep.querySelector('.orbit__sales__wf-bubble');
				if (bubble) {
					bubble.classList.remove('orbit__sales__wf-bubble--current');
					bubble.classList.add('orbit__sales__wf-bubble--done');
				}
				const pendingDot = currentStep.querySelector('.orbit__sales__wf-pending');
				if (pendingDot && pendingDot.parentNode) {
					const tick = el('span', { class: 'orbit__sales__wf-check' }, [svgIconCheck(9)]);
					pendingDot.parentNode.replaceChild(tick, pendingDot);
				}
				const rail = currentStep.querySelector('.orbit__sales__wf-rail');
				if (rail && !rail.querySelector('.orbit__sales__wf-rail-line')) {
					rail.appendChild(
						el(
							'span',
							{
								class:
									'orbit__sales__wf-rail-line orbit__sales__wf-rail-line--done',
							},
							null,
						),
					);
				}
			}

			// Reduced-motion path — append steps + summary synchronously in
			// their final state, then swap to the post-cycle CTA. No timers fire.
			if (reducedMotion) {
				s.postConfirm.steps.forEach(function (step, i) {
					if (!workflow.isConnected) return;
					const isLast = i === s.postConfirm.steps.length - 1;
					const stepEl = buildStep(step, isLast);
					stepEl.classList.add(
						'orbit__sales__wf-step--enter',
						'orbit__sales__wf-step--enter-visible',
					);
					workflow.appendChild(stepEl);
				});
				if (workflow.isConnected) {
					setConfirmedLabel(confirmBtn, s.confirmedLabel);
					confirmBtn.classList.add('orbit__btn--confirmed');
					const summary = el(
						'div',
						{ class: 'orbit__sales__wf-summary', text: s.postConfirm.summary },
						null,
					);
					summary.classList.add(
						'orbit__sales__wf-summary--enter',
						'orbit__sales__wf-summary--enter-visible',
					);
					workflow.appendChild(summary);
				}
				if (actions.isConnected) swapToPostCycleCta(actions);
				return;
			}

			// Slide in post-confirm steps with stagger
			s.postConfirm.steps.forEach(function (step, i) {
				trackTimeout(
					window.setTimeout(function () {
						if (!workflow.isConnected) return;
						const isLast = i === s.postConfirm.steps.length - 1;
						const stepEl = buildStep(step, isLast);
						stepEl.classList.add('orbit__sales__wf-step--enter');
						workflow.appendChild(stepEl);
						void (stepEl as HTMLElement).offsetWidth;
						stepEl.classList.add('orbit__sales__wf-step--enter-visible');
					}, STEP_LEAD + i * STEP_STAGGER),
				);
			});

			// Reveal summary + flip confirm button to "Booked"
			trackTimeout(
				window.setTimeout(function () {
					if (!workflow.isConnected) return;
					setConfirmedLabel(confirmBtn, s.confirmedLabel);
					confirmBtn.classList.add('orbit__btn--confirmed');
					const summary = el(
						'div',
						{ class: 'orbit__sales__wf-summary', text: s.postConfirm.summary },
						null,
					);
					summary.classList.add('orbit__sales__wf-summary--enter');
					workflow.appendChild(summary);
					void (summary as HTMLElement).offsetWidth;
					summary.classList.add('orbit__sales__wf-summary--enter-visible');
				}, summaryAt),
			);
			// After the summary lands, swap the action bar for the CTA.
			trackTimeout(
				window.setTimeout(function () {
					if (!actions.isConnected) return;
					swapToPostCycleCta(actions);
				}, ctaAt),
			);
		}

		// Slot pill clicks — pick a new time, then run cycle completion
		slotPicker.querySelectorAll('[data-slot-index]').forEach(function (pill) {
			const p = pill as HTMLButtonElement;
			p.addEventListener('click', function () {
				if (cycleCompleted || slotPicked) return;
				slotPicked = true;
				const idx = parseInt(p.dataset.slotIndex || '0', 10);
				const slot = s.rescheduleSlots[idx];

				// Disable all pills so a fast 2nd click can't mutate mid-cascade
				slotPicker.querySelectorAll('[data-slot-index]').forEach(function (other) {
					(other as HTMLButtonElement).setAttribute('disabled', '');
				});

				// Mark this pill selected, clear others
				slotPicker.querySelectorAll('[data-slot-index]').forEach(function (other) {
					other.classList.remove('orbit__sales__reslot-pill--selected');
				});
				p.classList.add('orbit__sales__reslot-pill--selected');

				// Update step 4 title to the new time
				const currentStep = workflow.querySelector('.orbit__sales__wf-step--current');
				if (currentStep) {
					const titleEl = currentStep.querySelector('.orbit__sales__wf-title');
					if (titleEl) titleEl.textContent = 'Meeting · ' + slot.label;
					const detailEl = currentStep.querySelector('.orbit__sales__wf-detail');
					if (detailEl) detailEl.textContent = 'Cal.com invite redrafted · ' + slot.sub;
					currentStep.classList.add('orbit__sales__wf-step--flash');
					trackTimeout(
						window.setTimeout(function () {
							if (currentStep.isConnected) {
								currentStep.classList.remove('orbit__sales__wf-step--flash');
							}
						}, 700),
					);
				}

				// Close picker, then kick off the cycle-completion cascade
				trackTimeout(
					window.setTimeout(function () {
						if (!slotPicker.isConnected) return;
						slotPicker.classList.remove('orbit__sales__reslot-panel--visible');
						trackTimeout(
							window.setTimeout(function () {
								if (!slotPicker.isConnected) return;
								slotPicker.setAttribute('hidden', '');
								pickerOpen = false;
							}, 280),
						);
					}, 550),
				);
				trackTimeout(window.setTimeout(runCycleCompletion, 900));
			});
		});

		// Confirm morph: processing → cycle completion
		attachMorphButton(confirmBtn, 700, runCycleCompletion);
	}

	// ── Social — Inbox Triage ───────────────────────────────────────────────
	// ── Social — Cross-Platform Publisher ───────────────────────────────────
	// Concept: today's content piece → 4 platform tiles (brand-colored chips
	// + live/scheduled/draft status + metric) → 1 ask (LinkedIn caption needs
	// you) → Approve/Edit → cascade fans across platforms → CTA.
	function renderSocialTriage(s, body) {
		// 1. Content piece header — what's being published today
		const contentBlock = el('div', { class: 'orbit__social__content orbit__card-section' }, [
			el(
				'div',
				{ class: 'orbit__social__content-eyebrow', text: s.contentEyebrow },
				null,
			),
			el(
				'div',
				{ class: 'orbit__social__content-title', text: s.contentTitle },
				null,
			),
			el(
				'div',
				{ class: 'orbit__social__content-meta', text: s.contentMeta },
				null,
			),
		]);

		// 2. Platforms row — 4 tiles with brand-letter chips
		const platformsLabel = el(
			'div',
			{ class: 'orbit__social__platforms-label', text: s.platformsLabel },
			null,
		);
		const platformsRow = el(
			'div',
			{ class: 'orbit__social__platforms' },
			s.platforms.map(function (p: any) {
				// The wrapping tile carries the full aria-label below, so each
				// inner span is hidden from AT to prevent double-announcing.
				const chip = el(
					'span',
					{
						class:
							'orbit__social__plat-chip orbit__social__plat-chip--' + p.key,
						'aria-hidden': 'true',
					},
					[svgPlatformLogo(p.key, 14)],
				);
				const status = el(
					'span',
					{
						class:
							'orbit__social__plat-status orbit__social__plat-status--' +
							p.status,
						text: p.statusLabel,
						'aria-hidden': 'true',
					},
					null,
				);
				const metric = el(
					'span',
					{
						class: 'orbit__social__plat-metric',
						text: p.metric,
						'aria-hidden': 'true',
					},
					null,
				);
				return el(
					'div',
					{
						class:
							'orbit__social__plat orbit__social__plat--' + p.status,
						role: 'group',
						'aria-label':
							p.label + ' · ' + p.statusLabel + ' · ' + p.metric,
					},
					[chip, status, metric],
				);
			}),
		);

		// 3. Ask block — the one thing needing human
		const askLabel = el(
			'div',
			{ class: 'orbit__social__ask-label', text: s.askLabel },
			null,
		);
		const askBlock = el('div', { class: 'orbit__social__ask' }, [
			el(
				'div',
				{ class: 'orbit__social__ask-title', text: s.askTitle },
				null,
			),
			el('div', { class: 'orbit__social__ask-draft' }, [
				el(
					'span',
					{ class: 'orbit__social__ask-draft-arrow', text: '↳' },
					null,
				),
				el(
					'span',
					{ class: 'orbit__social__ask-draft-text', text: s.askDraft },
					null,
				),
			]),
		]);

		// 4. Cascade + actions
		const cascadeWrap = el('div', { class: 'orbit__cascade' }, []);
		const ctaABtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--primary', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.ctaA }, null)],
		);
		const ctaBBtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--ghost', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.ctaB }, null)],
		);
		const postCta = buildPostCycleCta(s.postCycleCta);
		const actions = el(
			'div',
			{ class: 'orbit__social__actions orbit__actions' },
			[ctaABtn, ctaBBtn, postCta],
		);

		body.appendChild(contentBlock);
		body.appendChild(platformsLabel);
		body.appendChild(platformsRow);
		body.appendChild(askLabel);
		body.appendChild(askBlock);
		body.appendChild(cascadeWrap);
		body.appendChild(actions);

		function runCycleCompletion() {
			runCascadeCycle({
				cascadeWrap,
				actionsWrap: actions,
				steps: s.cascade,
				summary: s.cascadeSummary,
			});
		}
		attachDualMorphButtons(ctaABtn, ctaBBtn, 700, runCycleCompletion);
	}

	// ── Creatives — Render Bay ──────────────────────────────────────────────
	// Concept: brand brief → 2×2 grid of real Studio renders (4 variants) →
	// visitor picks (or accepts agent's pick) → Approve → cascade fans the
	// variant to Shopify / Social / Brand pack → CTA.
	function renderCreativesRenderBay(s, body) {
		let selectedKey =
			(s.tiles.find(function (t: any) {
				return t.isAgentPick;
			}) || s.tiles[0]).id;

		// 1. Brief block
		const briefBlock = el('div', { class: 'orbit__creatives__brief orbit__card-section' }, [
			el('div', { class: 'orbit__creatives__brief-row' }, [
				el(
					'span',
					{ class: 'orbit__creatives__brief-label', text: s.briefLabel },
					null,
				),
				el(
					'span',
					{ class: 'orbit__creatives__brief-title', text: s.briefTitle },
					null,
				),
			]),
			el(
				'div',
				{ class: 'orbit__creatives__brief-meta', text: s.briefMeta },
				null,
			),
		]);

		// 2. Tiles label + 2×2 grid (real Studio images)
		const tilesLabel = el(
			'div',
			{ class: 'orbit__creatives__tiles-label', text: s.tilesLabel },
			null,
		);
		const tilesGrid = el(
			'div',
			{ class: 'orbit__creatives__tiles' },
			s.tiles.map(function (t: any) {
				const isSelected = t.id === selectedKey;
				const img = el(
					'img',
					{
						class: 'orbit__creatives__tile-img',
						src: t.imageSrc,
						alt: t.imageAlt,
						loading: 'lazy',
					},
					null,
				);
				const idBadge = el(
					'span',
					{ class: 'orbit__creatives__tile-id', text: t.id },
					null,
				);
				const sceneTag = el(
					'span',
					{ class: 'orbit__creatives__tile-scene', text: t.scene },
					null,
				);
				const qaTag = el(
					'span',
					{ class: 'orbit__creatives__tile-qa', text: 'QA ' + t.qaScore },
					null,
				);
				const meta = el('div', { class: 'orbit__creatives__tile-meta' }, [
					sceneTag,
					qaTag,
				]);
				const pickStar = t.isAgentPick
					? el(
							'span',
							{ class: 'orbit__creatives__tile-pick', text: '✦' },
							null,
						)
					: null;
				return el(
					'button',
					{
						class:
							'orbit__creatives__tile' +
							(isSelected ? ' orbit__creatives__tile--selected' : ''),
						type: 'button',
						'data-tile-id': t.id,
						'aria-label': 'Select variant ' + t.id,
					},
					[img, idBadge, pickStar, meta],
				);
			}),
		);

		// 3. Cascade + actions
		const cascadeWrap = el('div', { class: 'orbit__cascade' }, []);
		const ctaABtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--primary', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.ctaA }, null)],
		);
		const ctaBBtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--ghost', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.ctaB }, null)],
		);
		const postCta = buildPostCycleCta(s.postCycleCta);
		const actions = el(
			'div',
			{ class: 'orbit__creatives__actions orbit__actions' },
			[ctaABtn, ctaBBtn, postCta],
		);

		body.appendChild(briefBlock);
		body.appendChild(tilesLabel);
		body.appendChild(tilesGrid);
		body.appendChild(cascadeWrap);
		body.appendChild(actions);

		function setSelectedKey(key: string) {
			selectedKey = key;
			tilesGrid.querySelectorAll('[data-tile-id]').forEach(function (b) {
				const btn = b as HTMLButtonElement;
				if (btn.dataset.tileId === key) {
					btn.classList.add('orbit__creatives__tile--selected');
				} else {
					btn.classList.remove('orbit__creatives__tile--selected');
				}
			});
		}
		let cycleCompleted = false;
		tilesGrid.querySelectorAll('[data-tile-id]').forEach(function (b) {
			const btn = b as HTMLButtonElement;
			btn.addEventListener('click', function () {
				if (cycleCompleted) return;
				setSelectedKey(btn.dataset.tileId || selectedKey);
			});
		});

		function runCycleCompletion() {
			if (cycleCompleted) return;
			cycleCompleted = true;
			runCascadeCycle({
				cascadeWrap,
				actionsWrap: actions,
				steps: s.cascade,
				summary: s.cascadeSummary,
				beforeCascade: function () {
					tilesGrid.querySelectorAll('[data-tile-id]').forEach(function (b) {
						(b as HTMLButtonElement).setAttribute('disabled', '');
					});
				},
			});
		}
		attachDualMorphButtons(ctaABtn, ctaBBtn, 700, runCycleCompletion);
	}

	// ── Operations — Ticket Resolution ──────────────────────────────────────
	// Concept: customer chip + case summary + agent's suggested resolution →
	// Approve/Override → cascade fans to Razorpay / Email / WA → CTA.
	function renderOpsFloor(s, body) {
		// 1. Customer block
		const customerLabel = el(
			'div',
			{ class: 'orbit__ops__label', text: s.customerLabel },
			null,
		);
		const customerRow = el('div', { class: 'orbit__ops__customer orbit__card-section' }, [
			el(
				'span',
				{ class: 'orbit__ops__avatar', text: s.customer.initials },
				null,
			),
			el('div', { class: 'orbit__ops__customer-body' }, [
				el('div', { class: 'orbit__ops__customer-name-row' }, [
					el(
						'span',
						{ class: 'orbit__ops__customer-name', text: s.customer.name },
						null,
					),
					s.customer.loyal
						? el(
								'span',
								{ class: 'orbit__ops__loyal-tag', text: 'LOYAL' },
								null,
							)
						: null,
				]),
				el('div', { class: 'orbit__ops__customer-meta' }, [
					el('span', { text: s.customer.ltv }, null),
					el('span', { class: 'orbit__ops__meta-sep', text: '·' }, null),
					el('span', { text: s.customer.orders + ' orders' }, null),
				]),
			]),
		]);

		// 2. Case block
		const caseLabel = el(
			'div',
			{ class: 'orbit__ops__label', text: s.caseLabel },
			null,
		);
		const caseRow = el('div', { class: 'orbit__ops__case' }, [
			el(
				'span',
				{ class: 'orbit__ops__case-summary', text: s.case.summary },
				null,
			),
			el(
				'span',
				{ class: 'orbit__ops__case-meta', text: s.case.meta },
				null,
			),
		]);

		// 3. Suggestion block (teal-bordered)
		const suggestionBlock = el('div', { class: 'orbit__ops__suggestion' }, [
			el(
				'div',
				{ class: 'orbit__ops__suggestion-label', text: s.suggestionLabel },
				null,
			),
			el(
				'div',
				{ class: 'orbit__ops__suggestion-text', text: s.suggestion.text },
				null,
			),
		]);

		// 4. Cascade + actions
		const cascadeWrap = el('div', { class: 'orbit__cascade' }, []);
		const ctaABtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--primary', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.ctaA }, null)],
		);
		const ctaBBtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--ghost', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.ctaB }, null)],
		);
		const postCta = buildPostCycleCta(s.postCycleCta);
		const actions = el(
			'div',
			{ class: 'orbit__ops__actions orbit__actions' },
			[ctaABtn, ctaBBtn, postCta],
		);

		body.appendChild(customerLabel);
		body.appendChild(customerRow);
		body.appendChild(caseLabel);
		body.appendChild(caseRow);
		body.appendChild(suggestionBlock);
		body.appendChild(cascadeWrap);
		body.appendChild(actions);

		function runCycleCompletion() {
			runCascadeCycle({
				cascadeWrap,
				actionsWrap: actions,
				steps: s.cascade,
				summary: s.cascadeSummary,
			});
		}
		attachDualMorphButtons(ctaABtn, ctaBBtn, 700, runCycleCompletion);
	}


	// ── CEO — Orchestrator's Daily Filter ─────────────────────────────────
	// Concept: 5 agent chips (cross-team status) → 3-line synthesis →
	// 1 decision the human owns → click → cascade fans the decision back
	// to the agents who need to act → post-cycle CTA.
	function renderCeoFilter(s, body) {
		// 1. Cross-agent chips row — proves orchestration at a glance
		const chipsEyebrow = el(
			'div',
			{ class: 'orbit__ceo__chips-eyebrow', text: s.chipsEyebrow },
			null,
		);
		const chipsRow = el(
			'div',
			{ class: 'orbit__ceo__chips' },
			s.chips.map(function (c: any) {
				return el(
					'span',
					{
						class:
							'orbit__ceo__chip orbit__ceo__chip--' + (c.tone || 'work'),
					},
					[
						el('span', { class: 'orbit__ceo__chip-dot' }, null),
						el('span', { class: 'orbit__ceo__chip-label', text: c.label }, null),
						el('span', { class: 'orbit__ceo__chip-ping', text: c.ping }, null),
					],
				);
			}),
		);

		// 2. Synthesis block — 3 short signal lines → 1 conclusion
		const synthLines = el(
			'div',
			{ class: 'orbit__ceo__synth-lines' },
			s.synthesis.lines.map(function (line: string) {
				return el('div', { class: 'orbit__ceo__synth-line' }, [
					el('span', { class: 'orbit__ceo__synth-tick' }, null),
					el('span', { class: 'orbit__ceo__synth-text', text: line }, null),
				]);
			}),
		);
		const synthConclusion = el('div', { class: 'orbit__ceo__synth-conclusion' }, [
			el('span', { class: 'orbit__ceo__synth-arrow', text: '→' }, null),
			el(
				'span',
				{ class: 'orbit__ceo__synth-conclusion-text', text: s.synthesis.conclusion },
				null,
			),
		]);
		const synthBlock = el('div', { class: 'orbit__ceo__synth' }, [
			synthLines,
			synthConclusion,
		]);

		// 3. Decision block — eyebrow + title + meta
		const decisionBlock = el('div', { class: 'orbit__ceo__decision' }, [
			el(
				'div',
				{ class: 'orbit__ceo__decision-eyebrow', text: s.decisionEyebrow },
				null,
			),
			el('div', { class: 'orbit__ceo__decision-title-row' }, [
				el(
					'span',
					{ class: 'orbit__ceo__decision-title', text: s.decisionTitle },
					null,
				),
				el(
					'span',
					{ class: 'orbit__ceo__decision-meta', text: s.decisionMeta },
					null,
				),
			]),
		]);

		// 4. Cascade container — empty until decision fires
		const cascadeWrap = el('div', { class: 'orbit__cascade' }, []);

		// 5. Action bar — ctaA (primary) + ctaB (ghost) + post-cycle CTA
		const ctaABtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--primary orbit__ceo__cta-a', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.ctaA }, null)],
		);
		const ctaBBtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--ghost orbit__ceo__cta-b', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.ctaB }, null)],
		);
		const postCta = buildPostCycleCta(s.postCycleCta);
		const actions = el('div', { class: 'orbit__ceo__actions orbit__actions' }, [
			ctaABtn,
			ctaBBtn,
			postCta,
		]);

		body.appendChild(chipsEyebrow);
		body.appendChild(chipsRow);
		body.appendChild(synthBlock);
		body.appendChild(decisionBlock);
		body.appendChild(cascadeWrap);
		body.appendChild(actions);

		// Cycle completion (shared between ctaA and ctaB). The unclicked button
		// is disabled mid-cycle by attachDualMorphButtons.
		function runCycleCompletion() {
			runCascadeCycle({
				cascadeWrap,
				actionsWrap: actions,
				steps: s.cascade,
				summary: s.cascadeSummary,
			});
		}
		attachDualMorphButtons(ctaABtn, ctaBBtn, 700, runCycleCompletion);
	}

	// ── Research — Tomorrow's Brief Picker ─────────────────────────────────
	// Concept: today's brief is already shipped → visitor commissions
	// tomorrow's angle from 3 options (or hits Surprise me) → click Queue →
	// agent confirms with a 2-step cascade → summary lands → post-cycle CTA
	// swaps in. Pattern modeled on Sales' Confirm → cycle → CTA flow.
	function renderResearchBrief(s, body) {
		// 1. Today's brief block — agent's already-shipped deliverable at top
		const todayHead = el('div', { class: 'orbit__research__today-head' }, [
			el(
				'span',
				{ class: 'orbit__research__today-label', text: s.today.timestamp },
				null,
			),
			el('span', { class: 'orbit__research__today-shipped' }, [
				svgIconCheck(9),
				el(
					'span',
					{ class: 'orbit__research__today-shipped-text', text: s.today.shippedLabel },
					null,
				),
			]),
		]);
		const todayInsight = el('div', { class: 'orbit__research__today-insight' }, [
			el(
				'span',
				{ class: 'orbit__research__today-insight-text', text: s.today.insight },
				null,
			),
			el(
				'span',
				{
					class: 'orbit__research__today-insight-source',
					text: s.today.insightSource,
				},
				null,
			),
		]);
		const todayBlock = el('div', { class: 'orbit__research__today' }, [
			todayHead,
			todayInsight,
		]);

		// 2. Picker — 3 angle options, radio-style. First isDefault is selected.
		const pickerLabel = el(
			'div',
			{ class: 'orbit__research__picker-label', text: s.pickerLabel },
			null,
		);
		let selectedKey =
			(s.angles.find(function (a: any) {
				return a.isDefault;
			}) || s.angles[0]).key;

		const pickerList = el(
			'div',
			{ class: 'orbit__research__picker' },
			s.angles.map(function (angle: any) {
				const isSelected = angle.key === selectedKey;
				const dot = el('span', { class: 'orbit__research__angle-dot' }, null);
				const title = el(
					'span',
					{ class: 'orbit__research__angle-title', text: angle.title },
					null,
				);
				const meta = el(
					'span',
					{ class: 'orbit__research__angle-meta', text: angle.meta },
					null,
				);
				return el(
					'button',
					{
						class:
							'orbit__research__angle' +
							(isSelected ? ' orbit__research__angle--selected' : ''),
						type: 'button',
						'data-angle-key': angle.key,
					},
					[dot, title, meta],
				);
			}),
		);

		// 3. Action bar — Queue (primary) + Surprise me (ghost) + post-cycle CTA
		const queueBtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--primary orbit__research__queue-btn', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.queueLabel }, null)],
		);
		const surpriseBtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--ghost orbit__research__surprise-btn', type: 'button' },
			[el('span', { class: 'orbit__btn-label', text: s.surpriseLabel }, null)],
		);
		const postCta = buildPostCycleCta(s.postCycleCta);
		const actions = el(
			'div',
			{ class: 'orbit__research__actions orbit__actions' },
			[queueBtn, surpriseBtn, postCta],
		);

		// Surprise-me sub-label — hidden until agent picks
		const surpriseSub = el(
			'div',
			{ class: 'orbit__research__surprise-sub', hidden: '' },
			[
				el('span', { class: 'orbit__research__surprise-sub-icon', text: '✦' }, null),
				el(
					'span',
					{ class: 'orbit__research__surprise-sub-text', text: s.surpriseSubLabel },
					null,
				),
			],
		);

		// Container that will hold the post-queue cascade (steps + summary)
		const cascadeWrap = el('div', { class: 'orbit__research__cascade' }, []);

		body.appendChild(todayBlock);
		body.appendChild(pickerLabel);
		body.appendChild(pickerList);
		body.appendChild(surpriseSub);
		body.appendChild(cascadeWrap);
		body.appendChild(actions);

		// ── Picker selection ──
		function setSelectedKey(key: string) {
			selectedKey = key;
			pickerList.querySelectorAll('[data-angle-key]').forEach(function (b) {
				const btn = b as HTMLButtonElement;
				if (btn.dataset.angleKey === key) {
					btn.classList.add('orbit__research__angle--selected');
				} else {
					btn.classList.remove('orbit__research__angle--selected');
				}
			});
		}
		pickerList.querySelectorAll('[data-angle-key]').forEach(function (b) {
			const btn = b as HTMLButtonElement;
			btn.addEventListener('click', function () {
				if (cycleCompleted) return;
				setSelectedKey(btn.dataset.angleKey || selectedKey);
			});
		});

		// ── Cycle completion sequence (shared between Queue and Surprise→Queue) ──
		const STEP_LEAD = 220;
		const STEP_STAGGER = 380;
		const SUMMARY_LAG = 200;
		const CTA_LAG = 900;
		const stepsDuration = STEP_LEAD + s.postQueue.steps.length * STEP_STAGGER;
		const summaryAt = stepsDuration + SUMMARY_LAG;
		const ctaAt = summaryAt + CTA_LAG;
		let cycleCompleted = false;
		function runCycleCompletion() {
			if (cycleCompleted) return;
			cycleCompleted = true;
			// Disable picker so user can't re-select mid-cascade
			pickerList.querySelectorAll('[data-angle-key]').forEach(function (b) {
				(b as HTMLButtonElement).setAttribute('disabled', '');
			});

			// Reduced-motion path — append steps + summary synchronously in
			// their final state, then swap to the post-cycle CTA. No timers fire.
			if (reducedMotion) {
				s.postQueue.steps.forEach(function (step: any, i: number) {
					if (!cascadeWrap.isConnected) return;
					const stepEl = buildQueueStep(step, i === s.postQueue.steps.length - 1);
					stepEl.classList.add(
						'orbit__research__cq-step--enter',
						'orbit__research__cq-step--enter-visible',
					);
					cascadeWrap.appendChild(stepEl);
				});
				if (cascadeWrap.isConnected) {
					setConfirmedLabel(queueBtn, s.queuedLabel);
					queueBtn.classList.add('orbit__btn--confirmed');
					const summary = el(
						'div',
						{ class: 'orbit__research__cq-summary', text: s.postQueue.summary },
						null,
					);
					summary.classList.add(
						'orbit__research__cq-summary--enter',
						'orbit__research__cq-summary--enter-visible',
					);
					cascadeWrap.appendChild(summary);
				}
				if (actions.isConnected) swapToPostCycleCta(actions);
				return;
			}

			// Cascade in the 2 post-queue steps
			s.postQueue.steps.forEach(function (step: any, i: number) {
				trackTimeout(
					window.setTimeout(function () {
						if (!cascadeWrap.isConnected) return;
						const stepEl = buildQueueStep(step, i === s.postQueue.steps.length - 1);
						stepEl.classList.add('orbit__research__cq-step--enter');
						cascadeWrap.appendChild(stepEl);
						void (stepEl as HTMLElement).offsetWidth;
						stepEl.classList.add('orbit__research__cq-step--enter-visible');
					}, STEP_LEAD + i * STEP_STAGGER),
				);
			});

			// Summary lands after steps + flip Queue button to "Queued"
			trackTimeout(
				window.setTimeout(function () {
					if (!cascadeWrap.isConnected) return;
					setConfirmedLabel(queueBtn, s.queuedLabel);
					queueBtn.classList.add('orbit__btn--confirmed');
					const summary = el(
						'div',
						{ class: 'orbit__research__cq-summary', text: s.postQueue.summary },
						null,
					);
					summary.classList.add('orbit__research__cq-summary--enter');
					cascadeWrap.appendChild(summary);
					void (summary as HTMLElement).offsetWidth;
					summary.classList.add('orbit__research__cq-summary--enter-visible');
				}, summaryAt),
			);

			// Action bar morphs into post-cycle CTA
			trackTimeout(
				window.setTimeout(function () {
					if (!actions.isConnected) return;
					swapToPostCycleCta(actions);
				}, ctaAt),
			);
		}

		function buildQueueStep(step: any, _isLast: boolean) {
			const bubble = el('span', { class: 'orbit__research__cq-bubble' }, [
				svgToolIcon(step.iconKey, 11),
			]);
			const titleRow = el('div', { class: 'orbit__research__cq-title-row' }, [
				el('span', { class: 'orbit__research__cq-title', text: step.title }, null),
				el('span', { class: 'orbit__research__cq-check' }, [svgIconCheck(9)]),
			]);
			const bodyChildren: any[] = [titleRow];
			if (step.detail) {
				bodyChildren.push(
					el('div', { class: 'orbit__research__cq-detail', text: step.detail }, null),
				);
			}
			return el('div', { class: 'orbit__research__cq-step' }, [
				bubble,
				el('div', { class: 'orbit__research__cq-body' }, bodyChildren),
			]);
		}

		// ── Queue button: morph → cycle completion ──
		attachMorphButton(queueBtn, 700, runCycleCompletion);

		// ── Surprise me: slot-machine through angles → land on isAgentPick → fire queue ──
		surpriseBtn.addEventListener('click', function () {
			if (cycleCompleted) return;
			if (surpriseBtn.classList.contains('orbit__btn--processing')) return;
			surpriseBtn.classList.add('orbit__btn--processing');
			surpriseBtn.appendChild(svgSpinner());

			// Slot-machine: cycle through angles every ~110ms for ~440ms (4 ticks),
			// landing on the agent's pick.
			const order = s.angles.map(function (a: any) {
				return a.key;
			});
			const targetKey =
				(s.angles.find(function (a: any) {
					return a.isAgentPick;
				}) || s.angles[1]).key;
			const ticks = 5;
			for (let i = 0; i < ticks; i++) {
				const isLast = i === ticks - 1;
				trackTimeout(
					window.setTimeout(
						function () {
							if (!pickerList.isConnected) return;
							setSelectedKey(isLast ? targetKey : order[i % order.length]);
							if (isLast) {
								// Reveal the agent's-pick reasoning
								surpriseSub.removeAttribute('hidden');
								void (surpriseSub as HTMLElement).offsetWidth;
								surpriseSub.classList.add('orbit__research__surprise-sub--visible');
								// Brief teal flash on the selected angle
								const selectedEl = pickerList.querySelector(
									'.orbit__research__angle--selected',
								) as HTMLElement | null;
								if (selectedEl) {
									selectedEl.classList.add('orbit__research__angle--flash');
									trackTimeout(
										window.setTimeout(function () {
											if (selectedEl.isConnected) {
												selectedEl.classList.remove('orbit__research__angle--flash');
											}
										}, 700),
									);
								}
								// Clean up spinner, then auto-fire queue after ~700ms
								const sp = surpriseBtn.querySelector('.orbit__btn-spinner');
								if (sp && sp.parentNode) sp.parentNode.removeChild(sp);
								surpriseBtn.classList.remove('orbit__btn--processing');
								trackTimeout(window.setTimeout(runCycleCompletion, 800));
							}
						},
						110 * (i + 1),
					),
				);
			}
		});
	}

	// ── Dispatch ────────────────────────────────────────────────────────────

	const RENDERERS = {
		'sales-warroom': renderSalesWarRoom,
		'social-triage': renderSocialTriage,
		'creatives-renderbay': renderCreativesRenderBay,
		'ops-floor': renderOpsFloor,
		'ceo-filter': renderCeoFilter,
		'research-brief': renderResearchBrief,
	};

	function populateCard(agent) {
		// Clear in-flight timers BEFORE destroying the body — a late callback
		// would otherwise mutate a detached subtree.
		clearPending();
		while (bodyEl.firstChild) bodyEl.removeChild(bodyEl.firstChild);
		titleEl.textContent = agent.title;
		roleEl.textContent = agent.role;
		const cs = agent.cardState;
		badgeEl.textContent = cs.badge;
		badgeEl.setAttribute('data-mode', cs.mode);
		const fn = RENDERERS[cs.mode];
		if (fn) fn(cs, bodyEl, agent);
	}

	function setActive(idx) {
		const agent = agents[idx];
		if (agent.id === activeId) return;
		activeId = agent.id;
		populateCard(agent);
		nodes.forEach(function (n, i) {
			n.classList.toggle('orbit__node--active', i === idx);
		});
	}

	function easeInOutCubic(t) {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	function startTransition(toIdx, useShortestPath) {
		const target = targetRotationForIndex(toIdx);
		let delta = target - rotation;
		if (useShortestPath) {
			if (delta > 180) delta -= 360;
			if (delta < -180) delta += 360;
		} else {
			if (delta > 0) delta -= 360;
		}
		rotationFrom = rotation;
		rotationTo = rotation + delta;
		targetIdx = toIdx;
		state = 'transitioning';
		stateStart = performance.now();
		contentSwapped = false;
		detail.classList.add('orbit__detail--swapping');
		window.dispatchEvent(
			new CustomEvent('orbit:transition-start', {
				detail: { idx: toIdx, title: agents[toIdx].title },
			}),
		);
	}

	function loop(ts) {
		if (state === 'transitioning') {
			const elapsed = ts - stateStart;
			const progress = Math.min(1, elapsed / TRANSITION_MS);
			rotation = rotationFrom + (rotationTo - rotationFrom) * easeInOutCubic(progress);
			if (!contentSwapped && elapsed >= CONTENT_SWAP_MS) {
				contentSwapped = true;
				currentIdx = targetIdx;
				setActive(currentIdx);
				detail.classList.remove('orbit__detail--swapping');
			}
			if (progress >= 1) {
				rotation = rotationTo;
				state = 'dwelling';
				stateStart = ts;
			}
		} else {
			const elapsed = ts - stateStart;
			if (elapsed >= DWELL_MS) {
				const nextIdx = (currentIdx + 1) % NODE_COUNT;
				startTransition(nextIdx, false);
			}
		}
		rotation = ((rotation % 360) + 360) % 360;
		applyRotation(rotation);
		rafHandle = requestAnimationFrame(loop);
	}

	nodes.forEach(function (node, i) {
		node.addEventListener('click', function () {
			if (i === currentIdx && state === 'dwelling') return;
			startTransition(i, true);
		});
	});

	activeId = agents[0].id;
	nodes[0].classList.add('orbit__node--active');
	currentIdx = 0;
	state = 'dwelling';
	stateStart = performance.now();
	populateCard(agents[0]);

	let pausedAt = 0;
	function onVisibilityChange() {
		if (document.hidden) {
			cancelAnimationFrame(rafHandle);
			pausedAt = performance.now();
		} else if (pausedAt) {
			stateStart += performance.now() - pausedAt;
			pausedAt = 0;
			rafHandle = requestAnimationFrame(loop);
		}
	}

	// Hover-pause — pointer over the detail card pauses orbit rotation.
	let hoverPaused = false;
	let hoverPauseStart = 0;
	detail.addEventListener('mouseenter', function () {
		if (reducedMotion) return;
		if (hoverPaused) return;
		hoverPaused = true;
		hoverPauseStart = performance.now();
		cancelAnimationFrame(rafHandle);
	});
	detail.addEventListener('mouseleave', function () {
		if (!hoverPaused) return;
		hoverPaused = false;
		stateStart += performance.now() - hoverPauseStart;
		rafHandle = requestAnimationFrame(loop);
	});

	cleanupCurrent = function () {
		if (rafHandle) cancelAnimationFrame(rafHandle);
		if (intervalHandle != null) window.clearInterval(intervalHandle);
		clearPending();
		document.removeEventListener('visibilitychange', onVisibilityChange);
	};

	if (reducedMotion) {
		let i = 0;
		intervalHandle = window.setInterval(function () {
			i = (i + 1) % NODE_COUNT;
			setActive(i);
			window.dispatchEvent(
				new CustomEvent('orbit:transition-start', {
					detail: { idx: i, title: agents[i].title },
				}),
			);
		}, REDUCED_CYCLE_MS);
		return;
	}

	rafHandle = requestAnimationFrame(loop);
	document.addEventListener('visibilitychange', onVisibilityChange);
});
