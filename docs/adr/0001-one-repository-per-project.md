# Keep the Minecraft setup components in one repository

The protocol, desktop manager and publisher are one setup product. Keeping them
in separate repositories duplicated adoption and coordination work and required
both applications to pin the protocol as a submodule. On 2026-11-08 the owner
chose to rename minecraft-setup-protocol to minecraft-setup and import the
manager and publisher with full unsquashed history, rather than retain three
repositories or create a fresh destination.

The destination has protocol/, manager/ and publisher/ components, with one
protocol tree consumed locally, shared contribution guidance and one root
standards/factory adoption. Each component keeps its toolchain, version and
independent releases, using protocol-v…, manager-v… and publisher-v… tags for
future releases. Combining source ownership does not combine release cycles or
change the wire contract. Components still need to work with independently
released peers.

Migration merges preserve imported ancestry; the usual squash merge policy
would erase it and does not apply to those import PRs. Open issues transfer and
affected briefs are revalidated. The absorbed manager and publisher repositories
retain their published releases and are archived with pointers only after
verification. There are no current users requiring a compatibility transition;
new updater/release configuration must still pass native acceptance. Host,
account, secret and publishing operations retain their existing approval gates.

This records the chosen architecture; it does not claim that migration or live
acceptance has happened.
