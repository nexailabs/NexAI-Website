import {
	type HeroState,
	isMobile,
	getInitialTitleShift,
	restartCycle,
	applyDesktopLayoutForResize,
} from './hero-engine';

/**
 * Creates a resize handler for the hero section.
 * Returns the handler function so the caller can add/remove it as an event listener.
 */
export function createResizeHandler(s: HeroState): () => void {
	let resizeRaf = 0;
	let lastViewportModeIsMobile = isMobile();
	let lastKnownWidth = window.innerWidth;
	let lastKnownOrientation = window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait';

	const handleResize = () => {
		if (resizeRaf) cancelAnimationFrame(resizeRaf);
		resizeRaf = requestAnimationFrame(() => {
			const viewportIsMobile = isMobile();
			const width = window.innerWidth;
			const orientation = width >= window.innerHeight ? 'landscape' : 'portrait';

			if (viewportIsMobile !== lastViewportModeIsMobile) {
				lastViewportModeIsMobile = viewportIsMobile;
				lastKnownWidth = width;
				lastKnownOrientation = orientation;
				restartCycle(s, getInitialTitleShift());
				return;
			}

			if (viewportIsMobile) {
				const widthDelta = Math.abs(width - lastKnownWidth);
				const orientationChanged = orientation !== lastKnownOrientation;
				const significantWidthChange = widthDelta > 50;
				if (!orientationChanged && !significantWidthChange) return;

				lastKnownWidth = width;
				lastKnownOrientation = orientation;
				restartCycle(s, 0);
				return;
			}

			lastKnownWidth = width;
			lastKnownOrientation = orientation;
			applyDesktopLayoutForResize(s);
		});
	};

	// Attach cleanup for the internal resizeRaf
	(handleResize as { cancelRaf?: () => void }).cancelRaf = () => {
		if (resizeRaf) cancelAnimationFrame(resizeRaf);
	};

	return handleResize;
}
