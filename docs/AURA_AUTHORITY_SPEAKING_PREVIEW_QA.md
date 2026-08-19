# Authority + Speaking Concept Preview: Responsive QA

## Preview purpose

The route `/archetypes/authority-speaking/` is a **concept-safe, noindex AURA Compiler preview**. It turns the local Elena Voss Authority + Speaking client pack into a real page without pretending that Elena, the event images, outcomes, or booking context are live evidence.

The page makes the archetype’s generated plan visible:

| Compiled requirement | Preview implementation |
|---|---|
| Primary buyer | VP of People, chief of staff, or conference curator planning a consequential leadership event. |
| Primary decision | Check speaking availability. |
| Required booking context | Name, work email, organization, event date, audience size, format, budget range and desired outcome. |
| Page sequence | Hero → event-buyer outcome standard → earned point of view → Live Room Method → concept stage context → speaking-topic fit → event inquiry. |
| Photography roles | P02 hero presence, P05 rehearsal / working scene, P07 stage / room context, P06 editorial close. |
| Proof posture | Topic outcomes, contextual credentials and permissioned organizer evidence in a live implementation. The concept uses no claimed proof. |

## Responsive QA outcome

The isolated QA run checked the Authority + Speaking route at a `1440 × 900` desktop viewport and a `390 × 844` mobile viewport.

| Check | Desktop | Mobile | Status |
|---|---:|---:|---|
| HTTP response | 200 | 200 | Pass |
| Page horizontal overflow | 0px | 0px | Pass |
| Broken images | 0 | 0 | Pass |
| Console errors | 0 | 0 | Pass |
| H1 count | 1 | 1 | Pass |
| Heading skips | 0 | 0 | Pass |
| Image count | 4 | 4 | Pass |
| First-viewport CTAs | 4 | 3 | Informational; expected for a high-intent speaking page |
| Small-target heuristic hits | 5 | 5 | Informational; compact navigation and text links should be reviewed with the final client’s accessibility requirements |

The four generated image roles are present and render with fixed intrinsic dimensions. The mobile layout uses the same assets without a page-level overflow condition; the hero is repositioned to preserve the adviser’s face and the two primary actions.

## Intentional safeguards

The event inquiry form prevents submission and displays a concept-only notice. In a live build, the exact field set is carried to the approved backend so an event buyer supplies the context needed for a useful booking conversation. The stage image is explicitly explained as **context, not claim**; a client site must replace it with a permissioned event image or retain a visible concept disclosure.

## Artifacts

- Desktop screenshot: `qa-authority/desktop-archetypes-authority-speaking.png`
- Mobile screenshot: `qa-authority/mobile-archetypes-authority-speaking.png`
- Machine-readable audit: `qa-authority/report.json`
