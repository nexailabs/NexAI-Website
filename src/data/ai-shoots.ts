// ── ImageKit helpers ──
export const ik = 'https://ik.imagekit.io/nexailabs';
export const tr = '?tr=w-600,f-auto,q-80';

// ── Types ──
export interface HeroImage {
	src: string;
	alt: string;
}

export interface NavLink {
	label: string;
	href: string;
	caption: string;
}

export interface BrandLogo {
	src: string;
	alt: string;
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

// ── Page constants ──
export const bookingUrl = 'https://cal.com/nexailabs/15min';
export const email = 'hello@nexailabs.com';

// ── Hero nav links ──
export const heroNavLinks: NavLink[] = [
	{ label: 'Services', href: '#services', caption: 'AI photoshoots for fashion brands.' },
	{ label: 'Process', href: '#process', caption: 'How the creative pipeline works.' },
	{ label: 'Work', href: '#work', caption: 'Selected visual directions and outputs.' },
	{ label: 'FAQ', href: '#faq', caption: 'Answers on delivery, quality, and workflow.' },
];

// ── Hero image decks ──
export const heroDeckA: HeroImage[] = [
	{ src: `${ik}/dbj-jewelry-01.jpg${tr}`, alt: 'Dhwani Bansal Jewelry — earring mirror closeup' },
	{ src: `${ik}/dbj-jewelry-02.jpg${tr}`, alt: 'Dhwani Bansal Jewelry — gold leaf earring' },
	{ src: `${ik}/dbj-jewelry-03.jpg${tr}`, alt: 'Dhwani Bansal Jewelry — two models dining' },
	{ src: `${ik}/dbj-jewelry-04.jpg${tr}`, alt: 'Dhwani Bansal Jewelry — bridal styling' },
	{ src: `${ik}/dbj-jewelry-05.jpg${tr}`, alt: 'Dhwani Bansal Jewelry — heritage look' },
];

export const heroDeckB: HeroImage[] = [
	{
		src: `${ik}/leemboodi-saree-01.jpg${tr}`,
		alt: 'Leemboodi — bandhani saree heritage courtyard',
	},
	{ src: `${ik}/leemboodi-saree-02.jpg${tr}`, alt: 'Leemboodi — colorful saree outdoor' },
	{
		src: `${ik}/leemboodi-saree-03.jpg${tr}`,
		alt: 'Leemboodi — white bandhani saree sunset arch',
	},
	{ src: `${ik}/leemboodi-saree-04.jpg${tr}`, alt: 'Leemboodi — saree editorial palace' },
	{ src: `${ik}/leemboodi-saree-05.jpg${tr}`, alt: 'Leemboodi — saree detail shot' },
];

export const heroDeckC: HeroImage[] = [
	{ src: `${ik}/soilearth-product-01.jpg${tr}`, alt: 'Soil & Earth — product flat-lay oils' },
	{ src: `${ik}/soilearth-product-02.jpg${tr}`, alt: 'Soil & Earth — hair oil botanical' },
	{ src: `${ik}/soilearth-product-03.jpg${tr}`, alt: 'Soil & Earth — oudhwood soap' },
	{ src: `${ik}/soilearth-product-04.jpg${tr}`, alt: 'Soil & Earth — product lifestyle' },
	{ src: `${ik}/soilearth-product-05.jpg${tr}`, alt: 'Soil & Earth — skincare range' },
];

export const heroDeckD: HeroImage[] = [
	{ src: `${ik}/yufta-dress-01.jpg${tr}`, alt: 'Yufta — boho print dress model' },
	{ src: `${ik}/yufta-dress-02.jpg${tr}`, alt: 'Yufta — floral dress studio' },
	{ src: `${ik}/yufta-dress-03.jpg${tr}`, alt: 'Yufta — print dress walking pose' },
	{ src: `${ik}/yufta-dress-04.jpg${tr}`, alt: 'Yufta — summer dress detail' },
	{ src: `${ik}/yufta-dress-05.jpg${tr}`, alt: 'Yufta — casual wear studio' },
];

export const heroDecks: HeroImage[][] = [heroDeckD, heroDeckC, heroDeckB, heroDeckA];

// ── Brand logos (marquee) ──
export const brandLogos: BrandLogo[] = [
	{ src: '/assets/brands/Banno.png', alt: 'Banno' },
	{ src: '/assets/brands/DBJ.png', alt: 'DBJ' },
	{ src: '/assets/brands/GANGA ONG.png', alt: 'Ganga' },
	{ src: '/assets/brands/INDO ERA PNG.png', alt: 'Indo Era' },
	{ src: '/assets/brands/JANASYA.png', alt: 'Janasya' },
	{ src: '/assets/brands/JUGO.png', alt: 'Jugo' },
	{ src: '/assets/brands/STF.png', alt: 'STF' },
	{ src: '/assets/brands/leemboodi.png', alt: 'Leemboodi' },
	{ src: '/assets/brands/skylee.png', alt: 'Skylee' },
	{ src: '/assets/brands/xyxx.png', alt: 'XYXX' },
	{ src: '/assets/brands/yufta.png', alt: 'Yufta' },
];

// ── Showcase categories ──
// Output pattern is always: [3x4, 1x1, 2x3, 1x1, 3x4]
const placeholderOutputs: ShowcaseSlot[] = [
	{ alt: 'Pose 1', aspect: '3x4' },
	{ alt: 'Pose 2', aspect: '1x1' },
	{ alt: 'Pose 3', aspect: '2x3' },
	{ alt: 'Pose 4', aspect: '1x1' },
	{ alt: 'Pose 5', aspect: '3x4' },
];

export const showcaseCategories: ShowcaseCategory[] = [
	{
		id: 'mannequin',
		label: 'Mannequin',
		outputs: placeholderOutputs,
	},
	{
		id: 'flat-lay',
		label: 'Flat Lay',
		inputMain: '/assets/ai-shoots/services/flat-lay-raw.jpg',
		outputs: [
			{ src: '/assets/ai-shoots/services/flat-lay-ai-1.jpeg', alt: 'Pose 1', aspect: '3x4' },
			{ src: '/assets/ai-shoots/services/flat-lay-ai-2.jpeg', alt: 'Pose 2', aspect: '1x1' },
			{ src: '/assets/ai-shoots/services/flat-lay-ai-3.jpeg', alt: 'Pose 3', aspect: '2x3' },
			{ src: '/assets/ai-shoots/services/flat-lay-ai-4.jpeg', alt: 'Pose 4', aspect: '1x1' },
			{ alt: 'Pose 5', aspect: '3x4' },
		],
	},
	{
		id: 'unstitched',
		label: 'Unstitched',
		outputs: placeholderOutputs,
	},
	{
		id: 'three-piece',
		label: '3-Piece',
		outputs: placeholderOutputs,
	},
	{
		id: 'saree',
		label: 'Saree',
		inputMain: '/assets/ai-shoots/services/saree-raw.jpeg',
		outputs: [
			{ src: '/assets/ai-shoots/services/saree-ai-1.jpg', alt: 'Pose 1', aspect: '3x4' },
			{ src: '/assets/ai-shoots/services/saree-ai-2.jpg', alt: 'Pose 2', aspect: '1x1' },
			{ src: '/assets/ai-shoots/services/saree-ai-3.jpg', alt: 'Pose 3', aspect: '2x3' },
			{ src: '/assets/ai-shoots/services/saree-ai-4.jpeg', alt: 'Pose 4', aspect: '1x1' },
			{ alt: 'Pose 5', aspect: '3x4' },
		],
	},
	{
		id: 'menswear',
		label: 'Menswear',
		outputs: placeholderOutputs,
	},
];

// ── Service cards ──
export const serviceCards: ServiceCard[] = [
	{
		title: 'AI Model Generation',
		description:
			"Generate diverse, customizable AI models that match your brand's aesthetic and target audience.",
	},
	{
		title: 'Virtual Photoshoots',
		description:
			'Create unlimited variations of product shots with different poses, lighting, and backgrounds.',
	},
	{
		title: 'Style & Trend Adaptation',
		description:
			'Quickly adapt visuals to seasonal trends, campaigns, and regional preferences without reshoots.',
	},
];
