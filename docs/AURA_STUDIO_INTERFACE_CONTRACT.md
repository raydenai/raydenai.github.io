# AURA Studio Interface Contract

AURA Studio is a future client-facing review interface over the Compiler. It is **not** an alternate content system and it must never publish directly around Compiler policy. The file-driven Compiler remains the source of truth for strategy, evidence, asset state, approvals, promotion, and release.

## Design principle

> Studio may improve the review experience. Compiler remains the authority that decides whether a release is allowed.

The initial engine is deliberately local and source-controlled because real client packs can contain unpublished strategy, evidence sources, consented identity references, production form configuration, and sensitive draft material. A Studio interface should store only the records required for a selected workflow and should preserve the same approval semantics when it later connects to the Compiler.

## Required Studio resources

| Studio area | Reads and writes | Required Compiler action | Cannot bypass |
|---|---|---|---|
| Discovery workspace | Client brief draft and decision log | `aura:assess` | Architecture cannot become approved without a resolved buyer, tension, offer and primary decision. |
| Evidence desk | Evidence register, permissions, case-study caveats | `aura:validate --strict` | No approved claim can be inferred from a logo, testimonial, metric or upload alone. |
| Strategy board | Architecture choice, rejected alternatives, page plan | `aura:plan` | One selected architecture and its required home roles must remain visible. |
| Asset review | Shotlist, source state, consent, mobile crop, alt text, derivatives | `aura:assets` and strict validation | Synthetic concept material cannot be relabeled as live proof. |
| Prompt review | Prompt packet, allowed claim IDs, prohibited assertions, approval state | `aura:prompts` | A prompt cannot introduce a claim that is not in the evidence register. |
| Content review | JSON / MDX candidates, reviewer decision, revision notes | `aura:promote` | Generated candidate content cannot silently overwrite the public content tree. |
| Release desk | Dossier, policy state, QA reports, deployment status | `aura:release` | A visual approval button cannot override a failed contract, privacy, asset or accessibility gate. |

## Minimal event contract

A Studio implementation should create immutable events rather than editing release history in place.

```text
client_brief.updated
strategy.assessed
strategy.approved
claim.approved | claim.rejected
asset.consent_recorded
asset.ready_for_publication
prompt.reviewed
content.approved
content.promoted
release.requested
release.authorized | release.blocked
release.deployed
content.rolled_back
```

Each event needs an actor, timestamp, source revision, affected object IDs, and an approval reference where relevant. A real Studio should use authentication, role-based access, database audit logging, private file storage, and a server-side secret manager. Those controls are intentionally outside the public static reference site.

## API boundary for a future managed application

When a Studio is built, it should call a protected server-side compiler service with a job payload containing a client slug and approved revision IDs. The Studio must not receive raw server credentials, provider secrets, or source evidence files in the browser.

| Operation | Request | Response |
|---|---|---|
| `assess` | Client-brief revision ID | Architecture recommendation, unresolved inputs, decision report |
| `plan` | Approved strategy revision ID | Page roles, CTA/form route, proof plan, photo roles |
| `prompts` | Approved plan and evidence IDs | Reviewable text and photo prompt packets |
| `promote` | Approved content candidate, reviewer reference | Immutable revision manifest and rollback handle |
| `release` | Client pack revision, environment target | Release dossier, QA links, `authorized` or `blocked` |
| `rollback` | Prior promotion revision ID | Restored content manifest and audit event |

## Security and privacy boundary

Client packs must remain private by default. Public repository fixtures may contain only deliberately sanitized concept data. The Studio must treat evidence sources, personal identity references, production form endpoints, client records, and uploaded documents as private tenant-scoped resources. It should never use `PUBLIC_*` configuration for secrets, and it should send visitors only to explicitly approved public form origins.
