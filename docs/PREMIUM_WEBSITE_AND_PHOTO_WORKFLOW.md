# Premium Website and AI Photography Workflow

This workflow is designed for a high-value consultant, adviser, founder, speaker, or operator whose website must feel less like a collection of marketing blocks and more like a **private, coherent world**. The build is intentionally staged. Copy, design, photography, and conversion decisions are approved in the right order so the final site feels authored rather than assembled.

> **The constraint that creates premium work:** never ask the same image, section, or line of copy to do every job at once.

## 1. Delivery system

| Stage | Working session / input | Client-facing output | Production gate |
|---|---|---|---|
| **01. Evidence intake** | 90-minute founder interview, prior decks, deal / outcome history, client permission status, existing audience data | Evidence inventory, language bank, and claims register | Nothing with a public claim is designed before its evidence status is known. |
| **02. Position architecture** | Audience, desired room, commercial target, tensions the expert can credibly own | One-sentence position, named enemy, signature point of view, headline territory | The home-page tension must be specific enough to exclude as well as attract. |
| **03. Art-direction board** | Visual references, wardrobe, locations, architectural materials, design-route selection | One approved visual world, chromatic range, type pair, image roles, motion rules | No page design begins until the world feels recognizably different from a generic agency template. |
| **04. Photography pre-production** | Human identity references, shoot constraints, real locations / AI strategy, audience setting | Shot list, wardrobe map, lighting map, crop requirements, prompt packets | Every needed website image has a declared narrative role. |
| **05. Content and wire choreography** | Position, evidence, images, conversion choices | Page narrative outlines, section sequence, low-fidelity conversion map | Each page must have one primary decision and one secondary intelligence action. |
| **06. Premium implementation** | Approved direction, responsive crops, content model | Astro / Tailwind site with lightweight motion, schema, page templates, performance budget | No opaque page-builder content. All copy and media live in typed content files. |
| **07. Proof and conversion audit** | Claim permissions, form endpoint, legal wording, analytics plan | Approved case files, form behavior, tracking specification | Nothing fictional or unapproved may appear as a real client claim. |
| **08. Mobile / launch review** | Real device checks, 390px crop review, keyboard / form audit | Launch checklist, image manifest, editorial operations guide | Mobile is a separately composed experience, not a scaled desktop screenshot. |

## 2. Design decision sequence

A premium personal-brand site should be chosen through **commitments**, not moodboard accumulation.

| Decision | Select one | Effect on the build |
|---|---|---|
| Brand temperature | Quiet private office / cinematic authority / intellectual studio / energetic category creator | Controls color, texture, photo lighting, and section pacing. |
| Hero posture | Present / in action / close editorial / architectural silhouette | Defines opening image direction and headline scale. |
| Core proof form | Case files / signature framework / third-party authority / body of work | Determines what must appear in the first three scroll lengths. |
| Conversion posture | Private conversation / diagnostic / advisory application / newsletter / event invitation | Limits the CTA system to an intentional hierarchy. |
| Photo truth level | Real commissioned photography / AI-augmented real identity / fully synthetic concept demo | Determines consent, disclosure, and image generation methods. |

The current AURA demo should be treated as **fully synthetic concept work**. A real client should migrate to either commissioned photography or AI-augmented photography built from images supplied with clear consent.

## 3. Premium photo-direction system

The visual library contains **twelve roles**, not twelve interchangeable headshots. A real shoot may capture all twelve; an AI-assisted shoot generates only the frames the eventual page architecture actually needs.

| Code | Shot role | Website placement | Frame and crop | Direction |
|---|---|---|---|---|
| `P01` | Identity anchor | Art direction / reference only | 4:5 vertical, head and shoulder | Neutral expression, clean face reference, soft window light. |
| `P02` | Hero presence | Home hero | Desktop 16:10 + mobile 4:5 | Subject placed on the side opposite the headline; environment has usable negative space. |
| `P03` | Hero cut-out | Alternative hero / page title | Transparent 4:5 | Full or 3/4 length, controlled edge light, no hands cropped awkwardly. |
| `P04` | Private-room portrait | About or private advisory page | 3:4 vertical | Seated, still, composed, visual quiet. |
| `P05` | Working scene | Method / case story | 3:2 landscape | The expert is doing something credible: examining material, speaking, annotating, listening. |
| `P06` | Editorial close-up | Conversion close or side rail | 4:5 vertical | Human proximity without exaggerated expression. |
| `P07` | Stage / room proof | Speaking / social proof | 16:9 landscape | Context first: audience, architecture, light, scale. |
| `P08` | Conversation frame | Testimonials / case supporting image | 3:2 landscape | Candid two-person or group interaction, active listening, no fake handshake. |
| `P09` | Artifact still life | Section transition / method | 4:3 landscape | Notebook, marked document, book, handwritten diagram, material detail. |
| `P10` | Architectural texture | Background / divider | 16:9 landscape | Stone, linen, shadow, brass, glass, paper, or room detail that matches the brand world. |
| `P11` | Motion frame | Subtle scroll or hover treatment | 9:16 vertical or 16:9 | A short, quiet movement such as walking into a room or arranging papers. |
| `P12` | Signature / asset | Closing section and email system | Transparent or 3:1 | Handwritten mark, device, book object, or printed statement. |

## 4. Photography prompt architecture

Use the following prompt stack. It is deliberately modular so the person, setting, and grade remain consistent across frames.

```text
[IDENTITY]
Use the supplied consented identity reference. Preserve facial geometry, approximate age,
skin tone, and distinguishing features. Do not beautify into a different person.

[ROLE]
P05 — working scene for a premium executive-advisory website.

[WARDROBE]
Charcoal tailored jacket, warm ivory silk shirt, minimal jewelry, no visible logo, no bright pattern.

[ENVIRONMENT]
A refined private library / boardroom after golden hour. Dark walnut, stone, editorial paper texture,
soft practical lamp in the background. It must feel plausible, not like a generic co-working office.

[COMPOSITION]
3:2 landscape. Subject occupies the right third, seated at a table marking a printed strategic map.
Leave deep, softly focused negative space on the left for optional web copy. Hands anatomically natural.

[CAMERA + LIGHT]
Full-frame editorial camera, 50 mm lens, f/2.8, natural shallow depth of field, controlled tungsten practicals,
soft window key, subtle film grain. Warm blacks; protect skin tone and fabric texture.

[GRADE]
Obsidian, parchment, aged brass, muted auburn. Gentle contrast. No teal-orange grade.

[NEGATIVES]
No laptop stock-photo pose, no visible brand mark, no extra fingers, no plastic skin, no text in image,
no overt luxury props, no exaggerated smile, no AI bokeh artifacts.
```

## 5. AI generation protocol

| Step | Action | Quality control |
|---|---|---|
| **A. Consent and identity** | Collect 8–15 clear reference photos, through explicit client permission, across neutral and three-quarter angles. | Verify that images are provided by / licensed for the client. Do not fabricate a real person’s identity from public images. |
| **B. Build the anchor** | Generate or select `P01` first. This locks face, hair, wardrobe register, skin rendering, and base grade. | Reject any image whose facial identity, age, or physical characteristics drift from the reference. |
| **C. Generate by wardrobe chapter** | Create all P02–P05 in one wardrobe and one environment family before moving to a second look. | Consistency is more valuable than having many locations. |
| **D. Generate variants deliberately** | Request three composition variants for each image role: copy-left, copy-right, mobile-safe centre. | Choose a frame based on the actual page component, not on isolated beauty. |
| **E. Retouch and process** | Despill cut-outs, create responsive crops, convert images to WebP / AVIF as appropriate, inspect mobile framing. | Never publish raw generative output without an edge, hand, jewelry, typography, and face inspection. |
| **F. Assign semantic role** | Register every chosen image with its page purpose, alt text, crop, and usage cap. | Do not reuse hero images as unrelated case evidence. |

## 6. Asset naming and performance standard

```text
/public/images/brand/
  p01-identity-anchor.webp
  p02-hero-presence-desktop.webp
  p02-hero-presence-mobile.webp
  p03-hero-cutout.png
  p05-working-scene.webp
  p07-stage-proof.webp
  p09-artifact-ledger.webp
  p10-texture-walnut.webp
```

The visual target is a **sub-1.5 MB first page image budget** on a typical high-end personal-brand home. The hero should use one appropriately sized modern image, not an unnecessarily large transparent PNG plus unrelated background video. Load images below the first viewport lazily, supply intrinsic dimensions, use distinct mobile crops when the subject location demands it, and preserve a low-motion experience for users who request reduced motion.

## 7. Homepage photo choreography for Private Signal

| Page moment | Visual role | Visitor effect |
|---|---|---|
| Hero | `P02` hero presence + optional `P03` cut-out | The expert arrives with cinematic presence and one precise promise. |
| After tension | `P10` architectural detail / barely visible texture | The page takes a breath without becoming decorative. |
| Method | `P09` artifact still life or annotated document | The work feels crafted and tangible, not merely verbal. |
| Proof / case | `P05` working scene plus permissioned evidence | The person becomes credible through action, not a larger headshot. |
| Story | `P04` private-room portrait | Human proximity arrives after confidence is earned. |
| Closing conversion | `P06` editorial close-up or `P12` brand artifact | Ends with calm, high-touch invitation rather than pressure. |

## 8. Build definition of done

A premium site is ready for launch only when every item below is true.

| Check | Standard |
|---|---|
| Position | A qualified buyer can summarize the person’s value in one sentence after the first screen. |
| Photography | Every image has a unique role, a responsive crop, and a quality pass. |
| Claims | All names, results, logos, and quotations are permissioned or clearly anonymized. |
| Conversion | There is one primary action per page and one lower-commitment alternative at most. |
| Performance | No large unoptimized images, layout shift, blocked interaction, or gratuitous motion. |
| Accessibility | Logical heading order, keyboard navigation, focus states, contrast, image alt decisions, and form labels are verified. |
| Operations | A non-developer can add a case file, update a page, replace an image, and publish a field note through documented content files. |
