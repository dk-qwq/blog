import { describe, expect, it } from "vitest";
import type { Post } from "@/types/post";
import { groupArchivePosts } from "./archive-utils";

const posts: Post[] = [
	{
		slug: "a",
		data: {
			title: "A",
			tags: ["数学", "C++"],
			category: "竞赛",
			published: new Date("2026-05-01"),
		},
	},
	{
		slug: "b",
		data: {
			title: "B",
			tags: ["数学"],
			category: "课程",
			published: new Date("2025-05-01"),
		},
	},
	{
		slug: "c",
		data: {
			title: "C",
			tags: ["Vue"],
			category: "",
			published: new Date("2024-05-01"),
		},
	},
];
const slugs = (query: string) =>
	groupArchivePosts(posts, query).flatMap((group) =>
		group.posts.map((post) => post.slug),
	);

describe("archive filtering", () => {
	it("groups all posts by descending year without mutating the input", () => {
		expect(groupArchivePosts(posts, "").map((group) => group.year)).toEqual([
			2026, 2025, 2024,
		]);
		expect(posts.map((post) => post.slug)).toEqual(["a", "b", "c"]);
	});
	it("matches any selected tag, including escaped punctuation", () => {
		expect(slugs("?tag=C%2B%2B&tag=Vue")).toEqual(["a", "c"]);
	});
	it("combines tag and category filters", () => {
		expect(slugs("?tag=数学&category=课程")).toEqual(["b"]);
	});
	it("handles uncategorized and unknown filters", () => {
		expect(slugs("?uncategorized=true")).toEqual(["c"]);
		expect(slugs("?tag=does-not-exist")).toEqual([]);
		expect(slugs("?uncategorized=false")).toEqual(["a", "b", "c"]);
	});
});
