import type { Post } from "@/types/post";

export interface ArchiveGroup {
	year: number;
	posts: Post[];
}

export function groupArchivePosts(
	posts: Post[],
	query: string,
): ArchiveGroup[] {
	const params = new URLSearchParams(query);
	const tags = params.getAll("tag");
	const categories = params.getAll("category");
	const uncategorized = params.get("uncategorized") === "true";
	const groups = new Map<number, Post[]>();

	for (const post of posts) {
		if (tags.length && !post.data.tags.some((tag) => tags.includes(tag)))
			continue;
		if (categories.length && !categories.includes(post.data.category ?? ""))
			continue;
		if (uncategorized && post.data.category?.trim()) continue;
		const year = new Date(post.data.published).getFullYear();
		const group = groups.get(year) ?? [];
		group.push(post);
		groups.set(year, group);
	}
	return [...groups.entries()]
		.sort(([a], [b]) => b - a)
		.map(([year, items]) => ({ year, posts: items }));
}
