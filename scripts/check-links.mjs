import { access, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const output = fileURLToPath(new URL("../dist/", import.meta.url));
const homepage = await readFile(path.join(output, "index.html"), "utf8");
const canonical = homepage.match(
	/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/,
)?.[1];
if (!canonical)
	throw new Error(
		"Build the site first; the homepage canonical URL is missing.",
	);
const site = new URL(canonical);
const base = site.pathname.replace(/\/?$/, "/");
const failures = new Set();
let checked = 0;

async function collect(directory) {
	const files = [];
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const file = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await collect(file)));
		else if (entry.name.endsWith(".html")) files.push(file);
	}
	return files;
}

async function check(href, pageUrl, source) {
	if (!href || href.startsWith("#")) return;
	const target = new URL(href.replaceAll("&amp;", "&"), pageUrl);
	if (target.origin !== site.origin) return;
	if (!target.pathname.startsWith(base)) {
		failures.add(source + " -> " + href + " (outside deployment base)");
		return;
	}
	const relative = decodeURIComponent(target.pathname.slice(base.length));
	let file = path.join(output, relative);
	try {
		if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
		await access(file);
		checked++;
	} catch {
		failures.add(source + " -> " + href);
	}
}

const pages = await collect(output);
for (const file of pages) {
	const relative = path.relative(output, file).replaceAll(path.sep, "/");
	const pageUrl = new URL(relative.replace(/index\.html$/, ""), site);
	const html = await readFile(file, "utf8");
	for (const match of html.matchAll(
		/<a\b[^>]*?\bhref=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g,
	)) {
		await check(match[1] ?? match[2] ?? match[3], pageUrl, relative);
	}
}
const rss = await readFile(path.join(output, "rss.xml"), "utf8");
for (const item of rss.matchAll(/<item>[\s\S]*?<\/item>/g)) {
	const link = item[0].match(/<link>([^<]+)<\/link>/)?.[1];
	if (link) await check(link, site, "rss.xml");
}
if (failures.size) {
	console.error([...failures].join("\n"));
	process.exitCode = 1;
} else {
	console.log(
		"Verified " +
			checked +
			" local links across " +
			pages.length +
			" HTML pages and RSS.",
	);
}
