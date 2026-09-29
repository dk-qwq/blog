import { describe, expect, it } from "vitest";
import { searchMetadata } from "./search-utils";

const entries = [
	{
		url: "/blog/posts/vue/",
		title: "Vue guide",
		description: '<img src=x onerror="alert(1)">',
		tags: ["TypeScript"],
	},
	{
		url: "/blog/posts/math/",
		title: "数学笔记",
		description: "线性代数",
		tags: ["课程"],
	},
];
describe("development metadata search", () => {
	it("searches real titles, descriptions and tags case-insensitively", () => {
		expect(searchMetadata(entries, "VUE typescript")[0].url).toBe(
			"/blog/posts/vue/",
		);
		expect(searchMetadata(entries, "线性代数")[0].meta.title).toBe("数学笔记");
	});
	it("returns no mock results for blank or unmatched queries", () => {
		expect(searchMetadata(entries, "  ")).toEqual([]);
		expect(searchMetadata(entries, "not-present")).toEqual([]);
	});
	it("escapes HTML before rendering excerpts", () => {
		expect(searchMetadata(entries, "vue")[0].excerpt).toBe(
			"&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
		);
	});
});
