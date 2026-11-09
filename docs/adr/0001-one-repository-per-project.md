# Keep the Minecraft setup components in one repository

The protocol, desktop manager and publisher are one setup product. Keeping them
in separate repositories duplicated adoption and coordination work and required
both applications to pin the protocol as a submodule. On 2026-11-08 the owner
chose to rename minecraft-setup-protocol to minecraft-setup and import the
manager and publisher with full unsquashed history, rather than retain three
repositories or create a fresh destination. The owner confirmed the consolidation
on 2026-11-09.

The approved destination will have protocol/, manager/ and publisher/ components,
with one protocol tree consumed locally and shared contribution guidance. A
separate combined adoption after import will establish one root standards/factory
configuration and one complete-toolchain factory image for all three components.
Each component keeps its toolchain, version and independent releases, using protocol-v…, manager-v… and publisher-v… tags for
future releases. Combining source ownership does not combine release cycles or
change the wire contract. Components still need to work with independently
released peers.

Only migration import PRs use ancestry-preserving merges; ordinary PRs, including
combined adoption and this decision record, retain squash delivery. Existing
protocol tags and published releases are retained. Imported manager/publisher
historical tags are namespaced against collisions, preserving original signed
objects and annotations without replaying publication. Open issues transfer and
affected briefs are revalidated. The absorbed manager and publisher repositories
retain their published releases and are archived with pointers only after
verification. There are no current users requiring a compatibility transition;
new updater/release configuration must still pass native acceptance. Host,
account, secret and publishing operations retain their existing approval gates.

This records the chosen architecture; it does not claim that migration or live
acceptance has happened.

Accepted implementation contracts: [history and release paths](https://github.com/lutzseverino/minecraft-setup-protocol/issues/20),
[combined adoption](https://github.com/lutzseverino/minecraft-setup-protocol/issues/21)
and [operational preparation](https://github.com/lutzseverino/homelab/issues/371).
