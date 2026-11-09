# Component releases

Release protocol, manager, and publisher independently from this repository.

## Tags and version checks

| Component | Future tag | Version source | Workflow |
| --- | --- | --- | --- |
| Protocol | `protocol-v1.1.1` | `protocol/package.json` | `protocol-release.yml` |
| Manager | `manager-v0.1.4` | manager package, Cargo package, and Tauri config | `manager-release.yml` |
| Publisher | `publisher-v0.1.0` | `publisher/pom.xml` | `publisher-release.yml` |

Examples show tag syntax, not a request to publish the current versions. The
shared `scripts/release-version.mjs` rejects another component's prefix,
malformed or nonnumeric versions, leading zeroes, prerelease suffixes, and a
version different from that component's manifest. Manager also verifies all
three application versions. Project-zero application/plugin releases remain
GitHub prereleases. Historical `v…` protocol releases stay unchanged.

Historical manager and publisher tags are preserved as namespaced refs pointing
at the original tag objects. They do not create destination releases. Never
republish old assets or push an old tag to replay publication. Historical signed
annotations keep their original internal names.

## Artifact and update boundaries

The publisher retains `MinecraftSetupPublisher-<version>.jar`, its SHA-256
checksum, exact draft asset inventory checks, and public-release replacement
refusal. Maven packages schemas from `../protocol/schema` at the existing
`protocol/schema` classpath location.

Manager retains the four native OS/architecture targets and five installer-aware
updater entries, detached signature checks, artifact signature verification,
and monotonic channel promotion. New updater-enabled builds consume
`https://raw.githubusercontent.com/lutzseverino/minecraft-setup/update-channel/latest.json`.
The destination channel is created/promoted only by an authorized future release.
The old source channel and old release URLs remain accessible; there is no
compatibility bridge, channel promotion, or artifact copy in the import.

## Account and native acceptance gates

All publication jobs reference the protected `release` environment, including
manager finalization/channel promotion. Before creating any future release tag,
the owner must enroll that environment in the destination and preserve the
source environment's protection and tag restrictions for the new namespaces.
The preparation record observed no destination environment; this source change
does not configure it or enroll signing secrets. Verify updater key custody,
backup and matching signing credentials before a manager release. Existing
public key bytes are preserved; no new key is selected here.

Native signing, notarization, release environment/credential enrollment and
end-to-end updater acceptance remain
[homelab #351](https://github.com/lutzseverino/homelab/issues/351).
Source checks and unsigned CI bundles do not satisfy that gate. Publication
requires its separate operational approval. Component guides retain the release
procedures: [manager](../../manager/docs/development/how-to/publish-a-release.md) and
[publisher](../../publisher/docs/development/how-to/publish-a-release.md).
