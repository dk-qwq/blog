import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

import { contentCompareFn } from "./content-order";
import { isLandingArticle } from "./content-paths";

export { contentCompareFn, type RankableItem } from "./content-order";

async function getRawSortedEntries(onlySortedByDate = false) {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts
		.map((post) => ({ ...post, data: { ...post.data } }))
		.sort((a, b) => {
			return contentCompareFn(a.data, b.data, onlySortedByDate);
		});
	return sorted;
}

// 目录树需要保留 _index 的元信息，但文章翻页只能指向真正的文章。
export async function getSortedEntries() {
	const sorted = await getRawSortedEntries();
	const articles = sorted.filter((post) => !isLandingArticle(post.id));

	for (let i = 0; i < articles.length; i++) {
		articles[i].data.nextSlug = articles[i - 1]?.id ?? "";
		articles[i].data.nextTitle = articles[i - 1]?.data.title ?? "";
		articles[i].data.prevSlug = articles[i + 1]?.id ?? "";
		articles[i].data.prevTitle = articles[i + 1]?.data.title ?? "";
	}

	return sorted;
}

export async function getSortedPosts() {
	return (await getSortedEntries()).filter(
		(post) => !isLandingArticle(post.id),
	);
}

// 为归档页准备的列表
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = (await getRawSortedEntries(true)).filter(
		(post) => !isLandingArticle(post.id),
	);

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.id,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getSortedPosts();

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getSortedPosts();
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}
