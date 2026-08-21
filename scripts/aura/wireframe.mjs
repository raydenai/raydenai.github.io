import { join } from 'node:path';
import { clientFile, ensureDir, parseArgs, readYaml, safeSlugFromArg, writeJson, writeText } from './lib.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const brief = readYaml(clientFile(slug, '00-intake', 'client-brief.yaml'));
const strategy = readYaml(clientFile(slug, '01-strategy', 'strategy.yaml'));
const plan = readYaml(clientFile(slug, '01-strategy', 'page-plan.yaml'));
const assets = readYaml(clientFile(slug, '02-assets', 'asset-manifest.yaml'));

if (strategy.decision_status !== 'approved' && args.draft !== true) {
  throw new Error('Wireframes require an approved strategy. Set decision_status: approved or use --draft for a non-production proposal.');
}

const roleVisual = {
  hero: { desktop: 'copy / portrait split', mobile: 'copy first, portrait crop second', surface: 'primary' },
  problem_mirror: { desktop: 'wide tension statement', mobile: 'single-column tension statement', surface: 'quiet' },
  named_method: { desktop: 'artifact + ordered method grid', mobile: 'artifact then stacked method', surface: 'paper' },
  proof: { desktop: 'evidence ledger / proof grid', mobile: 'stacked proof ledger', surface: 'quiet' },
  story: { desktop: 'editorial story column', mobile: 'linear story column', surface: 'paper' },
  fit: { desktop: 'qualified-fit split', mobile: 'fit criteria then action', surface: 'quiet' },
  lead_magnet: { desktop: 'editorial artifact + capture panel', mobile: 'artifact then capture panel', surface: 'paper' },
  offer: { desktop: 'offer narrative + context image', mobile: 'offer stack then context image', surface: 'primary' },
  final_conversion: { desktop: 'conversion panel + reassurance', mobile: 'single conversion panel', surface: 'accent' },
};

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function photoDetails(role) {
  const asset = (assets.assets || []).find((item) => item.role === role);
  return {
    role,
    source_state: asset?.source_state || 'planned',
    desktop_crop: asset?.desktop_crop || 'NEEDS APPROVAL',
    mobile_crop: asset?.mobile_crop || 'NEEDS APPROVAL',
    alt_intent: asset?.alt_intent || 'NEEDS APPROVAL',
  };
}

function sectionManifest(section, pagePath) {
  const visual = roleVisual[section.role] || { desktop: 'editorial section', mobile: 'stacked editorial section', surface: 'quiet' };
  return {
    page: pagePath,
    position: section.position,
    role: section.role,
    visitor_state: section.visitor_state,
    purpose: section.purpose,
    block_candidates: section.block_candidates || [],
    claim_ids: section.claim_ids || [],
    photo_roles: (section.photo_roles || []).map(photoDetails),
    desktop_layout: visual.desktop,
    mobile_layout: visual.mobile,
    surface: visual.surface,
    copy_requirement: `Write only after approval: ${section.purpose}`,
    approval_status: 'needs_wireframe_review',
  };
}

const pages = (plan.pages || []).map((page) => ({
  path: page.path,
  page_name: page.page_name,
  primary_visitor: page.primary_visitor,
  desired_decision: page.desired_decision,
  primary_cta: page.primary_cta,
  secondary_cta: page.secondary_cta,
  sections: (page.sections || []).map((section) => sectionManifest(section, page.path)),
}));

const manifest = {
  engine: 'AURA Compiler',
  artifact: 'wireframe-manifest',
  generated_at: new Date().toISOString(),
  project: {
    slug,
    brand_name: brief.project?.brand_name,
    architecture: strategy.architecture,
    visual_world: strategy.visual_direction,
    site_status: brief.project?.site_status,
  },
  approval_rule: 'A page may move to content drafting only after its wireframe is approved and every proof/photo role has an owner or concept-safe disclosure.',
  desktop_canvas: { width: 1440, grid: '12-column', outer_margin: 72, baseline: 8 },
  mobile_canvas: { width: 390, grid: '4-column', outer_margin: 20, baseline: 8 },
  pages,
};

function pageAnchor(path) {
  return path === '/' ? 'home' : path.replaceAll('/', '-').replace(/^-|-$/g, '');
}

const pageSections = pages.map((page) => {
  const desktop = page.sections.map((section) => {
    const blocks = section.block_candidates.slice(0, 3).join(' · ');
    const photos = section.photo_roles.length
      ? section.photo_roles.map((photo) => `${photo.role} / ${photo.desktop_crop}`).join('<br>')
      : 'No visual asset required';
    const claims = section.claim_ids.length ? section.claim_ids.join(', ') : 'No claim permitted';
    return `<section class="wire-section surface-${section.surface}">
      <div class="wire-label">${String(section.position).padStart(2, '0')} · ${escapeHtml(section.role.replaceAll('_', ' '))}</div>
      <div class="wire-grid">
        <div class="wire-copy"><strong>${escapeHtml(section.visitor_state)}</strong><p>${escapeHtml(section.purpose)}</p><small>Blocks: ${escapeHtml(blocks)}</small><small>Claims: ${escapeHtml(claims)}</small></div>
        <div class="wire-media">${escapeHtml(photos)}</div>
      </div>
      <div class="mobile-note">Mobile: ${escapeHtml(section.mobile_layout)} · reduced motion / tap targets / reading order must be confirmed.</div>
    </section>`;
  }).join('');

  const mobile = page.sections.map((section) => `<div class="mobile-block surface-${section.surface}"><b>${String(section.position).padStart(2, '0')} ${escapeHtml(section.role.replaceAll('_', ' '))}</b><span>${escapeHtml(section.mobile_layout)}</span></div>`).join('');
  const cta = page.primary_cta || {};
  return `<article class="page-board" id="${escapeHtml(pageAnchor(page.path))}">
    <header class="page-header"><div><span>PAGE ${escapeHtml(page.path)}</span><h2>${escapeHtml(page.page_name)}</h2><p>${escapeHtml(page.primary_visitor)}</p></div><div class="page-decision"><b>Decision</b><span>${escapeHtml(page.desired_decision)}</span><b>Primary action</b><span>${escapeHtml(cta.label || 'NEEDS APPROVAL')}</span><small>Fields: ${escapeHtml((cta.required_form_fields || []).join(', ') || 'NEEDS APPROVAL')}</small></div></header>
    <div class="desktop-wire"><div class="canvas-label">DESKTOP · 1440px · 12-column system</div><nav class="nav-wire">Brand / thesis / route navigation <button>${escapeHtml(cta.label || 'Primary action')}</button></nav>${desktop}</div>
    <div class="mobile-wire"><div class="canvas-label">MOBILE · 390px · 4-column system</div><div class="mobile-nav">Brand <button>Menu</button></div>${mobile}<button class="sticky-cta">${escapeHtml(cta.label || 'Primary action')}</button></div>
  </article>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(brief.project?.brand_name || slug)} — AURA Wireframe Approval Pack</title>
<style>
:root{--ink:#161719;--paper:#f2efe7;--line:#c8c1b4;--accent:#d27a31;--quiet:#e7e2d7;--primary:#d6d0c4;--max:1440px}*{box-sizing:border-box}body{margin:0;background:#d9d4ca;color:var(--ink);font-family:Inter,Arial,sans-serif;line-height:1.45}.cover{padding:72px max(32px,calc((100vw - var(--max))/2));background:#171819;color:#f6f0e6}.eyebrow,.wire-label,.canvas-label,.page-header span{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:800}.cover h1{font-family:Georgia,serif;max-width:850px;font-size:clamp(44px,7vw,88px);line-height:.94;margin:18px 0}.cover p{max-width:800px;color:#d8d0c4;font-size:18px}.cover-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#565451;margin-top:44px}.cover-grid div{background:#222426;padding:18px}.cover-grid b,.cover-grid span{display:block}.cover-grid span{font-size:13px;color:#d8d0c4;margin-top:8px}.approval{padding:24px max(32px,calc((100vw - var(--max))/2));background:#e1a964;display:flex;gap:20px;align-items:center}.approval b{font-size:15px}.approval span{font-size:13px}.page-board{max-width:var(--max);margin:46px auto;background:var(--paper);border:1px solid #aaa194}.page-header{padding:34px 46px;display:grid;grid-template-columns:1fr 300px;gap:28px;border-bottom:1px solid var(--line)}.page-header h2{font-family:Georgia,serif;font-size:42px;margin:8px 0}.page-header p{max-width:680px;margin:0;color:#5e5a55}.page-decision{border-left:3px solid var(--accent);padding-left:18px;display:grid;gap:4px;align-content:start}.page-decision b{font-size:10px;letter-spacing:.1em;text-transform:uppercase;margin-top:8px}.page-decision small{margin-top:8px;color:#5e5a55}.desktop-wire{padding:26px 46px 46px}.canvas-label{margin-bottom:14px;color:#6b665f}.nav-wire{display:flex;justify-content:space-between;align-items:center;min-height:62px;border:1px dashed #8d877d;padding:12px 18px;margin-bottom:18px;font-size:12px}.nav-wire button,.sticky-cta,.mobile-nav button{background:var(--ink);color:#fff;border:0;padding:12px 16px;font-weight:800;font-size:12px}.wire-section{border:1px solid var(--line);margin-top:14px;padding:18px}.surface-paper{background:#f8f6f1}.surface-quiet{background:var(--quiet)}.surface-primary{background:var(--primary)}.surface-accent{background:#efc68c}.wire-label{margin-bottom:10px}.wire-grid{display:grid;grid-template-columns:8fr 4fr;gap:20px;min-height:128px}.wire-copy{border:1px dashed #aaa194;padding:18px}.wire-copy strong{text-transform:uppercase;font-size:12px;letter-spacing:.08em}.wire-copy p{margin:9px 0}.wire-copy small{display:block;color:#5e5a55;margin-top:4px}.wire-media{border:1px dashed #8d877d;display:grid;place-items:center;text-align:center;padding:16px;font-size:12px;background:rgba(255,255,255,.3)}.mobile-note{font-size:12px;margin-top:12px;color:#5e5a55}.mobile-wire{display:none}.system-notes{max-width:var(--max);margin:46px auto;padding:42px;background:#171819;color:#eee7da}.system-notes h2{font-family:Georgia,serif;font-size:36px}.system-notes ol{columns:2;gap:50px}.system-notes li{break-inside:avoid;margin:0 0 14px}.footer{padding:40px;text-align:center;font-size:12px;color:#5e5a55}@media(max-width:700px){.cover{padding:42px 20px}.cover-grid{grid-template-columns:1fr 1fr}.approval{padding:18px 20px;display:block}.approval span{display:block;margin-top:8px}.page-board{margin:28px 12px}.page-header{padding:24px 20px;display:block}.page-header h2{font-size:34px}.page-decision{margin-top:22px}.desktop-wire{display:none}.mobile-wire{display:block;padding:20px}.mobile-nav{display:flex;justify-content:space-between;padding:12px;border:1px dashed #8d877d;margin-bottom:12px}.mobile-block{padding:18px;margin-top:10px;border:1px solid var(--line);display:grid;gap:8px}.mobile-block b{text-transform:uppercase;font-size:11px;letter-spacing:.08em}.mobile-block span{font-size:13px}.sticky-cta{width:100%;margin-top:16px;min-height:48px}.system-notes{margin:28px 12px;padding:28px 20px}.system-notes ol{columns:1}.footer{padding:28px 18px}}
</style>
</head>
<body>
<section class="cover"><div class="eyebrow">AURA Compiler · Wireframe approval pack · ${escapeHtml(strategy.architecture)}</div><h1>${escapeHtml(brief.project?.brand_name || slug)}</h1><p>${escapeHtml(brief.position?.one_sentence_position || 'Position pending approval.')}</p><div class="cover-grid"><div><b>Primary buyer</b><span>${escapeHtml(brief.buyer?.primary_person || 'NEEDS APPROVAL')}</span></div><div><b>Primary decision</b><span>${escapeHtml(brief.commercial?.primary_conversion?.action || 'NEEDS APPROVAL')}</span></div><div><b>Visual world</b><span>${escapeHtml(strategy.visual_direction || brief.art_direction?.visual_world || 'NEEDS APPROVAL')}</span></div><div><b>Proof posture</b><span>${escapeHtml(plan.proof_posture || 'NEEDS APPROVAL')}</span></div></div></section>
<section class="approval"><b>Approval gate</b><span>Approve page jobs, section order, CTA, proof treatment, photo roles and responsive composition before content writing or visual implementation. Generated copy and image prompts remain candidates until separately approved.</span></section>
${pageSections}
<section class="system-notes"><h2>Wireframe release conditions</h2><ol><li>Every page has one primary decision and CTA.</li><li>Every proof section references only approved claim IDs or stays visibly concept-safe.</li><li>Every image role has a source state, crop contract and alt-text intent.</li><li>Every mobile wireframe has a deliberate reading order, crop and touch behavior.</li><li>Every section maps to a typed Astro block candidate before implementation.</li><li>Content promotion, static policy, visual QA and keyboard checks remain separate release gates.</li></ol></section>
<footer class="footer">Generated by AURA Compiler · Wireframe candidates are approval artifacts, not public website content.</footer>
</body>
</html>`;

const root = clientFile(slug, '03-production', 'wireframes');
ensureDir(root);
writeJson(join(root, 'wireframe-manifest.json'), manifest);
writeText(join(root, 'site-wireframe.html'), html);
writeText(join(root, 'approval-gate.md'), `# ${brief.project?.brand_name || slug} — Wireframe Approval Gate\n\nApprove the generated wireframe only when every page job, CTA, proof treatment, image role, desktop composition and mobile composition is correct.\n\n- [ ] Buyer and desired decision are correct on every page.\n- [ ] CTA labels, form intent and requested fields are appropriate.\n- [ ] Section order earns the requested action for this archetype.\n- [ ] Claim IDs and concept disclosures are accurate.\n- [ ] Every photo role has source / consent state and responsive crop requirements.\n- [ ] Mobile reading order and persistent CTA behavior are approved.\n- [ ] Content and implementation may now proceed.\n`);

console.log(`Generated wireframe approval pack: ${root}`);
console.log(`Pages: ${pages.length} | Desktop: 1440px / 12-column | Mobile: 390px / 4-column`);
