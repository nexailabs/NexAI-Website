// ── ShowcaseV3: Tab switching + ARIA keyboard nav + Mobile before/after cycle ──

let tabCleanup: (() => void) | null = null;
let mobCleanup: (() => void) | null = null;
let resizeHandler: (() => void) | null = null;

// ─── Tab Logic ───────────────────────────────────────────────────────────────

function activateTab(
	tab: HTMLElement,
	navItems: HTMLElement[],
	panels: HTMLElement[],
	prefersReducedMotion: boolean,
	switching: { value: boolean },
) {
	if (switching.value) return;
	const target = tab.getAttribute('data-target');
	const currentActive = document.querySelector<HTMLElement>('.sc3__panel.active');
	const nextPanel = document.querySelector<HTMLElement>(`.sc3__panel[data-panel="${target}"]`);

	if (!nextPanel || nextPanel === currentActive) return;
	switching.value = true;

	// Update tab ARIA state
	navItems.forEach((n) => {
		n.classList.remove('active');
		n.setAttribute('aria-selected', 'false');
		n.setAttribute('tabindex', '-1');
	});
	tab.classList.add('active');
	tab.setAttribute('aria-selected', 'true');
	tab.setAttribute('tabindex', '0');

	// Update panel ARIA state
	panels.forEach((panel) =>
		panel.setAttribute('aria-hidden', panel === nextPanel ? 'false' : 'true'),
	);

	if (currentActive) {
		currentActive.classList.add('leaving');
		currentActive.classList.remove('active');
	}

	// Lock stage height to prevent layout jump during crossfade
	const stage = document.querySelector<HTMLElement>('.sc3__stage');
	if (stage && currentActive) {
		stage.style.minHeight = `${currentActive.offsetHeight}px`;
	}

	requestAnimationFrame(() => {
		nextPanel.classList.add('active');

		// Trigger mobile cycle reinit
		initMobShowcaseCycle();

		if (prefersReducedMotion) {
			if (currentActive) currentActive.classList.remove('leaving');
			if (stage) stage.style.minHeight = '';
			switching.value = false;
			return;
		}

		const releaseSwitch = () => {
			if (currentActive) currentActive.classList.remove('leaving');
			if (stage) stage.style.minHeight = '';
			switching.value = false;
		};

		let settled = false;
		const onTransitionDone = (event: TransitionEvent) => {
			if (event.target !== nextPanel || event.propertyName !== 'opacity') return;
			if (settled) return;
			settled = true;
			nextPanel.removeEventListener('transitionend', onTransitionDone);
			releaseSwitch();
		};

		nextPanel.addEventListener('transitionend', onTransitionDone);
		window.setTimeout(() => {
			if (settled) return;
			settled = true;
			nextPanel.removeEventListener('transitionend', onTransitionDone);
			releaseSwitch();
		}, 680);
	});
}

function initTabs() {
	tabCleanup?.();
	tabCleanup = null;

	const navItems = Array.from(document.querySelectorAll<HTMLElement>('.sc3__nav-item'));
	const panels = Array.from(document.querySelectorAll<HTMLElement>('.sc3__panel'));
	if (!navItems.length || !panels.length) return;

	const switching = { value: false };
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const listeners: (() => void)[] = [];

	// Sync initial ARIA state
	panels.forEach((panel) => {
		const isActive = panel.classList.contains('active');
		panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
	});

	navItems.forEach((item) => {
		item.setAttribute('aria-selected', item.classList.contains('active') ? 'true' : 'false');
		item.setAttribute('tabindex', item.classList.contains('active') ? '0' : '-1');
	});

	// Click handlers
	navItems.forEach((item) => {
		const onClick = () => activateTab(item, navItems, panels, prefersReducedMotion, switching);
		item.addEventListener('click', onClick);
		listeners.push(() => item.removeEventListener('click', onClick));
	});

	// Keyboard navigation (automatic activation — ArrowLeft/Right activate on move)
	const tablist = document.querySelector<HTMLElement>('[role="tablist"]');
	if (tablist) {
		const onKeydown = (e: KeyboardEvent) => {
			const currentIndex = navItems.findIndex((item) => item === document.activeElement);
			if (currentIndex === -1) return;

			let targetIndex: number;

			switch (e.key) {
				case 'ArrowRight':
					targetIndex = (currentIndex + 1) % navItems.length;
					break;
				case 'ArrowLeft':
					targetIndex = (currentIndex - 1 + navItems.length) % navItems.length;
					break;
				case 'Home':
					targetIndex = 0;
					break;
				case 'End':
					targetIndex = navItems.length - 1;
					break;
				default:
					return;
			}

			e.preventDefault();
			navItems[targetIndex].focus();
			activateTab(navItems[targetIndex], navItems, panels, prefersReducedMotion, switching);
		};
		tablist.addEventListener('keydown', onKeydown);
		listeners.push(() => tablist.removeEventListener('keydown', onKeydown));
	}

	tabCleanup = () => {
		listeners.forEach((remove) => remove());
	};
}

// ─── Mobile Before/After Cycle ───────────────────────────────────────────────

const isMob = () => window.innerWidth <= 900;

const PASSIVE_SCALE = 0.62;
const PASSIVE_VISIBLE_RATIO = 0.24;
const PAN_INTENT = 12;
const IDLE_RESUME = 3000;
const AUTO_INPUT_HOLD = 2000;
const AUTO_OUTPUT_HOLD = 2400;
const TRANSITION_BUFFER = 720;
const ACTIVE_SHADOW = 0.34;
const PASSIVE_SHADOW = 0.2;
const ACTIVE_OVERLAY = 0.02;
const PASSIVE_OVERLAY = 0.18;

interface MobController {
	panel: HTMLElement;
	mobileStage: HTMLElement;
	beforeCard: HTMLElement;
	afterCard: HTMLElement;
	slide: 'before' | 'after';
	progress: number;
	startValue: number;
	pointerId: number | null;
	lockedAxis: 'x' | 'y' | null;
	dragging: boolean;
	startX: number;
	startY: number;
	rafId: number;
	pendingProgress: number | null;
	cleanup?: () => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress;
const slideToValue = (slide: string) => (slide === 'after' ? 1 : 0);

let mobTimers = new Set<number>();
let mobControllers: MobController[] = [];

function mobSchedule(fn: () => void, delay: number) {
	const id = window.setTimeout(() => {
		mobTimers.delete(id);
		fn();
	}, delay);
	mobTimers.add(id);
	return id;
}

function mobClearTimers() {
	mobTimers.forEach((id) => clearTimeout(id));
	mobTimers.clear();
}

function getPassiveOffset(ctrl: MobController) {
	const beforeWidth = ctrl.beforeCard?.offsetWidth || 0;
	const afterWidth = ctrl.afterCard?.offsetWidth || 0;
	const baseWidth = Math.max(beforeWidth, afterWidth, ctrl.mobileStage.clientWidth * 0.76);
	return (baseWidth * (1 - PASSIVE_SCALE + 2 * PASSIVE_VISIBLE_RATIO * PASSIVE_SCALE)) / 2;
}

function getVisualState(ctrl: MobController, progress: number) {
	const passiveOffset = getPassiveOffset(ctrl);
	const zSwapThreshold = ctrl.slide === 'before' ? 0.58 : 0.42;
	const afterOnTop = progress >= zSwapThreshold;
	return {
		before: {
			x: lerp(0, -passiveOffset, progress),
			scale: lerp(1, PASSIVE_SCALE, progress),
			shadow: lerp(ACTIVE_SHADOW, PASSIVE_SHADOW, progress),
			overlay: lerp(ACTIVE_OVERLAY, PASSIVE_OVERLAY, progress),
			z: afterOnTop ? 2 : 4,
		},
		after: {
			x: lerp(passiveOffset, 0, progress),
			scale: lerp(PASSIVE_SCALE, 1, progress),
			shadow: lerp(PASSIVE_SHADOW, ACTIVE_SHADOW, progress),
			overlay: lerp(PASSIVE_OVERLAY, ACTIVE_OVERLAY, progress),
			z: afterOnTop ? 4 : 2,
		},
	};
}

function applyVisualState(ctrl: MobController, progress: number, dragging = false) {
	const state = getVisualState(ctrl, progress);
	const beforeTagOpacity = progress < 0.5 ? 1 : 0;
	const afterTagOpacity = progress >= 0.5 ? 1 : 0;
	ctrl.progress = progress;
	ctrl.mobileStage.dataset.dragging = dragging ? 'true' : 'false';
	if (dragging) {
		ctrl.panel.dataset.dragging = 'true';
	} else {
		ctrl.panel.removeAttribute('data-dragging');
	}

	const s = ctrl.mobileStage.style;
	s.setProperty('--sc3-before-x', `${state.before.x.toFixed(2)}px`);
	s.setProperty('--sc3-after-x', `${state.after.x.toFixed(2)}px`);
	s.setProperty('--sc3-before-scale', state.before.scale.toFixed(4));
	s.setProperty('--sc3-after-scale', state.after.scale.toFixed(4));
	s.setProperty('--sc3-before-shadow', state.before.shadow.toFixed(3));
	s.setProperty('--sc3-after-shadow', state.after.shadow.toFixed(3));
	s.setProperty('--sc3-before-overlay', state.before.overlay.toFixed(3));
	s.setProperty('--sc3-after-overlay', state.after.overlay.toFixed(3));
	s.setProperty('--sc3-before-z', `${state.before.z}`);
	s.setProperty('--sc3-after-z', `${state.after.z}`);
	s.setProperty('--sc3-before-tag-opacity', `${beforeTagOpacity}`);
	s.setProperty('--sc3-after-tag-opacity', `${afterTagOpacity}`);
}

function getActiveController() {
	return mobControllers.find((ctrl) => ctrl.panel.classList.contains('active'));
}

function pauseAutoCycle() {
	mobClearTimers();
}

function queueAutoCycle(delay = IDLE_RESUME) {
	pauseAutoCycle();
	mobSchedule(runCycle, delay);
}

function settleSlide(ctrl: MobController, slide: 'before' | 'after', { restartAuto = true } = {}) {
	ctrl.slide = slide;
	ctrl.panel.setAttribute('data-mobile-slide', slide);
	applyVisualState(ctrl, slideToValue(slide), false);
	if (restartAuto) queueAutoCycle();
}

function releasePointer(ctrl: MobController) {
	if (ctrl.pointerId === null) return;
	if (
		typeof ctrl.mobileStage.releasePointerCapture === 'function' &&
		ctrl.mobileStage.hasPointerCapture?.(ctrl.pointerId)
	) {
		ctrl.mobileStage.releasePointerCapture(ctrl.pointerId);
	}
	ctrl.pointerId = null;
}

function finishInteraction(ctrl: MobController, shouldSettle = true) {
	if (ctrl.rafId) {
		cancelAnimationFrame(ctrl.rafId);
		ctrl.rafId = 0;
	}
	releasePointer(ctrl);
	ctrl.lockedAxis = null;
	ctrl.dragging = false;
	ctrl.startValue = slideToValue(ctrl.slide);
	const nextSlide: 'before' | 'after' = ctrl.progress >= 0.5 ? 'after' : 'before';
	if (shouldSettle) {
		settleSlide(ctrl, nextSlide);
	} else {
		ctrl.mobileStage.dataset.dragging = 'false';
		ctrl.panel.removeAttribute('data-dragging');
	}
}

function runCycle() {
	const ctrl = getActiveController();
	if (!ctrl) {
		mobSchedule(runCycle, 1000);
		return;
	}

	const startSlide = ctrl.slide;
	settleSlide(ctrl, startSlide, { restartAuto: false });

	if (startSlide === 'before') {
		mobSchedule(() => {
			const active = getActiveController();
			if (!active || active !== ctrl || ctrl.dragging) return;
			settleSlide(ctrl, 'after', { restartAuto: false });
		}, AUTO_INPUT_HOLD);

		mobSchedule(() => {
			const active = getActiveController();
			if (!active || active !== ctrl || ctrl.dragging) return;
			settleSlide(ctrl, 'before', { restartAuto: false });
		}, AUTO_INPUT_HOLD + AUTO_OUTPUT_HOLD);

		mobSchedule(runCycle, AUTO_INPUT_HOLD + AUTO_OUTPUT_HOLD + TRANSITION_BUFFER);
		return;
	}

	mobSchedule(() => {
		const active = getActiveController();
		if (!active || active !== ctrl || ctrl.dragging) return;
		settleSlide(ctrl, 'before', { restartAuto: false });
	}, AUTO_OUTPUT_HOLD);

	mobSchedule(runCycle, AUTO_OUTPUT_HOLD + TRANSITION_BUFFER);
}

function initMobShowcaseCycle() {
	mobCleanup?.();
	mobCleanup = null;
	mobControllers = [];
	mobTimers = new Set();

	if (!isMob()) return;

	document.querySelectorAll<HTMLElement>('.sc3__panel').forEach((panel) => {
		const mobileStage = panel.querySelector<HTMLElement>('.sc3__mobile-stage');
		const beforeCard = panel.querySelector<HTMLElement>('.sc3__mobile-card--before');
		const afterCard = panel.querySelector<HTMLElement>('.sc3__mobile-card--after');
		if (!mobileStage || !beforeCard || !afterCard) return;

		const ctrl: MobController = {
			panel,
			mobileStage,
			beforeCard,
			afterCard,
			slide: panel.getAttribute('data-mobile-slide') === 'after' ? 'after' : 'before',
			progress: 0,
			startValue: 0,
			pointerId: null,
			lockedAxis: null,
			dragging: false,
			startX: 0,
			startY: 0,
			rafId: 0,
			pendingProgress: null,
		};

		const renderDrag = () => {
			ctrl.rafId = 0;
			if (ctrl.pendingProgress === null) return;
			applyVisualState(ctrl, ctrl.pendingProgress, true);
		};

		const requestRender = (progress: number) => {
			ctrl.pendingProgress = progress;
			ctrl.progress = progress;
			if (!ctrl.rafId) {
				ctrl.rafId = requestAnimationFrame(renderDrag);
			}
		};

		const onPointerDown = (event: PointerEvent) => {
			if (!isMob() || !panel.classList.contains('active')) return;
			if (event.button !== undefined && event.button !== 0) return;
			ctrl.pointerId = event.pointerId;
			ctrl.lockedAxis = null;
			ctrl.dragging = false;
			ctrl.startX = event.clientX;
			ctrl.startY = event.clientY;
			ctrl.startValue = slideToValue(ctrl.slide);
			ctrl.pendingProgress = ctrl.startValue;
			pauseAutoCycle();
			if (typeof mobileStage.setPointerCapture === 'function') {
				mobileStage.setPointerCapture(event.pointerId);
			}
		};

		const onPointerMove = (event: PointerEvent) => {
			if (ctrl.pointerId !== event.pointerId) return;

			const deltaX = event.clientX - ctrl.startX;
			const deltaY = event.clientY - ctrl.startY;

			if (!ctrl.lockedAxis) {
				if (Math.abs(deltaX) < PAN_INTENT && Math.abs(deltaY) < PAN_INTENT) return;
				ctrl.lockedAxis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
			}

			if (ctrl.lockedAxis !== 'x') return;

			ctrl.dragging = true;
			event.preventDefault();
			const passiveOffset = getPassiveOffset(ctrl);
			const nextProgress = clamp(ctrl.startValue - deltaX / passiveOffset, 0, 1);
			requestRender(nextProgress);
		};

		const onPointerEnd = (event: PointerEvent) => {
			if (ctrl.pointerId !== event.pointerId) return;
			if (ctrl.pendingProgress !== null) {
				ctrl.progress = ctrl.pendingProgress;
			}
			finishInteraction(ctrl, true);
		};

		mobileStage.addEventListener('pointerdown', onPointerDown);
		mobileStage.addEventListener('pointermove', onPointerMove);
		mobileStage.addEventListener('pointerup', onPointerEnd);
		mobileStage.addEventListener('pointercancel', onPointerEnd);
		mobileStage.addEventListener('lostpointercapture', onPointerEnd);

		settleSlide(ctrl, ctrl.slide, { restartAuto: false });
		mobControllers.push(ctrl);

		ctrl.cleanup = () => {
			if (ctrl.rafId) cancelAnimationFrame(ctrl.rafId);
			releasePointer(ctrl);
			mobileStage.removeEventListener('pointerdown', onPointerDown);
			mobileStage.removeEventListener('pointermove', onPointerMove);
			mobileStage.removeEventListener('pointerup', onPointerEnd);
			mobileStage.removeEventListener('pointercancel', onPointerEnd);
			mobileStage.removeEventListener('lostpointercapture', onPointerEnd);
		};
	});

	queueAutoCycle(0);

	mobCleanup = () => {
		mobClearTimers();
		mobControllers.forEach((ctrl) => ctrl.cleanup?.());
	};
}

// ─── Resize handler ──────────────────────────────────────────────────────────

function onResize() {
	if (isMob()) {
		initMobShowcaseCycle();
	} else {
		mobCleanup?.();
		mobCleanup = null;
	}
}

// ─── Init ────────────────────────────────────────────────────────────────────

function init() {
	initTabs();
	initMobShowcaseCycle();

	if (!resizeHandler) {
		resizeHandler = onResize;
		window.addEventListener('resize', resizeHandler);
	}
}

document.addEventListener('astro:page-load', init);
