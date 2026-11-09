# Setup Manifest Integration

Minecraft Setup Manager consumes versioned manifests from the independently
versioned [Minecraft Setup Protocol](../../../../protocol/README.md) tree. The sibling tree
is the source of truth for schema, semantics, canonical fingerprints, fixtures,
and HTTPS publication behavior.

## Discovery

For `play.example.com:25566`, the manager checks:

```text
https://play.example.com/.well-known/minecraft-setup-manager/manifest.json
```

The Minecraft port is not reused for HTTPS. Players may also enter a direct
manifest URL. Public manifests and resources require HTTPS; literal loopback
HTTP is accepted only for local development.

## Consumer Behavior

The Rust backend parses and validates the complete manifest before saving it.
Unknown fields, explicit nulls, unsafe names, invalid relationships, ambiguous
destinations, unsupported schema versions, and insecure resource URLs fail
closed.

The manager normalizes valid manifests according to protocol v1, serializes the
result with RFC 8785 JSON Canonicalization Scheme, and records a fingerprint in
this form:

```text
msm-v1-sha256:<digest>
```

Plan and apply commands carry the fingerprint shown during review. If the saved
manifest changes, the player must review the new plan before anything is
applied.

Every selected resource has an explicit destination filename. The manager
verifies direct resource hashes and resolves pinned Modrinth metadata against
the declared project, version, Minecraft version, loader, primary filename,
size, CDN URL, and SHA-512 digest.

## Updating The Protocol

Protocol updates are reviewed in the same repository against the shared
`protocol/` tree. Run the full protocol and consumer conformance suites for
changes to schemas, fixtures or semantics. Release the components independently;
the manager's implementation remains distinct from the normative protocol.
