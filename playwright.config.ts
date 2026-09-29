import { defineConfig, devices } from "@playwright/test";

// Keep local preview requests local even when the development shell uses a proxy.
process.env.NO_PROXY = [process.env.NO_PROXY, "127.0.0.1", "localhost"]
	.filter(Boolean)
	.join(",");
process.env.no_proxy = process.env.NO_PROXY;

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	workers: 2,
	timeout: 30_000,
	expect: { timeout: 10_000 },
	reporter: "list",
	use: {
		baseURL: "http://127.0.0.1:4322/blog/",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "desktop",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1440, height: 1000 },
			},
		},
		{ name: "mobile", use: { ...devices["Pixel 7"] } },
	],
	webServer: {
		command: "pnpm preview --host 127.0.0.1 --port 4322",
		url: "http://127.0.0.1:4322/blog/",
		reuseExistingServer: !process.env.CI,
		timeout: 30_000,
	},
});
