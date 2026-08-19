# Personal-Brand Design Skill Resource Plan

The skill must do more than describe preferred design. It must force an agent to discover the right commercial architecture, use only permissioned proof, plan section roles, generate photography deliberately, implement the site as structured Astro content, and validate the outcome before publication.

| Resource | Purpose | Degree of freedom |
|---|---|---|
| `SKILL.md` | Trigger conditions, required discovery inputs, architecture selector, end-to-end workflow, non-negotiable guardrails and handoff criteria. | Medium: mandates sequence while allowing appropriate visual expression. |
| `references/content-architectures.md` | Six page archetypes, canonical spines, copy formulas, proof requirements, CTA selector and failure patterns from the 30-site audit. | Medium: use the selector, then tailor the execution. |
| `references/premium-art-direction.md` | Private Signal quality bar, content-to-visual mapping, token / type / motion decisions, photo role ledger, desktop and mobile composition rules. | Medium: select a coherent visual world, do not copy a style mechanically. |
| `references/astro-implementation.md` | AURA content model, block family selection, case-study workflow, image manifest, SEO/schema and deployment rules. | Low for content schema and validation, medium for component composition. |
| `references/claim-discipline.md` | Evidence register fields, prohibited claim patterns, disclosure rules for fictional demos and confidential work. | Low: block unsafe or unsupported evidence. |
| `templates/client-brief.yaml` | Discovery input covering buyer, pressure, offer, thesis, evidence, conversion, visual world and photography plan. | Low: agent must complete before planning pages. |
| `templates/evidence-register.yaml` | Claim-by-claim permission and substantiation inventory. | Low: no public proof without a status. |
| `templates/page-plan.yaml` | Page, primary visitor, thesis, primary/secondary CTA, ordered sections, proof, image roles and validation status. | Low: deterministic planning artifact. |
| `templates/photo-shotlist.yaml` | Identity, consent, each image role, wardrobe, setting, crop, prompt, alt text and web derivatives. | Low for inventory; medium for art direction. |
| `scripts/validate_plan.py` | Validate that the plan has a buyer, tension, named mechanism, evidence status, defined CTA hierarchy, image roles and required pages. | Low: objective launch gates. |
| `scripts/score_page_sequence.py` | Score a page sequence against the chosen architecture and flag missing / badly ordered persuasion roles. | Low: advisory, not a substitute for judgement. |

The implementation test will use the existing AURA `Priya Raghavan / Private Signal` demo. It should confirm that the skill recognizes the site as **Private Signal advisory**, specifies the premium photo roles, flags fictional proof correctly, and validates the content-plan artifacts without forcing a generic template.
