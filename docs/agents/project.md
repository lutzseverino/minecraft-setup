# Project constraints

The normative protocol lives in `spec/` and `schema/`; `src/` is the JavaScript
reference validator for the shared fixtures, not a required dependency of
conforming implementations. Preserve that language-neutral boundary.

Keep the existing npm and Biome toolchain. The optional Canon TypeScript stacks
are excluded; migrating this project to pnpm or TypeScript is separate work.
