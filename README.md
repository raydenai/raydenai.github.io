# AURA — Astro Personal-Brand Website Development System

**AURA** is a production-ready, content-driven Astro system for high-authority personal-brand websites. It pairs a reusable block library with an evidence-led content model, photography direction, AI-assisted authoring prompts, deterministic QA, and static deployment.

| Resource | Link |
|---|---|
| **Permanent demo site** | [raydenai.github.io](https://raydenai.github.io/) |
| **Source repository** | [raydenai/raydenai.github.io](https://github.com/raydenai/raydenai.github.io) |
| **Master blueprint** | [`docs/BLUEPRINT.md`](./docs/BLUEPRINT.md) |
| **InfluEx research findings** | [`docs/RESEARCH_FINDINGS.md`](./docs/RESEARCH_FINDINGS.md) |
| **Photography playbook** | [`docs/PHOTOGRAPHY_PLAYBOOK.md`](./docs/PHOTOGRAPHY_PLAYBOOK.md) |
| **AI pipeline** | [`docs/AI_PIPELINE.md`](./docs/AI_PIPELINE.md) |
| **AURA Compiler** | [`docs/AURA_COMPILER_OPERATING_MODEL.md`](./docs/AURA_COMPILER_OPERATING_MODEL.md) |
| **Personal-brand product system** | [`docs/AURA_PERSONAL_BRAND_PRODUCT_SYSTEM.md`](./docs/AURA_PERSONAL_BRAND_PRODUCT_SYSTEM.md) |
| **Wireframe-first workflow** | [`docs/AURA_WIREFRAME_WORKFLOW_RUNBOOK.md`](./docs/AURA_WIREFRAME_WORKFLOW_RUNBOOK.md) |

## What ships

AURA includes **45 reusable blocks across nine families**, 11 shared primitives, five visual themes, typed Astro content collections, automatic schema generation, responsive image delivery, visual QA, block-sequence linting, a new-client scaffold command, and a complete demo brand.

```text
src/
├── blocks/          # 45 strategy-led presentation blocks
├── components/      # shared renderer, layouts, and primitives
├── content/         # typed brand, page, and MDX post content
├── layouts/          # shared document, metadata, analytics, and schema shell
├── lib/              # block registry and structured-data builders
├── pages/            # dynamic page and blog routes
└── styles/           # five-theme token system and global primitives

scripts/
├── new-client.mjs        # schema-safe client starter
├── lint-blocks.mjs       # persuasion sequence and CTA hierarchy checks
├── build-photos.py       # responsive photo derivative pipeline
├── verify-images.py      # image existence / intrinsic-dimension check
├── visual-qa.mjs         # desktop/mobile Playwright QA
└── aura/                 # client-pack, strategy, planning, asset, content and release compiler

docs/                # blueprint, research, content, token, photo, and deployment guides
prompts/             # discovery, planning, block-copy, photography, and QA prompts
```

## Fast start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:4321` to view the demo.

| Command | Purpose |
|---|---|
| `pnpm dev` | Local development server |
| `pnpm build` | Static production build |
| `pnpm preview` | Preview the generated production output |
| `pnpm lint:blocks` | Check persuasion sequence and conversion hierarchy |
| `pnpm verify:images` | Check referenced assets and dimensions |
| `pnpm photos:build` | Build responsive derivatives from private photo masters |
| `pnpm qa:visual` | Capture and audit desktop/mobile page states |
| `pnpm new:client -- …` | Create a schema-safe client scaffold |
| `pnpm aura:init -- …` | Initialize a portable evidence, strategy, asset and release client pack |
| `pnpm aura:assess -- …` | Recommend an architecture and surface discovery / proof gaps |
| `pnpm aura:plan -- …` | Compile approved strategy into page, CTA, block and photo-role plans |
| `pnpm aura:assets -- …` | Compile the consent-aware premium photo shotlist and asset manifest |
| `pnpm aura:wireframe -- …` | Generate annotated 1440px desktop and 390px mobile approval wireframes |
| `pnpm aura:design-contract -- …` | Bind every wireframe section to registered Astro blocks, responsive rules, proof and photo roles |
| `pnpm aura:workflow -- … --stage plan|content|release` | Run the gated production workflow with named wireframe and content approvals |
| `pnpm aura:prompts -- …` | Generate auditable AI drafting and photography prompt packets |
| `pnpm aura:compose -- …` | Emit typed AURA content candidates with approval placeholders |
| `pnpm aura:validate -- …` | Enforce client-pack, evidence, sequence and asset contracts |
| `pnpm aura:verify -- … --visual` | Run the component contract, build and responsive visual verification suite |
| `pnpm aura:system-check -- …` | Validate static document policy: metadata, canonical, landmark, H1, alt text, secure resources and sitemap |
| `pnpm aura:a11y -- URL` | Verify mobile-menu 44px controls, focus trap, Escape behavior and background isolation |
| `pnpm aura:promote -- …` | Promote approved JSON / MDX with a reviewer reference, source hash, backup and rollback manifest |
| `pnpm aura:release -- …` | Authorize a traceable release dossier including static, responsive and keyboard QA |

## AURA Compiler: create a new client

`new:client` remains available for a lightweight content starter. For a production-grade premium site, use the Compiler instead:

```bash
pnpm aura:init -- --slug alex-morgan --name "Alex Morgan"
# Complete clients/alex-morgan/00-intake/client-brief.yaml and evidence-register.yaml
pnpm aura:assess -- --slug alex-morgan
# Approve clients/alex-morgan/01-strategy/strategy.yaml
pnpm aura:workflow -- --slug alex-morgan --stage plan
# Review clients/alex-morgan/03-production/wireframes/site-wireframe.html
pnpm aura:design-contract -- --slug alex-morgan
pnpm aura:workflow -- --slug alex-morgan --stage content --approve-wireframe AURA-WF-ALEX-YYYY-MM-DD
# Review candidates, approve content, then promote only resolved JSON / MDX.
pnpm aura:workflow -- --slug alex-morgan --stage release --approve-content AURA-CONTENT-ALEX-YYYY-MM-DD
```

## Content-first architecture

The site itself is authored as data, not hand-assembled page-builder sections.

```text
Brand strategy and proof → JSON content blocks → Astro renderer → static HTML/CSS/JSON-LD
```

The `brand` record defines the audience, primary conversion, theme, proof library, identity, navigation, and integrations. Each page is an ordered block array. The block registry maps data to components, while the schema validates source content before build.

## Launch discipline

This system intentionally does **not** invent proof. Before a real client site goes live, verify every metric, testimonial, client logo, media feature, event, photo, credential, and legal claim. Connect real form endpoints only after privacy, notification, and ownership decisions are approved.

The public Priya Raghavan site is a fictional demo. Its forms use a safe `demo://` endpoint and do not collect or store visitor information.

## Documentation map

| Document | Read when you need to… |
|---|---|
| [`BLUEPRINT.md`](./docs/BLUEPRINT.md) | Understand the end-to-end operating model and implementation sequence. |
| [`RESEARCH_FINDINGS.md`](./docs/RESEARCH_FINDINGS.md) | See the patterns extracted from the InfluEx research corpus. |
| [`BLOCK_LIBRARY.md`](./docs/BLOCK_LIBRARY.md) | Select the correct component for a persuasion job. |
| [`CONTENT_MODEL.md`](./docs/CONTENT_MODEL.md) | Author brands, pages, posts, CTAs, and safe forms. |
| [`DESIGN_TOKENS.md`](./docs/DESIGN_TOKENS.md) | Adapt theme, typography, layout, and visual treatment. |
| [`PHOTOGRAPHY_PLAYBOOK.md`](./docs/PHOTOGRAPHY_PLAYBOOK.md) | Plan, shoot, generate, crop, and QA the full photo library. |
| [`AI_PIPELINE.md`](./docs/AI_PIPELINE.md) | Run the evidence-led AI discovery and drafting workflow. |
| [`DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Deploy, operate, map a custom domain, and roll back safely. |
| [`CLIENT_ONBOARDING.md`](./docs/CLIENT_ONBOARDING.md) | Run a repeatable discovery, evidence, build, review, and launch process. |
| [`AURA_COMPILER_OPERATING_MODEL.md`](./docs/AURA_COMPILER_OPERATING_MODEL.md) | Understand the engine’s contracts, compiler stages, quality gates and Studio-ready extension path. |
| [`AURA_COMPILER_RUNBOOK.md`](./docs/AURA_COMPILER_RUNBOOK.md) | Operate the Compiler from client pack through verified release. |
| [`AURA_COMPILER_ARCHETYPE_TESTS.md`](./docs/AURA_COMPILER_ARCHETYPE_TESTS.md) | Compare the compiled Private Signal, Authority + Speaking, and Niche Specialist outputs. |
| [`AURA_PRIVATE_SIGNAL_PHOTO_AND_PROMPT_REVIEW.md`](./docs/AURA_PRIVATE_SIGNAL_PHOTO_AND_PROMPT_REVIEW.md) | Inspect the role-based shot plan and generated AI / photographer prompt packets. |
| [`AURA_PRIVATE_SIGNAL_RESPONSIVE_QA.md`](./docs/AURA_PRIVATE_SIGNAL_RESPONSIVE_QA.md) | Review the fresh desktop and mobile release QA evidence. |
| [`AURA_DYNAMIC_CONTENT_AND_MDX.md`](./docs/AURA_DYNAMIC_CONTENT_AND_MDX.md) | Manage schema-driven page updates and architecture-aware MDX publishing. |
| [`AURA_AUTHORITY_SPEAKING_PREVIEW_QA.md`](./docs/AURA_AUTHORITY_SPEAKING_PREVIEW_QA.md) | Review the Authority + Speaking concept implementation and responsive QA evidence. |
| [`AURA_QUALITY_SCORECARD.md`](./docs/AURA_QUALITY_SCORECARD.md) | Review the baseline score, defined 10/10 standard, and completed hardening roadmap. |
| [`AURA_10_OUT_OF_10_RELEASE_STANDARD.md`](./docs/AURA_10_OUT_OF_10_RELEASE_STANDARD.md) | Operate client packs, approvals, promotion, privacy controls, release dossiers, rollback and hosted QA. |
| [`AURA_STUDIO_INTERFACE_CONTRACT.md`](./docs/AURA_STUDIO_INTERFACE_CONTRACT.md) | Build a future client-facing Studio without bypassing Compiler contracts or release authorization. |
| [`AURA_PERSONAL_BRAND_PRODUCT_SYSTEM.md`](./docs/AURA_PERSONAL_BRAND_PRODUCT_SYSTEM.md) | Understand the end-to-end quality standard, visitor-state wireframe rules, workflow stages and architecture differences. |
| [`AURA_WIREFRAME_WORKFLOW_RUNBOOK.md`](./docs/AURA_WIREFRAME_WORKFLOW_RUNBOOK.md) | Run the gated client workflow from intake through wireframe approval, design contract, content review and release authorization. |
| [`AURA_WORKFLOW_AND_WIREFRAME_TEST_REPORT.md`](./docs/AURA_WORKFLOW_AND_WIREFRAME_TEST_REPORT.md) | Review the tested end-to-end workflow across Private Signal, Creator / Education and Enterprise B2B. |

## Deployment

The repository includes a GitHub Pages workflow that audits production dependencies, validates blocks, types and images, builds the static Astro site, checks static document policy, and runs Chromium-backed desktop/mobile and keyboard-accessibility QA before deploying every push to `main`. Set `PUBLIC_SITE_URL` to the production origin during builds so canonical URLs and sitemap entries are correct.

For a branded domain, use the custom-domain steps in [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md). Do not place secrets in the static project or in `PUBLIC_*` environment variables.

## Credits and research basis

The pattern system was informed by a forensic review of 30 InfluEx-built personal-brand websites, anchored in the [InfluEx consultant portfolio](https://www.influex.com/portfolio/?portfolio_categories=consultant). The implementation uses Astro static output and content collections. See [`docs/RESEARCH_FINDINGS.md`](./docs/RESEARCH_FINDINGS.md) for method, limitations, and cited sources.
