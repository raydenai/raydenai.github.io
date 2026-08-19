import { join } from 'node:path';
import { clientFile, parseArgs, readYaml, safeSlugFromArg, writeText } from './lib.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const brief = readYaml(clientFile(slug, '00-intake', 'client-brief.yaml'));
const evidence = readYaml(clientFile(slug, '00-intake', 'evidence-register.yaml'));
const strategy = readYaml(clientFile(slug, '01-strategy', 'strategy.yaml'));
const plan = readYaml(clientFile(slug, '01-strategy', 'page-plan.yaml'));
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

console.log(`Generated prompt packets in ${output}`);
