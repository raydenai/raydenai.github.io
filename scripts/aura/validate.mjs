import { clientFile, diag, parseArgs, printDiagnostics, readYaml, required, safeSlugFromArg, writeJson } from './lib.mjs';
import { getByKey } from './profiles.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const strict = args.strict === true;
const brief = readYaml(clientFile(slug, '00-intake', 'client-brief.yaml'));
const evidence = readYaml(clientFile(slug, '00-intake', 'evidence-register.yaml'));
const strategy = readYaml(clientFile(slug, '01-strategy', 'strategy.yaml'));
const plan = readYaml(clientFile(slug, '01-strategy', 'page-plan.yaml'));
const shotlist = readYaml(clientFile(slug, '02-assets', 'photo-shotlist.yaml'));
const diagnostics = [];
const architecture = strategy.architecture;
const profile = getByKey(architecture);

function get(object, path) { return path.split('.').reduce((value, key) => value?.[key], object); }
function unresolved(value) { return required(value) || String(value).includes('['); }
function add(level, code, message, path = '') { diagnostics.push(diag(level, code, message, path)); }

if (!profile) add('ERROR', 'ARCHITECTURE_INVALID', `No profile exists for ${architecture}.`, '01-strategy/strategy.yaml');
if (strategy.decision_status !== 'approved') add('ERROR', 'STRATEGY_UNAPPROVED', 'A production pack requires an approved architecture decision.', '01-strategy/strategy.yaml');

for (const path of profile?.requiredBriefPaths || []) {
  if (unresolved(get(brief, path))) add('ERROR', 'BRIEF_INCOMPLETE', 'Required for the selected architecture.', `00-intake/client-brief.yaml:${path}`);
}
for (const path of ['commercial.primary_conversion.action', 'art_direction.visual_world', 'operations.content_owner']) {
  if (unresolved(get(brief, path))) add('ERROR', 'BRIEF_INCOMPLETE', 'Required before production.', `00-intake/client-brief.yaml:${path}`);
}

const claims = new Map((evidence.claims || []).map((claim) => [claim.claim_id, claim]));
const approved = new Set(['approved', 'approved_anonymized', 'concept_only']);
const usedClaimIds = new Set();
for (const page of plan.pages || []) {
  if (!page.primary_visitor || String(page.primary_visitor).includes('[')) add('ERROR', 'PAGE_VISITOR_MISSING', 'Every page needs a primary visitor.', page.path);
  if (!page.desired_decision || String(page.desired_decision).includes('[')) add('ERROR', 'PAGE_DECISION_MISSING', 'Every page needs a desired decision.', page.path);
  if (!page.primary_cta?.label || String(page.primary_cta.label).includes('[')) add('ERROR', 'PAGE_CTA_MISSING', 'Every page needs one resolved primary CTA.', page.path);
  const roles = page.sections?.map((section) => section.role) || [];
  if (!roles.includes('hero')) add('ERROR', 'HERO_MISSING', 'Every page needs a hero role.', page.path);
  if (page.path === '/') {
    const missingRoles = (profile?.homeRoles || []).filter((role) => !roles.includes(role));
    if (missingRoles.length) add('ERROR', 'HOME_ARCHITECTURE_INCOMPLETE', `Missing home roles: ${missingRoles.join(', ')}.`, page.path);
  }
  for (const section of page.sections || []) {
    for (const id of section.claim_ids || []) {
      usedClaimIds.add(id);
      const claim = claims.get(id);
      if (!claim) add('ERROR', 'UNKNOWN_CLAIM', `Section references unknown claim ${id}.`, page.path);
      else if (!approved.has(claim.status)) add('ERROR', 'CLAIM_NOT_PUBLISHABLE', `${id} status is ${claim.status}.`, page.path);
      else if (claim.status === 'concept_only' && brief.project?.site_status !== 'concept_demo') add('ERROR', 'CONCEPT_CLAIM_IN_LIVE_SITE', `${id} is concept_only but site status is not concept_demo.`, page.path);
    }
  }
}
if (brief.project?.site_status === 'concept_demo' && !brief.proof?.concept_disclosure_required) add('ERROR', 'CONCEPT_DISCLOSURE_REQUIRED', 'Concept demos must carry an explicit disclosure requirement.', '00-intake/client-brief.yaml');

const plannedRoles = new Set((plan.pages || []).flatMap((page) => (page.sections || []).flatMap((section) => section.photo_roles || [])));
const suppliedRoles = new Set((shotlist.shots || []).map((shot) => shot.code));
for (const role of plannedRoles) {
  if (!suppliedRoles.has(role)) add(strict ? 'ERROR' : 'WARN', 'PHOTO_ROLE_UNPLANNED', `${role} is used in the page plan but absent from the photo shotlist.`, '02-assets/photo-shotlist.yaml');
}
for (const role of profile?.photoRoles || []) {
  if (!plannedRoles.has(role)) add('WARN', 'PHOTO_ROLE_UNUSED', `${role} is recommended by ${architecture} but is not yet used in the plan.`, '01-strategy/page-plan.yaml');
}

if (!usedClaimIds.size) add('WARN', 'NO_EVIDENCE_REFERENCED', 'No approved claims are referenced. Keep the public proof treatment explicitly concept-safe.', '01-strategy/page-plan.yaml');
if (strict && (brief.operations?.form_provider === 'unconfigured' || !brief.operations?.canonical_domain)) add('WARN', 'RELEASE_VALUES_PENDING', 'Forms and domain remain intentionally unconfigured; this is acceptable before production activation.', '00-intake/client-brief.yaml');

const report = {
  engine: 'AURA Compiler', slug, validated_at: new Date().toISOString(), strict,
  architecture, claim_references: [...usedClaimIds], photo_roles: [...plannedRoles], diagnostics,
  status: diagnostics.some((item) => item.level === 'ERROR') ? 'failed' : 'passed',
};
writeJson(clientFile(slug, '04-release', 'validation-report.json'), report);
const errors = printDiagnostics(diagnostics);
console.log(`Validation report: clients/${slug}/04-release/validation-report.json`);
process.exit(errors ? 1 : 0);
