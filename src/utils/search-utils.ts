import type { SearchEntry, SearchResult } from "@/types/search";

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

/** Development search uses real metadata; production uses the full-text index. */
export function searchMetadata(
	entries: SearchEntry[],
	query: string,
): SearchResult[] {
	const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
	if (!terms.length) return [];
	return entries
		.filter((entry) => {
			const text = [entry.title, entry.description, ...entry.tags]
				.join(" ")
				.toLocaleLowerCase();
			return terms.every((term) => text.includes(term));
		})
		.slice(0, 10)
		.map((entry) => ({
			url: entry.url,
			meta: { title: entry.title },
			excerpt: escapeHtml(entry.description),
		}));
}
