export {};

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
	const updateActiveDockThumb = (index: number) => {
		thumbs.forEach((t, i) => {
			t.classList.toggle('shoots-hero__dock-thumb--active', i === index);
		});
	};

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let activeIndex = 0;
	let cycleTimer: number;
	let cycleEpoch = 0;
	let spreadScale = 1;
	const centerOffset = 0; // CSS flex:1 on title words keeps stage centered; no JS offset needed
	let resizeRaf = 0;
	const MOBILE_BREAKPOINT = 720;
	const MOBILE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
	const DESKTOP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
	const timers: number[] = [];
	const rafIds = new Set<number>();
	const listeners: (() => void)[] = [];

	const getCards = (deck: HTMLElement) =>
		Array.from(deck.querySelectorAll<HTMLElement>('[data-hero-card]'));

	const schedule = (fn: () => void, delay: number) => {
		const epochAtSchedule = cycleEpoch;
		const wrappedId = window.setTimeout(() => {
			if (epochAtSchedule !== cycleEpoch) return;
			fn();
		}, delay);
		timers.push(wrappedId);
		return wrappedId;
	};

	const scheduleRaf = (fn: () => void) => {
		const id = requestAnimationFrame(() => {
			rafIds.delete(id);
			fn();
		});
		rafIds.add(id);
		return id;
	};

	const clearScheduledTimers = () => {
		timers.forEach((timer) => clearTimeout(timer));
		timers.length = 0;
	};

	const cancelAndClearRafs = () => {
		rafIds.forEach((id) => cancelAnimationFrame(id));
		rafIds.clear();
	};

	const getTitleShift = () => {
		if (window.innerWidth <= MOBILE_BREAKPOINT) return -48;
		const desktopShift = window.innerWidth * -0.078;
		return Math.max(-120, Math.min(-80, desktopShift));
	};

	const getMobileTitleShift = () => {
		if (!titleLeft || !titleRight) {
			return { togetherShift: 0, splitShift: 0 };
		}

		const viewportWidth = window.innerWidth;
		const leftRect = titleLeft.getBoundingClientRect();
		const rightRect = titleRight.getBoundingClientRect();

		const leftCenter = leftRect.left + leftRect.width / 2;
		const rightCenter = rightRect.left + rightRect.width / 2;
		const splitShift = Math.min(leftCenter, viewportWidth - rightCenter);

		return { togetherShift: 0, splitShift };
	};

	const setTitleState = (
		{ shift = 0, opacity = 1 }: { shift?: number; opacity?: number },
		animate = true,
	) => {
		const transition = animate
			? isMobile()
				? `transform 0.7s ${MOBILE_EASE}, opacity 0.3s ${MOBILE_EASE}`
				: `transform 0.86s ${DESKTOP_EASE}, opacity 0.32s ${DESKTOP_EASE}`
			: 'none';

		if (titleLeft) {
			titleLeft.style.transition = transition;
			titleLeft.style.transform = `translate3d(${-shift}px, 0, 0)`;
			titleLeft.style.opacity = `${opacity}`;
		}

		if (titleRight) {
			titleRight.style.transition = transition;
			titleRight.style.transform = `translate3d(${shift}px, 0, 0)`;
			titleRight.style.opacity = `${opacity}`;
		}
	};

	const getTravelOffset = () => {
		const stageRect = stage.getBoundingClientRect();
		const sampleCard = stage.querySelector<HTMLElement>('[data-hero-card]');
		const cardRect = sampleCard ? sampleCard.getBoundingClientRect() : { height: stageRect.height };
		const cardHeight = cardRect.height || stageRect.height;
		const stageCenterY = stageRect.top + stageRect.height / 2;
		const offset = -(stageCenterY + cardHeight / 2 + 48);
		// Ensure cards always travel upward — when hero is scrolled off-screen,
		// stageCenterY goes very negative which flips offset positive (downward).
		const minTravel = -(stageRect.height / 2 + cardHeight / 2 + 48);
		return Math.min(offset, minTravel);
	};

	const getStackZIndex = (index: number, total: number) => total - index;

	const stackedState = (index: number, total: number, yOffset = 0) => {
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

	const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;
	const getInitialTitleShift = () => (isMobile() ? 0 : getTitleShift());

	const getSpreadUnit = (cards: HTMLElement[]) => {
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
			spreadScale = 1;
			return idealUnit;
		}

		const scaled = available / totalSpread;
		spreadScale = Math.max(0.82, Math.min(1, scaled));
		return idealUnit * spreadScale;
	};

	const getSpreadTitleShift = () => {
		if (!titleLeft || !titleRight) return 0;
		const container = document.querySelector<HTMLElement>('.shoots-hero__title-row');
		const contentWidth = container ? container.clientWidth : window.innerWidth;
		const contentLeft = container ? container.getBoundingClientRect().left : 0;
		const contentRight = contentLeft + contentWidth;
		const sideInset = Math.max(40, Math.min(140, contentWidth * 0.06));
		const leftRect = titleLeft.getBoundingClientRect();
		const rightRect = titleRight.getBoundingClientRect();
		const leftShift = leftRect.right - (contentLeft + sideInset);
		const rightShift = contentRight - sideInset - rightRect.left;
		return Math.max(0, Math.min(leftShift, rightShift));
	};

	// centerOffset removed — CSS flex:1 on title words centers the stage naturally

	interface CardState {
		x: number;
		y: number;
		scale: number;
		rotate?: number;
		opacity: number;
		zIndex: number;
	}

	const spreadState = (index: number, total: number, unit: number, baseOffset = 0): CardState => {
		const middle = (total - 1) / 2;
		const distance = index - middle;
		return {
			x: baseOffset + distance * unit,
			y: 0,
			scale: spreadScale,
			rotate: 0,
			opacity: 1,
			zIndex: getStackZIndex(index, total),
		};
	};

	const holdState = (index: number, total: number, baseOffset = 0): CardState => ({
		...stackedState(index, total, 0),
		x: baseOffset,
		rotate: 0,
	});

	const entryState = (index: number, total: number, baseOffset = 0): CardState => ({
		...stackedState(index, total, getTravelOffset()),
		x: baseOffset,
		rotate: 0,
	});

	const exitState = (index: number, total: number, baseOffset = 0): CardState => ({
		...stackedState(index, total, getTravelOffset()),
		x: baseOffset,
		rotate: 0,
	});

	const applyState = (
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

	const hideDeck = (deck: HTMLElement) => {
		deck.style.transition = 'none';
		deck.style.opacity = '0';
		deck.style.visibility = 'hidden';
	};

	const showDeck = (deck: HTMLElement) => {
		const cards = getCards(deck);
		deck.style.opacity = '1';
		deck.style.visibility = 'visible';

		cards.forEach((card, index) => {
			const state = entryState(index, cards.length, centerOffset);
			card.style.zIndex = `${state.zIndex}`;
			card.style.opacity = '1';
			card.style.transition = 'none';
			card.style.transform = `translate(-50%, -50%) translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale})`;
		});

		scheduleRaf(() => {
			cards.forEach((card) => {
				void getComputedStyle(card).transform;
			});
			cards.forEach((card, index) => {
				applyState(card, holdState(index, cards.length, centerOffset), true);
			});
		});

		return cards;
	};

	const showDeckForMobileDeal = (deck: HTMLElement, cards: HTMLElement[]) => {
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

	type TimelineStep = { delay: number; action: () => void };
	const runTimeline = (steps: TimelineStep[]) => {
		steps.forEach((step) => schedule(step.action, step.delay));
	};

	const refreshCenterOffset = () => {
		// no-op: centerOffset is always 0 with flex:1 CSS fix
	};

	decks.forEach((deck) => hideDeck(deck));
	setTitleState({ shift: getInitialTitleShift(), opacity: 1 }, false);

	if (prefersReducedMotion) {
		const activeDeck = decks[0];
		refreshCenterOffset();
		activeDeck.style.opacity = '1';
		activeDeck.style.visibility = 'visible';
		getCards(activeDeck).forEach((card, index, cards) =>
			applyState(card, holdState(index, cards.length, centerOffset), false),
		);
		setTitleState({ shift: 0, opacity: 1 }, false);
		cleanup = () => {
			cancelAndClearRafs();
			clearScheduledTimers();
			if (resizeRaf) cancelAnimationFrame(resizeRaf);
		};
		return;
	}

	let forceImmediate = false;
	let activeCards: HTMLElement[] = [];
	let activeDesktopPhase: 'idle' | 'stack' | 'spread' = 'idle';
	let activeDeckIndex = -1;
	let dockTransitionInProgress = false;
	let dockTransitionToken = 0;

	const applyDesktopLayoutForResize = () => {
		if (isMobile() || !activeCards.length) return;
		refreshCenterOffset();
		const spreadUnit = getSpreadUnit(activeCards);
		if (activeDesktopPhase === 'spread') {
			activeCards.forEach((card, index) => {
				applyState(card, spreadState(index, activeCards.length, spreadUnit, centerOffset), false);
			});
			const spreadShift = getSpreadTitleShift();
			setTitleState({ shift: spreadShift, opacity: 1 }, false);
			return;
		}
		activeCards.forEach((card, index) => {
			applyState(card, holdState(index, activeCards.length, centerOffset), false);
		});
		setTitleState({ shift: 0, opacity: 1 }, false);
	};

	const runCycle = () => {
		cycleEpoch += 1;
		cancelAndClearRafs();
		const isLoopRestart = activeIndex === 0 && !forceImmediate;
		forceImmediate = false;
		updateActiveDockThumb(activeIndex);

		decks.forEach((deck, deckIndex) => {
			if (deckIndex !== activeIndex) hideDeck(deck);
		});

		const deck = decks[activeIndex];
		activeDeckIndex = activeIndex;
		const titleShift = getTitleShift();
		const desktopCycleStart = isLoopRestart ? 900 : 0;
		const mobileCycleStart = isLoopRestart ? 200 : 0;
		let cards: HTMLElement[] = [];
		let spreadUnit = 0;

		const startDeckDesktop = () => {
			refreshCenterOffset();
			cards = showDeck(deck);
			activeCards = cards;
			activeDesktopPhase = 'stack';
			spreadUnit = getSpreadUnit(cards);
		};

		const startDeckMobile = () => {
			refreshCenterOffset();
			cards = getCards(deck);
			activeCards = cards;
			activeDesktopPhase = 'idle';
			showDeckForMobileDeal(deck, cards);
		};

		if (isMobile()) {
			const { togetherShift, splitShift } = getMobileTitleShift();
			const mobileCards = getCards(deck);
			const cardCount = Math.max(1, mobileCards.length);
			const viewportHeight = window.innerHeight;
			const viewportWidth = window.innerWidth;
			const dealStartOffset = Math.max(500, viewportHeight * 0.08);
			const dealWindow = Math.max(1000, cardCount * 280);
			const settleBuffer = Math.max(300, viewportHeight * 0.05);
			const dealInterval = Math.max(
				200,
				Math.floor(viewportWidth * 0.005),
				Math.floor(dealWindow / cardCount),
			);
			const cardEntryDuration = 550;
			const cardExitDuration = 420;
			const baseTime = mobileCycleStart + dealStartOffset + settleBuffer + cardExitDuration + 380;
			const perCardTime = Math.max(120, dealInterval);
			const mobileCycleDuration = baseTime + cardCount * perCardTime;

			setTitleState({ shift: togetherShift, opacity: 1 }, false);
			runTimeline([{ delay: mobileCycleStart, action: startDeckMobile }]);

			const dealStart = mobileCycleStart + dealStartOffset;
			const mobileSteps: TimelineStep[] = [
				{
					delay: dealStart,
					action: () => {
						setTitleState({ shift: splitShift, opacity: 1 }, true);
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
								card,
								exitState(index, cards.length),
								true,
								`transform ${cardExitDuration}ms ${MOBILE_EASE}, opacity 220ms ${MOBILE_EASE}`,
							);
						});
					},
				},
				{
					delay: exitStart + 40,
					action: () => {
						setTitleState({ shift: togetherShift, opacity: 1 }, true);
					},
				},
				{
					delay: exitStart + cardExitDuration + 120,
					action: () => {
						hideDeck(deck);
					},
				},
			);
			runTimeline(mobileSteps);

			activeIndex = (activeIndex + 1) % decks.length;
			cycleTimer = window.setTimeout(runCycle, Math.max(mobileCycleDuration, exitStart + 800));
		} else {
			if (isLoopRestart) {
				schedule(startDeckDesktop, desktopCycleStart);
			} else {
				startDeckDesktop();
			}

			schedule(() => {
				setTitleState({ shift: 0, opacity: 1 }, true);
			}, desktopCycleStart + 80);

			schedule(() => {
				const spreadShift = getSpreadTitleShift();
				setTitleState({ shift: spreadShift, opacity: 1 }, true);
				activeDesktopPhase = 'spread';
			}, desktopCycleStart + 1540);

			schedule(() => {
				cards.forEach((card, index) => {
					applyState(card, spreadState(index, cards.length, spreadUnit, centerOffset), true);
				});
			}, desktopCycleStart + 1540);

			schedule(() => {
				setTitleState({ shift: 0, opacity: 1 }, true);
				activeDesktopPhase = 'stack';
			}, desktopCycleStart + 4540);

			schedule(() => {
				cards.forEach((card, index) => {
					applyState(card, holdState(index, cards.length, centerOffset), true);
				});
			}, desktopCycleStart + 4540);

			schedule(() => {
				cards.forEach((card, index) => {
					applyState(card, exitState(index, cards.length, centerOffset), true);
				});
			}, desktopCycleStart + 5520);

			schedule(() => {
				setTitleState({ shift: titleShift, opacity: 1 }, true);
			}, desktopCycleStart + 5520);

			schedule(() => {
				hideDeck(deck);
				activeCards = [];
				activeDesktopPhase = 'idle';
			}, desktopCycleStart + 6360);

			activeIndex = (activeIndex + 1) % decks.length;
			cycleTimer = window.setTimeout(runCycle, desktopCycleStart + 6680);
		}
	};

	runCycle();

	let lastViewportModeIsMobile = isMobile();
	let lastKnownWidth = window.innerWidth;
	let lastKnownOrientation = window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait';

	const restartCycle = (titleStateShift: number) => {
		dockTransitionInProgress = false;
		dockTransitionToken += 1;
		clearScheduledTimers();
		clearTimeout(cycleTimer);
		cancelAndClearRafs();
		decks.forEach((d) => hideDeck(d));
		activeCards = [];
		activeDesktopPhase = 'idle';
		activeDeckIndex = -1;
		setTitleState({ shift: titleStateShift, opacity: 1 }, false);
		forceImmediate = true;
		runCycle();
	};

	const hardCutToDeck = (index: number) => {
		activeIndex = index;
		restartCycle(getInitialTitleShift());
	};

	const handleResize = () => {
		if (resizeRaf) cancelAnimationFrame(resizeRaf);
		resizeRaf = requestAnimationFrame(() => {
			const viewportIsMobile = isMobile();
			const width = window.innerWidth;
			const orientation = width >= window.innerHeight ? 'landscape' : 'portrait';

			if (viewportIsMobile !== lastViewportModeIsMobile) {
				lastViewportModeIsMobile = viewportIsMobile;
				lastKnownWidth = width;
				lastKnownOrientation = orientation;
				restartCycle(getInitialTitleShift());
				return;
			}

			if (viewportIsMobile) {
				const widthDelta = Math.abs(width - lastKnownWidth);
				const orientationChanged = orientation !== lastKnownOrientation;
				const significantWidthChange = widthDelta > 50;
				if (!orientationChanged && !significantWidthChange) return;

				lastKnownWidth = width;
				lastKnownOrientation = orientation;
				restartCycle(0);
				return;
			}
			lastKnownWidth = width;
			lastKnownOrientation = orientation;
			applyDesktopLayoutForResize();
		});
	};

	window.addEventListener('resize', handleResize);

	let paused = false;
	const onVisibilityChange = () => {
		if (document.hidden) {
			if (cycleTimer) {
				clearTimeout(cycleTimer);
				cycleTimer = null as unknown as number;
			}
			cycleEpoch++;
			paused = true;
		} else if (paused) {
			paused = false;
			restartCycle(getInitialTitleShift());
		}
	};
	document.addEventListener('visibilitychange', onVisibilityChange);

	thumbs.forEach((thumb, i) => {
		const onThumbClick = () => {
			if (isMobile()) {
				hardCutToDeck(i);
				return;
			}

			if (dockTransitionInProgress) {
				hardCutToDeck(i);
				return;
			}

			if (!activeCards.length || activeDeckIndex < 0) {
				hardCutToDeck(i);
				return;
			}

			clearScheduledTimers();
			clearTimeout(cycleTimer);
			cancelAndClearRafs();
			dockTransitionInProgress = true;
			const token = ++dockTransitionToken;
			const transition = `transform 200ms ${DESKTOP_EASE}, opacity 180ms ${DESKTOP_EASE}`;

			activeCards.forEach((card, index) => {
				applyState(card, exitState(index, activeCards.length, centerOffset), true, transition);
			});
			setTitleState({ shift: getTitleShift(), opacity: 1 }, true);

			schedule(() => {
				if (token !== dockTransitionToken) return;
				hideDeck(decks[activeDeckIndex]);
				activeCards = [];
				activeDesktopPhase = 'idle';
				activeDeckIndex = -1;
				dockTransitionInProgress = false;
				activeIndex = i;
				forceImmediate = true;
				runCycle();
			}, 220);
		};
		thumb.addEventListener('click', onThumbClick);
		listeners.push(() => thumb.removeEventListener('click', onThumbClick));
	});

	cleanup = () => {
		listeners.forEach((remove) => remove());
		listeners.length = 0;
		cancelAndClearRafs();
		clearScheduledTimers();
		if (resizeRaf) cancelAnimationFrame(resizeRaf);
		clearTimeout(cycleTimer);
		window.removeEventListener('resize', handleResize);
		document.removeEventListener('visibilitychange', onVisibilityChange);
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
