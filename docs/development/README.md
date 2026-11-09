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

The retained `.factory/Dockerfile` is the former protocol-only image. The
combined standards/configuration/toolchain image is separate work in
[setup #21](https://github.com/lutzseverino/minecraft-setup/issues/21).
Do not use that existing image as evidence of combined sandbox readiness.

## Index

- [Conformance guides](how-to/README.md): run the protocol suite.
- [Document templates](templates/README.md): starting points for maintained documentation.
- [Component releases](component-releases.md): independent tags, artifacts, and publication gates.
- [Import history](import-history.md): preserved ancestry and historical reference handling.
