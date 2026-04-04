import type { HeroImage, BrandLogo, ServiceCard, ShowcaseCategory } from '../types/studio';

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
	{
		src: `${ik}/studio/brands/banno.png${tr.logo}`,
		alt: 'Banno',
		width: 282,
		height: 199,
		scale: 0.9,
	},
	{ src: `${ik}/studio/brands/dbj.png${tr.logo}`, alt: 'DBJ', width: 275, height: 168 },
	{ src: `${ik}/studio/brands/ganga.png${tr.logo}`, alt: 'Ganga', width: 307, height: 212 },
	{
		src: `${ik}/studio/brands/indo-era.png${tr.logo}`,
		alt: 'Indo Era',
		width: 370,
		height: 223,
		scale: 0.9,
	},
	{
		src: `${ik}/studio/brands/janasya.png${tr.logo}`,
		alt: 'Janasya',
		width: 260,
		height: 208,
		scale: 1.1,
	},
	{
		src: `${ik}/studio/brands/jugo.png${tr.logo}`,
		alt: 'Jugo',
		width: 203,
		height: 180,
		scale: 0.9,
		offsetY: '0.15rem',
	},
	{ src: `${ik}/studio/brands/stf.png${tr.logo}`, alt: 'STF', width: 389, height: 162, scale: 0.9 },
	{
		src: `${ik}/studio/brands/leemboodi.png${tr.logo}`,
		alt: 'Leemboodi',
		width: 1479,
		height: 633,
		scale: 0.8,
		offsetY: '0.3rem',
	},
	{
		src: `${ik}/studio/brands/skylee.png${tr.logo}`,
		alt: 'Skylee',
		width: 303,
		height: 143,
		scale: 0.7,
		offsetY: '0.15rem',
	},
	{ src: `${ik}/studio/brands/xyxx.png${tr.logo}`, alt: 'XYXX', width: 240, height: 151 },
	{
		src: `${ik}/studio/brands/yufta.png${tr.logo}`,
		alt: 'Yufta',
		width: 253,
		height: 208,
		offsetY: '-0.15rem',
	},
];

// ── Showcase categories ──
// Output aspect pattern: [3x4, 1x1, 2x3, 1x1, 3x4]
export const showcaseCategories: ShowcaseCategory[] = [
	{
		id: 'kurta-sets',
		label: 'Kurta Sets',
		inputMain: `${ik}/studio/showcase/yufta/yufta-input-01.jpg${tr.showcase}`,
		inputSideTop: `${ik}/studio/showcase/yufta/yufta-input-02.jpg${tr.showcase}`,
		inputSideBottom: `${ik}/studio/showcase/yufta/yufta-input-03.jpg${tr.showcase}`,
		outputs: [
			{
				src: `${ik}/studio/showcase/yufta/yufta-output-01.jpg${tr.showcase}`,
				alt: 'Kurta set AI output — full-length front view',
				aspect: '3x4',
			},
			{
				src: `${ik}/studio/showcase/yufta/yufta-output-02.jpg${tr.showcase}`,
				alt: 'Kurta set AI output — detail crop',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/yufta/yufta-output-03.jpg${tr.showcase}`,
				alt: 'Kurta set AI output — three-quarter angle',
				aspect: '2x3',
			},
			{
				src: `${ik}/studio/showcase/yufta/yufta-output-04.jpg${tr.showcase}`,
				alt: 'Kurta set AI output — accessory detail',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/yufta/yufta-output-05.jpg${tr.showcase}`,
				alt: 'Kurta set AI output — alternate angle',
				aspect: '3x4',
			},
		],
	},
	{
		id: 'western-wear',
		label: 'Western Wear',
		inputMain: `${ik}/studio/showcase/selvia/selvia-input-01.jpg${tr.showcase}`,
		outputs: [
			{
				src: `${ik}/studio/showcase/selvia/selvia-output-01.jpg${tr.showcase}`,
				alt: 'Western wear AI output — full-length front view',
				aspect: '3x4',
			},
			{
				src: `${ik}/studio/showcase/selvia/selvia-output-02.jpg${tr.showcase}`,
				alt: 'Western wear AI output — detail crop',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/selvia/selvia-output-03.jpg${tr.showcase}`,
				alt: 'Western wear AI output — three-quarter angle',
				aspect: '2x3',
			},
			{
				src: `${ik}/studio/showcase/selvia/selvia-output-04.jpg${tr.showcase}`,
				alt: 'Western wear AI output — accessory detail',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/selvia/selvia-output-05.jpg${tr.showcase}`,
				alt: 'Western wear AI output — alternate angle',
				aspect: '3x4',
			},
		],
	},
	{
		id: 'saree',
		label: 'Saree',
		inputMain: `${ik}/studio/showcase/rasvidha/rasvidha-input-01.jpg${tr.showcase}`,
		outputs: [
			{
				src: `${ik}/studio/showcase/rasvidha/rasvidha-output-01.jpg${tr.showcase}`,
				alt: 'Saree AI output — standing drape pose',
				aspect: '3x4',
			},
			{
				src: `${ik}/studio/showcase/rasvidha/rasvidha-output-02.jpg${tr.showcase}`,
				alt: 'Saree AI output — pallu detail',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/rasvidha/rasvidha-output-03.jpg${tr.showcase}`,
				alt: 'Saree AI output — side profile',
				aspect: '2x3',
			},
			{
				src: `${ik}/studio/showcase/rasvidha/rasvidha-output-04.jpg${tr.showcase}`,
				alt: 'Saree AI output — border detail',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/rasvidha/rasvidha-output-05.jpg${tr.showcase}`,
				alt: 'Saree AI output — alternate pose',
				aspect: '3x4',
			},
		],
	},
	{
		id: 'menswear',
		label: 'Menswear',
		inputMain: `${ik}/studio/showcase/xyxx/xyxx-input-01.png${tr.showcase}`,
		outputs: [
			{
				src: `${ik}/studio/showcase/xyxx/xyxx-output-01.jpg${tr.showcase}`,
				alt: 'Menswear AI output — full-length front view',
				aspect: '3x4',
			},
			{
				src: `${ik}/studio/showcase/xyxx/xyxx-output-02.jpg${tr.showcase}`,
				alt: 'Menswear AI output — detail crop',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/xyxx/xyxx-output-03.jpg${tr.showcase}`,
				alt: 'Menswear AI output — three-quarter angle',
				aspect: '2x3',
			},
			{
				src: `${ik}/studio/showcase/xyxx/xyxx-output-04.jpg${tr.showcase}`,
				alt: 'Menswear AI output — accessory detail',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/xyxx/xyxx-output-05.jpg${tr.showcase}`,
				alt: 'Menswear AI output — alternate angle',
				aspect: '3x4',
			},
		],
	},
	{
		id: 'jewelry',
		label: 'Jewelry',
		inputMain: `${ik}/studio/showcase/dbj/dbj-output-01.png${tr.showcase}`,
		outputs: [
			{
				src: `${ik}/studio/showcase/dbj/dbj-output-05.png${tr.showcase}`,
				alt: 'Jewelry AI output — alternate angle',
				aspect: '3x4',
			},
			{
				src: `${ik}/studio/showcase/dbj/dbj-output-02.png${tr.showcase}`,
				alt: 'Jewelry AI output — detail crop',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/dbj/dbj-output-03.png${tr.showcase}`,
				alt: 'Jewelry AI output — three-quarter angle',
				aspect: '2x3',
			},
			{
				src: `${ik}/studio/showcase/dbj/dbj-output-04.png${tr.showcase}`,
				alt: 'Jewelry AI output — accessory detail',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/dbj/dbj-output-01.png${tr.showcase}`,
				alt: 'Jewelry AI output — full-length front view',
				aspect: '3x4',
			},
		],
	},
	{
		id: 'cosmetics',
		label: 'Cosmetics',
		inputMain: `${ik}/studio/showcase/thrive/thrive-input-01.jpg${tr.showcase}`,
		outputs: [
			{
				src: `${ik}/studio/showcase/thrive/thrive-output-01.png${tr.showcase}`,
				alt: 'Cosmetics AI output — product front view',
				aspect: '3x4',
			},
			{
				src: `${ik}/studio/showcase/thrive/thrive-output-02.png${tr.showcase}`,
				alt: 'Cosmetics AI output — detail crop',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/thrive/thrive-output-03.png${tr.showcase}`,
				alt: 'Cosmetics AI output — angled view',
				aspect: '2x3',
			},
			{
				src: `${ik}/studio/showcase/thrive/thrive-output-04.png${tr.showcase}`,
				alt: 'Cosmetics AI output — lifestyle detail',
				aspect: '1x1',
			},
			{
				src: `${ik}/studio/showcase/thrive/thrive-output-05.png${tr.showcase}`,
				alt: 'Cosmetics AI output — alternate angle',
				aspect: '3x4',
			},
		],
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
