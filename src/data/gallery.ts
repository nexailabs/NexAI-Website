import { ik } from '../config/imagekit';
import { generatedGalleryItems } from './gallery-items.generated';

export type Category = 'apparel' | 'jewelry' | 'cosmetics' | 'accessories';

export type Subcategory =
	| 'saree'
	| 'ethnic-wear'
	| 'kurta-set'
	| 'western-dress'
	| 'western-top'
	| 'western-bottom'
	| 'western-wear'
	| 'co-ord-set'
	| 'nightsuit'
	| 'innerwear'
	| 'earring'
	| 'necklace'
	| 'bracelet'
	| 'ring'
	| 'jewelry-set'
	| 'lipstick'
	| 'fragrance'
	| 'skincare'
	| 'bag'
	| 'belt'
	| 'sunglasses';

export type CreativeType = 'pdp' | 'ad' | 'banner' | 'video' | 'ugc' | 'lifestyle' | 'flat-lay';

export type Aspect = 'portrait' | 'landscape' | 'square';

export interface GalleryItem {
	src: string;
	alt: string;
	brand: string;
	category: Category;
	subcategory: Subcategory;
	type: CreativeType;
	aspect: Aspect;
}

/** Brand slug → display label (used by the Brand filter dropdown). */
export const brandLabels: Record<string, string> = {
	'banno-swagger': 'Banno Swagger',
	dbj: 'Dhwani Bansal Jewelry',
	indoera: 'Indoera',
	leemboodi: 'Leemboodi',
	muwin: 'Muwin',
	rasvidha: 'Rasvidha',
	selvia: 'Selvia',
	skylee: 'Skylee',
	soie: 'Soie',
	soilearth: 'Soil & Earth',
	thrive: 'Thrive',
	'xeba-botanica': 'XEBA Botanica',
	xyxx: 'XYXX',
	yufta: 'Yufta',
};

/** Cascade map: which subcategories belong to which top-level category. */
export const subcategoryByCategory: Record<Category, Subcategory[]> = {
	apparel: [
		'saree',
		'ethnic-wear',
		'kurta-set',
		'western-dress',
		'western-top',
		'western-bottom',
		'western-wear',
		'co-ord-set',
		'nightsuit',
		'innerwear',
	],
	jewelry: ['earring', 'necklace', 'bracelet', 'ring', 'jewelry-set'],
	cosmetics: ['skincare', 'fragrance', 'lipstick'],
	accessories: ['bag', 'belt', 'sunglasses'],
};

export const subcategoryLabels: Record<Subcategory, string> = {
	saree: 'Saree',
	'ethnic-wear': 'Ethnic Wear',
	'kurta-set': 'Kurta Set',
	'western-dress': 'Western Dress',
	'western-top': 'Western Top',
	'western-bottom': 'Western Bottom',
	'western-wear': 'Western Wear',
	'co-ord-set': 'Co-ord Set',
	nightsuit: 'Nightsuit',
	innerwear: 'Innerwear',
	earring: 'Earring',
	necklace: 'Necklace',
	bracelet: 'Bracelet',
	ring: 'Ring',
	'jewelry-set': 'Jewelry Set',
	lipstick: 'Lipstick',
	fragrance: 'Fragrance',
	skincare: 'Skincare',
	bag: 'Bag',
	belt: 'Belt',
	sunglasses: 'Sunglasses',
};

export const categoryLabels: Record<Category, string> = {
	apparel: 'Apparel',
	jewelry: 'Jewelry',
	cosmetics: 'Cosmetics',
	accessories: 'Accessories',
};

export const typeLabels: Record<CreativeType, string> = {
	pdp: 'PDP',
	ad: 'Ad',
	banner: 'Banner',
	video: 'Video',
	ugc: 'UGC',
	lifestyle: 'Lifestyle',
	'flat-lay': 'Flat Lay',
};

/**
 * 30 hand-curated items live at /studio/showcase/* and /studio/hero/* (existing
 * URLs, not touched by the gallery upload pipeline). Migrated from the old
 * 2-axis schema (type/category) to the 4-axis schema below.
 */
const legacyGalleryItems: GalleryItem[] = [
	// ── Yufta showcase ──
	{
		src: `${ik}/studio/showcase/yufta/yufta-output-01.jpg`,
		alt: 'Kurta set, full-length front view',
		brand: 'yufta',
		category: 'apparel',
		subcategory: 'kurta-set',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/yufta/yufta-output-02.jpg`,
		alt: 'Kurta set, detail crop',
		brand: 'yufta',
		category: 'apparel',
		subcategory: 'kurta-set',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/yufta/yufta-output-03.jpg`,
		alt: 'Kurta set, three-quarter angle',
		brand: 'yufta',
		category: 'apparel',
		subcategory: 'kurta-set',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/yufta/yufta-output-04.jpg`,
		alt: 'Kurta set, accessory detail',
		brand: 'yufta',
		category: 'apparel',
		subcategory: 'kurta-set',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/yufta/yufta-output-05.jpg`,
		alt: 'Kurta set, alternate angle',
		brand: 'yufta',
		category: 'apparel',
		subcategory: 'kurta-set',
		type: 'pdp',
		aspect: 'portrait',
	},

	// ── Selvia showcase ──
	{
		src: `${ik}/studio/showcase/selvia/selvia-output-01.jpg`,
		alt: 'Western wear, full-length front view',
		brand: 'selvia',
		category: 'apparel',
		subcategory: 'western-dress',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/selvia/selvia-output-02.jpg`,
		alt: 'Western wear, detail crop',
		brand: 'selvia',
		category: 'apparel',
		subcategory: 'western-dress',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/selvia/selvia-output-03.jpg`,
		alt: 'Western wear, three-quarter angle',
		brand: 'selvia',
		category: 'apparel',
		subcategory: 'western-dress',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/selvia/selvia-output-04.jpg`,
		alt: 'Western wear, accessory detail',
		brand: 'selvia',
		category: 'apparel',
		subcategory: 'western-dress',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/selvia/selvia-output-05.jpg`,
		alt: 'Western wear, alternate angle',
		brand: 'selvia',
		category: 'apparel',
		subcategory: 'western-dress',
		type: 'pdp',
		aspect: 'portrait',
	},

	// ── Rasvidha showcase ──
	{
		src: `${ik}/studio/showcase/rasvidha/rasvidha-output-01.jpg`,
		alt: 'Saree, standing drape pose',
		brand: 'rasvidha',
		category: 'apparel',
		subcategory: 'saree',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/rasvidha/rasvidha-output-02.jpg`,
		alt: 'Saree, pallu detail',
		brand: 'rasvidha',
		category: 'apparel',
		subcategory: 'saree',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/rasvidha/rasvidha-output-03.jpg`,
		alt: 'Saree, side profile',
		brand: 'rasvidha',
		category: 'apparel',
		subcategory: 'saree',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/rasvidha/rasvidha-output-04.jpg`,
		alt: 'Saree, border detail',
		brand: 'rasvidha',
		category: 'apparel',
		subcategory: 'saree',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/rasvidha/rasvidha-output-05.jpg`,
		alt: 'Saree, alternate pose',
		brand: 'rasvidha',
		category: 'apparel',
		subcategory: 'saree',
		type: 'pdp',
		aspect: 'portrait',
	},

	// ── XYXX showcase (innerwear / loungewear) ──
	{
		src: `${ik}/studio/showcase/xyxx/xyxx-output-01.jpg`,
		alt: 'Menswear, full-length front view',
		brand: 'xyxx',
		category: 'apparel',
		subcategory: 'innerwear',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/xyxx/xyxx-output-02.jpg`,
		alt: 'Menswear, detail crop',
		brand: 'xyxx',
		category: 'apparel',
		subcategory: 'innerwear',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/xyxx/xyxx-output-03.jpg`,
		alt: 'Menswear, three-quarter angle',
		brand: 'xyxx',
		category: 'apparel',
		subcategory: 'innerwear',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/xyxx/xyxx-output-04.jpg`,
		alt: 'Menswear, accessory detail',
		brand: 'xyxx',
		category: 'apparel',
		subcategory: 'innerwear',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/xyxx/xyxx-output-05.jpg`,
		alt: 'Menswear, alternate angle',
		brand: 'xyxx',
		category: 'apparel',
		subcategory: 'innerwear',
		type: 'pdp',
		aspect: 'portrait',
	},

	// ── DBJ showcase (jewelry) ──
	{
		src: `${ik}/studio/showcase/dbj/dbj-output-05.png`,
		alt: 'Jewelry, necklace editorial',
		brand: 'dbj',
		category: 'jewelry',
		subcategory: 'necklace',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/dbj/dbj-output-02.png`,
		alt: 'Jewelry, earring detail',
		brand: 'dbj',
		category: 'jewelry',
		subcategory: 'earring',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/dbj/dbj-output-03.png`,
		alt: 'Jewelry, set piece',
		brand: 'dbj',
		category: 'jewelry',
		subcategory: 'jewelry-set',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/dbj/dbj-output-04.png`,
		alt: 'Jewelry, ring closeup',
		brand: 'dbj',
		category: 'jewelry',
		subcategory: 'ring',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/dbj/dbj-output-01.png`,
		alt: 'Jewelry, full look',
		brand: 'dbj',
		category: 'jewelry',
		subcategory: 'necklace',
		type: 'pdp',
		aspect: 'portrait',
	},

	// ── Thrive showcase (cosmetics) ──
	{
		src: `${ik}/studio/showcase/thrive/thrive-output-01.png`,
		alt: 'Cosmetics, product front view',
		brand: 'thrive',
		category: 'cosmetics',
		subcategory: 'skincare',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/thrive/thrive-output-02.png`,
		alt: 'Cosmetics, detail crop',
		brand: 'thrive',
		category: 'cosmetics',
		subcategory: 'skincare',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/thrive/thrive-output-03.png`,
		alt: 'Cosmetics, angled view',
		brand: 'thrive',
		category: 'cosmetics',
		subcategory: 'skincare',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/thrive/thrive-output-04.png`,
		alt: 'Cosmetics, lifestyle detail',
		brand: 'thrive',
		category: 'cosmetics',
		subcategory: 'skincare',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/showcase/thrive/thrive-output-05.png`,
		alt: 'Cosmetics, alternate angle',
		brand: 'thrive',
		category: 'cosmetics',
		subcategory: 'skincare',
		type: 'pdp',
		aspect: 'portrait',
	},

	// ── Hero / editorial shots ──
	{
		src: `${ik}/studio/hero/dbj/dbj-01.jpg`,
		alt: 'Jewelry editorial, earring mirror closeup',
		brand: 'dbj',
		category: 'jewelry',
		subcategory: 'earring',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/hero/leemboodi/leemboodi-01.jpg`,
		alt: 'Saree editorial, bandhani heritage courtyard',
		brand: 'leemboodi',
		category: 'apparel',
		subcategory: 'saree',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/hero/leemboodi/leemboodi-03.jpg`,
		alt: 'Saree editorial, white bandhani sunset arch',
		brand: 'leemboodi',
		category: 'apparel',
		subcategory: 'saree',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/hero/yufta/yufta-01.jpg`,
		alt: 'Kurta editorial, boho print dress model',
		brand: 'yufta',
		category: 'apparel',
		subcategory: 'kurta-set',
		type: 'pdp',
		aspect: 'portrait',
	},
	{
		src: `${ik}/studio/hero/soilearth/soilearth-01.jpg`,
		alt: 'Skincare, oils flat-lay',
		brand: 'soilearth',
		category: 'cosmetics',
		subcategory: 'skincare',
		type: 'flat-lay',
		aspect: 'portrait',
	},
];

export const galleryItems: GalleryItem[] = [...legacyGalleryItems, ...generatedGalleryItems];

/** Brands that actually appear in gallery data, sorted by display label. */
export const galleryBrands: Array<{ slug: string; label: string }> = (() => {
	const slugs = new Set<string>();
	for (const item of galleryItems) slugs.add(item.brand);
	return Array.from(slugs)
		.map((slug) => ({ slug, label: brandLabels[slug] ?? slug }))
		.sort((a, b) => a.label.localeCompare(b.label));
})();

/** Categories that actually appear in gallery data, in canonical order. */
export const galleryCategories: Category[] = (() => {
	const present = new Set<Category>();
	for (const item of galleryItems) present.add(item.category);
	return (['apparel', 'jewelry', 'cosmetics', 'accessories'] as const).filter((c) =>
		present.has(c),
	);
})();

/** Creative types that actually appear in gallery data, in canonical order. */
export const galleryTypes: CreativeType[] = (() => {
	const present = new Set<CreativeType>();
	for (const item of galleryItems) present.add(item.type);
	return (['pdp', 'ad', 'banner', 'video', 'ugc', 'lifestyle', 'flat-lay'] as const).filter((t) =>
		present.has(t),
	);
})();
