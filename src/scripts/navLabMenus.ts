const BODY_LOCK_CLASS = 'nav-open';

const syncBodyLock = () => {
	const hasOpenMenu = document.querySelector('[data-nav-demo][data-open="true"]');
	document.body.classList.toggle(BODY_LOCK_CLASS, Boolean(hasOpenMenu));
};

const closeRoot = (root: HTMLElement) => {
	root.dataset.open = 'false';

	const trigger = root.querySelector<HTMLElement>('[data-nav-trigger]');
	const panel = root.querySelector<HTMLElement>('[data-nav-panel]');
	if (trigger) trigger.setAttribute('aria-expanded', 'false');
	if (panel) panel.setAttribute('aria-hidden', 'true');

	const scrollViewport = root.closest<HTMLElement>('[data-nav-lab-viewport]');
	if (scrollViewport) scrollViewport.dataset.menuOpen = 'false';

	syncBodyLock();
};

const openRoot = (root: HTMLElement) => {
	root.dataset.open = 'true';

	const trigger = root.querySelector<HTMLElement>('[data-nav-trigger]');
	const panel = root.querySelector<HTMLElement>('[data-nav-panel]');
	if (trigger) trigger.setAttribute('aria-expanded', 'true');
	if (panel) panel.setAttribute('aria-hidden', 'false');

	const scrollViewport = root.closest<HTMLElement>('[data-nav-lab-viewport]');
	if (scrollViewport) scrollViewport.dataset.menuOpen = 'true';

	document.dispatchEvent(
		new CustomEvent('nav-lab:open', {
			detail: { id: root.dataset.navId },
		}),
	);

	syncBodyLock();
};

const bindRoot = (root: HTMLElement) => {
	if (root.dataset.initialized === 'true') return;
	root.dataset.initialized = 'true';

	const trigger = root.querySelector<HTMLElement>('[data-nav-trigger]');
	const closers = root.querySelectorAll<HTMLElement>('[data-nav-close]');
	const scrollViewport = root.closest<HTMLElement>('[data-nav-lab-viewport]');

	const syncScrollState = () => {
		if (!scrollViewport) return;
		root.classList.toggle('is-scrolled', scrollViewport.scrollTop > 30);
	};

	trigger?.addEventListener('click', () => {
		const isOpen = root.dataset.open === 'true';
		if (isOpen) {
			closeRoot(root);
			return;
		}

		openRoot(root);
	});

	closers.forEach((closer) =>
		closer.addEventListener('click', () => {
			closeRoot(root);
		}),
	);

	scrollViewport?.addEventListener('scroll', syncScrollState, { passive: true });
	syncScrollState();

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && root.dataset.open === 'true') {
			closeRoot(root);
		}
	});

	document.addEventListener('nav-lab:open', ((event: Event) => {
		const customEvent = event as CustomEvent<{ id?: string }>;
		if (customEvent.detail?.id !== root.dataset.navId) {
			closeRoot(root);
		}
	}) as EventListener);
};

export const initNavLabMenus = () => {
	document.querySelectorAll<HTMLElement>('[data-nav-demo]').forEach(bindRoot);
	syncBodyLock();
};
