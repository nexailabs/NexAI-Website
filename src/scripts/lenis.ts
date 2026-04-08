import Lenis from 'lenis';

let lenis: Lenis | null = null;
let rafId: number | null = null;

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
}
