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
const assets = readYaml(clientFile(slug, '02-assets', 'asset-manifest.yaml'));
const diagnostics = [];
const architecture = strategy.architecture;
const profile = getByKey(architecture);
const siteStatus = brief.project?.site_status;
const isConcept = siteStatus === 'concept_demo';
const isLive = ['live_client', 'anonymized_client'].includes(siteStatus);

function get(object, path) { return path.split('.').reduce((value, key) => value?.[key], object); }
function unresolved(value) { return required(value) || String(value).includes('['); }
function add(level, code, message, path = '') { diagnostics.push(diag(level, code, message, path)); }
function nonEmpty(value) { return !unresolved(value); }
function isHttpsUrl(value) {
  try { return new URL(String(value)).protocol === 'https:'; } catch { return false; }
}

if (!['concept_demo', 'anonymized_client', 'live_client'].includes(siteStatus)) {
  add('ERROR', 'SITE_STATUS_INVALID', 'site_status must be concept_demo, anonymized_client, or live_client.', '00-intake/client-brief.yaml:project.site_status');
}
if (!profile) add('ERROR', 'ARCHITECTURE_INVALID', `No profile exists for ${architecture}.`, '01-strategy/strategy.yaml');
if (strategy.decision_status !== 'approved') add('ERROR', 'STRATEGY_UNAPPROVED', 'A release requires an approved architecture decision.', '01-strategy/strategy.yaml');

for (const path of profile?.requiredBriefPaths || []) {
  if (unresolved(get(brief, path))) add('ERROR', 'BRIEF_INCOMPLETE', 'Required for the selected architecture.', `00-intake/client-brief.yaml:${path}`);
}
for (const path of ['commercial.primary_conversion.action', 'art_direction.visual_world', 'operations.content_owner']) {
  if (unresolved(get(brief, path))) add('ERROR', 'BRIEF_INCOMPLETE', 'Required before production.', `00-intake/client-brief.yaml:${path}`);
}

const claims = new Map((evidence.claims || []).map((claim) => [claim.claim_id, claim]));
const publishable = new Set(['approved', 'approved_anonymized', 'concept_only']);
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
      else if (!publishable.has(claim.status)) add('ERROR', 'CLAIM_NOT_PUBLISHABLE', `${id} status is ${claim.status}.`, page.path);
      else if (claim.status === 'concept_only' && !isConcept) add('ERROR', 'CONCEPT_CLAIM_IN_LIVE_SITE', `${id} is concept_only but site status is ${siteStatus}.`, page.path);
      else if (claim.status === 'approved_anonymized' && siteStatus === 'live_client' && !claim.required_caveat) add('ERROR', 'ANONYMIZED_CAVEAT_REQUIRED', `${id} needs an approved anonymization caveat for live use.`, page.path);
    }
  }
}

if (isConcept && !brief.proof?.concept_disclosure_required) {
  add('ERROR', 'CONCEPT_DISCLOSURE_REQUIRED', 'Concept demos must carry an explicit disclosure requirement.', '00-intake/client-brief.yaml');
}
if (!usedClaimIds.size) {
  add(isLive && strict ? 'ERROR' : 'WARN', 'NO_EVIDENCE_REFERENCED', 'No approved claims are referenced. Keep proof explicitly concept-safe, or add permissioned evidence before a live release.', '01-strategy/page-plan.yaml');
}

const plannedRoles = new Set((plan.pages || []).flatMap((page) => (page.sections || []).flatMap((section) => section.photo_roles || [])));
const suppliedRoles = new Set((shotlist.shots || []).map((shot) => shot.code));
for (const role of plannedRoles) {
  if (!suppliedRoles.has(role)) add(strict ? 'ERROR' : 'WARN', 'PHOTO_ROLE_UNPLANNED', `${role} is used in the page plan but absent from the photo shotlist.`, '02-assets/photo-shotlist.yaml');
}
for (const role of profile?.photoRoles || []) {
  if (!plannedRoles.has(role)) add(strict ? 'ERROR' : 'WARN', 'PHOTO_ROLE_UNUSED', `${role} is required by ${architecture} but is not used in the page plan.`, '01-strategy/page-plan.yaml');
}

const assetsByRole = new Map((assets.assets || []).map((asset) => [asset.role, asset]));
for (const role of plannedRoles) {
  const asset = assetsByRole.get(role);
  if (!asset) {
    add(strict ? 'ERROR' : 'WARN', 'ASSET_ROLE_MISSING', `${role} has no asset-manifest record.`, '02-assets/asset-manifest.yaml');
    continue;
  }
  if (!isConcept && (!nonEmpty(asset.permission_note) || asset.source_state === 'concept_only')) {
    add('ERROR', 'ASSET_PERMISSION_UNRESOLVED', `${role} needs a non-concept source state and permission note before a live release.`, '02-assets/asset-manifest.yaml');
  }
  if (!isConcept && (!nonEmpty(asset.alt) || !nonEmpty(asset.published_paths?.desktop) || !nonEmpty(asset.published_paths?.mobile))) {
    add('ERROR', 'ASSET_PUBLICATION_INCOMPLETE', `${role} needs alt text plus desktop and mobile published derivatives before a live release.`, '02-assets/asset-manifest.yaml');
  }
}

if (isLive) {
  const operations = brief.operations || {};
  if (operations.form_provider === 'unconfigured' || unresolved(operations.form_provider)) {
    add('ERROR', 'FORM_PROVIDER_UNCONFIGURED', 'A live release requires an approved form provider.', '00-intake/client-brief.yaml:operations.form_provider');
  }
  if (!isHttpsUrl(operations.canonical_domain)) {
    add('ERROR', 'CANONICAL_DOMAIN_INVALID', 'A live release requires an HTTPS canonical domain.', '00-intake/client-brief.yaml:operations.canonical_domain');
  }
  if (!String(operations.privacy_policy_path || '').startsWith('/')) {
    add('ERROR', 'PRIVACY_PATH_MISSING', 'A live release requires a privacy policy path beginning with /.', '00-intake/client-brief.yaml:operations.privacy_policy_path');
  }
  if (!String(operations.form_endpoint_status || '').startsWith('approved')) {
    add('ERROR', 'FORM_ENDPOINT_UNAPPROVED', 'A live release requires an approved public form endpoint status.', '00-intake/client-brief.yaml:operations.form_endpoint_status');
  }
}

const report = {
  engine: 'AURA Compiler',
  slug,
  validated_at: new Date().toISOString(),
  strict,
  site_status: siteStatus,
  architecture,
  claim_references: [...usedClaimIds],
  photo_roles: [...plannedRoles],
  diagnostics,
  status: diagnostics.some((item) => item.level === 'ERROR') ? 'failed' : 'passed',
};
writeJson(clientFile(slug, '04-release', 'validation-report.json'), report);
const errors = printDiagnostics(diagnostics);
console.log(`Validation report: ${clientFile(slug, '04-release', 'validation-report.json')}`);
process.exit(errors ? 1 : 0);
