import { join } from 'node:path';
import { clientFile, parseArgs, readYaml, safeSlugFromArg, writeText } from './lib.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const brief = readYaml(clientFile(slug, '00-intake', 'client-brief.yaml'));
const evidence = readYaml(clientFile(slug, '00-intake', 'evidence-register.yaml'));
const strategy = readYaml(clientFile(slug, '01-strategy', 'strategy.yaml'));
const plan = readYaml(clientFile(slug, '01-strategy', 'page-plan.yaml'));
const shotlist = readYaml(clientFile(slug, '02-assets', 'photo-shotlist.yaml'));
const output = clientFile(slug, '03-production', 'prompts');

const approvedClaims = (evidence.claims || [])
  .filter((claim) => ['approved', 'approved_anonymized', 'concept_only'].includes(claim.status))
  .map((claim) => ({ id: claim.claim_id, wording: claim.claim_text, type: claim.claim_type, status: claim.status, scope: claim.scope, caveat: claim.required_caveat }));

const factPolicy = `\n## Fact policy\n\nUse only the approved claims listed below. Do not introduce new client names, numerical results, client logos, media relationships, credentials, testimonials, stage appearances, awards or guarantees. When approved information is insufficient, return \`[NEEDS APPROVAL]\` rather than plausible fiction.\n\n\`\`\`json\n${JSON.stringify(approvedClaims, null, 2)}\n\`\`\`\n`;

const strategyPacket = `# AURA Compiler — Positioning and strategy packet\n\n## Client context\n\n\`\`\`yaml\n${JSON.stringify({ buyer: brief.buyer, position: brief.position, commercial: brief.commercial, architecture: strategy.architecture, visual_direction: strategy.visual_direction }, null, 2)}\n\`\`\`\n\nCreate three content directions that stay within the selected **${strategy.architecture}** architecture. For each, state the primary buyer, high-stakes moment, tension, specific promise, differentiation, mechanism, primary CTA and risk. Recommend one only if it is supported by the evidence.\n${factPolicy}`;
writeText(join(output, '01-positioning.md'), strategyPacket);

const pageMapPacket = `# AURA Compiler — Page-plan review packet\n\nReview the proposed page plan below. Do not add blocks just to lengthen pages. For each section, confirm the visitor state, claim IDs, photography role and CTA intent. Flag any section whose purpose cannot be supported by approved evidence.\n\n\`\`\`yaml\n${JSON.stringify(plan, null, 2)}\n\`\`\`\n${factPolicy}`;
writeText(join(output, '02-page-plan-review.md'), pageMapPacket);

for (const page of plan.pages || []) {
  const routeName = page.path === '/' ? 'home' : page.path.replaceAll('/', '').replaceAll('-', '_');
  const packet = `# AURA Compiler — ${page.page_name} copy packet\n\nDraft only this page. The desired visitor decision is: **${page.desired_decision}**. The primary CTA is: **${page.primary_cta?.label}**.\n\n## Required sections\n\n${(page.sections || []).map((section) => `### ${section.position}. ${section.role}\n- Visitor state: ${section.visitor_state}\n- Purpose: ${section.purpose}\n- Block candidates: ${(section.block_candidates || []).join(', ')}\n- Claim IDs allowed: ${(section.claim_ids || []).join(', ') || 'none'}\n- Photography role: ${(section.photo_roles || []).join(', ') || 'none'}\n`).join('\n')}\n\nReturn a content table first. Then draft only the section that has been explicitly approved for production. Never treat a ` + '`concept_only`' + ` claim as live proof.\n${factPolicy}`;
  writeText(join(output, `page-${routeName}.md`), packet);
}

const photoPacket = `# AURA Compiler — Photography and asset packet\n\nVisual world: **${strategy.visual_direction || brief.art_direction?.visual_world}**\nArchitecture: **${strategy.architecture}**\nImage strategy: **${brief.art_direction?.image_strategy}**\nIdentity-reference consent: **${brief.art_direction?.identity_reference_consent}**\n\nCreate a role-by-role shot plan for: ${[...new Set((plan.pages || []).flatMap((page) => (page.sections || []).flatMap((section) => section.photo_roles || [])))].join(', ')}. For each role specify composition, desktop and mobile crop, visual job, wardrobe/location continuity, caption/alt intent, prompt, photographer brief and authenticity risks. Do not depict fictional clients, events, endorsements or published media as documentary fact.\n`;
writeText(join(output, '03-photo-direction.md'), photoPacket);

const roleDirectives = {
  P02: 'Create a cinematic hero frame with purposeful negative space for the headline. The subject must read as capable, composed and specific rather than aspirational stock photography.',
  P03: 'Create a clean, full or three-quarter cut-out with a precise alpha edge. Keep hands natural and preserve copy-safe separation around the silhouette.',
  P04: 'Create a quiet, contextual private-room portrait. Make the environment materially credible and avoid staged lifestyle cues.',
  P05: 'Create a credible work-in-progress image. Show an authentic action, considered object or analytical interaction; never a generic laptop pose.',
  P06: 'Create a warm editorial close portrait for fit or final conversion. The expression must be calm and intelligent, not overly smiling or sales-driven.',
  P07: 'Create contextual stage or room scale. Use it only when documentary context is true; for a concept scene, make the status explicit and do not fake a real event.',
  P08: 'Create a diagnostic or conversation scene with natural listening, hands and work materials. Do not imply a real client relationship unless it is documented.',
  P09: 'Create a material method artifact or document detail. Do not generate invented readable text, fake reports or fabricated brand marks.',
  P10: 'Create an architectural texture that carries the same material and lighting world without becoming generic background decoration.',
  P11: 'Create a quiet motion-capable composition where movement supports hierarchy rather than creating generic b-roll.',
  P12: 'Create a signature object, mark or editorial detail for the final conversion moment. It should reinforce the decision, not repeat the hero portrait.',
};

for (const shot of shotlist.shots || []) {
  const pages = (shot.page_placements || []).join(', ') || 'TBD';
  const packet = `# AURA Compiler — ${shot.code} ${shot.role} generation packet\n\n## Approved context\n\n- Architecture: **${strategy.architecture}**\n- Visual world: **${strategy.visual_direction || brief.art_direction?.visual_world}**\n- Image strategy: **${brief.art_direction?.image_strategy}**\n- Consent state: **${shot.consent_state}**\n- Page placements: **${pages}**\n- Desktop crop: **${shot.desktop_crop}**\n- Mobile crop: **${shot.mobile_crop}**\n\n## Visual job\n\n${shot.composition}\n\n${roleDirectives[shot.code] || 'Create only the approved visual role; preserve factual and consent boundaries.'}\n\n## Generation prompt\n\nCreate a ${brief.art_direction?.image_strategy === 'synthetic_concept' ? 'clearly conceptual, premium editorial photograph' : 'premium editorial photograph'} for role **${shot.code} — ${shot.role}**. Visual world: ${strategy.visual_direction || brief.art_direction?.visual_world}. Composition: ${shot.composition} Desktop aspect ratio: ${shot.desktop_crop}. Mobile crop requirement: ${shot.mobile_crop}. Wardrobe chapter: ${shot.wardrobe_chapter}. Location chapter: ${shot.location_chapter}. Use directional, naturalistic light; material texture; controlled contrast; credible posture and anatomy; a considered copy-safe area where appropriate. Avoid visible logos, readable invented text, fabricated media, fake client work, fake event context, plastic skin, malformed hands, stock-photo poses, and unrelated lifestyle props.\n\n## Photographer alternative\n\nPhotograph the same role using the approved subject, wardrobe and location chapters. Capture an uncropped master plus the stated desktop/mobile compositions. Record consent, source provenance, final alt text, dimensions and asset paths before publication.\n\n## Required QA before publication\n\n- Confirm consent and provenance match the pack.\n- Inspect face, hands, jewelry, edges and text artifacts.\n- Confirm ${shot.desktop_crop} and ${shot.mobile_crop} crops preserve the subject / visual job.\n- Add actual alt text; leave alt empty only if the asset is decorative.\n`;
  writeText(join(output, `photo-${shot.code.toLowerCase()}.md`), packet);
}

console.log(`Generated prompt packets in ${output}`);
