# AURA Photography Playbook

**Purpose:** Produce a consistent, high-authority photo library that can populate an entire personal-brand site without stock photography, grade drift, or mobile-crop failures.

## The operating principle

Photography in a personal-brand site is not decorative. It carries three separate messages: **this person is credible**, **this person is human**, and **this person actually does the work**. The research corpus converged on a practical default: a waist-up subject, positioned in a side third, direct eye contact, a tailored neutral wardrobe, a large soft key at 45°, a rim light for separation, and a warm final grade. The resulting hero cut-out is an architectural asset because it can move independently of the background and copy. [1]

> **Production rule:** Design the shot list before the shoot, not after. A one-day session should produce the complete library; a site should never be forced to reuse the same portrait in the hero, about page, contact page, and offer section.

## The eight-shot library

A complete authority site uses eight distinct photo roles. The demo set in `assets/photo-masters/` and the published derivatives in `public/images/` implement this library exactly.

| ID | Shot role | Website use | Composition and direction | Required deliverables |
|---|---|---|---|---|
| `hero-cutout` | Primary transparent hero portrait | HeroSplitPortrait, HeroSegmented | Waist-up; subject in outer third; direct eye contact; neutral-confident expression; enough clean edge around hair and shoulders for extraction | Full-res master, transparent PNG, 1200px and 800px derivatives |
| `hero-insitu` | Alternate hero in a real environment | Alternative hero, speaking, video overlay | Subject in a credible environment, with deliberate copy-side negative space | 16:9 desktop and 4:5 mobile crop |
| `story-environmental` | Origin / about portrait | OriginStory, CrucibleMoment, HighTicketOffer | Subject at a desk, in a studio, or in their natural environment; reflective rather than promotional | Landscape plus 4:5 mobile crop |
| `stage-wide` | Speaking-scale proof | SpeakingTopics, presentation pages | Real stage, audience silhouette, subject small enough to show scale | 16:9 wide crop |
| `stage-tight` | Speaker authority detail | Podcast, testimonials, media feature | Waist-up or chest-up, mid-gesture, audience implied rather than shown | 3:2 desktop and 4:5 mobile crop |
| `working-candid` | Evidence of work in progress | Offer, process, problem sections | Subject in a genuine client or workshop context; photographed as an observer, not a posed handshake | 3:2 landscape crop |
| `seated-editorial` | Warm, approachable portrait | ContactSplit, Manifesto, bio | Seated, open posture, gentle expression, more fill light than hero | 4:5 portrait crop |
| `detail-texture` | Atmospheric section surface | Final CTA, CrucibleMoment, background band | Notebook, desk, hands, architecture, or other tactile brand object with ample negative space | 16:9 dark texture crop |

In addition, each site should have a **book/product mockup** where relevant and 3–6 consistent **testimonial avatars**. Avatars must represent actual permissioned people in a production site; the demo avatars are illustrative only.

## Treatment selection

Select a photographic treatment based on the business model and audience context, not trend preference.

| Treatment | Best for | Surface / grade | Lighting | Watch-out |
|---|---|---|---|---|
| **Obsidian Authority** | Executive advisors, investors, legal, enterprise, premium B2B | Near-black surface, warm white type, warm-cinematic grade | Soft key 45°; restrained fill; rim opposite key | Keep shadow detail; do not crush the face into the surface. |
| **Editorial Ivory** | Authors, coaches, elegant service brands, premium consumer expertise | Warm white / light grey seamless, clean-high-key grade | Strong fill plus separately lit background | Let one wardrobe color supply contrast rather than adding arbitrary props. |
| **Executive In-Situ** | Operators, firms, speakers, pragmatic consultants | Real environment, moderate-high contrast, warm grade | Window or softbox key plus ambient fill | Environment must be legible but not busier than the subject. |
| **Composite Thematic** | Narrow niches where setting supports the category story | Cut-out over blurred or abstract themed scene | Match subject key direction to background | Highest risk: lighting mismatch makes the work look artificial. |

## Lighting recipe

The default setup works across the majority of professional personal-brand shoots.

| Light | Position | Authority ratio | Approachability ratio | Purpose |
|---|---|---:|---:|---|
| Key | 4–5 ft softbox or octabox, 45° left/right, 20° above eye line | 1.0 | 1.0 | Defines facial shape without sharp shadows. |
| Fill | Reflector or weak soft source opposite key | 1:4 | 1:2 | Retains detail in the shadow cheek. |
| Rim / kicker | Stripbox behind subject, opposite key | 1:8 relative feel | 1:4 relative feel | Separates hair and shoulder from dark surface. |
| Background | Unlit for cut-out; separately lit for high-key | N/A | N/A | Preserves flexible compositing or clean white. |

Shoot at 5000–5500K and apply the grade consistently in post. The corpus strongly favored warm grades; in practice, warmth works because it preserves believable skin and coordinates with amber, copper, and gold accent systems. [1]

## Wardrobe and styling

The safe production register is **elevated business casual**: tailored blazer, open-collar shirt or fine knit, minimal visible branding, and clean lines. Finance, legal, and enterprise leadership often require a more formal suit; coaches and creative experts can move toward knitwear and texture. The hero should not be genuinely casual unless the client’s category demands it.

| Look | Use | Wardrobe prescription | Color role |
|---|---|---|---|
| Look 1: Authority | Hero cut-out, stage tight | Dark blazer + light shirt or dark tonal layer | Neutral base with high separation. |
| Look 2: Human | Story, seated editorial | Knitwear, open collar, softened tailoring | Slightly warmer / lighter register. |
| Look 3: Work | Candid, in-situ, workshop | Same identity palette, practical fit | Must look compatible with Looks 1–2. |

Use no more than **three looks**. One saturated garment is enough; all other visible garments should be neutral. That creates brand memorability without making the site look like a fashion editorial.

## Hero composition and mobile safe zones

A desktop split hero and a mobile hero are different compositions, not the same image scaled down. The side-third desktop portrait needs a copy-safe field beside it; the mobile derivative needs the subject centered with enough headroom after stacking copy above or below.

| Breakpoint | Required crop | Subject placement | Copy rule |
|---|---|---|---|
| Desktop, 1200px+ | Landscape or tall transparent cut-out | Right or left third | Copy occupies opposing 45–55% of the hero. |
| Tablet, 768–1199px | Transitional crop | Subject may overlap lower copy zone | Keep face in upper half; reduce floating UI overlays. |
| Mobile, below 768px | 4:5 or 1:1 art-directed crop | Centered | Copy stacks first; subject occupies its own visual band. |

The `scripts/build-photos.py` pipeline produces named desktop and mobile derivatives. For a cut-out, the system retains alpha and quantizes the RGB payload to reduce file size. For photographs, it emits responsive WebP widths. The paired `scripts/verify-images.py --fix` command aligns content-declared image dimensions with actual dimensions to avoid cumulative layout shift.

## One-day production schedule

The research supports a practical production schedule: studio work in the morning, environment work in the afternoon, and real event photography captured separately when an actual speaking engagement occurs.

| Time | Setup | Required outputs |
|---|---|---|
| 09:00–10:30 | Studio cut-out setup | Hero cut-out, direct and alternate gaze, enough edge for masking |
| 10:30–11:30 | Same studio, warmer fill | Seated editorial, close portrait, author / bio frames |
| 11:30–12:00 | Detail setup | Notebook, hands, desk, book, texture backgrounds |
| 13:30–15:00 | Boardroom / office / relevant environment | Story environmental and working candid |
| 15:00–16:00 | Environment alternate | In-situ hero with copy-side negative space |
| Separate event | Real auditorium / audience | Stage wide and stage tight |

A genuine stage photograph is more persuasive than a studio simulation. If the client has not spoken publicly yet, make the speaking page about workshop capability and remove fake stage claims until authentic evidence exists.

## QA checklist

Before assets are accepted, review them against the following preventive checklist.

| Check | Pass condition | Failure to reject |
|---|---|---|
| Subject continuity | Same face, hair, age cues, and general style across session | AI identity drift or inconsistent retouching |
| Grade consistency | One white balance and contrast family across all eight roles | Warm hero paired with cool workshop image without an intentional narrative reason |
| Cut-out edge | Hair and shoulders look natural against both light and dark surfaces | Green halo, hard mask, missing hair, or contaminated transparency |
| Light direction | Subject rim and background imply compatible light | Cut-out lit from left over a scene lit from right |
| Mobile crop | Face remains fully present on a 390px viewport | Desktop-side subject disappears or is cut at the eye line |
| Credibility | Action/stage photos are real, attributable moments | Stock handshake or fabricated audience scale |
| Legal / ethical | Client releases, third-party releases, and factual captions are cleared | Unlicensed likenesses, fake testimonials, invented affiliation |

## AI image prompt framework

AI-generated concept photography is useful for **system demos, art direction, and non-personal texture images**. It should not be used to impersonate a real speaker’s stage history, invent customer results, or fabricate testimonials. When a client supplies a consented identity anchor, describe subject identity, camera, pose, lighting, wardrobe, environment, grade, composition, and explicit exclusions.

```text
Professional editorial [shot role] photograph of [identity anchor].
Subject: [age range / hair / face / expression / gaze].
Wardrobe: [look]. Pose: [body language].
Camera: [lens] at [aperture], [frame placement] with [copy-safe side].
Lighting: [key direction], [fill ratio], [rim direction].
Environment: [credible setting] with [background depth].
Grade: [warm-cinematic / clean-high-key / cool-tech], [contrast], [saturation].
Output: [aspect ratio], photorealistic, sharp on eyes.
Exclude: text, logos, unreadable screens, extra fingers, stock-photo gestures.
```

## References

[1]: https://www.influex.com/portfolio/?portfolio_categories=consultant "InfluEx Consultant Portfolio"
