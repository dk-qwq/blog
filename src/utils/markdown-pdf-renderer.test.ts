import { describe, expect, it } from "vitest";
import { renderMarkdownDocument } from "./markdown-pdf-renderer";

describe("local Markdown document rendering", () => {
	it("reads YAML, GFM and math without printing frontmatter", async () => {
		const result = await renderMarkdownDocument(`---
title: 算法笔记
description: "公式、表格与脚注"
---
# 算法笔记

| 方法 | 时间 |
| --- | --- |
| 倍增 | $O(\\log n)$ |

- [x] 已完成

结论[^proof]。

[^proof]: 证明。

$$
\\sum_{i=1}^n i=\\frac{n(n+1)}{2}
$$
`);
		expect(result.title).toBe("算法笔记");
		expect(result.description).toBe("公式、表格与脚注");
		expect(result.hasBodyTitle).toBe(true);
		expect(result.html).toContain("<table>");
		expect(result.html).toContain('type="checkbox"');
		expect(result.html).toContain('class="katex"');
		expect(result.html).toContain('class="katex-display"');
		expect(result.html).toContain("data-footnote-ref");
		for (const [, id] of result.html.matchAll(/href="#([^"]+)"/g)) {
			expect(result.html).toContain(`id="${id}"`);
		}
		expect(result.html).not.toContain("description:");
		expect(result.warnings).toEqual([]);
	});

	it("keeps imported anchors and footnote labels linked after sanitization", async () => {
		const result = await renderMarkdownDocument(`<h2 id="自定义">标题</h2>

[跳转](#%E8%87%AA%E5%AE%9A%E4%B9%89)

正文[^proof]。

[^proof]: 证明。
`);
		expect(result.html).toContain('href="#user-content-自定义"');
		for (const [, id] of result.html.matchAll(/href="#([^"]+)"/g)) {
			expect(result.html).toContain(`id="${id}"`);
		}
		for (const [, id] of result.html.matchAll(/aria-describedby="([^"]+)"/g)) {
			expect(result.html).toContain(`id="${id}"`);
		}
	});

	it("reuses blog admonitions and preserves details and spoilers", async () => {
		const result = await renderMarkdownDocument(`:::note[自定义标题]
重要内容。
:::

> [!TIP]
> 提示内容。

<details><summary>展开答案</summary><p>答案。</p></details>

<spoiler>隐藏文字</spoiler>
`);
		expect(result.html).toContain('class="admonition bdm-note"');
		expect(result.html).toContain('class="bdm-title"><div>自定义标题</div>');
		expect(result.html).toContain('class="admonition bdm-tip"');
		expect(result.html).toContain("<details><summary>展开答案</summary>");
		expect(result.html).toContain("<spoiler>隐藏文字</spoiler>");
	});

	it("renders code highlighting, markers, numbering and collapsible sections", async () => {
		const result = await renderMarkdownDocument(
			'```cpp frame="code" title="solve.cpp" showLineNumbers {2} collapse={3-4}\nint main() {\n  int answer = 42;\n  return answer;\n}\n```',
		);
		expect(result.html).toContain('class="expressive-code"');
		expect(result.html).toContain("<details");
		expect(result.html).toContain("solve.cpp");
		expect(result.html).toContain('class="ln"');
		expect(result.html).toContain("highlight");
		expect(result.html).toContain("answer");
		expect(result.html).toMatch(/style="--0:#[\da-f]{6}/i);
		expect(result.styles.length).toBeGreaterThan(0);
		expect(result.warnings).toEqual([]);
	}, 20_000);

	it("removes executable HTML and unsafe URLs while keeping safe document content", async () => {
		const result = await renderMarkdownDocument(`<script>alert('xss')</script>
<style>body{display:none}</style>
<iframe srcdoc="<script>alert(1)</script>"></iframe>
<img src="figure.png" onerror="alert(1)">
<a href="javascript:alert(1)" onclick="alert(1)">链接</a>
<svg onload="alert(1)"><script>alert(1)</script></svg>
<div style="background:url(https://evil.example/track)" id="location">正文</div>

$$\\href{javascript:alert(1)}{x}$$
`);
		expect(result.html).not.toMatch(
			/<script|<iframe|<style|onerror|onclick|onload|href="javascript:/i,
		);
		expect(result.html).not.toContain("evil.example");
		expect(result.html).toContain('src="figure.png"');
		expect(result.html).toContain("正文");
	});

	it("renders GitHub repositories as safe static cards", async () => {
		const result = await renderMarkdownDocument(
			'::github{repo="withastro/astro"}',
		);
		expect(result.html).toContain('href="https://github.com/withastro/astro"');
		expect(result.html).toContain('data-github-repo="withastro/astro"');
		expect(result.html).not.toContain("<script");
		expect(result.html).not.toContain("Waiting");
	});

	it("falls back to H1 or filename and reports invalid metadata", async () => {
		expect((await renderMarkdownDocument("# 正文标题", "文件名")).title).toBe(
			"正文标题",
		);
		expect((await renderMarkdownDocument("无标题内容。", "文件名")).title).toBe(
			"文件名",
		);
		const invalid = await renderMarkdownDocument(
			"---\ntitle: [\n---\n# 正文标题",
			"文件名",
		);
		expect(invalid.title).toBe("正文标题");
		expect(invalid.warnings).toHaveLength(1);
		expect(invalid.html).not.toContain("title:");
		const different = await renderMarkdownDocument(
			"---\ntitle: 文档标题\n---\n# 章节标题",
		);
		expect(different.hasBodyTitle).toBe(false);
	});
});
