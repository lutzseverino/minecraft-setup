# Development

Build and validate the protocol, desktop manager, and Paper publisher together.

## Setup and validation

Use Node.js 24, npm 11.6.2, stable Rust with rustfmt and Clippy, and JDK 21.
Maven emits Java 17 bytecode. The publisher's Maven wrapper needs POSIX shell
(or its Windows wrapper), curl/wget, unzip, and network access. The manager
needs the [Tauri system prerequisites](https://v2.tauri.app/start/prerequisites/).
On Linux, install WebKitGTK 4.1, GTK 3, AppIndicator, librsvg, and patchelf.

From the repository root:

```sh
npm ci
npm ci --prefix protocol
npm ci --prefix manager
npm run check
```

The combined check runs release-routing tests, protocol Biome/tests/fixtures,
manager frontend/scripts/typecheck/build, Rust formatting/tests/strict Clippy,
and publisher Maven formatting/convergence/architecture/tests/package checks.
Each runs in its component directory and uses its own lockfile. The root has
no runtime dependencies and does not combine component package graphs.

Use `npm run check:protocol`, `npm run check:manager`, or
`npm run check:publisher` for a component. `npm run check:node` runs the Node
and frontend checks alone. Protocol JavaScript has no separate typecheck;
manager TypeScript is checked by its canonical npm check. Run `npm run format`
inside protocol or manager to apply their existing Biome formatting.

For interactive development, run `npm run tauri:dev` or `npm run dev` from
`manager/`. The publisher JAR is in `publisher/target/` after verification.
Both consumers use the single sibling `protocol/` tree. No submodule setup is
required. Normative schemas/specification remain language-neutral.

CI retains `Validate protocol` and the root PR-policy `validate` contexts.
Separate publisher and manager jobs run the component checks. Manager CI builds
macOS Apple Silicon, macOS Intel, Linux x64 and Windows x64 bundles. Linux
source validation alone does not establish native signed-release acceptance.

The canonical factory input is `.scriptorium/Dockerfile`, built from stdin without a build context,
then adds its agent layer. The combined image supplies Node.js 24/npm 11.6.2,
JDK 21, stable Rust/rustfmt/Clippy and Linux Tauri prerequisites system-wide.
Dependencies are installed in the fresh checkout at run time as `agent`.
The Maven wrapper downloads its own Maven distribution.

The canonical root factory configuration is `.scriptorium/config.json`, version 3.
Before the supported adoption update, both inputs remain under `.factory/`.
Live factory delivery requires
a Scriptorium v4 host that accepts it; source validation does not establish
that host or signed native-release acceptance.

On a Mac with Docker Desktop, verify a reviewed full head SHA with
`bash docs/development/verify-agent-sandbox.sh <SHA>`. The procedure clones that
exact revision into a fresh directory, builds both contextless image layers
using the pinned released factory agent layer, then runs all canonical checks
as its actual unprivileged `agent` user. It prints the image content digest,
head, identity and per-check exit codes, and removes its checkout, container and
image tags afterward. No provider credentials are needed.
The verifier prefers `.scriptorium/Dockerfile` and also supports reviewed
pre-update revisions that still use `.factory/Dockerfile`. It fails explicitly
if neither Dockerfile exists. Run `npm test` to check both input layouts and
missing-input rejection without Docker or network access; those tests do not
build an image or run the component checks in a container.
The factory layer is source-pinned for reproducibility; it is validation tooling,
not evidence of live factory delivery.

## Index

- [Conformance guides](how-to/README.md): run the protocol suite.
- [Document templates](templates/README.md): starting points for maintained documentation.
- [Component releases](component-releases.md): independent tags, artifacts, and publication gates.
- [Import history](import-history.md): preserved ancestry and historical reference handling.
- [Agent sandbox verification](verify-agent-sandbox.sh): build the combined image and run canonical checks as its agent user.
