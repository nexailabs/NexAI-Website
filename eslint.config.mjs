import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	...astro.configs.recommended,
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
		},
	},
	{
		// Node-side scripts (build / CI helpers) — allow Node globals.
		files: ['scripts/**/*.{js,mjs,cjs}', '*.config.{js,mjs,cjs}'],
		languageOptions: {
			globals: {
				console: 'readonly',
				process: 'readonly',
				Buffer: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				global: 'readonly',
				module: 'readonly',
				require: 'readonly',
				exports: 'writable',
				URL: 'readonly',
			},
		},
	},
	{
		ignores: ['dist/', '.astro/', 'node_modules/'],
	},
);
