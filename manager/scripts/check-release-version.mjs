import { readFile } from "node:fs/promises";

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
}

const [packageJson, tauriConfig] = await Promise.all([
  readJson("../package.json"),
  readJson("../src-tauri/tauri.conf.json"),
]);

const cargoSource = await readFile(
  new URL("../src-tauri/Cargo.toml", import.meta.url),
  "utf8",
);
const packageSection = cargoSource
  .split(/^\[package\]\s*$/m)[1]
  ?.split(/^\[/m)[0];
const cargoVersion = packageSection?.match(/^version\s*=\s*"([^"]+)"/m)?.[1];
if (!cargoVersion)
  throw new Error("Cargo package must declare an explicit version.");

const versions = new Map([
  ["package.json", packageJson.version],
  ["src-tauri/Cargo.toml", cargoVersion],
  ["src-tauri/tauri.conf.json", tauriConfig.version],
]);
const expectedVersion = packageJson.version;
const mismatches = [...versions].filter(
  ([, version]) => version !== expectedVersion,
);

if (mismatches.length > 0) {
  const details = mismatches
    .map(([source, version]) => `${source} has ${version}`)
    .join(", ");
  throw new Error(`Expected version ${expectedVersion}, but ${details}.`);
}

const releaseTag =
  process.env.GITHUB_REF_TYPE === "tag"
    ? process.env.GITHUB_REF_NAME
    : undefined;

if (releaseTag && releaseTag !== `manager-v${expectedVersion}`) {
  throw new Error(
    `Release tag ${releaseTag} does not match application version manager-v${expectedVersion}.`,
  );
}

console.log(`Application version ${expectedVersion} is consistent.`);
