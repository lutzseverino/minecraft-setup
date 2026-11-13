import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(
  new URL("../docs/development/verify-agent-sandbox.sh", import.meta.url),
);

function verify(t, files) {
  const scratch = mkdtempSync(join(tmpdir(), "setup-sandbox-test-"));
  t.after(() => rmSync(scratch, { recursive: true, force: true }));
  const source = join(scratch, "source");
  const bin = join(scratch, "bin");
  mkdirSync(source);
  mkdirSync(bin);
  for (const [path, content] of Object.entries(files)) {
    const target = join(source, path);
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, content);
  }
  writeFileSync(join(source, "README.md"), "sandbox fixture\n");
  const git = (...args) => {
    const result = spawnSync("git", ["-C", source, ...args], {
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  git("init", "-q");
  git("add", ".");
  git(
    "-c",
    "user.name=Sandbox test",
    "-c",
    "user.email=sandbox@example.invalid",
    "commit",
    "-qm",
    "fixture",
  );
  const head = git("rev-parse", "HEAD");
  // Real Git fetches the requested revision from a local fixture. Only the
  // external image builder and agent-layer download are replaced.
  writeFileSync(
    join(bin, "curl"),
    `#!/usr/bin/env bash
set -eu
while [[ $# -gt 0 ]]; do
  if [[ $1 == -o ]]; then printf 'FROM scratch\\n' > "$2"; exit; fi
  shift
done
exit 2
`,
    { mode: 0o755 },
  );
  writeFileSync(
    join(bin, "docker"),
    `#!/usr/bin/env bash
set -eu
case "$1 $2" in
  'build --tag') cat >> "$SANDBOX_BUILD_INPUTS" ;;
  'image inspect')
    case "$4" in
      '{{.Id}}') echo sha256:test-image ;;
      '{{.Config.User}}') echo agent ;;
      *) exit 2 ;;
    esac ;;
  'run -i') cat >/dev/null ;;
  'rm -f'|'image rm') ;;
  *) exit 2 ;;
esac
`,
    { mode: 0o755 },
  );
  const builds = join(scratch, "build-inputs");
  const result = spawnSync("bash", [script, head], {
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${bin}:${process.env.PATH}`,
      TMPDIR: scratch,
      SANDBOX_BUILD_INPUTS: builds,
      GIT_CONFIG_COUNT: "1",
      GIT_CONFIG_KEY_0: `url.file://${source}.insteadOf`,
      GIT_CONFIG_VALUE_0: "https://github.com/lutzseverino/minecraft-setup.git",
      GIT_ALLOW_PROTOCOL: "file",
    },
  });
  return {
    ...result,
    builds: existsSync(builds) ? readFileSync(builds, "utf8") : "",
  };
}

test("sandbox verification builds from canonical inputs", {
  skip: process.platform === "win32",
}, (t) => {
  const result = verify(t, {
    ".scriptorium/Dockerfile": "FROM scratch\n# canonical toolchain\n",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.builds, /# canonical toolchain/);
});

test("sandbox verification still supports pre-adoption revisions", {
  skip: process.platform === "win32",
}, (t) => {
  const result = verify(t, {
    ".factory/Dockerfile": "FROM scratch\n# legacy toolchain\n",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.builds, /# legacy toolchain/);
});

test("canonical Dockerfile bytes win when both layouts exist", {
  skip: process.platform === "win32",
}, (t) => {
  const result = verify(t, {
    ".scriptorium/Dockerfile": "FROM scratch\n# canonical toolchain\n",
    ".factory/Dockerfile": "FROM scratch\n# legacy toolchain\n",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.builds, /# canonical toolchain/);
  assert.doesNotMatch(result.builds, /# legacy toolchain/);
});

test("sandbox verification rejects a revision without a Dockerfile", {
  skip: process.platform === "win32",
}, (t) => {
  const result = verify(t, {});
  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /No sandbox Dockerfile/);
  assert.equal(result.builds, "");
  assert.match(result.stderr, /\.scriptorium\/Dockerfile/);
  assert.match(result.stderr, /\.factory\/Dockerfile/);
});
