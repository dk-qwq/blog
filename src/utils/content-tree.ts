import type { CollectionEntry } from "astro:content";
import { contentCompareFn } from "./content-utils";

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
	articles: ArticleNode[];
	folders: FolderNode[];
}

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
	const existingFolder = parent.folders.find((folder) => folder.name === name);
	if (existingFolder) {
		return existingFolder;
	}

	const folder: FolderNode = {
		type: "folder",
		name,
		path,
		url: getPostUrl(path),
		articles: [],
		folders: [],
	};

	parent.folders.push(folder);
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
		articles: [],
		folders: [],
	};

	// /../a/index.md /../a article
	// /../a/_index.md /../ landing

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
			currentFolder.articles.push(article);
		}
	}

	sortContentTree(root);

	return root;
}

function sortContentTree(folder: FolderNode): void {
	folder.articles.sort((a, b) => {
		return contentCompareFn(a.entry, b.entry);
	});

	folder.folders.sort((a, b) => {
		return a.name.localeCompare(b.name, undefined, {
			numeric: true,
		});
	});

	for (const child of folder.folders) {
		sortContentTree(child);
	}
}

export function flattenFolders(root: FolderNode): FolderNode[] {
	const result: FolderNode[] = [];

	function visit(folder: FolderNode): void {
		for (const child of folder.folders) {
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
		// indexArticle 不单独生成路由，使用目录
		for (const article of folder.articles) {
			routes.push({
				type: "article",
				node: article,
			});
		}

		for (const child of folder.folders) {
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
