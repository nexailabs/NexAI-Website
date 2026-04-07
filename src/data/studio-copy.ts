import type { ProcessStep, FAQItem } from '../types/studio';
import { ik, tr } from '../config/imagekit';

// ── Process steps ──
export const processSteps: ProcessStep[] = [
	{
		title: 'Product Images',
		description:
			'Share your product photos — mannequin, flat-lay, or ghost. Whatever you already have.',
		image: `${ik}/studio/showcase/yufta/yufta-input-01.jpg${tr.processCard}`,
	},
	{
		title: 'We Handle the Prep',
		description:
			'Our team cleans backgrounds, stitches the garment, and builds the model map. You do nothing.',
		image: `${ik}/studio/showcase/yufta/yufta-input-02.jpg${tr.processCard}`,
	},
	{
		title: 'AI Generates Your Shoot',
		description:
			'Models, poses, and scenes matched to your brand. Skin tones, body types, and backdrops to your brief.',
		image: `${ik}/studio/showcase/yufta/yufta-output-03.jpg${tr.processCard}`,
	},
	{
		title: "QA'd and Delivered",
		description:
			'Every image reviewed by our team, retouched if needed, and delivered ready to publish on Myntra, Amazon, or your Shopify store.',
		image: `${ik}/studio/showcase/yufta/yufta-output-01.jpg${tr.processCard}`,
	},
];

// ── FAQ items ──
export const faqItems: FAQItem[] = [
	{
		question: 'Will my product actually look right — or will AI mess up the fabric and details?',
		answer:
			"This is the #1 concern we hear, and honestly, it should be. Most AI tools butcher prints and textures. Ours doesn't — we've trained specifically on fashion. You'll review samples before we deliver anything, and if something's off, we regenerate it.",
	},
	{
		question: 'How fast can I get my images?',
		answer:
			"3–5 business days for most shoots. Running a flash sale or have a launch deadline? Tell us when you book and we'll fast-track it.",
	},
	{
		question: 'What do I need to send you?',
		answer:
			"Whatever you already have — mannequin shots, flat-lays, ghost photos, even your manufacturer's basic images. If it's clean enough to list on a marketplace, it's good enough for us.",
	},
	{
		question: 'Can I pick the model, skin tone, pose, and vibe?',
		answer:
			"Absolutely. You tell us the look — age range, skin tone, body type, poses, even the backdrop mood. We don't do cookie-cutter. Every shoot is generated to your brief.",
	},
	{
		question: 'Do I own the images? Any usage restrictions?',
		answer:
			'100% yours. Full commercial rights, no strings. Use them on Myntra, Amazon, your D2C site, Instagram ads — wherever you want, forever.',
	},
	{
		question: 'Will these work on Myntra, Amazon, and Flipkart?',
		answer:
			'Yes — every image meets marketplace quality standards. Correct aspect ratios, clean backgrounds, model-on-white or lifestyle options. Brands using NexAI Studio are live on all major platforms.',
	},
	{
		question: 'How does pricing work?',
		answer:
			'It depends on your volume and category mix — per product or per look. The easiest way to get a number is the free 15-min call. No pitch deck, just straight answers.',
	},
	{
		question: 'We tried AI tools before and they looked terrible. Why is this different?',
		answer:
			"Because those were tools. This is a service. You don't write prompts or fiddle with settings — our team handles the brief, the generation, the QA, and the delivery. Think of it as a studio that happens to use AI, not an AI app pretending to be a studio.",
		featured: true,
	},
];
