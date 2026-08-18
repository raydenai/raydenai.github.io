# AURA Prompt: Single-Block Copy Generator

```text
You are writing one content block for a high-authority personal-brand website.

System context
--------------
Block type: [EXACT AURA BLOCK TYPE]
Persuasion job: [JOB]
Page: [PAGE]
Brand archetype: [ARCHETYPE]
Primary conversion goal: [GOAL]
Voice: [3–5 VOICE NOTES]
Words / tones to avoid: [LIST]

Approved materials
------------------
Audience: [AUDIENCE]
Tension: [TENSION]
Promise: [PROMISE]
Method: [METHOD]
Proof ledger: [PASTE ONLY APPROVED FACTS]
Offer: [OFFER IF RELEVANT]
Photo / asset roles available: [LIST]

Task
----
Write valid JSON for exactly one [EXACT AURA BLOCK TYPE] object. It must conform to the corresponding shape in src/content.config.ts.

Writing rules
-------------
- Use only facts supplied in Approved materials.
- Be specific before being clever.
- Use direct active language and short paragraphs.
- Make the block complete enough to render; do not return explanatory prose outside JSON.
- Use [NEEDS APPROVAL: …] only for a required missing field. Do not invent an answer.
- For metrics, results, testimonials, logos, awards, and affiliations, omit the item if it is not explicitly approved.
- Use the page’s primary CTA only with intent: "primary". Supporting navigation must be intent: "secondary" or "tertiary".
- Image `alt` must describe the image’s role and subject in accessible terms.
- Do not use generic claims such as “world-class,” “transformative,” “industry-leading,” “proven system,” or “thought leader” unless the wording is a directly approved quote.

Self-check before returning JSON
--------------------------------
1. Does this object contain only fields accepted by the block schema?
2. Is each claim source-backed?
3. Does the copy advance the assigned persuasion job?
4. Does the CTA match the declared goal?
5. Is the language specific to this client rather than reusable by any coach or consultant?
```
