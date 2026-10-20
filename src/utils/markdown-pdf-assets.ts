const markdownExtension = /\.(?:md|markdown)$/i;
const imageExtension = /\.(?:png|jpe?g|webp|gif|avif|svg)$/i;
const externalReference = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

type Asset = { file: File; url?: string };

/** Normalize virtual import paths without ever traversing above their root. */
function normalizePath(path: string): string | null {
	if (path.includes("\0")) return null;
	const parts: string[] = [];
	for (const part of path.replaceAll("\\", "/").split("/")) {
		if (!part || part === ".") continue;
		if (part === "..") {
			if (!parts.length) return null;
			parts.pop();
		} else {
			parts.push(part);
		}
	}
	return parts.join("/");
}

/** A folder picker supplies webkitRelativePath; individually selected files do not. */
export function getFilePath(file: File): string {
	return normalizePath(file.webkitRelativePath || file.name) ?? "";
}

export function inspectImports(files: File[]): {
	markdownFiles: File[];
	imageFiles: File[];
} {
	return {
		markdownFiles: files.filter((file) =>
			markdownExtension.test(getFilePath(file)),
		),
		imageFiles: files.filter((file) => imageExtension.test(getFilePath(file))),
	};
}

function parseReference(reference: string): string | null {
	const raw = reference.trim().replaceAll("\\", "/");
	if (!raw || raw.startsWith("#") || externalReference.test(raw)) return null;
	// Split before decoding, so an encoded # or ? remains part of the filename.
	const path = raw.split(/[?#]/, 1)[0];
	try {
		const parts = path.split("/").map((part) => decodeURIComponent(part));
		if (parts.some((part) => part.includes("/") || part.includes("\\"))) {
			return null;
		}
		const decoded = parts.join("/");
		return externalReference.test(decoded) ? null : decoded;
	} catch {
		return null;
	}
}

/** Retain only imported images. Call dispose when leaving the tool or clearing it. */
export class MarkdownAssets {
	private assets = new Map<string, Asset[]>();

	add(files: File[]): void {
		const incoming = new Map<string, File[]>();
		for (const file of inspectImports(files).imageFiles) {
			const path = getFilePath(file);
			const entries = incoming.get(path) ?? [];
			if (!entries.includes(file)) entries.push(file);
			incoming.set(path, entries);
		}
		for (const [path, entries] of incoming) {
			const previous = this.assets.get(path) ?? [];
			for (const asset of previous) {
				if (!entries.includes(asset.file) && asset.url) {
					URL.revokeObjectURL(asset.url);
				}
			}
			this.assets.set(
				path,
				entries.map(
					(file) => previous.find((asset) => asset.file === file) ?? { file },
				),
			);
		}
	}

	/** Return a blob URL only for an unambiguous imported image, otherwise null. */
	resolve(reference: string, documentPath: string): string | null {
		const path = parseReference(reference);
		const document = normalizePath(documentPath);
		if (!path || !document) return null;
		const directory = document.slice(0, document.lastIndexOf("/") + 1);
		const target = normalizePath(
			path.startsWith("/") ? path : directory + path,
		);
		if (!target || !imageExtension.test(target)) return null;

		const exact = this.assets.get(target);
		if (exact) return this.urlFor(exact);

		// A separately selected directory may add an otherwise irrelevant root name.
		const suffixMatches = [...this.assets.entries()]
			.filter(([assetPath]) => assetPath.endsWith(`/${target}`))
			.flatMap(([, assets]) => assets);
		if (suffixMatches.length) return this.urlFor(suffixMatches);

		// Individual image selections lose directory information. Use their name only
		// when no other imported file could be confused with that image.
		const basename = target.slice(target.lastIndexOf("/") + 1);
		const nameMatches = [...this.assets.entries()]
			.filter(([assetPath]) => assetPath.split("/").at(-1) === basename)
			.flatMap(([, assets]) => assets);
		if (nameMatches.length !== 1 || nameMatches[0].file.webkitRelativePath) {
			return null;
		}
		return this.urlFor(nameMatches);
	}

	dispose(): void {
		for (const assets of this.assets.values()) {
			for (const asset of assets) {
				if (asset.url) URL.revokeObjectURL(asset.url);
			}
		}
		this.assets.clear();
	}

	private urlFor(assets: Asset[]): string | null {
		if (assets.length !== 1) return null;
		const asset = assets[0];
		asset.url ??= URL.createObjectURL(asset.file);
		return asset.url;
	}
}
