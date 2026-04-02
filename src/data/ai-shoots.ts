import type {
	HeroImage,
	BrandLogo,
	ServiceCard,
	ShowcaseSlot,
	ShowcaseCategory,
} from '../types/ai-shoots';

export type { HeroImage, BrandLogo, ServiceCard, ShowcaseCategory };

// ── ImageKit helpers ──
import { ik, tr } from '../config/imagekit';

// ── Page constants (from shared config) ──
import { site } from '../config/site';
export const bookingUrl = site.bookingUrl;
export const email = site.email;

// ── Hero image decks ──
export const heroDeckA: HeroImage[] = [
	{
		src: `${ik}/studio/hero/dbj/dbj-01.jpg${tr.hero}`,
		alt: 'Dhwani Bansal Jewelry — earring mirror closeup',
	},
	{
		src: `${ik}/studio/hero/dbj/dbj-02.jpg${tr.hero}`,
		alt: 'Dhwani Bansal Jewelry — gold leaf earring',
	},
	{
		src: `${ik}/studio/hero/dbj/dbj-03.jpg${tr.hero}`,
		alt: 'Dhwani Bansal Jewelry — two models dining',
	},
	{
		src: `${ik}/studio/hero/dbj/dbj-04.jpg${tr.hero}`,
		alt: 'Dhwani Bansal Jewelry — bridal styling',
	},
	{
		src: `${ik}/studio/hero/dbj/dbj-05.jpg${tr.hero}`,
		alt: 'Dhwani Bansal Jewelry — heritage look',
	},
];

export const heroDeckB: HeroImage[] = [
	{
		src: `${ik}/studio/hero/leemboodi/leemboodi-01.jpg${tr.hero}`,
		alt: 'Leemboodi — bandhani saree heritage courtyard',
	},
	{
		src: `${ik}/studio/hero/leemboodi/leemboodi-02.jpg${tr.hero}`,
		alt: 'Leemboodi — colorful saree outdoor',
	},
	{
		src: `${ik}/studio/hero/leemboodi/leemboodi-03.jpg${tr.hero}`,
		alt: 'Leemboodi — white bandhani saree sunset arch',
	},
	{
		src: `${ik}/studio/hero/leemboodi/leemboodi-04.jpg${tr.hero}`,
		alt: 'Leemboodi — saree editorial palace',
	},
	{
		src: `${ik}/studio/hero/leemboodi/leemboodi-05.jpg${tr.hero}`,
		alt: 'Leemboodi — saree detail shot',
	},
];

export const heroDeckC: HeroImage[] = [
	{
		src: `${ik}/studio/hero/soilearth/soilearth-01.jpg${tr.hero}`,
		alt: 'Soil & Earth — product flat-lay oils',
	},
	{
		src: `${ik}/studio/hero/soilearth/soilearth-02.jpg${tr.hero}`,
		alt: 'Soil & Earth — hair oil botanical',
	},
	{
		src: `${ik}/studio/hero/soilearth/soilearth-03.jpg${tr.hero}`,
		alt: 'Soil & Earth — oudhwood soap',
	},
	{
		src: `${ik}/studio/hero/soilearth/soilearth-04.jpg${tr.hero}`,
		alt: 'Soil & Earth — product lifestyle',
	},
	{
		src: `${ik}/studio/hero/soilearth/soilearth-05.jpg${tr.hero}`,
		alt: 'Soil & Earth — skincare range',
	},
];

export const heroDeckD: HeroImage[] = [
	{ src: `${ik}/studio/hero/yufta/yufta-01.jpg${tr.hero}`, alt: 'Yufta — boho print dress model' },
	{ src: `${ik}/studio/hero/yufta/yufta-02.jpg${tr.hero}`, alt: 'Yufta — floral dress studio' },
	{
		src: `${ik}/studio/hero/yufta/yufta-03.jpg${tr.hero}`,
		alt: 'Yufta — print dress walking pose',
	},
	{ src: `${ik}/studio/hero/yufta/yufta-04.jpg${tr.hero}`, alt: 'Yufta — summer dress detail' },
	{ src: `${ik}/studio/hero/yufta/yufta-05.jpg${tr.hero}`, alt: 'Yufta — casual wear studio' },
];

export const heroDecks: HeroImage[][] = [heroDeckD, heroDeckC, heroDeckB, heroDeckA];

// ── Brand logos (marquee) ──
export const brandLogos: BrandLogo[] = [
	{ src: `${ik}/studio/brands/banno.png${tr.logo}`, alt: 'Banno', width: 282, height: 199 },
	{ src: `${ik}/studio/brands/dbj.png${tr.logo}`, alt: 'DBJ', width: 275, height: 168 },
	{ src: `${ik}/studio/brands/ganga.png${tr.logo}`, alt: 'Ganga', width: 307, height: 212 },
	{ src: `${ik}/studio/brands/indo-era.png${tr.logo}`, alt: 'Indo Era', width: 370, height: 223 },
	{ src: `${ik}/studio/brands/janasya.png${tr.logo}`, alt: 'Janasya', width: 260, height: 208 },
	{ src: `${ik}/studio/brands/jugo.png${tr.logo}`, alt: 'Jugo', width: 203, height: 180 },
	{ src: `${ik}/studio/brands/stf.png${tr.logo}`, alt: 'STF', width: 389, height: 162 },
	{
		src: `${ik}/studio/brands/leemboodi.png${tr.logo}`,
		alt: 'Leemboodi',
		width: 1479,
		height: 633,
	},
	{ src: `${ik}/studio/brands/skylee.png${tr.logo}`, alt: 'Skylee', width: 303, height: 143 },
	{ src: `${ik}/studio/brands/xyxx.png${tr.logo}`, alt: 'XYXX', width: 240, height: 151 },
	{ src: `${ik}/studio/brands/yufta.png${tr.logo}`, alt: 'Yufta', width: 253, height: 208 },
];

// ── Showcase categories ──
// Output pattern is always: [3x4, 1x1, 2x3, 1x1, 3x4]
const placeholderOutputs: ShowcaseSlot[] = [
	{ alt: 'AI-generated model pose — full-length front view', aspect: '3x4' },
	{ alt: 'AI-generated model pose — detail crop', aspect: '1x1' },
	{ alt: 'AI-generated model pose — three-quarter angle', aspect: '2x3' },
	{ alt: 'AI-generated model pose — accessory detail', aspect: '1x1' },
	{ alt: 'AI-generated model pose — alternate angle', aspect: '3x4' },
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
		inputMain: `${ik}/studio/services/flat-lay-raw.jpg${tr.showcase}`,
		outputs: [
			{
				src: `${ik}/studio/services/flat-lay-ai-01.jpg${tr.showcase}`,
				alt: 'Flat-lay garment AI output — styled front view',
				aspect: '3x4',
			},
			{
				src: `${ik}/studio/services/flat-lay-ai-02.jpg${tr.showcase}`,
				alt: 'Flat-lay garment AI output — detail crop',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/services/flat-lay-ai-03.jpg${tr.showcase}`,
				alt: 'Flat-lay garment AI output — angled layout',
				aspect: '2x3',
			},
			{
				src: `${ik}/studio/services/flat-lay-ai-04.jpg${tr.showcase}`,
				alt: 'Flat-lay garment AI output — accessory pairing',
				aspect: '1x1',
			},
			{ alt: 'Flat-lay garment AI output — alternate arrangement', aspect: '3x4' },
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
		inputMain: `${ik}/studio/services/saree-raw.jpg${tr.showcase}`,
		outputs: [
			{
				src: `${ik}/studio/services/saree-ai-01.jpg${tr.showcase}`,
				alt: 'Saree AI photoshoot — standing drape pose',
				aspect: '3x4',
			},
			{
				src: `${ik}/studio/services/saree-ai-02.jpg${tr.showcase}`,
				alt: 'Saree AI photoshoot — pallu detail',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/services/saree-ai-03.jpg${tr.showcase}`,
				alt: 'Saree AI photoshoot — side profile',
				aspect: '2x3',
			},
			{
				src: `${ik}/studio/services/saree-ai-04.jpg${tr.showcase}`,
				alt: 'Saree AI photoshoot — border detail',
				aspect: '1x1',
			},
			{ alt: 'Saree AI photoshoot — alternate pose', aspect: '3x4' },
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
