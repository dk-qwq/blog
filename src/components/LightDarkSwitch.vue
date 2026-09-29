<script setup lang="ts">
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { ref } from "vue";
import { useTheme } from "@/composables/useSitePreferences";
import type { LIGHT_DARK_MODE } from "@/types/config";
import Icon from "./control/Icon.vue";

const { mode, changeMode } = useTheme();
const open = ref(false);
const container = ref<HTMLElement>();
const choices = [
	{ value: LIGHT_MODE, label: I18nKey.lightMode, icon: "light" },
	{ value: DARK_MODE, label: I18nKey.darkMode, icon: "dark" },
	{ value: AUTO_MODE, label: I18nKey.systemMode, icon: "auto" },
] as const;

function cycle(): void {
	const index = choices.findIndex((choice) => choice.value === mode.value);
	changeMode(choices[(index + 1) % choices.length].value);
}
function choose(value: LIGHT_DARK_MODE): void {
	changeMode(value);
	open.value = false;
}
function onFocusOut(event: FocusEvent): void {
	if (
		!(event.relatedTarget instanceof Node) ||
		!container.value?.contains(event.relatedTarget)
	) {
		open.value = false;
	}
}
</script>

<template>
	<div ref="container" class="relative z-50" @mouseenter="open = true" @mouseleave="open = false" @focusout="onFocusOut" @keydown.esc.stop="open = false">
		<button id="scheme-switch" type="button" :aria-label="i18n(I18nKey.lightMode) + ' / ' + i18n(I18nKey.darkMode)" :aria-expanded="open" aria-controls="light-dark-panel" class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" @click="cycle" @focus="open = true">
			<Icon :name="mode === LIGHT_MODE ? 'light' : mode === DARK_MODE ? 'dark' : 'auto'" class="text-[1.25rem]" />
		</button>
		<div id="light-dark-panel" :inert="!open" :class="{ 'float-panel-closed': !open }" class="hidden lg:block absolute transition top-11 -right-2 pt-5">
			<div class="card-base float-panel p-2">
				<button v-for="choice in choices" :key="choice.value" type="button" :aria-pressed="mode === choice.value" :class="{ 'current-theme-btn': mode === choice.value }" class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5 last:mb-0" @click="choose(choice.value)">
					<Icon :name="choice.icon" class="text-[1.25rem] mr-3" />
					{{ i18n(choice.label) }}
				</button>
			</div>
		</div>
	</div>
</template>
