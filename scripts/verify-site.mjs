// Read-only smoke test against a running local preview. No third-party API requests.
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4322";
for (const [path, locale] of [
  ["/", "es"],
  ["/en/", "en"],
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes(`<html lang="${locale}"`));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const data = JSON.parse(
    html.match(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
    )[1],
  );
  assert.equal(data["@type"], "ProfilePage");
  assert.equal(data.mainEntity["@type"], "Person");
  assert.equal(data.inLanguage, locale);
  assert.ok(html.includes('hreflang="en"'));
  assert.ok(html.includes('hreflang="es"'));
  assert.ok(html.includes('rel="canonical"'));
  const links = [
    ...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*download[^>]*>/g),
  ].map((m) => m[1]);
  assert.ok(links.length >= 2);
  for (const link of new Set(links)) {
    const r = await fetch(new URL(link, base));
    assert.equal(r.status, 200);
    assert.ok(r.headers.get("content-type").includes("pdf"));
    const bytes = Buffer.from(await r.arrayBuffer());
    assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
    const filename = link.includes("_EN.")
      ? "CV_Marti_Vilas_EN.pdf"
      : "CV_Marti_Vilas_ES.pdf";
    assert.deepEqual(bytes, fs.readFileSync("src/assets/" + filename));
  }
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(ids.has(id), "Broken anchor " + id);
  console.log(
    locale +
      ": HTML, headings, canonical/hreflang, JSON-LD, anchors and PDF download bytes OK",
  );
}
