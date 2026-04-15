import type { AppPlatform, AppPricing } from '../../data/app-vault';

export const pricingIcons: Record<AppPricing, string> = {
	free: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M2 12h20"/></svg>`,
	freemium: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18"/><path d="M12 3v18"/><circle cx="12" cy="12" r="9"/></svg>`,
	paid: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20"/><path d="M17 6a5 5 0 0 0-5-2 5 5 0 0 0 0 10 5 5 0 0 1 0 10 5 5 0 0 1-5-2"/></svg>`,
	'open-source': `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-7.07 17.07"/><path d="M12 2a10 10 0 0 1 7.07 17.07"/><path d="M12 12v10"/></svg>`,
};

export const pricingLabel: Record<AppPricing, string> = {
	free: 'Free',
	freemium: 'Freemium',
	paid: 'Paid',
	'open-source': 'Open Source',
};

export const platformIcons: Record<AppPlatform, string> = {
	web: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></svg>`,
	mac: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 9c1 0 2 .8 2 2v5c0 1.2-.8 2-2 2H8c-1.2 0-2-.8-2-2v-5c0-1.2.8-2 2-2h8Z"/><path d="M10 9V7a2 2 0 1 1 4 0v2"/></svg>`,
	windows: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5l8-1v8H3V5Zm10-1 8-1v9h-8V4ZM3 13h8v8l-8-1v-7Zm10 0h8v8l-8-1v-7Z"/></svg>`,
	linux: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3 0 4 3 4 6 0 2-1 3-1 5v4H9v-4c0-2-1-3-1-5 0-3 1-6 4-6Z"/><circle cx="10" cy="9" r="1"/><circle cx="14" cy="9" r="1"/></svg>`,
	ios: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></svg>`,
	android: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9h10v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9Z"/><path d="M9 6 7.5 4.5M15 6l1.5-1.5"/><path d="M6 10h12"/></svg>`,
	cli: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m8 10 2 2-2 2"/><path d="M12 14h4"/></svg>`,
	api: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12a4 4 0 0 1 4-4h4"/><path d="M16 12a4 4 0 0 1-4 4H8"/><path d="M14 8h4v4"/><path d="M10 16H6v-4"/></svg>`,
};
