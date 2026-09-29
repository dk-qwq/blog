import { spawnSync } from "node:child_process";
import { cp, stat } from "node:fs/promises";

const result = spawnSync("pagefind", ["--site", "dist"], {
	stdio: "inherit",
	shell: process.platform === "win32",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// Astro's Vercel adapter copies static output before post-build indexing runs.
if (
	await stat(".vercel/output/static")
		.then((entry) => entry.isDirectory())
		.catch(() => false)
) {
	await cp("dist/pagefind", ".vercel/output/static/pagefind", {
		recursive: true,
	});
}
