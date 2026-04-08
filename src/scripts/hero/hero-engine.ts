export const MOBILE_BREAKPOINT = 720;
export const MOBILE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const DESKTOP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export interface CardState {
	x: number;
	y: number;
	scale: number;
	rotate?: number;
	opacity: number;
	zIndex: number;
}

export type TimelineStep = { delay: number; action: () => void };

export interface HeroState {
	// DOM refs
	stage: HTMLElement;
	decks: HTMLElement[];
	thumbs: HTMLElement[];
	titleLeft: HTMLElement | null;
	titleRight: HTMLElement | null;

	// Mutable cycle state
	activeIndex: number;
	cycleTimer: number;
	cycleEpoch: number;
	spreadScale: number;
	forceImmediate: boolean;
	activeCards: HTMLElement[];
	activeDesktopPhase: 'idle' | 'stack' | 'spread';
	activeDeckIndex: number;
	dockTransitionInProgress: boolean;
	dockTransitionToken: number;

	// Timer tracking
	timers: number[];
	rafIds: Set<number>;
}

export function createHeroState(
	stage: HTMLElement,
	decks: HTMLElement[],
	thumbs: HTMLElement[],
	titleLeft: HTMLElement | null,
	titleRight: HTMLElement | null,
): HeroState {
	return {
		stage,
		decks,
		thumbs,
		titleLeft,
		titleRight,
		activeIndex: 0,
		cycleTimer: 0,
		cycleEpoch: 0,
		spreadScale: 1,
		forceImmediate: false,
		activeCards: [],
		activeDesktopPhase: 'idle',
		activeDeckIndex: -1,
		dockTransitionInProgress: false,
		dockTransitionToken: 0,
		timers: [],
		rafIds: new Set(),
	};
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

export const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

export const getCards = (deck: HTMLElement) =>
	Array.from(deck.querySelectorAll<HTMLElement>('[data-hero-card]'));

export const schedule = (s: HeroState, fn: () => void, delay: number) => {
	const epochAtSchedule = s.cycleEpoch;
	const wrappedId = window.setTimeout(() => {
		if (epochAtSchedule !== s.cycleEpoch) return;
		fn();
	}, delay);
	s.timers.push(wrappedId);
	return wrappedId;
};

export const scheduleRaf = (s: HeroState, fn: () => void) => {
	const id = requestAnimationFrame(() => {
		s.rafIds.delete(id);
		fn();
	});
	s.rafIds.add(id);
	return id;
};

export const clearScheduledTimers = (s: HeroState) => {
	s.timers.forEach((timer) => clearTimeout(timer));
	s.timers.length = 0;
};

export const cancelAndClearRafs = (s: HeroState) => {
	s.rafIds.forEach((id) => cancelAnimationFrame(id));
	s.rafIds.clear();
};

export const runTimeline = (s: HeroState, steps: TimelineStep[]) => {
	steps.forEach((step) => schedule(s, step.action, step.delay));
};

// ---------------------------------------------------------------------------
// Viewport / layout helpers
// ---------------------------------------------------------------------------

export const getTitleShift = () => {
	if (window.innerWidth <= MOBILE_BREAKPOINT) return -48;
	const desktopShift = window.innerWidth * -0.078;
	return Math.max(-120, Math.min(-80, desktopShift));
};

export const getMobileTitleShift = (s: HeroState) => {
	if (!s.titleLeft || !s.titleRight) {
		return { togetherShift: 0, splitShift: 0 };
	}
	const viewportWidth = window.innerWidth;
	const leftRect = s.titleLeft.getBoundingClientRect();
	const rightRect = s.titleRight.getBoundingClientRect();
	const leftCenter = leftRect.left + leftRect.width / 2;
	const rightCenter = rightRect.left + rightRect.width / 2;
	const baseShift = Math.min(leftCenter, viewportWidth - rightCenter);
	const splitShift = baseShift + 20;
	return { togetherShift: 0, splitShift };
};

export const getInitialTitleShift = () => (isMobile() ? 0 : getTitleShift());

export const setTitleState = (
	s: HeroState,
	{ shift = 0, opacity = 1 }: { shift?: number; opacity?: number },
	animate = true,
) => {
	const transition = animate
		? isMobile()
			? `transform 0.7s ${MOBILE_EASE}, opacity 0.3s ${MOBILE_EASE}`
			: `transform 0.86s ${DESKTOP_EASE}, opacity 0.32s ${DESKTOP_EASE}`
		: 'none';

	if (s.titleLeft) {
		s.titleLeft.style.transition = transition;
		s.titleLeft.style.transform = `translate3d(${-shift}px, 0, 0)`;
		s.titleLeft.style.opacity = `${opacity}`;
	}
	if (s.titleRight) {
		s.titleRight.style.transition = transition;
		s.titleRight.style.transform = `translate3d(${shift}px, 0, 0)`;
		s.titleRight.style.opacity = `${opacity}`;
	}
};

export const getTravelOffset = (s: HeroState) => {
	const stageRect = s.stage.getBoundingClientRect();
	const sampleCard = s.stage.querySelector<HTMLElement>('[data-hero-card]');
	const cardRect = sampleCard ? sampleCard.getBoundingClientRect() : { height: stageRect.height };
	const cardHeight = cardRect.height || stageRect.height;
	const stageCenterY = stageRect.top + stageRect.height / 2;
	const offset = -(stageCenterY + cardHeight / 2 + 48);
	// Ensure cards always travel upward — when hero is scrolled off-screen,
	// stageCenterY goes very negative which flips offset positive (downward).
	const minTravel = -(stageRect.height / 2 + cardHeight / 2 + 48);
	return Math.min(offset, minTravel);
};

export const getStackZIndex = (index: number, total: number) => total - index;

export const getSpreadUnit = (s: HeroState, cards: HTMLElement[]) => {
	if (!cards.length) return 0;
	const width = cards[0].offsetWidth || 0;
	const total = cards.length;
	const container = document.querySelector<HTMLElement>('.shoots-hero__title-row');
	const contentWidth = container ? container.clientWidth : window.innerWidth;
	const sideInset = Math.max(60, Math.min(200, contentWidth * 0.08));
	const cardToTextGap = Math.max(10, Math.min(24, contentWidth * 0.01));
	const available = Math.max(0, contentWidth - 2 * (sideInset + cardToTextGap));
	const gap = Math.max(8, Math.min(16, contentWidth * 0.008));
	const idealUnit = width + gap;
	const totalSpread = (total - 1) * idealUnit + width;

	if (totalSpread <= available) {
		s.spreadScale = 1;
		return idealUnit;
	}

	const scaled = available / totalSpread;
	s.spreadScale = Math.max(0.82, Math.min(1, scaled));
	return idealUnit * s.spreadScale;
};

export const getSpreadTitleShift = (s: HeroState) => {
	if (!s.titleLeft || !s.titleRight) return 0;
	const container = document.querySelector<HTMLElement>('.shoots-hero__title-row');
	const contentWidth = container ? container.clientWidth : window.innerWidth;
	const contentLeft = container ? container.getBoundingClientRect().left : 0;
	const contentRight = contentLeft + contentWidth;
	const sideInset = Math.max(40, Math.min(140, contentWidth * 0.06));
	const leftRect = s.titleLeft.getBoundingClientRect();
	const rightRect = s.titleRight.getBoundingClientRect();
	const leftShift = leftRect.right - (contentLeft + sideInset);
	const rightShift = contentRight - sideInset - rightRect.left;
	return Math.max(0, Math.min(leftShift, rightShift));
};

// ---------------------------------------------------------------------------
// Card state factories
// ---------------------------------------------------------------------------

export const stackedState = (
	s: HeroState,
	index: number,
	total: number,
	yOffset = 0,
): CardState => {
	const behind = index;
	const stackGap = Math.max(3, window.innerHeight * 0.005);
	return {
		x: 0,
		y: yOffset + behind * stackGap,
		scale: 0.9 - behind * 0.012,
		opacity: 1,
		zIndex: getStackZIndex(index, total),
	};
};

export const spreadState = (
	s: HeroState,
	index: number,
	total: number,
	unit: number,
	baseOffset = 0,
): CardState => {
	const middle = (total - 1) / 2;
	const distance = index - middle;
	return {
		x: baseOffset + distance * unit,
		y: 0,
		scale: s.spreadScale,
		rotate: 0,
		opacity: 1,
		zIndex: getStackZIndex(index, total),
	};
};

export const holdState = (
	s: HeroState,
	index: number,
	total: number,
	baseOffset = 0,
): CardState => ({
	...stackedState(s, index, total, 0),
	x: baseOffset,
	rotate: 0,
});

export const entryState = (
	s: HeroState,
	index: number,
	total: number,
	baseOffset = 0,
): CardState => ({
	...stackedState(s, index, total, getTravelOffset(s)),
	x: baseOffset,
	rotate: 0,
});

export const exitState = (
	s: HeroState,
	index: number,
	total: number,
	baseOffset = 0,
): CardState => ({
	...stackedState(s, index, total, getTravelOffset(s)),
	x: baseOffset,
	rotate: 0,
});

// ---------------------------------------------------------------------------
// DOM mutation helpers
// ---------------------------------------------------------------------------

export const applyState = (
	s: HeroState,
	card: HTMLElement,
	state: CardState,
	animate = true,
	transitionOverride?: string,
) => {
	const ease = isMobile()
		? `transform 0.55s ${MOBILE_EASE}, opacity 0.25s ${MOBILE_EASE}`
		: `transform 0.86s ${DESKTOP_EASE}, opacity 0.32s ${DESKTOP_EASE}`;
	card.style.transition = animate ? (transitionOverride ?? ease) : 'none';
	const rotate = state.rotate ? `rotate(${state.rotate}deg)` : '';
	card.style.transform = `translate(-50%, -50%) translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale}) ${rotate}`;
	card.style.transformOrigin = '50% 50%';
	card.style.opacity = `${state.opacity}`;
	card.style.zIndex = `${state.zIndex}`;
};

export const hideDeck = (deck: HTMLElement) => {
	deck.style.transition = 'none';
	deck.style.opacity = '0';
	deck.style.visibility = 'hidden';
};

export const showDeck = (s: HeroState, deck: HTMLElement) => {
	const cards = getCards(deck);
	deck.style.opacity = '1';
	deck.style.visibility = 'visible';

	cards.forEach((card, index) => {
		const state = entryState(s, index, cards.length);
		card.style.zIndex = `${state.zIndex}`;
		card.style.opacity = '1';
		card.style.transition = 'none';
		card.style.transform = `translate(-50%, -50%) translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale})`;
	});

	scheduleRaf(s, () => {
		cards.forEach((card) => {
			void getComputedStyle(card).transform;
		});
		cards.forEach((card, index) => {
			applyState(s, card, holdState(s, index, cards.length), true);
		});
	});

	return cards;
};

export const showDeckForMobileDeal = (deck: HTMLElement, cards: HTMLElement[]) => {
	const entryOffset = Math.min(-40, -(window.innerHeight * 0.08));
	deck.style.opacity = '1';
	deck.style.visibility = 'visible';

	cards.forEach((card, index) => {
		card.style.transition = 'none';
		card.style.transform = `translate(-50%, -50%) translate3d(0px, ${entryOffset}px, 0) scale(0.92)`;
		card.style.opacity = '0';
		card.style.zIndex = `${50 + index}`;
	});
};

export const updateActiveDockThumb = (s: HeroState, index: number) => {
	s.thumbs.forEach((t, i) => {
		t.classList.toggle('shoots-hero__dock-thumb--active', i === index);
		t.setAttribute('aria-pressed', String(i === index));
	});
};

// ---------------------------------------------------------------------------
// Core cycle
// ---------------------------------------------------------------------------

export const runCycle = (s: HeroState) => {
	s.cycleEpoch += 1;
	cancelAndClearRafs(s);
	const isLoopRestart = s.activeIndex === 0 && !s.forceImmediate;
	s.forceImmediate = false;
	updateActiveDockThumb(s, s.activeIndex);

	s.decks.forEach((deck, deckIndex) => {
		if (deckIndex !== s.activeIndex) hideDeck(deck);
	});

	const deck = s.decks[s.activeIndex];
	s.activeDeckIndex = s.activeIndex;
	const titleShift = getTitleShift();
	const desktopCycleStart = isLoopRestart ? 900 : 0;
	const mobileCycleStart = isLoopRestart ? 200 : 0;
	let cards: HTMLElement[] = [];
	let spreadUnit = 0;

	const startDeckDesktop = () => {
		cards = showDeck(s, deck);
		s.activeCards = cards;
		s.activeDesktopPhase = 'stack';
		spreadUnit = getSpreadUnit(s, cards);
	};

	const startDeckMobile = () => {
		cards = getCards(deck);
		s.activeCards = cards;
		s.activeDesktopPhase = 'idle';
		showDeckForMobileDeal(deck, cards);
	};

	if (isMobile()) {
		const { togetherShift, splitShift } = getMobileTitleShift(s);
		const mobileCards = getCards(deck);
		const cardCount = Math.max(1, mobileCards.length);
		const viewportHeight = window.innerHeight;
		const dealStartOffset = Math.max(500, viewportHeight * 0.08);
		const dealInterval = 1000;
		const settleBuffer = 0;
		const cardEntryDuration = 550;
		const cardExitDuration = 420;
		const baseTime = mobileCycleStart + dealStartOffset + settleBuffer + cardExitDuration + 380;
		const perCardTime = Math.max(120, dealInterval);
		const mobileCycleDuration = baseTime + cardCount * perCardTime;

		setTitleState(s, { shift: togetherShift, opacity: 1 }, false);
		runTimeline(s, [{ delay: mobileCycleStart, action: startDeckMobile }]);

		const dealStart = mobileCycleStart + dealStartOffset;
		const mobileSteps: TimelineStep[] = [
			{
				delay: dealStart,
				action: () => {
					setTitleState(s, { shift: splitShift, opacity: 1 }, true);
				},
			},
		];

		mobileCards.forEach((card, index) => {
			mobileSteps.push({
				delay: dealStart + index * dealInterval,
				action: () => {
					card.style.transition = 'none';
					void getComputedStyle(card).transform;
					card.style.transition = `transform ${cardEntryDuration}ms ${MOBILE_EASE}, opacity 220ms ${MOBILE_EASE}`;
					card.style.transform = 'translate(-50%, -50%) translate3d(0px, 0px, 0) scale(1)';
					card.style.opacity = '1';
				},
			});
		});

		const exitStart = dealStart + cardCount * dealInterval + settleBuffer;
		mobileSteps.push(
			{
				delay: exitStart,
				action: () => {
					cards.forEach((card, index) => {
						applyState(
							s,
							card,
							exitState(s, index, cards.length),
							true,
							`transform ${cardExitDuration}ms ${MOBILE_EASE}, opacity 220ms ${MOBILE_EASE}`,
						);
					});
				},
			},
			{
				delay: exitStart + 40,
				action: () => {
					setTitleState(s, { shift: togetherShift, opacity: 1 }, true);
				},
			},
			{
				delay: exitStart + cardExitDuration + 120,
				action: () => {
					hideDeck(deck);
				},
			},
		);
		runTimeline(s, mobileSteps);

		s.activeIndex = (s.activeIndex + 1) % s.decks.length;
		s.cycleTimer = window.setTimeout(
			() => runCycle(s),
			Math.max(mobileCycleDuration, exitStart + 800),
		);
	} else {
		if (isLoopRestart) {
			schedule(s, startDeckDesktop, desktopCycleStart);
		} else {
			startDeckDesktop();
		}

		schedule(
			s,
			() => {
				setTitleState(s, { shift: 0, opacity: 1 }, true);
			},
			desktopCycleStart + 80,
		);

		schedule(
			s,
			() => {
				const spreadShift = getSpreadTitleShift(s);
				setTitleState(s, { shift: spreadShift, opacity: 1 }, true);
				s.activeDesktopPhase = 'spread';
			},
			desktopCycleStart + 1540,
		);

		schedule(
			s,
			() => {
				cards.forEach((card, index) => {
					applyState(s, card, spreadState(s, index, cards.length, spreadUnit), true);
				});
			},
			desktopCycleStart + 1540,
		);

		schedule(
			s,
			() => {
				setTitleState(s, { shift: 0, opacity: 1 }, true);
				s.activeDesktopPhase = 'stack';
			},
			desktopCycleStart + 4540,
		);

		schedule(
			s,
			() => {
				cards.forEach((card, index) => {
					applyState(s, card, holdState(s, index, cards.length), true);
				});
			},
			desktopCycleStart + 4540,
		);

		schedule(
			s,
			() => {
				cards.forEach((card, index) => {
					applyState(s, card, exitState(s, index, cards.length), true);
				});
			},
			desktopCycleStart + 5520,
		);

		schedule(
			s,
			() => {
				setTitleState(s, { shift: titleShift, opacity: 1 }, true);
			},
			desktopCycleStart + 5520,
		);

		schedule(
			s,
			() => {
				hideDeck(deck);
				s.activeCards = [];
				s.activeDesktopPhase = 'idle';
			},
			desktopCycleStart + 6360,
		);

		s.activeIndex = (s.activeIndex + 1) % s.decks.length;
		s.cycleTimer = window.setTimeout(() => runCycle(s), desktopCycleStart + 6680);
	}
};

// ---------------------------------------------------------------------------
// Cycle management helpers (used by resize and dock)
// ---------------------------------------------------------------------------

export const restartCycle = (s: HeroState, titleStateShift: number) => {
	s.dockTransitionInProgress = false;
	s.dockTransitionToken += 1;
	clearScheduledTimers(s);
	clearTimeout(s.cycleTimer);
	cancelAndClearRafs(s);
	s.decks.forEach((d) => hideDeck(d));
	s.activeCards = [];
	s.activeDesktopPhase = 'idle';
	s.activeDeckIndex = -1;
	setTitleState(s, { shift: titleStateShift, opacity: 1 }, false);
	s.forceImmediate = true;
	runCycle(s);
};

export const hardCutToDeck = (s: HeroState, index: number) => {
	s.activeIndex = index;
	restartCycle(s, getInitialTitleShift());
};

export const applyDesktopLayoutForResize = (s: HeroState) => {
	if (isMobile() || !s.activeCards.length) return;
	const spreadUnit = getSpreadUnit(s, s.activeCards);
	if (s.activeDesktopPhase === 'spread') {
		s.activeCards.forEach((card, index) => {
			applyState(s, card, spreadState(s, index, s.activeCards.length, spreadUnit), false);
		});
		const spreadShift = getSpreadTitleShift(s);
		setTitleState(s, { shift: spreadShift, opacity: 1 }, false);
		return;
	}
	s.activeCards.forEach((card, index) => {
		applyState(s, card, holdState(s, index, s.activeCards.length), false);
	});
	setTitleState(s, { shift: 0, opacity: 1 }, false);
};
