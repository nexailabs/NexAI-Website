export {};

let cleanup: (() => void) | null = null;

function init() {
	cleanup?.();
	cleanup = null;

	const targets = Array.from(document.querySelectorAll('.reveal-up'));
	if (!targets.length) return;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		targets.forEach((target) => target.classList.add('is-visible'));
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			});
		},
		{ threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
	);

	targets.forEach((target) => observer.observe(target));

	cleanup = () => observer.disconnect();
}

document.addEventListener('astro:page-load', init);
