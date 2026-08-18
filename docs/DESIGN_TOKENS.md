# AURA Design Tokens and Theme System

## Design premise

AURA uses visual consistency to make a person feel **considered, not templated**. The system does not lock every client into the same aesthetic. It fixes the hierarchy, rhythm, responsive behavior, and CTA semantics while allowing the client’s positioning to choose a treatment.

All live tokens are in `src/styles/tokens.css`; global primitives and utility classes are in `src/styles/global.css`.

## Shipped visual themes

| Theme ID | Best fit | Surface behavior | Accent | Photographic treatment |
|---|---|---|---|---|
| `obsidian-gold` | Executive advisors, investors, legal, enterprise | Near-black hero and alternate dark bands | Gold / warm amber | Obsidian Authority, warm-cinematic |
| `editorial-ivory` | Authors, coaches, elegant service brands | Warm ivory with dark typography | Burnished neutral | Editorial Ivory, clean-high-key |
| `institutional-navy` | Finance, policy, professional firms | Navy / cloud surface contrast | Measured blue / brass | Executive In-Situ |
| `signal-cyan` | Technical experts, product leaders, modern operators | Deep ink with bright technical accent | Cyan / aqua | Cool-tech or balanced in-situ |
| `insurgent-red` | Strong point-of-view brands, movements, challengers | Dark neutral with controlled urgency | Signal red | High-contrast editorial |

A theme is set in the brand JSON file and rendered as a `data-theme` attribute at the document root. Use a theme to clarify the audience register, not to make an unsupported identity claim. A red theme cannot make an unproven challenger brand “disruptive.”

## Token categories

| Category | Intent | Examples |
|---|---|---|
| Surface | Controls background hierarchy | `--surface`, `--surface-raised`, `--surface-inverse`, `--card-bg` |
| Text | Preserves reading hierarchy and contrast | `--text`, `--text-muted`, `--text-subtle`, `--text-inverse` |
| Accent | Directs attention and active state | `--accent`, `--accent-hover`, `--accent-contrast` |
| Type | Gives each theme a coherent voice | `--font-display`, `--font-body`, `--fs-*`, `--lh-*`, `--ls-*` |
| Spacing | Creates repeatable reading rhythm | `--space-1` through `--space-12` |
| Shape | Controls component friendliness/formality | `--radius-*`, `--btn-radius`, `--card-radius` |
| Motion | Prevents arbitrary animation | `--dur-*`, `--ease-*` |
| Layout | Controls page width and long-form readability | container primitives: `narrow`, `content`, `base`, `wide`, `full` |

## Type hierarchy

The system uses one display voice and one body voice. Personal brands often lose authority by adding too many type treatments. The display face creates identity; body type prioritizes reading; a script accent should be used only as a deliberate emphasis device, not as body copy.

| Role | Intended use | Rule |
|---|---|---|
| `display-1` | Hero headline | One per first viewport; write short enough to maintain a strong line break. |
| `display-2` | Page opener / important section | Use for major page-level turns. |
| `display-3` | Standard block heading | Most section titles. |
| `heading` | Card / smaller grouping title | Never compete with page hierarchy. |
| Body | Explanatory prose | Prioritize 16px+ readable size and line length. |
| Eyebrow | Context or category label | Short uppercase / tracked phrase, not a sentence. |
| Script / accent | Single emotional emphasis | Use one phrase inside a heading; never multiple decorative accents. |

The demo’s long hero was deliberately tested and reduced from its first scale to ensure mobile readability. This is a core principle: **display type must fit the argument rather than forcing the argument to fit the type.**

## Spacing and section rhythm

A personal brand site needs rhythm more than decoration. Use tone changes, responsive vertical space, and a change of information density to guide attention.

| Section intent | Recommended tone | Padding | Typical follow-up |
|---|---|---|---|
| Hero | `inverse` / high contrast | `loose` | Proof strip or immediate problem recognition |
| Proof bar | `raised` / `accent` | `tight` or `default` | Problem or mechanism |
| Problem | `default` or `inverse` | `loose` | Cost, aspiration, or mechanism |
| Method | `default` / `raised` | `loose` | Results or testimonials |
| Story | `inverse` / `raised` | `loose` | Fit / offer |
| Offer | `default` | `loose` | Proof / qualifier / application |
| Final CTA | `inverse` | `loose` | Footer opt-in |

Use color-band changes to signal a semantic turn. Do not alternate backgrounds mechanically; a contrast change should correspond to a change in the visitor’s question.

## CTA semantics and visual hierarchy

The token system works with CTA intent so visual emphasis reflects the business decision.

| Intent | Typical variant | Appropriate role |
|---|---|---|
| Primary | Filled accent | The site’s key action: book, apply, subscribe, buy, or watch. |
| Secondary | Outline / inverse outline | Learn the method, read a story, see examples. |
| Tertiary | Ghost / text | Contextual routes, supporting navigation, detail. |

A page can repeat its primary CTA; repetition is not sprawl when the destination is the same. What weakens conversion is asking equal-weight visitors to “book,” “buy,” “join,” “watch,” “subscribe,” and “download” without a clear hierarchy.

## Image and color interaction

| Background type | Photo choice | Text treatment | Avoid |
|---|---|---|---|
| Dark textured surface | Cut-out portrait or stage-tight frame | Warm white, restrained gold emphasis | Busy scene plus glowing type plus competing card overlays |
| Light editorial surface | High-key or seated portrait | Near-black, high contrast | Pale grey type or low-contrast gold labels |
| Real environment | In-situ / working candid | Overlay only where negative space is deliberate | Text over faces, whiteboard notes, or bright windows |
| Accent band | Detail texture or no image | High contrast accent-compatible text | Unreadable text over saturated photography |

## Accessibility-sensitive token rules

Tokens make it easier to preserve access standards, but author choices still matter. Avoid all-caps body paragraphs, do not use color alone to indicate a state, preserve visible focus styles, supply relevant alt text, and test the actual theme/photography combination at small screens. The layout’s semantic heading promotion and QA script help catch structural failures; content review remains necessary.
