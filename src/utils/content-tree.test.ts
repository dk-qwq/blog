import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import {
	buildContentTree,
	flattenContentRoutes,
	flattenFolders,
	getArticlePath,
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

describe("path helpers", () => {
	it("removes Markdown extensions", () => {
		expect(getArticlePath("C.md")).toBe("C");
		expect(getArticlePath("folder/article.mdx")).toBe("folder/article");
	});

	it("maps index and _index files to directory paths", () => {
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

	it("builds article and root URLs", () => {
		expect(getPostUrl("CF2204/CF2204F")).toBe("/posts/CF2204/CF2204F/");
		expect(getPostUrl("")).toBe("/posts/");
	});
});

describe("buildContentTree", () => {
	it("places regular articles in nested folders", () => {
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
		expect(root.articles[0]).toMatchObject({
			name: "C",
			path: "C",
			url: "/posts/C/",
		});

		const cf2204 = root.folders.find((folder) => folder.name === "CF2204");
		expect(cf2204).toMatchObject({ path: "CF2204", url: "/posts/CF2204/" });
		expect(cf2204?.articles[0].name).toBe("CF2204F");

		const math = root.folders.find((folder) => folder.name === "math");
		const algebra = math?.folders.find((folder) => folder.name === "algebra");
		const linear = algebra?.folders.find((folder) => folder.name === "linear");
		expect(linear?.articles[0]).toMatchObject({
			name: "vector",
			path: "math/algebra/linear/vector",
			url: "/posts/math/algebra/linear/vector/",
		});
	});

	it("treats index.md as an article at the directory route", () => {
		const root = buildContentTree([
			createPost("index.md"),
			createPost("guides/index.md"),
		]);

		expect(root.folders).toHaveLength(0);
		expect(root.articles).toEqual(
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

	it("uses _index.md as a folder landing article", () => {
		const landing = createPost("guides/_index.md");
		const root = buildContentTree([landing, createPost("guides/setup.md")]);
		const guides = root.folders[0];

		expect(guides).toMatchObject({
			name: "guides",
			path: "guides",
			url: "/posts/guides/",
		});
		expect(guides.landingArticle).toMatchObject({
			name: "guides",
			path: "guides",
			url: "/posts/guides/",
			isIndex: false,
			entry: landing,
		});
		expect(guides.articles.map((article) => article.name)).toEqual(["setup"]);
	});

	it("sorts folders naturally and articles by pin weight then date", () => {
		const root = buildContentTree([
			createPost("chapter-10/topic.md"),
			createPost("chapter-2/topic.md"),
			createPost("old.md", { published: new Date("2024-01-01") }),
			createPost("pinned.md", { pinWeight: 10 }),
			createPost("new.md", { published: new Date("2026-01-01") }),
		]);

		expect(root.folders.map((folder) => folder.name)).toEqual([
			"chapter-2",
			"chapter-10",
		]);
		expect(root.articles.map((article) => article.name)).toEqual([
			"pinned",
			"new",
			"old",
		]);
	});
});

describe("flattenFolders", () => {
	it("returns non-root folders in depth-first order", () => {
		const root = buildContentTree([
			createPost("a/child/article.md"),
			createPost("b/article.md"),
		]);

		expect(flattenFolders(root).map((folder) => folder.path)).toEqual([
			"a",
			"a/child",
			"b",
		]);
	});
});

describe("flattenContentRoutes", () => {
	it("flattens article and folder routes in tree order", () => {
		const root = buildContentTree([
			createPost("C.md"),
			createPost("guides/_index.md"),
			createPost("guides/setup.md"),
			createPost("reference/api.md"),
		]);

		expect(
			flattenContentRoutes(root).map((route) => ({
				type: route.type,
				path: route.node.path,
			})),
		).toEqual([
			{ type: "article", path: "C" },
			{ type: "folder", path: "guides" },
			{ type: "article", path: "guides/setup" },
			{ type: "folder", path: "reference" },
			{ type: "article", path: "reference/api" },
		]);
	});

	it("represents a landing article only through its folder route", () => {
		const routes = flattenContentRoutes(
			buildContentTree([createPost("guides/_index.md")]),
		);

		expect(routes).toHaveLength(1);
		expect(routes[0]).toMatchObject({
			type: "folder",
			node: { path: "guides", url: "/posts/guides/" },
		});
	});

	it("emits index.md as an article route", () => {
		const routes = flattenContentRoutes(
			buildContentTree([createPost("guides/index.md")]),
		);

		expect(routes).toHaveLength(1);
		expect(routes[0]).toMatchObject({
			type: "article",
			node: { path: "guides", url: "/posts/guides/", isIndex: true },
		});
	});

	it("produces extension-free unique URLs for a valid tree", () => {
		const routes = flattenContentRoutes(
			buildContentTree([
				createPost("C.md"),
				createPost("guides/_index.md"),
				createPost("guides/setup.mdx"),
			]),
		);
		const urls = routes.map((route) => route.node.url);

		expect(new Set(urls).size).toBe(urls.length);
		for (const route of routes) {
			expect(route.node.path).not.toMatch(/\.(md|mdx)$/);
		}
	});
});
