import type { CollectionEntry } from "astro:content";
import { contentCompareFn, type RankableItem } from "./content-utils";

export interface ArticleNode {
	type: "article";
	name: string;
	path: string;
	url: string;
	isIndex: boolean;
	entry: CollectionEntry<"posts">;
}

export interface FolderNode {
	type: "folder";
	name: string;
	path: string;
	url: string;
	landingArticle?: ArticleNode;
	contents: contentNode[];

	// articles: ArticleNode[];
	// folders: FolderNode[];
}

export function getFolders(contents: contentNode[]): FolderNode[] {
	return contents.filter((content) => content.type === "folder");
}

export function getArticles(contents: contentNode[]): ArticleNode[] {
	return contents.filter((content) => content.type === "article");
}

function pickBetterRankable(
	a?: RankableItem,
	b?: RankableItem,
): RankableItem | undefined {
	if (!a || !b) return a ?? b;
	return contentCompareFn(a, b) <= 0 ? a : b;
}

function getRankable(content: contentNode): RankableItem | undefined {
	if (content.type === "article") {
		return content.entry.data;
	}

	if (content.landingArticle !== undefined) {
		return getRankable(content.landingArticle);
	}

	return content.contents
		?.map(getRankable)
		.reduce<RankableItem | undefined>(pickBetterRankable, undefined);
}

export type contentNode = ArticleNode | FolderNode;

export type ContentRouteTarget =
	| {
			type: "article";
			node: ArticleNode;
	  }
	| {
			type: "folder";
			node: FolderNode;
	  };

function removeMarkdownExtension(id: string): string {
	return id.replace(/\.(md|mdx)$/, "");
}

export function getArticlePath(id: string): string {
	const path = removeMarkdownExtension(id);

	if (path === "index") {
		return "";
	}

	if (path.endsWith("/index")) {
		return path.slice(0, -"/index".length);
	}

	if (path.endsWith("/_index")) {
		return path.slice(0, -"/_index".length);
	}

	return path;
}

export function isIndexArticle(id: string): boolean {
	const path = removeMarkdownExtension(id);
	return path === "index" || path.endsWith("/index");
}

export function isLandingArticle(id: string): boolean {
	const path = removeMarkdownExtension(id);
	return path === "_index" || path.endsWith("/_index");
}

export function getPostUrl(path: string): string {
	return path ? `/posts/${path}/` : "/posts/";
}

function getOrCreateFolder(
	parent: FolderNode,
	name: string,
	path: string,
): FolderNode {
	const existingFolder = getFolders(parent.contents).find(
		(folder) => folder.name === name,
	);
	if (existingFolder) {
		return existingFolder;
	}

	const folder: FolderNode = {
		type: "folder",
		name,
		path,
		url: getPostUrl(path),
		contents: [],
	};

	parent.contents.push(folder);
	return folder;
}

export function buildContentTree(
	posts: CollectionEntry<"posts">[],
): FolderNode {
	const root: FolderNode = {
		type: "folder",
		name: "",
		path: "",
		url: "/posts/",
		contents: [],
	};

	for (const entry of posts) {
		const sourcePath = removeMarkdownExtension(entry.id);
		const articlePath = getArticlePath(entry.id);

		const isIndex = isIndexArticle(entry.id);
		const isLanding = isLandingArticle(entry.id);

		const sourceSegments = articlePath.split("/").filter(Boolean);
		const folderSegments = isLanding
			? sourceSegments
			: sourceSegments.slice(0, -1);

		let currentFolder = root;
		let currentPath = "";

		for (const folderName of folderSegments) {
			currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;

			currentFolder = getOrCreateFolder(currentFolder, folderName, currentPath);
		}

		const articleName = isIndex
			? currentFolder.name || "index"
			: (sourceSegments.at(-1) ?? sourcePath);

		const article: ArticleNode = {
			type: "article",
			name: articleName,
			path: articlePath,
			url: getPostUrl(articlePath),
			isIndex,
			entry,
		};

		if (isLanding) {
			currentFolder.landingArticle = article;
		} else {
			currentFolder.contents.push(article);
		}
	}

	sortContentTree(root);

	return root;
}

function sortContentTree(folder: FolderNode, nonFix = false): void {
	folder.contents.sort((a, b) => {
		if (nonFix && a.type !== b.type) {
			return a.type === "folder" ? -1 : 1;
		}
		// biome-ignore lint/style/noNonNullAssertion: <每个节点的目录下一定存在 article，故一定有 Rankable>
		return contentCompareFn(getRankable(a)!, getRankable(b)!);
	});

	for (const child of getFolders(folder.contents)) {
		sortContentTree(child, nonFix);
	}
}

export function flattenFolders(root: FolderNode): FolderNode[] {
	const result: FolderNode[] = [];

	function visit(folder: FolderNode): void {
		for (const child of getFolders(folder.contents)) {
			result.push(child);
			visit(child);
		}
	}
	visit(root);

	return result;
}

export function flattenContentRoutes(root: FolderNode): ContentRouteTarget[] {
	const routes: ContentRouteTarget[] = [];

	function visit(folder: FolderNode): void {
		for (const article of getArticles(folder.contents)) {
			routes.push({
				type: "article",
				node: article,
			});
		}

		for (const child of getFolders(folder.contents)) {
			routes.push({
				type: "folder",
				node: child,
			});
			visit(child);
		}
	}
	routes.push({
		type: "folder",
		node: root,
	});
	visit(root);

	return routes;
}
