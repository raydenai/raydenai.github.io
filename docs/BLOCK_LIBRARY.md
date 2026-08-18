# AURA Block Library

AURA ships **45 presentation blocks** across nine families, plus 11 primitives and the shared site shell. Blocks are selected to serve a persuasion role rather than to provide a generic visual catalogue.

## How to select blocks

Select a block by answering one question: **what must the visitor believe next?** The page should never begin from “what would look good in this section?” A proof block establishes credibility; a mechanism block makes the offer intelligible; an offer block helps qualified visitors choose; a conversion block turns readiness into action.

| Family | Persuasion role | Do not use it to |
|---|---|---|
| Hero | Establish relevance and the next action | Recite a complete biography or show every offer. |
| Proof | Make competence believable | Substitute borrowed logos for real client outcomes. |
| Problem | Demonstrate audience fluency | Manufacture anxiety or make unsupported claims. |
| Mechanism | Explain why the approach is different | Turn methodology into decorative jargon. |
| Story | Transfer trust through motive and judgement | Publish a chronological résumé. |
| Offer | Help a qualified visitor self-select | Force every service into equal importance. |
| Content | Support authority and nurture | Add empty content grids. |
| Conversion | Make one next step explicit | Collect data before a person has a reason to trust you. |
| Structure | Handle objections and reading flow | Add visual noise. |

## Hero family

| Block | Use when | Essential fields | Guardrail |
|---|---|---|---|
| `HeroSplitPortrait` | The expert is the product and a direct portrait is an asset | `heading`, `portrait`, CTA(s), optional proof card | Use a cut-out hero only with a mobile-safe crop. |
| `HeroSplitOptin` | The primary business goal is email capture | `portrait`, `form`, `heading` | Use for a genuine asset, not “subscribe for updates.” |
| `HeroCenteredStatement` | The thought or movement is more important than the portrait | `heading`, optional rotating words or background | Keep the statement plain enough to be understood in one reading. |
| `HeroVideoOverlay` | A high-quality reel or film is the strongest opening evidence | `background`, `videoUrl`, `heading` | Do not use a video placeholder or an auto-playing clip. |
| `HeroSegmented` | Two genuinely different audiences need self-routing | `segments` | Use only when both routes are real; otherwise clarify the primary audience. |

## Proof family

| Block | Use when | Essential fields | Guardrail |
|---|---|---|---|
| `LogoStrip` | Earned media, client, or partner credibility is valid and approved | `logos` | Do not imply endorsement through a logo without permission. |
| `CredibilityBar` | You have 2–5 meaningful quantitative facts | `stats` | Every number needs a clear denominator or scope. |
| `CredibilityStack` | Formal credentials are material to trust | `credentials` | Avoid turning a résumé into the first emotional message. |
| `AuthorityQuote` | One high-signal endorsement carries more weight than many | `testimonial` | Attribute precisely and secure permission. |
| `TestimonialGrid` | Multiple proof stories should be scanned | `testimonials`, layout, columns | Feature concrete result language, not adjective-only praise. |
| `TestimonialSlider` | Quotes need room and sequencing on mobile | `testimonials` | Do not auto-play motion for accessibility-sensitive content. |
| `AssociationGrid` | Interviews, collaboration, or relevant “rooms” are real proof | `people` | Explain relationship accurately; association is not endorsement. |
| `ResultsGrid` | Before/after work can be made specific | `results` | Prefer client names with permission; otherwise use legitimate anonymized industry framing. |

## Problem family

| Block | Use when | Essential fields | Guardrail |
|---|---|---|---|
| `ProblemAgitation` | The audience needs the cost of inaction articulated | `painPoints`, optional `media` | Name material cost without overstating certainty. |
| `EmpathyQuoteWall` | Audience language is unusually revealing | `quotes` | Use real interview language, lightly edited for privacy and clarity. |
| `AudienceQualifier` | Fit matters more than traffic volume | `forWhom`, `notForWhom` | A credible “not for” list increases trust. |
| `FuturePacing` | A tangible desired state can be described honestly | `outcomes` | Keep outcomes within the client’s real scope. |
| `IconGrid` | A framework needs a concise visual explanation | `items` | Choose meaningful icons; do not make a decorative feature checklist. |

## Mechanism family

| Block | Use when | Essential fields | Guardrail |
|---|---|---|---|
| `MethodologyPillars` | The method has 3–5 durable parts | `methodName`, `pillars` | Each pillar must have distinct work, not a synonym. |
| `NumberedFramework` | The work is sequential | `steps` | Tell the visitor what each step produces. |
| `PrincipleZigZag` | Contrarian principles need space and rhythm | `principles` | Use 3–6 principles; more usually means no selection has been made. |
| `ProcessTimeline` | Process risk is the objection | `steps`, optional duration | State what happens, when, and who does the work. |

## Story family

| Block | Use when | Essential fields | Guardrail |
|---|---|---|---|
| `OriginStory` | A short credible origin can bridge problem to method | `excerpt`, optional portrait/signature | Use one pivotal thread rather than every career step. |
| `CrucibleMoment` | There is a vivid scene that led to the method | `moment`, optional year/aftermath/background | The moment should be specific enough to visualize and true enough to defend. |
| `Manifesto` | A clear set of beliefs filters the market | `beliefs`, optional signature/video | A manifesto is a point of view, not a list of values. |
| `IdentityCallout` | The audience responds to a named identity or tribe | `traits` | Use carefully; this is a qualifier, not a gimmick. |

## Offer family

| Block | Use when | Essential fields | Guardrail |
|---|---|---|---|
| `ServicesGrid` | Visitors need a compact menu of genuine paths | `services` | A grid is early wayfinding; follow with proof before a detailed sale. |
| `OfferLadder` | The brand has a sensible free-to-premium ascension path | `rungs` | Do not manufacture low-ticket offers merely to fill the ladder. |
| `HighTicketOffer` | One premium engagement deserves a detailed case | `deliverables`, `idealFor`, optional investment/media | Give qualified visitors enough detail to rule themselves in or out. |
| `SpeakingTopics` | The person sells keynotes, workshops, or facilitation | `topics`, optional reel/event logos | Use genuine audience and event proof. |

## Content family

| Block | Use when | Essential fields | Guardrail |
|---|---|---|---|
| `BookShowcase` | A book or substantive artifact establishes authority | `books` | Only show a real book/product or label it as forthcoming. |
| `PodcastPromo` | An ongoing show creates a listening route | `showName`, platforms, optional episodes | Maintain it or remove it. Empty podcast brands weaken trust. |
| `VideoGrid` | Video proof or teaching is genuinely useful | `videos` | Thumbnails need a clear title and accessible destination. |
| `MediaFeatures` | Earned placements contribute meaningful credibility | `features` | Link to the original story when possible. |
| `PostsGrid` | The thought-leadership archive supports nurture | slugs or limit | Publish fewer, stronger articles rather than filler. |
| `PersonalStats` | Non-business facts humanize a credible person | `stats` | Keep them relevant to identity or values. |

## Conversion family

| Block | Use when | Essential fields | Guardrail |
|---|---|---|---|
| `LeadMagnet` | A useful asset merits email exchange | magnet, benefits, mockup, form | The asset must solve a small real problem now. |
| `LeadMagnetBanner` | Capture needs a compact repeated placement | magnet, form | Use sparingly; no page should feel like an interruption stack. |
| `DualCtaTransition` | Two legitimate readiness states exist | CTA array | Each CTA should advance the same business model. |
| `FinalCta` | The visitor has sufficient context to act | heading, CTA(s), reassurance | End with one decisive primary action. |
| `ApplicationForm` | Fit screening protects a high-touch offer | full form, reassurance, after-submit detail | Ask only questions that change qualification or response. |
| `ContactSplit` | Trust improves when a real person and response promise are visible | channels, response time, portrait, form | Use a real inbox and actual response-time promise. |

## Structural family

| Block | Use when | Essential fields | Guardrail |
|---|---|---|---|
| `FaqAccordion` | Objections can be resolved accurately in writing | `faqs` | Use direct, answer-shaped language; FAQ schema is generated automatically. |
| `RichText` | A longer explanation needs readable prose | markdown | Preserve a clear hierarchy; do not bypass the page sequence with a wall of text. |
| `Gallery` | Images themselves are evidence | images, columns | Use original or properly licensed imagery and descriptive alt text. |

## Primitives and shared behavior

The blocks are assembled from 11 primitives: `Section`, `Container`, `Button`, `BlockHeader`, `Portrait`, `Form`, `TestimonialCard`, `StatItem`, `LogoWall`, `RotatingWords`, and `Icon`. Shared layout components supply announcement bar, responsive header, footer, and lightbox. The global base layout supplies metadata, structured data, analytics hooks, header behavior, and progressive reveal.

```text
Block data → BlockRenderer → registered Astro block → primitive components → static HTML/CSS
```

The first heading-bearing block of a non-hero page is automatically promoted to an `h1`. This prevents a common component-system accessibility error: a visually correct page that has no document-level heading.
