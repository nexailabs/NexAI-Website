export interface HeroImage {
	src: string;
	alt: string;
}

export interface NavLink {
	label: string;
	href: string;
	caption: string;
}

export interface NavGroup {
	label: string;
	href: string;
	caption?: string;
	children?: { label: string; href: string }[];
}

export interface BrandLogo {
	src: string;
	alt: string;
	width: number;
	height: number;
}

export interface ServiceCard {
	title: string;
	description: string;
}

export interface ShowcaseSlot {
	src?: string;
	alt: string;
	aspect: '3x4' | '2x3' | '1x1';
}

export interface ShowcaseCategory {
	id: string;
	label: string;
	inputMain?: string;
	inputSideTop?: string;
	inputSideBottom?: string;
	outputs: ShowcaseSlot[];
}
