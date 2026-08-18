# AURA Content Model and Authoring Guide

## Why the site is content-driven

AURA separates **strategy and content** from **layout code**. A client site is composed from a typed brand record, typed page records, and MDX thought-leadership posts. The Astro renderer turns those records into static pages. This is the central operational advantage over bespoke page-builder work: a new site can be validated before it is published, and a changed component benefits every page that uses it. Astro content collections provide the schema-validation foundation. [1]

```text
src/content/
├── brand/
│   └── client-slug.json        # identity, positioning, navigation, conversion policy
├── pages/
│   ├── home.json               # ordered blocks + each block’s content
│   ├── about.json
│   ├── method.json
│   ├── work-with-me.json
│   ├── speaking.json
│   └── contact.json
└── posts/
    └── article-slug.mdx        # essay + frontmatter
```

## The three collections

| Collection | Purpose | Authoring frequency | Example |
|---|---|---|---|
| `brand` | Durable truth about one client: identity, positioning, proof library, theme, navigation, primary conversion | Once at launch; update when strategy changes | `src/content/brand/priya-raghavan.json` |
| `pages` | Page-level persuasion sequence and block data | At launch and when offers/pages change | `src/content/pages/home.json` |
| `posts` | Thought-leadership articles | Ongoing publishing cadence | `src/content/posts/*.mdx` |

The schema is defined in `src/content.config.ts`. The component mapping is defined only once in `src/lib/blockRegistry.ts`. When a new block is added, add its schema variant, create its component, and register it. This deliberately makes the system fail early if any part of the contract is missing.

## Brand file: the non-negotiable strategy record

The brand record should be completed after discovery, not invented by a designer. It determines the site’s theme, how the header and footer behave, what schema is emitted, and what CTA hierarchy is allowed.

| Brand area | Required decision | Quality standard |
|---|---|---|
| Identity | Name, title, one-line category statement | A stranger can say what this person does in one sentence. |
| Archetype | Authority hub, firm with figurehead, transformation, single-offer funnel | Matches revenue model rather than aspirational aesthetics. |
| Positioning | Audience, promise, differentiator, method, enemy | Each field is concrete enough to shape hero copy. |
| Conversion | One primary goal and CTA; optional secondary CTA; lead magnet policy | Primary CTA is not a vague “Learn more.” |
| Proof | Stats, media logos, client logos, testimonials, awards | Every claim is attributable, permissioned, and specific. |
| Assets | Hero portrait, secondary portrait, signature, open graph image | Maps to the photography shot library. |
| Integration | Analytics, calendar, form endpoint | Actual keys/endpoints never live in public content when they need secrecy. |

### Minimal brand example

```json
{
  "name": "Alex Morgan",
  "title": "Growth Advisor to Technical Founders",
  "tagline": "Make the work the market already trusts easier to understand.",
  "archetype": "personal-authority-hub",
  "theme": "obsidian-gold",
  "positioning": {
    "audience": "B2B founders with a strong product and unclear category position",
    "promise": "Turn technical evidence into a referenceable category story",
    "differentiator": "Former operator who has led the same transition inside product-led companies",
    "methodName": "The Signal-to-Category Method",
    "enemy": "generic thought leadership without product evidence"
  },
  "conversion": {
    "primaryGoal": "book-call",
    "primaryCta": {
      "label": "Book a category call",
      "href": "/contact/",
      "intent": "primary"
    }
  }
}
```

## Pages are ordered blocks, not hand-coded layouts

Each page declares a path, SEO metadata, archetype, and an ordered `blocks` array. The dynamic route in `src/pages/[...path].astro` retrieves the page, retrieves its referenced brand, builds schema, then passes blocks to `BlockRenderer.astro`.

```json
{
  "path": "/",
  "brand": "alex-morgan",
  "archetype": "home",
  "seo": {
    "title": "Alex Morgan | Growth Advisor to Technical Founders",
    "description": "Turn technical evidence into a category story your market can repeat.",
    "schemaType": "ProfilePage"
  },
  "blocks": [
    {
      "type": "HeroSplitPortrait",
      "tone": "inverse",
      "eyebrow": "Growth advisory",
      "heading": "Your product is real. Your category is still vague.",
      "portrait": {
        "src": "/images/alex-morgan/portrait-hero.png",
        "alt": "Alex Morgan, growth advisor",
        "width": 1200,
        "height": 1500
      },
      "ctas": [
        { "label": "Book a category call", "href": "/contact/", "intent": "primary" }
      ]
    }
  ]
}
```

## CTA and conversion policy

AURA distinguishes CTA **intent**, not just button appearance. The distinction is strategic: a landing page should repeatedly advance one business goal, not present a menu of equal-weight possibilities.

| Intent | Appropriate use | Visual role | Example |
|---|---|---|---|
| `primary` | The one conversion that advances the page goal | Filled / highest contrast | “Book a strategy call” |
| `secondary` | A lower-friction supporting route | Outline / lower contrast | “See the method” |
| `tertiary` | Context, proof, reading, or non-conversion navigation | Text link / ghost | “Read the full case study” |

The `brand.conversion.primaryGoal` explains the business model. The `pnpm lint:blocks` command warns when a high-intent page lacks a close, offers no proof, or diffuses its primary CTA across too many destinations.

## Forms: safe demo and production endpoint modes

Forms are provider-agnostic. The `action` field accepts a real endpoint from Formspree, ConvertKit, HubSpot, or a server/API route. The permanent demo deliberately uses `demo://…` actions; they confirm that nothing has been stored. This prevents accidental collection by a public sample site.

| Context | `action` value | Behavior |
|---|---|---|
| Public AURA demo | `demo://authority-audit` | Validates inputs and displays a non-collection notice. |
| Production with form provider | `https://formspree.io/f/...` or provider URL | Browser submits using progressive enhancement. |
| Production with server endpoint | `/api/contact` | Use a server-capable host and secure the endpoint; do not expose secrets in content files. |

## Authoring workflow

| Step | Owner | Output | Gate |
|---:|---|---|---|
| 1 | Strategist / client | Completed discovery questionnaire | No generic claims or unverified proof. |
| 2 | Copy lead | Brand JSON | Audience, promise, method, and primary goal are explicit. |
| 3 | Designer / photo producer | Asset library | Eight shot roles and all required crops exist. |
| 4 | Content author | Page JSON + MDX posts | Blocks follow persuasion sequence. |
| 5 | Developer / QA | Build output | `lint:blocks`, `verify:images`, and `build` pass. |
| 6 | Stakeholder | Production approval | Facts, testimonials, logos, links, and legal claims are approved. |

## Starting a new client

Use the scaffold command rather than copying the demo by hand.

```bash
pnpm new:client -- \
  --slug alex-morgan \
  --name "Alex Morgan" \
  --title "Growth Advisor to Technical Founders" \
  --theme obsidian-gold \
  --archetype personal-authority-hub
```

The command creates a **portable client content pack** under `clients/alex-morgan/src/content/`; it does not overwrite the live demo. It explicitly marks every missing strategic decision with `[DISCOVERY REQUIRED: …]`. Replace all such fields, add the photo library under `public/images/alex-morgan/` in a fresh AURA clone, then replace that clone’s demo `src/content/` directory with the completed pack and run validation.

```bash
pnpm lint:blocks
pnpm verify:images
pnpm build
```

## Content quality checks

Before publication, check every claim and every image object. The schema catches missing structural fields, but it cannot establish that a testimonial is authorized or that a statistic is accurate. Those remain editorial and legal responsibilities.

> **Content rule:** A typed content model protects the build. It does not replace judgement, attribution, client approval, or fact-checking.

## References

[1]: https://docs.astro.build/en/guides/content-collections/ "Astro Content Collections"
