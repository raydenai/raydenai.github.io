# AURA Workflow and Wireframe System Test Report

**Test date:** 2026-08-20  
**Engine:** AURA Compiler  
**Test scope:** Private Signal, Creator / Education, and Enterprise B2B client packs.

## Test intent

This test verifies that the redesigned AURA production system can take three materially different commercial motions through the same controlled workflow without producing the same generic website plan. Each pack was required to produce an approved strategy, page plan, role-based asset plan, desktop/mobile wireframe approval pack, design contract, prompt packets, typed content candidates, workflow approvals, and a complete release dossier.

## Result summary

| Client pack | Architecture | Pages | Primary conversion | Wireframe / design contract | Final workflow state | Release gates |
|---|---:|---:|---|---|---|---|
| Priya Raghavan | Private Signal | 6 | Request a private conversation | Generated and block-validated | `release_authorized` | 8 / 8 passed |
| Mara Chen | Creator / Education | 6 | Get the Clarity Map | Generated and block-validated | `release_authorized` | 8 / 8 passed |
| Anya Kerr | Enterprise B2B | 7 | Request a discovery brief | Generated and block-validated | `release_authorized` | 8 / 8 passed |

## Workflow stages verified

All three packs were run through the following gated sequence.

| Stage | Engine behavior verified |
|---|---|
| `aura:workflow --stage plan` | Reassessed the approved client strategy, generated the page plan and photo roles, then emitted annotated desktop/mobile wireframes and a workflow checklist. |
| `aura:design-contract` | Bound every wireframe section to a registered Astro block, desktop/mobile behavior, copy requirement, proof claim IDs, and photo role. All three packs produced zero contract diagnostics. |
| `aura:workflow --stage content --approve-wireframe` | Required a named approval reference, generated claim-constrained prompt packets and typed Astro content candidates, and changed the workflow state to `content_review`. |
| `aura:workflow --stage release --approve-content` | Required a named content approval, then passed strict client validation, block sequencing, type checks, image checks, static policy, responsive visual QA, keyboard smoke testing, and wrote the release dossier. |

## Archetype differentiation

The system produced different page and conversion logic rather than merely renaming the same template.

| Architecture | Distinguishing home sequence | Wireframe emphasis | Qualification detail |
|---|---|---|---|
| Private Signal | Recognition → private tension → method → confidential-proof treatment → fit → private conversation | Asymmetric authority composition, private-room imagery, quiet qualification | Decision context, timing, desired outcome. |
| Creator / Education | Recognition → first value → named method → learning-proof standard → program → start here | Learning artifact and progression path, editorial content rhythm | First name, email, current offer. |
| Enterprise B2B | Initiative risk → operating constraint → decision method → scoped proof standard → solution → discovery brief | Buying-committee context, decision artifact, stakeholder conversation | Work email, company, role, initiative, procurement stage. |

## Quality conclusion

The test confirms that AURA now generates a reviewable **website production package**, not only page content. The wireframe stage makes layout, mobile composition, CTA, evidence and image decisions visible before design or code. The design-contract stage prevents wireframes from drifting away from registered Astro blocks. The workflow stage blocks progression unless named approvals are recorded. The final release dossier remains the only authorization to publish.

The test packs remain `concept_demo` packs. Their successful release dossiers demonstrate system behavior and QA gates; they do not turn fictional copy, people, images, outcomes or proof standards into live-client claims.
