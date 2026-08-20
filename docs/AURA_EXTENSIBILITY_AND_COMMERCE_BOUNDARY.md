# AURA Extensibility and Commerce Boundary

AURA is a **premium personal-brand and expert-platform compiler**. Its extensibility model is a controlled architecture profile: a profile declares buyer signals, discovery requirements, page roles, default routes, conversion intent, form fields, photography roles, and proof posture. The compiler then generates the same auditable client-pack, evidence, asset, content, and release artifacts for the new motion.

## Enterprise B2B extension

The new `enterprise-b2b` profile is designed for an expert-led enterprise platform with a multi-person buying motion. It does not turn AURA into a general SaaS application generator. It provides the page, proof and conversion architecture required for an expert company that sells a scoped B2B engagement or platform through discovery.

| Concern | Enterprise B2B profile behavior |
|---|---|
| Buyer | Enterprise leaders, project sponsors, technical evaluators, procurement stakeholders, and implementation owners. |
| Commercial tension | An initiative has implementation, integration, security, operating, or buying-committee constraints that generic marketing pages cannot resolve. |
| Home sequence | Hero → enterprise problem mirror → named method → permissioned proof → solution / offer → discovery conversion. |
| Primary conversion | `enterprise_discovery`, with name, work email, company, role, team size, initiative, and timing. An approved client pack may override this with more appropriate discovery fields. |
| Supporting pages | Solutions, Method, Case Studies, Resources, Company, and Contact. |
| Proof posture | Permissioned operational outcomes, scoped case anatomy, implementation constraints, and explicit buyer relevance. The engine does not accept unnamed logo wallpaper as proof. |
| Visual system | Executive P02 portrait, P05 operating context, P08 stakeholder conversation, and P09 method artifact. |

The profile uses the same strict release policy as every other AURA archetype. A live enterprise pack must have approved evidence, asset permissions, a real domain, privacy path, approved form provider/endpoint, and no concept-only claims.

## Why e-commerce is outside the core engine

AURA may compile an expert-led **brand, education, product-story, and conversion** layer around a commerce business. It is not responsible for carts, payment capture, order state, tax, shipping, inventory, fulfillment, refunds, or customer accounts. Those functions require a commerce backend and should not be reconstructed as static JSON blocks or browser-side form logic.

For an e-commerce site, use the appropriate Shopify storefront and checkout integration for commerce operations. AURA can still serve one of two safe roles:

1. **Pre-commerce expert brand:** use AURA to build the founder story, product thesis, research library, buyer education, product-discovery content, and email / application route; then hand qualified visitors to Shopify product and checkout surfaces.
2. **Editorial storefront companion:** use a Shopify-aware project for catalog, cart, checkout, payment, and fulfillment while AURA-style strategy, proof, photography, and content architecture guide the editorial experience.

The Compiler should never emit a fake checkout, collect payment details, claim inventory state, or use public variables for commerce secrets. The product system owns transactions; AURA owns evidence-led demand, authority, qualification, and content.

## Profile extension checklist

Before an architecture profile is added, define the following explicitly:

1. The primary buyer, buying moment, private tension, and decision to be earned.
2. Required discovery fields beyond the common client-brief contract.
3. Home visitor-state sequence and supporting page decisions.
4. Primary conversion intent and the minimum safe form fields.
5. Allowed proof types, forbidden proof shortcuts, and required caveats.
6. Required photography roles and permission / source-state expectations.
7. The release-policy implications for a live client.
8. What must be handed to a specialized external system rather than built into AURA.

This makes extensibility deliberate and testable, rather than adding labels to a generic page template.
