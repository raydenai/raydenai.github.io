# Adding Consultant Case Studies and Updating Content in AURA

## The authoring model

AURA separates content from components. You update a case study by adding one JSON file; you update a page by editing a JSON block array; you update styles by changing tokens or a component’s scoped CSS. Astro validates content collections during build, while Tailwind is available for utility-driven component styling. [1] [2]

> **Never edit `dist/`.** It is generated at build time. Edit `src/content/`, `src/components/`, `src/blocks/`, or `src/styles/`, then rebuild.

## 1. Add a consultant portfolio case study

The case-study system is a typed collection. A JSON file in `src/content/case-studies/` automatically produces a public page at `/case-studies/[filename]/` and appears in the collection grid at `/case-studies/` when `draft` is `false`.

### Step A — Copy the starter

```bash
cd /path/to/aura-system
mkdir -p src/content/case-studies
cp templates/case-study.template.json src/content/case-studies/acme-executive-team.json
```

Open `src/content/case-studies/acme-executive-team.json`. Replace every `[DISCOVERY REQUIRED: …]` value. Do not publish metrics, quotes, logos, client names, speaking claims, or project images unless the source and usage permission are documented.

### Step B — Add the case assets

Place the selected cover and gallery images inside the public image directory for that brand.

```text
public/images/
└── client-slug/
    ├── case-acme-cover.webp
    ├── case-acme-workshop.webp
    └── case-acme-framework.webp
```

Then update the JSON image objects with the exact `src`, `alt`, `width`, and `height`. The included validator compares declared image dimensions with the actual file to protect layout stability.

```json
"cover": {
  "src": "/images/client-slug/case-acme-cover.webp",
  "alt": "Consultant facilitating a leadership strategy workshop with the Acme executive team",
  "width": 1600,
  "height": 1000
}
```

### Step C — Complete the evidence fields

| Field | What belongs there | Publication rule |
|---|---|---|
| `title` | Outcome-led result, not a project label | “From confusing founder story to a board-ready narrative,” not “Acme case study.” |
| `challenge` | Starting condition with business context | Show why the condition mattered now. |
| `stakes` | Two to four material risks or opportunities | Use observable costs; avoid invented urgency. |
| `engagement.scope` | Actual deliverables / workstreams | Describe what was done, not aspirational benefit words. |
| `methodology` | Three to five decisions or steps | Each step needs an action and tangible output. |
| `outcomes` | Permissioned result / evidence | Include a metric, qualitative observable, source scope, or time window. |
| `testimonial` | Approved direct quote | Always attach name / role / company only with permission. |
| `nextStep` | One relevant conversion action | Match the brand’s declared primary goal. |

Set `"draft": true` during review. Set `"draft": false` only after factual, legal, and client approval. Use `"confidential": true` where an anonymized descriptor is permitted instead of a client name.

### Step D — Validate, preview, and publish

```bash
pnpm lint:blocks
pnpm verify:images
pnpm check
pnpm build
pnpm preview
```

Open these routes locally:

```text
http://localhost:4321/case-studies/
http://localhost:4321/case-studies/acme-executive-team/
```

For a GitHub Pages site, commit and push `main` after approval. The workflow validates content, types, images, builds Astro output, and deploys automatically.

```bash
git add src/content/case-studies public/images/client-slug
git commit -m "Add Acme executive team case study"
git push origin main
```

## 2. The JSON anatomy, explained

```json
{
  "brand": "client-slug",
  "title": "From invisible expertise to a board-ready authority narrative",
  "description": "A six-month authority engagement for a technology founder preparing for enterprise expansion.",
  "client": {
    "name": "Acme Systems",
    "industry": "Enterprise technology",
    "role": "Founder and CEO",
    "confidential": false
  },
  "category": "Executive authority advisory",
  "year": "2026",
  "featured": true,
  "draft": false,
  "cover": { "src": "/images/client-slug/case-acme-cover.webp", "alt": "…", "width": 1600, "height": 1000 },
  "heroMetric": { "value": "3.1×", "label": "qualified pipeline", "detail": "Client-reported at the end of engagement" },
  "challenge": "…",
  "stakes": ["…"],
  "engagement": { "label": "Authority positioning engagement", "duration": "Six months", "scope": ["…"] },
  "methodology": [{ "step": "01", "title": "Evidence retrieval", "description": "…", "output": "Evidence library" }],
  "outcomes": [{ "value": "3.1×", "label": "qualified pipeline", "detail": "…" }],
  "nextStep": { "heading": "Ready to make the work easier to believe?", "cta": { "label": "Book a strategy call", "href": "/contact/", "intent": "primary" } }
}
```

The template is intentionally more verbose than the minimum. It forces a real case story: initial condition, stakes, work, evidence, and next action. Avoid a “before / after” number with no context, because it is easily misread and less credible than a documented journey.

## 3. Update a standard page

Standard AURA pages are JSON files in `src/content/pages/`.

| Goal | File to edit | Typical block(s) |
|---|---|---|
| Change homepage message | `src/content/pages/home.json` | `HeroSplitPortrait`, `ProblemAgitation`, `MethodologyPillars`, `FinalCta` |
| Update biography / origin | `src/content/pages/about.json` | `OriginStory`, `CrucibleMoment`, `Manifesto` |
| Add or revise methodology | `src/content/pages/method.json` | `NumberedFramework`, `ProcessTimeline`, `PrincipleZigZag` |
| Change offers or fit criteria | `src/content/pages/work-with-me.json` | `ServicesGrid`, `HighTicketOffer`, `AudienceQualifier` |
| Update speaker material | `src/content/pages/speaking.json` | `SpeakingTopics`, `MediaFeatures`, `TestimonialGrid` |
| Change contact language / response detail | `src/content/pages/contact.json` | `ContactSplit`, `ApplicationForm` |

Every page has an ordered `blocks` array. To modify content, edit the fields inside a block. To change sequence, move the entire block object. Do not rename the `type` field unless the associated Astro block exists in `src/blocks/` and is registered in `src/lib/blockRegistry.ts`.

### Example: update a hero

```json
{
  "type": "HeroSplitPortrait",
  "tone": "inverse",
  "eyebrow": "Executive authority advisory",
  "heading": "The expertise is real. The market needs a reason to repeat it.",
  "body": "I help enterprise founders turn a hard-won record into an authority system that the right rooms can recognize.",
  "portrait": {
    "src": "/images/client-slug/hero-cutout.png",
    "alt": "Alex Morgan, executive authority advisor",
    "width": 1200,
    "height": 1500
  },
  "ctas": [{ "label": "Book a strategy call", "href": "/contact/", "intent": "primary" }]
}
```

## 4. Add an article or insight

Create a Markdown or MDX file in `src/content/posts/`.

```text
src/content/posts/
└── how-to-build-a-referenceable-method.mdx
```

```mdx
---
title: "How to Build a Referenceable Method"
description: "A practical way to turn judgement into a named, usable asset."
publishDate: 2026-08-18
author: "Alex Morgan"
category: "Method"
tags: ["positioning", "authority"]
cover:
  src: "/images/client-slug/method-workshop.webp"
  alt: "Alex Morgan facilitating a method workshop"
  width: 1600
  height: 1000
draft: false
featured: true
readingTime: "6 min read"
---

Your article starts here.
```

The article automatically appears on `/blog/` and is published at `/blog/how-to-build-a-referenceable-method/` when `draft` is false.

## 5. Change the theme, typography, or spacing

Start with the brand’s `theme` field in `src/content/brand/[brand].json`. Shipped theme tokens are defined in `src/styles/tokens.css`.

| Change | Correct implementation point |
|---|---|
| Select a shipped theme | Brand JSON `theme` field |
| Change token colors, type, radius, spacing | `src/styles/tokens.css` |
| Change global utilities / base styling | `src/styles/global.css` |
| Change one block’s layout | The relevant `src/blocks/**/BlockName.astro` component |
| Add a new reusable block | Schema in `content.config.ts` + Astro component + `blockRegistry.ts` entry |
| Apply Tailwind utilities | Component markup; Tailwind is integrated through the Astro Vite plugin |

The rule is intentional: **content belongs in content files; repeated visual behavior belongs in tokens or components.** Do not paste custom CSS into every JSON section and do not hard-code client copy into components.

## 6. Pre-publish evidence check

| Question | Required answer before `draft: false` |
|---|---|
| Is every metric source-backed and time-bounded? | Yes, or remove it. |
| Does the client allow their name and logo to be public? | Yes, in writing. |
| Is the testimonial verbatim or clearly approved as edited? | Yes. |
| Do photos have all required releases and no confidential materials? | Yes. |
| Does the primary CTA route to a real destination? | Yes. |
| Do the hero, cover, and mobile crops show the face / evidence correctly? | Yes, reviewed on device. |
| Have `lint:blocks`, `verify:images`, `check`, and `build` passed? | Yes. |

## References

[1]: https://docs.astro.build/en/guides/content-collections/ "Astro Content Collections"
[2]: https://tailwindcss.com/docs/installation/framework-guides/astro "Tailwind CSS with Astro"
