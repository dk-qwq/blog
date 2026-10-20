import type { MarkdownAssets } from "./markdown-pdf-assets";

interface PreviewContent {
	html: string;
	title: string;
	hasBodyTitle: boolean;
	styles: string[];
}

export interface DocumentPreview {
	warnings: string[];
	invalidate(): void;
	print(): void;
	dispose(): void;
}

const previewDocuments = new WeakMap<HTMLIFrameElement, Document>();

function waitForFonts(doc: Document, signal: AbortSignal): Promise<boolean> {
	signal.throwIfAborted();
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			clearTimeout(timer);
			signal.removeEventListener("abort", aborted);
		};
		const finish = (ready: boolean) => {
			cleanup();
			resolve(ready);
		};
		const aborted = () => {
			cleanup();
			reject(new DOMException("Preview cancelled", "AbortError"));
		};
		const timer = setTimeout(() => finish(false), 10_000);
		signal.addEventListener("abort", aborted, { once: true });
		void doc.fonts.ready.then(
			() => finish(true),
			() => finish(false),
		);
	});
}

function waitForResource(
	target: HTMLImageElement,
	signal: AbortSignal,
): Promise<boolean> {
	if (signal.aborted) return Promise.resolve(false);
	if (target.complete) return Promise.resolve(target.naturalWidth > 0);
	return new Promise((resolve) => {
		const finish = () => {
			clearTimeout(timer);
			target.removeEventListener("load", finish);
			target.removeEventListener("error", finish);
			signal.removeEventListener("abort", finish);
			resolve(target.complete && target.naturalWidth > 0);
		};
		const timer = setTimeout(finish, 12_000);
		target.addEventListener("load", finish);
		target.addEventListener("error", finish);
		signal.addEventListener("abort", finish, { once: true });
	});
}

export async function createDocumentPreview(
	frame: HTMLIFrameElement,
	content: PreviewContent,
	assets: MarkdownAssets,
	documentPath: string,
	signal: AbortSignal,
	onPrintError?: () => void,
): Promise<DocumentPreview> {
	signal.throwIfAborted();
	// Keep the loaded, scriptless document when editing. Navigating srcdoc on
	// every keystroke would blank the preview and reset its surrounding scroll.
	if (previewDocuments.get(frame) !== frame.contentDocument) {
		const source = document.implementation.createHTMLDocument(content.title);
		source.documentElement.lang = "zh-CN";
		source.documentElement.style.setProperty(
			"--hue",
			getComputedStyle(document.documentElement).getPropertyValue("--hue") ||
				"270",
		);
		const policy = source.createElement("meta");
		policy.httpEquiv = "Content-Security-Policy";
		policy.content =
			"default-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https: http:; font-src 'self' data:; base-uri 'none'; form-action 'none'";
		source.head.prepend(policy);
		for (const node of document.querySelectorAll<
			HTMLLinkElement | HTMLStyleElement
		>('head link[rel="stylesheet"], head style')) {
			const clone = node.cloneNode(true) as HTMLLinkElement | HTMLStyleElement;
			if (node instanceof HTMLLinkElement)
				(clone as HTMLLinkElement).href = node.href;
			source.head.append(clone);
		}
		const style = source.createElement("style");
		style.dataset.markdownPdfLayout = "";
		style.textContent = `
			html { font-size: 16px; background: white; color-scheme: light; }
			body { margin: 0; background: white; }
			#post-container { padding: 28px 32px; overflow-wrap: break-word; }
			.custom-md { display: flow-root; }
			.custom-md img { cursor: default; }
			.custom-md .copy-btn, .custom-md .copy { display: none; }
			.custom-md pre { max-width: 100%; }
			@media (max-width: 480px) { #post-container { padding: 20px 16px; } }
			@media print {
				@page { size: A4; }
				.custom-md spoiler, .custom-md spoiler * { color: inherit !important; background: transparent !important; }
				.custom-md .anchor { display: none !important; }
			}
		`;
		source.head.append(style);
		const marker = `preview-${Date.now()}-${Math.random()}`;
		source.body.dataset.preview = marker;
		await new Promise<void>((resolve, reject) => {
			const cleanup = () => {
				clearTimeout(timer);
				frame.removeEventListener("load", loaded);
				signal.removeEventListener("abort", aborted);
			};
			const loaded = () => {
				if (frame.contentDocument?.body.dataset.preview !== marker) return;
				cleanup();
				resolve();
			};
			const aborted = () => {
				cleanup();
				reject(new DOMException("Preview cancelled", "AbortError"));
			};
			const timer = setTimeout(() => {
				cleanup();
				reject(new Error("预览样式加载超时，请重试。"));
			}, 15_000);
			frame.addEventListener("load", loaded);
			signal.addEventListener("abort", aborted, { once: true });
			frame.srcdoc = `<!doctype html>${source.documentElement.outerHTML}`;
			if (signal.aborted) aborted();
		});
		signal.throwIfAborted();
		if (frame.contentDocument)
			previewDocuments.set(frame, frame.contentDocument);
	}
	const doc = frame.contentDocument;
	const view = frame.contentWindow;
	if (!doc || !view) throw new Error("无法打开文档预览。");
	signal.throwIfAborted();
	doc.title = content.title;
	doc.documentElement.style.setProperty(
		"--hue",
		getComputedStyle(document.documentElement).getPropertyValue("--hue") ||
			"270",
	);
	const article = doc.createElement("article");
	article.id = "post-container";
	const markdown = doc.createElement("div");
	markdown.className =
		"prose prose-base !max-w-none custom-md markdown-content";
	// A template is inert: resolve imported images before a live DOM can request
	// their relative paths from the blog. The renderer has sanitized user HTML.
	const template = doc.createElement("template");
	template.innerHTML = content.html;
	if (!content.hasBodyTitle) {
		const heading = doc.createElement("h1");
		heading.textContent = content.title;
		template.content.prepend(heading);
	}
	const warnings: string[] = [];
	const images: HTMLImageElement[] = [];
	for (const img of template.content.querySelectorAll("img")) {
		const reference = img.getAttribute("src") || "";
		img.loading = "eager";
		img.removeAttribute("srcset");
		img.referrerPolicy = "no-referrer";
		if (!/^(?:https?:|data:image\/)/i.test(reference)) {
			const local = assets.resolve(reference, documentPath);
			if (!local) {
				warnings.push(
					`缺少图片：${reference || img.alt || "未命名图片"}，可补充导入图片或整个文件夹。`,
				);
				const missing = doc.createElement("span");
				missing.textContent = `[图片未导入：${img.alt || reference}]`;
				missing.className = "missing-image";
				img.replaceWith(missing);
				continue;
			}
			img.src = local;
		}
		images.push(img);
	}
	markdown.append(template.content);
	article.append(markdown);
	const codeStyles = doc.createDocumentFragment();
	for (const css of content.styles) {
		const style = doc.createElement("style");
		style.dataset.markdownPdfCode = "";
		style.textContent = css;
		codeStyles.append(style);
	}
	for (const style of doc.head.querySelectorAll(
		"style[data-markdown-pdf-code]",
	))
		style.remove();
	doc.head.insertBefore(
		codeStyles,
		doc.head.querySelector("style[data-markdown-pdf-layout]"),
	);
	// Resolve imported images in the inert template, then commit the new text
	// in one DOM update so the live preview never goes through an empty body.
	doc.body.replaceChildren(article);
	const updateHeight = () => {
		frame.style.height = `${Math.max(240, Math.ceil(article.getBoundingClientRect().height) + 2)}px`;
	};
	const observer = new ResizeObserver(updateHeight);
	observer.observe(article);
	updateHeight();
	const opened = new Map<HTMLDetailsElement, boolean>();
	let disposed = false;
	let resourcesReady = false;
	const beforePrint = () => {
		for (const details of doc.querySelectorAll("details")) {
			if (!opened.has(details)) opened.set(details, details.open);
			details.open = true;
		}
	};
	const afterPrint = () => {
		for (const [details, wasOpen] of opened) details.open = wasOpen;
		opened.clear();
	};
	view.addEventListener("beforeprint", beforePrint);
	view.addEventListener("afterprint", afterPrint);
	const printDocument = () => {
		if (disposed || !resourcesReady) return;
		beforePrint();
		try {
			view.focus();
			view.print();
		} catch (error) {
			afterPrint();
			throw error;
		}
	};
	const onKeydown = (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p") {
			event.preventDefault();
			try {
				printDocument();
			} catch {
				onPrintError?.();
			}
		}
	};
	const onLink = (event: MouseEvent) => {
		const target = event.target as Element | null;
		const link = target?.closest?.("a[href]");
		if (!link) return;
		event.preventDefault();
		const href = link.getAttribute("href") || "";
		if (href.startsWith("#")) {
			try {
				doc.getElementById(decodeURIComponent(href.slice(1)))?.scrollIntoView();
			} catch {
				/* A malformed anchor must not navigate the preview away. */
			}
		} else if (/^(?:https?:|mailto:)/i.test(href)) {
			window.open(href, "_blank", "noopener,noreferrer");
		}
	};
	doc.addEventListener("keydown", onKeydown);
	doc.addEventListener("click", onLink);
	const dispose = () => {
		disposed = true;
		observer.disconnect();
		view.removeEventListener("beforeprint", beforePrint);
		view.removeEventListener("afterprint", afterPrint);
		doc.removeEventListener("keydown", onKeydown);
		doc.removeEventListener("click", onLink);
		signal.removeEventListener("abort", dispose);
		afterPrint();
	};
	signal.addEventListener("abort", dispose, { once: true });
	const results = await Promise.all(
		images.map((img) => waitForResource(img, signal)),
	);
	signal.throwIfAborted();
	for (const [index, loaded] of results.entries()) {
		if (!loaded) {
			warnings.push(
				`图片加载失败或超时：${images[index].alt || images[index].getAttribute("src") || "未命名图片"}`,
			);
			// Freeze failures so late network responses cannot change pagination mid-print.
			const missing = doc.createElement("span");
			missing.textContent = `[图片未加载：${images[index].alt || "图片"}]`;
			images[index].replaceWith(missing);
		}
	}
	const fontsReady = await waitForFonts(doc, signal);
	if (!fontsReady) warnings.push("部分字体加载超时，将使用系统字体打印。");
	signal.throwIfAborted();
	resourcesReady = true;
	updateHeight();
	return {
		warnings,
		invalidate: () => {
			resourcesReady = false;
		},
		print: printDocument,
		dispose,
	};
}
