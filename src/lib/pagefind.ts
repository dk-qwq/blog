import { url } from "@utils/url-utils";
import type { Pagefind, SearchResult } from "@/types/search";

let instance: Promise<Pagefind> | undefined;

async function getPagefind(): Promise<Pagefind> {
	if (!instance) {
		instance = (async () => {
			const pagefind: Pagefind = await import(
				/* @vite-ignore */ url("/pagefind/pagefind.js")
			);
			await pagefind.options({ excerptLength: 20 });
			return pagefind;
		})().catch((error: unknown) => {
			instance = undefined;
			throw error;
		});
	}
	return instance;
}

export async function searchPosts(query: string): Promise<SearchResult[]> {
	const pagefind = await getPagefind();
	const response = await pagefind.search(query);
	return Promise.all(
		response.results.slice(0, 10).map((result) => result.data()),
	);
}
