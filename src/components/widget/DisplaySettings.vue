<script setup lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { useHue } from "@/composables/useSitePreferences";
import Icon from "../control/Icon.vue";

defineProps<{ open: boolean }>();
const { hue, defaultHue, changeHue } = useHue();
function onInput(event: Event): void {
	changeHue(Number((event.target as HTMLInputElement).value));
}
</script>

<template>
	<div id="display-setting" :inert="!open" :class="{ 'float-panel-closed': !open }" class="float-panel absolute transition-all w-80 max-w-[calc(100vw-2rem)] right-4 px-4 py-4">
		<div class="flex flex-row gap-2 mb-3 items-center justify-between">
			<div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:-left-3 before:top-[0.33rem]">
				{{ i18n(I18nKey.themeColor) }}
				<button type="button" :aria-label="i18n(I18nKey.reset)" :disabled="hue === defaultHue" class="btn-regular w-7 h-7 rounded-md active:scale-90 disabled:opacity-0" @click="changeHue(defaultHue)">
					<Icon name="reset" class="text-[0.875rem]" />
				</button>
			</div>
			<output for="colorSlider" class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center font-bold text-sm items-center text-[var(--btn-content)]">{{ hue }}</output>
		</div>
		<div class="w-full h-6 px-1 rounded select-none">
			<input id="colorSlider" :value="hue" :aria-label="i18n(I18nKey.themeColor)" type="range" min="0" max="360" step="5" class="slider w-full" @input="onInput" />
		</div>
	</div>
</template>

<style scoped>
.slider {
	appearance: none;
	height: 1.5rem;
	border-radius: 0.25rem;
	background-image: var(--color-selection-bar);
	transition: background-image 0.15s ease-in-out;
}
.slider::-webkit-slider-thumb {
	appearance: none;
	height: 1rem;
	width: 0.5rem;
	border-radius: 0.125rem;
	background: rgb(255 255 255 / 70%);
}
.slider::-moz-range-thumb {
	height: 1rem;
	width: 0.5rem;
	border-radius: 0.125rem;
	border: 0;
	background: rgb(255 255 255 / 70%);
}
</style>
