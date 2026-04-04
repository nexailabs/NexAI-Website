import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:4321',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'desktop',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'mobile',
			use: {
				...devices['Pixel 7'],
				isMobile: true,
			},
		},
	],
	webServer: {
		command: 'npm run preview',
		url: 'http://localhost:4321',
		reuseExistingServer: !process.env.CI,
		timeout: 30_000,
	},
});
