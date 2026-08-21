# Private Signal Wireframe and Design-Contract Inspection

## Inspection scope

This inspection reviews the generated wireframe approval document at `clients/priya-raghavan/03-production/wireframes/site-wireframe.html` and the corresponding implementation contract at `clients/priya-raghavan/03-production/design-contracts/design-contract.md`. Both artifacts were regenerated on 2026-08-21 after the home-page anchor was corrected from a dash-only identifier to the semantic `id="home"`.

## HTML wireframe structure

The wireframe is a standalone HTML approval artifact rather than a public page. Its document structure is intentional.

| HTML layer | Exact implementation decision | Review purpose |
|---|---|---|
| Document shell | `lang="en"`, viewport metadata, independent CSS, and a client-specific title | Opens without the Astro site and remains reviewable by a client or strategy lead. |
| Cover | Dark editorial cover with buyer, primary decision, visual world and proof posture | Forces the reviewer to approve commercial context before looking at sections. |
| Approval band | A high-contrast rule that states copy and prompt candidates remain unapproved | Separates design approval from content publication. |
| Page board | One `<article class="page-board">` per page with stable IDs: `home`, `about`, `method`, `work-with-me`, `case-studies`, `contact` | Makes each page a discrete approval object. |
| Page header | Page route, visitor, desired decision, primary action and exact form fields | Prevents an attractive layout from hiding an incorrect conversion route. |
| Desktop canvas | A 1440px / 12-column annotation surface with navigation and 8:4 copy/media section grid | Shows hierarchy, dominant copy area, image role and section ordering. |
| Mobile canvas | A 390px / 4-column composition that replaces the desktop canvas below 700px | Makes mobile a deliberate sequence: navigation, stacked sections, then a 48px sticky CTA. |
| Release conditions | Six end-of-document conditions covering CTA, claims, photo roles, mobile behavior, block mapping and separate release gates | Ensures wireframe sign-off does not bypass technical or claim controls. |

The HTML uses the following compositional contracts. The desktop `wire-grid` is an `8fr / 4fr` split: the left eight-column equivalent holds visitor-state copy and candidate blocks, while the right four-column equivalent holds the image role and crop approval. On mobile the desktop canvas is hidden; each section becomes a single `mobile-block`, and the primary CTA remains at least 48px tall. The visual palette is deliberately utilitarian—ink, paper, line, aged accent—because the artifact is designed to expose decisions, not imitate the finished Private Signal website.

## Private Signal home-page wireframe

| Position | Visitor state | Section job | Selected Astro block | Desktop composition | Mobile composition | Proof / image boundary |
|---:|---|---|---|---|---|---|
| 01 | Recognition | State the authority tension without unsupported market claims | `HeroSplitPortrait` | Copy / portrait split | Copy first, then P02 portrait crop | No public claim; P02 needs source, crop and alt approval. |
| 02 | Cost | Mirror the private cost of a lagging public signal | `EmpathyQuoteWall` | Wide tension statement | Single-column tension statement | No visual asset or public proof claim. |
| 03 | Conviction | Explain the named method as an ordered mechanism | `MethodologyPillars` | Artifact plus ordered method grid | Artifact, then stacked method | `concept-method` and `concept-proof-standard`; P09 artifact. |
| 04 | Trust | Explain the evidence standard without inventing outcomes | `ResultsGrid` | Evidence ledger / proof grid | Stacked proof ledger | Concept method / proof-standard claims only; P05 working scene. |
| 05 | Permission | Qualify the advisory relationship | `AudienceQualifier` | Qualified-fit split | Fit criteria, then action | No public claim; P06 editorial close. |
| 06 | Action | Request the right level of private context | `FinalCta` | Conversion panel plus reassurance | Single conversion panel plus 48px CTA | No public claim; P12 signature asset. |

The home uses one form intent, `private_conversation`, and six qualification fields: name, email, company, decision context, timing, and desired outcome. The contract preserves that exact list on all six pages so the form cannot silently become a generic contact capture.

## Supporting-page design contract

The contract reduces the amount of design reinvention while keeping each supporting page commercially specific. The About page introduces earned authority through `CrucibleMoment`; Method repeats only mechanism, proof and conversion; Work With Me begins with fit logic before offer detail; Case Studies communicates a permissioned evidence standard; Contact begins with qualification rather than a blank form. Each primary CTA remains “Request a private conversation,” but each page has a distinct desired decision.

## Implementation guardrails

The design contract binds each section to the block registry before implementation. It requires one H1, semantic heading order, exact CTA intent, the approved form field list, a responsive re-composition rather than stacked desktop, a traceable claim ID adjacent to proof, and image provenance/crop/intrinsic-dimension/alt-text review. The wireframe can be approved only as an artifact; content promotion and release authorization remain separate operations.
