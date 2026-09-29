import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants";
import { expressiveCodeConfig, siteConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

function readPreference(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writePreference(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {
		// Preferences still apply for this visit when browser storage is unavailable.
	}
}

export function getDefaultHue(): number {
	return siteConfig.themeColor.hue;
}

export function getHue(): number {
	const stored = readPreference("hue");
	if (stored === null) return getDefaultHue();
	const hue = Number(stored);
	return Number.isFinite(hue)
		? Math.min(360, Math.max(0, hue))
		: getDefaultHue();
}

export function setHue(hue: number): void {
	const value = Number.isFinite(hue)
		? Math.min(360, Math.max(0, hue))
		: getDefaultHue();
	writePreference("hue", String(value));
	document.documentElement.style.setProperty("--hue", String(value));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE): void {
	const isDark =
		theme === DARK_MODE ||
		(theme === AUTO_MODE &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);
	document.documentElement.classList.toggle("dark", isDark);
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	writePreference("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	const stored = readPreference("theme");
	return stored === LIGHT_MODE || stored === DARK_MODE || stored === AUTO_MODE
		? stored
		: DEFAULT_THEME;
}
