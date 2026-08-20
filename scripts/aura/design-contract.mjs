import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { clientFile, diag, parseArgs, printDiagnostics, readJson, readYaml, safeSlugFromArg, writeJson, writeText } from './lib.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const root = resolve(process.cwd());
const brief = readYaml(clientFile(slug, '00-intake', 'client-brief.yaml'));
const plan = readYaml(clientFile(slug, '01-strategy', 'page-plan.yaml'));
const manifest = readJson(clientFile(slug, '03-production', 'wireframes/wireframe-manifest.json'));
const registrySource = readFileSync(join(root, 'src', 'lib', 'blockRegistry.ts'), 'utf8');
const registryBlock = registrySource.match(/export const blockRegistry = \{([\s\S]*?)\} as const;/)?.[1] || '';
const validBlocks = new Set([...registryBlock.matchAll(/^\s{2}([A-Za-z][A-Za-z0-9]+),$/gm)].map((match) => match[1]));
const diagnostics = [];

const responsiveRules = {
  hero: ['Keep the thesis and CTA in the first mobile viewport.', 'Use a mobile-safe portrait crop; never crop the face at eye level.', 'Do not require animation to reveal the value proposition.'],
  problem_mirror: ['Keep the tension statement as one uninterrupted reading sequence.', 'Do not split empathic statements into ornamental cards.'],
  named_method: ['Stack stages in decision order.', 'Place the method artifact before or beside the first stage.', 'Preserve numbered order and tangible outputs.'],
  proof: ['Keep attribution adjacent to the claim.', 'Stack proof in readable evidence order.', 'Do not use a horizontal carousel as the only proof presentation.'],
  story: ['Use one editorial text column.', 'Keep images supplemental to the narrative sequence.'],
  fit: ['Show fit criteria before the final action.', 'Use clear yes/no criteria rather than vague qualification language.'],
  lead_magnet: ['Place the artifact value before the form.', 'Keep required fields minimal and visible.'],
  offer: ['Show the implementation or delivery context before the action.', 'Avoid pricing or outcome language not supported by evidence.'],
  final_conversion: ['Use a 44px minimum primary control.', 'Display privacy and response expectation beside the form or CTA.'],
};

function resolveBlock(section) {
  const requested = section.block_candidates || [];
  const chosen = requested.find((block) => validBlocks.has(block));
  if (!chosen) diagnostics.push(diag('ERROR', 'WIREFRAME_BLOCK_UNREGISTERED', `No candidate block is registered for role ${section.role}.`, `${section.page}#${section.position}`));
  return { chosen: chosen || null, alternatives: requested.filter((block) => validBlocks.has(block)) };
}

const pages = (manifest.pages || []).map((page) => {
  const original = (plan.pages || []).find((candidate) => candidate.path === page.path);
  if (!original?.primary_cta?.label) diagnostics.push(diag('ERROR', 'WIREFRAME_CTA_MISSING', 'Every page wireframe requires a primary CTA.', page.path));
  if (!page.desired_decision) diagnostics.push(diag('ERROR', 'WIREFRAME_DECISION_MISSING', 'Every page wireframe requires a desired visitor decision.', page.path));
  const sections = (page.sections || []).map((section) => {
    const blocks = resolveBlock(section);
    if (!section.desktop_layout || !section.mobile_layout) diagnostics.push(diag('ERROR', 'WIREFRAME_RESPONSIVE_MISSING', 'Every wireframe section needs desktop and mobile behavior.', `${page.path}#${section.position}`));
    for (const photo of section.photo_roles || []) {
      if (!photo.role) diagnostics.push(diag('ERROR', 'WIREFRAME_PHOTO_ROLE_MISSING', 'A photo annotation is missing its role.', `${page.path}#${section.position}`));
    }
    return {
      position: section.position,
      role: section.role,
      astro_block: blocks.chosen,
      approved_alternatives: blocks.alternatives,
      visitor_state: section.visitor_state,
      desktop_behavior: section.desktop_layout,
      mobile_behavior: section.mobile_layout,
      responsive_rules: responsiveRules[section.role] || ['Keep hierarchy, reading order and focus behavior explicit before implementation.'],
      copy_requirement: section.copy_requirement,
      proof_claim_ids: section.claim_ids,
      photo_roles: section.photo_roles,
      content_record: `src/content/pages/${page.path === '/' ? 'home' : page.path.replaceAll('/', '')}.json`,
      approval_state: section.approval_status,
    };
  });
  return {
    path: page.path,
    page_name: page.page_name,
    primary_visitor: page.primary_visitor,
    desired_decision: page.desired_decision,
    primary_cta: page.primary_cta,
    secondary_cta: page.secondary_cta,
    sections,
  };
});

const contract = {
  engine: 'AURA Compiler',
  artifact: 'design-contract',
  generated_at: new Date().toISOString(),
  project: { slug, brand_name: brief.project?.brand_name, architecture: manifest.project?.architecture, visual_world: manifest.project?.visual_world },
  implementation_policy: {
    data_driven_pages: true,
    block_registry_only: true,
    mobile_recomposition_required: true,
    generated_copy_requires_approval: true,
    photo_source_and_crop_required: true,
  },
  pages,
};

const markdownPages = pages.map((page) => `## ${page.page_name} — \`${page.path}\`\n\n**Visitor:** ${page.primary_visitor}  \n**Decision:** ${page.desired_decision}  \n**Primary CTA:** ${page.primary_cta?.label || 'NEEDS APPROVAL'}  \n**Form intent:** ${page.primary_cta?.form_intent || 'NEEDS APPROVAL'}  \n**Fields:** ${(page.primary_cta?.required_form_fields || []).join(', ') || 'NEEDS APPROVAL'}\n\n| # | Role | Astro block | Desktop | Mobile | Proof / photo requirement |\n|---:|---|---|---|---|---|\n${page.sections.map((section) => `| ${section.position} | ${section.role} | ${section.astro_block || 'UNREGISTERED'} | ${section.desktop_behavior} | ${section.mobile_behavior} | ${(section.proof_claim_ids || []).join(', ') || 'No public claim'}${section.photo_roles?.length ? `; ${section.photo_roles.map((photo) => photo.role).join(', ')}` : ''} |`).join('\n')}\n\n`).join('\n');

const markdown = `# ${brief.project?.brand_name || slug} — Design Contract\n\nThis artifact binds approved wireframes to registered Astro blocks, responsive behavior, copy boundaries, proof claims and photo roles. It is generated after the page plan and before content promotion.\n\n${markdownPages}\n## Global implementation requirements\n\n- Render page content through the block registry; do not hand-assemble bespoke pages when a registered block expresses the approved section role.\n- Preserve one H1, semantic heading order, exact CTA intent and the approved form field list.\n- Treat every mobile behavior listed above as a composition decision, not a CSS afterthought.\n- Keep claim IDs adjacent to their proof source and do not turn a concept-only claim into an outcome assertion.\n- Publish images only with a source state, crop requirement, intrinsic dimensions and meaningful alternative text.\n`;

const outputRoot = clientFile(slug, '03-production', 'design-contracts');
writeJson(join(outputRoot, 'design-contract.json'), contract);
writeText(join(outputRoot, 'design-contract.md'), markdown);
const errors = printDiagnostics(diagnostics);
console.log(`Generated design contract: ${outputRoot}`);
process.exit(errors ? 1 : 0);
