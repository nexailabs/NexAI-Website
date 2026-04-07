export {};

import {
	createHeroState,
	runCycle,
	applyState,
	holdState,
	hideDeck,
	getCards,
	getInitialTitleShift,
	setTitleState,
	cancelAndClearRafs,
	clearScheduledTimers,
	restartCycle,
} from './hero/hero-engine';
import { createResizeHandler } from './hero/hero-resize';
import { initDock } from './hero/hero-dock';

let cleanup: (() => void) | null = null;

function init() {
	const stage = document.querySelector<HTMLElement>('[data-hero-stack-stage]');
	if (!stage) return;
	const titleLeft = document.querySelector<HTMLElement>('[data-hero-title="left"]');
	const titleRight = document.querySelector<HTMLElement>('[data-hero-title="right"]');

	cleanup?.();
	cleanup = null;

	const decks = Array.from(stage.querySelectorAll<HTMLElement>('[data-hero-deck]'));
	if (!decks.length) return;

	const thumbs = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-thumb]'));

	const s = createHeroState(stage, decks, thumbs, titleLeft, titleRight);

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	decks.forEach((deck) => hideDeck(deck));
	setTitleState(s, { shift: getInitialTitleShift(), opacity: 1 }, false);

	if (prefersReducedMotion) {
		const activeDeck = decks[0];
		activeDeck.style.opacity = '1';
		activeDeck.style.visibility = 'visible';
		getCards(activeDeck).forEach((card, index, cards) =>
			applyState(s, card, holdState(s, index, cards.length), false),
		);
		setTitleState(s, { shift: 0, opacity: 1 }, false);
		cleanup = () => {
			cancelAndClearRafs(s);
			clearScheduledTimers(s);
		};
		return;
	}

	runCycle(s);

	// Resize
	const handleResize = createResizeHandler(s);
	window.addEventListener('resize', handleResize);

	// Visibility / pause-resume
	let paused = false;
	const pauseHero = () => {
		if (paused) return;
		if (s.cycleTimer) {
			clearTimeout(s.cycleTimer);
			s.cycleTimer = 0;
		}
		s.cycleEpoch++;
		paused = true;
	};
	const resumeHero = () => {
		if (!paused) return;
		paused = false;
		restartCycle(s, getInitialTitleShift());
	};

	const onVisibilityChange = () => {
		if (document.hidden) pauseHero();
		else resumeHero();
	};
	document.addEventListener('visibilitychange', onVisibilityChange);

	// IntersectionObserver — pause when hero is off-screen
	const heroSection = stage.closest('.shoots-hero') ?? stage;
	let offScreen = false;
	const heroIO = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) {
				offScreen = true;
				pauseHero();
			} else if (offScreen) {
				offScreen = false;
				if (!document.hidden) resumeHero();
			}
		},
		{ threshold: 0 },
	);
	heroIO.observe(heroSection);

	// Dock
	const cleanupDock = initDock(s);

	cleanup = () => {
		cleanupDock();
		cancelAndClearRafs(s);
		clearScheduledTimers(s);
		clearTimeout(s.cycleTimer);
		heroIO.disconnect();
		window.removeEventListener('resize', handleResize);
		document.removeEventListener('visibilitychange', onVisibilityChange);
		// Cancel any pending resize RAF from the handler
		(handleResize as { cancelRaf?: () => void }).cancelRaf?.();
	};
}

document.addEventListener('astro:before-swap', () => {
	cleanup?.();
});

document.addEventListener('astro:after-swap', () => {
	cleanup?.();
	init();
});

// Initial run (after-swap doesn't fire on first load)
init();
