import { clientFile, parseArgs, readYaml, safeSlugFromArg, writeYaml } from './lib.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const brief = readYaml(clientFile(slug, '00-intake', 'client-brief.yaml'));
const strategy = readYaml(clientFile(slug, '01-strategy', 'strategy.yaml'));
const plan = readYaml(clientFile(slug, '01-strategy', 'page-plan.yaml'));
const existingShotlist = readYaml(clientFile(slug, '02-assets', 'photo-shotlist.yaml'));
const existingAssets = readYaml(clientFile(slug, '02-assets', 'asset-manifest.yaml'));

const roleDefinitions = {
  P01: { role: 'identity_anchor', ratio: '4:5', composition: 'Neutral, clear identity anchor; not normally published.', desktop_crop: '4:5', mobile_crop: '4:5' },
  P02: { role: 'hero_presence', ratio: '16:9 + 4:5', composition: 'Cinematic subject placement with a copy-safe negative-space zone.', desktop_crop: '16:9', mobile_crop: '4:5' },
  P03: { role: 'hero_cutout', ratio: 'transparent portrait', composition: 'Full or three-quarter body with clean alpha edge and deliberate copy side.', desktop_crop: 'transparent wide', mobile_crop: 'transparent portrait' },
  P04: { role: 'private_room_portrait', ratio: '4:5', composition: 'Quiet, contextual portrait in a material environment.', desktop_crop: '4:5', mobile_crop: '4:5' },
  P05: { role: 'working_scene', ratio: '3:2', composition: 'Credible work in progress; no stock laptop pose.', desktop_crop: '3:2', mobile_crop: '4:5' },
  P06: { role: 'editorial_close', ratio: '4:5', composition: 'Warm close portrait for fit or final conversion; calm expression.', desktop_crop: '4:5', mobile_crop: '4:5' },
  P07: { role: 'stage_or_room_context', ratio: '16:9', composition: 'Context and room scale lead; use only if documentary context is true or labelled conceptual.', desktop_crop: '16:9', mobile_crop: '4:5' },
  P08: { role: 'conversation_scene', ratio: '3:2', composition: 'Listening or working interaction with natural hands and no implied client relationship unless true.', desktop_crop: '3:2', mobile_crop: '4:5' },
  P09: { role: 'method_artifact', ratio: '3:2', composition: 'Material process artifact; avoid invented readable text.', desktop_crop: '3:2', mobile_crop: '4:5' },
  P10: { role: 'architectural_texture', ratio: '16:9', composition: 'Material atmosphere and pacing within the same visual world.', desktop_crop: '16:9', mobile_crop: '16:9' },
  P11: { role: 'motion_frame', ratio: '16:9', composition: 'Quiet movement only; optional performance media.', desktop_crop: '16:9', mobile_crop: '4:5' },
  P12: { role: 'signature_asset', ratio: '3:2', composition: 'Closing object, mark or editorial detail that supports conversion.', desktop_crop: '3:2', mobile_crop: '4:5' },
};

const planned = [...new Set((plan.pages || []).flatMap((page) => (page.sections || []).flatMap((section) => section.photo_roles || [])))];
const existingByCode = new Map((existingShotlist.shots || []).map((shot) => [shot.code, shot]));
const shots = planned.map((code) => ({
  code,
  ...(roleDefinitions[code] || { role: 'custom', ratio: 'TBD', composition: 'TBD', desktop_crop: 'TBD', mobile_crop: 'TBD' }),
  consent_state: brief.art_direction?.identity_reference_consent ? 'consented_identity_reference' : brief.art_direction?.image_strategy === 'synthetic_concept' ? 'synthetic_concept' : 'approval_required',
  visual_world: strategy.visual_direction || brief.art_direction?.visual_world,
  wardrobe_chapter: '[APPROVE WARDROBE CHAPTER]',
  location_chapter: '[APPROVE LOCATION CHAPTER]',
  page_placements: (plan.pages || []).filter((page) => (page.sections || []).some((section) => (section.photo_roles || []).includes(code))).map((page) => page.path),
  alt_intent: '[DESCRIBE THE MEANINGFUL IMAGE; EMPTY ONLY IF DECORATIVE]',
  prompt_status: 'needs_approval',
  quality_check: { identity_consistent: false, anatomy_checked: false, edge_checked: false, text_artifacts_checked: false, mobile_crop_checked: false },
  ...existingByCode.get(code),
}));

writeYaml(clientFile(slug, '02-assets', 'photo-shotlist.yaml'), {
  engine: 'AURA Compiler', generated_at: new Date().toISOString(),
  project: { brand_name: brief.project?.brand_name, architecture: strategy.architecture, image_strategy: brief.art_direction?.image_strategy, identity_reference_consent: brief.art_direction?.identity_reference_consent, visual_world: strategy.visual_direction || brief.art_direction?.visual_world },
  shots,
});

const assetsByRole = new Map((existingAssets.assets || []).map((asset) => [asset.role, asset]));
writeYaml(clientFile(slug, '02-assets', 'asset-manifest.yaml'), {
  engine: 'AURA Compiler', generated_at: new Date().toISOString(),
  assets: planned.map((code) => ({
    role: code,
    source_state: brief.art_direction?.image_strategy === 'synthetic_concept' ? 'concept_only' : 'approval_required',
    master_path: '',
    published_paths: { desktop: '', mobile: '' },
    alt: '[REQUIRED BEFORE PUBLICATION]',
    width: null,
    height: null,
    permission_note: '[REQUIRED BEFORE PUBLICATION]',
    ...assetsByRole.get(code),
  })),
});

console.log(`Generated ${shots.length} photo roles in clients/${slug}/02-assets/`);
