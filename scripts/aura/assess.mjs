import { join } from 'node:path';
import { clientFile, diag, parseArgs, printDiagnostics, readYaml, required, safeSlugFromArg, writeJson, writeYaml } from './lib.mjs';
import { getByKey, recommendArchitecture } from './profiles.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const briefPath = clientFile(slug, '00-intake', 'client-brief.yaml');
const evidencePath = clientFile(slug, '00-intake', 'evidence-register.yaml');
const strategyPath = clientFile(slug, '01-strategy', 'strategy.yaml');
const brief = readYaml(briefPath);
const evidence = readYaml(evidencePath);
const strategy = readYaml(strategyPath);
const diagnostics = [];

const fields = [
  ['buyer.primary_person', brief.buyer?.primary_person],
  ['buyer.high_stakes_moment', brief.buyer?.high_stakes_moment],
  ['buyer.private_tension', brief.buyer?.private_tension],
  ['position.one_sentence_position', brief.position?.one_sentence_position],
  ['position.central_thesis', brief.position?.central_thesis],
  ['commercial.primary_offer.name', brief.commercial?.primary_offer?.name],
  ['commercial.primary_conversion.action', brief.commercial?.primary_conversion?.action],
  ['art_direction.visual_world', brief.art_direction?.visual_world],
];
for (const [path, value] of fields) {
  if (required(value) || String(value).trim().startsWith('[')) {
    diagnostics.push(diag('ERROR', 'DISCOVERY_REQUIRED', 'Resolve this field before strategy approval.', path));
  }
}

const recommendation = recommendArchitecture(brief);
const selected = strategy.architecture !== 'unresolved' ? strategy.architecture : recommendation.recommended;
const profile = getByKey(selected);
if (!profile) diagnostics.push(diag('ERROR', 'ARCHITECTURE_INVALID', `Unknown architecture: ${selected}`, '01-strategy/strategy.yaml'));

for (const path of profile?.requiredBriefPaths || []) {
  const value = path.split('.').reduce((current, key) => current?.[key], brief);
  if (required(value)) diagnostics.push(diag('ERROR', 'ARCHITECTURE_INPUT_MISSING', `Required by ${selected}.`, path));
}

const claims = Array.isArray(evidence.claims) ? evidence.claims : [];
const approvedClaims = claims.filter((claim) => ['approved', 'approved_anonymized', 'concept_only'].includes(claim.status));
const unresolvedClaims = claims.filter((claim) => !['approved', 'approved_anonymized', 'concept_only'].includes(claim.status));
if (!claims.length) diagnostics.push(diag('WARN', 'NO_PROOF_INVENTORY', 'No claims exist. The output must use concept-safe proof treatment.', '00-intake/evidence-register.yaml'));
if (unresolvedClaims.length) diagnostics.push(diag('WARN', 'UNRESOLVED_CLAIMS', `${unresolvedClaims.length} claim(s) cannot be emitted in public content.`, '00-intake/evidence-register.yaml'));
if (brief.project?.site_status === 'concept_demo' && !brief.proof?.concept_disclosure_required) {
  diagnostics.push(diag('ERROR', 'CONCEPT_DISCLOSURE_REQUIRED', 'Concept demos must require a disclosure near proof treatment.', 'proof.concept_disclosure_required'));
}

const report = {
  engine: 'AURA Compiler',
  slug,
  created_at: new Date().toISOString(),
  recommendation,
  selected_architecture: selected,
  architecture_profile: profile ? {
    label: profile.label,
    primary_conversion: profile.primaryConversion,
    proof_posture: profile.proofPosture,
    required_photo_roles: profile.photoRoles,
    default_pages: profile.defaultPages,
  } : null,
  proof_readiness: { total_claims: claims.length, approved_claims: approvedClaims.length, unresolved_claims: unresolvedClaims.length },
  diagnostics,
};
writeJson(clientFile(slug, '01-strategy', 'assessment-report.json'), report);

if (strategy.architecture === 'unresolved' && profile) {
  strategy.architecture = selected;
  strategy.decision_status = 'needs_approval';
  strategy.recommendation = { architecture: selected, confidence: recommendation.confidence, ranked: recommendation.ranked };
  strategy.primary_conversion = profile.primaryConversion;
  strategy.proof_posture = profile.proofPosture;
  writeYaml(strategyPath, strategy);
}

const errors = printDiagnostics(diagnostics);
console.log(`\nRecommendation: ${selected} (${recommendation.confidence} confidence).`);
console.log(`Assessment report: ${join('clients', slug, '01-strategy', 'assessment-report.json')}`);
process.exit(errors ? 1 : 0);
