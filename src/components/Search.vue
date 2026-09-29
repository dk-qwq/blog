<script setup lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { searchMetadata } from "@utils/search-utils";
import { nextTick, onUnmounted, ref, watch } from "vue";
import { searchPosts } from "@/lib/pagefind";
import type { SearchEntry, SearchResult } from "@/types/search";
import Icon from "./control/Icon.vue";

const props = defineProps<{ open: boolean; entries: SearchEntry[] }>();
const emit = defineEmits<{ "update:open": [value: boolean] }>();
const keyword = ref("");
const results = ref<SearchResult[]>([]);
const isSearching = ref(false);
const failed = ref(false);
const mobileInput = ref<HTMLInputElement>();
const panel = ref<HTMLElement>();
let request = 0;

watch(keyword, (value, _previous, onCleanup) => {
	const currentRequest = ++request;
	const query = value.trim();
	results.value = [];
	failed.value = false;
	isSearching.value = !!query;
	if (!query) return;
	emit("update:open", true);
	const timer = window.setTimeout(async () => {
		try {
			const found = import.meta.env.DEV
				? searchMetadata(props.entries, query)
				: await searchPosts(query);
			if (currentRequest === request) results.value = found;
		} catch {
			if (currentRequest === request) failed.value = true;
		} finally {
			if (currentRequest === request) isSearching.value = false;
		}
	}, 180);
	onCleanup(() => window.clearTimeout(timer));
});

watch(
	() => props.open,
	async (open) => {
		if (!open || !window.matchMedia("(max-width: 1023px)").matches) return;
		await nextTick();
		mobileInput.value?.focus();
	},
);
onUnmounted(() => {
	request++;
});

function focusFirstResult(): void {
	panel.value?.querySelector<HTMLAnchorElement>("a")?.focus();
}
</script>

<template>
	<div id="search-bar" class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10">
		<Icon name="search" class="absolute text-[1.25rem] pointer-events-none ml-3 text-black/30 dark:text-white/30" />
		<input
			v-model="keyword"
			type="search"
			:placeholder="i18n(I18nKey.search)"
			:aria-label="i18n(I18nKey.search)"
			:aria-expanded="open"
			aria-controls="search-panel"
			class="transition-all pl-10 pr-2 text-sm bg-transparent outline-0 h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50"
			@focus="keyword.trim() && emit('update:open', true)"
			@keydown.down.prevent="focusFirstResult"
		/>
	</div>
	<button
		id="search-switch"
		type="button"
		:aria-label="i18n(I18nKey.search)"
		:aria-expanded="open"
		aria-controls="search-panel"
		class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90"
		@click="emit('update:open', !open)"
	>
		<Icon name="search" class="text-[1.25rem]" />
	</button>
	<div
		id="search-panel"
		ref="panel"
		:inert="!open"
		:class="{ 'float-panel-closed': !open }"
		:aria-busy="isSearching"
		class="float-panel search-panel absolute md:w-[30rem] top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2"
	>
		<div class="flex relative lg:hidden items-center h-11 rounded-xl bg-black/[0.04] dark:bg-white/5">
			<Icon name="search" class="absolute text-[1.25rem] pointer-events-none ml-3 text-black/30 dark:text-white/30" />
			<input ref="mobileInput" v-model="keyword" type="search" :placeholder="i18n(I18nKey.search)" :aria-label="i18n(I18nKey.search)" class="w-full pl-10 pr-2 text-sm bg-transparent outline-0 text-black/50 dark:text-white/50" @keydown.down.prevent="focusFirstResult" />
		</div>
		<div v-if="isSearching || failed || (keyword.trim() && !results.length)" role="status" aria-live="polite" class="px-3 py-4 text-sm text-50">
			{{ i18n(isSearching ? I18nKey.searchLoading : failed ? I18nKey.searchUnavailable : I18nKey.searchNoResults) }}
		</div>
		<a v-for="item in results" :key="item.url" :href="item.url" class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]" @click="emit('update:open', false)">
			<div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
				{{ item.meta.title }}<Icon name="chevron" class="text-[1.25rem] translate-x-1 my-auto text-[var(--primary)]" />
			</div>
			<div class="text-sm text-50" v-html="item.excerpt" />
		</a>
	</div>
</template>

<style scoped>
.search-panel {
	max-height: calc(100vh - 100px);
	overflow-y: auto;
}
</style>
