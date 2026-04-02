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
		if (window.innerWidth <= 720) return -48;
		const desktopShift = window.innerWidth * -0.078;
		return Math.max(-120, Math.min(-80, desktopShift));
	};

	const getMobileTitleShift = () => {
		if (!titleLeft || !titleRight) {
			return { togetherShift: 0, splitShift: 0 };
		}

		const viewportWidth = window.innerWidth;
		const edgeInset = Math.max(8, Math.min(16, viewportWidth * 0.025));
		const centerGap = Math.max(6, Math.min(14, viewportWidth * 0.03));
		const leftRect = titleLeft.getBoundingClientRect();
		const rightRect = titleRight.getBoundingClientRect();

		const maxLeftShift = Math.max(0, leftRect.left - edgeInset);
		const maxRightShift = Math.max(0, viewportWidth - edgeInset - rightRect.right);
		const maxSafeShift = Math.min(maxLeftShift, maxRightShift);
		const preferredShift = Math.max(18, Math.min(44, viewportWidth * 0.09));
		const splitShift = Math.max(0, Math.min(preferredShift, maxSafeShift + centerGap));

		return { togetherShift: 0, splitShift };
	};

	const setTitleState = (
		{ shift = 0, opacity = 1 }: { shift?: number; opacity?: number },
		animate = true,
	) => {
		const transition = animate
			? 'transform 0.86s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease'
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
		return {
			x: 0,
			y: yOffset + behind * 4,
			scale: 0.9 - behind * 0.012,
			opacity: 1,
			zIndex: getStackZIndex(index, total),
		};
	};

	const isMobile = () => window.innerWidth <= 720;
	const getInitialTitleShift = () => (isMobile() ? 0 : getTitleShift());

	const getSpreadUnit = (cards: HTMLElement[]) => {
		if (!cards.length) return 0;
		const width = cards[0].offsetWidth || 0;
		const total = cards.length;
		const viewportWidth = window.innerWidth;
		const sideInset = Math.max(60, Math.min(200, viewportWidth * 0.08));
		const cardToTextGap = Math.max(10, Math.min(24, viewportWidth * 0.01));
		const available = Math.max(0, viewportWidth - 2 * (sideInset + cardToTextGap));
		const gap = Math.max(8, Math.min(16, viewportWidth * 0.008));
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
		const viewportWidth = window.innerWidth;
		const sideInset = Math.max(40, Math.min(140, viewportWidth * 0.06));
		const leftRect = titleLeft.getBoundingClientRect();
		const rightRect = titleRight.getBoundingClientRect();
		const leftShift = leftRect.right - sideInset;
		const rightShift = viewportWidth - sideInset - rightRect.left;
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

	const applyState = (card: HTMLElement, state: CardState, animate = true) => {
		const ease = isMobile()
			? 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease'
			: 'transform 0.88s cubic-bezier(0.16, 1, 0.3, 1)';
		card.style.transition = animate ? ease : 'none';
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
			scheduleRaf(() => {
				cards.forEach((card, index) => {
					applyState(card, holdState(index, cards.length, centerOffset), true);
				});
			});
		});

		return cards;
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
		const titleShift = getTitleShift();
		const cycleStart = isLoopRestart ? 900 : 0;
		let cards: HTMLElement[] = [];
		let spreadUnit = 0;

		const startDeck = () => {
			refreshCenterOffset();
			cards = showDeck(deck);
			activeCards = cards;
			activeDesktopPhase = 'stack';
			spreadUnit = getSpreadUnit(cards);
		};

		if (isMobile()) {
			const { togetherShift, splitShift } = getMobileTitleShift();
			const mobileCycleDuration = 5800;
			const dealStartOffset = 760;
			const dealWindow = 1800;
			const settleBuffer = 460;
			const cardCount = Math.max(1, getCards(deck).length);
			const dealInterval = Math.max(240, Math.floor(dealWindow / cardCount));

			setTitleState({ shift: togetherShift, opacity: 1 }, false);

			const deckStartAt = isLoopRestart ? cycleStart : 0;
			schedule(() => {
				startDeck();
			}, deckStartAt);

			schedule(() => {
				setTitleState({ shift: splitShift, opacity: 1 }, true);
			}, deckStartAt + 420);

			const dealStart = deckStartAt + dealStartOffset;
			schedule(() => {
				cards.forEach((card, index) => {
					schedule(() => {
						card.style.transition = 'none';
						card.style.transform = 'translate(-50%, -50%) translate3d(0px, -56px, 0) scale(0.92)';
						card.style.opacity = '0';
						card.style.zIndex = `${50 + index}`;

						scheduleRaf(() => {
							scheduleRaf(() => {
								card.style.transition =
									'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.24s ease';
								card.style.transform = 'translate(-50%, -50%) translate3d(0px, 0px, 0) scale(1)';
								card.style.opacity = '1';
							});
						});
					}, index * dealInterval);
				});
			}, dealStart);

			const exitStart = dealStart + cardCount * dealInterval + settleBuffer;

			schedule(() => {
				cards.forEach((card, index) => {
					applyState(card, exitState(index, cards.length), true);
				});
			}, exitStart);

			schedule(() => {
				setTitleState({ shift: togetherShift, opacity: 1 }, true);
			}, exitStart + 80);

			schedule(() => {
				hideDeck(deck);
			}, exitStart + 720);

			activeIndex = (activeIndex + 1) % decks.length;
			cycleTimer = window.setTimeout(
				runCycle,
				Math.max(deckStartAt + mobileCycleDuration, exitStart + 1000),
			);
		} else {
			if (isLoopRestart) {
				schedule(startDeck, cycleStart);
			} else {
				startDeck();
			}

			schedule(() => {
				setTitleState({ shift: 0, opacity: 1 }, true);
			}, cycleStart + 80);

			schedule(() => {
				const spreadShift = getSpreadTitleShift();
				setTitleState({ shift: spreadShift, opacity: 1 }, true);
				activeDesktopPhase = 'spread';
			}, cycleStart + 1540);

			schedule(() => {
				cards.forEach((card, index) => {
					applyState(card, spreadState(index, cards.length, spreadUnit, centerOffset), true);
				});
			}, cycleStart + 1540);

			schedule(() => {
				setTitleState({ shift: 0, opacity: 1 }, true);
				activeDesktopPhase = 'stack';
			}, cycleStart + 4540);

			schedule(() => {
				cards.forEach((card, index) => {
					applyState(card, holdState(index, cards.length, centerOffset), true);
				});
			}, cycleStart + 4540);

			schedule(() => {
				cards.forEach((card, index) => {
					applyState(card, exitState(index, cards.length, centerOffset), true);
				});
			}, cycleStart + 5520);

			schedule(() => {
				setTitleState({ shift: titleShift, opacity: 1 }, true);
			}, cycleStart + 5520);

			schedule(() => {
				hideDeck(deck);
				activeCards = [];
				activeDesktopPhase = 'idle';
			}, cycleStart + 6360);

			activeIndex = (activeIndex + 1) % decks.length;
			cycleTimer = window.setTimeout(runCycle, cycleStart + 6680);
		}
	};

	runCycle();

	let lastViewportModeIsMobile = isMobile();
	const handleResize = () => {
		if (resizeRaf) cancelAnimationFrame(resizeRaf);
		resizeRaf = requestAnimationFrame(() => {
			const viewportIsMobile = isMobile();
			if (viewportIsMobile !== lastViewportModeIsMobile) {
				lastViewportModeIsMobile = viewportIsMobile;
				clearScheduledTimers();
				clearTimeout(cycleTimer);
				cancelAndClearRafs();
				decks.forEach((d) => hideDeck(d));
				setTitleState({ shift: getInitialTitleShift(), opacity: 1 }, false);
				forceImmediate = true;
				runCycle();
				return;
			}
			if (viewportIsMobile) {
				// Same-mode mobile resize (e.g. orientation change) — restart cycle
				clearScheduledTimers();
				clearTimeout(cycleTimer);
				cancelAndClearRafs();
				decks.forEach((d) => hideDeck(d));
				setTitleState({ shift: 0, opacity: 1 }, false);
				forceImmediate = true;
				runCycle();
				return;
			}
			applyDesktopLayoutForResize();
		});
	};

	window.addEventListener('resize', handleResize);

	thumbs.forEach((thumb, i) => {
		const onThumbClick = () => {
			clearScheduledTimers();
			clearTimeout(cycleTimer);
			cancelAndClearRafs();
			decks.forEach((d) => hideDeck(d));
			setTitleState({ shift: getInitialTitleShift(), opacity: 1 }, false);
			activeIndex = i;
			forceImmediate = true;
			runCycle();
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
