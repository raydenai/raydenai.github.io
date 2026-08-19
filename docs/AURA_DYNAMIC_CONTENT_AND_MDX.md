# AURA Compiler: Dynamic Content and MDX Authoring

## The content model

AURA has two complementary content surfaces. **Structured JSON/YAML records** control conversion pages, offers, proof blocks, case studies, navigation, forms, and visual modules. **MDX** controls long-form field notes, essays, transcripts, and analysis where a narrative should remain readable and editorial rather than being broken into landing-page blocks.

> The architecture determines the **job** of the content. The schema determines the **shape** of the content. MDX determines the **reading experience**.

The Astro content collections validate all three surfaces at build time. A route is regenerated from its content record when the static site builds; it is not manually assembled in a page builder.

| Content type | Source | Best use | Compiler guardrail |
|---|---|---|---|
| Brand profile | `src/content/brand/*.json` | Positioning, primary conversion, navigation, theme, shared proof policy. | Includes optional Compiler provenance: client pack, architecture, strategy version, site status. |
| Conversion page | `src/content/pages/*.json` | Home, method, services, speaking, about, contact and other ordered persuasion sequences. | Every block is schema validated; the Compiler page plan defines the recommended visitor-state order and allowed claim IDs. |
| Case study | `src/content/case-studies/*.json` | Permissioned or approved-anonymized outcome evidence. | Case records must map to the Evidence Register before promotion. A concept pack must not publish fictional results. |
| MDX field note | `src/content/posts/*.mdx` | Essays, thought leadership, diagnostic explainers, event preparation, point-of-view writing. | Frontmatter validates title, description, date, author, category, tags, reading time and cover asset; body copy stays subject to evidence / claim policy. |

## Dynamic page updates

For a normal page update, change a structured source record rather than editing the Astro component. For example, a new service outcome goes into the appropriate `HighTicketOffer`, `ServicesGrid`, `ResultsGrid`, or `AudienceQualifier` block in `src/content/pages/work-with-me.json`. The `BlockRenderer` and block registry render the same schema-safe component everywhere it is used.

The safe workflow is as follows.

| Step | Operator action | Engine check |
|---:|---|---|
| 1 | Add or revise the relevant claim in the local client Evidence Register. | A claim cannot be promoted if it is pending, private, rejected, or unsupported. |
| 2 | Update the client page plan if the visitor decision, CTA, proof role, or photo role changes. | `pnpm aura:validate -- --slug <slug>` checks architecture roles, claim references, CTA presence and photo planning. |
| 3 | Promote approved content into the typed `src/content` record. | `pnpm check`, `pnpm lint:blocks`, and `pnpm verify:images` validate schema, sequence and assets. |
| 4 | Build and visually inspect the change. | `pnpm aura:verify -- --slug <slug> --visual` runs the complete release suite. |

A simple text correction that does not alter a claim or page role can be made directly in the structured page record. A new offer, new outcome, new photo, new conversion motion, or new proof item should go through the client pack first.

## MDX authoring workflow

An MDX post lives under `src/content/posts/` and is rendered by the shared blog routes. The current frontmatter contract is:

```mdx
---
title: A specific, decision-relevant headline
description: A one- to two-sentence reader promise
publishDate: 2026-08-19
author: Client Name
category: Positioning
tags: ['positioning', 'executive authority']
readingTime: 7 min read
featured: false
cover:
  src: /images/client/post-cover.webp
  alt: Meaningful description of the image
  width: 1920
  height: 1280
---

Opening paragraph…

## A useful section heading

Body copy…
```

The shared `src/pages/blog/[slug].astro` route handles the article shell, cover, metadata and Article schema. Authors only need to supply the validated frontmatter and the MDX body. An MDX post is therefore dynamic at build time: adding a file creates its URL, its place in the index, and its structured metadata without changing application code.

## Archetype-aware MDX strategy

The Compiler must not treat every personal brand as a generic weekly blog. It changes MDX purpose, title style, proof requirement and CTA by architecture.

| Architecture | Primary MDX job | Example recurring series | Natural CTA | Evidence rule |
|---|---|---|---|---|
| **Private Signal** | Make private judgment legible without turning the author into a content performer. | Field Notes, The Quiet Cost, Authority Audit. | Request a private conversation or inspect the method. | Protect confidential work; use approved anonymization or a documented proof standard. |
| **Authority + Speaking** | Help an event buyer and leadership audience understand a talk’s behavior change before booking. | Before the Room, Rehearsal Notes, Leader Under Pressure. | Check availability or explore outcomes. | Do not imply real event appearances, audience results, or organizer endorsements without approval. |
| **Niche Specialist** | Name the buyer’s diagnostic problem and show rigorous operating insight. | Constraint Notes, Diagnostic Dispatches, Decision Flow Reviews. | Start an assessment or view the diagnostic method. | Separate observed patterns from client claims; publish case anatomy only with permission. |
| **Creator / Education** | Teach a useful first move and route a reader to the appropriate learning path. | Working Sessions, Framework Notes, Curriculum Letters. | Start here or join a program. | Do not promise learning or income outcomes beyond approved evidence. |
| **Manifesto / Movement** | Strengthen the point of view, define the enemy/default, and gather aligned readers. | Manifesto Letters, The Default We Refuse, Member Stories. | Join, apply, or read the manifesto. | Keep personal stories and movement claims attributable and approved. |
| **Portfolio / IP** | Make the person’s ideas, ventures and intellectual property navigable. | Build Notes, Investment Memos, Media Notes. | Route to the relevant venture, book, or collaboration. | Preserve material non-public information and separate opinion from portfolio fact. |

## Compiler-assisted MDX drafting

Use the `aura:post` command to create an archetype-aware MDX draft brief locally:

```bash
pnpm aura:post -- \
  --slug elena-voss \
  --title "The Room Rehearses Before You Enter It" \
  --category "Leadership Communication" \
  --intent "event-buyer education"
```

The command generates a local MDX candidate under `clients/<slug>/03-production/mdx/`. It embeds the selected architecture, allowed concept/approved claims, a recommended series, an appropriate CTA, frontmatter scaffold, and editorial outline. It does **not** write directly to `src/content/posts/`; a human must review the claim posture, body copy, cover provenance and final CTA before promotion.

## Promotion and release discipline

After review, move the completed MDX file to `src/content/posts/<slug>.mdx`, add a verified cover derivative to `public/images/`, then run:

```bash
pnpm check
pnpm verify:images
pnpm build
pnpm qa:visual
```

For a client pack, finish with:

```bash
pnpm aura:verify -- --slug <slug> --visual
```

This preserves a useful distinction: the Compiler can generate dynamic content candidates quickly, while the live website remains evidence-led, visually consistent, and under editorial control.
