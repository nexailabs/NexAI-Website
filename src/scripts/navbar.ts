import { stopLenis, startLenis } from './lenis';

let controller: AbortController | null = null;
let onCleanup: (() => void) | null = null;

function cleanupListeners() {
	onCleanup?.();
	onCleanup = null;
	controller?.abort();
	controller = null;
}

function init() {
	cleanupListeners();

	const root = document.querySelector<HTMLElement>('[data-prod-signal-nav]');
	if (!root) return;

	controller = new AbortController();
	const { signal } = controller;

	const trigger = root.querySelector<HTMLButtonElement>('[data-nav-trigger]');
	const panel = root.querySelector<HTMLElement>('[data-nav-panel]');
	const closers = root.querySelectorAll<HTMLElement>('[data-nav-close]');
	const expandButtons = root.querySelectorAll<HTMLButtonElement>('[data-nav-expand]');
	const navGroups = root.querySelectorAll<HTMLElement>('[data-nav-group]');
	const flyout = root.querySelector<HTMLElement>('[data-nav-flyout]');
	const flyoutGroups = root.querySelectorAll<HTMLElement>('[data-flyout-for]');
	const pageContent = document.querySelector<HTMLElement>('[data-page-content]');
	const brand = root.querySelector<HTMLElement>('.prod-signal-nav__brand');
	const headerCta = root.querySelector<HTMLElement>('.prod-signal-nav__cta');

	let lastScrollY = window.scrollY;

	let revealTimer: ReturnType<typeof setTimeout> | null = null;
	const clearRevealTimer = () => {
		if (!revealTimer) return;
		clearTimeout(revealTimer);
		revealTimer = null;
	};
	const clearRevealClasses = () => {
		clearRevealTimer();
		root.classList.remove('is-revealing');
	};

	const syncScrollState = () => {
		const y = window.scrollY;
		const scrollingDown = y > lastScrollY;

		if (root.dataset.open !== 'true') {
			if (scrollingDown && y > 0) {
				clearRevealClasses();
				root.classList.add('is-hidden');
			} else if (root.classList.contains('is-hidden')) {
				// 1. Strip scrolled state (bar goes transparent — no visual transition since is-hidden kills it)
				root.classList.remove('is-scrolled');
				// 2. Remove is-hidden (slide-down starts), add is-revealing (bar gets transition-delay)
				root.classList.remove('is-hidden');
				root.classList.add('is-revealing');
				// 3. Force reflow — commit the transparent bar as the transition starting state
				void root.offsetHeight;
				// 4. Add is-scrolled — CSS transition-delay keeps bar transparent during slide,
				//    then animates the highlight in after the slide completes
				root.classList.toggle('is-scrolled', y > 24);
				// 5. Clean up the delay class after animation completes
				revealTimer = setTimeout(() => {
					root.classList.remove('is-revealing');
					revealTimer = null;
				}, 1200);
			} else {
				root.classList.toggle('is-scrolled', y > 24);
			}
		}
		lastScrollY = y;
	};

	const collapseAllSubs = () => {
		expandButtons.forEach((btn) => {
			btn.setAttribute('aria-expanded', 'false');
			const sub = btn.closest('[data-nav-group]')?.querySelector<HTMLElement>('[data-nav-sub]');
			if (sub) sub.setAttribute('aria-hidden', 'true');
		});
	};

	const hideAllFlyouts = () => {
		flyoutGroups.forEach((g) => {
			g.setAttribute('aria-hidden', 'true');
		});
		flyout?.setAttribute('aria-hidden', 'true');
		navGroups.forEach((g) => {
			g.removeAttribute('data-flyout-active');
		});
	};

	const closeMenu = () => {
		root.dataset.open = 'false';
		trigger?.setAttribute('aria-expanded', 'false');
		trigger?.setAttribute('aria-label', 'Open navigation');
		panel?.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('nav-open');
		startLenis();
		pageContent?.removeAttribute('inert');
		brand?.removeAttribute('tabindex');
		headerCta?.removeAttribute('tabindex');
		collapseAllSubs();
		hideAllFlyouts();
		trigger?.focus();
		lastScrollY = window.scrollY;
		syncScrollState();
	};

	// Register cleanup for view transitions (ensures open menu state is reset)
	onCleanup = () => {
		if (root.dataset.open === 'true') {
			root.dataset.open = 'false';
			document.body.classList.remove('nav-open');
			startLenis();
			pageContent?.removeAttribute('inert');
		}
	};

	// Dynamic focus trap — recomputes visible focusables on every Tab
	const trapHandler = (e: KeyboardEvent) => {
		if (e.key !== 'Tab' || !panel || root.dataset.open !== 'true') return;
		const live = [...panel.querySelectorAll<HTMLElement>('a, button')]
			.filter((el) => !el.closest('[aria-hidden="true"]'))
			.concat(trigger ? [trigger] : []);

		if (!live.length) return;
		const first = live[0];
		const last = live[live.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	};

	const openMenu = () => {
		clearRevealClasses();
		root.classList.remove('is-hidden');
		root.dataset.open = 'true';
		trigger?.setAttribute('aria-expanded', 'true');
		trigger?.setAttribute('aria-label', 'Close navigation');
		panel?.removeAttribute('aria-hidden');
		document.body.classList.add('nav-open');
		stopLenis();
		pageContent?.setAttribute('inert', '');
		brand?.setAttribute('tabindex', '-1');
		headerCta?.setAttribute('tabindex', '-1');

		// Focus first visible link — suppress flyout so sub-cats don't auto-show
		suppressFlyout = true;
		const firstLink = panel?.querySelector<HTMLElement>(
			'a:not([disabled]), button:not([disabled])',
		);
		(firstLink ?? trigger)?.focus();
		requestAnimationFrame(() => {
			suppressFlyout = false;
		});

		document.addEventListener('keydown', trapHandler, { signal });
	};

	trigger?.addEventListener(
		'click',
		() => {
			if (root.dataset.open === 'true') {
				closeMenu();
				return;
			}
			openMenu();
		},
		{ signal },
	);

	closers.forEach((link) => {
		link.addEventListener('click', () => closeMenu(), { signal });
	});

	// Mobile: collapsible subcategory toggles (accordion)
	expandButtons.forEach((btn) => {
		btn.addEventListener(
			'click',
			() => {
				const group = btn.closest<HTMLElement>('[data-nav-group]');
				const sub = group?.querySelector<HTMLElement>('[data-nav-sub]');
				if (!sub) return;

				const isOpen = btn.getAttribute('aria-expanded') === 'true';

				// Close all others first (accordion)
				expandButtons.forEach((otherBtn) => {
					if (otherBtn !== btn) {
						otherBtn.setAttribute('aria-expanded', 'false');
						const otherGroup = otherBtn.closest<HTMLElement>('[data-nav-group]');
						const otherSub = otherGroup?.querySelector<HTMLElement>('[data-nav-sub]');
						if (otherSub) otherSub.setAttribute('aria-hidden', 'true');
						otherGroup?.removeAttribute('data-flyout-active');
					}
				});

				btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
				sub.setAttribute('aria-hidden', isOpen ? 'true' : 'false');

				// Active state for cyan italic highlight
				if (group) {
					if (isOpen) {
						group.removeAttribute('data-flyout-active');
					} else {
						group.setAttribute('data-flyout-active', 'true');
					}
				}
			},
			{ signal },
		);
	});

	// Desktop: hover + keyboard flyout for groups with children
	const isDesktop = () => window.innerWidth > 900;
	let suppressFlyout = false;

	// On desktop, remove expand buttons from tab order (focusin handles flyout)
	const syncExpandTabindex = () => {
		const desktop = isDesktop();
		expandButtons.forEach((btn) => {
			if (desktop) btn.setAttribute('tabindex', '-1');
			else btn.removeAttribute('tabindex');
		});
	};
	syncExpandTabindex();
	window.addEventListener('resize', syncExpandTabindex, { signal });

	let flyoutTimeout: ReturnType<typeof setTimeout> | null = null;

	const clearFlyoutTimeout = () => {
		if (flyoutTimeout) {
			clearTimeout(flyoutTimeout);
			flyoutTimeout = null;
		}
	};

	const showFlyoutForGroup = (group: HTMLElement) => {
		if (!flyout || suppressFlyout) return;
		const groupId = group.getAttribute('data-nav-group-id');
		if (!groupId) return;

		clearFlyoutTimeout();

		flyoutGroups.forEach((fg) => {
			const match = fg.getAttribute('data-flyout-for') === groupId;
			fg.setAttribute('aria-hidden', match ? 'false' : 'true');
		});
		flyout.setAttribute('aria-hidden', 'false');

		navGroups.forEach((g) => {
			if (g === group) {
				g.setAttribute('data-flyout-active', 'true');
			} else {
				g.removeAttribute('data-flyout-active');
			}
		});
	};

	const scheduleFlyoutClose = () => {
		flyoutTimeout = setTimeout(() => {
			hideAllFlyouts();
		}, 200);
	};

	navGroups.forEach((group) => {
		const groupId = group.getAttribute('data-nav-group-id');
		if (!groupId) return;

		// Hover activation
		group.addEventListener(
			'mouseenter',
			() => {
				if (!isDesktop()) return;
				showFlyoutForGroup(group);
			},
			{ signal },
		);

		group.addEventListener(
			'mouseleave',
			() => {
				if (!isDesktop()) return;
				scheduleFlyoutClose();
			},
			{ signal },
		);

		// Keyboard activation (mirrors hover)
		group.addEventListener(
			'focusin',
			() => {
				if (!isDesktop()) return;
				showFlyoutForGroup(group);
			},
			{ signal },
		);

		group.addEventListener(
			'focusout',
			(e) => {
				if (!isDesktop()) return;
				const related = (e as FocusEvent).relatedTarget as HTMLElement | null;
				if (!related || (!group.contains(related) && !flyout?.contains(related))) {
					scheduleFlyoutClose();
				}
			},
			{ signal },
		);
	});

	// Keep flyout open when mouse/focus moves into it
	if (flyout) {
		flyout.addEventListener(
			'mouseenter',
			() => {
				clearFlyoutTimeout();
			},
			{ signal },
		);

		flyout.addEventListener(
			'mouseleave',
			() => {
				scheduleFlyoutClose();
			},
			{ signal },
		);

		flyout.addEventListener(
			'focusin',
			() => {
				clearFlyoutTimeout();
			},
			{ signal },
		);

		flyout.addEventListener(
			'focusout',
			(e) => {
				const related = (e as FocusEvent).relatedTarget as HTMLElement | null;
				const anyGroupHasFocus = [...navGroups].some((g) => g.contains(related));
				if (!related || (!flyout.contains(related) && !anyGroupHasFocus)) {
					scheduleFlyoutClose();
				}
			},
			{ signal },
		);
	}

	window.addEventListener('scroll', syncScrollState, { passive: true, signal });

	document.addEventListener(
		'keydown',
		(event: KeyboardEvent) => {
			if (event.key === 'Escape' && root.dataset.open === 'true') {
				closeMenu();
			}
		},
		{ signal },
	);

	syncScrollState();
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', cleanupListeners);
