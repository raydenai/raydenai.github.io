# AURA Client Onboarding and Delivery Runbook

## Purpose

This runbook turns AURA from a codebase into a repeatable professional service. Use it with a real client from first conversation through launch. It prevents the two common failures of personal-brand site projects: beginning design before the message is decided, and publishing proof before it is verified.

## Phase 0: Fit and scope

Decide the commercial objective before accepting the project. A personal-brand site should serve a business model; it should not be a public biography exercise.

| Decision | Question | Deliverable |
|---|---|---|
| Business objective | What commercial outcome should the website increase? | One success metric and one primary conversion goal |
| Archetype | Is the person the hub, a firm figurehead, a transformation guide, or a single-offer seller? | Selected AURA archetype |
| Scope | Which core pages and authority assets are real now? | Page map and exclusion list |
| Proof availability | Can the client supply permissioned facts, outcomes, photos, and testimonials? | Initial evidence ledger |
| Ownership | Who owns domain, GitHub, forms, analytics, and final approval? | Named operations owner |

If there is no credible proof yet, build a focused narrative and lead magnet rather than simulating an established authority site.

## Phase 1: Discovery and proof retrieval

Send [`prompts/discovery-questionnaire.md`](../prompts/discovery-questionnaire.md) before the discovery session. In the session, prioritize direct language, contradictory evidence, and actual client artifacts.

| Evidence category | Minimum for launch | Ideal standard |
|---|---|---|
| Audience language | 5 direct quotes or paraphrased patterns | Call notes / interviews from multiple qualified audience members |
| Results | 2 concrete outcomes | 3–5 permissioned before/after stories with context |
| Testimonials | 2 permissioned quotes | 3–6 quotes with role, company, and outcome |
| Origin story | One particular scene | One scene plus supporting career proof |
| Method | 3 named steps / principles | 3–5 steps with output, client responsibility, and timing |
| Photography | Hero + portrait + working image | Complete eight-shot library |

Do not turn unconfirmed evidence into public copy. The project manager should maintain a simple ledger: claim, source, owner, permission, and final wording.

## Phase 2: Strategy approval

Before writing the page, approve a one-page decision brief containing the following elements.

| Decision brief field | Approval question |
|---|---|
| Audience | Would this person immediately recognize themselves? |
| Tension | Is the problem real, costly, and expressed in the audience’s own language? |
| Promise | Is the change observable without becoming a guarantee? |
| Differentiator | Is this rooted in the expert’s actual experience? |
| Method | Can the client explain the steps and output without marketing language? |
| Primary CTA | Does the action match the current business model? |
| Boundaries | Which claims, examples, competitors, or images are off limits? |

No design phase begins until this brief is approved.

## Phase 3: Content and photo production

Create a block plan using `prompts/page-planner.md`, then write individual blocks using `prompts/block-copy.md`. Writing block-by-block makes factual review possible. It also lets a stakeholder reject a weak proof story without disrupting the entire page.

Run the photography session with [`PHOTOGRAPHY_PLAYBOOK.md`](./PHOTOGRAPHY_PLAYBOOK.md). For a client who already has strong event imagery but weak portraits, prioritize the hero cut-out, story environmental, seated editorial, and working candid roles. Do not fabricate a stage history.

## Phase 4: Build, QA, and review

| Gate | Owner | Required result |
|---|---|---|
| Content schema | Developer | Build accepts every content file. |
| Block logic | Strategist / developer | `pnpm lint:blocks` is clean or every warning is explicitly accepted. |
| Asset integrity | Developer | `pnpm verify:images` passes. |
| Visual review | Designer / stakeholder | Desktop and mobile pages are reviewed from screenshots and live preview. |
| Proof audit | Client | Every logo, quote, result, photo, and case is approved. |
| Form / privacy | Operations owner | Endpoint, consent text, recipient, and response protocol tested. |
| Launch | Client owner | Domain, analytics, legal links, and rollback owner confirmed. |

## Phase 5: Post-launch authority operations

A personal-brand site becomes more credible as its evidence is maintained. Schedule a monthly or quarterly authority update.

| Cadence | Update |
|---|---|
| Monthly | Add one original insight post, check analytics / form flow, record new proof candidates. |
| Quarterly | Review offers, refresh results, add approved testimonials, update speaking / media activity. |
| Biannually | Refresh hero / working photography where role or appearance has meaningfully changed. |
| Annually | Revisit audience, category position, method naming, and visual theme against current business strategy. |

The most useful ongoing task is not “post more.” It is to retrieve and document the evidence that already occurred, then decide what deserves a durable place in the authority system.
