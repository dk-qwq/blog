import { expect, type Page, test } from "@playwright/test";

const errors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
	errors.set(page, []);
	page.on("pageerror", (error) => errors.get(page)?.push(error.message));
	page.on("console", (message) => {
		if (
			message.text().toLowerCase().includes("hydration") &&
			["warning", "error"].includes(message.type())
		) {
			errors.get(page)?.push(message.text());
		}
	});
	await page.route("https://www.googletagmanager.com/**", (route) =>
		route.fulfill({ contentType: "text/javascript", body: "" }),
	);
	await page.route("https://giscus.app/**", (route) =>
		route.fulfill({ contentType: "text/javascript", body: "" }),
	);
	await page.route("https://api.github.com/repos/**", (route) =>
		route.fulfill({
			json: {
				description: "Blog",
				language: "Astro",
				forks: 0,
				stargazers_count: 0,
				owner: { avatar_url: "" },
				license: { spdx_id: "MIT" },
			},
		}),
	);
});

test.afterEach(async ({ page }) => {
	expect(errors.get(page)).toEqual([]);
});

async function ready(page: Page): Promise<void> {
	await expect(page.locator("#navbar astro-island:not([ssr])")).toHaveCount(1);
}

test("home and posts share the directory view without index article cards", async ({
	page,
}) => {
	await page.goto("");
	await expect(page.locator("main h1")).toHaveText("文章与目录");
	const physics = page.locator(
		'.folder-card[href="/blog/posts/college-physics/"]',
	);
	await expect(physics).toContainText("大学物理");
	await expect(physics).toContainText("3 篇文章");
	await expect(
		page.locator('main a[href="/blog/posts/college-physics/"]'),
	).toHaveCount(1);
	const homeLinks = await page.locator(".content-list a").evaluateAll((links) =>
		links.map((link) => ({
			href: link.getAttribute("href"),
			text: link.textContent,
		})),
	);
	await page.goto("posts/");
	expect(
		await page.locator(".content-list a").evaluateAll((links) =>
			links.map((link) => ({
				href: link.getAttribute("href"),
				text: link.textContent,
			})),
		),
	).toEqual(homeLinks);
	await physics.click();
	await expect(page.locator("main h1")).toHaveText("大学物理");
	await expect(page.locator("#post-container, #giscus-container")).toHaveCount(
		0,
	);
	await page.getByRole("link", { name: "返回上级" }).click();
	await expect(page).toHaveURL(/\/blog\/$/);
	await expect(page.locator("main h1")).toHaveText("文章与目录");
});

test("archives omit directory metadata", async ({ page, request }) => {
	await page.goto("archive/");
	await expect(page.locator("#archive-panel")).toBeVisible();
	for (const folder of [
		"college-physics",
		"advanced-math-b",
		"git",
		"contest-logs",
	]) {
		await expect(
			page.locator(`#archive-panel a[href="/blog/posts/${folder}/"]`),
		).toHaveCount(0);
	}
	await expect(
		page.locator('#archive-panel a[href="/blog/posts/bin-fib-decomposition/"]'),
	).toHaveCount(1);
	const rss = await request.get("rss.xml");
	expect(rss.ok()).toBeTruthy();
	expect(await rss.text()).not.toMatch(
		/<title>(大学物理|高数B|Git|游记)<\/title>/,
	);
});

test("archive and navigation are rendered in the initial HTML", async ({
	request,
}) => {
	const response = await request.get("archive/");
	expect(response.ok()).toBeTruthy();
	const html = await response.text();
	expect(html).toContain('id="archive-panel"');
	expect(html).toContain("dkdk-上分日记");
	expect(html).toContain('id="scheme-switch"');
	expect(html).not.toContain("@astrojs/svelte");
});

test("theme and hue persist, and panels dismiss correctly", async ({
	page,
	isMobile,
}) => {
	await page.goto("");
	await ready(page);
	const mode = page.locator("#scheme-switch");
	await mode.click(); // system -> light
	await mode.click(); // light -> dark
	await expect(page.locator("html")).toHaveClass(/dark/);
	await page.locator("#display-settings-switch").click();
	await expect(page.locator("#display-setting")).not.toHaveAttribute("inert");
	const slider = page.locator("#colorSlider");
	await slider.focus();
	await slider.press("Home");
	await slider.press("ArrowRight");
	await expect
		.poll(() => page.evaluate(() => localStorage.getItem("hue")))
		.toBe("5");
	await page.keyboard.press("Escape");
	await expect(page.locator("#display-settings-switch")).toHaveAttribute(
		"aria-expanded",
		"false",
	);
	await page.reload();
	await ready(page);
	await expect(page.locator("html")).toHaveClass(/dark/);
	await expect
		.poll(() =>
			page.evaluate(() =>
				getComputedStyle(document.documentElement)
					.getPropertyValue("--hue")
					.trim(),
			),
		)
		.toBe("5");
	await expect
		.poll(() =>
			page.evaluate(() =>
				getComputedStyle(document.documentElement)
					.getPropertyValue("--card-bg")
					.trim(),
			),
		)
		.not.toBe("");
	await page.locator("#display-settings-switch").click();
	await page.locator("#display-setting button").click();
	await expect
		.poll(() => page.evaluate(() => localStorage.getItem("hue")))
		.toBe("270");
	await page.locator("#navbar > div a").first().click();
	await expect(page.locator("#display-settings-switch")).toHaveAttribute(
		"aria-expanded",
		"false",
	);
	if (isMobile) {
		await page.locator("#nav-menu-switch").click();
		await expect(page.locator("#nav-menu-panel")).not.toHaveAttribute("inert");
		await page.locator('#nav-menu-panel a[href="/blog/archive/"]').click();
		await expect(page).toHaveURL(/\/blog\/archive\/$/);
		await expect(page.locator("#archive-panel")).toBeVisible();
	}
});

test("production search loads the real index and clears obsolete results", async ({
	page,
	isMobile,
}) => {
	await page.goto("");
	await ready(page);
	if (isMobile) await page.locator("#search-switch").click();
	const input = page.locator(
		isMobile ? "#search-panel input" : "#search-bar input",
	);
	await input.fill("Kitamasa");
	const result = page.locator('#search-panel a[href*="kitamasa"]');
	await expect(result).toBeVisible();
	await input.fill("");
	await expect(page.locator("#search-panel a")).toHaveCount(0);
	await input.fill("超级不存在的天外飞仙内容");
	await expect(page.locator("#search-panel [role=status]")).toHaveText(
		"未找到匹配内容",
	);
	await input.fill("Kitamasa");
	await expect(result).toBeVisible();
	await result.click();
	await expect(page).toHaveURL(/kitamasa_bm_notes/);
	await expect(page.locator("#post-container")).toBeVisible();
});

test("archive filters update across navigation and browser history", async ({
	page,
}) => {
	await page.goto("archive/?tag=__not_a_tag__");
	await ready(page);
	await expect(page.locator("#archive-panel [role=status]")).toHaveText(
		"未找到匹配内容",
	);
	const tag = page.locator("#tags a").first();
	await tag.click();
	await expect(page.locator("#archive-panel a").first()).toBeVisible();
	await page.goBack();
	await expect(page.locator("#archive-panel [role=status]")).toHaveText(
		"未找到匹配内容",
	);
	await page.goForward();
	await expect(page.locator("#archive-panel a").first()).toBeVisible();
});

test("directory links resolve and article features survive page replacement", async ({
	page,
	isMobile,
}) => {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: async (text: string) => {
					document.documentElement.dataset.copied = text;
				},
			},
		});
	});
	await page.goto("");
	await ready(page);
	await page
		.locator('main a[href="/blog/posts/college-physics/"]')
		.first()
		.click();
	await expect(page).toHaveURL(/\/college-physics\/$/);
	await expect(
		page.locator('main a[href*="/college-physics/part-"]'),
	).not.toHaveCount(0);

	// Swup updates the URL before replacing content; wait until navigation finishes.
	await expect(page.locator("html")).not.toHaveClass(/\bis-changing\b/);

	// A marker survives only if Swup keeps the document during navigation.
	await page.evaluate(() => {
		document.documentElement.dataset.navigationMarker = "kept";
	});
	if (isMobile) {
		await page.locator("#nav-menu-switch").click();
		await page.locator('#nav-menu-panel a[href="/blog/archive/"]').click();
	} else {
		await page.locator('#navbar a[href="/blog/archive/"]').first().click();
	}
	await page
		.locator('#archive-panel a[href="/blog/posts/kitamasa_bm_notes/"]')
		.click();
	await expect(page.locator(".custom-md .katex").first()).toBeVisible();
	await expect(page.locator("html")).toHaveAttribute(
		"data-navigation-marker",
		"kept",
	);
	await page.locator(".copy-btn").first().click();
	await expect
		.poll(() => page.evaluate(() => document.documentElement.dataset.copied))
		.toContain("int");
	await page.locator("#giscus-container").scrollIntoViewIfNeeded();
	await expect(
		page.locator('#giscus-container script[data-mapping="pathname"]'),
	).toHaveCount(1);

	if (isMobile) {
		await page.locator("#nav-menu-switch").click();
		await page.locator('#nav-menu-panel a[href="/blog/archive/"]').click();
	} else {
		await page.locator('#navbar a[href="/blog/archive/"]').first().click();
	}
	await page
		.locator('#archive-panel a[href="/blog/posts/bin-fib-decomposition/"]')
		.click();
	await expect(page.locator("html")).toHaveAttribute(
		"data-navigation-marker",
		"kept",
	);
	await page.locator(".custom-md img").first().click();
	await expect(page.locator(".pswp")).toBeVisible();
	await page.waitForFunction(
		() =>
			(window as typeof window & { pswp?: { opener: { isOpen: boolean } } })
				.pswp?.opener.isOpen,
	);
	await page.keyboard.press("Escape");
	await expect(page.locator(".pswp")).toHaveCount(0);
});
