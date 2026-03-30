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

	const syncScrollState = () => {
		root.classList.toggle('is-scrolled', window.scrollY > 24);
	};

	const closeMenu = () => {
		root.dataset.open = 'false';
		trigger?.setAttribute('aria-expanded', 'false');
		trigger?.setAttribute('aria-label', 'Open navigation');
		panel?.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('nav-open');
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

		const focusables = [...(panel?.querySelectorAll('a, button') ?? []), trigger].filter(
			Boolean,
		) as HTMLElement[];

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
