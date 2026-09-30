import "overlayscrollbars/overlayscrollbars.css";
import "photoswipe/style.css";
import "../styles/photoswipe.css";
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_EXTEND,
	BANNER_HEIGHT_HOME,
	MAIN_PANEL_OVERLAPS_BANNER_HEIGHT,
} from "@constants/constants";
import type Swup from "@swup/astro/client/Swup";
import type SwupScrollPlugin from "@swup/astro/client/SwupScrollPlugin";
import {
	applyThemeToDocument,
	getHue,
	getStoredTheme,
	setHue,
} from "@utils/setting-utils";
import { pathsEqual, url } from "@utils/url-utils";
import { OverlayScrollbars } from "overlayscrollbars";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { siteConfig } from "@/config";

let cleanupPage: (() => void) | undefined;
let transitionTimer: ReturnType<typeof setTimeout> | undefined;
const copyTimers = new Map<HTMLButtonElement, ReturnType<typeof setTimeout>>();
const configuredNavigation = new WeakSet<Swup>();

function waitForStylesheet(link: HTMLLinkElement): Promise<void> {
	if (link.sheet) return Promise.resolve();
	return new Promise((resolve) => {
		const controller = new AbortController();
		const finish = () => {
			clearTimeout(timer);
			controller.abort();
			resolve();
		};
		// A failed stylesheet must not leave navigation waiting indefinitely.
		const timer = setTimeout(finish, 3000);
		link.addEventListener("load", finish, { signal: controller.signal });
		link.addEventListener("error", finish, { signal: controller.signal });
	});
}

function configureAnchorNavigation(): void {
	const swup = (window as Window & { swup?: Swup }).swup;
	if (!swup || configuredNavigation.has(swup)) return;
	configuredNavigation.add(swup);
	const scrolling = swup.findPlugin("SwupScrollPlugin") as
		| SwupScrollPlugin
		| undefined;
	if (scrolling) {
		scrolling.options.offset = (element) =>
			Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
	}
	swup.hooks.before("content:scroll", async (visit) => {
		if (!visit.to.hash) return;
		// Code styles can live inside the replaced article. On narrow screens,
		// loading them or their fonts changes wrapping and moves later headings.
		await Promise.all(
			[
				...document.querySelectorAll<HTMLLinkElement>(
					'main link[rel="stylesheet"]',
				),
			].map(waitForStylesheet),
		);
		await document.fonts.ready;
	});
}

// The Astro integration publishes window.swup immediately after enabling it.
document.addEventListener("swup:enable", () => {
	queueMicrotask(configureAnchorNavigation);
});
configureAnchorNavigation();

function updateViewport(): void {
	const offset = Math.floor((window.innerHeight * BANNER_HEIGHT_EXTEND) / 100);
	document.documentElement.style.setProperty(
		"--banner-height-extend",
		`${offset - (offset % 4)}px`,
	);
	const isHome = pathsEqual(window.location.pathname, url("/"));
	document.body.classList.toggle("lg:is-home", isHome);
	document.body.classList.toggle(
		"is-home",
		isHome && window.innerWidth >= 1024,
	);
	updateScroll();
}

function updateScroll(): void {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const bannerHeight = (window.innerHeight * BANNER_HEIGHT) / 100;
	document
		.getElementById("back-to-top-btn")
		?.classList.toggle("hide", scrollTop <= bannerHeight);
	if (!siteConfig.banner.enable) return;
	document
		.getElementById("toc-wrapper")
		?.classList.toggle("toc-hide", scrollTop <= bannerHeight);
	const height = document.body.classList.contains("is-home")
		? BANNER_HEIGHT_HOME
		: BANNER_HEIGHT;
	const threshold =
		(window.innerHeight * height) / 100 -
		72 -
		MAIN_PANEL_OVERLAPS_BANNER_HEIGHT * 16 -
		16;
	document
		.getElementById("navbar-wrapper")
		?.classList.toggle("navbar-hidden", scrollTop >= threshold);
}

function mountFormulaScrollbars(): () => void {
	const cleanup: Array<() => void> = [];
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting || !(entry.target instanceof HTMLElement))
					continue;
				const element = entry.target;
				observer.unobserve(element);
				const container = document.createElement("div");
				container.className = "katex-display-container";
				container.setAttribute("aria-label", "Scrollable formula");
				element.before(container);
				container.append(element);
				const instance = OverlayScrollbars(container, {
					scrollbars: {
						theme: "scrollbar-base scrollbar-auto",
						autoHide: "leave",
						autoHideDelay: 500,
					},
				});
				cleanup.push(() => {
					instance.destroy();
					container.replaceWith(element);
				});
			}
		},
		{ rootMargin: "100px", threshold: 0.1 },
	);
	for (const element of document.querySelectorAll(".custom-md .katex-display"))
		observer.observe(element);
	return () => {
		observer.disconnect();
		for (const destroy of cleanup) destroy();
	};
}

function mountLightbox(): () => void {
	const lightbox = new PhotoSwipeLightbox({
		gallery: ".custom-md img, #post-cover img",
		pswpModule: () => import("photoswipe"),
		padding: { top: 20, bottom: 20, left: 20, right: 20 },
		wheelToZoom: true,
		arrowPrev: false,
		arrowNext: false,
		imageClickAction: "close",
		tapAction: "close",
		doubleTapAction: "zoom",
	});
	lightbox.addFilter("domItemData", (itemData, element) => {
		if (element instanceof HTMLImageElement) {
			itemData.src = element.currentSrc || element.src;
			itemData.w = element.naturalWidth || window.innerWidth;
			itemData.h = element.naturalHeight || window.innerHeight;
			itemData.msrc = element.src;
		}
		return itemData;
	});
	lightbox.init();
	return () => lightbox.destroy();
}

function unmountPage(): void {
	cleanupPage?.();
	cleanupPage = undefined;
	clearTimeout(transitionTimer);
	for (const [button, timer] of copyTimers) {
		clearTimeout(timer);
		button.classList.remove("success");
	}
	copyTimers.clear();
}

function mountPage(): void {
	unmountPage();
	applyThemeToDocument(getStoredTheme());
	setHue(getHue());
	updateViewport();
	document.getElementById("banner")?.classList.remove("opacity-0", "scale-105");
	const destroyFormulas = mountFormulaScrollbars();
	const destroyLightbox = mountLightbox();
	cleanupPage = () => {
		destroyFormulas();
		destroyLightbox();
	};
	transitionTimer = setTimeout(() => {
		document.getElementById("page-height-extend")?.classList.add("hidden");
		document.getElementById("toc-wrapper")?.classList.remove("toc-not-ready");
	}, 200);
}

// Swup's Astro integration emits these events for each navigation.
// Global listeners are registered once; page-specific observers are disposed before replacement.
document.addEventListener("astro:before-swap", () => {
	unmountPage();
	document.documentElement.style.setProperty("--content-delay", "0ms");
	document.getElementById("page-height-extend")?.classList.remove("hidden");
	document.getElementById("toc-wrapper")?.classList.add("toc-not-ready");
});
document.addEventListener("astro:page-load", mountPage);
window.addEventListener("scroll", updateScroll, { passive: true });
window.addEventListener("resize", updateViewport, { passive: true });

document.addEventListener("click", async (event) => {
	if (!(event.target instanceof Element)) return;
	const button = event.target.closest<HTMLButtonElement>("button.copy-btn");
	if (!button) return;
	const code = [
		...(button.closest("pre")?.querySelectorAll(".code:not(summary *)") ?? []),
	]
		.map((line) => (line.textContent === "\n" ? "" : line.textContent))
		.join("\n");
	try {
		await navigator.clipboard.writeText(code);
		if (!button.isConnected) return;
		clearTimeout(copyTimers.get(button));
		button.classList.add("success");
		copyTimers.set(
			button,
			setTimeout(() => {
				button.classList.remove("success");
				copyTimers.delete(button);
			}, 1000),
		);
	} catch {
		// Clipboard access can be denied by the browser; leave the code selectable.
	}
});

OverlayScrollbars(
	{ target: document.body, cancel: { nativeScrollbarsOverlaid: true } },
	{
		scrollbars: {
			theme: "scrollbar-base scrollbar-auto py-1",
			autoHide: "move",
			autoHideDelay: 500,
			autoHideSuspend: false,
		},
	},
);
mountPage();
