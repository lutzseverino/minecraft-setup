import { appendFile, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const components = ["protocol", "manager", "publisher"];

export function parseReleaseTag(component, tag) {
  if (!components.includes(component)) {
    throw new Error(`Unknown release component: ${component}.`);
  }
  const match = new RegExp(
    `^${component}-v((?:0|[1-9][0-9]*)\\.(?:0|[1-9][0-9]*)\\.(?:0|[1-9][0-9]*))$`,
  ).exec(tag);
  if (!match) {
    throw new Error(
      `Release tag must use ${component}-vPROJECT.MAJOR.MINOR: ${tag}.`,
    );
  }
  return match[1];
}

export async function checkReleaseVersion(component, tag) {
  const version = parseReleaseTag(component, tag);
  const root = new URL("../", import.meta.url);
  const source = await readFile(
    new URL(
      `${component}/${component === "publisher" ? "pom.xml" : "package.json"}`,
      root,
    ),
    "utf8",
  );
  const expected =
    component === "publisher"
      ? source.match(/<version>([^<]+)<\/version>/)?.[1]
      : JSON.parse(source).version;
  if (version !== expected) {
    throw new Error(
      `Release tag ${tag} does not match ${component} version ${expected}.`,
    );
  }
  return { number: version, prerelease: version.startsWith("0.") };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const [component, tag] = process.argv.slice(2);
  const result = await checkReleaseVersion(component, tag);
  console.log(`${component} release ${result.number} is consistent.`);
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `number=${result.number}\nprerelease=${result.prerelease}\n`,
    );
  }
}
