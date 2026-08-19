# Private Signal: Photography and Prompt-Packet Review

This document exposes the actual **AURA Compiler** asset and prompt outputs for the Private Signal reference pack. The pack is a concept demonstration, so every proposed image is marked `synthetic_concept`; no real client identity reference, customer relationship, event, result, media appearance, or testimonial is implied.

## Generated photography plan

| Code | Visual job | Page placements | Desktop / mobile crop | Concept safety and publication condition |
|---|---|---|---|---|
| **P02** | Hero presence. Establishes composed private authority and reserves negative space for the opening tension headline. | Home and supporting private-advisory pages. | `16:9` / `4:5` | Must remain a clearly conceptual editorial scene until a consented identity reference or commissioned photograph is approved. |
| **P09** | Method artifact. Makes the Quiet Authority Method feel material without a decorative icon grid. | Home and Method. | `3:2` / `4:5` | Must not contain invented readable reports, brand marks, case data, or fake proprietary documents. |
| **P05** | Working scene. Demonstrates serious work in progress rather than generic laptop-stock behavior. | Home, About, Method, Work With Me, Case Files. | `3:2` / `4:5` | May not imply a real client engagement unless that relationship is approved and documented. |
| **P06** | Editorial close. Gives the fit / concierge conversion moment warmth and human proximity. | Home, Work With Me, Contact. | `4:5` / `4:5` | Must use a calm, credible expression—not an artificial high-energy sales pose. |
| **P12** | Signature asset. Creates a distinct final-conversion object, mark, or editorial detail instead of repeating the hero portrait. | Home and supporting pages. | `3:2` / `4:5` | Must reinforce the decision moment without fabricated signatures, books, awards, or media. |

The current generated shotlist deliberately leaves **wardrobe chapter, location chapter, alt text, and final quality checks unresolved**. That is a feature, not a defect. Those items require either client approval or a concept-art direction decision before image generation starts.

## Role-by-role generation packet structure

The compiler now generates a separate `photo-<code>.md` packet for every planned role. Each packet contains the following fields.

| Packet section | What it binds | Why it matters |
|---|---|---|
| **Approved context** | Architecture, visual world, image strategy, consent state, placements, desktop and mobile crop. | Prevents a beautiful but strategically or legally wrong image. |
| **Visual job** | The specific narrative work the frame must do. | Stops a single portrait being reused as hero, proof, offer and final CTA decoration. |
| **Generation prompt** | Composition, material world, crop, wardrobe/location placeholders, quality bar and exclusions. | Gives an image model a precise instruction without implying false documentary proof. |
| **Photographer alternative** | Equivalent commissioned-photo instruction. | Keeps the system usable whether assets are commissioned, AI-assisted, or synthetic concept. |
| **Required QA** | Provenance, anatomy, edge, text-artifact, crop and alt-text checks. | Makes visual review a repeatable release gate rather than subjective browsing. |

### P02 hero-presence prompt, condensed

> Create a clearly conceptual premium editorial hero photograph in the Private Signal material world: obsidian, parchment, aged brass, and dark walnut. Use a cinematic subject placement with deliberate negative space for the headline. Deliver a 16:9 desktop frame and preserve a separate 4:5 mobile crop. Avoid visible logos, readable invented text, fabricated events or client work, plastic skin, malformed hands, stock-photo poses, and unrelated lifestyle props.

The exact generated packet also carries a photographer alternative and QA checklist. It does **not** select a wardrobe or location autonomously; those are deliberately approval-bound fields.

### P09 method-artifact prompt, condensed

> Create a clearly conceptual material method artifact for the Quiet Authority Method. It must make the process feel considered and physical without generating fake reports, readable invented text, fabricated metrics, or unapproved brand marks. Deliver a 3:2 desktop frame and a 4:5 mobile crop.

### P05 working-scene prompt, condensed

> Create a credible work-in-progress scene in the same private-room visual world. Show an authentic analytical action or considered work material, never a generic laptop pose. The frame may not imply a real client engagement without approved context.

### P06 editorial-close prompt, condensed

> Create a warm, close editorial portrait for the fit or final-conversion moment. The subject should appear calm and intelligent, with no exaggerated expression or direct-response sales energy. Deliver an intentional 4:5 crop for both desktop and mobile.

### P12 signature-asset prompt, condensed

> Create an editorial object, mark, or material closing detail that reinforces a private decision. It should not repeat the hero portrait and may not fabricate a published book, signature, award, media affiliation, or result.

## Prompt packet inventory

| File | Generated purpose | Claim / approval safeguard |
|---|---|---|
| `01-positioning.md` | Generates strategic positioning alternatives from the buyer, tension, offer, method and visual world. | Lists only `concept-method` and `concept-proof-standard`; blocks new public facts. |
| `02-page-plan-review.md` | Reviews the selected page sequence, visitor states, claim IDs and photo roles. | Flags any unsupported section before copy production. |
| `page-home.md` | Drafts the six Private Signal home transitions: hero, problem, method, proof, fit and final conversion. | Identifies exactly which sections may reference which claim IDs; forbids treating concept proof as live proof. |
| `page-*.md` | Drafts each supporting page from the same approved pack. | Carries the same fact policy rather than letting every page invent a new story. |
| `03-photo-direction.md` | Provides the asset-level visual-world and consent brief. | Explicitly prohibits fake clients, events, endorsements and published media. |
| `photo-p02.md` through `photo-p12.md` | Provides individual image-generation and photographer packets. | Forces crop, provenance, concept state and QA checks per image role. |

## Current status and handoff

| Item | Status | Required next action |
|---|---|---|
| Architecture | Approved `private-signal` | None for the reference test. |
| Image strategy | `synthetic_concept` | Keep concept disclosure until a real client gives identity / usage consent. |
| Shot roles | Five planned roles | Approve wardrobe and location chapters. |
| Prompts | Generated and auditable | Review / revise with a human art director before generation. |
| Asset manifest | Planned only | Add selected asset paths, dimensions, alt text, provenance and publication permission. |
| Final image QA | Pending | Inspect anatomy, edges, text artifacts, desktop crop and mobile crop after generation. |

The public Private Signal reference site already uses a separate, previously reviewed concept photo chapter. The compiler pack above demonstrates how the **next** asset chapter is planned and constrained before a new image is generated or released.
