# Project constraints

The normative protocol lives in `protocol/spec/` and `protocol/schema/`.
`protocol/src/` is the JavaScript reference validator for the shared fixtures, not a required dependency of
conforming implementations. Preserve that language-neutral boundary.

Keep each component's toolchain and lockfile. The protocol validator keeps
npm/Biome JavaScript; migrating it to pnpm or TypeScript is separate work.
