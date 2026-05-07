import Lenis from 'lenis';

let lenis: Lenis | null = null;
let rafId: number | null = null;

function scrollToHash(hash: string, instant = false) {
	if (!hash || hash === '#') return;
	const id = decodeURIComponent(hash.slice(1));
	const el = document.getElementById(id);
	if (!el) return;
	const headerH =
		(document.querySelector('.prod-signal-nav') as HTMLElement | null)?.offsetHeight ?? 0;
	const isMobile = window.matchMedia('(max-width: 720px)').matches;
	const offset = isMobile ? -(headerH + 40) : -Math.max(0, headerH - 75);
	if (lenis) {
		lenis.scrollTo(el, { offset, immediate: instant });
	} else {
		const top = el.getBoundingClientRect().top + window.scrollY + offset;
		window.scrollTo({ top, behavior: instant ? 'auto' : 'smooth' });
	}
}

function initLenis() {
	// Destroy previous instance on re-init (View Transitions)
	if (lenis) {
		lenis.destroy();
		lenis = null;
	}
	if (rafId !== null) {
		cancelAnimationFrame(rafId);
		rafId = null;
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	lenis = new Lenis({
		duration: 1.2,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo.out
		smoothWheel: true,
	});

	function raf(time: number) {
		lenis?.raf(time);
		rafId = requestAnimationFrame(raf);
	}
	rafId = requestAnimationFrame(raf);

	// Honor any hash already in the URL on page load (e.g., /studio#motion direct hit
	// or after an Astro View Transition where the browser's native hash-scroll runs
	// before Lenis is up).
	if (location.hash) {
		requestAnimationFrame(() => scrollToHash(location.hash));
	}
}

export function stopLenis() {
	lenis?.stop();
}

export function startLenis() {
	lenis?.start();
}

const g = globalThis as Record<string, unknown>;
if (!g.__lenisRegistered) {
	g.__lenisRegistered = true;
	document.addEventListener('astro:page-load', initLenis);
	document.addEventListener('astro:before-swap', () => {
		if (lenis) {
			lenis.destroy();
			lenis = null;
		}
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	});

	// Intercept same-page hash-link clicks so Lenis scrolls smoothly to the target
	// (otherwise Lenis suppresses the browser's default hash-jump and you stay put).
	// Deferred to a macrotask so any nav-close handler on the same click can run
	// first — the Navbar stops Lenis on open and restarts it inside closeMenu(),
	// and our scroll has to fire AFTER that restart or the command is dropped.
	document.addEventListener(
		'click',
		(e) => {
			const target = e.target as HTMLElement | null;
			if (!target) return;
			const link = target.closest('a[href]') as HTMLAnchorElement | null;
			if (!link) return;
			const href = link.getAttribute('href') || '';
			if (!href.includes('#')) return;
			const url = new URL(href, location.href);
			if (url.origin !== location.origin || url.pathname !== location.pathname) return;
			if (!url.hash || url.hash === '#') return;
			const id = decodeURIComponent(url.hash.slice(1));
			const el = document.getElementById(id);
			if (!el) return;
			e.preventDefault();
			history.pushState(null, '', url.hash);
			setTimeout(() => scrollToHash(url.hash), 0);
		},
		{ capture: true },
	);
}
