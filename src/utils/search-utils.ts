import type { SearchEntry, SearchResult, SearchSection } from "@/types/search";

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (character) => {
		const entities: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
		};
		return entities[character];
	});
}

/** Pagefind also returns page-level hits; only show distinct, linked sections. */
export function getSearchSections(result: SearchResult): SearchSection[] {
	const seen = new Set<string>();
	const prefix = `${result.url.split("#")[0]}#`;
	return (result.sub_results ?? [])
		.filter((section) => {
			if (
				!section.url.startsWith(prefix) ||
				section.url.length === prefix.length ||
				!section.title.trim() ||
				seen.has(section.url)
			) {
				return false;
			}
			seen.add(section.url);
			return true;
		})
		.slice(0, 3);
}

/** Development searches metadata and rendered headings; production uses Pagefind. */
export function searchMetadata(
	entries: SearchEntry[],
	query: string,
): SearchResult[] {
	const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
	if (!terms.length) return [];
	return entries
		.flatMap((entry): SearchResult[] => {
			const text = [entry.title, entry.description, ...entry.tags]
				.join(" ")
				.toLocaleLowerCase();
			const sections = (entry.sections ?? []).filter((section) => {
				const title = section.title.toLocaleLowerCase();
				return (
					terms.some((term) => title.includes(term)) &&
					terms.every((term) => `${text} ${title}`.includes(term))
				);
			});
			if (!sections.length && !terms.every((term) => text.includes(term))) {
				return [];
			}
			return [
				{
					url: entry.url,
					meta: { title: entry.title },
					excerpt: escapeHtml(entry.description),
					sub_results: sections.map((section) => ({ ...section, excerpt: "" })),
				},
			];
		})
		.slice(0, 10);
}
