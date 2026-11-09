# Import history

Preserve original component history while maintaining one shared setup tree.

## Ancestry and references

The protocol repository is retained as Minecraft Setup. The manager and publisher
imports add the selected original main commits as merge parents, then adapt
paths above those commits. Neither filtering nor squashing the source history
preserves that ancestry. Import PRs therefore use the specifically authorized
merge-commit exception. Ordinary later work uses the repository's normal method.

The [preparation inventory](https://github.com/lutzseverino/homelab/issues/371#issuecomment-6739403902)
is the immutable selected-head/ref mapping; the import PR and its handoff record
the delivered head, checks and actual merge evidence. See the
[import delivery record](https://github.com/lutzseverino/minecraft-setup/pull/22)
for its merge exception and final ancestry proof.

Retained protocol `refs/tags/v…` stay unchanged. Manager and publisher
`refs/tags/v…` map to `refs/tags/manager-v…` and `refs/tags/publisher-v…`
respectively, preserving original objects and annotations. Absorbed non-main
branches map to `refs/heads/import-source/<component>/<original-branch-name>`.
PR pseudo-refs are inventory evidence, not imported destination branches.
The original manager `update-channel` branch is retained in the source and in
its namespaced history ref; it is not promoted to the new destination channel.

## Repository boundaries

Shared contribution guidance and checks live at the retained root. Component
versions, toolchains and published artifacts stay independently owned. The
[architecture decision](../adr/0001-one-repository-per-project.md) records the
repository grouping and operational boundaries; the import delivery record
links its adoption and operational follow-ons.
