import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { checkReleaseVersion, parseReleaseTag } from "./release-version.mjs";

for (const component of ["protocol", "manager", "publisher"]) {
  test(`${component} rejects tags from other components and malformed versions`, () => {
    assert.equal(parseReleaseTag(component, `${component}-v1.2.3`), "1.2.3");
    for (const tag of [
      "v1.2.3",
      "other-v1.2.3",
      `${component}-v01.2.3`,
      `${component}-v1.2`,
      `${component}-v1.2.3-beta.1`,
      `${component}-v1x2x3`,
      ...["protocol", "manager", "publisher"]
        .filter((name) => name !== component)
        .map((name) => `${name}-v1.2.3`),
    ]) {
      assert.throws(
        () => parseReleaseTag(component, tag),
        /Release tag must use/,
      );
    }
  });

  test(`${component} validates its own version source and rejects mismatches`, async () => {
    const source = await readFile(
      new URL(
        `../${component}/${component === "publisher" ? "pom.xml" : "package.json"}`,
        import.meta.url,
      ),
      "utf8",
    );
    const version =
      component === "publisher"
        ? source.match(/<version>([^<]+)<\/version>/)[1]
        : JSON.parse(source).version;
    assert.deepEqual(
      await checkReleaseVersion(component, `${component}-v${version}`),
      {
        number: version,
        prerelease: version.startsWith("0."),
      },
    );
    await assert.rejects(
      checkReleaseVersion(component, `${component}-v999.999.999`),
      /does not match/,
    );
  });
}

test("unknown components cannot dispatch releases", () => {
  assert.throws(
    () => parseReleaseTag("site", "site-v1.2.3"),
    /Unknown release component/,
  );
});
