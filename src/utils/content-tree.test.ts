import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import {
	buildContentTree,
	type contentNode,
	flattenContentRoutes,
	flattenFolders,
	getArticlePath,
	getArticles,
	getFolders,
	getPostUrl,
	isIndexArticle,
	isLandingArticle,
} from "./content-tree";

function createPost(
	id: string,
	data: Partial<CollectionEntry<"posts">["data"]> = {},
): CollectionEntry<"posts"> {
	return {
		id,
		data: { published: new Date("2025-01-01"), ...data },
	} as CollectionEntry<"posts">;
}

describe("content filters", () => {
	it("separates folders and articles while preserving their order", () => {
		const root = buildContentTree([
			createPost("new.md", { published: new Date("2026-01-01") }),
			createPost("guide/topic.md", { published: new Date("2025-06-01") }),
			createPost("old.md", { published: new Date("2024-01-01") }),
		]);
		const contents: contentNode[] = root.contents;

		expect(getArticles(contents).map((article) => article.name)).toEqual([
			"new",
			"old",
		]);
		expect(getFolders(contents).map((folder) => folder.name)).toEqual([
			"guide",
		]);
	});

	it("returns empty arrays when a content type is absent", () => {
		const root = buildContentTree([createPost("article.md")]);

		expect(getFolders(root.contents)).toEqual([]);
		expect(getArticles(root.contents)).toHaveLength(1);
	});
});

describe("path helpers", () => {
	it("removes Markdown extensions", () => {
		expect(getArticlePath("C.md")).toBe("C");
		expect(getArticlePath("folder/article.mdx")).toBe("folder/article");
	});

	it("maps index and nested _index files to directory paths", () => {
		expect(getArticlePath("index.md")).toBe("");
		expect(getArticlePath("math/index.md")).toBe("math");
		expect(getArticlePath("_index.mdx")).toBe("_index");
		expect(getArticlePath("math/_index.mdx")).toBe("math");
	});

	it("distinguishes index articles from landing articles", () => {
		expect(isIndexArticle("index.md")).toBe(true);
		expect(isIndexArticle("math/index.mdx")).toBe(true);
		expect(isIndexArticle("math/_index.md")).toBe(false);
		expect(isLandingArticle("_index.md")).toBe(true);
		expect(isLandingArticle("math/_index.mdx")).toBe(true);
		expect(isLandingArticle("math/index.md")).toBe(false);
		expect(isLandingArticle("math/part-1.md")).toBe(false);
	});

	it("builds post URLs", () => {
		expect(getPostUrl("CF2204/CF2204F")).toBe("/posts/CF2204/CF2204F/");
		expect(getPostUrl("")).toBe("/posts/");
	});
});

describe("buildContentTree", () => {
	it("builds a nested tree with a unified contents collection", () => {
		const root = buildContentTree([
			createPost("C.md"),
			createPost("CF2204/CF2204F.md"),
			createPost("math/algebra/linear/vector.md"),
		]);

		expect(root).toMatchObject({
			type: "folder",
			name: "",
			path: "",
			url: "/posts/",
		});
		expect(root).not.toHaveProperty("articles");
		expect(root).not.toHaveProperty("folders");

		const rootArticle = getArticles(root.contents)[0];
		expect(rootArticle).toMatchObject({
			name: "C",
			path: "C",
			url: "/posts/C/",
		});

		const cf2204 = getFolders(root.contents).find(
			(folder) => folder.name === "CF2204",
		);
		expect(cf2204).toMatchObject({ path: "CF2204", url: "/posts/CF2204/" });
		expect(getArticles(cf2204?.contents ?? [])[0].name).toBe("CF2204F");

		const math = getFolders(root.contents).find(
			(folder) => folder.name === "math",
		);
		const algebra = getFolders(math?.contents ?? [])[0];
		const linear = getFolders(algebra?.contents ?? [])[0];
		expect(getArticles(linear.contents)[0]).toMatchObject({
			name: "vector",
			path: "math/algebra/linear/vector",
		});
	});

	it("keeps index.md as an article at the directory route", () => {
		const root = buildContentTree([
			createPost("index.md"),
			createPost("guides/index.md"),
		]);
		const articles = getArticles(root.contents);

		expect(getFolders(root.contents)).toEqual([]);
		expect(articles).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "index",
					path: "",
					url: "/posts/",
					isIndex: true,
				}),
				expect.objectContaining({
					name: "index",
					path: "guides",
					url: "/posts/guides/",
					isIndex: true,
				}),
			]),
		);
	});

	it("stores _index.md as folder metadata outside contents", () => {
		const landing = createPost("guides/_index.md");
		const root = buildContentTree([landing, createPost("guides/setup.md")]);
		const guides = getFolders(root.contents)[0];

		expect(guides.landingArticle).toMatchObject({
			name: "guides",
			path: "guides",
			url: "/posts/guides/",
			isIndex: false,
			entry: landing,
		});
		expect(guides.contents).toHaveLength(1);
		expect(getArticles(guides.contents)[0].name).toBe("setup");
	});

	it("sorts articles and folders together by their best-ranked content", () => {
		const root = buildContentTree([
			createPost("old-folder/topic.md", {
				published: new Date("2023-01-01"),
			}),
			createPost("recent.md", { published: new Date("2026-01-01") }),
			createPost("pinned-folder/topic.md", { pinWeight: 10 }),
			createPost("old.md", { published: new Date("2024-01-01") }),
		]);

		expect(root.contents.map((content) => content.name)).toEqual([
			"pinned-folder",
			"recent",
			"old",
			"old-folder",
		]);
	});

	it("uses a landing article as the folder ranking source", () => {
		const root = buildContentTree([
			createPost("guide/_index.md", { published: new Date("2023-01-01") }),
			createPost("guide/pinned.md", { pinWeight: 100 }),
			createPost("recent.md", { published: new Date("2026-01-01") }),
		]);

		expect(root.contents.map((content) => content.name)).toEqual([
			"recent",
			"guide",
		]);
	});

	it("propagates the best descendant rank through nested folders", () => {
		const root = buildContentTree([
			createPost("deep/child/pinned.md", { pinWeight: 20 }),
			createPost("top.md", { pinWeight: 10 }),
		]);

		expect(root.contents.map((content) => content.name)).toEqual([
			"deep",
			"top",
		]);
	});
});

describe("flattenFolders", () => {
	it("returns non-root folders in ranked depth-first order", () => {
		const root = buildContentTree([
			createPost("a/child/article.md", { published: new Date("2026-01-01") }),
			createPost("b/article.md", { published: new Date("2024-01-01") }),
		]);

		expect(flattenFolders(root).map((folder) => folder.path)).toEqual([
			"a",
			"a/child",
			"b",
		]);
	});
});

describe("flattenContentRoutes", () => {
	it("includes the root route, then article and folder routes recursively", () => {
		const root = buildContentTree([
			createPost("C.md", { published: new Date("2026-01-01") }),
			createPost("guides/_index.md", { published: new Date("2025-01-01") }),
			createPost("guides/setup.md", { published: new Date("2025-06-01") }),
			createPost("reference/api.md", { published: new Date("2024-01-01") }),
		]);

		expect(
			flattenContentRoutes(root).map((route) => ({
				type: route.type,
				path: route.node.path,
			})),
		).toEqual([
			{ type: "folder", path: "" },
			{ type: "article", path: "C" },
			{ type: "folder", path: "guides" },
			{ type: "article", path: "guides/setup" },
			{ type: "folder", path: "reference" },
			{ type: "article", path: "reference/api" },
		]);
	});

	it("represents a landing article through its folder route", () => {
		const routes = flattenContentRoutes(
			buildContentTree([createPost("guides/_index.md")]),
		);

		expect(routes).toHaveLength(2);
		expect(routes.map((route) => [route.type, route.node.path])).toEqual([
			["folder", ""],
			["folder", "guides"],
		]);
	});

	it("emits index.md separately from the root folder route", () => {
		const routes = flattenContentRoutes(
			buildContentTree([createPost("guides/index.md")]),
		);

		expect(routes).toHaveLength(2);
		expect(routes[0]).toMatchObject({ type: "folder", node: { path: "" } });
		expect(routes[1]).toMatchObject({
			type: "article",
			node: { path: "guides", url: "/posts/guides/", isIndex: true },
		});
	});

	it("produces extension-free route paths", () => {
		const routes = flattenContentRoutes(
			buildContentTree([
				createPost("C.md"),
				createPost("guides/_index.md"),
				createPost("guides/setup.mdx"),
			]),
		);

		for (const route of routes) {
			expect(route.node.path).not.toMatch(/\.(md|mdx)$/);
		}
	});
});
