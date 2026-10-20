<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import {
	getFilePath,
	inspectImports,
	MarkdownAssets,
} from "../utils/markdown-pdf-assets";
import {
	createDocumentPreview,
	type DocumentPreview,
} from "../utils/markdown-pdf-preview";

const frame = ref<HTMLIFrameElement>();
const fileInput = ref<HTMLInputElement>();
const folderInput = ref<HTMLInputElement>();
const mobileView = ref<"editor" | "preview">("editor");
const hasPreview = ref(false);
const documents = ref<File[]>([]);
const currentPath = ref("");
const source = ref("");
const title = ref("");
const busy = ref(false);
const ready = ref(false);
const error = ref("");
const warnings = ref<string[]>([]);
const dragging = ref(false);
const assets = new MarkdownAssets();
let preview: DocumentPreview | undefined;
let controller: AbortController | undefined;
let revision = 0;
let readRevision = 0;
let importRevision = 0;
const reading = ref(false);
const drafts = new Map<string, string>();
let renderTimer: ReturnType<typeof setTimeout> | undefined;
let composing = false;
let shortcutDocument: Document | null = null;
let disposed = false;
let dragDepth = 0;
const status = computed(() =>
	busy.value
		? "正在同步预览…"
		: ready.value
			? "预览已同步"
			: error.value
				? "预览未更新"
				: "等待输入 Markdown",
);
const lineCount = computed(() => source.value.split("\n").length);

function cancelScheduledRender() {
	clearTimeout(renderTimer);
	renderTimer = undefined;
}

function invalidatePreview() {
	cancelScheduledRender();
	++revision;
	controller?.abort();
	preview?.invalidate();
	ready.value = false;
}

function schedulePreview() {
	if (disposed || reading.value) return;
	if (!currentPath.value) {
		currentPath.value = "未命名.md";
		documents.value = [
			new File([], currentPath.value, { type: "text/markdown" }),
		];
	}
	drafts.set(currentPath.value, source.value);
	invalidatePreview();
	error.value = "";
	warnings.value = [];
	if (!source.value.trim()) {
		clearPreview();
		hasPreview.value = false;
		busy.value = false;
		if (frame.value) frame.value.srcdoc = "";
		return;
	}
	busy.value = true;
	if (!composing) renderTimer = setTimeout(() => void renderSource(), 300);
}

function onSourceInput(event: Event) {
	source.value = (event.target as HTMLTextAreaElement).value;
	schedulePreview();
}

function onCompositionEnd(event: CompositionEvent) {
	composing = false;
	onSourceInput(event);
}

function onCompositionStart() {
	composing = true;
	invalidatePreview();
	busy.value = Boolean(source.value.trim());
}

function clearPreview() {
	controller?.abort();
	preview?.dispose();
	preview = undefined;
	ready.value = false;
}

async function renderSource() {
	cancelScheduledRender();
	if (disposed || reading.value || !currentPath.value) return;
	if (!source.value.trim()) {
		clearPreview();
		hasPreview.value = false;
		busy.value = false;
		if (frame.value) frame.value.srcdoc = "";
		return;
	}
	const run = ++revision;
	clearPreview();
	controller = new AbortController();
	const signal = controller.signal;
	error.value = "";
	warnings.value = [];
	busy.value = true;
	try {
		const { renderMarkdownDocument } = await import(
			"../utils/markdown-pdf-renderer"
		);
		const result = await renderMarkdownDocument(
			source.value,
			currentPath.value
				.split("/")
				.pop()
				?.replace(/\.(md|markdown)$/i, "") || "未命名文档",
		);
		if (run !== revision || signal.aborted) return;
		title.value = result.title;
		await nextTick();
		if (!frame.value) throw new Error("预览区域尚未准备好，请重试。");
		const next = await createDocumentPreview(
			frame.value,
			result,
			assets,
			currentPath.value,
			signal,
			() => {
				error.value = "无法打开打印窗口，请更新预览后重试。";
			},
		);
		if (run !== revision || signal.aborted) {
			next.dispose();
			return;
		}
		preview = next;
		hasPreview.value = true;
		warnings.value = [...new Set([...result.warnings, ...next.warnings])];
		ready.value = true;
	} catch (cause) {
		if (run !== revision || signal.aborted) return;
		error.value =
			cause instanceof Error
				? cause.message
				: "文档渲染失败，请检查 Markdown 后重试。";
	} finally {
		if (run === revision) busy.value = false;
	}
}

async function selectDocument(path: string) {
	if (disposed) return;
	const file = documents.value.find((item) => getFilePath(item) === path);
	if (!file) return;
	if (currentPath.value && !reading.value)
		drafts.set(currentPath.value, source.value);
	cancelScheduledRender();
	++importRevision;
	const read = ++readRevision;
	++revision;
	clearPreview();
	reading.value = true;
	hasPreview.value = false;
	currentPath.value = path;
	source.value = "";
	title.value = "";
	warnings.value = [];
	busy.value = true;
	error.value = "";
	try {
		if (file.size > 5 * 1024 * 1024)
			throw new Error("这份 Markdown 超过 5 MB，请拆成较小的文档后导入。");
		const text = drafts.get(path) ?? (await file.text());
		if (disposed || read !== readRevision) return;
		source.value = text;
		reading.value = false;
		await renderSource();
	} catch (cause) {
		if (disposed || read !== readRevision) return;
		reading.value = false;
		error.value = cause instanceof Error ? cause.message : "无法读取文件。";
		busy.value = false;
	}
}

async function importFiles(files: File[]) {
	if (disposed) return;
	++importRevision;
	const { markdownFiles, imageFiles } = inspectImports(files);
	if (!markdownFiles.length && !imageFiles.length) {
		error.value = "请选择 .md / .markdown 文件，或文档引用的图片。";
		return;
	}
	assets.add(imageFiles);
	if (markdownFiles.length) {
		const merged = new Map(
			documents.value.map((file) => [getFilePath(file), file]),
		);
		for (const file of markdownFiles) {
			merged.set(getFilePath(file), file);
			drafts.delete(getFilePath(file));
		}
		if (markdownFiles.some((file) => getFilePath(file) === currentPath.value)) {
			currentPath.value = "";
		}
		documents.value = [...merged.values()];
		await selectDocument(getFilePath(markdownFiles[0]));
	} else if (currentPath.value && !reading.value) {
		await renderSource();
	} else if (!currentPath.value) {
		error.value = "图片已准备好，再导入 Markdown 即可。";
	}
}

function onFileInput(event: Event) {
	const input = event.target as HTMLInputElement;
	const files = Array.from(input.files || []);
	input.value = "";
	if (files.length) void importFiles(files);
}

interface DroppedEntry {
	isFile: boolean;
	isDirectory: boolean;
	name: string;
	file(
		callback: (file: File) => void,
		error: (error: DOMException) => void,
	): void;
	createReader(): {
		readEntries(
			callback: (entries: DroppedEntry[]) => void,
			error: (error: DOMException) => void,
		): void;
	};
}

async function readEntry(
	entry: DroppedEntry,
	importRun: number,
	parent = "",
): Promise<File[]> {
	if (disposed || importRun !== importRevision) return [];
	const path = `${parent}${entry.name}`;
	if (entry.isFile) {
		const file = await new Promise<File>((resolve, reject) =>
			entry.file(resolve, reject),
		);
		if (disposed || importRun !== importRevision) return [];
		Object.defineProperty(file, "webkitRelativePath", {
			value: path,
			configurable: true,
		});
		return [file];
	}
	if (!entry.isDirectory) return [];
	const reader = entry.createReader();
	const files: File[] = [];
	for (;;) {
		const batch = await new Promise<DroppedEntry[]>((resolve, reject) =>
			reader.readEntries(resolve, reject),
		);
		if (disposed || importRun !== importRevision) return [];
		if (!batch.length) break;
		for (const child of batch)
			files.push(...(await readEntry(child, importRun, `${path}/`)));
	}
	return files;
}

async function onDrop(event: DragEvent) {
	if (disposed) return;
	if (!event.dataTransfer?.types.includes("Files")) return;
	event.preventDefault();
	const importRun = ++importRevision;
	dragDepth = 0;
	dragging.value = false;
	const transfer = event.dataTransfer;
	if (!transfer) return;
	// Capture entries synchronously, while the drop's data store is available.
	const entries = Array.from(transfer.items)
		.map((item) => item.webkitGetAsEntry?.())
		.filter(Boolean) as unknown as DroppedEntry[];
	const fallback = Array.from(transfer.files);
	try {
		const files = entries.length
			? (
					await Promise.all(entries.map((entry) => readEntry(entry, importRun)))
				).flat()
			: fallback;
		if (disposed || importRun !== importRevision) return;
		await importFiles(files);
	} catch {
		if (disposed || importRun !== importRevision) return;
		error.value = "无法读取拖入的文件夹，请使用“选择文件夹”重新导入。";
	}
}

function clear() {
	cancelScheduledRender();
	++revision;
	++readRevision;
	++importRevision;
	reading.value = false;
	composing = false;
	clearPreview();
	assets.dispose();
	drafts.clear();
	hasPreview.value = false;
	mobileView.value = "editor";
	documents.value = [];
	currentPath.value = "";
	source.value = "";
	title.value = "";
	busy.value = false;
	error.value = "";
	warnings.value = [];
	if (frame.value) frame.value.srcdoc = "";
}

async function print() {
	if (!ready.value || busy.value || !preview) return;
	const current = preview;
	mobileView.value = "preview";
	await nextTick();
	if (!ready.value || busy.value || preview !== current) return;
	error.value = "";
	try {
		current.print();
	} catch {
		error.value = "无法打开打印窗口，请更新预览后重试。";
	}
}

function onPrintShortcut(event: KeyboardEvent) {
	if (
		(event.ctrlKey || event.metaKey) &&
		event.key.toLowerCase() === "p" &&
		currentPath.value
	) {
		event.preventDefault();
		event.stopImmediatePropagation();
		void print();
	}
}

function attachFrameShortcuts() {
	shortcutDocument?.removeEventListener("keydown", onPrintShortcut, true);
	shortcutDocument = frame.value?.contentDocument ?? null;
	shortcutDocument?.addEventListener("keydown", onPrintShortcut, true);
}

function onDragEnter(event: DragEvent) {
	if (!event.dataTransfer?.types.includes("Files")) return;
	event.preventDefault();
	++dragDepth;
	dragging.value = true;
}

function onDragOver(event: DragEvent) {
	if (event.dataTransfer?.types.includes("Files")) event.preventDefault();
}

function onDragLeave(event: DragEvent) {
	if (!dragging.value) return;
	event.preventDefault();
	dragDepth = Math.max(0, dragDepth - 1);
	dragging.value = dragDepth > 0;
}

function loadExample() {
	void importFiles([
		new File(
			[
				`---
title: 一份可以打印的 Markdown
---

这份示例沿用博客的正文、公式和代码样式。导入你的原稿后，点击 **打印 / 保存 PDF** 即可。

## 公式与代码

行内公式 $a^2+b^2=c^2$，以及独立公式：

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

\`\`\`cpp
long long sum(long long n) {
    return n * (n + 1) / 2;
}
\`\`\`

:::tip[保持原来的写法]
公式、提示框和代码块都可以直接写在 Markdown 中。
:::

## 表格与折叠内容

| 内容 | 打印方式 |
| --- | --- |
| 中文与公式 | 保留排版 |
| 折叠内容 | 打印时自动展开 |

<details>
<summary>展开看看</summary>

这里的内容在打印时也会完整显示。

</details>
`,
			],
			"示例.md",
			{ type: "text/markdown" },
		),
	]);
}

onMounted(() => window.addEventListener("keydown", onPrintShortcut));
onBeforeUnmount(() => {
	disposed = true;
	cancelScheduledRender();
	++revision;
	++readRevision;
	++importRevision;
	clearPreview();
	assets.dispose();
	drafts.clear();
	shortcutDocument?.removeEventListener("keydown", onPrintShortcut, true);
	window.removeEventListener("keydown", onPrintShortcut);
});
</script>


<template>
  <section class="pdf-tool text-75" :class="{ dragging }" aria-label="Markdown 转 PDF" data-testid="markdown-dropzone" @dragenter="onDragEnter" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <header class="tool-toolbar">
      <div class="tool-title"><span class="file-symbol" aria-hidden="true">MD</span><div><h1>Markdown 转 PDF</h1><p>边写边预览，按博客样式打印。</p></div></div>
      <div class="toolbar-actions">
        <button type="button" class="secondary-button" @click="fileInput?.click()">导入文件 / 图片</button>
        <button type="button" class="secondary-button" @click="folderInput?.click()">选择文件夹</button>
        <button type="button" class="text-button" @click="loadExample">加载示例</button>
        <button type="button" class="text-button" :disabled="!currentPath && !source" @click="clear">清空</button>
        <button type="button" class="primary-button" :disabled="!ready || busy" @click="print">打印 / 保存 PDF</button>
      </div>
      <input ref="fileInput" data-testid="markdown-files" type="file" accept=".md,.markdown,.png,.jpg,.jpeg,.webp,.gif,.avif,.svg" multiple hidden aria-label="导入 Markdown 或图片" @change="onFileInput" />
      <input ref="folderInput" data-testid="markdown-folder" type="file" webkitdirectory multiple hidden aria-label="导入文档文件夹" @change="onFileInput" />
    </header>
    <div class="document-strip">
      <label v-if="documents.length > 1" class="document-picker">当前文档<select :value="currentPath" aria-label="当前文档" @change="selectDocument(($event.target as HTMLSelectElement).value)"><option v-for="file in documents" :key="getFilePath(file)" :value="getFilePath(file)">{{ getFilePath(file) }}</option></select></label>
      <span v-else class="document-name" :title="currentPath">{{ currentPath || '未命名.md' }}</span>
      <span class="sync-status" :class="{ syncing: busy }" role="status" aria-live="polite"><span aria-hidden="true" class="status-dot" />{{ status }}</span>
    </div>
    <div v-if="error" class="notice error" role="alert">{{ error }}</div>
    <details v-if="warnings.length" class="notice warning" role="alert"><summary>{{ warnings.length }} 处内容需要留意</summary><ul><li v-for="warning in warnings" :key="warning">{{ warning }}</li></ul></details>
    <div class="mobile-tabs" role="tablist" aria-label="编辑与预览">
      <button id="editor-tab" type="button" role="tab" :aria-selected="mobileView === 'editor'" aria-controls="markdown-editor-panel" @click="mobileView = 'editor'">编辑</button>
      <button id="preview-tab" type="button" role="tab" :aria-selected="mobileView === 'preview'" aria-controls="markdown-preview-panel" @click="mobileView = 'preview'">预览</button>
    </div>
    <div class="workspace">
      <section id="markdown-editor-panel" class="editor-pane pane" :class="{ 'mobile-inactive': mobileView !== 'editor' }" aria-label="编辑 Markdown">
        <header class="pane-header"><label for="markdown-source">Markdown 原稿</label><span>自动预览</span></header>
        <textarea id="markdown-source" :value="source" :disabled="reading" spellcheck="false" wrap="off" aria-label="Markdown 原稿" placeholder="# 从这里开始写作&#10;&#10;在这里输入或粘贴 Markdown，右侧会自动更新。&#10;&#10;也可以把原稿和图片拖进来。&#10;&#10;支持公式、代码块、表格和博客提示框。" @input="onSourceInput" @compositionstart="onCompositionStart" @compositionend="onCompositionEnd" />
        <footer class="pane-footer"><span>{{ lineCount }} 行 · {{ source.length.toLocaleString() }} 字符</span><span>Markdown</span></footer>
      </section>
      <section id="markdown-preview-panel" class="preview-pane pane" :class="{ 'mobile-inactive': mobileView !== 'preview' }" :aria-busy="busy" aria-label="预览文档">
        <header class="pane-header"><span>文档预览</span><span>A4 · 分页以打印窗口为准</span></header>
        <div class="preview-scroll">
          <iframe ref="frame" title="文档预览" sandbox="allow-same-origin allow-modals" :style="{ visibility: hasPreview ? undefined : 'hidden' }" @load="attachFrameShortcuts" />
          <div v-if="!hasPreview" class="empty-preview"><span class="empty-symbol" aria-hidden="true">MD → PDF</span><strong>{{ busy ? '正在准备预览…' : '预览会显示在这里' }}</strong><p>{{ busy ? '首次渲染可能需要几秒。' : '在编辑区输入，或导入一份 Markdown。' }}</p></div>
        </div>
        <footer class="pane-footer"><span>{{ busy ? '正在更新，完成后即可打印' : ready ? '折叠内容会在打印时展开' : '等待文档内容' }}</span><span>浏览器打印</span></footer>
      </section>
    </div>
    <footer class="workspace-footer"><span>拖入 MD 或图片即可导入 · 文件在当前浏览器处理</span><span>Ctrl / ⌘ + P 保存 PDF</span></footer>
    <div v-if="dragging" class="drop-overlay" aria-hidden="true"><strong>松开即可导入</strong><span>Markdown 原稿、图片或整个文件夹</span></div>
  </section>
</template>

<style scoped>
.pdf-tool { position: relative; display: flex; flex-direction: column; height: calc(100dvh - 6.5rem); min-height: 36rem; padding: 1.25rem; gap: .75rem; min-width: 0; background: var(--card-bg); border-radius: 1rem; }
.tool-toolbar, .toolbar-actions, .tool-title, .document-strip, .document-picker, .pane-header, .pane-footer, .workspace-footer { display: flex; align-items: center; }
.tool-toolbar { justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.tool-title { gap: .75rem; flex-shrink: 0; }
.file-symbol { display: flex; align-items: center; justify-content: center; width: 2.6rem; height: 2.8rem; color: var(--btn-content); background: var(--btn-regular-bg); border-radius: .65rem; font-family: 'JetBrains Mono Variable', monospace; font-size: .85rem; font-weight: 750; }
h1 { font-size: 1.3rem; font-weight: 750; line-height: 1.4; }
.tool-title p { font-size: .75rem; margin-top: .1rem; opacity: .6; }
.toolbar-actions { gap: .4rem; flex-wrap: wrap; }
button { border-radius: .5rem; padding: .55rem .75rem; font-size: .8rem; font-weight: 600; cursor: pointer; transition: background .15s, opacity .15s; white-space: nowrap; }
button:focus-visible, select:focus-visible, textarea:focus-visible, summary:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
button:disabled { opacity: .4; cursor: not-allowed; }
.primary-button { background: var(--primary); color: #191221; }
.primary-button:hover:not(:disabled) { filter: brightness(1.07); }
.secondary-button { background: var(--btn-regular-bg); color: var(--btn-content); }
.text-button { color: var(--btn-content); }
.text-button:hover:not(:disabled) { background: var(--btn-plain-bg-hover); }
.document-strip { justify-content: space-between; min-height: 2rem; gap: .75rem; padding: .25rem .1rem; font-size: .78rem; }
.document-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.document-picker { min-width: 0; gap: .5rem; }
select { min-width: 0; max-width: 28rem; background: var(--btn-regular-bg); color: var(--btn-content); padding: .3rem .5rem; border-radius: .4rem; }
.sync-status { display: flex; align-items: center; gap: .4rem; white-space: nowrap; opacity: .65; font-size: .75rem; }
.status-dot { width: .4rem; height: .4rem; background: var(--primary); border-radius: 50%; }
.syncing .status-dot { animation: pulse 1s ease-in-out infinite alternate; }
.workspace { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1rem; min-height: 0; flex: 1; }
.pane { display: flex; flex-direction: column; min-width: 0; min-height: 0; border: 1px solid var(--line-divider); border-radius: .75rem; overflow: hidden; }
.pane-header, .pane-footer { justify-content: space-between; gap: .5rem; padding: .7rem 1rem; background: var(--btn-regular-bg); font-size: .75rem; flex-shrink: 0; }
.pane-header { color: var(--btn-content); font-weight: 600; }
.pane-header > :last-child { font-size: .7rem; font-weight: 400; opacity: .75; }
.pane-footer { padding: .45rem 1rem; font-size: .68rem; color: var(--btn-content); opacity: .85; }
textarea { flex: 1; min-height: 0; width: 100%; padding: 1.2rem; border: 0; resize: none; outline: none; color: inherit; background: var(--card-bg); font-family: 'JetBrains Mono Variable', ui-monospace, monospace; font-size: .84rem; line-height: 1.85; tab-size: 4; overflow: auto; }
textarea:focus-visible { outline-offset: -2px; }
textarea::placeholder { color: inherit; opacity: .35; }
.preview-scroll { position: relative; overflow: auto; flex: 1; min-height: 0; background: white; overscroll-behavior: contain; overflow-anchor: none; }
iframe { display: block; width: 100%; min-height: 240px; border: 0; background: white; }
.empty-preview { position: absolute; inset: 0; min-height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .8rem; padding: 1rem; text-align: center; color: #64748b; }
.empty-symbol { font: 600 .85rem 'JetBrains Mono Variable', monospace; letter-spacing: .05em; color: #94a3b8; border: 1px solid #e2e8f0; border-radius: .75rem; padding: .9rem 1.1rem; margin-bottom: .5rem; }
.empty-preview strong { color: #475569; font-size: .9rem; font-weight: 600; }
.empty-preview p { font-size: .75rem; }
.workspace-footer { justify-content: space-between; flex-wrap: wrap; gap: .35rem; font-size: .68rem; opacity: .5; }
.notice { padding: .6rem .9rem; border-radius: .5rem; font-size: .78rem; line-height: 1.6; overflow-wrap: anywhere; flex-shrink: 0; max-height: 8rem; overflow: auto; }
.notice ul { list-style: disc; padding-left: 1.25rem; margin-top: .4rem; }
.notice summary { cursor: pointer; }
.error { background: #be123c12; color: #e11d48; border: 1px solid #be123c33; }
.warning { background: var(--btn-regular-bg); color: var(--btn-content); }
.mobile-tabs { display: none; }
.drop-overlay { position: absolute; inset: 0; z-index: 5; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .75rem; color: var(--btn-content); background: var(--card-bg); opacity: .97; border: 2px dashed var(--primary); border-radius: 1rem; pointer-events: none; }
.drop-overlay strong { font-size: 1.4rem; }
.drop-overlay span { font-size: .85rem; opacity: .7; }
@keyframes pulse { from { opacity: .3; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .syncing .status-dot { animation: none; } }
@media (max-width: 899px) {
  .pdf-tool { height: calc(100dvh - 6rem); min-height: 34rem; padding: .9rem; gap: .65rem; }
  .tool-toolbar { gap: .75rem; }
  .tool-title { width: 100%; }
  h1 { font-size: 1.2rem; }
  .toolbar-actions { width: 100%; gap: .3rem; }
  button { padding: .5rem .6rem; font-size: .75rem; }
  .toolbar-actions .primary-button { margin-left: auto; }
  .document-strip { font-size: .72rem; }
  .document-picker { flex: 1; overflow: hidden; white-space: nowrap; }
  select { max-width: 100%; width: 100%; }
  .sync-status { font-size: .67rem; }
  .mobile-tabs { display: flex; gap: .25rem; background: var(--btn-regular-bg); padding: .2rem; border-radius: .5rem; }
  .mobile-tabs button { flex: 1; color: var(--btn-content); }
  .mobile-tabs button[aria-selected="true"] { background: var(--card-bg); box-shadow: 0 1px 3px #0000000d; }
  .workspace { grid-template-columns: minmax(0, 1fr); gap: 0; }
  .pane { grid-area: 1 / 1; }
  .mobile-inactive { visibility: hidden; pointer-events: none; }
  .workspace-footer > :last-child { display: none; }
  textarea { padding: 1rem; font-size: .82rem; }
  .pane-header { padding: .65rem .8rem; }
  .pane-footer { padding: .4rem .8rem; }
}
</style>
