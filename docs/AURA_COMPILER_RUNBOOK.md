# AURA Compiler Runbook

## Purpose

AURA Compiler turns an approved client pack into a traceable, production-ready personal-brand website release. It is the engine behind AURA—not a replacement for strategy, proof approval, copy review, photography review or production authorization.

> **Use the Compiler to make a site repeatable. Use human judgment to make it true and distinctive.**

## Command sequence

| Stage | Command | Operator action | Output |
|---:|---|---|---|
| 1 | `pnpm aura:init -- --slug <slug> --name "Client Name"` | Initialize a controlled client pack. | `clients/<slug>/00-intake` through `04-release`. |
| 2 | — | Complete Client Brief, Evidence Register and Voice/Constraints. | Approved source inputs; no public copy yet. |
| 3 | `pnpm aura:assess -- --slug <slug>` | Review the architecture recommendation and unresolved evidence. | `assessment-report.json`; a strategy awaiting approval. |
| 4 | — | Set `decision_status: approved` only after strategy review. | Approved `strategy.yaml`. |
| 5 | `pnpm aura:plan -- --slug <slug>` | Review visitor states, CTA routes, claim IDs, roles and page list. | `page-plan.yaml`. |
| 6 | `pnpm aura:assets -- --slug <slug>` | Approve consent, shot roles, visual world and crop requirements. | Shotlist and asset manifest. |
| 7 | `pnpm aura:prompts -- --slug <slug>` | Use generated packets to draft only from approved inputs. | Auditable prompt packets. |
| 8 | `pnpm aura:compose -- --slug <slug>` | Review schema-shaped content skeletons; replace approval placeholders with reviewed copy. | Typed AURA content candidate. |
| 9 | `pnpm aura:validate -- --slug <slug>` | Correct every contract, evidence, sequence and asset diagnostic. | `validation-report.json`. |
| 10 | `pnpm aura:verify -- --slug <slug> --visual` | Run release verification, including visual QA. | `verification-report.json`. |

## Required review points

### Evidence review

Every public claim must exist in `00-intake/evidence-register.yaml`. A claim marked `pending`, `private` or `rejected` cannot be referenced by the page plan or content output. A concept demo may use `concept_only`, but it must include the concept disclosure requirement and cannot look like fabricated live proof.

### Strategy review

The Compiler may recommend an architecture; it does not approve it. The operator must select a single architecture, write why it was selected, identify rejected alternatives, decide the primary conversion motion and choose a proof posture. Only then may the page plan become production-grade.

### Photography review

For a real client, identity references require consent before AI augmentation. For a concept build, use `synthetic_concept` and do not depict synthetic images as real engagements, awards, books, press, clients or stages. Every published image needs a role, provenance, alt intent, responsive derivative and mobile crop.

### Content review

The Composer intentionally writes `[NEEDS APPROVAL]` when a fact or final copy has not been approved. Replacing that text is not a writing exercise—it is a content approval step. Keep claim IDs alongside evidence-bearing blocks during review.

## Promotion into the live Astro site

The Compiler writes a safe candidate under:

```text
clients/<slug>/03-production/astro-content/
```

Review this candidate against the current brand and page schema. Then promote approved records into `src/content/brand`, `src/content/pages`, `src/content/case-studies`, and `src/content/posts` using a reviewed pull request or a controlled installer command in a future iteration. Do **not** overwrite the live site directly from a draft concept pack.

This separation is intentional: it means the engine can draft and validate an entire client release without changing a current production site until approval is explicit.

## Release rules

A release is eligible only when the following are true:

- The strategy record is approved.
- Client-pack validation passes.
- Every referenced claim is publishable for the site status.
- Every planned image role has a shot record and approved assets before launch.
- Composer placeholders have been replaced or the release is clearly kept as a concept draft.
- The primary form endpoint and canonical domain have been approved before collecting real visitor data.
- `pnpm aura:verify -- --slug <slug> --visual` passes.

## Private Signal reference test

The repository includes `clients/priya-raghavan/`, which compiles the premium **Private Signal** advisory concept. It demonstrates:

- A `private-signal` architecture chosen for selective, confidential advisory work.
- A concept-safe Evidence Register with no fictional client result.
- A six-page plan with visitor states, CTA intent, claim references and five photography roles.
- Generated positioning, page-review, per-page copy and photo-direction prompt packets.
- A schema-shaped Astro content candidate with compiler provenance.
- A passing full verification report.

## Future AURA Studio

A future client portal should read and write the exact same files or their database equivalents. Its first screens should be an evidence approval desk, strategy decision board, photo review board, content review queue and release dashboard. It must never bypass the Compiler’s evidence, architecture, asset or release gates.
