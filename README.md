<div align="center">
  <h1>Minecraft Setup</h1>
  <p>A desktop app and Paper plugin that help players prepare a Minecraft client for a server.</p>

  [![Node.js 24](https://img.shields.io/badge/Node.js-24-339933)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6)](https://www.typescriptlang.org/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![Rust](https://img.shields.io/badge/Rust-stable-000000)](https://www.rust-lang.org/)
  [![Java 21](https://img.shields.io/badge/Java-21-ED8B00)](https://adoptium.net/)
  [![CI](https://github.com/lutzseverino/minecraft-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/lutzseverino/minecraft-setup/actions/workflows/ci.yml)
  [![License: MIT](https://img.shields.io/badge/license-MIT-2f3437)](LICENSE)
</div>

Minecraft Setup connects a server's declarative setup requirements with a player's
isolated local game directory. The server supplies data; the desktop app reviews
and applies the requested changes.

## Installation

Get native desktop installers or the Paper plugin JAR from the
[component releases](https://github.com/lutzseverino/minecraft-setup/releases).
[Historical desktop installers](https://github.com/lutzseverino/minecraft-setup-manager/releases)
and [historical plugin JARs](https://github.com/lutzseverino/minecraft-setup-publisher/releases)
remain available in their original repositories. Assets are not republished.
The desktop app needs an installed Minecraft Launcher. Put the plugin JAR in
Paper's `plugins` directory and restart the server.

The current desktop and plugin versions are development prereleases. Native
installers are not yet notarized or signed by a recognized publisher; updater
signatures remain a separate verification mechanism.

## Features

- Define language-neutral setup requirements in [protocol](protocol/README.md).
- Review and apply client setup with [manager](manager/README.md).
- Publish and optionally enforce requirements with [publisher](publisher/README.md).
- Release each component independently with its own version and toolchain.

## Usage

Enter a Minecraft server address in the manager, review its requested setup,
and approve the plan. Server operators can follow the publisher's
[first setup tutorial](publisher/docs/usage/tutorials/publish-your-first-setup.md).
Keep its login gate off until discovery and attestation are tested.

## Documentation

[Documentation index](docs/README.md)

## Contributing

[Contributing](CONTRIBUTING.md)

## License

[MIT License](LICENSE)
