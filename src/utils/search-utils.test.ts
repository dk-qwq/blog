import { describe, expect, it } from "vitest";
import type { SearchEntry, SearchResult } from "@/types/search";
import { getSearchSections, searchMetadata } from "./search-utils";

const entries: SearchEntry[] = [
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
		sections: [{ url: "/blog/posts/math/#%E7%9F%A9%E9%98%B5", title: "矩阵" }],
	},
	{
		url: "/blog/posts/templates/",
		title: "算法板子",
		description: "模板汇总",
		tags: ["OI"],
		sections: [
			{ url: "/blog/posts/templates/#sos-dp", title: "SOS DP" },
			{ url: "/blog/posts/templates/#fenwicktree2d", title: "FenwickTree2D" },
		],
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
	it("finds section titles and preserves their rendered anchor URLs", () => {
		expect(searchMetadata(entries, "oi sos dp")[0].sub_results).toEqual([
			{ url: "/blog/posts/templates/#sos-dp", title: "SOS DP", excerpt: "" },
		]);
		expect(searchMetadata(entries, "矩阵")[0].sub_results?.[0].url).toBe(
			"/blog/posts/math/#%E7%9F%A9%E9%98%B5",
		);
	});
	it("does not combine unrelated headings or add sections for metadata-only hits", () => {
		expect(searchMetadata(entries, "sos fenwick")).toEqual([]);
		expect(searchMetadata(entries, "模板")[0].sub_results).toEqual([]);
	});
});

describe("section search results", () => {
	const result: SearchResult = {
		url: "/blog/posts/templates/",
		meta: { title: "算法板子" },
		excerpt: "Article excerpt",
	};
	it("keeps page-only results usable without sections", () => {
		expect(getSearchSections(result)).toEqual([]);
		expect(
			getSearchSections({
				...result,
				sub_results: [
					{
						url: result.url,
						title: result.meta.title,
						excerpt: result.excerpt,
					},
				],
			}),
		).toEqual([]);
	});
	it("omits page hits, empty anchors and duplicate sections while retaining excerpts", () => {
		const section = {
			url: `${result.url}#sos-dp`,
			title: "SOS DP",
			excerpt: "A <mark>SOS</mark> example",
		};
		expect(
			getSearchSections({
				...result,
				sub_results: [
					{ ...section, url: result.url },
					{ ...section, url: `${result.url}#` },
					{ ...section, title: " " },
					{ ...section, url: "/blog/posts/other/#sos-dp" },
					section,
					section,
				],
			}),
		).toEqual([section]);
	});
	it("limits each article to its first three distinct section matches", () => {
		const sections = Array.from({ length: 5 }, (_, index) => ({
			url: `${result.url}#section-${index}`,
			title: `Section ${index}`,
			excerpt: "",
		}));
		expect(getSearchSections({ ...result, sub_results: sections })).toEqual(
			sections.slice(0, 3),
		);
	});
});
