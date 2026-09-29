<script setup lang="ts">
import { type UiIconName, uiIcons } from "@/constants/ui-icons";

defineProps<{ name: UiIconName }>();
</script>

<template>
	<svg
		:viewBox="'0 0 ' + uiIcons[name].width + ' ' + uiIcons[name].height"
		width="1em"
		height="1em"
		fill="currentColor"
		aria-hidden="true"
		focusable="false"
		v-html="uiIcons[name].body"
	/>
</template>
