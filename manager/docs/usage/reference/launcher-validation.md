# Launcher compatibility

Supported launcher versions and the limits of their production adapters.

| Launcher | Validated version | Environment | Result | Scope |
| --- | --- | --- | --- | --- |
| Official Minecraft Launcher | Repository fixtures and native CI | macOS, Windows, Linux | Supported | Standard launcher profile store |
| SKlauncher | 3.2.18 | Linux | Supported | Stable 3.2 standard Minecraft workspace |

## SKlauncher 3.2.18

The supported launcher JAR has SHA-256
`25a73e3770a1d8d14bce53e8920e2e893aacc3c715d0fb22f878ef2090d03863`.
Compatibility is based on the
[original validation record](https://github.com/lutzseverino/minecraft-setup-manager/blob/15d9f67de96b844ff76852a045d050e835c2e1ef/validation/sklauncher/evidence/3.2.18-linux.json)
and its
[validation account](https://github.com/lutzseverino/minecraft-setup-manager/blob/15d9f67de96b844ff76852a045d050e835c2e1ef/docs/reference/launcher-validation.md).

The standard workspace accepts the manager's deterministic UUID-compatible
profile key and retains the profile name, game directory, version, type,
creation time and icon. SKlauncher adds its own `lastUsed` value without
changing the profile key, preserves unrelated top-level launcher-profile data,
and may remove unrecognized fields from an individual profile object. The
manager recognizes the retained profile as unchanged without an additional
backup.

Support covers SKlauncher 3.2 with its standard Minecraft workspace. It does not
cover relocated `--workDir` installations, SKlauncher 4.0, or native execution
of the launcher on Windows and macOS.
