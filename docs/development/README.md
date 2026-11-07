# Development

Build, validate, and maintain the language-neutral protocol and its reference validator.

## Setup and validation

Install Node.js 24 and npm 11.6.2. From the repository root:

```sh
npm ci
npm run check
```

`npm run check` runs Biome formatting and lint checks, Node's test runner, and
all conformance fixtures through the reference validator. `npm run format`
applies formatting to maintained project files. This JavaScript project has no
separate typecheck or compilation step. CI runs the same canonical command.

The factory builds `.factory/Dockerfile` from standard input without a build
context, then adds its agent layer. Project dependencies are installed in the
checkout at run time. The image provides Node.js 24 and npm 11.6.2 system-wide;
it contains no repository files or credentials.

## Index

- [Conformance guides](how-to/README.md): run the protocol suite.
- [Document templates](templates/README.md): starting points for maintained documentation.
