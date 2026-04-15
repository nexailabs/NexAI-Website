import { APP_CATEGORIES, APP_PLATFORMS, APP_PRICING, APP_TAGS, apps } from './app-vault';

const categorySet = new Set(APP_CATEGORIES);
const pricingSet = new Set(APP_PRICING);
const platformSet = new Set(APP_PLATFORMS);
const tagSet = new Set(APP_TAGS);
const slugSet = new Set<string>();

for (const app of apps) {
	if (slugSet.has(app.slug)) {
		throw new Error(`Duplicate app slug detected: ${app.slug}`);
	}
	slugSet.add(app.slug);

	if (app.tagline.length > 60) {
		throw new Error(`Tagline too long for ${app.slug}. Max 60 characters.`);
	}

	if (app.description.length > 180) {
		throw new Error(`Description too long for ${app.slug}. Max 180 characters.`);
	}

	if (!categorySet.has(app.category)) {
		throw new Error(`Invalid category for ${app.slug}: ${app.category}`);
	}

	if (!pricingSet.has(app.pricing)) {
		throw new Error(`Invalid pricing for ${app.slug}: ${app.pricing}`);
	}

	for (const platform of app.platforms) {
		if (!platformSet.has(platform)) {
			throw new Error(`Invalid platform for ${app.slug}: ${platform}`);
		}
	}

	for (const tag of app.tags) {
		if (!tagSet.has(tag)) {
			throw new Error(`Invalid tag for ${app.slug}: ${tag}`);
		}
	}

	if (!app.logo) {
		throw new Error(`Missing logo for ${app.slug}`);
	}
}
