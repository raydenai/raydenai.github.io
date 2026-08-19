# AURA 10 / 10 Release Standard

AURA is designed to make premium personal-brand delivery repeatable **without removing strategic, editorial, legal, visual, or client approval judgment**. The Compiler produces a release authorization only when the selected architecture, approved evidence, conversion route, content, images, accessibility, and static build all agree.

> A release dossier is an authorization record, not a claim of marketing performance. It proves that AURA’s defined production controls passed for a specific client pack and code revision.

## The premium delivery workflow

| Stage | Client-facing milestone | AURA artifact | Owner of the decision |
|---|---|---|---|
| 1. Discovery | A narrow buyer, costly tension, named offer, and desired decision are confirmed. | `00-intake/client-brief.yaml` | Strategy lead and client owner |
| 2. Evidence | Every client name, outcome, credential, logo, metric, and quotation receives a source and publication status. | `00-intake/evidence-register.yaml` | Client evidence owner |
| 3. Architecture | One archetype is approved and rejected alternatives are recorded. | `01-strategy/strategy.yaml` and `page-plan.yaml` | Strategy lead |
| 4. Art direction | Visual world, photo roles, consent state, desktop/mobile crops, and asset source policy are approved. | `02-assets/photo-shotlist.yaml` and `asset-manifest.yaml` | Creative lead and client owner |
| 5. Content | Prompt packets and candidate JSON / MDX are reviewed; unapproved placeholders are resolved or retained. | `03-production/` | Editorial owner and client owner |
| 6. Promotion | Reviewed content is moved into the Astro content tree with an approval reference, source hash, backup, and rollback manifest. | `04-release/content-revisions/` | Content owner |
| 7. Release | The strict contract, static output, visual QA, keyboard smoke test, and release dossier pass. | `04-release/release-dossier.json` | Release owner |

## Command sequence

A client pack remains local by default because it can contain private source material, consented identity references, and unpublished strategy. A sanitized fixture may be used in CI when the same contract needs public build coverage.

```bash
# 1. Create and complete a local client pack.
pnpm aura:init -- --slug client-name --name "Client Name"
pnpm aura:assess -- --slug client-name
pnpm aura:plan -- --slug client-name
pnpm aura:assets -- --slug client-name
pnpm aura:prompts -- --slug client-name
pnpm aura:compose -- --slug client-name

# 2. Confirm the strategy and release policy before content goes live.
pnpm aura:validate -- --slug client-name --strict

# 3. Draft long-form content as a review candidate, then edit and approve it.
pnpm aura:post -- --slug client-name --slug-fragment first-topic

# 4. Promote approved JSON or MDX with a reviewer reference. Begin with --dry-run.
pnpm aura:promote -- --slug client-name \
  --source clients/client-name/03-production/mdx/approved-note.mdx \
  --target src/content/posts/approved-note.mdx \
  --approval CONTENT-APPROVAL-2026-08-19 \
  --dry-run

# 5. Generate the strict, traceable release dossier. Visual and keyboard QA are included by default.
pnpm aura:release -- --slug client-name
```

## Release policy by site status

| Site status | What can be published | What the Compiler requires |
|---|---|---|
| `concept_demo` | Clearly disclosed fictional or synthetic concept material. | Explicit concept disclosure. Concept-only claims and assets remain labelled as such. Demo forms remain non-collecting. |
| `anonymized_client` | Permissioned evidence where the client’s identity is withheld. | Approved anonymized claims, required caveats, real image rights, approved form provider, HTTPS canonical domain, privacy-policy path, and approved endpoint status. |
| `live_client` | Named, permissioned client material and approved public claims. | Traceable non-concept proof, assets with permission and desktop/mobile derivatives, real canonical domain, privacy path, approved contact endpoint, and all release checks. |

A live pack cannot pass if it contains a concept-only claim, a concept-only asset, missing permission note, absent image derivatives, unconfigured form provider, non-HTTPS canonical domain, missing privacy path, or an endpoint that has not been approved.

## Form and privacy controls

AURA uses a provider-neutral form primitive. `config://contact` never activates simply because a public endpoint exists. The endpoint must be explicitly allowlisted through `PUBLIC_FORM_ALLOWED_ORIGINS`; otherwise the copied site stays in visible, no-data-collection demo mode.

```dotenv
PUBLIC_SITE_URL=https://client.example
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/FORM_ID
PUBLIC_FORM_ALLOWED_ORIGINS=https://formspree.io
```

The endpoint itself is not a secret in a static form implementation. Provider keys, inbox credentials, webhook secrets, and CRM private tokens must never be placed in public environment variables or browser code.

## Content promotion and rollback

Promotion is deliberately separate from generation. `aura:compose` and `aura:post` create reviewed candidates. `aura:promote` rejects unresolved approval markers, records the reviewer reference and source SHA-256, saves the previous target version, and writes a revision manifest. The exact previous revision can be restored with:

```bash
pnpm aura:promote -- --slug client-name --rollback REVISION_ID
```

This makes updates to conversion JSON and MDX long-form content reviewable and reversible without relying on a page builder’s opaque history.

## Release dossier contents

A successful `aura:release` writes a JSON dossier containing the client slug, architecture, primary conversion, source-control revision, page decisions, referenced claims, planned visual roles, form/domain policy state, static-system report, responsive QA report, keyboard-accessibility result, and every command result.

The release command runs the following gates in sequence:

1. Strict client-pack contract validation.
2. Persuasion and block-sequence validation.
3. Astro type validation.
4. Image reference validation.
5. Static production build.
6. Static document policy validation for titles, descriptions, canonicals, language, landmarks, H1 count, image alt attributes, secure resource references, sitemap, and unsafe demo forms.
7. Isolated desktop/mobile visual QA using an internal static preview.
8. Mobile keyboard / focus smoke testing for the header drawer: 44px control size, focus movement, focus wrapping, Escape close, focus restoration, background isolation, and console health.

## Hosted deployment parity

The GitHub Pages workflow now blocks deployment on production dependency audit, block/type/image validation, static document policy, a Chromium-backed desktop/mobile visual QA run, and the keyboard-accessibility smoke test. The public workflow uses only repository-safe website output; real client packs remain local unless a deliberately sanitized fixture is added.

## Future AURA Studio boundary

A future AURA Studio can provide a client-facing interface for discovery, evidence upload, approvals, visual direction, content review, asset review, and release status. It must submit the same client-pack fields and invoke the same Compiler gates. The Studio may make work easier to review; it must not bypass the release policy.
