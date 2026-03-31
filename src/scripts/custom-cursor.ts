let cleanup: (() => void) | null = null;

function init() {
	if (cleanup) {
		cleanup();
		cleanup = null;
	}

	// Skip on touch devices or reduced motion
	if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const cursor = document.querySelector<HTMLElement>('[data-custom-cursor]');
	if (!cursor) return;

	const ring = cursor.querySelector<HTMLElement>('.cursor__ring');
	const dot = cursor.querySelector<HTMLElement>('.cursor__dot');
	if (!ring || !dot) return;

	let mouseX = -100;
	let mouseY = -100;
	let ringX = -100;
	let ringY = -100;
	let revealed = false;
	let rafId: number | null = null;
	let loopActive = false;
	let idleTimer: number | null = null;

	// Lerp factor: lower = more lag (0.12 gives a smooth 1-2 frame trailing feel)
	const RING_LERP = 0.12;

	const startLoop = () => {
		if (loopActive) return;
		loopActive = true;
		rafId = requestAnimationFrame(tick);
	};

	const stopLoop = () => {
		if (!loopActive) return;
		loopActive = false;
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	};

	const tick = () => {
		if (!loopActive) return;

		// Dot snaps immediately
		dot.style.transform = `translate3d(${mouseX}px,${mouseY}px,0)`;

		// Ring lerps toward mouse
		ringX += (mouseX - ringX) * RING_LERP;
		ringY += (mouseY - ringY) * RING_LERP;
		ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;

		rafId = requestAnimationFrame(tick);
	};

	const onMouseMove = (e: MouseEvent) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
		if (!revealed) {
			cursor.classList.add('cursor--visible');
			revealed = true;
		}
		startLoop();
		if (idleTimer) clearTimeout(idleTimer);
		idleTimer = window.setTimeout(stopLoop, 2000);
	};

	// Event delegation for hover — handles dynamic elements without re-querying
	const onMouseOver = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target.closest('a, button, [role="tab"], [role="button"], input, textarea, select')) {
			cursor.classList.add('cursor--hover');
		}
	};

	const onMouseOut = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target.closest('a, button, [role="tab"], [role="button"], input, textarea, select')) {
			cursor.classList.remove('cursor--hover');
		}
	};

	const onMouseLeave = () => cursor.classList.remove('cursor--visible');
	const onMouseEnter = () => {
		if (revealed) cursor.classList.add('cursor--visible');
	};

	const onMouseDown = () => cursor.classList.add('cursor--click');
	const onMouseUp = () => cursor.classList.remove('cursor--click');

	window.addEventListener('mousemove', onMouseMove, { passive: true });
	document.addEventListener('mouseover', onMouseOver, { passive: true });
	document.addEventListener('mouseout', onMouseOut, { passive: true });
	document.addEventListener('mouseleave', onMouseLeave);
	document.addEventListener('mouseenter', onMouseEnter);
	document.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mouseup', onMouseUp);

	cleanup = () => {
		stopLoop();
		if (idleTimer) clearTimeout(idleTimer);
		idleTimer = null;
		window.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseover', onMouseOver);
		document.removeEventListener('mouseout', onMouseOut);
		document.removeEventListener('mouseleave', onMouseLeave);
		document.removeEventListener('mouseenter', onMouseEnter);
		document.removeEventListener('mousedown', onMouseDown);
		document.removeEventListener('mouseup', onMouseUp);
		cursor.classList.remove('cursor--visible', 'cursor--hover', 'cursor--click');
		revealed = false;
	};
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', () => {
	if (cleanup) {
		cleanup();
		cleanup = null;
	}
});
