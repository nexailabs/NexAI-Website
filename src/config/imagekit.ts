export const ik = 'https://ik.imagekit.io/nexailabs';

export const tr = {
	hero: '?tr=w-600,h-800,fo-auto,f-auto,q-80',
	showcase: '?tr=w-800,f-auto,q-80',
	thumb: '?tr=w-150,h-200,fo-auto,f-auto,q-60',
	logo: '?tr=h-80,f-auto,q-80',
	ctaFloat: '?tr=w-280,h-370,fo-auto,f-auto,q-75',
	processCard: '?tr=w-500,h-660,fo-auto,f-auto,q-80',
	og: '?tr=w-1200,h-630,fo-auto,f-auto,q-85',
	full: '?tr=f-auto,q-85',
	appLogo: '?tr=w-96,h-96,fo-auto,f-auto,q-80',
	appLogo2x: '?tr=w-192,h-192,fo-auto,f-auto,q-80',
	appShot: '?tr=w-1200,h-675,f-auto,q-80',
} as const;

/** Strip any ?tr= query string from an ImageKit URL */
export const stripTr = (url: string) => url.replace(/\?tr=.*$/, '');

/** Build responsive srcset for showcase images (400w / 800w / 1200w) */
export const showcaseSrcset = (url: string) => {
	const base = stripTr(url);
	return [
		`${base}?tr=w-400,f-auto,q-80 400w`,
		`${base}?tr=w-800,f-auto,q-80 800w`,
		`${base}?tr=w-1200,f-auto,q-80 1200w`,
	].join(', ');
};
