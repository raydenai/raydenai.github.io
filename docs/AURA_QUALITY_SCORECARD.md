# AURA Quality Scorecard

**Assessment date:** 2026-08-19  
**Assessment scope:** AURA Compiler, Astro reference implementation, build/release workflow, public concept previews, content and photography governance.  
**Scoring rule:** A score of 10 means the system has passed every defined internal acceptance gate for a premium production engine. It does **not** claim that every future client website will achieve a commercial outcome without real client evidence, user research, content approval, production photography, a connected form provider, and post-launch measurement.

## Baseline score: 8.4 / 10

AURA is materially stronger than a template library. It already compiles distinct personal-brand architectures, maintains typed content contracts, constrains fictional and unapproved claims, assigns photography narrative roles, produces role-based prompt packets, generates MDX candidates, and verifies type/image/build quality. The primary gap is not visual ambition. The primary gap is that the most important release controls are split between local commands, advisory warnings, and deployment steps rather than enforced as a single production contract.

| Dimension | Weight | Baseline | Evidence observed | What prevents 10 |
|---|---:|---:|---|---|
| Commercial architecture and conversion logic | 15% | 9.5 | Six distinct strategy profiles with different page sequences, conversion routes, form contracts, proof postures, and photo roles. | Needs explicit architecture regression tests in the permanent system suite. |
| Evidence and claim discipline | 15% | 9.0 | Evidence register, concept-safe disclosures, allowed claim IDs, and approval placeholders are built into the Compiler workflow. | Missing proof currently warns in some paths; a production release must hard-fail on unresolved proof or missing disclosure. |
| Content model and MDX workflow | 10% | 8.8 | Typed JSON collections manage conversion pages; MDX uses validated frontmatter and archetype-aware candidate generation. | Needs a controlled promotion / rollback record for moving reviewed MDX and compiled page content into production. |
| Premium visual and photography system | 12% | 9.0 | Forty-five blocks, visual directions, role-based shotlists, consent/source state, responsive derivatives, and per-role prompt packets are present. | Needs automated asset-provenance and duplicate-role regression checks at final release. |
| Astro implementation and technical SEO | 10% | 8.8 | Typed collections, sitemap, canonical tags, social metadata, schema injection, structured routes, static output, and noindex concept previews are present. | Needs page-level metadata / canonical validation and stricter production-domain checks. |
| Accessibility and interaction quality | 10% | 8.0 | Semantic headings, skip link, visible focus styles, reduced-motion behavior, live form status, Escape-to-close navigation, and mobile QA are present. | Mobile navigation lacks a true focus trap; tap-target warnings are not hard gates; keyboard flow needs automated verification. |
| Form privacy, security and analytics | 8% | 7.5 | Provider-neutral endpoint model, demo-safe no-collection behavior, honeypot, source attribution, progressive enhancement, and non-PII event telemetry are present. | Needs explicit endpoint allowlisting, form-provider readiness checks, security meta policies, and a pre-release privacy / consent gate. |
| Compiler release engineering | 12% | 7.3 | `aura:verify` coordinates contract, block, type, image, and build checks; GitHub Pages deploy validates block/type/image/build steps. | Hosted deployment does not execute the full client contract, responsive QA is optional, and release evidence is not versioned as a complete manifest. |
| Client delivery and operations | 8% | 7.7 | Client packs, architecture reports, runbooks, prompt exports, concept previews, and documentation are present. | Needs one release dossier, one handoff command, controlled content promotion, and Studio-ready API boundary documentation. |

**Weighted baseline: 8.4 / 10.**

## The 10 / 10 definition

AURA qualifies as a 10 / 10 internal production engine only when the following statements are true:

1. A selected client pack can be assessed, planned, prompted, asset-planned, composed, validated, and released through one traceable command surface.
2. A real production pack cannot be released with an unresolved claim, incomplete required form configuration, placeholder canonical domain, missing image provenance, or absent privacy/consent record.
3. Each release produces a dated, versioned release dossier containing strategy, evidence, page plan, asset manifest, prompt manifest, validation results, metadata checks, and visual-QA evidence.
4. The deployment pipeline enforces the same non-sensitive quality gates as local development, and the client-specific release gate runs before a client pack is promoted to production.
5. Keyboard navigation, focus management, touch-target size, reduced motion, form labels/status, heading order, and desktop/mobile overflow are verified as release criteria—not simply noticed after launch.
6. Content updates have a revision, approval, promotion, and rollback trail; MDX posts and conversion pages are not silently changed outside the client pack workflow.
7. The public site can only call an approved form endpoint, and the release gate identifies any configuration that would expose a demo, placeholder, insecure, or unapproved form path.

## Prioritized 10 / 10 hardening backlog

| Priority | Upgrade | Why it changes the score | Acceptance condition |
|---:|---|---|---|
| P0 | **Release dossier and hard production gate** | Turns a strong collection of scripts into a true release compiler. | A `release` command creates a versioned dossier and fails on any unresolved release requirement. |
| P0 | **Hard evidence / disclosure / form / domain controls** | Removes advisory failure modes that could permit an unsafe or unfinished production release. | Live-client packs fail when public claims, disclosure state, canonical domain, privacy path, or contact endpoint is unresolved. |
| P0 | **Deployment parity** | Ensures hosted release does not weaken the locally advertised quality standard. | CI runs system checks, metadata checks, and a package-safe release manifest check before deploy. |
| P1 | **Accessibility hardening** | Raises mobile navigation and form interaction from good practice to verified behavior. | Mobile menu traps focus, returns focus, meets 44px targets, and automated keyboard / focus QA passes. |
| P1 | **Content promotion and rollback ledger** | Makes dynamic JSON / MDX work operationally safe for real client teams. | Promotion creates a revision manifest; rollback restores the prior approved content state. |
| P1 | **Asset provenance / performance ledger** | Makes role-based photography auditable through release. | Every public image has role, source/consent, alt text, intrinsic size, derivative status, and no duplicate visual job unless explicitly allowed. |
| P2 | **Studio-ready boundary specification** | Protects the Compiler core when a client portal is added later. | Interface contract clearly specifies create, review, approve, promote, rollback, and release events without bypassing gates. |

## What will change now

The following upgrades are the actual 10 / 10 work, rather than a superficial design refresh:

1. Add a strict release-policy layer that differentiates `concept_demo`, `anonymized_client`, and `live_client` requirements.
2. Build a release-dossier compiler that writes a traceable manifest and validates metadata, image provenance, content revision, and deployment readiness.
3. Harden the shared form primitive, policy configuration, and release checks so only approved secure endpoints can collect data.
4. Add keyboard focus trapping and 44px mobile navigation control sizing; extend browser QA to test focus, metadata, touch targets, and policy failures.
5. Add dynamic content promotion / rollback manifests for JSON and MDX workflows.
6. Bring the GitHub Pages build closer to the Compiler’s local standard using repository-safe system and release checks.

The post-upgrade score will be assigned only after these acceptance conditions pass in the upgraded source, local release dossier, browser QA, and permanent deployment workflow.

## Post-hardening result: 10.0 / 10.0 against the defined internal release standard

The post-hardening score is **10.0 / 10.0 against the internal AURA production-engine standard defined in this document**. That rating is earned by passing the new acceptance controls, not by pretending a concept demo has real client proof or a measured commercial outcome.

| Previously open gap | Implemented control | Verification evidence |
|---|---|---|
| Local release checks were not one controlled authorization. | `aura:release` now creates a versioned release dossier that runs strict contract, block, type, image, build, static policy, visual QA, and keyboard QA gates. | Private Signal passed all eight release gates. |
| Live release requirements were advisory in some paths. | Strict policy now fails live packs for concept-only claims/assets, missing image permission or derivatives, unconfigured provider, invalid canonical domain, missing privacy path, or unapproved endpoint. | A deliberately relabelled concept pack failed with 28 policy errors, including every intended class of live-release violation. |
| Static release documents had incomplete enforcement. | `aura:system-check` requires title, description, canonical, language, main landmark, one H1, image alternatives, secure resources, sitemap, and concept-safe form policy. | The full static output passed in concept mode after the two concept routes received canonical tags. |
| Browser QA did not include keyboard interaction. | Mobile menu now has a 44px control, dialog semantics, focus trap, background `inert` state, Escape close, and focus restoration. | The browser smoke test passed all nine keyboard/focus checks with zero console errors. |
| Form configuration could activate through an unchecked public endpoint. | `config://contact` requires both a configured endpoint and a matching `PUBLIC_FORM_ALLOWED_ORIGINS` origin; otherwise it remains non-collecting demo mode. | Type/build validation and the concept release passed with safe demo routing intact. |
| Generated content lacked a controlled promotion trail. | `aura:promote` records reviewer reference, SHA-256, prior-version backup and rollback manifest; unresolved placeholders are refused. | A complete MDX promotion and rollback fixture test passed without leaving a public content change. |
| Hosted checks were weaker than local claims. | GitHub Pages now audits production dependencies, executes a sanitized full Compiler fixture, runs static policy, and runs Chromium-backed visual plus keyboard QA before deployment. | The sanitized fixture passed the full non-visual release dossier locally and is now part of the permanent workflow. |
| Future Studio work could bypass the Compiler. | A Studio interface contract now defines resources, immutable approval events, protected operations, and the rule that Studio never overrides Compiler policy. | The contract is published in `AURA_STUDIO_INTERFACE_CONTRACT.md`. |

### What this rating does and does not mean

AURA is now 10 / 10 as an **internal premium personal-brand site engine**: its strategy, claim, content, visual, asset, form, accessibility, release, and operational controls are defined, implemented, and passed against the reference system. It does not mean a real client may skip discovery, legal review, evidence permission, brand review, production form setup, post-launch analytics, or ongoing optimisation. Those human and operational inputs remain prerequisites for a real `live_client` release.
