import { ik, tr } from '../config/imagekit';

export interface GalleryItem {
	src: string;
	alt: string;
	type: 'photo' | 'video' | 'ad-creative';
	category: string;
	aspect: '3x4' | '2x3' | '1x1' | '16x9' | '9x16';
	thumb?: string;
}

// Gallery transform — optimized for grid thumbnails
const g = `${tr.showcase}`;

export const galleryItems: GalleryItem[] = [
	// ── Kurta Sets (Yufta) ──
	{
		src: `${ik}/studio/showcase/yufta/yufta-output-01.jpg${g}`,
		alt: 'Kurta set — full-length front view',
		type: 'photo',
		category: 'kurta-sets',
		aspect: '3x4',
	},
	{
		src: `${ik}/studio/showcase/yufta/yufta-output-02.jpg${g}`,
		alt: 'Kurta set — detail crop',
		type: 'photo',
		category: 'kurta-sets',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/yufta/yufta-output-03.jpg${g}`,
		alt: 'Kurta set — three-quarter angle',
		type: 'photo',
		category: 'kurta-sets',
		aspect: '2x3',
	},
	{
		src: `${ik}/studio/showcase/yufta/yufta-output-04.jpg${g}`,
		alt: 'Kurta set — accessory detail',
		type: 'photo',
		category: 'kurta-sets',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/yufta/yufta-output-05.jpg${g}`,
		alt: 'Kurta set — alternate angle',
		type: 'photo',
		category: 'kurta-sets',
		aspect: '3x4',
	},

	// ── Western Wear (Selvia) ──
	{
		src: `${ik}/studio/showcase/selvia/selvia-output-01.jpg${g}`,
		alt: 'Western wear — full-length front view',
		type: 'photo',
		category: 'western-wear',
		aspect: '3x4',
	},
	{
		src: `${ik}/studio/showcase/selvia/selvia-output-02.jpg${g}`,
		alt: 'Western wear — detail crop',
		type: 'photo',
		category: 'western-wear',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/selvia/selvia-output-03.jpg${g}`,
		alt: 'Western wear — three-quarter angle',
		type: 'photo',
		category: 'western-wear',
		aspect: '2x3',
	},
	{
		src: `${ik}/studio/showcase/selvia/selvia-output-04.jpg${g}`,
		alt: 'Western wear — accessory detail',
		type: 'photo',
		category: 'western-wear',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/selvia/selvia-output-05.jpg${g}`,
		alt: 'Western wear — alternate angle',
		type: 'photo',
		category: 'western-wear',
		aspect: '3x4',
	},

	// ── Saree (Rasvidha) ──
	{
		src: `${ik}/studio/showcase/rasvidha/rasvidha-output-01.jpg${g}`,
		alt: 'Saree — standing drape pose',
		type: 'photo',
		category: 'saree',
		aspect: '3x4',
	},
	{
		src: `${ik}/studio/showcase/rasvidha/rasvidha-output-02.jpg${g}`,
		alt: 'Saree — pallu detail',
		type: 'photo',
		category: 'saree',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/rasvidha/rasvidha-output-03.jpg${g}`,
		alt: 'Saree — side profile',
		type: 'photo',
		category: 'saree',
		aspect: '2x3',
	},
	{
		src: `${ik}/studio/showcase/rasvidha/rasvidha-output-04.jpg${g}`,
		alt: 'Saree — border detail',
		type: 'photo',
		category: 'saree',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/rasvidha/rasvidha-output-05.jpg${g}`,
		alt: 'Saree — alternate pose',
		type: 'photo',
		category: 'saree',
		aspect: '3x4',
	},

	// ── Menswear (XYXX) ──
	{
		src: `${ik}/studio/showcase/xyxx/xyxx-output-01.jpg${g}`,
		alt: 'Menswear — full-length front view',
		type: 'photo',
		category: 'menswear',
		aspect: '3x4',
	},
	{
		src: `${ik}/studio/showcase/xyxx/xyxx-output-02.jpg${g}`,
		alt: 'Menswear — detail crop',
		type: 'photo',
		category: 'menswear',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/xyxx/xyxx-output-03.jpg${g}`,
		alt: 'Menswear — three-quarter angle',
		type: 'photo',
		category: 'menswear',
		aspect: '2x3',
	},
	{
		src: `${ik}/studio/showcase/xyxx/xyxx-output-04.jpg${g}`,
		alt: 'Menswear — accessory detail',
		type: 'photo',
		category: 'menswear',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/xyxx/xyxx-output-05.jpg${g}`,
		alt: 'Menswear — alternate angle',
		type: 'photo',
		category: 'menswear',
		aspect: '3x4',
	},

	// ── Jewelry (DBJ) ──
	{
		src: `${ik}/studio/showcase/dbj/dbj-output-05.png${g}`,
		alt: 'Jewelry — necklace editorial',
		type: 'photo',
		category: 'jewelry',
		aspect: '3x4',
	},
	{
		src: `${ik}/studio/showcase/dbj/dbj-output-02.png${g}`,
		alt: 'Jewelry — earring detail',
		type: 'photo',
		category: 'jewelry',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/dbj/dbj-output-03.png${g}`,
		alt: 'Jewelry — set piece',
		type: 'photo',
		category: 'jewelry',
		aspect: '2x3',
	},
	{
		src: `${ik}/studio/showcase/dbj/dbj-output-04.png${g}`,
		alt: 'Jewelry — ring closeup',
		type: 'photo',
		category: 'jewelry',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/dbj/dbj-output-01.png${g}`,
		alt: 'Jewelry — full look',
		type: 'photo',
		category: 'jewelry',
		aspect: '3x4',
	},

	// ── Cosmetics (Thrive) ──
	{
		src: `${ik}/studio/showcase/thrive/thrive-output-01.png${g}`,
		alt: 'Cosmetics — product front view',
		type: 'photo',
		category: 'cosmetics',
		aspect: '3x4',
	},
	{
		src: `${ik}/studio/showcase/thrive/thrive-output-02.png${g}`,
		alt: 'Cosmetics — detail crop',
		type: 'photo',
		category: 'cosmetics',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/thrive/thrive-output-03.png${g}`,
		alt: 'Cosmetics — angled view',
		type: 'photo',
		category: 'cosmetics',
		aspect: '2x3',
	},
	{
		src: `${ik}/studio/showcase/thrive/thrive-output-04.png${g}`,
		alt: 'Cosmetics — lifestyle detail',
		type: 'photo',
		category: 'cosmetics',
		aspect: '1x1',
	},
	{
		src: `${ik}/studio/showcase/thrive/thrive-output-05.png${g}`,
		alt: 'Cosmetics — alternate angle',
		type: 'photo',
		category: 'cosmetics',
		aspect: '3x4',
	},

	// ── Hero / editorial shots (mixed brands) ──
	{
		src: `${ik}/studio/hero/dbj/dbj-01.jpg${g}`,
		alt: 'Jewelry editorial — earring mirror closeup',
		type: 'photo',
		category: 'jewelry',
		aspect: '3x4',
	},
	{
		src: `${ik}/studio/hero/leemboodi/leemboodi-01.jpg${g}`,
		alt: 'Saree editorial — bandhani heritage courtyard',
		type: 'photo',
		category: 'saree',
		aspect: '3x4',
	},
	{
		src: `${ik}/studio/hero/leemboodi/leemboodi-03.jpg${g}`,
		alt: 'Saree editorial — white bandhani sunset arch',
		type: 'photo',
		category: 'saree',
		aspect: '3x4',
	},
	{
		src: `${ik}/studio/hero/yufta/yufta-01.jpg${g}`,
		alt: 'Kurta editorial — boho print dress model',
		type: 'photo',
		category: 'kurta-sets',
		aspect: '3x4',
	},
	{
		src: `${ik}/studio/hero/soilearth/soilearth-01.jpg${g}`,
		alt: 'Product photography — oils flat-lay',
		type: 'photo',
		category: 'cosmetics',
		aspect: '3x4',
	},
];

// Unique categories for filter UI
export const galleryCategories = [
	{ id: 'all', label: 'All' },
	{ id: 'kurta-sets', label: 'Kurta Sets' },
	{ id: 'western-wear', label: 'Western Wear' },
	{ id: 'saree', label: 'Saree' },
	{ id: 'menswear', label: 'Menswear' },
	{ id: 'jewelry', label: 'Jewelry' },
	{ id: 'cosmetics', label: 'Cosmetics' },
];

export const galleryTypes = [
	{ id: 'all', label: 'All' },
	{ id: 'photo', label: 'Photos' },
	{ id: 'video', label: 'Videos' },
	{ id: 'ad-creative', label: 'Ad Creatives' },
];
