/**
 * Studio Process — scroll-driven image card traveling through steps
 *
 * Desktop: card slides left→right across horizontal step markers
 * Mobile: card slides top→bottom across vertical step list
 */

function clamp(v: number, min: number, max: number) {
	return Math.max(min, Math.min(max, v));
}

function initDesktop() {
	const scroll = document.querySelector<HTMLElement>('[data-process-scroll]');
	const card = document.querySelector<HTMLElement>('[data-process-card]');
	const steps = document.querySelectorAll<HTMLElement>('[data-process-marker]');
	const imgs = document.querySelectorAll<HTMLElement>('[data-process-img]');
	const slots = document.querySelectorAll<HTMLElement>('[data-process-slot]');

	if (!scroll || !card || steps.length < 2) return null;

	let lastStep = 0;
	let ticking = false;
	let rafId = 0;

	const inner = scroll!.querySelector<HTMLElement>('.sp__inner');

	// Cached geometry — recomputed on init + resize only
	let cachedPositions: { x: number; y: number }[] = [];
	let cachedCardHalf = 0;

	function cacheGeometry() {
		const innerRect = inner!.getBoundingClientRect();
		cachedPositions = Array.from(steps).map((s) => {
			const slot = s.querySelector('.sp__img-slot');
			if (!slot) return { x: 0, y: 0 };
			const r = slot.getBoundingClientRect();
			return {
				x: r.left + r.width / 2 - innerRect.left,
				y: r.top - innerRect.top,
			};
		});
		cachedCardHalf = card!.offsetWidth / 2;
	}

	function update() {
		ticking = false;

		const rect = scroll!.getBoundingClientRect();
		const scrollHeight = scroll!.offsetHeight - window.innerHeight;
		if (scrollHeight <= 0) return;

		const p = clamp(-rect.top / scrollHeight, 0, 1);

		const firstX = cachedPositions[0].x;
		const lastX = cachedPositions[cachedPositions.length - 1].x;
		const rangeX = lastX - firstX;

		const targetX = firstX + rangeX * p - cachedCardHalf;

		card!.style.top = `${cachedPositions[0].y}px`;
		card!.style.transform = `translateX(${targetX}px)`;

		const stepCount = steps.length;
		const step = Math.min(Math.floor(p * stepCount), stepCount - 1);

		if (step !== lastStep) {
			imgs.forEach((img, i) => {
				(img as HTMLElement).style.opacity = i === step ? '1' : '0';
			});
			steps.forEach((s, i) => {
				s.classList.toggle('sp__step--active', i === step);
			});
			slots.forEach((slot, i) => {
				slot.classList.toggle('sp__slot-img--visible', i < step);
			});
			lastStep = step;
		}
	}

	function onScroll() {
		if (!ticking) {
			ticking = true;
			rafId = requestAnimationFrame(update);
		}
	}

	function onResize() {
		cacheGeometry();
		update();
	}

	cacheGeometry();
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onResize, { passive: true });
	update();

	return () => {
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', onResize);
		cancelAnimationFrame(rafId);
	};
}

function initMobile() {
	const scroll = document.querySelector<HTMLElement>('[data-process-mob-scroll]');
	const card = document.querySelector<HTMLElement>('[data-process-mob-card]');
	const steps = document.querySelectorAll<HTMLElement>('[data-process-mob-step]');
	const imgs = document.querySelectorAll<HTMLElement>('[data-process-mob-img]');

	if (!scroll || !card || steps.length < 2) return null;

	let prevStep = 0;
	let ticking = false;
	let rafId = 0;

	// Cached geometry — recomputed on init + resize only
	let cachedStepYs: number[] = [];
	let cachedFirstY = 0;
	let cachedRange = 0;

	function cacheGeometry() {
		const stageRect = scroll!.querySelector('.sp__mob-stage')?.getBoundingClientRect();
		if (!stageRect) return;
		cachedStepYs = Array.from(steps).map((s) => {
			const r = s.getBoundingClientRect();
			return r.top - stageRect.top;
		});
		if (cachedStepYs.length === 0) return;
		cachedFirstY = cachedStepYs[0];
		const finalStepEl = steps[steps.length - 1];
		const lastStepBottom = cachedStepYs[cachedStepYs.length - 1] + finalStepEl.offsetHeight;
		const lastY = lastStepBottom - card!.offsetHeight;
		cachedRange = lastY - cachedFirstY;
	}

	function update() {
		ticking = false;

		const rect = scroll!.getBoundingClientRect();
		const scrollHeight = scroll!.offsetHeight - window.innerHeight;
		if (scrollHeight <= 0) return;

		const p = clamp(-rect.top / scrollHeight, 0, 1);

		const targetY = cachedFirstY + cachedRange * p;
		card!.style.transform = `translateY(${targetY}px)`;

		const stepCount = steps.length;
		const step = Math.min(Math.floor(p * stepCount), stepCount - 1);

		if (step !== prevStep) {
			imgs.forEach((img, i) => {
				(img as HTMLElement).style.opacity = i === step ? '1' : '0';
			});
			steps.forEach((s, i) => {
				s.classList.toggle('sp__mob-step--active', i === step);
			});
			prevStep = step;
		}
	}

	function onScroll() {
		if (!ticking) {
			ticking = true;
			rafId = requestAnimationFrame(update);
		}
	}

	function onResize() {
		cacheGeometry();
		update();
	}

	cacheGeometry();
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onResize, { passive: true });
	update();

	return () => {
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', onResize);
		cancelAnimationFrame(rafId);
	};
}

function init() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const cleanup = window.innerWidth <= 720 ? initMobile() : initDesktop();

	if (cleanup) {
		document.addEventListener('astro:before-swap', cleanup, { once: true });
	}
}

document.addEventListener('astro:page-load', init);
