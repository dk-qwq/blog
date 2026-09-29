<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const props = withDefaults(
	defineProps<{
		repo: string;
		repoId: string;
		category: string;
		categoryId: string;
		mapping?: string;
		lang?: string;
	}>(),
	{ mapping: "pathname", lang: "zh-CN" },
);
const container = ref<HTMLDivElement>();
let observer: MutationObserver | undefined;

function getTheme(): string {
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
onMounted(() => {
	const script = document.createElement("script");
	script.src = "https://giscus.app/client.js";
	script.async = true;
	script.crossOrigin = "anonymous";
	const options = {
		repo: props.repo,
		"repo-id": props.repoId,
		category: props.category,
		"category-id": props.categoryId,
		mapping: props.mapping,
		strict: "0",
		"reactions-enabled": "1",
		"emit-metadata": "0",
		"input-position": "top",
		theme: getTheme(),
		lang: props.lang,
	};
	for (const [key, value] of Object.entries(options)) {
		script.setAttribute(`data-${key}`, value);
	}
	container.value?.append(script);
	observer = new MutationObserver(() => {
		container.value
			?.querySelector<HTMLIFrameElement>("iframe")
			?.contentWindow?.postMessage(
				{ giscus: { setConfig: { theme: getTheme() } } },
				"https://giscus.app",
			);
	});
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
});
onUnmounted(() => observer?.disconnect());
</script>

<template>
	<div id="giscus-container" ref="container" class="min-h-16" />
</template>
