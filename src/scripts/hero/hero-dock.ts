import {
	type HeroState,
	type CardState,
	isMobile,
	DESKTOP_EASE,
	applyState,
	exitState,
	hideDeck,
	getTitleShift,
	setTitleState,
	clearScheduledTimers,
	cancelAndClearRafs,
	schedule,
	hardCutToDeck,
	runCycle,
} from './hero-engine';

/**
 * Wires up dock thumbnail click handlers.
 * Returns a cleanup function that removes all listeners.
 */
export function initDock(s: HeroState): () => void {
	const listeners: (() => void)[] = [];

	s.thumbs.forEach((thumb, i) => {
		const onThumbClick = () => {
			if (isMobile()) {
				hardCutToDeck(s, i);
				return;
			}

			if (s.dockTransitionInProgress) {
				hardCutToDeck(s, i);
				return;
			}

			if (!s.activeCards.length || s.activeDeckIndex < 0) {
				hardCutToDeck(s, i);
				return;
			}

			clearScheduledTimers(s);
			clearTimeout(s.cycleTimer);
			cancelAndClearRafs(s);
			s.dockTransitionInProgress = true;
			const token = ++s.dockTransitionToken;
			const transition = `transform 200ms ${DESKTOP_EASE}, opacity 180ms ${DESKTOP_EASE}`;

			s.activeCards.forEach((card, index) => {
				applyState(
					s,
					card,
					exitState(s, index, s.activeCards.length) as CardState,
					true,
					transition,
				);
			});
			setTitleState(s, { shift: getTitleShift(), opacity: 1 }, true);

			schedule(
				s,
				() => {
					if (token !== s.dockTransitionToken) return;
					hideDeck(s.decks[s.activeDeckIndex]);
					s.activeCards = [];
					s.activeDesktopPhase = 'idle';
					s.activeDeckIndex = -1;
					s.dockTransitionInProgress = false;
					s.activeIndex = i;
					s.forceImmediate = true;
					runCycle(s);
				},
				220,
			);
		};

		thumb.addEventListener('click', onThumbClick);
		listeners.push(() => thumb.removeEventListener('click', onThumbClick));
	});

	return () => {
		listeners.forEach((remove) => remove());
		listeners.length = 0;
	};
}
