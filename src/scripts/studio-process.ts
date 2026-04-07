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

	function getSlotPositions() {
		const innerRect = inner!.getBoundingClientRect();
		// Find each .sp__img-slot and get its center X + top Y
		return Array.from(steps).map((s) => {
			const slot = s.querySelector('.sp__img-slot');
			if (!slot) return { x: 0, y: 0 };
			const r = slot.getBoundingClientRect();
			return {
				x: r.left + r.width / 2 - innerRect.left,
				y: r.top - innerRect.top,
			};
		});
	}

	function update() {
		ticking = false;

		const rect = scroll!.getBoundingClientRect();
		const scrollHeight = scroll!.offsetHeight - window.innerHeight;
		if (scrollHeight <= 0) return;

		const p = clamp(-rect.top / scrollHeight, 0, 1);

		const positions = getSlotPositions();
		const firstX = positions[0].x;
		const lastX = positions[positions.length - 1].x;
		const rangeX = lastX - firstX;

		// Center the floating image over the interpolated slot position
		const cardHalf = card!.offsetWidth / 2;
		const targetX = firstX + rangeX * p - cardHalf;

		// Align Y with the slot
		card!.style.top = `${positions[0].y}px`;
		card!.style.transform = `translateX(${targetX}px)`;

		const stepCount = steps.length;
		const step = Math.min(Math.floor(p * stepCount), stepCount - 1);

		if (step !== lastStep) {
			// Crossfade floating card image
			imgs.forEach((img, i) => {
				(img as HTMLElement).style.opacity = i === step ? '1' : '0';
			});
			// Highlight active step
			steps.forEach((s, i) => {
				s.classList.toggle('sp__step--active', i === step);
			});
			// Show slot images for steps the card has passed
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

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', update, { passive: true });
	update();

	return () => {
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', update);
		cancelAnimationFrame(rafId);
	};
}

function initMobile() {
	const scroll = document.querySelector<HTMLElement>('[data-process-mob-scroll]');
	const card = document.querySelector<HTMLElement>('[data-process-mob-card]');
	const steps = document.querySelectorAll<HTMLElement>('[data-process-mob-step]');
	const imgs = document.querySelectorAll<HTMLElement>('[data-process-mob-img]');

	if (!scroll || !card || steps.length < 2) return null;

	let lastStep = 0;
	let ticking = false;
	let rafId = 0;

	function getStepYPositions() {
		const stageRect = scroll!.querySelector('.sp__mob-stage')?.getBoundingClientRect();
		if (!stageRect) return [];
		return Array.from(steps).map((s) => {
			const r = s.getBoundingClientRect();
			return r.top - stageRect.top;
		});
	}

	function update() {
		ticking = false;

		const rect = scroll!.getBoundingClientRect();
		const scrollHeight = scroll!.offsetHeight - window.innerHeight;
		if (scrollHeight <= 0) return;

		const p = clamp(-rect.top / scrollHeight, 0, 1);

		// Get Y positions of each step relative to the stage
		const positions = getStepYPositions();
		if (positions.length === 0) return;

		const firstY = positions[0];
		const lastY = positions[positions.length - 1];
		const range = lastY - firstY;

		const targetY = firstY + range * p;
		card!.style.transform = `translateY(${targetY}px)`;

		const stepCount = steps.length;
		const step = Math.min(Math.floor(p * stepCount), stepCount - 1);

		if (step !== lastStep) {
			imgs.forEach((img, i) => {
				(img as HTMLElement).style.opacity = i === step ? '1' : '0';
			});
			steps.forEach((s, i) => {
				s.classList.toggle('sp__mob-step--active', i === step);
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

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', update, { passive: true });
	update();

	return () => {
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', update);
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
