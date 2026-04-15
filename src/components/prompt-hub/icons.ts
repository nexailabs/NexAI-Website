import type { PromptModel, PromptType } from '../../data/prompt-hub';

export const copyIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 9a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V9zm-5 4V6a2 2 0 0 1 2-2h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const checkIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const typeIcons: Record<PromptType, string> = {
	prompt: 'P',
	skill: 'SK',
	'system-prompt': 'SYS',
	'mcp-config': 'MCP',
};

export const modelMonograms: Record<PromptModel, string> = {
	chatgpt: 'CG',
	claude: 'CL',
	gemini: 'GM',
	cursor: 'CR',
	codex: 'CX',
	any: '*',
};
