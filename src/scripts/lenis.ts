import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
let lenis: Lenis | null = null;

function initLenis() {
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
document.addEventListener('astro:page-load', () => {
	// If we needed to re-init specific page logic, we'd do it here.
	// Since Lenis is global and we want it to persist smoothly,
	// we might just need to refresh ScrollTrigger.
	ScrollTrigger.refresh();
});
