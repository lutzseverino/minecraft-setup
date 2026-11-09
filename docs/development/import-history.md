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
the delivered head, checks and actual merge evidence. After merging, the merger
must verify every selected source head is an ancestor of actual destination
`main`, publish that evidence on #20 and for #21, and restore squash-only
repository/ruleset settings. A branch-only ancestry check cannot close #20.

Retained protocol `refs/tags/v…` stay unchanged. Manager and publisher
`refs/tags/v…` map to `refs/tags/manager-v…` and `refs/tags/publisher-v…`
respectively, preserving original objects and annotations. Absorbed non-main
branches map to `refs/heads/import-source/<component>/<original-branch-name>`.
PR pseudo-refs are inventory evidence, not imported destination branches.
The original manager `update-channel` branch is retained in the source and in
its namespaced history ref; it is not promoted to the new destination channel.

## Follow-on ownership

The orchestrator owns the issue-to-PR hold transfer, merge, actual-main ancestry
proof, merge-policy restoration, and downstream sequencing. Retain the intake
hold across failed gates. The combined standards/configuration image is
[setup #21](https://github.com/lutzseverino/minecraft-setup/issues/21), after the
import lands. Intake activation remains
[homelab #350](https://github.com/lutzseverino/homelab/issues/350); issue transfers
and source retirement remain
[homelab #373](https://github.com/lutzseverino/homelab/issues/373).
