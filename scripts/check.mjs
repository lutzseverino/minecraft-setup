import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const maven = process.platform === "win32" ? "mvnw.cmd" : "./mvnw";
const checks = {
  protocol: [[npm, "run", "check"]],
  manager: [
    [npm, "run", "check"],
    [
      "cargo",
      "fmt",
      "--manifest-path",
      "src-tauri/Cargo.toml",
      "--all",
      "--",
      "--check",
    ],
    [
      "cargo",
      "test",
      "--manifest-path",
      "src-tauri/Cargo.toml",
      "--all-targets",
      "--all-features",
    ],
    [
      "cargo",
      "clippy",
      "--manifest-path",
      "src-tauri/Cargo.toml",
      "--all-targets",
      "--all-features",
      "--",
      "-D",
      "warnings",
    ],
  ],
  publisher: [[maven, "--batch-mode", "--no-transfer-progress", "verify"]],
};

function run(directory, [command, ...args]) {
  const result = spawnSync(command, args, {
    cwd: fileURLToPath(new URL(directory, root)),
    stdio: "inherit",
    shell: process.platform === "win32" && command.endsWith(".cmd"),
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(".", [npm, "run", "lint"]);
run(".", [npm, "test"]);
const selected = process.argv.slice(2);
for (const component of selected.length ? selected : Object.keys(checks)) {
  if (!Object.hasOwn(checks, component))
    throw new Error(`Unknown component: ${component}.`);
  for (const command of checks[component]) run(component, command);
}
