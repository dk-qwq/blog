import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { contentCompareFn } from "./content-order";
import { getPostUrlBySlug } from "./url-utils";

describe("public content URLs", () => {
	beforeEach(() => vi.stubEnv("BASE_URL", "/blog/"));
	afterEach(() => vi.unstubAllEnvs());
	it.each([
		["college-physics/_index", "/blog/posts/college-physics/"],
		["git/_index.md", "/blog/posts/git/"],
		["bin-fib-decomposition/index", "/blog/posts/bin-fib-decomposition/"],
		["index.md", "/blog/posts/"],
		["_index.md", "/blog/posts/"],
		["contest-logs/2024csp-s游记", "/blog/posts/contest-logs/2024csp-s游记/"],
	])("normalizes %s with the deployment base", (slug, expected) => {
		expect(getPostUrlBySlug(slug)).toBe(expected);
	});
});

describe("content ordering", () => {
	it("returns equality for equal publication dates and weights", () => {
		const item = { published: new Date("2026-01-01"), pinWeight: 2 };
		expect(contentCompareFn(item, { ...item })).toBe(0);
	});
	it("lets archives ignore pin weights", () => {
		const pinned = { published: new Date("2025-01-01"), pinWeight: 10 };
		const recent = { published: new Date("2026-01-01") };
		expect(contentCompareFn(pinned, recent)).toBeLessThan(0);
		expect(contentCompareFn(pinned, recent, true)).toBeGreaterThan(0);
	});
});
