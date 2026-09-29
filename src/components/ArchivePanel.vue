<script setup lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { groupArchivePosts } from "@utils/archive-utils";
import { getPostUrlBySlug } from "@utils/url-utils";
import { computed, onMounted, onUnmounted, ref } from "vue";
import type { Post } from "@/types/post";

const props = defineProps<{ sortedPosts: Post[] }>();
const query = ref("");
const groups = computed(() =>
	groupArchivePosts(props.sortedPosts, query.value),
);
function syncQuery(): void {
	query.value = window.location.search;
}
onMounted(() => {
	syncQuery();
	window.addEventListener("popstate", syncQuery);
	document.addEventListener("astro:page-load", syncQuery);
});
onUnmounted(() => {
	window.removeEventListener("popstate", syncQuery);
	document.removeEventListener("astro:page-load", syncQuery);
});
function formatDate(value: Date): string {
	const date = new Date(value);
	return (
		String(date.getMonth() + 1).padStart(2, "0") +
		"-" +
		String(date.getDate()).padStart(2, "0")
	);
}
</script>

<template>
	<div id="archive-panel" class="card-base px-8 py-6">
		<p v-if="!groups.length" class="text-50 py-4" role="status">{{ i18n(I18nKey.searchNoResults) }}</p>
		<section v-for="group in groups" :key="group.year">
			<div class="flex flex-row w-full items-center h-[3.75rem]">
				<h2 class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">{{ group.year }}</h2>
				<div class="w-[15%] md:w-[10%]">
					<div class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto -outline-offset-[2px] z-50 outline-3" />
				</div>
				<div class="w-[70%] md:w-[80%] text-left text-50">{{ group.posts.length }} {{ i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount) }}</div>
			</div>
			<a v-for="post in group.posts" :key="post.slug" :href="getPostUrlBySlug(post.slug)" :aria-label="post.data.title" class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]">
				<div class="flex flex-row justify-start items-center h-full">
					<time :datetime="new Date(post.data.published).toISOString().slice(0, 10)" class="w-[15%] md:w-[10%] text-sm text-right text-50">{{ formatDate(post.data.published) }}</time>
					<div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
						<div class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5 bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)] outline outline-4 z-50 outline-[var(--card-bg)] group-hover:outline-[var(--btn-plain-bg-hover)] group-active:outline-[var(--btn-plain-bg-active)]" />
					</div>
					<div class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)] text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden">{{ post.data.title }}</div>
					<div class="hidden md:block md:w-[15%] text-left text-sm transition whitespace-nowrap overflow-ellipsis overflow-hidden text-30">{{ post.data.tags.map(tag => '#' + tag).join(' ') }}</div>
				</div>
			</a>
		</section>
	</div>
</template>
