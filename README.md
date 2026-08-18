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
└── visual-qa.mjs         # desktop/mobile Playwright QA

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

## Create a new client

```bash
pnpm new:client -- \
  --slug alex-morgan \
  --name "Alex Morgan" \
  --title "Growth Advisor to Technical Founders" \
  --theme obsidian-gold \
  --archetype personal-authority-hub
```

The command creates the brand and core pages with explicit `[DISCOVERY REQUIRED: …]` markers. Complete the discovery questionnaire, replace every marker, add the photo library, then run:

```bash
pnpm lint:blocks
pnpm verify:images
pnpm build
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

## Deployment

The repository includes a GitHub Pages workflow that validates blocks and images, builds the static Astro site, and deploys every push to `main`. Set `PUBLIC_SITE_URL` to the production origin during builds so canonical URLs and sitemap entries are correct.

For a branded domain, use the custom-domain steps in [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md). Do not place secrets in the static project or in `PUBLIC_*` environment variables.

## Credits and research basis

The pattern system was informed by a forensic review of 30 InfluEx-built personal-brand websites, anchored in the [InfluEx consultant portfolio](https://www.influex.com/portfolio/?portfolio_categories=consultant). The implementation uses Astro static output and content collections. See [`docs/RESEARCH_FINDINGS.md`](./docs/RESEARCH_FINDINGS.md) for method, limitations, and cited sources.
