import { DEFAULT_THEME } from "@constants/constants";
import {
	applyThemeToDocument,
	getDefaultHue,
	getHue,
	getStoredTheme,
	setHue,
	setTheme,
} from "@utils/setting-utils";
import { onMounted, onUnmounted, ref } from "vue";
import type { LIGHT_DARK_MODE } from "@/types/config";

export function useTheme() {
	const mode = ref<LIGHT_DARK_MODE>(DEFAULT_THEME);
	let cleanup: (() => void) | undefined;

	function changeMode(value: LIGHT_DARK_MODE): void {
		mode.value = value;
		setTheme(value);
	}

	onMounted(() => {
		mode.value = getStoredTheme();
		applyThemeToDocument(mode.value);
		const preference = window.matchMedia("(prefers-color-scheme: dark)");
		const update = () => applyThemeToDocument(mode.value);
		const sync = (event: StorageEvent) => {
			if (event.key !== "theme" && event.key !== null) return;
			mode.value = getStoredTheme();
			update();
		};
		preference.addEventListener("change", update);
		window.addEventListener("storage", sync);
		cleanup = () => {
			preference.removeEventListener("change", update);
			window.removeEventListener("storage", sync);
		};
	});
	onUnmounted(() => cleanup?.());
	return { mode, changeMode };
}

export function useHue() {
	const defaultHue = getDefaultHue();
	const hue = ref(defaultHue);
	function changeHue(value: number): void {
		hue.value = value;
		setHue(value);
	}
	const sync = (event: StorageEvent) => {
		if (event.key === "hue" || event.key === null) {
			hue.value = getHue();
			document.documentElement.style.setProperty("--hue", String(hue.value));
		}
	};
	onMounted(() => {
		hue.value = getHue();
		window.addEventListener("storage", sync);
	});
	onUnmounted(() => window.removeEventListener("storage", sync));
	return { hue, defaultHue, changeHue };
}
