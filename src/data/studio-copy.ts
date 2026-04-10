import type { ProcessStep, FAQItem } from '../types/studio';
import { ik, tr } from '../config/imagekit';

// ── Process steps ──
export const processSteps: ProcessStep[] = [
	{
		title: 'Product Images',
		description:
			'Share your product photos. Mannequin, flat-lay, or ghost. Whatever you already have.',
		image: `${ik}/studio/process/process-step-01_4RnkoqGsG.jpg${tr.processCard}`,
	},
	{
		title: 'We Handle the Prep',
		description:
			'Our team cleans backgrounds, stitches the garment, and builds the model map. You do nothing.',
		image: `${ik}/studio/process/process-step-02_iY6opvF1XF.png${tr.processCard}`,
	},
	{
		title: 'AI Generates Your Shoot',
		description:
			'Models, poses, scenes - everything matched to your brand. Whatever skin tones, body types, and vibes you need.',
		image: `${ik}/studio/process/process-step-03_ymkrNwZ6q.png${tr.processCard}`,
	},
	{
		title: "QA'd and Delivered",
		description:
			'Our team reviews every shot, touches it up if needed, then ships it ready for Myntra, Amazon, or your Shopify.',
		image: `${ik}/studio/process/process-step-04_vaZPFI6ugn.png${tr.processCard}`,
	},
];

// ── FAQ items ──
export const faqItems: FAQItem[] = [
	{
		question: 'Will my product actually look right, or will AI mess up the fabric and details?',
		answer:
			"This is the #1 concern we hear, and honestly, it should be. Most AI tools butcher prints and textures. Ours doesn't. We're built for fashion fabric, not generic images. You'll review samples before we deliver anything, and if something's off, we regenerate it.",
	},
	{
		question: 'How fast can I get my images?',
		answer:
			"3-5 business days for most shoots. Running a flash sale or have a launch deadline? Tell us when you book and we'll fast-track it.",
	},
	{
		question: 'What do I need to send you?',
		answer:
			"Whatever you already have. Mannequin shots, flat-lays, ghost photos, even your manufacturer's basic images. If it's clean enough to list on a marketplace, it's good enough for us.",
	},
	{
		question: 'Can I pick the model, skin tone, pose, and vibe?',
		answer:
			'Absolutely. Tell us the vibe: age range, skin tone, body type, poses, backdrop mood. No templates here. We generate to your exact brief.',
	},
	{
		question: 'Do I own the images? Any usage restrictions?',
		answer:
			'100% yours. Full commercial rights, no strings. Use them on Myntra, Amazon, your D2C site, Instagram ads, wherever you want, forever.',
	},
	{
		question: 'Will these work on Myntra, Amazon, and Flipkart?',
		answer:
			'Yes. Every image hits marketplace specs: right ratios, clean backgrounds, model-on-white or lifestyle. Brands using NexAI Studio are live on all major platforms.',
	},
	{
		question: 'How does pricing work?',
		answer:
			'Depends on your volume and category mix. Per product or per look. The easiest way to get a number is the free 15-min call. No pitch deck, just straight answers.',
	},
	{
		question: 'We tried AI tools before and they looked terrible. Why is this different?',
		answer:
			"Because those were tools. This is a service. You don't write prompts or fiddle with settings. Our team handles your brief, runs the shoot, reviews it, and sends it over. Think of it as a real studio that happens to use AI, not an AI app pretending to be one.",
		featured: true,
	},
];
