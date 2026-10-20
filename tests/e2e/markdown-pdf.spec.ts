import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { expect, type Page, test } from "@playwright/test";

// Trace snapshots inject scripts into every frame, causing sandbox errors in the
// intentionally scriptless preview. Keep failure screenshots and strict errors.
test.use({ trace: "off" });

const fixtureDirectory = resolve("tests/fixtures/markdown-pdf");
const completeDocument = resolve(fixtureDirectory, "complete.md");
const localImage = resolve(fixtureDirectory, "images/diagram.png");
const preview = (page: Page) => page.frameLocator('iframe[title="文档预览"]');
const printButton = (page: Page) =>
	page.getByRole("button", { name: "打印 / 保存 PDF", exact: true });
const browserErrors = new WeakMap<Page, string[]>();

async function ensurePanel(page: Page, name: "编辑" | "预览") {
	const tab = page.getByRole("tab", { name, exact: true });
	if (await tab.isVisible()) await tab.click();
}

async function editDocument(page: Page, source: string) {
	await ensurePanel(page, "编辑");
	await page.getByRole("textbox", { name: "Markdown 原稿" }).fill(source);
}

async function openTool(page: Page) {
	await page.goto("tools/markdown-pdf/");
	await expect(page.getByTestId("markdown-files")).toBeAttached();
	await expect(page.locator("main astro-island[ssr]")).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
	const errors: string[] = [];
	browserErrors.set(page, errors);
	page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
	page.on("console", (message) => {
		if (message.type() !== "error") return;
		const location = message.location();
		errors.push(
			`console.error: ${message.text()} (${location.url}:${location.lineNumber})`,
		);
	});
	await page.route("https://www.googletagmanager.com/**", (route) =>
		route.fulfill({ contentType: "text/javascript", body: "" }),
	);
	await page.route("https://giscus.app/**", (route) =>
		route.fulfill({ contentType: "text/javascript", body: "" }),
	);
});

test.afterEach(async ({ page }) => {
	expect(browserErrors.get(page) ?? [], "Unexpected browser errors").toEqual(
		[],
	);
});

test("starts an unnamed document in the editor and previews without a button", async ({
	page,
}) => {
	await openTool(page);
	await expect(
		page.getByRole("textbox", { name: "Markdown 原稿" }),
	).toHaveValue("");
	await expect(printButton(page)).toBeDisabled();
	await editDocument(
		page,
		"# 直接写作\n\n不需要先选择文件，公式 $a+b$ 自动渲染。",
	);
	await ensurePanel(page, "预览");
	await expect(preview(page).locator("h1")).toHaveText(/^直接写作#?$/);
	await expect(preview(page).locator(".custom-md")).toContainText(
		"不需要先选择文件",
	);
	await expect(preview(page).locator(".katex")).toBeVisible();
	await expect(printButton(page)).toBeEnabled();
	await expect(
		page.getByRole("button", { name: "更新预览", exact: true }),
	).toHaveCount(0);
	await page.getByRole("button", { name: "清空", exact: true }).click();
	await ensurePanel(page, "编辑");
	await expect(
		page.getByRole("textbox", { name: "Markdown 原稿" }),
	).toHaveValue("");
	await expect(printButton(page)).toBeDisabled();
	await ensurePanel(page, "预览");
	await expect(preview(page).locator("body")).not.toContainText(
		"不需要先选择文件",
	);
});

test("keeps the latest text after rapid editing", async ({ page }) => {
	await openTool(page);
	await editDocument(page, "# 第一稿\n\n过期正文。");
	await editDocument(page, "# 第二稿\n\n还是过期正文。");
	await editDocument(
		page,
		"---\ntitle: 最终稿\n---\n\n最后输入的正文和 $x^3$。",
	);
	await ensurePanel(page, "预览");
	await expect(preview(page).locator("h1")).toHaveText("最终稿");
	await expect(preview(page).locator(".custom-md")).toContainText(
		"最后输入的正文",
	);
	await expect(preview(page).locator(".custom-md")).not.toContainText(
		"过期正文",
	);
	await expect(printButton(page)).toBeEnabled();
});

test("replaces a draft when the current Markdown file is imported again", async ({
	page,
}) => {
	await openTool(page);
	await page.getByTestId("markdown-files").setInputFiles({
		name: "same-name.md",
		mimeType: "text/markdown",
		buffer: Buffer.from("# 最初导入\n\n原稿。"),
	});
	await expect(printButton(page)).toBeEnabled();
	await editDocument(page, "# 编辑中的草稿\n\n尚未导出的修改。");
	await expect(printButton(page)).toBeEnabled();
	await page.getByTestId("markdown-files").setInputFiles({
		name: "same-name.md",
		mimeType: "text/markdown",
		buffer: Buffer.from("# 同名重新导入\n\n这份新文件应替换旧草稿。"),
	});
	await ensurePanel(page, "预览");
	await expect(preview(page).locator("h1")).toHaveText(/^同名重新导入#?$/);
	await expect(preview(page).locator(".custom-md")).toContainText(
		"这份新文件应替换旧草稿",
	);
	await expect(preview(page).locator(".custom-md")).not.toContainText(
		"尚未导出的修改",
	);
});

test("waits until Chinese input composition finishes before updating the preview", async ({
	page,
}) => {
	await openTool(page);
	await editDocument(page, "# 中文输入\n\n原来的正文。");
	await expect(printButton(page)).toBeEnabled();
	const editor = page.getByRole("textbox", { name: "Markdown 原稿" });
	await editor.dispatchEvent("compositionstart");
	await editor.fill("# 中文输入\n\n正在组词的 zhongwen");
	await expect(printButton(page)).toBeDisabled();
	await expect(preview(page).locator(".custom-md")).toContainText("原来的正文");
	await editor.fill("# 中文输入\n\n完整的中文输入。");
	await editor.dispatchEvent("compositionend", { data: "中文输入" });
	await ensurePanel(page, "预览");
	await expect(preview(page).locator(".custom-md")).toContainText(
		"完整的中文输入",
	);
	await expect(preview(page).locator(".custom-md")).not.toContainText(
		"zhongwen",
	);
	await expect(printButton(page)).toBeEnabled();
});

test("does not print the previous preview while an edit is awaiting rendering", async ({
	page,
}) => {
	await openTool(page);
	await editDocument(page, "# 之前的版本\n\n旧正文。");
	await expect(printButton(page)).toBeEnabled();
	await ensurePanel(page, "编辑");
	const shortcutsPrevented = await page.evaluate(() => {
		const frame = document.querySelector<HTMLIFrameElement>(
			'iframe[title="文档预览"]',
		);
		const editor = document.querySelector<HTMLTextAreaElement>("textarea");
		if (!frame?.contentWindow || !editor)
			throw new Error("The editor or preview is not loaded");
		frame.contentWindow.print = () => {
			document.documentElement.dataset.stalePrinted = "yes";
		};
		editor.value = "# 最新的版本\n\n应该打印的新正文。";
		editor.dispatchEvent(new Event("input", { bubbles: true }));
		const event = new KeyboardEvent("keydown", {
			key: "p",
			ctrlKey: true,
			bubbles: true,
			cancelable: true,
		});
		window.dispatchEvent(event);
		const frameEvent = new KeyboardEvent("keydown", {
			key: "p",
			ctrlKey: true,
			bubbles: true,
			cancelable: true,
		});
		frame.contentDocument?.dispatchEvent(frameEvent);
		return {
			parent: event.defaultPrevented,
			frame: frameEvent.defaultPrevented,
		};
	});
	expect(shortcutsPrevented).toEqual({ parent: true, frame: true });
	await expect(page.locator("html")).not.toHaveAttribute("data-stale-printed");
	await expect(printButton(page)).toBeDisabled();
	await ensurePanel(page, "预览");
	await expect(preview(page).locator("h1")).toHaveText(/^最新的版本#?$/);
	await expect(printButton(page)).toBeEnabled();
	await page.locator('iframe[title="文档预览"]').evaluate((element) => {
		const view = (element as HTMLIFrameElement).contentWindow;
		if (!view) throw new Error("The preview is not loaded");
		view.print = () => {
			document.documentElement.dataset.latestPrint =
				view.document.body.textContent ?? "";
		};
	});
	await printButton(page).click();
	await expect(page.locator("html")).toHaveAttribute(
		"data-latest-print",
		/应该打印的新正文/,
	);
	await expect(page.locator("html")).not.toHaveAttribute("data-stale-printed");
});

test("uses side by side panels on desktop and editable tabs on mobile", async ({
	page,
}) => {
	await openTool(page);
	await editDocument(page, "# 双栏布局\n\n自动预览仍然保留编辑内容。");
	await expect(printButton(page)).toBeEnabled();
	const editor = page.getByRole("textbox", { name: "Markdown 原稿" });
	const frame = page.locator('iframe[title="文档预览"]');
	if ((page.viewportSize()?.width ?? 0) >= 900) {
		await expect(editor).toBeVisible();
		await expect(frame).toBeVisible();
		const left = await editor.boundingBox();
		const right = await frame.boundingBox();
		expect(left).not.toBeNull();
		expect(right).not.toBeNull();
		if (!left || !right)
			throw new Error("Both panels must have a visible layout");
		expect(left.width).toBeGreaterThan(300);
		expect(right.width).toBeGreaterThan(300);
		expect(left.x + left.width).toBeLessThanOrEqual(right.x + 1);
		expect(Math.max(left.y, right.y)).toBeLessThan(
			Math.min(left.y + left.height, right.y + right.height),
		);
	} else {
		await expect(
			page.getByRole("tab", { name: "编辑", exact: true }),
		).toHaveAttribute("aria-selected", "true");
		await expect(editor).toBeVisible();
		await expect(frame).toBeHidden();
		await ensurePanel(page, "预览");
		await expect(
			page.getByRole("tab", { name: "预览", exact: true }),
		).toHaveAttribute("aria-selected", "true");
		await expect(editor).toBeHidden();
		await expect(frame).toBeVisible();
		await expect(preview(page).locator(".custom-md")).toContainText(
			"自动预览仍然保留编辑内容",
		);
		await ensurePanel(page, "编辑");
		await expect(editor).toHaveValue(
			"# 双栏布局\n\n自动预览仍然保留编辑内容。",
		);
	}
});

test("imports an actual blog source with formulas, admonitions and code", async ({
	page,
}) => {
	await openTool(page);
	await expect(printButton(page)).toBeDisabled();
	await page
		.getByTestId("markdown-files")
		.setInputFiles(resolve("src/content/posts/Kitamasa_BM_Notes.md"));
	await ensurePanel(page, "预览");
	const frame = preview(page);
	await expect(frame.locator("#post-container")).toContainText(
		"Kitamasa 与 BM 算法学习笔记",
	);
	await expect(frame.locator(".custom-md .katex").first()).toBeVisible();
	await expect(frame.locator(".custom-md .admonition").first()).toContainText(
		"下文的序列均为",
	);
	await expect(frame.locator(".custom-md pre").first()).toContainText(
		"ll kitamasa",
	);
	const highlightedTokens = frame.locator(
		'.custom-md .expressive-code pre code span[style*="--0:"]',
	);
	await frame.locator(".expressive-code details summary").first().click();
	await expect(highlightedTokens.first()).toBeVisible();
	await expect
		.poll(() =>
			highlightedTokens.evaluateAll(
				(tokens) =>
					new Set(tokens.map((token) => getComputedStyle(token).color)).size,
			),
		)
		.toBeGreaterThan(2);
	await expect(frame.locator(".custom-md")).not.toContainText("pinWeight:");
	await expect(printButton(page)).toBeEnabled();
});

test("accepts dropped Markdown and automatically previews edits", async ({
	page,
}) => {
	await openTool(page);
	const transfer = await page.evaluateHandle(() => {
		const files = new DataTransfer();
		files.items.add(
			new File(["# 拖入的文档\n\n原来的正文。"], "dropped.md", {
				type: "text/markdown",
			}),
		);
		return files;
	});
	await page.getByTestId("markdown-dropzone").dispatchEvent("drop", {
		dataTransfer: transfer,
	});
	await transfer.dispose();
	await ensurePanel(page, "预览");
	await expect(preview(page).locator(".custom-md")).toContainText("原来的正文");
	await editDocument(
		page,
		"---\ntitle: 编辑后的标题\n---\n\n更新后的正文和 $x^2$。",
	);
	await ensurePanel(page, "预览");
	await expect(preview(page).locator("h1")).toHaveText("编辑后的标题");
	await expect(preview(page).locator(".custom-md")).toContainText(
		"更新后的正文",
	);
	await expect(preview(page).locator(".katex")).toBeVisible();
	await expect(printButton(page)).toBeEnabled();
});

test("keeps delayed file reads separate from image imports and newer documents", async ({
	page,
}) => {
	await openTool(page);
	await page.getByTestId("markdown-files").setInputFiles({
		name: "initial.md",
		mimeType: "text/markdown",
		buffer: Buffer.from("# 初始文档\n\n上一份正文。"),
	});
	await expect(printButton(page)).toBeEnabled();
	const releaseRead = await page.evaluateHandle(() => {
		const original = File.prototype.text;
		let pending: { file: File; resolve: (text: string) => void } | undefined;
		File.prototype.text = function () {
			if (this.name !== "slow.md") return original.call(this);
			document.documentElement.dataset.slowRead = "pending";
			return new Promise<string>((resolve) => {
				pending = { file: this, resolve };
			});
		};
		return async () => {
			if (!pending) throw new Error("There is no delayed Markdown read");
			pending.resolve(await original.call(pending.file));
			pending = undefined;
			delete document.documentElement.dataset.slowRead;
		};
	});
	const slowDocument = {
		name: "slow.md",
		mimeType: "text/markdown",
		buffer: Buffer.from(
			"# 延迟读取文档\n\n这份正文正在等待文件读取。\n\n![本地示意图](images/diagram.png)",
		),
	};
	await page.getByTestId("markdown-files").setInputFiles(slowDocument);
	await expect(page.locator("html")).toHaveAttribute(
		"data-slow-read",
		"pending",
	);
	await page.getByTestId("markdown-files").setInputFiles(localImage);
	await expect(printButton(page)).toBeDisabled();
	await page.evaluate(async (release) => await release(), releaseRead);
	await expect(printButton(page)).toBeEnabled();
	await ensurePanel(page, "预览");
	await expect(preview(page).locator(".custom-md")).toContainText(
		"这份正文正在等待文件读取",
	);
	await expect(preview(page).locator(".custom-md")).not.toContainText(
		"上一份正文",
	);
	await expect
		.poll(() =>
			preview(page)
				.getByRole("img", { name: "本地示意图" })
				.evaluate((image: HTMLImageElement) => image.naturalWidth),
		)
		.toBeGreaterThan(0);
	await page.getByTestId("markdown-files").setInputFiles(slowDocument);
	await expect(page.locator("html")).toHaveAttribute(
		"data-slow-read",
		"pending",
	);
	await page.getByTestId("markdown-files").setInputFiles({
		name: "newer.md",
		mimeType: "text/markdown",
		buffer: Buffer.from("# 新导入的文档\n\n应当保留最新的正文。"),
	});
	await expect(printButton(page)).toBeEnabled();
	await page.evaluate(async (release) => await release(), releaseRead);
	await expect(printButton(page)).toBeEnabled();
	await expect(preview(page).locator("h1")).toHaveText(/^新导入的文档#?$/);
	await expect(preview(page).locator(".custom-md")).toContainText(
		"应当保留最新的正文",
	);
	await releaseRead.dispose();
});

test("keeps document semantics and resolves an image added after the Markdown", async ({
	page,
}) => {
	await openTool(page);
	await page.getByTestId("markdown-files").setInputFiles(completeDocument);
	await ensurePanel(page, "预览");
	const frame = preview(page);
	await expect(frame.locator("#post-container")).toContainText(
		"Markdown 打印兼容检查",
	);
	await expect(frame.locator(".custom-md")).not.toContainText("draft: true");
	await expect(frame.locator(".custom-md .admonition")).toHaveCount(2);
	await expect(frame.locator(".custom-md .katex-display")).toHaveCount(1);
	await expect(frame.locator(".custom-md table")).toContainText(
		"可以复制的正文",
	);
	await expect(
		frame.locator(".custom-md details").filter({ hasText: "展开推导过程" }),
	).toContainText("打印时必须看到这段隐藏内容");
	await expect(frame.locator(".custom-md spoiler")).toContainText("隐藏答案");
	await page.getByTestId("markdown-files").setInputFiles(localImage);
	await expect(frame.getByRole("img", { name: "本地示意图" })).toHaveAttribute(
		"src",
		/^blob:/,
	);
	await expect
		.poll(() =>
			frame
				.getByRole("img", { name: "本地示意图" })
				.evaluate((image: HTMLImageElement) => image.naturalWidth),
		)
		.toBeGreaterThan(0);
	await expect(printButton(page)).toBeEnabled();
	await page.getByRole("button", { name: "清空", exact: true }).click();
	await expect(printButton(page)).toBeDisabled();
	await expect(page.getByRole("alert")).toHaveCount(0);
	await ensurePanel(page, "编辑");
	await expect(
		page.getByRole("textbox", { name: "Markdown 原稿" }),
	).toHaveValue("");
	await page.getByTestId("markdown-files").setInputFiles(completeDocument);
	await ensurePanel(page, "预览");
	await expect(frame.locator(".custom-md")).toContainText("这是文档末尾");
});

test("imports a folder and switches between Markdown documents", async ({
	page,
}) => {
	await openTool(page);
	await page.getByTestId("markdown-folder").setInputFiles(fixtureDirectory);
	const selector = page.getByRole("combobox", { name: "当前文档" });
	await expect(selector).toBeVisible();
	const options = await selector.locator("option").evaluateAll((items) =>
		items.map((item) => ({
			value: item.value,
			label: item.textContent ?? "",
		})),
	);
	const complete = options.find((item) => item.label.includes("complete.md"));
	const unsafe = options.find((item) => item.label.includes("unsafe.md"));
	expect(complete).toBeTruthy();
	expect(unsafe).toBeTruthy();
	await selector.selectOption(complete?.value ?? "");
	await ensurePanel(page, "预览");
	await expect(preview(page).locator(".custom-md")).toContainText(
		"这是文档末尾",
	);
	await expect
		.poll(() =>
			preview(page)
				.getByRole("img", { name: "本地示意图" })
				.evaluate((image: HTMLImageElement) => image.naturalWidth),
		)
		.toBeGreaterThan(0);
	await editDocument(
		page,
		`${await readFile(completeDocument, "utf8")}\n\n切换文档后应保留的编辑。`,
	);
	await ensurePanel(page, "预览");
	await expect(preview(page).locator(".custom-md")).toContainText(
		"切换文档后应保留的编辑",
	);
	await selector.selectOption(unsafe?.value ?? "");
	await expect(preview(page).locator(".custom-md")).toContainText("安全正文");
	await selector.selectOption(complete?.value ?? "");
	await expect(preview(page).locator(".custom-md")).toContainText(
		"切换文档后应保留的编辑",
	);
});

test("does not execute Markdown scripts, event handlers or embedded frames", async ({
	page,
}) => {
	await openTool(page);
	await page
		.getByTestId("markdown-files")
		.setInputFiles(resolve(fixtureDirectory, "unsafe.md"));
	await ensurePanel(page, "预览");
	const frame = preview(page);
	await expect(frame.locator(".custom-md")).toContainText("这段普通正文应保留");
	await expect(
		frame.locator(".custom-md script, .custom-md iframe"),
	).toHaveCount(0);
	await expect(frame.locator(".custom-md [onerror]")).toHaveCount(0);
	await expect(frame.locator('.custom-md a[href^="javascript:"]')).toHaveCount(
		0,
	);
	await expect(
		frame.locator(".custom-md form, .custom-md input:not([disabled])"),
	).toHaveCount(0);
	await expect(page.locator("html")).not.toHaveAttribute(
		"data-markdown-injected",
	);
	const sandbox = await page
		.locator('iframe[title="文档预览"]')
		.getAttribute("sandbox");
	expect(sandbox?.split(/\s+/)).toEqual(
		expect.arrayContaining(["allow-same-origin", "allow-modals"]),
	);
	expect(sandbox?.split(/\s+/)).not.toContain("allow-scripts");
});

test("waits for document resources and expands details before invoking print", async ({
	page,
}) => {
	const image = await readFile(localImage);
	let releaseImage!: () => void;
	const imageReleased = new Promise<void>((resolveImage) => {
		releaseImage = resolveImage;
	});
	let requestedImage!: () => void;
	const imageRequested = new Promise<void>((resolveImage) => {
		requestedImage = resolveImage;
	});
	await page.route("https://print-assets.test/delayed.png", async (route) => {
		requestedImage();
		await imageReleased;
		await route.fulfill({ contentType: "image/png", body: image });
	});
	await openTool(page);
	await page.getByTestId("markdown-files").setInputFiles({
		name: "delayed.md",
		mimeType: "text/markdown",
		buffer: Buffer.from(
			"# 等待资源\n\n<details><summary>推导</summary>打印展开内容</details>\n\n![延迟图片](https://print-assets.test/delayed.png)\n\n$x^2$\n",
		),
	});
	await imageRequested;
	await expect(printButton(page)).toBeDisabled();
	releaseImage();
	await expect(printButton(page)).toBeEnabled();
	await ensurePanel(page, "预览");
	await page.locator('iframe[title="文档预览"]').evaluate((element) => {
		const frameWindow = (element as HTMLIFrameElement).contentWindow;
		if (!frameWindow) throw new Error("The document preview is not loaded");
		frameWindow.print = () => {
			const doc = frameWindow.document;
			document.documentElement.dataset.printSnapshot = JSON.stringify({
				detailsExpanded: Array.from(doc.querySelectorAll("details")).every(
					(details) => details.open,
				),
				imagesLoaded: Array.from(doc.images).every(
					(image) => image.complete && image.naturalWidth > 0,
				),
				fontsLoaded: doc.fonts.status === "loaded",
				text: doc.body.textContent,
			});
		};
	});
	await printButton(page).click();
	await expect(page.locator("html")).toHaveAttribute("data-print-snapshot");
	const snapshot = JSON.parse(
		(await page.locator("html").getAttribute("data-print-snapshot")) ?? "{}",
	);
	expect(snapshot).toMatchObject({
		detailsExpanded: true,
		imagesLoaded: true,
		fontsLoaded: true,
	});
	expect(snapshot.text).toContain("打印展开内容");
	await page.locator("html").evaluate((element) => {
		delete (element as HTMLElement).dataset.printSnapshot;
	});
	await page.keyboard.press("Control+p");
	await expect(page.locator("html")).toHaveAttribute("data-print-snapshot");
});

test("preserves the preview after external links and recovers from print errors", async ({
	page,
}) => {
	await openTool(page);
	await page.getByTestId("markdown-files").setInputFiles({
		name: "print-error.md",
		mimeType: "text/markdown",
		buffer: Buffer.from(
			"# 打印恢复\n\n[外部参考](https://example.test/reference)\n\n<details><summary>推导</summary>保留的折叠内容。</details>",
		),
	});
	await expect(printButton(page)).toBeEnabled();
	await ensurePanel(page, "预览");
	await page.evaluate(() => {
		window.open = (url) => {
			document.documentElement.dataset.externalLink = String(url);
			return null;
		};
	});
	await preview(page).getByRole("link", { name: "外部参考" }).click();
	await expect(page.locator("html")).toHaveAttribute(
		"data-external-link",
		"https://example.test/reference",
	);
	await expect(preview(page).locator("h1")).toHaveText(/^打印恢复#?$/);
	await page.locator('iframe[title="文档预览"]').evaluate((element) => {
		const frameWindow = (element as HTMLIFrameElement).contentWindow;
		if (!frameWindow) throw new Error("The document preview is not loaded");
		frameWindow.print = () => {
			throw new Error("Browser print failed");
		};
	});
	await printButton(page).click();
	await expect(page.getByRole("alert")).toContainText("无法打开打印窗口");
	await expect(preview(page).locator("details")).not.toHaveAttribute("open");
	await page.locator('iframe[title="文档预览"]').evaluate((element) => {
		const frameWindow = (element as HTMLIFrameElement).contentWindow;
		if (!frameWindow) throw new Error("The document preview is not loaded");
		frameWindow.print = () => {
			document.documentElement.dataset.printRecovered = "true";
		};
	});
	await printButton(page).click();
	await expect(page.locator("html")).toHaveAttribute(
		"data-print-recovered",
		"true",
	);
	await expect(page.getByRole("alert")).toHaveCount(0);
	await expect(preview(page).locator("h1")).toHaveText(/^打印恢复#?$/);
});

test("opens native printing and restores collapsed details afterwards", async ({
	page,
}) => {
	await openTool(page);
	await page.getByTestId("markdown-files").setInputFiles({
		name: "native-print.md",
		mimeType: "text/markdown",
		buffer: Buffer.from(
			"# 原生打印\n\n<details><summary>推导</summary>打印时展开，关闭后恢复。</details>",
		),
	});
	await expect(printButton(page)).toBeEnabled();
	await ensurePanel(page, "预览");
	await expect(preview(page).locator("details")).not.toHaveAttribute("open");
	await page.evaluate(() => {
		const frame = document.querySelector<HTMLIFrameElement>(
			'iframe[title="文档预览"]',
		);
		const frameWindow = frame?.contentWindow;
		const frameDocument = frame?.contentDocument;
		if (!frameWindow || !frameDocument)
			throw new Error("The document preview is not loaded");
		// Listeners live in the parent realm, as the preview disallows scripts.
		frameWindow.addEventListener("beforeprint", () => {
			document.documentElement.dataset.nativeBeforePrint = Array.from(
				frameDocument.querySelectorAll("details"),
			).every((details) => details.open)
				? "expanded"
				: "collapsed";
		});
		frameWindow.addEventListener("afterprint", () => {
			document.documentElement.dataset.nativeAfterPrint = "yes";
		});
	});
	await printButton(page).click();
	await expect(page.locator("html")).toHaveAttribute(
		"data-native-before-print",
		"expanded",
	);
	await expect(page.locator("html")).toHaveAttribute(
		"data-native-after-print",
		"yes",
	);
	await expect(preview(page).locator("details")).not.toHaveAttribute("open");
});

test("opens from the sidebar or mobile tools group and returns through Swup", async ({
	page,
	isMobile,
}) => {
	await page.goto("");
	await expect(page.locator("#navbar astro-island:not([ssr])")).toHaveCount(1);
	await expect(
		page.locator('.navbar-links a[href="/blog/tools/markdown-pdf/"]'),
	).toHaveCount(0);
	await page.evaluate(() => {
		document.documentElement.dataset.navigationMarker = "tool-entry";
	});
	if (isMobile) {
		await page.locator("#nav-menu-switch").click();
		await expect(page.locator("#mobile-tools-title")).toHaveText("小工具");
		await page
			.locator("#nav-menu-panel .mobile-tools")
			.getByRole("link", { name: "Markdown 转 PDF", exact: true })
			.click();
	} else {
		const tools = page.getByRole("region", { name: "小工具", exact: true });
		await expect(tools).toBeVisible();
		await expect(tools).toContainText("编辑、预览并打印");
		await tools
			.getByRole("link", { name: "Markdown 转 PDF", exact: true })
			.click();
	}
	await expect(page).toHaveURL(/\/blog\/tools\/markdown-pdf\/$/);
	await expect(page.locator("main astro-island[ssr]")).toHaveCount(0);
	await expect(page.getByTestId("markdown-files")).toBeAttached();
	await expect(page.locator("#nav-menu-switch")).toHaveAttribute(
		"aria-expanded",
		"false",
	);
	await expect(page.locator("#nav-menu-panel")).toHaveAttribute("inert");
	await expect(page.locator("html")).toHaveAttribute(
		"data-navigation-marker",
		"tool-entry",
	);
	await page.locator('#navbar a[href="/blog/"]').first().click();
	await expect(page.locator("main h1")).toHaveText("文章与目录");
	await expect(page.locator("html")).not.toHaveClass(/\bis-changing\b/);
	await expect(page.locator("html")).toHaveAttribute(
		"data-navigation-marker",
		"tool-entry",
	);
	if (isMobile) {
		await page.locator("#nav-menu-switch").click();
		await expect(
			page.locator(
				'#nav-menu-panel .mobile-tools a[href="/blog/tools/markdown-pdf/"]',
			),
		).toBeVisible();
	} else {
		await expect(page.locator("#tools-widget")).toBeVisible();
	}
});

test("can import again after navigating away and back with Swup", async ({
	page,
}) => {
	await openTool(page);
	await page.getByTestId("markdown-files").setInputFiles(completeDocument);
	await ensurePanel(page, "预览");
	await expect(preview(page).locator(".custom-md")).toContainText(
		"这是文档末尾",
	);
	await expect(page.locator("#navbar astro-island:not([ssr])")).toHaveCount(1);
	await page.evaluate(() => {
		document.documentElement.dataset.navigationMarker = "markdown-tool";
	});
	await page.locator('#navbar a[href="/blog/"]').first().click();
	await expect(page).toHaveURL(/\/blog\/$/);
	await expect(page.locator("main h1")).toHaveText("文章与目录");
	await expect(page.locator("html")).not.toHaveClass(/\bis-changing\b/);
	await page.goBack();
	await expect(page).toHaveURL(/\/blog\/tools\/markdown-pdf\/$/);
	await expect(page.locator("main astro-island[ssr]")).toHaveCount(0);
	await page.getByTestId("markdown-files").setInputFiles({
		name: "after-navigation.md",
		mimeType: "text/markdown",
		buffer: Buffer.from("# 返回后重新导入\n\n组件正常工作。"),
	});
	await ensurePanel(page, "预览");
	await expect(preview(page).locator(".custom-md")).toContainText(
		"组件正常工作",
	);
	await expect(printButton(page)).toBeEnabled();
	await expect(page.locator("html")).toHaveAttribute(
		"data-navigation-marker",
		"markdown-tool",
	);
});

test("keeps the tool and document within the viewport", async ({ page }) => {
	await openTool(page);
	await page
		.getByTestId("markdown-files")
		.setInputFiles([completeDocument, localImage]);
	await expect(printButton(page)).toBeEnabled();
	await ensurePanel(page, "预览");
	const outerWidth = await page.evaluate(
		() => document.documentElement.scrollWidth - window.innerWidth,
	);
	expect(outerWidth).toBeLessThanOrEqual(1);
	const frameWidth = await preview(page)
		.locator("html")
		.evaluate((element) => element.scrollWidth - element.clientWidth);
	expect(frameWidth).toBeLessThanOrEqual(1);
});

test("reports unsupported files and recovers when a valid document is imported", async ({
	page,
}) => {
	await openTool(page);
	await page.getByTestId("markdown-files").setInputFiles({
		name: "notes.txt",
		mimeType: "text/plain",
		buffer: Buffer.from("不是 Markdown 文件"),
	});
	await expect(page.getByRole("alert")).toContainText(".md");
	await page.getByTestId("markdown-files").setInputFiles({
		name: "valid.md",
		mimeType: "text/markdown",
		buffer: Buffer.from("# 可以继续使用\n\n成功恢复。"),
	});
	await ensurePanel(page, "预览");
	await expect(preview(page).locator(".custom-md")).toContainText("成功恢复");
	await expect(printButton(page)).toBeEnabled();
	await expect(page.getByRole("alert")).toHaveCount(0);
});
