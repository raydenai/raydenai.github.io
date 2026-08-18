# AURA AI Build Pipeline

## Objective

The AI pipeline turns approved discovery material into a **draftable, inspectable, schema-safe site**, not an autonomous source of facts. It is designed for use with Claude or another capable writing model. The role of the model is to organize, draft, test alternatives, and transform approved material into the JSON/MDX structure AURA expects. It must not invent credentials, clients, press coverage, revenue outcomes, testimonials, affiliations, or legal claims.

> **Operating rule:** AI drafts structure and language. Humans establish truth, strategy, permission, and approval.

## The seven-gate workflow

| Gate | Input | AI output | Human approval required | Production artifact |
|---:|---|---|---|---|
| 1. Discovery | Interview transcript, questionnaire, evidence documents | Decision brief and open-question list | Audience, promise, primary goal, claims | `discovery-brief.md` |
| 2. Positioning | Approved facts and decision brief | Positioning options and a recommended statement | One audience, one contrast, one promise | Brand JSON positioning fields |
| 3. Proof inventory | Case notes, testimonials, media links, metrics | Evidence library with source / permission status | Every proof item | Brand proof library |
| 4. Information architecture | Positioning + proof + offers | Page map and block sequence | Page archetype and primary CTA | Page plans |
| 5. Copy drafting | Approved page plans | Hero, block, CTA, FAQ, article drafts | Factual language, tone, prohibited claims | Page JSON + MDX |
| 6. Asset direction | Brand strategy + photo playbook | Shot list, art direction, generation prompts | Subject identity, rights, visual direction | Asset manifest |
| 7. Validation | Completed content + assets | Lint / build / QA findings | Final sign-off | Deployed static site |

## Required inputs before prompting

The best way to reduce generic output is to impose an evidence ledger. Each factual assertion should have a source, a permission state, and a level of confidence.

| Field | Required before copy generation | Example |
|---|---|---|
| Audience | A narrow, observable group | “Founders of $10M–$100M B2B software firms after product-market fit.” |
| Current tension | A costly condition that audience recognizes | “The product is praised in product demos but the category is still described by competitors.” |
| Promise | A realistic, observable change | “A category narrative sales, media, and hiring teams can repeat.” |
| Differentiator | Why this expert has earned a unique method | “Former operator who led the transition inside three technical companies.” |
| Method | Named steps or principles with actual delivery logic | “Evidence → Position → Package → Platform.” |
| Proof | Permissioned case facts, metrics, attribution | “Client-approved 3.1× pipeline figure.” |
| Primary goal | One business action per page | “Book a paid-fit strategy call.” |
| Constraints | Claims to avoid, voice, legal/compliance, accessibility, geography | “No income guarantees; avoid ‘guru’ language.” |

## Discovery prompt

Use this prompt with a transcript or interview notes. Replace bracketed variables, attach the client material, and demand a strict separation of sourced facts from hypotheses.

```text
You are the strategy analyst for a high-authority personal-brand website.

Client material:
[PASTE OR ATTACH DISCOVERY MATERIAL]

Your task is to extract a Decision Brief. Do not write website copy yet.

Return these sections in Markdown:
1. Source-backed facts: quote or paraphrase only material directly supported by the input.
2. Audience candidates: rank no more than three; state the evidence for each.
3. Core tension: current condition, cost, and desired state.
4. Differentiation: what the expert sees, does, or has done that ordinary competitors cannot credibly claim.
5. Method candidates: only name a method if its steps are evidenced by the input.
6. Proof inventory: claim, source, permission status (confirmed / unconfirmed / unknown), and specificity score from 1–5.
7. Offer map: offer, buyer, outcome, scope, price or investment framing if evidenced, and conversion route.
8. Contradictions, unsupported claims, and questions that must be answered before writing.
9. Recommended primary conversion goal.

Rules: do not invent names, numbers, testimonials, affiliations, dates, or awards. Label hypotheses as HYPOTHESIS. Label unknowns as UNKNOWN.
```

## Positioning prompt

```text
Using the approved Decision Brief below, create three positioning directions.

For each direction provide:
- Audience in one precise clause
- Tension or enemy
- Observable promise
- Differentiator rooted in verified experience
- Named method (only if supported)
- One hero-headline option under 14 words
- One 45-word hero body
- A primary CTA that matches [PRIMARY GOAL]
- Risks: ambiguity, overclaiming, narrowness, compliance concerns

Then recommend one direction and explain why it best serves the client’s verified proof.

Approved Decision Brief:
[PASTE]
```

## Page-plan prompt

```text
You are an information architect working inside the AURA Astro personal-brand system.

Inputs:
- Brand archetype: [ARCHETYPE]
- Primary goal: [GOAL]
- Approved positioning: [POSITIONING]
- Evidence ledger: [PROOF]
- Offers: [OFFERS]

Create a page plan for: [HOME / ABOUT / METHOD / WORK WITH ME / SPEAKING / CONTACT].

For every proposed section, return a table with:
1. AURA block type (must be a block from BLOCK_LIBRARY.md)
2. Persuasion job
3. Required evidence or asset
4. Draft message in one sentence
5. CTA intent, if any
6. Reason this block belongs at this point in the sequence

Rules:
- Respect the canonical order: attention → proof → problem → mechanism → trust → offer → close.
- Use no more than two primary CTA destinations across a page.
- Do not include a media logo, testimonial, statistic, client name, or result unless it is in the evidence ledger.
- Include FAQ only for genuine objections.
```

## Block-copy prompt

Run this once per block after the page plan is approved. This makes review easier and prevents the model from writing a whole long page before the strategic structure is tested.

```text
Write copy for this AURA block only.

Block type: [BLOCK TYPE]
Persuasion job: [JOB]
Approved evidence: [EVIDENCE]
Voice: [VOICE NOTES]
Primary CTA: [CTA]
Constraints: [COMPLIANCE / CLAIMS / WORDS TO AVOID]

Return valid JSON that conforms to the fields for [BLOCK TYPE] in src/content.config.ts.

Copy criteria:
- Be specific before being clever.
- Use short declarative sentences.
- Do not introduce any fact not present in Approved evidence.
- Include an explicit placeholder, [NEEDS APPROVAL], where a missing fact would otherwise be invented.
- If a testimonial or result is not permissioned, omit it rather than anonymizing it deceptively.
```

## Photo direction prompt

Use the Photography Playbook first. The input must either include a consented identity anchor or state that the image is a non-personal concept/demonstration asset.

```text
Create an art direction specification for the [SHOT ROLE] in the AURA Photography Playbook.

Brand treatment: [OBSIDIAN AUTHORITY / EDITORIAL IVORY / EXECUTIVE IN-SITU / COMPOSITE THEMATIC]
Subject identity anchor: [CONSENTED DESCRIPTION OR ATTACHED REFERENCE]
Brand palette: [TOKENS]
Page placement: [BLOCK TYPE + COPY SIDE]

Return:
1. Camera and aspect ratio.
2. Subject placement and mobile crop plan.
3. Expression, pose, wardrobe, lighting, environment, grade.
4. Exclusions and authenticity risks.
5. One generation prompt and one photographer shot brief.

Do not fabricate a real speaking event, celebrity endorsement, customer relationship, award, or published book. Clearly label any conceptual scene.
```

## QA prompt

This is a review prompt, not a code substitute. It is useful after visual QA screenshots and page exports are available.

```text
Act as a senior personal-brand website reviewer. Review the supplied screenshots, page text, and AURA block sequence.

Score each category from 1–5 and cite the exact observed evidence:
- Audience clarity in the first viewport
- Proof specificity and permission risk
- Method intelligibility
- Offer qualification
- CTA coherence
- Photo credibility and crop safety
- Mobile hierarchy
- Accessibility signals (heading order, contrast concerns, descriptive alt text)
- SEO/AEO readiness (title, description, FAQ, answer-shaped content, schema intent)

For each score below 4, propose the smallest high-leverage correction. Do not recommend extra sections merely to make the page longer. Do not assert performance, contrast ratios, or technical facts that are not visible in the materials.
```

## Build-loop pseudocode

```text
Discovery material
  → fact / proof ledger
  → approved positioning
  → archetype and conversion decision
  → page plan using known blocks
  → block JSON and MDX drafts
  → asset manifest and photo direction
  → human factual / legal review
  → pnpm lint:blocks
  → pnpm verify:images
  → pnpm build
  → pnpm qa:visual
  → stakeholder approval
  → deploy
```

## Red-team checklist

Before an AI-produced draft reaches a client, check for the following high-risk patterns.

| Risk | How it appears | Corrective action |
|---|---|---|
| Hallucinated credibility | New outlets, awards, clients, revenue, or titles appear | Delete unless source and permission are explicit. |
| Generic abstraction | “Transform your potential” could belong to any coach | Reinsert the audience tension, real evidence, and method. |
| CTA sprawl | Every section has a different primary action | Reassert one page goal; keep supporting routes secondary. |
| Method theater | Named framework has no distinct steps or outputs | Either document the real process or remove the name. |
| False social proof | AI composes plausible customer quotes | Use only permissioned, attributable quotes. |
| Visual fabrication | Fake stage, press, book, or customer event image | Label conceptual assets or use real photography. |
| Compliance overreach | Guaranteed business / health / investment outcomes | Rewrite as scope, process, or past attributable result. |

## Prompt files shipped

| File | Intended use |
|---|---|
| `prompts/system-personal-brand.md` | Establishes role, truth policy, format, and AURA constraints. |
| `prompts/discovery-questionnaire.md` | Client-facing discovery intake. |
| `prompts/page-planner.md` | Converts approved discovery into a block sequence. |
| `prompts/block-copy.md` | Produces schema-shaped copy for a single block. |
| `prompts/photo-art-direction.md` | Produces photographer and generation briefs by shot role. |
| `prompts/qa-review.md` | Produces a disciplined post-build review. |
