import type { Element } from "hast";

export function AdmonitionComponent(
	properties: Element["properties"],
	children: Element["children"],
	type: "tip" | "note" | "important" | "caution" | "warning",
): Element;
