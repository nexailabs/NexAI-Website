let scrollHandler: (() => void) | null = null;
let escapeHandler: ((e: KeyboardEvent) => void) | null = null;
let trapListener: ((e: KeyboardEvent) => void) | null = null;

function cleanupListeners() {
	if (scrollHandler) {
		window.removeEventListener('scroll', scrollHandler);
		scrollHandler = null;
	}
	if (escapeHandler) {
		document.removeEventListener('keydown', escapeHandler);
		escapeHandler = null;
	}
	if (trapListener) {
		document.removeEventListener('keydown', trapListener);
		trapListener = null;
	}
}

function init() {
	cleanupListeners();

	const root = document.querySelector<HTMLElement>('[data-prod-signal-nav]');
	if (!root) return;

	const trigger = root.querySelector<HTMLButtonElement>('[data-nav-trigger]');
	const panel = root.querySelector<HTMLElement>('[data-nav-panel]');
	const closers = root.querySelectorAll<HTMLElement>('[data-nav-close]');
	const expandButtons = root.querySelectorAll<HTMLButtonElement>('[data-nav-expand]');
	const navGroups = root.querySelectorAll<HTMLElement>('[data-nav-group]');
	const flyout = root.querySelector<HTMLElement>('[data-nav-flyout]');
	const flyoutGroups = root.querySelectorAll<HTMLElement>('[data-flyout-for]');

	const syncScrollState = () => {
		root.classList.toggle('is-scrolled', window.scrollY > 24);
	};

	const collapseAllSubs = () => {
		expandButtons.forEach((btn) => {
			btn.setAttribute('aria-expanded', 'false');
			const sub = btn.closest('[data-nav-group]')?.querySelector<HTMLElement>('[data-nav-sub]');
			if (sub) sub.hidden = true;
		});
	};

	const hideAllFlyouts = () => {
		flyoutGroups.forEach((g) => {
			g.hidden = true;
		});
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
		collapseAllSubs();
		hideAllFlyouts();
		if (trapListener) {
			document.removeEventListener('keydown', trapListener);
			trapListener = null;
		}
		trigger?.focus();
	};

	const openMenu = () => {
		root.dataset.open = 'true';
		trigger?.setAttribute('aria-expanded', 'true');
		trigger?.setAttribute('aria-label', 'Close navigation');
		panel?.setAttribute('aria-hidden', 'false');
		document.body.classList.add('nav-open');

		const focusables = [
			...(panel?.querySelectorAll('a:not([disabled]), button:not([disabled])') ?? []),
			trigger,
		].filter(Boolean) as HTMLElement[];

		if (focusables.length) focusables[0].focus();

		trapListener = (e: KeyboardEvent) => {
			if (e.key !== 'Tab' || !focusables.length) return;
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};
		document.addEventListener('keydown', trapListener);
	};

	trigger?.addEventListener('click', () => {
		if (root.dataset.open === 'true') {
			closeMenu();
			return;
		}
		openMenu();
	});

	closers.forEach((link) => {
		link.addEventListener('click', () => closeMenu());
	});

	// Mobile: collapsible subcategory toggles (accordion)
	expandButtons.forEach((btn) => {
		btn.addEventListener('click', () => {
			const group = btn.closest('[data-nav-group]');
			const sub = group?.querySelector<HTMLElement>('[data-nav-sub]');
			if (!sub) return;

			const isOpen = btn.getAttribute('aria-expanded') === 'true';

			// Close all others first (accordion) + clear active state
			expandButtons.forEach((otherBtn) => {
				if (otherBtn !== btn) {
					otherBtn.setAttribute('aria-expanded', 'false');
					const otherGroup = otherBtn.closest<HTMLElement>('[data-nav-group]');
					const otherSub = otherGroup?.querySelector<HTMLElement>('[data-nav-sub]');
					if (otherSub) otherSub.hidden = true;
					otherGroup?.removeAttribute('data-flyout-active');
				}
			});

			btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
			sub.hidden = isOpen;

			// Set active state for cyan italic highlight
			const parentGroup = btn.closest<HTMLElement>('[data-nav-group]');
			if (parentGroup) {
				if (isOpen) {
					parentGroup.removeAttribute('data-flyout-active');
				} else {
					parentGroup.setAttribute('data-flyout-active', 'true');
				}
			}
		});
	});

	// Desktop: hover flyout for groups with children
	const isDesktop = () => window.innerWidth > 900;
	let flyoutTimeout: ReturnType<typeof setTimeout> | null = null;

	navGroups.forEach((group) => {
		const groupId = group.getAttribute('data-nav-group-id');
		if (!groupId) return;

		group.addEventListener('mouseenter', () => {
			if (!isDesktop() || !flyout) return;
			if (flyoutTimeout) {
				clearTimeout(flyoutTimeout);
				flyoutTimeout = null;
			}

			// Show matching flyout group, hide others + highlight parent
			flyoutGroups.forEach((fg) => {
				fg.hidden = fg.getAttribute('data-flyout-for') !== groupId;
			});
			navGroups.forEach((g) => {
				if (g === group) {
					g.setAttribute('data-flyout-active', 'true');
				} else {
					g.removeAttribute('data-flyout-active');
				}
			});
		});

		group.addEventListener('mouseleave', () => {
			if (!isDesktop()) return;
			flyoutTimeout = setTimeout(() => {
				hideAllFlyouts();
			}, 200);
		});
	});

	// Keep flyout open when mouse moves into it
	if (flyout) {
		flyout.addEventListener('mouseenter', () => {
			if (flyoutTimeout) {
				clearTimeout(flyoutTimeout);
				flyoutTimeout = null;
			}
		});

		flyout.addEventListener('mouseleave', () => {
			flyoutTimeout = setTimeout(() => {
				hideAllFlyouts();
			}, 200);
		});
	}

	scrollHandler = syncScrollState;
	window.addEventListener('scroll', scrollHandler, { passive: true });

	escapeHandler = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && root.dataset.open === 'true') {
			closeMenu();
		}
	};
	document.addEventListener('keydown', escapeHandler);

	syncScrollState();
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', cleanupListeners);
