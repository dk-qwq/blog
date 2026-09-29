import type { CollectionEntry } from "astro:content";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	getCategoryList,
	getSortedEntries,
	getSortedPosts,
	getSortedPostsList,
	getTagList,
} from "./content-utils";

const collection = vi.hoisted(() => ({
	posts: [] as CollectionEntry<"posts">[],
}));

vi.mock("astro:content", () => ({
	getCollection: async (
		_name: string,
		filter?: (entry: CollectionEntry<"posts">) => boolean,
	) => collection.posts.filter((entry) => !filter || filter(entry)),
}));

function post(
	id: string,
	data: Partial<CollectionEntry<"posts">["data"]> = {},
): CollectionEntry<"posts"> {
	return {
		id,
		collection: "posts",
		data: {
			title: id,
			published: new Date("2026-01-01"),
			draft: false,
			description: "",
			image: "",
			tags: ["文章标签"],
			category: "文章分类",
			lang: "",
			pinWeight: 2,
			prevSlug: "",
			prevTitle: "",
			nextSlug: "",
			nextTitle: "",
			...data,
		},
	};
}

beforeEach(() => {
	vi.stubEnv("PROD", true);
	collection.posts = [
		post("new", { published: new Date("2026-03-01") }),
		post("guides/_index", {
			published: new Date("2026-02-01"),
			tags: ["目录标签"],
			category: "目录分类",
		}),
		post("guides/topic"),
		post("album/index", { published: new Date("2025-01-01") }),
	];
});

afterEach(() => vi.unstubAllEnvs());

describe("directory metadata and article lists", () => {
	it("retains directory metadata while article navigation skips it", async () => {
		const original = structuredClone(collection.posts);
		const entries = await getSortedEntries();
		expect(entries.map((entry) => entry.id)).toEqual([
			"new",
			"guides/_index",
			"guides/topic",
			"album/index",
		]);
		expect(entries[0].data).toMatchObject({
			nextSlug: "",
			prevSlug: "guides/topic",
			prevTitle: "guides/topic",
		});
		expect(entries[2].data).toMatchObject({
			nextSlug: "new",
			nextTitle: "new",
			prevSlug: "album/index",
		});
		expect(entries[3].data.prevSlug).toBe("");
		expect(collection.posts).toEqual(original);
	});

	it("excludes root and nested _index entries but keeps index articles", async () => {
		collection.posts.push(
			post("_index"),
			post("guides/nested/_index.md"),
			post("mdx/_index.mdx"),
		);
		expect((await getSortedPosts()).map((entry) => entry.id)).toEqual([
			"new",
			"guides/topic",
			"album/index",
		]);
	});

	it("counts only articles in archives, tags, and categories", async () => {
		collection.posts[3].data.pinWeight = 10;
		expect((await getSortedPostsList()).map((entry) => entry.slug)).toEqual([
			"new",
			"guides/topic",
			"album/index",
		]);
		expect(await getTagList()).toEqual([{ name: "文章标签", count: 3 }]);
		expect(await getCategoryList()).toEqual([
			expect.objectContaining({ name: "文章分类", count: 3 }),
		]);
	});

	it("excludes drafts from production and retains them in development", async () => {
		collection.posts.push(post("draft", { draft: true }));
		expect((await getSortedEntries()).map((entry) => entry.id)).not.toContain(
			"draft",
		);
		vi.stubEnv("PROD", false);
		expect((await getSortedPosts()).map((entry) => entry.id)).toContain(
			"draft",
		);
	});
});
