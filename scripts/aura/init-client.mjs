import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ARCHITECTURES, clientPath, ensureDir, parseArgs, safeSlugFromArg, writeText, writeYaml } from './lib.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const name = args.name || '[CLIENT NAME REQUIRED]';
const root = clientPath(slug);
const force = args.force === true;

if (existsSync(root) && !force) {
  throw new Error(`Client pack already exists: ${root}. Use --force only when deliberately overwriting this pack.`);
}

for (const directory of ['00-intake/sources', '01-strategy', '02-assets/masters', '02-assets/generated', '03-production/prompts', '03-production/astro-content', '04-release']) {
  ensureDir(join(root, directory));
}

writeYaml(join(root, '00-intake/client-brief.yaml'), {
  project: { slug, brand_name: name, site_status: 'concept_demo', requested_outcome: '[DEFINE BUSINESS OUTCOME]' },
  buyer: {
    primary_person: '[WHO IS THE PRIMARY BUYER?]',
    role_or_company_stage: '[ROLE / SCALE / STAGE]',
    high_stakes_moment: '[WHEN DOES THIS MATTER NOW?]',
    private_tension: '[WHAT DO THEY PRIVATELY WORRY IS TRUE?]',
    cost_of_inaction: ['[CONSEQUENCE 1]', '[CONSEQUENCE 2]'],
    exclusions: ['[WHO / WHAT IS NOT A FIT?]'],
  },
  position: {
    one_sentence_position: '[PRECISE POSITION]',
    central_thesis: '[WHAT DOES THIS EXPERT BELIEVE THAT THE MARKET GETS WRONG?]',
    category_enemy_or_default: '[OPTIONAL STATUS QUO / DEFAULT]',
    named_method: { name: '[METHOD NAME OR LEAVE UNRESOLVED]', first_principle: '[FIRST PRINCIPLE]', stages: [], tangible_outputs: [] },
  },
  commercial: {
    primary_offer: { name: '[FLAGSHIP OFFER]', delivery_model: '[HOW IT WORKS]', ideal_fit: [], not_a_fit: [] },
    secondary_offers: [],
    primary_conversion: { action: '[ONE PRIMARY ACTION]', visitor_readiness: '[WHEN SHOULD THEY TAKE IT?]', required_form_fields: [] },
    secondary_conversion: { action: '[OPTIONAL LOWER-COMMITMENT ACTION]', visitor_readiness: '[WHY IT EXISTS]' },
  },
  content_architecture: { selected: 'unresolved', rejected_alternatives: [], required_pages: [], origin_story_relevance: '[WHY THE STORY EARNS THE THESIS]' },
  proof: { permissioned_cases_available: false, third_party_sources_available: false, concept_disclosure_required: true },
  art_direction: { visual_world: '[SELECT AFTER STRATEGY]', material_palette: [], type_posture: '', motion_posture: '', image_strategy: 'synthetic_concept', identity_reference_consent: false, required_photo_roles: [] },
  operations: { platform: 'Astro', content_owner: '[OWNER]', form_provider: 'unconfigured', canonical_domain: '', analytics_requirement: '' },
});

writeYaml(join(root, '00-intake/evidence-register.yaml'), {
  claims: [{ claim_id: 'claim-001', claim_text: '[EXACT PUBLIC WORDING]', claim_type: 'credential', status: 'pending', source: '[URL, DOCUMENT OR APPROVAL]', permission_owner: '[PERSON / ROLE]', timeframe: '', scope: '', placement: [], required_caveat: '' }],
  case_studies: [],
});

writeYaml(join(root, '00-intake/voice-and-constraints.yaml'), {
  voice: { adjectives: [], avoid: [], reading_level: 'clear executive language', examples: [] },
  compliance: { regulated_industry: false, legal_review_required: false, prohibited_claims: [], required_disclosures: [] },
  accessibility: { language: 'en', reduced_motion_supported: true, contrast_requirement: 'WCAG-conscious' },
});

writeYaml(join(root, '01-strategy/strategy.yaml'), {
  architecture: 'unresolved',
  architecture_options: ARCHITECTURES,
  decision_status: 'draft',
  selected_because: '',
  rejected_alternatives: [],
  visual_direction: 'unresolved',
  primary_conversion: 'unresolved',
  proof_posture: 'unresolved',
});

writeYaml(join(root, '02-assets/photo-shotlist.yaml'), {
  project: { brand_name: name, image_strategy: 'synthetic_concept', identity_reference_consent: false, visual_world: 'unresolved' },
  shots: [],
});
writeYaml(join(root, '02-assets/asset-manifest.yaml'), { assets: [] });
writeText(join(root, '01-strategy/decision-log.md'), `# ${name} — Decision Log\n\nRecord approved strategic decisions, rejected alternatives and evidence constraints here.\n`);
writeText(join(root, '04-release/handoff.md'), `# ${name} — Release Handoff\n\nThis file is populated only after AURA Compiler validation passes.\n`);

console.log(`Initialized AURA Compiler pack: ${root}`);
console.log('Next: complete 00-intake/client-brief.yaml and evidence-register.yaml, then run: pnpm aura:assess -- --slug ' + slug);
