/** Shared by build-time routes and browser components. No Astro content imports. */
export function getArticlePath(id: string): string {
	const path = id.replace(/\.(md|mdx)$/, "");
	if (path === "index" || path === "_index") return "";
	return path.replace(/\/_?index$/, "");
}

export function isIndexArticle(id: string): boolean {
	return /(^|\/)index(?:\.mdx?)?$/.test(id);
}

export function isLandingArticle(id: string): boolean {
	return /(^|\/)_index(?:\.mdx?)?$/.test(id);
}

export function getPostUrl(path: string): string {
	const normalized = getArticlePath(path);
	return normalized ? `/posts/${normalized}/` : "/posts/";
}
