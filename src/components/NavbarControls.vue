<script setup lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { url } from "@utils/url-utils";
import { onMounted, onUnmounted, ref } from "vue";
import type { NavBarLink, ToolLink } from "@/types/config";
import type { SearchEntry } from "@/types/search";
import Icon from "./control/Icon.vue";
import LightDarkSwitch from "./LightDarkSwitch.vue";
import Search from "./Search.vue";
import DisplaySettings from "./widget/DisplaySettings.vue";

defineProps<{
	links: NavBarLink[];
	tools: ToolLink[];
	fixedThemeColor: boolean;
	searchEntries: SearchEntry[];
}>();
type Panel = "search" | "settings" | "menu";
const activePanel = ref<Panel | null>(null);
const controls = ref<HTMLElement>();

function toggle(panel: Panel): void {
	activePanel.value = activePanel.value === panel ? null : panel;
}
function close(): void {
	activePanel.value = null;
}
function onOutsideClick(event: PointerEvent): void {
	if (event.target instanceof Node && !controls.value?.contains(event.target))
		close();
}
function onEscape(event: KeyboardEvent): void {
	if (event.key !== "Escape" || !activePanel.value) return;
	const triggers = {
		search: "search-switch",
		settings: "display-settings-switch",
		menu: "nav-menu-switch",
	};
	const trigger = document.getElementById(triggers[activePanel.value]);
	close();
	trigger?.focus();
}
onMounted(() => {
	document.addEventListener("pointerdown", onOutsideClick);
	document.addEventListener("keydown", onEscape);
	document.addEventListener("astro:before-swap", close);
});
onUnmounted(() => {
	document.removeEventListener("pointerdown", onOutsideClick);
	document.removeEventListener("keydown", onEscape);
	document.removeEventListener("astro:before-swap", close);
});
</script>

<template>
	<div ref="controls" class="flex">
		<Search :open="activePanel === 'search'" :entries="searchEntries" @update:open="activePanel = $event ? 'search' : activePanel === 'search' ? null : activePanel" />
		<button v-if="!fixedThemeColor" id="display-settings-switch" type="button" :aria-label="i18n(I18nKey.themeColor)" :aria-expanded="activePanel === 'settings'" aria-controls="display-setting" class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" @click="toggle('settings')">
			<Icon name="palette" class="text-[1.25rem]" />
		</button>
		<LightDarkSwitch />
		<button id="nav-menu-switch" type="button" :aria-label="i18n(I18nKey.menu)" :aria-expanded="activePanel === 'menu'" aria-controls="nav-menu-panel" class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90 lg:!hidden" @click="toggle('menu')">
			<Icon name="menu" class="text-[1.25rem]" />
		</button>
		<DisplaySettings v-if="!fixedThemeColor" :open="activePanel === 'settings'" />
		<nav id="nav-menu-panel" :aria-label="i18n(I18nKey.menu)" :inert="activePanel !== 'menu'" :class="{ 'float-panel-closed': activePanel !== 'menu' }" class="float-panel absolute transition-all right-4 px-2 py-2 lg:hidden">
			<a v-for="link in links" :key="link.url" :href="link.external ? link.url : url(link.url)" :target="link.external ? '_blank' : undefined" :rel="link.external ? 'noopener noreferrer' : undefined" class="group flex justify-between items-center py-2 pl-3 pr-1 rounded-lg gap-8 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition" @click="close">
				<span class="transition text-black/75 dark:text-white/75 font-bold group-hover:text-[var(--primary)]">{{ link.name }}</span>
				<Icon :name="link.external ? 'external' : 'chevron'" class="text-[1.25rem] text-[var(--primary)]" />
			</a>
			<section v-if="tools.length" class="mobile-tools" aria-labelledby="mobile-tools-title">
				<p id="mobile-tools-title" class="tools-label">小工具</p>
				<a v-for="tool in tools" :key="tool.url" :href="tool.external ? tool.url : url(tool.url)" :target="tool.external ? '_blank' : undefined" :rel="tool.external ? 'noopener noreferrer' : undefined" class="mobile-tool-link" @click="close">
					<Icon :name="tool.icon" class="text-[1.25rem] shrink-0" />
					<span class="mobile-tool-name">{{ tool.name }}</span>
					<Icon :name="tool.external ? 'external' : 'chevron'" class="text-[1.1rem] shrink-0" />
				</a>
			</section>
		</nav>
	</div>
</template>

<style scoped>
.mobile-tools { margin: .45rem .25rem .1rem; padding-top: .65rem; border-top: 1px solid var(--line-divider); }
.tools-label { padding: 0 .55rem .35rem; font-size: .73rem; line-height: 1.6; color: var(--btn-content); opacity: .55; }
.mobile-tool-link { display: flex; align-items: center; gap: .6rem; padding: .6rem .55rem; border-radius: .5rem; color: var(--btn-content); font-size: .875rem; font-weight: 600; white-space: nowrap; }
.mobile-tool-link:hover { background: var(--btn-plain-bg-hover); }
.mobile-tool-name { flex: 1; }
</style>
