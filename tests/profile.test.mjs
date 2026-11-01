import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const profile = JSON.parse(
  fs.readFileSync("src/data/professional-profile.json", "utf8"),
);
test("both locales use matching employment, project and education records", () => {
  const { en, es } = profile.locales;
  assert.equal(en.projects.length, es.projects.length);
  assert.equal(en.experiences.length, es.experiences.length);
  assert.equal(en.studies.length, es.studies.length);
  assert.deepEqual(
    en.projects.map((p) => p.url),
    es.projects.map((p) => p.url),
  );
  assert.deepEqual(
    en.experiences.map((e) => e.place),
    es.experiences.map((e) => e.place),
  );
  assert.deepEqual(
    en.technical_skills.map((g) => g.values),
    es.technical_skills.map((g) => g.values),
  );
  for (const l of [en, es]) {
    assert.equal(l.spoken_languages[2].level, "B2 (Cambridge)");
    assert.equal(l.experiences[0].bullets.length, 4);
  }
});
test("industrial case study does not expose client identities or internal formats", () => {
  for (const p of Object.values(profile.locales)) {
    const industrial =
      JSON.stringify(p.projects[0]);
    assert.doesNotMatch(
      industrial,
      /Fabriqer|Proto.?Go|\.step|\.pdf|STEP|PDF|fine.tun|trained models/i,
    );
    assert.equal(p.projects[0].url, "");
    assert.equal(p.projects[0].image, "");
  }
});
test("referenced local project media exists and external URLs use HTTPS", () => {
  for (const p of profile.locales.en.projects) {
    if (p.image) assert.ok(fs.existsSync("public" + p.image));
    if (p.url) assert.ok(p.url.startsWith("https://"));
  }
});
