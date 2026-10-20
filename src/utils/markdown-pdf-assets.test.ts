import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	getFilePath,
	inspectImports,
	MarkdownAssets,
} from "./markdown-pdf-assets";

function file(path: string, folder = false): File {
	const result = new File([path], path.split("/").at(-1) ?? path);
	if (folder)
		Object.defineProperty(result, "webkitRelativePath", { value: path });
	return result;
}

describe("Markdown image imports", () => {
	let assets: MarkdownAssets;
	let created = 0;
	beforeEach(() => {
		created = 0;
		vi.spyOn(URL, "createObjectURL").mockImplementation(
			() => `blob:${++created}`,
		);
		vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
		assets = new MarkdownAssets();
	});
	afterEach(() => {
		assets.dispose();
		vi.restoreAllMocks();
	});

	it("accepts Markdown and supported image extensions, excluding arbitrary files", () => {
		const md = file("博客.MD");
		const markdown = file("README.markdown");
		const images = [
			"a.PNG",
			"b.jpeg",
			"c.webp",
			"d.gif",
			"e.avif",
			"f.svg",
		].map((path) => file(path));
		expect(
			inspectImports([
				md,
				markdown,
				...images,
				file("script.js"),
				file("x.html"),
			]),
		).toEqual({ markdownFiles: [md, markdown], imageFiles: images });
		expect(getFilePath(file("blog/posts/文章.md", true))).toBe(
			"blog/posts/文章.md",
		);
	});

	it("resolves relative paths from a directory-selected Markdown document", () => {
		const photo = file("blog/images/图 1.png", true);
		assets.add([photo]);
		expect(
			assets.resolve("../images/图%201.png?v=2#preview", "blog/posts/文章.md"),
		).toBe("blob:1");
		expect(assets.resolve("../images/./图 1.png", "blog/posts/文章.md")).toBe(
			"blob:1",
		);
		expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
		expect(URL.createObjectURL).toHaveBeenCalledWith(photo);
	});

	it("keeps encoded punctuation as part of the actual filename", () => {
		assets.add([file("images/图#1?.png", true)]);
		expect(assets.resolve("images/图%231%3F.png", "post.md")).toBe("blob:1");
	});

	it("supports separately added images and matching directory suffixes", () => {
		assets.add([file("figure.png")]);
		expect(assets.resolve("./assets/figure.png", "post.md")).toBe("blob:1");
		assets.add([file("chosen/assets/chart.svg", true)]);
		expect(assets.resolve("assets/chart.svg", "post.md")).toBe("blob:2");
	});

	it("selects an exact path ahead of other files with the same basename", () => {
		const correct = file("book/a/chart.png", true);
		assets.add([correct, file("book/b/chart.png", true)]);
		expect(assets.resolve("chart.png", "book/a/post.md")).toBe("blob:1");
		expect(URL.createObjectURL).toHaveBeenCalledWith(correct);
	});

	it("does not guess between ambiguous suffixes or same-name loose files", () => {
		assets.add([
			file("one/assets/chart.png", true),
			file("two/assets/chart.png", true),
			file("chart.png"),
		]);
		expect(assets.resolve("assets/chart.png", "post.md")).toBeNull();
		expect(assets.resolve("missing/chart.png", "post.md")).toBeNull();
		assets.add([file("photo.png"), file("photo.png")]);
		expect(assets.resolve("photo.png", "post.md")).toBeNull();
		expect(URL.createObjectURL).not.toHaveBeenCalled();
	});

	it("does not substitute a known directory image from an unrelated directory", () => {
		assets.add([file("book/other/chart.png", true)]);
		expect(assets.resolve("images/chart.png", "book/post.md")).toBeNull();
	});

	it("rejects traversal above the import root, remote URLs and invalid encodings", () => {
		assets.add([file("photo.png")]);
		for (const path of [
			"../photo.png",
			"%2e%2e/photo.png",
			"https://example.com/photo.png",
			"//example.com/photo.png",
			"data:image/png;base64,photo.png",
			"file:///photo.png",
			"javascript:photo.png",
			"https%3A/photo.png",
			"images%2Fphoto.png",
			"%ZZ/photo.png",
			"#photo.png",
			"",
		]) {
			expect(assets.resolve(path, "post.md"), path).toBeNull();
		}
	});

	it("handles root paths and Windows relative separators", () => {
		assets.add([file("images/photo.png", true)]);
		expect(assets.resolve("/images/photo.png", "posts/post.md")).toBe("blob:1");
		expect(assets.resolve("..\\images\\photo.png", "posts/post.md")).toBe(
			"blob:1",
		);
	});

	it("reuses URLs, revokes replaced assets and releases all remaining URLs", () => {
		const original = file("photo.png");
		assets.add([original]);
		expect(assets.resolve("photo.png", "post.md")).toBe("blob:1");
		assets.add([original]);
		expect(assets.resolve("photo.png", "post.md")).toBe("blob:1");
		expect(URL.revokeObjectURL).not.toHaveBeenCalled();
		assets.add([file("photo.png"), file("unviewed.png")]);
		expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:1");
		expect(assets.resolve("photo.png", "post.md")).toBe("blob:2");
		assets.dispose();
		assets.dispose();
		expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
		expect(URL.revokeObjectURL).toHaveBeenLastCalledWith("blob:2");
		expect(assets.resolve("photo.png", "post.md")).toBeNull();
	});
});
