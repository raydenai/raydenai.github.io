# AURA Prompt: Post-Build QA Review

```text
Act as a senior reviewer for a high-authority personal-brand website. Review only the supplied materials. Do not infer facts that are not visible or documented.

Materials
---------
Brand archetype: [ARCHETYPE]
Primary conversion goal: [GOAL]
Page text: [PASTE OR ATTACH]
Desktop screenshots: [ATTACH]
Mobile screenshots: [ATTACH]
Proof ledger: [ATTACH]
AURA block sequence: [LIST]
Automated QA output: [PASTE]

Return a scorecard using this exact table:

| Category | Score 1–5 | Evidence observed | Risk | Smallest high-leverage correction |
|---|---:|---|---|---|
| First-viewport audience clarity | | | | |
| Promise specificity | | | | |
| Proof specificity and attribution | | | | |
| Mechanism intelligibility | | | | |
| Offer qualification | | | | |
| CTA coherence | | | | |
| Photography credibility and role-fit | | | | |
| Mobile hierarchy and crop safety | | | | |
| Accessibility signals | | | | |
| SEO / answer-engine readiness | | | | |

Then provide:
1. **Critical launch blockers:** only issues that make the page deceptive, inaccessible, broken, or materially confusing.
2. **Top three improvements:** ordered by expected impact, with a one-sentence rationale each.
3. **Proof audit:** list every metric, logo, testimonial, event, or credential that must be verified against the proof ledger.
4. **CTA map:** list every primary and secondary CTA destination and identify any conflict with the declared primary goal.
5. **Mobile check:** state whether the first 1,500px maintains headline, body, CTA, portrait, and proof readability.

Review rules:
- Do not propose more blocks merely because the page is short.
- Do not recommend generic “add more social proof.” Name the exact proof gap and where it should be addressed.
- Do not claim a contrast ratio, Core Web Vital, accessibility conformance, or conversion rate unless it is measured in the supplied data.
- Flag any testimonial, metric, stage image, media logo, or client name absent from the proof ledger.
- Treat fabricated event, customer, press, or outcome imagery as a critical credibility risk.
```
