export interface SearchSection {
	url: string;
	title: string;
	excerpt: string;
}

export interface SearchResult {
	url: string;
	meta: { title: string };
	excerpt: string;
	sub_results?: SearchSection[];
}

export interface SearchEntry {
	url: string;
	title: string;
	description: string;
	tags: string[];
	sections?: Array<{ url: string; title: string }>;
}

export interface Pagefind {
	options(options: { excerptLength: number }): Promise<void>;
	search(query: string): Promise<{
		results: Array<{ data(): Promise<SearchResult> }>;
	}>;
}
