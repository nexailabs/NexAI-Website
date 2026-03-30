import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
let lenis: Lenis | null = null;

function initLenis() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	lenis = new Lenis({
		duration: 1.2,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo.out
		smoothWheel: true,
	});

	// Synchronize Lenis with GSAP ScrollTrigger
	lenis.on('scroll', ScrollTrigger.update);

	gsap.ticker.add((time) => {
		lenis?.raf(time * 1000);
	});

	gsap.ticker.lagSmoothing(0);
}

// Ensure it runs on initial load
initLenis();

// Handle View Transitions (Astro)
document.addEventListener('astro:page-load', async () => {
	// Wait for all images to decode before recalculating scroll positions.
	// This prevents ScrollTrigger from measuring the page height before
	// images have loaded, which causes broken trigger positions.
	await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
	ScrollTrigger.refresh();
});
