# AURA Wireframe-First Website Workflow Runbook

This runbook is the working procedure for creating a premium personal-brand website. It assumes the project has already been initialized and the client pack remains private. Do not begin visual implementation from a loose brief or create a page directly from a content prompt.

## 1. Initialize the private client pack

```bash
pnpm aura:init -- --slug client-name --name "Client Name"
```

Complete `00-intake/client-brief.yaml`, `00-intake/evidence-register.yaml`, and `00-intake/voice-and-constraints.yaml`. The brief must state the buyer, high-stakes moment, private tension, commercial offer, conversion action, selected visual world, and release policy state. The evidence register must account for every claim, client reference, logo, testimonial, metric, case-study outcome, and public image.

## 2. Approve the commercial architecture

```bash
pnpm aura:assess -- --slug client-name
```

Record the selected architecture and rejected alternatives in `01-strategy/strategy.yaml`. The heuristic recommendation is advisory; the approved strategy is authoritative. If a human deliberately selects a different architecture, the assessment now records that choice as an explicit approved override.

## 3. Generate and approve wireframes

```bash
pnpm aura:workflow -- --slug client-name --stage plan
```

This command produces the page plan, photo-role plan, wireframe HTML, wireframe manifest, workflow state, and approval checklist. Review `03-production/wireframes/site-wireframe.html` with the client or decision owner. It includes desktop 1440px / 12-column compositions and mobile 390px / 4-column compositions for every generated page.

Do not approve a wireframe until every page has one desired decision, a primary CTA, form fields appropriate to that action, evidence treatment, photo role, mobile reading order, and named Astro block candidates.

## 4. Bind wireframes to implementation

```bash
pnpm aura:design-contract -- --slug client-name
```

This command creates `03-production/design-contracts/design-contract.md` and JSON. It validates that every wireframe section has a registered Astro block, desktop/mobile behavior, copy boundary, proof state, and photo role. Resolve any design-contract diagnostic before content work begins.

## 5. Generate reviewed content candidates

```bash
pnpm aura:workflow -- --slug client-name --stage content \
  --approve-wireframe AURA-WF-CLIENT-YYYY-MM-DD
```

The approval reference is mandatory. The workflow produces page-specific prompt packets, role-specific photo/photographer packets, typed JSON candidates, and the content review state. The generated content is not public content; it must be fact-checked and approved against the evidence register.

Generate a long-form MDX candidate only with a decision-relevant title:

```bash
pnpm aura:post -- --slug client-name \
  --title "A specific decision-relevant article title"
```

## 6. Promote only approved JSON or MDX

Use `aura:promote` only after a named reviewer approves a candidate. Promotion writes a SHA-256 manifest, creates a backup of the prior public target, and supports rollback. Generation never writes directly into the public content tree.

```bash
pnpm aura:promote -- --slug client-name \
  --source 03-production/mdx/article.mdx \
  --target src/content/posts/article.mdx \
  --approval APPROVAL-REFERENCE
```

## 7. Authorize the release

```bash
pnpm aura:workflow -- --slug client-name --stage release \
  --approve-content AURA-CONTENT-CLIENT-YYYY-MM-DD
```

The release stage requires a named content approval and runs strict contract validation, block sequencing, types, image checks, static document policy, desktop/mobile visual QA, keyboard/focus QA, and the release dossier. The dossier is the source of truth for authorization.

A `concept_demo` can pass in concept mode only when disclosures and non-collecting forms are preserved. A `live_client` must supply permissioned evidence, real asset provenance, an HTTPS canonical domain, a privacy path, an approved form provider, and an allowlisted endpoint. The engine fails closed when those inputs are missing.

## 8. Operate after publication

For every material content change, repeat the relevant approval and promotion path. For every structural, form, domain, proof, visual-system, or dependency change, rerun the release dossier. Preserve the resulting manifest and rollback path with the client release record.

## Command reference

| Command | Purpose | Key output |
|---|---|---|
| `aura:init` | Creates the private client-pack contract | Intake, strategy, asset, production and release folders |
| `aura:assess` | Checks discovery and scores architecture fit | Assessment report |
| `aura:workflow --stage plan` | Generates strategy-locked plan, assets and wireframes | Wireframe approval pack |
| `aura:design-contract` | Binds wireframes to blocks and responsive behavior | Design contract |
| `aura:workflow --stage content` | Generates approved-wireframe content candidates | Prompt and Astro-content candidates |
| `aura:post` | Generates archetype-aware MDX candidate | Draft MDX article |
| `aura:promote` | Promotes approved content with rollback record | Revision manifest and backup |
| `aura:workflow --stage release` | Runs release authorization | Release dossier |
| `aura:workflow --stage status` | Displays the current build state and checklist | Workflow state and checklist |
