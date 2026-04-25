export type ArtifactType = 'prompt' | 'sop' | 'skill';

export interface Author {
	name: string;
	role: string;
	initials: string;
	since: string;
}

export interface PromptVariant {
	slug: string;
	label: string;
}

export interface PromptBody {
	h2: string;
	body: string;
}

export interface PromptArtifact {
	slug: string;
	type: 'prompt';
	title: string;
	accent: string;
	category: string;
	description: string;
	author: Author;
	uses: number;
	pinned: boolean;
	price: number;
	model: string;
	when: string;
	prompt: string;
	testedOn: string[];
	variants: PromptVariant[];
	failureMode: string;
	howWeUseIt: PromptBody[];
}

export interface SopStep {
	n: number;
	title: string;
	subtitle: string;
	body: string;
	snippet?: string;
}

export interface SopArtifact {
	slug: string;
	type: 'sop';
	title: string;
	accent: string;
	category: string;
	description: string;
	author: Author;
	uses: number;
	pinned: boolean;
	price: number;
	duration: string;
	inputs: string[];
	steps: SopStep[];
	outcomes: string[];
	failureMode: string;
}

export interface SkillFile {
	path: string;
	kind: 'doc' | 'folder' | 'sh';
	size?: string;
}

export interface SkillInstallMethod {
	tab: string;
	cmd: string;
}

export interface SkillCloudAgent {
	name: string;
	cost: string;
	recommended: boolean;
}

export interface SkillArtifact {
	slug: string;
	type: 'skill';
	title: string;
	accent: string;
	category: string;
	description: string;
	author: Author;
	uses: number;
	pinned: boolean;
	price: number;
	stars: number;
	runtime: string;
	comment: string;
	files: SkillFile[];
	skillMd: string;
	installMethods: SkillInstallMethod[];
	cloudAgents: SkillCloudAgent[];
	usedFor: string[];
}

export type Artifact = PromptArtifact | SopArtifact | SkillArtifact;

export const PROMPT_CATEGORIES = [
	'Outreach',
	'Strategy',
	'Research',
	'Finance',
	'Creatives',
	'Coding',
	'Ops',
] as const;

export const ARTIFACTS: Artifact[] = [
	{
		slug: 'signal-cold-one-liner',
		type: 'prompt',
		title: 'Signal-driven cold one-liner.',
		accent: 'cold',
		category: 'Outreach',
		description:
			'Reads a fresh signal (raised, hired, shipped) and writes one cold-message line that references it. The hardest part of cold outreach in 4 lines.',
		author: { name: 'Rahul Juneja', role: 'Co-founder', initials: 'RJ', since: 'Sep 2024' },
		uses: 8000,
		pinned: true,
		price: 0,
		model: 'Claude Opus 4.7',
		when: 'Use this every morning on a list of 20–50 fresh signals. The output is a single sentence you paste into the first line of an email or LinkedIn DM. Anything longer becomes a pitch and dies.',
		prompt: `You are an outbound copywriter for a B2B agency. Your only job is to write ONE sentence that proves we read about {{TARGET_NAME}} at {{COMPANY}} before we wrote.

The signal we noticed:
{{SIGNAL}}

Constraints:
— One sentence. Maximum 22 words.
— Reference the signal by its specific noun (a person, a number, a product), not by its category.
— No "congrats", "noticed", "saw that", "wanted to reach out".
— Do not pitch. Do not name our company. Do not ask for a meeting.
— Tone: a peer noticing something interesting, not a vendor angling for time.

Output exactly the sentence. No preamble. No quotes.`,
		testedOn: ['Claude Opus 4.7', 'Claude Sonnet 4.6', 'GPT-5'],
		variants: [
			{ slug: 'cold-one-liner-event', label: 'Event-trigger variant' },
			{ slug: 'cold-one-liner-warm', label: 'Warm-intro variant' },
		],
		failureMode:
			'If the {{SIGNAL}} is too generic ("they raised a Series B"), the model defaults to flattery. The specific noun rule kills the slop — feed it a person, a feature name, or a number, never a category.',
		howWeUseIt: [
			{
				h2: 'How it slots into our day',
				body: 'A scraper feeds 30 fresh signals into Notion at 8am. The agent runs this prompt on each row, writes the line into the column, and pings Slack. By 9am one of us has 30 first-lines ready to triage. Hit rate on replies is roughly 4× a generic templated opener.',
			},
			{
				h2: 'Why it works',
				body: 'The "specific noun" constraint is doing all the work. Models love categories ("their growth"); humans only respond to specifics ("Maya joined as Head of Eng"). The 22-word cap is also load-bearing — past that, the model starts pitching itself.',
			},
		],
	},
	{
		slug: 'friday-strategy-memo',
		type: 'prompt',
		title: 'Friday strategy memo.',
		accent: 'Friday',
		category: 'Strategy',
		description:
			"Reads every other agent's outputs and writes the founder a one-page Friday memo: what moved, what stalled, what to try next.",
		author: { name: 'Rahul Juneja', role: 'Co-founder', initials: 'RJ', since: 'Sep 2024' },
		uses: 1200,
		pinned: false,
		price: 0,
		model: 'Claude Opus 4.7',
		when: "Runs every Friday at 4pm. Pulls the week's outputs from each agent in our stack and folds them into a memo the founder reads with end-of-week tea. Replaces a 30-min sync.",
		prompt: `You are the founder's chief of staff. Read the AGENT OUTPUTS from this week and write a ONE-PAGE Friday memo.

AGENT OUTPUTS:
{{OUTREACH_AGENT_LOG}}
{{RESEARCH_AGENT_LOG}}
{{FINANCE_AGENT_LOG}}
{{STUDIO_AGENT_LOG}}

Memo structure (markdown):

## What moved
3 bullets. Concrete things that changed state this week. Numbers if you have them.

## What stalled
2 bullets. Where progress flatlined. Be honest, not cheerful.

## What to try next week
1 bullet. The single experiment worth running. Should be testable in 5 days.

Constraints:
— Under 250 words total.
— No status updates ("worked on X"). Only state changes ("X went from 0 to 12").
— If a category had no signal, say "Quiet week on {category}." Do not invent.
— No emojis. No bold. Headers only.`,
		testedOn: ['Claude Opus 4.7', 'Claude Sonnet 4.6'],
		variants: [{ slug: 'monthly-board-memo', label: 'Monthly board variant' }],
		failureMode:
			'Without the "state change" framing, the model writes activity lists ("the outreach agent sent 200 emails"). Activity is not progress. Force it to compare two states.',
		howWeUseIt: [
			{
				h2: 'It replaced our Friday sync',
				body: "We used to do a 30-minute call. The memo is better — async, dated, searchable, and you can't bullshit a one-pager that lists what stalled.",
			},
		],
	},
	{
		slug: 'studio-shot-brief',
		type: 'prompt',
		title: 'Studio shot brief.',
		accent: 'shot',
		category: 'Creatives',
		description:
			'Turns a flat mannequin photo into a styled product-shot prompt for our AI photoshoot pipeline. The rosetta stone for our Studio agent.',
		author: { name: 'Rahul Juneja', role: 'Co-founder', initials: 'RJ', since: 'Sep 2024' },
		uses: 2100,
		pinned: false,
		price: 1499,
		model: 'Claude Opus 4.7',
		when: 'Run on every product image as it lands in the Notion intake table. Output feeds directly into the image-gen pipeline.',
		prompt: `You are an art director writing prompts for an image-generation model. Your input is a flat mannequin product photo plus the BRAND BRIEF. Your output is a single image-gen prompt that produces a high-end editorial product shot.

INPUT: {{IMAGE_URL}}
BRAND_BRIEF: {{BRAND_BRIEF}}

Write the prompt as a single paragraph, ~80 words, with the following structure (do NOT label the parts):

1. Subject — describe the product as worn, with body language. No mannequin language.
2. Setting — a specific physical place, not a mood ("a brutalist concrete stairwell at golden hour", not "modern, edgy").
3. Light — direction + quality + color temperature.
4. Lens — focal length, depth of field, film stock if relevant.
5. One specific styling detail that ties it to the brand voice.

Forbidden words: stunning, breathtaking, vibrant, cinematic, masterpiece, ultra-realistic, 4k, 8k.

Output exactly the prompt paragraph. No preamble.`,
		testedOn: ['Claude Opus 4.7'],
		variants: [{ slug: 'studio-shot-brief-flatlay', label: 'Flatlay variant' }],
		failureMode:
			'The forbidden-word list is half the value. Without it, every prompt becomes "a stunning, vibrant, cinematic shot" and the image-gen model produces stock-looking output.',
		howWeUseIt: [
			{
				h2: 'Specificity is the brand',
				body: 'Brands that hire us want product shots that look like they belong to them. The brief makes the model commit to a place and a lens, which is what gives the output a point of view.',
			},
		],
	},
	{
		slug: 'friday-client-update',
		type: 'sop',
		title: 'The Friday client update, in 18 minutes.',
		accent: '18 minutes',
		category: 'Ops',
		description:
			'The runbook a project lead follows every Friday at 3pm to send a client update that gets read. Replaces the "I\'ll do it after lunch" doom loop.',
		author: { name: 'Rahul Juneja', role: 'Co-founder', initials: 'RJ', since: 'Sep 2024' },
		uses: 480,
		pinned: true,
		price: 0,
		duration: '~18 min',
		inputs: [
			'Linear board for the client',
			'The shared Loom folder',
			"Last Friday's update (we link forward)",
		],
		steps: [
			{
				n: 1,
				title: 'Open the previous Friday update.',
				subtitle: 'Continuity is the unlock.',
				body: "Read it once. Note every commitment we made for this week — they are the spine of today's update. If we missed any, we name them in step 4. No exceptions.",
			},
			{
				n: 2,
				title: 'Pull Linear: Done this week.',
				subtitle: 'Filter by completed since last Friday.',
				body: 'Group by project. Discard internal-only tickets. For each remaining card, write the outcome in one line — what changed for the client, not what we did internally.',
				snippet: 'Linear filter:  team=client  status=Done  completedAt > {{LAST_FRIDAY}}',
			},
			{
				n: 3,
				title: 'Record a 90-second Loom over the work.',
				subtitle: "Show, don't list.",
				body: "Walk through the two most visible changes. Don't script it — talk like you're showing a colleague. Stop at 90 seconds even if there's more; clients don't finish 3-minute Looms.",
			},
			{
				n: 4,
				title: 'Name what slipped.',
				subtitle: 'In writing, before they ask.',
				body: "One sentence per slip: what, why, and what we're doing Monday. Never blame a vendor without saying what we're doing about it. Skipping this step is what kills client trust on month 2.",
			},
			{
				n: 5,
				title: 'Make a clean ask.',
				subtitle: 'One ask, one deadline.',
				body: 'Decisions, files, sign-offs — pick the single thing that unblocks Monday and bold it. If the client owes us 4 things, asking for 4 things gets you 0. Ask for 1, get 1.',
			},
			{
				n: 6,
				title: 'Send by 4:30pm. Reply Slack thread by 5.',
				subtitle: 'The window matters.',
				body: 'Friday after 5 = Monday morning email. Friday before 4:30 = read same day, often replied to. Post the link in the shared Slack thread with a one-line tl;dr.',
			},
		],
		outcomes: [
			'A client update that gets read by EOD Friday.',
			"A linkable artifact for next Friday's step 1.",
			'No "what\'s the status?" emails on Monday.',
		],
		failureMode:
			"Skipping step 4 (what slipped). It feels safer to omit; it isn't. Clients will absolutely ask Monday, and now you're also explaining why you didn't mention it Friday.",
	},
	{
		slug: 'agent-onboarding-90min',
		type: 'sop',
		title: 'Onboarding a new client agent in 90 minutes.',
		accent: '90 minutes',
		category: 'Ops',
		description:
			'The exact sequence we run when a new client signs. End of 90 minutes: an agent in their workspace, running on their data, with a human reviewer attached.',
		author: { name: 'Rahul Juneja', role: 'Co-founder', initials: 'RJ', since: 'Sep 2024' },
		uses: 220,
		pinned: false,
		price: 2999,
		duration: '~90 min',
		inputs: [
			'Signed engagement letter',
			'Client Notion access (read + comment)',
			'Two senior NexAI hands available for the full block',
		],
		steps: [
			{
				n: 1,
				title: 'The 10-minute kickoff call.',
				subtitle: 'Scope, not strategy.',
				body: 'Confirm: what does the agent do today? what does it not do? who reviews its output? Anything else is week-2 work.',
			},
			{
				n: 2,
				title: 'Provision the workspace.',
				subtitle: 'Boring, but timed.',
				body: "Spin up the client's Notion + Slack channel + Linear project from our template. The template exists — never start from blank.",
				snippet: 'nx provision client --template=agent-v3 --client={{SLUG}}',
			},
			{
				n: 3,
				title: 'Wire the data sources.',
				subtitle: 'Read-only, always.',
				body: "Connect their CRM, calendar, or whatever's relevant. Never write back on day one. Read-only buys trust; write access is week 3.",
			},
			{
				n: 4,
				title: 'Drop in the seed prompts.',
				subtitle: 'Three, no more.',
				body: "Three prompts from the Hub, none invented today. Specific to the agent's job. Variants live in /variants/, not in the main file.",
			},
			{
				n: 5,
				title: 'Run the first job. Review out loud.',
				subtitle: 'Both of you watching.',
				body: 'Run it in front of the client. They see the output and the receipts. Catch one thing wrong together — that becomes the trust moment.',
			},
			{
				n: 6,
				title: 'Schedule the human review window.',
				subtitle: 'Daily, at first.',
				body: '15 minutes a day, at a fixed time, for the first two weeks. Put it on a calendar. Drop to weekly only when the client asks to.',
			},
		],
		outcomes: [
			"Agent live in the client's workspace.",
			'A daily review ritual on the calendar.',
			'A receipt of "first job we ran together" both teams remember.',
		],
		failureMode:
			"Trying to provision and prompt-engineer in the same block. Don't. The workspace setup is muscle memory; the prompts are judgment. If you mix them you do both badly.",
	},
	{
		slug: 'commit-work',
		type: 'skill',
		title: 'commit-work',
		accent: '',
		category: 'Coding',
		description:
			'Create high-quality git commits: review/stage intended changes, split into logical commits, and write clear conventional-commits messages. Use when a coding agent is about to commit on your behalf.',
		comment:
			'// Use when an agent has finished a unit of work and is about to commit. Stages the right files, writes a Conventional Commit message, and asks before pushing.',
		author: { name: 'Rahul Juneja', role: 'Co-founder', initials: 'RJ', since: 'Sep 2024' },
		uses: 14200,
		pinned: true,
		price: 0,
		stars: 1247,
		runtime: 'Claude Code · Cursor · Codex CLI',
		files: [
			{ path: 'SKILL.md', kind: 'doc', size: '4.1 KB' },
			{ path: 'agents/', kind: 'folder' },
			{ path: 'agents/staging.md', kind: 'doc', size: '1.8 KB' },
			{ path: 'agents/messaging.md', kind: 'doc', size: '2.4 KB' },
			{ path: 'scripts/', kind: 'folder' },
			{ path: 'scripts/conventional.sh', kind: 'sh', size: '612 B' },
			{ path: 'references/', kind: 'folder' },
			{ path: 'references/conventional-commits.md', kind: 'doc', size: '3.2 KB' },
		],
		skillMd: `# commit-work

A skill for creating high-quality git commits.

## When to use it
Trigger when the user says "commit", "stage these", or when an agent finishes a unit of work and is about to write to git on the user's behalf.

## What it does
1. Reads the working tree and staging area.
2. Groups related changes into logical commits.
3. Writes a Conventional Commits message for each.
4. Confirms with the user before any commit or push.

## What it never does
- Force-push.
- Commit without showing the message first.
- Squash commits the user has already pushed.`,
		installMethods: [
			{ tab: 'Claude Code', cmd: 'nx skill add nexailabs/commit-work' },
			{ tab: 'Cursor', cmd: 'curl -fsSL nexailabs.com/s/commit-work | sh' },
			{ tab: 'Codex CLI', cmd: 'codex skill install nexailabs/commit-work' },
			{
				tab: 'Manual',
				cmd: 'git clone github.com/nexailabs/skills && cp -r skills/commit-work ~/.claude/skills/',
			},
		],
		cloudAgents: [
			{ name: 'Claude Haiku 4.5', cost: '₹4 / commit', recommended: false },
			{ name: 'Claude Sonnet 4.6', cost: '₹12 / commit', recommended: true },
			{ name: 'Claude Opus 4.7', cost: '₹38 / commit', recommended: false },
		],
		usedFor: ['Conventional Commits', 'Multi-commit splits', 'Pre-push review'],
	},
	{
		slug: 'client-brief-builder',
		type: 'skill',
		title: 'client-brief-builder',
		accent: '',
		category: 'Strategy',
		description:
			"Turns a 45-minute discovery call transcript into a one-page client brief: problem, success metrics, what we're NOT doing, and the first checkpoint. Includes the prompts, the scoring rubric, and the markdown template.",
		comment:
			'// Use the day after a discovery call. Reads the transcript, drafts the brief, and flags every place the client was vague — those are the questions for call 2.',
		author: { name: 'Rahul Juneja', role: 'Co-founder', initials: 'RJ', since: 'Sep 2024' },
		uses: 920,
		pinned: false,
		price: 4999,
		stars: 318,
		runtime: 'Claude Code · Cursor',
		files: [
			{ path: 'SKILL.md', kind: 'doc', size: '5.6 KB' },
			{ path: 'agents/', kind: 'folder' },
			{ path: 'agents/transcript-reader.md', kind: 'doc', size: '2.1 KB' },
			{ path: 'agents/brief-writer.md', kind: 'doc', size: '3.4 KB' },
			{ path: 'assets/', kind: 'folder' },
			{ path: 'assets/brief-template.md', kind: 'doc', size: '1.9 KB' },
			{ path: 'references/', kind: 'folder' },
			{ path: 'references/scoring-rubric.md', kind: 'doc', size: '2.8 KB' },
		],
		skillMd: `# client-brief-builder

Turns a discovery-call transcript into a one-page brief.

## When to use
Day after a discovery call. Input: the transcript. Output: a one-page brief with a vague-language flag list.

## Pipeline
1. transcript-reader extracts: stated problem, success metrics, constraints, decision-makers.
2. brief-writer fills the template, leaving [VAGUE] markers wherever the client hedged.
3. The [VAGUE] list becomes the agenda for call 2.

## Why one page
We tried longer. Clients didn't read them, and we couldn't catch our own scope creep. One page forces commitment.`,
		installMethods: [
			{ tab: 'Claude Code', cmd: 'nx skill add nexailabs/client-brief-builder' },
			{ tab: 'Cursor', cmd: 'curl -fsSL nexailabs.com/s/client-brief | sh' },
			{
				tab: 'Manual',
				cmd: 'git clone github.com/nexailabs/skills && cp -r skills/client-brief-builder ~/.claude/skills/',
			},
		],
		cloudAgents: [
			{ name: 'Claude Sonnet 4.6', cost: '₹49 / brief', recommended: true },
			{ name: 'Claude Opus 4.7', cost: '₹128 / brief', recommended: false },
		],
		usedFor: ['Discovery transcripts', 'One-page briefs', 'Vague-language detection'],
	},
];

export const PROMPT_LAST_UPDATED = '2 days ago';

export function formatPrice(p: number): string {
	if (p === 0) return 'Free';
	return '₹' + p.toLocaleString('en-IN');
}

export function formatUses(n: number): string {
	if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
	return String(n);
}

export const TYPE_LABELS: Record<ArtifactType, { label: string; plural: string }> = {
	prompt: { label: 'Prompt', plural: 'Prompts' },
	sop: { label: 'SOP', plural: 'SOPs' },
	skill: { label: 'Skill', plural: 'Skills' },
};

export function typeMeta(t: ArtifactType) {
	return TYPE_LABELS[t];
}

export function getArtifact(slug: string): Artifact | undefined {
	return ARTIFACTS.find((a) => a.slug === slug);
}
