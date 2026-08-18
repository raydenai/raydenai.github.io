# AURA: Personal-Brand Website Development Blueprint

**Version:** 1.0  
**Implementation:** Astro 7, typed content collections, static generation, responsive component library, photography pipeline, GitHub Pages deployment  
**Research foundation:** 30-site InfluEx personal-brand forensic audit, including 17 consultant-category examples. [1]

## 1. System thesis

A high-authority personal-brand website must make the answer to three questions easy to forward: **Who is this person for? Why should I trust them? What should I do next?** Most sites fail because these answers are either spread across a long résumé, buried under generic design, or diluted across too many CTAs.

AURA is an implementation system that makes the desired sequence repeatable. It is not a “clone the visuals” kit. Its value is a combination of an evidence-led content model, a controlled block library, a photo art-direction system, and production QA.

> **The strategic unit is not a section. It is a belief change.** Each block exists to move a visitor from one belief to the next.

## 2. The business architecture

Choose the client’s site architecture before copy, photography, or design begins.

| Archetype | Client situation | Core pages | Main CTA | Conversion logic |
|---|---|---|---|---|
| Personal Authority Hub | One named expert has multiple authority assets or revenue lines | Home, About, Method, Work With Me, Speaking, Insights, Contact | Call or opt-in | Establish person → method → proof → offers → nurture / call |
| Firm With Figurehead | A founder makes the firm more believable | Home, Services, Results, Team / About, Contact | Consultation | Establish company promise → founder credibility → cases → contact |
| Coach Transformation | An identity outcome is central | Home, Method, Program, Story, Results, Apply | Lead magnet or application | Relatability → desired state → method → peer proof → application |
| Single-Offer Funnel | One service or program is commercially dominant | Landing, Proof, FAQ, Apply / Book | One CTA | Tension → evidence → offer → objections → action |

The demo uses the **Personal Authority Hub** because it exercises the broadest system surface: named method, multiple offers, speaking, book, lead magnet, articles, proof, and contact.

## 3. Discovery before design

The highest-leverage work happens before a wireframe. AURA’s client questionnaire asks for the actual audience language, proof sources, offer constraints, and visual evidence. The discovery process must produce a decision brief, not a transcript summary.

| Decision | Required answer | Why it matters |
|---|---|---|
| Primary audience | Which person, in which situation, with which stakes? | Determines hero, problem language, visual register, and qualification. |
| Primary goal | Call, application, opt-in, purchase, subscription, or watch? | Prevents CTA sprawl and determines the page close. |
| Differentiator | Why this person’s advice is uniquely earned | Turns biography into relevance. |
| Named method | What does the work actually do in order? | Makes expertise transferable and memorable. |
| Evidence | Which exact outcomes, quotes, links, and credentials are approved? | Prevents vague claims and AI hallucination. |
| Offer fit | Who should and should not buy each offer? | Creates a self-selecting, lower-friction conversion path. |
| Origin moment | What real scene made the work necessary? | Creates trust without a chronological résumé. |

The complete questionnaire is available in [`prompts/discovery-questionnaire.md`](../prompts/discovery-questionnaire.md).

## 4. Page blueprint

### Homepage: the 14-step authority spine

The homepage should be treated as a brief, evidence-led sales conversation. This sequence was distilled from the recurring mechanics of the audit corpus. It is a default, not a rigid law; individual stages can be compacted, but their logic should remain intact. [1]

| Order | Visitor question | Recommended AURA block | Required ingredient |
|---:|---|---|---|
| 1 | Is this for me? | HeroSplitPortrait or HeroCenteredStatement | Precise audience tension, promised change, primary CTA |
| 2 | Is this person credible? | LogoStrip, CredibilityBar, AuthorityQuote | Earned proof only |
| 3 | Do they understand my actual situation? | EmpathyQuoteWall or ProblemAgitation | Verbatim audience language / material costs |
| 4 | What is the cost of staying here? | ProblemAgitation, IconGrid, FuturePacing | Specific consequences / desired state |
| 5 | Why is their approach different? | PrincipleZigZag or MethodologyPillars | Named, defensible method |
| 6 | Is this worth exploring? | DualCtaTransition | One primary next step + lower-friction route |
| 7 | What does the method involve? | NumberedFramework or ProcessTimeline | Clear outputs and sequence |
| 8 | Has it worked? | ResultsGrid | Before / after / metric |
| 9 | Do real people trust them? | TestimonialGrid or Slider | Permissioned quotes and attributable outcomes |
| 10 | Why do they care? | OriginStory or CrucibleMoment | One specific pivotal scene |
| 11 | Am I a fit? | AudienceQualifier | Explicit inclusion and exclusion |
| 12 | What can I take now? | LeadMagnet | Useful asset, benefits, provider-connected form |
| 13 | Can I learn more? | PostsGrid, BookShowcase, MediaFeatures | Real ongoing authority assets |
| 14 | What do I do now? | FAQ plus FinalCta | Objection resolution and decisive close |

### Supporting-page templates

| Page | Primary job | Must include | Avoid |
|---|---|---|---|
| About | Convert experience into relevance and motive | Crucible moment, concise narrative, selected credentials, appropriate CTA | Year-by-year résumé, generic inspirational prose |
| Method | Make the unique mechanism inspectable | Named steps, outputs, process / time expectations, evidence | Jargon diagram without consequences |
| Work With Me | Qualify serious buyers | Offer overview, early proof, detailed flagship offer, fit, application / call | Feature grid before the visitor knows why it matters |
| Speaking | Help an event buyer assess risk and fit | Real stage evidence, topics, audience / outcomes, organizer proof, contact CTA | Faked stage proof or a generic speaker reel placeholder |
| Insights | Prove depth and support nurture | Defined content categories, strong titles, article schema, contextual CTA | An empty blog grid or SEO filler |
| Contact | Reduce the human risk of reaching out | Named response owner, realistic timing, alternatives, minimal form | Black-box form with no expectation setting |

## 5. Block system architecture

AURA maps page JSON to Astro components through one registry. Every new block requires three synchronized changes: content schema, component, and registry entry. This creates a build-time contract rather than a page-builder convention.

```text
brand JSON + page JSON / MDX
      ↓
Astro content collection schema validation
      ↓
Dynamic route and BaseLayout
      ↓
BlockRenderer
      ↓
Block registry
      ↓
Astro component + shared primitives
      ↓
Static HTML, CSS, image assets, JSON-LD
```

The full library is described in [`BLOCK_LIBRARY.md`](./BLOCK_LIBRARY.md). It contains 45 blocks in hero, proof, problem, mechanism, story, offer, content, conversion, and structural families.

## 6. Content and SEO / AEO architecture

Each site has three collections: a single durable brand file, composed page files, and MDX posts. Astro content collections validate the source material before build. [2]

The BaseLayout and schema module produce canonical tags, Open Graph data, Twitter card metadata, `Person`, `Organization`, `WebSite`, `WebPage`, `FAQPage`, `Service`, and `Article` JSON-LD where appropriate. Schema is a meaning layer, not a ranking guarantee; its role is to make factual page entities explicit. [3]

| Content feature | AURA implementation | Editorial requirement |
|---|---|---|
| Person / organization identity | Brand record → JSON-LD graph | Use factual public name, title, and organization facts only. |
| FAQ answers | FaqAccordion → FAQPage schema | Answer a real objection in complete prose. |
| Services | Offer blocks → Service graph | Keep scope and claims accurate. |
| Articles | MDX frontmatter → Article / BlogPosting graph | Publish original, useful, dated writing. |
| Structured proof | Results / testimonials in typed data | Ensure permission and attribution. |

## 7. Design and photo system

The implementation ships five themes, responsive containers, a controlled type scale, CTA intent semantics, and tone-aware sections. The design system fixes hierarchy while the theme adapts visual treatment to the client’s register.

| Layer | Fixed by system | Chosen per client |
|---|---|---|
| Information hierarchy | H1 promotion, heading scale, CTA intent | Hero message and page sequence |
| Layout | Container widths, responsive grid rules, section rhythm | Which blocks and density are appropriate |
| Color | Accessible token structure | Theme and a single accent family |
| Typography | Display / body role separation | Family / voice implied by theme |
| Photography | Eight shot roles, crop specs, image pipeline | Treatment, wardrobe, subject, real locations |
| Motion | Respectful reveal and interaction patterns | Whether motion adds real meaning |

The photo specification is inseparable from the layout. A hero cut-out must be shot with desktop copy space and a separate mobile crop. The one-day shot plan, lighting ratios, treatment selection, and QA checklist live in [`PHOTOGRAPHY_PLAYBOOK.md`](./PHOTOGRAPHY_PLAYBOOK.md).

## 8. AI system design

AI is integrated as an editorial and implementation assistant rather than a truth engine. The system uses gated prompts: discovery extraction, positioning, page planning, block copy, photo art direction, and QA. Every prompt requires an evidence ledger and forbids invented proof.

| AI task | What it may do | What it may not do |
|---|---|---|
| Discovery analysis | Extract patterns, contradictions, questions, evidence gaps | Treat uncertain notes as facts |
| Positioning | Offer alternatives and clarify contrast | Invent a method or guarantee |
| Page planning | Select blocks and explain sequence | Add unapproved logos / social proof |
| Copy drafting | Write JSON-shaped copy from facts | Generate testimonials or results |
| Photo direction | Translate visual strategy to a brief | Fabricate a real event or customer scene |
| QA | Flag observable risks and structural gaps | Claim unmeasured performance or accessibility conformance |

Use [`AI_PIPELINE.md`](./AI_PIPELINE.md) and the files in `prompts/` to run the process. A model output is not final content until it has passed factual, legal, brand, and client review.

## 9. Quality assurance and launch gates

AURA contains three deterministic validation layers and one human review layer.

| Layer | Tool | Detects |
|---|---|---|
| Strategy / sequence | `pnpm lint:blocks` | No proof on high-intent pages, missing close, bad page start, diffuse CTA destinations |
| Asset integrity | `pnpm verify:images` | Missing images and wrong declared dimensions |
| Visual / responsive | `pnpm qa:visual` | Broken images, overflow, heading anomalies, tappable-control concerns, viewport screenshots |
| Human review | Prompt + stakeholder approval | Truth, visual trust, proof permission, specific audience fit, legal / privacy requirements |

The demo passed 16 desktop/mobile route combinations with zero horizontal overflow, zero broken images, and exactly one H1 per route. That is a build verification result, not a statement about performance or conversion outcomes.

## 10. Deployment model

The demo is permanently hosted through GitHub Pages at [raydenai.github.io](https://raydenai.github.io/). Production deploys are static and repeatable: a `main` branch push triggers validation, build, and hosting. Full handoff instructions, custom-domain steps, secrets policy, form guidance, and rollback procedure are in [`DEPLOYMENT.md`](./DEPLOYMENT.md). GitHub Pages supports workflow-based deployment of static sites. [4]

## 11. New-client build sequence

A new client can be scaffolded in minutes, but a credible site cannot be skipped through discovery. The recommended delivery sequence is four phases.

| Phase | Working session | Outcome |
|---|---|---|
| A. Evidence and position | 90–120 minute discovery + evidence review | Approved audience, tension, method, proof ledger, primary goal |
| B. Structure and assets | Page plan + photo art direction | Block map, content briefs, eight-shot shoot plan |
| C. Build and review | JSON / MDX authoring, design adaptation, QA | Working preview, validated assets, stakeholder changes |
| D. Launch and iteration | Deploy, analytics, conversion review | Stable domain, measurement, monthly content / proof update cycle |

Run the scaffold command, complete every `[DISCOVERY REQUIRED: …]` field, then validate before the first preview.

```bash
pnpm new:client -- \
  --slug client-name \
  --name "Client Name" \
  --title "Clear Positioning Title" \
  --theme obsidian-gold \
  --archetype personal-authority-hub

pnpm lint:blocks
pnpm verify:images
pnpm build
```

## 12. The implementation standard

AURA should be judged by whether a visitor can understand the client’s **relevance, evidence, method, and next action** without first meeting the client. If any of those needs are missing, do not solve the problem with additional decoration. Retrieve better evidence, clarify the point of view, select the correct block, or remove the claim.

## References

[1]: https://www.influex.com/portfolio/?portfolio_categories=consultant "InfluEx Consultant Portfolio"
[2]: https://docs.astro.build/en/guides/content-collections/ "Astro Content Collections"
[3]: https://schema.org/ "Schema.org"
[4]: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages "Using custom workflows with GitHub Pages"
