# AURA Prompt: Photography Art Direction

## Universal prompt wrapper

```text
Create a production-ready art direction specification for an AURA personal-brand photography shot.

Client and brand context
------------------------
Subject identity: [CONSENTED IDENTITY DESCRIPTION OR “CONCEPT DEMO SUBJECT”]
Brand treatment: [OBSIDIAN AUTHORITY / EDITORIAL IVORY / EXECUTIVE IN-SITU / COMPOSITE THEMATIC]
Brand palette: [COLORS]
Audience register: [enterprise / premium consumer / creative / technical]
Shot role: [ROLE FROM TABLE]
Website block placement: [BLOCK TYPE]
Copy-side requirement: [LEFT / RIGHT / NONE]
Available location(s): [LOCATIONS]
Wardrobe look: [LOOK]
Actual-event constraint: [REAL EVENT AVAILABLE / CONCEPTUAL ONLY]

Return:
1. Art direction summary in 80 words maximum.
2. Camera / lens / aperture / aspect ratio.
3. Subject pose, expression, gaze, and frame placement.
4. Lighting diagram in words: key, fill ratio, rim, background.
5. Environment, prop, and negative-space requirements.
6. Desktop crop and mobile crop instructions.
7. Photographer shot brief.
8. AI generation prompt, clearly labelled as CONCEPTUAL when it depicts anything not photographed in reality.
9. Exclusions and authenticity risks.

Rules:
- Do not fabricate real speaking events, customer meetings, press coverage, awards, book launches, or endorsements.
- Never describe a fabricated scene as documentary evidence.
- Do not use readable text, logos, fake UI, or fake customer data in AI imagery.
- Preserve consistent identity, wardrobe palette, lighting direction, and grade across the complete eight-shot set.
```

## Shot-role modifiers

| Role | Required visual specification | Prohibited shortcut |
|---|---|---|
| `hero-cutout` | Waist-up, side third, direct gaze, clean shoulder/hair edge, transparent extraction planned, opposite-side copy safe area | Thin halo, green-screen spill, extreme crop, hands blocking face |
| `hero-insitu` | Real plausible environment, f/2–f/2.8, landscape copy safe area, context visible but soft | Busy background, subject centered with no text room |
| `story-environmental` | Reflective moment with purposeful prop or environment, not headshot | Generic office stock pose |
| `stage-wide` | Real event only; scale demonstrated by audience and stage | AI/fake stage presented as proof of a real speaking career |
| `stage-tight` | Real event or clearly conceptual brand frame; gesture and directional stage light | Studio portrait mislabeled as a keynote scene |
| `working-candid` | Real working context, observer perspective, other people only with consent | Handshake, posed “meeting” stereotype, unreadable sensitive screens |
| `seated-editorial` | Open, warm, human second-half portrait, vertical ratio | Reused hard-authority hero pose |
| `detail-texture` | Tactile brand object and clean negative space for typography | Random stock object unrelated to brand |

## Example: Obsidian Authority hero cut-out

```text
Professional editorial studio hero portrait of [CONSENTED SUBJECT], waist-up, standing in the right third of a tall frame with the left 50% reserved as copy-safe negative space. Direct eye contact, neutral-confident expression, arms loosely crossed without covering the torso. Wardrobe: tailored charcoal blazer over crisp off-white open-collar shirt. Camera: 85mm, f/2.8, eye-level. Lighting: 5-foot octabox key from camera left at 45 degrees and 20 degrees above eye line; weak reflector fill at 1:4; narrow warm rim from camera right catching hair and shoulder. Shoot on neutral grey backdrop for clean extraction. Grade warm-cinematic, 5200K, high but not crushed contrast, natural skin texture. Output transparent PNG after professional masking plus 1200px desktop and 800px mobile variants. No logos, no text, no extra hands, no artificial skin blur.
```
