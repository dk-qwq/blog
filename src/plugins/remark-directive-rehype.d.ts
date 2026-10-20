import type { Root } from "mdast";

export function parseDirectiveNode(): (
	tree: Root,
	file: { _data: Record<string, unknown> },
) => void;
