import { clientFile, diag, parseArgs, printDiagnostics, readYaml, safeSlugFromArg, writeYaml } from './lib.mjs';
import { getByKey } from './profiles.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const brief = readYaml(clientFile(slug, '00-intake', 'client-brief.yaml'));
const evidence = readYaml(clientFile(slug, '00-intake', 'evidence-register.yaml'));
const strategy = readYaml(clientFile(slug, '01-strategy', 'strategy.yaml'));
const diagnostics = [];
const architecture = strategy.architecture;
const profile = getByKey(architecture);
if (!profile) diagnostics.push(diag('ERROR', 'ARCHITECTURE_REQUIRED', 'Run aura:assess and approve a known architecture first.', '01-strategy/strategy.yaml'));
if (strategy.decision_status !== 'approved' && args.draft !== true) {
  diagnostics.push(diag('ERROR', 'STRATEGY_APPROVAL_REQUIRED', 'Set decision_status: approved after human review, or use --draft for a non-production proposal.', '01-strategy/strategy.yaml'));
}
if (printDiagnostics(diagnostics)) process.exit(1);

const usableClaims = (evidence.claims || []).filter((claim) => ['approved', 'approved_anonymized', 'concept_only'].includes(claim.status));
const claimIds = usableClaims.map((claim) => claim.claim_id);
const photo = [...profile.photoRoles];
const visualWorld = strategy.visual_direction !== 'unresolved' ? strategy.visual_direction : brief.art_direction?.visual_world;

const roleMap = {
  hero: { visitor_state: 'recognition', block_candidates: ['HeroSplitPortrait', 'HeroVideoOverlay', 'HeroCenteredStatement'], photo_roles: photo.includes('P02') ? ['P02'] : [] },
  problem_mirror: { visitor_state: 'cost', block_candidates: ['EmpathyQuoteWall', 'ProblemAgitation'], photo_roles: [] },
  proof: { visitor_state: 'trust', block_candidates: ['ResultsGrid', 'TestimonialGrid', 'AuthorityQuote', 'CredibilityStack'], photo_roles: photo.includes('P05') ? ['P05'] : [] },
  named_method: { visitor_state: 'conviction', block_candidates: ['MethodologyPillars', 'NumberedFramework', 'PrincipleZigZag'], photo_roles: photo.includes('P09') ? ['P09'] : [] },
  fit: { visitor_state: 'permission', block_candidates: ['AudienceQualifier', 'HighTicketOffer', 'ProcessTimeline'], photo_roles: photo.includes('P06') ? ['P06'] : [] },
  story: { visitor_state: 'earned_authority', block_candidates: ['CrucibleMoment', 'OriginStory', 'Manifesto'], photo_roles: photo.includes('P04') ? ['P04'] : [] },
  lead_magnet: { visitor_state: 'first_value', block_candidates: ['LeadMagnet', 'LeadMagnetBanner'], photo_roles: [] },
  offer: { visitor_state: 'fit', block_candidates: ['ServicesGrid', 'OfferLadder', 'HighTicketOffer', 'SpeakingTopics'], photo_roles: photo.includes('P05') ? ['P05'] : [] },
  final_conversion: { visitor_state: 'action', block_candidates: ['FinalCta', 'ApplicationForm', 'ContactSplit'], photo_roles: photo.includes('P12') ? ['P12'] : [] },
};

function section(role, position) {
  const detail = roleMap[role];
  return {
    position: position + 1,
    role,
    ...detail,
    claim_ids: role === 'proof' || role === 'named_method' ? claimIds : [],
    purpose: `[DRAFT] ${role.replaceAll('_', ' ')} must move the visitor from ${detail.visitor_state} using only approved client-pack inputs.`,
  };
}

const supportDecisions = {
  '/about/': 'Understand why the authority thesis is earned and whether the point of view is credible.',
  '/method/': 'Evaluate whether the named method addresses the visitor’s current authority problem.',
  '/work-with-me/': 'Decide whether the delivery model, fit criteria and private advisory scope are appropriate.',
  '/speaking/': 'Determine whether the speaker’s outcomes and operating requirements fit the event.',
  '/case-studies/': 'Understand the proof standard and identify whether the relevant scope resembles their situation.',
  '/contact/': 'Share enough context to begin the appropriate private conversation.',
  '/start-here/': 'Choose the correct low-friction first step.',
  '/programs/': 'Select the program that fits the visitor’s maturity and outcome.',
  '/services/': 'Identify the relevant specialist service or assessment.',
  '/manifesto/': 'Decide whether the movement’s point of view aligns with the visitor’s identity and intent.',
  '/stories/': 'Understand how the point of view operates in real situations.',
  '/join/': 'Assess readiness to join or apply.',
  '/ventures/': 'Route to the relevant venture or commercial path.',
  '/books-and-media/': 'Explore the most relevant intellectual-property entry point.',
};

function page(path, name, roles, primary = false) {
  return {
    path,
    page_name: name,
    primary_visitor: brief.buyer?.primary_person,
    desired_decision: primary ? brief.commercial?.primary_conversion?.action : (supportDecisions[path] || 'Take the appropriate next step.'),
    primary_cta: {
      label: brief.commercial?.primary_conversion?.action,
      href: '/contact/',
      intent: 'primary',
      form_intent: profile.primaryConversion,
      required_form_fields: profile.formFields,
    },
    secondary_cta: primary && brief.commercial?.secondary_conversion?.action ? { label: brief.commercial.secondary_conversion.action, href: '#method', intent: 'secondary' } : null,
    sections: roles.map(section),
  };
}

const auxiliary = {
  '/about/': ['hero', 'story', 'proof', 'final_conversion'],
  '/method/': ['hero', 'named_method', 'proof', 'final_conversion'],
  '/work-with-me/': ['hero', 'fit', 'proof', 'offer', 'final_conversion'],
  '/speaking/': ['hero', 'proof', 'offer', 'final_conversion'],
  '/case-studies/': ['hero', 'proof', 'final_conversion'],
  '/contact/': ['hero', 'fit', 'final_conversion'],
  '/start-here/': ['hero', 'lead_magnet', 'offer', 'final_conversion'],
  '/programs/': ['hero', 'proof', 'offer', 'final_conversion'],
  '/services/': ['hero', 'problem_mirror', 'named_method', 'proof', 'offer', 'final_conversion'],
  '/manifesto/': ['hero', 'problem_mirror', 'story', 'named_method', 'final_conversion'],
  '/stories/': ['hero', 'story', 'proof', 'final_conversion'],
  '/join/': ['hero', 'fit', 'final_conversion'],
  '/ventures/': ['hero', 'proof', 'offer', 'final_conversion'],
  '/books-and-media/': ['hero', 'proof', 'final_conversion'],
};

const pages = [page('/', 'Home', profile.homeRoles, true)];
for (const path of profile.defaultPages.filter((route) => route !== '/')) {
  const name = path.slice(1, -1).split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
  pages.push(page(path, name, auxiliary[path] || ['hero', 'proof', 'final_conversion']));
}

const output = {
  engine: 'AURA Compiler',
  version: 1,
  generated_at: new Date().toISOString(),
  proposal: strategy.decision_status !== 'approved',
  project: { slug, brand_name: brief.project?.brand_name, architecture, visual_world: visualWorld, site_status: brief.project?.site_status },
  conversion: { primary: profile.primaryConversion, form_fields: profile.formFields },
  proof_posture: profile.proofPosture,
  pages,
};
writeYaml(clientFile(slug, '01-strategy', 'page-plan.yaml'), output);
console.log(`Generated ${output.proposal ? 'draft ' : ''}page plan: clients/${slug}/01-strategy/page-plan.yaml`);
console.log(`Architecture: ${architecture} | Pages: ${pages.length} | Approved claims available: ${claimIds.length}`);
