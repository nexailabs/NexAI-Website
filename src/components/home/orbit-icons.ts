// Inline SVG factory for orbit card icons.
//
// Returns an SVGElement keyed by connector / tool name. All shapes use
// fill="currentColor" so their tone follows the parent (pip, tile, chip).
// Marks are simplified single-path traces — used as small recognition
// icons in a portfolio demo (nominative fair use). Each remains the
// property of its respective owner; if a customer flags a specific mark,
// swap it for `monoIcon(letter)` from the same registry.

const NS = 'http://www.w3.org/2000/svg';

type IconDef = {
	paths: string[];
	mode?: 'fill' | 'stroke';
	viewBox?: string;
};

const ICONS: Record<string, IconDef> = {
	linkedin: {
		mode: 'fill',
		paths: [
			'M3 3h18v18H3zM5.7 9v8.3h2.6V9zm1.3-3.6a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 9v8.3h2.5v-4.2c0-1.1.2-2.2 1.6-2.2 1.4 0 1.4 1.3 1.4 2.3v4.1h2.5V12.6c0-2.2-.5-3.9-3-3.9-1.2 0-2.1.7-2.4 1.3V9z',
		],
	},
	x: {
		mode: 'fill',
		paths: ['M16.4 3h2.8l-6 7 7.1 11h-5.5l-4.3-6.3-5 6.3H2.6l6.5-8L2 3h5.6l3.9 5.8z'],
	},
	instagram: {
		mode: 'stroke',
		paths: [
			'M8 3h8a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5z',
			'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z',
			'M17.2 6.6a.4.4 0 100 .8.4.4 0 000-.8z',
		],
	},
	midjourney: {
		mode: 'stroke',
		paths: [
			'M3 19c4 0 6-2 7-4',
			'M21 19c-4 0-6-2-7-4',
			'M5 14c2 0 4-1 5-3',
			'M19 14c-2 0-4-1-5-3',
			'M9 9c1-2 2-4 3-6 1 2 2 4 3 6',
		],
	},
	buffer: {
		mode: 'stroke',
		paths: ['M3 7l9-4 9 4-9 4z', 'M3 12l9 4 9-4', 'M3 17l9 4 9-4'],
	},
	mailchimp: {
		mode: 'stroke',
		paths: [
			'M5 18c-1-2 0-5 2-6 1-3 4-5 7-4 3 0 5 2 5 5 1 1 1 3 0 4-1 1-3 1-4 0',
			'M9 13a1 1 0 100 2 1 1 0 000-2z',
			'M14 11a1 1 0 100 2 1 1 0 000-2z',
		],
	},
	slack: {
		mode: 'fill',
		paths: [
			'M5 14a2 2 0 11-2-2h2zm1 0a2 2 0 014 0v5a2 2 0 11-4 0z',
			'M10 5a2 2 0 11-2 2V5zm0 1a2 2 0 010 4H5a2 2 0 110-4z',
			'M19 10a2 2 0 112 2h-2zm-1 0a2 2 0 01-4 0V5a2 2 0 114 0z',
			'M14 19a2 2 0 112-2v2zm0-1a2 2 0 010-4h5a2 2 0 110 4z',
		],
	},
	hubspot: {
		mode: 'stroke',
		paths: [
			'M12 9V5',
			'M12 5a2 2 0 100-4 2 2 0 000 4z',
			'M12 9a6 6 0 100 12 6 6 0 000-12z',
			'M12 15a0.1 0.1 0 110-0.2 0.1 0.1 0 010 0.2z',
		],
	},
	calendly: {
		mode: 'stroke',
		paths: ['M5 6h14v14H5z', 'M5 10h14', 'M9 4v4', 'M15 4v4', 'M9 14h2', 'M13 14h2', 'M9 17h2'],
	},
	apollo: {
		mode: 'stroke',
		paths: [
			'M12 2c3 4 4 7 4 11l3 4v3h-3l-2-2h-4l-2 2H5v-3l3-4c0-4 1-7 4-11z',
			'M10 12a2 2 0 014 0',
		],
	},
	clearbit: {
		mode: 'fill',
		paths: ['M5 5h14v14H5zm10.5 3h-3l-3.5 8h3z'],
	},
	gmail: {
		mode: 'stroke',
		paths: ['M3 6h18v12H3z', 'M3 6l9 7 9-7'],
	},
	github: {
		mode: 'fill',
		paths: [
			'M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 015 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0012 2z',
		],
	},
	notion: {
		mode: 'stroke',
		paths: ['M5 4h2.5L16 15V4h3v16h-2.5L8 9v11H5z'],
	},
	brain: {
		mode: 'stroke',
		paths: [
			'M9 4a3 3 0 00-3 3v.5a2.5 2.5 0 000 5V14a3 3 0 003 3h0a2 2 0 002-2V6a2 2 0 00-2-2z',
			'M15 4a3 3 0 013 3v.5a2.5 2.5 0 010 5V14a3 3 0 01-3 3h0a2 2 0 01-2-2V6a2 2 0 012-2z',
			'M9 9h2',
			'M15 9h-2',
			'M9 13h2',
			'M15 13h-2',
		],
	},
	figma: {
		mode: 'fill',
		paths: [
			'M9 3h3v6H9a3 3 0 010-6z',
			'M12 3h3a3 3 0 010 6h-3z',
			'M9 9h3v6H9a3 3 0 010-6z',
			'M15 9a3 3 0 110 6 3 3 0 010-6z',
			'M9 15h3v3a3 3 0 11-3-3z',
		],
	},
	canva: {
		mode: 'fill',
		paths: ['M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a5 5 0 014.9 4H14a3 3 0 100 2h2.9A5 5 0 1112 7z'],
	},
	runway: {
		mode: 'fill',
		paths: ['M5 5h14v14H5zm5 4v6l5-3z'],
	},
	phone: {
		mode: 'stroke',
		paths: ['M5 4h3l2 5-2 1a8 8 0 005 5l1-2 5 2v3a2 2 0 01-2 2 17 17 0 01-15-15 2 2 0 012-2z'],
	},
	whatsapp: {
		mode: 'stroke',
		paths: [
			'M21 12a9 9 0 11-3.5-7.1l-1.5 5.6 5.6-1.5A9 9 0 0121 12z',
			'M9 9c0 .5.3 1 .6 1.4l1.5 1.5c.4.4.9.6 1.4.6h2',
		],
	},
	clock: {
		mode: 'stroke',
		paths: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M12 7v5l3.5 2'],
	},
	bell: {
		mode: 'stroke',
		paths: ['M6 17V11a6 6 0 0112 0v6', 'M4 17h16', 'M10 20a2 2 0 004 0'],
	},
};

export function connectorIcon(key: string, size = 16): SVGElement {
	const def = ICONS[key];
	if (!def) return monoIcon(key.charAt(0).toUpperCase(), size);
	const svg = document.createElementNS(NS, 'svg');
	svg.setAttribute('viewBox', def.viewBox || '0 0 24 24');
	svg.setAttribute('width', String(size));
	svg.setAttribute('height', String(size));
	if (def.mode === 'stroke') {
		svg.setAttribute('fill', 'none');
		svg.setAttribute('stroke', 'currentColor');
		svg.setAttribute('stroke-width', '1.6');
		svg.setAttribute('stroke-linecap', 'round');
		svg.setAttribute('stroke-linejoin', 'round');
	} else {
		svg.setAttribute('fill', 'currentColor');
	}
	def.paths.forEach((d) => {
		const p = document.createElementNS(NS, 'path');
		p.setAttribute('d', d);
		svg.appendChild(p);
	});
	return svg;
}

export function monoIcon(letter: string, size = 16): SVGElement {
	const svg = document.createElementNS(NS, 'svg');
	svg.setAttribute('viewBox', '0 0 24 24');
	svg.setAttribute('width', String(size));
	svg.setAttribute('height', String(size));
	svg.setAttribute('fill', 'currentColor');
	const t = document.createElementNS(NS, 'text');
	t.setAttribute('x', '12');
	t.setAttribute('y', '17');
	t.setAttribute('text-anchor', 'middle');
	t.setAttribute('font-family', 'Plus Jakarta Sans, Inter, sans-serif');
	t.setAttribute('font-size', '14');
	t.setAttribute('font-weight', '700');
	t.textContent = letter;
	svg.appendChild(t);
	return svg;
}
