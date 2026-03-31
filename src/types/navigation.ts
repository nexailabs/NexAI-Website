export interface NavLink {
	label: string;
	href: string;
	caption: string;
}

export interface NavGroup {
	id: string;
	label: string;
	href: string;
	caption?: string;
	children?: NavGroup[];
}

export interface NavConfig {
	navGroups: NavGroup[];
	topHref?: string;
	brandAriaLabel?: string;
	ctaHref?: string;
	ctaLabel?: string;
	email?: string;
}
