// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Agent orbit behavior — snap-and-dwell carousel.
//
// Model:
//   • Each node snaps exactly to the center of the checkpoint circle, dwells
//     there for ~3s (card visible), then the orbit transitions to the next.
//   • Clicking any node animates the orbit to that node via the shortest path
//     (resets the dwell on arrival).
//   • Reduced-motion users get a static orbit and a setInterval card cycle.

import { agents } from '../data/home';
import { connectorIcon } from '../components/home/orbit-icons';

const DWELL_MS = 3000;
const TRANSITION_MS = 1100;
const REDUCED_CYCLE_MS = 4000;
// Card content swaps mid-transition (fast cross-fade) so the card is never
// blank for more than ~200ms. The orbit ring keeps moving during this.
const CONTENT_SWAP_MS = 200;

// Per-page-load cleanup registry. We attach this to a closure that lives for
// the lifetime of one page; `astro:before-swap` calls it before SPA nav so the
// next page's orbit doesn't stack on top of the previous one's rAF/intervals.
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
	let approveTimer: number | null = null;
	let contentSwapped = true;
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function applyRotation(deg) {
		orbit.style.setProperty('--orbit-rotation', deg + 'deg');
	}

	function targetRotationForIndex(i) {
		let t = (-i * ARC_PER_NODE) % 360;
		if (t < 0) t += 360;
		return t;
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

	// ── Primitives ─────────────────────────────────────────────────

	function pip(variant) {
		return el('span', { class: 'orbit__pip orbit__pip--' + variant }, []);
	}

	function svgIconCheck(size) {
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

	function svgClock(size) {
		const s = document.createElementNS(NS, 'svg');
		s.setAttribute('viewBox', '0 0 16 16');
		s.setAttribute('width', String(size || 11));
		s.setAttribute('height', String(size || 11));
		s.setAttribute('fill', 'none');
		s.setAttribute('stroke', 'currentColor');
		s.setAttribute('stroke-width', '1.5');
		s.setAttribute('stroke-linecap', 'round');
		const c = document.createElementNS(NS, 'circle');
		c.setAttribute('cx', '8');
		c.setAttribute('cy', '8');
		c.setAttribute('r', '6');
		const p = document.createElementNS(NS, 'path');
		p.setAttribute('d', 'M8 5v3.5L10 10');
		s.appendChild(c);
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

	function trendArrow(dir) {
		const s = document.createElementNS(NS, 'svg');
		s.setAttribute('viewBox', '0 0 12 12');
		s.setAttribute('width', '10');
		s.setAttribute('height', '10');
		s.setAttribute('class', 'orbit__tile-arrow orbit__tile-arrow--' + dir);
		s.setAttribute('fill', 'none');
		s.setAttribute('stroke', 'currentColor');
		s.setAttribute('stroke-width', '1.8');
		s.setAttribute('stroke-linecap', 'round');
		s.setAttribute('stroke-linejoin', 'round');
		const p = document.createElementNS(NS, 'path');
		if (dir === 'up') p.setAttribute('d', 'M3 8l3.5-3.5L10 8M6.5 4.5V11');
		else if (dir === 'down') p.setAttribute('d', 'M3 4l3.5 3.5L10 4M6.5 7.5V1');
		else p.setAttribute('d', 'M2.5 6h7');
		s.appendChild(p);
		return s;
	}

	function sparkline(points) {
		const W = 48;
		const H = 14;
		const max = Math.max.apply(null, points);
		const min = Math.min.apply(null, points);
		const range = max - min || 1;
		const n = points.length;
		const coords = points
			.map(function (p, i) {
				const x = (i / (n - 1)) * W;
				const y = H - 1 - ((p - min) / range) * (H - 2);
				return x.toFixed(1) + ',' + y.toFixed(1);
			})
			.join(' ');
		const s = document.createElementNS(NS, 'svg');
		s.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
		s.setAttribute('width', String(W));
		s.setAttribute('height', String(H));
		s.setAttribute('class', 'orbit__spark');
		s.setAttribute('fill', 'none');
		s.setAttribute('stroke', 'currentColor');
		s.setAttribute('stroke-width', '1.4');
		s.setAttribute('stroke-linecap', 'round');
		s.setAttribute('stroke-linejoin', 'round');
		const pl = document.createElementNS(NS, 'polyline');
		pl.setAttribute('points', coords);
		s.appendChild(pl);
		return s;
	}

	// Rich sparkline: area-filled gradient under the line + endpoint dot.
	// Used by the Sales hero block — communicates momentum at a glance.
	let richSparkSeq = 0;
	function richSparkline(points) {
		const W = 200;
		const H = 36;
		const max = Math.max.apply(null, points);
		const min = Math.min.apply(null, points);
		const range = max - min || 1;
		const n = points.length;
		const xs: number[] = [];
		const ys: number[] = [];
		for (let i = 0; i < n; i++) {
			xs.push((i / (n - 1)) * W);
			ys.push(H - 3 - ((points[i] - min) / range) * (H - 8));
		}
		// Catmull-Rom → cubic bezier for a natural smooth trend line.
		const tension = 0.22;
		function smoothPath(closeToBaseline: boolean) {
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
				d += ' L ' + xs[n - 1].toFixed(2) + ' ' + H + ' L ' + xs[0].toFixed(2) + ' ' + H + ' Z';
			}
			return d;
		}
		const lineD = smoothPath(false);
		const area = smoothPath(true);

		const gradId = 'orbit-spark-grad-' + ++richSparkSeq;
		const s = document.createElementNS(NS, 'svg');
		s.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
		s.setAttribute('width', String(W));
		s.setAttribute('height', String(H));
		s.setAttribute('preserveAspectRatio', 'none');
		s.setAttribute('class', 'orbit__rich-spark');

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
		stop1.setAttribute('stop-opacity', '0.4');
		const stop2 = document.createElementNS(NS, 'stop');
		stop2.setAttribute('offset', '100%');
		stop2.setAttribute('stop-color', 'currentColor');
		stop2.setAttribute('stop-opacity', '0');
		grad.appendChild(stop1);
		grad.appendChild(stop2);
		defs.appendChild(grad);
		s.appendChild(defs);

		const ap = document.createElementNS(NS, 'path');
		ap.setAttribute('d', area);
		ap.setAttribute('fill', 'url(#' + gradId + ')');
		ap.setAttribute('stroke', 'none');
		s.appendChild(ap);

		const pl = document.createElementNS(NS, 'path');
		pl.setAttribute('d', lineD);
		pl.setAttribute('fill', 'none');
		pl.setAttribute('stroke', 'currentColor');
		pl.setAttribute('stroke-width', '1.6');
		pl.setAttribute('stroke-linecap', 'round');
		pl.setAttribute('stroke-linejoin', 'round');
		pl.setAttribute('vector-effect', 'non-scaling-stroke');
		s.appendChild(pl);

		// Endpoint dot — drawn as a small circle in viewBox space. Because
		// preserveAspectRatio is "none" the circle would distort, so we use
		// a <g> with a counter-scale via vector-effect on a stroked dot.
		const dot = document.createElementNS(NS, 'circle');
		dot.setAttribute('cx', xs[n - 1].toFixed(1));
		dot.setAttribute('cy', ys[n - 1].toFixed(1));
		dot.setAttribute('r', '3');
		dot.setAttribute('fill', 'currentColor');
		dot.setAttribute('stroke', 'rgba(0,0,0,0.55)');
		dot.setAttribute('stroke-width', '1');
		dot.setAttribute('vector-effect', 'non-scaling-stroke');
		s.appendChild(dot);

		return s;
	}

	function ringElement(current, total) {
		const SIZE = 64;
		const R = 26;
		const C = 2 * Math.PI * R;
		const pct = Math.min(1, current / total);
		const dash = (pct * C).toFixed(1) + ' ' + C.toFixed(1);
		const svg = document.createElementNS(NS, 'svg');
		svg.setAttribute('viewBox', '0 0 ' + SIZE + ' ' + SIZE);
		svg.setAttribute('width', String(SIZE));
		svg.setAttribute('height', String(SIZE));
		svg.setAttribute('class', 'orbit__ring');
		const track = document.createElementNS(NS, 'circle');
		track.setAttribute('cx', String(SIZE / 2));
		track.setAttribute('cy', String(SIZE / 2));
		track.setAttribute('r', String(R));
		track.setAttribute('fill', 'none');
		track.setAttribute('stroke', 'rgba(255,255,255,0.08)');
		track.setAttribute('stroke-width', '3');
		svg.appendChild(track);
		const bar = document.createElementNS(NS, 'circle');
		bar.setAttribute('cx', String(SIZE / 2));
		bar.setAttribute('cy', String(SIZE / 2));
		bar.setAttribute('r', String(R));
		bar.setAttribute('fill', 'none');
		bar.setAttribute('stroke', 'currentColor');
		bar.setAttribute('stroke-width', '3');
		bar.setAttribute('stroke-linecap', 'round');
		bar.setAttribute('stroke-dasharray', dash);
		bar.setAttribute('transform', 'rotate(-90 ' + SIZE / 2 + ' ' + SIZE / 2 + ')');
		bar.setAttribute('class', 'orbit__ring-bar');
		svg.appendChild(bar);
		return svg;
	}

	function avatarEl(letters) {
		return el('span', { class: 'orbit__avatar', text: letters }, null);
	}

	function networkDiagram(peers, selfLabel) {
		// 3-node mini network: left peer in, self center, right peer out.
		const W = 220;
		const H = 60;
		const svg = document.createElementNS(NS, 'svg');
		svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
		svg.setAttribute('class', 'orbit__net');
		svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

		const nodes = [
			{ x: 28, y: H / 2, label: peers[0] ? peers[0].label : 'M', self: false },
			{ x: W / 2, y: H / 2, label: selfLabel || 'S', self: true },
			{ x: W - 28, y: H / 2, label: peers[1] ? peers[1].label : 'F', self: false },
		];

		// Edges (dashed) from outer nodes to centre.
		nodes.forEach(function (n, i) {
			if (i === 1) return;
			const path = document.createElementNS(NS, 'path');
			path.setAttribute('class', 'orbit__net-edge');
			const x1 = n.x;
			const x2 = nodes[1].x;
			path.setAttribute('d', 'M' + x1 + ' ' + n.y + ' L' + x2 + ' ' + nodes[1].y);
			svg.appendChild(path);
		});

		// Animated message dots — one travels in, one travels out. Skipped for
		// reduced-motion users: SMIL <animate> isn't gated by CSS @media rules.
		if (!reducedMotion) {
			function pulse(fromX, toX, delaySec) {
				const c = document.createElementNS(NS, 'circle');
				c.setAttribute('r', '2.2');
				c.setAttribute('cx', String(fromX));
				c.setAttribute('cy', String(H / 2));
				c.setAttribute('class', 'orbit__net-pulse');
				const anim = document.createElementNS(NS, 'animate');
				anim.setAttribute('attributeName', 'cx');
				anim.setAttribute('from', String(fromX));
				anim.setAttribute('to', String(toX));
				anim.setAttribute('dur', '2s');
				anim.setAttribute('begin', delaySec + 's');
				anim.setAttribute('repeatCount', 'indefinite');
				c.appendChild(anim);
				return c;
			}
			svg.appendChild(pulse(nodes[0].x, nodes[1].x, 0));
			svg.appendChild(pulse(nodes[1].x, nodes[2].x, 1));
		}

		// Node circles + letters on top.
		nodes.forEach(function (n) {
			const c = document.createElementNS(NS, 'circle');
			c.setAttribute('cx', String(n.x));
			c.setAttribute('cy', String(n.y));
			c.setAttribute('r', '14');
			c.setAttribute('class', 'orbit__net-node' + (n.self ? ' orbit__net-node--self' : ''));
			svg.appendChild(c);
			const t = document.createElementNS(NS, 'text');
			t.setAttribute('x', String(n.x));
			t.setAttribute('y', String(n.y + 0.5));
			t.setAttribute('class', 'orbit__net-letter');
			t.textContent = n.label;
			svg.appendChild(t);
		});

		return svg;
	}

	function iconWrap(klass, key, size) {
		const span = el('span', { class: klass }, []);
		span.appendChild(connectorIcon(key, size));
		return span;
	}

	// ── Renderers ──────────────────────────────────────────────────

	function renderToolCalls(s) {
		const pct = Math.round((s.progress.current / s.progress.total) * 100);
		const stepRows = s.steps.map(function (step) {
			const row = el('div', { class: 'orbit__step orbit__step--' + step.status }, [
				pip(step.status),
				iconWrap('orbit__step-icon', step.iconKey, 12),
				el('span', { class: 'orbit__step-tool', text: step.tool }, null),
				el('span', { class: 'orbit__step-arg', text: step.label.replace(/^[^·]+·\s*/, '') }, null),
			]);
			return row;
		});
		return [
			el('div', { class: 'orbit__big-stat' }, [
				el(
					'span',
					{ class: 'orbit__big-stat-value', text: s.progress.current + '/' + s.progress.total },
					null,
				),
				el('span', { class: 'orbit__big-stat-unit', text: s.progress.unit }, null),
			]),
			el('div', { class: 'orbit__steps' }, stepRows),
			el('div', { class: 'orbit__bar' }, [
				el('div', { class: 'orbit__bar-fill', style: '--progress:' + pct + '%' }, []),
			]),
		];
	}

	function renderApproval(s) {
		const labelSpan = el('span', { class: 'orbit__btn-label' }, ['Approve']);
		const spinner = svgSpinner();
		spinner.setAttribute('class', 'orbit__btn-spinner');
		const approveBtn = el(
			'button',
			{ class: 'orbit__btn orbit__btn--primary', type: 'button', 'data-approve': '' },
			[labelSpan, spinner],
		);
		approveBtn.addEventListener('click', function () {
			if (approveBtn.classList.contains('orbit__btn--processing')) return;
			if (approveBtn.classList.contains('orbit__btn--confirmed')) return;
			approveBtn.classList.add('orbit__btn--processing');
			approveTimer = window.setTimeout(function () {
				approveTimer = null;
				if (!approveBtn.isConnected) return;
				approveBtn.classList.remove('orbit__btn--processing');
				approveBtn.classList.add('orbit__btn--confirmed');
				while (labelSpan.firstChild) labelSpan.removeChild(labelSpan.firstChild);
				labelSpan.appendChild(svgIconCheck(11));
				labelSpan.appendChild(document.createTextNode(' Confirmed'));
			}, 800);
		});

		const denyBtn = el('button', { class: 'orbit__btn orbit__btn--ghost', type: 'button' }, [
			el('span', { class: 'orbit__btn-label', text: 'Deny' }, null),
		]);

		const ageRow = el('div', { class: 'orbit__age' }, [svgClock(11)]);
		ageRow.appendChild(document.createTextNode(s.ageMin + ' min · awaiting you'));

		return [
			el('div', { class: 'orbit__amount-row' }, [
				el('span', { class: 'orbit__amount', text: s.amount }, null),
				pip(s.risk),
				el('span', { class: 'orbit__amount-meta', text: s.invoice }, null),
			]),
			el('div', { class: 'orbit__client-row' }, [
				avatarEl(s.avatar),
				el('div', { class: 'orbit__client-id' }, [
					el('span', { class: 'orbit__client-name', text: s.client }, null),
					el('span', { class: 'orbit__client-meta', text: s.context }, null),
				]),
			]),
			ageRow,
			el('div', { class: 'orbit__cta-row' }, [approveBtn, denyBtn]),
		];
	}

	function renderThread(s, agent) {
		const decisionClass = 'orbit__decision orbit__decision--' + s.decision.outcome;
		const selfLabel = agent && agent.title ? agent.title.charAt(0).toUpperCase() : 'S';
		const messages = (s.messages || []).map(function (m) {
			return el('div', { class: 'orbit__msg-line orbit__msg-line--' + m.dir }, [
				el('span', { class: 'orbit__msg-arrow', text: m.dir === 'out' ? '→' : '←' }, null),
				el('span', { class: 'orbit__msg-agent', text: m.agent }, null),
				el('span', { class: 'orbit__msg-text', text: m.text }, null),
			]);
		});
		return [
			el('div', { class: 'orbit__net-wrap' }, [networkDiagram(s.peers, selfLabel)]),
			el('div', { class: 'orbit__msg-list' }, messages),
			el('div', { class: decisionClass }, [
				pip(s.decision.outcome),
				el('span', { class: 'orbit__decision-text', text: s.decision.text }, null),
			]),
			el('div', { class: 'orbit__footer', text: s.footer }, null),
		];
	}

	function renderConnectors(s) {
		const channels = s.channels.map(function (ch) {
			const tile = el(
				'div',
				{
					class:
						'orbit__channel orbit__channel--' +
						ch.status +
						(ch.live ? ' orbit__channel--live' : ''),
				},
				[pip(ch.status)],
			);
			tile.appendChild(connectorIcon(ch.iconKey, 20));
			tile.appendChild(el('span', { class: 'orbit__channel-cap', text: ch.caption }, null));
			return tile;
		});
		return [
			el('div', { class: 'orbit__channels' }, channels),
			el('div', { class: 'orbit__recent' }, [
				iconWrap('orbit__recent-icon', s.recent.iconKey, 12),
				el('span', { class: 'orbit__recent-title', text: s.recent.title }, null),
			]),
		];
	}

	function renderBatch(s) {
		const ring = ringElement(s.ring.current, s.ring.total);
		const ringWrap = el('div', { class: 'orbit__ring-wrap' }, [ring]);
		ringWrap.appendChild(
			el('div', { class: 'orbit__ring-center' }, [
				el('span', { class: 'orbit__ring-num', text: s.ring.current + '/' + s.ring.total }, null),
				el('span', { class: 'orbit__ring-tot', text: s.ring.unit || 'done' }, null),
			]),
		);

		const chips = s.channels.map(function (ch) {
			return el('div', { class: 'orbit__chip' }, [
				iconWrap('orbit__chip-icon', ch.iconKey, 14),
				el('div', { class: 'orbit__chip-text' }, [
					el('span', { class: 'orbit__chip-name', text: ch.label }, null),
					el('span', { class: 'orbit__chip-action', text: ch.action }, null),
				]),
			]);
		});

		return [
			el('div', { class: 'orbit__batch-hero' }, [
				ringWrap,
				el('div', { class: 'orbit__chips' }, chips),
			]),
			el('span', { class: 'orbit__cap', text: 'throughput  ' + s.footer }, null),
		];
	}

	function renderMetrics(s) {
		const tiles = s.tiles.map(function (t) {
			const valueRow = el('div', { class: 'orbit__tile-value-row' }, [
				el('span', { class: 'orbit__tile-value', text: t.value }, null),
				t.trend ? trendArrow(t.trend) : null,
				t.sub ? el('span', { class: 'orbit__tile-sub', text: t.sub }, null) : null,
			]);
			if (t.featured) {
				const sparkBlock = t.points
					? el('div', { class: 'orbit__tile-meta' }, [sparkline(t.points)])
					: null;
				return el(
					'div',
					{ class: 'orbit__tile orbit__tile--featured' },
					[
						el('div', { class: 'orbit__tile-label-block' }, [
							el('span', { class: 'orbit__tile-label', text: t.label }, null),
							valueRow,
						]),
						sparkBlock,
					].filter(Boolean),
				);
			}
			const children = [el('span', { class: 'orbit__tile-label', text: t.label }, null), valueRow];
			if (t.points) children.push(sparkline(t.points));
			return el('div', { class: 'orbit__tile' }, children);
		});

		const out = [el('div', { class: 'orbit__tiles' }, tiles)];
		if (s.footer) out.push(el('span', { class: 'orbit__cap', text: s.footer }, null));
		return out;
	}

	function renderPipeline(s) {
		const tools = s.tools.map(function (t) {
			let cls = 'orbit__sales-tool';
			if (t.pending) cls += ' orbit__sales-tool--pending';
			else cls += ' orbit__sales-tool--' + t.status;
			return el('div', { class: cls }, [
				iconWrap('orbit__sales-tool-icon', t.iconKey, 14),
				el('span', { class: 'orbit__sales-tool-count', text: String(t.value) }, null),
				el('span', { class: 'orbit__sales-tool-label', text: t.label }, null),
			]);
		});

		// Stage progress: filled dots for completed stages, pulsing dot for
		// the current stage, outlines for upcoming.
		const stageBar = [];
		for (let i = 1; i <= s.deal.totalStages; i++) {
			let cls = 'orbit__stage-dot';
			if (i < s.deal.stageNum) cls += ' orbit__stage-dot--done';
			else if (i === s.deal.stageNum) cls += ' orbit__stage-dot--active';
			stageBar.push(el('span', { class: cls }, []));
			if (i < s.deal.totalStages) {
				stageBar.push(
					el(
						'span',
						{
							class: 'orbit__stage-line' + (i < s.deal.stageNum ? ' orbit__stage-line--done' : ''),
						},
						[],
					),
				);
			}
		}

		const headlineMeta = [
			el('span', { class: 'orbit__sales-headline-label', text: s.headline.label }, null),
		];
		if (s.headline.sub) {
			headlineMeta.push(
				el('span', { class: 'orbit__sales-headline-sub', text: s.headline.sub }, null),
			);
		}
		if (s.headline.trend) {
			headlineMeta.push(
				el('span', { class: 'orbit__sales-headline-trend', text: s.headline.trend }, null),
			);
		}

		const headlineBlock = el('div', { class: 'orbit__sales-headline-block' }, [
			el('div', { class: 'orbit__sales-headline' }, [
				el('span', { class: 'orbit__sales-headline-value', text: s.headline.value }, null),
				el('div', { class: 'orbit__sales-headline-meta' }, headlineMeta),
			]),
		]);
		if (s.headline.points && s.headline.points.length) {
			const sparkWrap = el('div', { class: 'orbit__sales-spark' }, [
				richSparkline(s.headline.points),
			]);
			headlineBlock.appendChild(sparkWrap);
		}

		const dealChildren = [
			el('div', { class: 'orbit__deal-row' }, [
				el('span', { class: 'orbit__deal-name', text: s.deal.name }, null),
				el('span', { class: 'orbit__deal-value', text: s.deal.value }, null),
			]),
			el('div', { class: 'orbit__deal-stage' }, [
				el('span', { class: 'orbit__deal-stage-label', text: s.deal.stage }, null),
				el(
					'span',
					{
						class: 'orbit__deal-stage-counter',
						text: 'stage ' + s.deal.stageNum + '/' + s.deal.totalStages,
					},
					null,
				),
			]),
			el('div', { class: 'orbit__stage-bar' }, stageBar),
		];
		if (s.deal.subtext) {
			dealChildren.push(el('div', { class: 'orbit__deal-subtext', text: s.deal.subtext }, null));
		}

		return [
			headlineBlock,
			el('div', { class: 'orbit__deal' }, dealChildren),
			el('div', { class: 'orbit__sales-tools' }, tools),
			el('span', { class: 'orbit__cap orbit__sales-footer', text: s.footer }, null),
		];
	}

	const RENDERERS = {
		'tool-calls': renderToolCalls,
		approval: renderApproval,
		thread: renderThread,
		connectors: renderConnectors,
		batch: renderBatch,
		metrics: renderMetrics,
		pipeline: renderPipeline,
	};

	function populateCard(agent) {
		titleEl.textContent = agent.title;
		roleEl.textContent = agent.role;
		const cs = agent.cardState;
		badgeEl.textContent = cs.badge;
		badgeEl.setAttribute('data-mode', cs.mode);
		while (bodyEl.firstChild) bodyEl.removeChild(bodyEl.firstChild);
		const fn = RENDERERS[cs.mode];
		if (fn) {
			fn(cs, agent).forEach(function (node) {
				bodyEl.appendChild(node);
			});
		}
	}

	function setActive(idx) {
		const agent = agents[idx];
		if (agent.id === activeId) return;
		activeId = agent.id;
		// Cancel any in-flight Approve continuation timer before we tear down
		// the body — its callback would otherwise mutate a detached node.
		if (approveTimer != null) {
			window.clearTimeout(approveTimer);
			approveTimer = null;
		}
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
		// Quick fade-out only — content will swap mid-transition (loop), not at end.
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
			// Swap card content once we're past the fade-out — orbit keeps rotating
			// underneath, but the card is never blank for more than CONTENT_SWAP_MS.
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
	// Render the initial agent's body now (markup ships head-only).
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

	cleanupCurrent = function () {
		if (rafHandle) cancelAnimationFrame(rafHandle);
		if (intervalHandle != null) window.clearInterval(intervalHandle);
		if (approveTimer != null) window.clearTimeout(approveTimer);
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
