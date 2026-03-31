export interface NavGroup {
	label: string;
	href: string;
	caption?: string;
	children?: { label: string; href: string }[];
}

export interface NavLink {
	label: string;
	href: string;
	caption: string;
}

export interface NavConfig {
	navGroups: NavGroup[];
	topHref: string;
	brandAriaLabel: string;
	ctaHref?: string;
	ctaLabel?: string;
	email?: string;
	panelId?: string;
}
