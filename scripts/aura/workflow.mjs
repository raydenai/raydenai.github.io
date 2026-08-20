import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { clientFile, parseArgs, readJson, readYaml, safeSlugFromArg, writeJson, writeText } from './lib.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const stage = args.stage || 'plan';
const validStages = ['plan', 'content', 'release', 'status'];
if (!validStages.includes(stage)) throw new Error(`Unknown --stage ${stage}. Use plan, content, release or status.`);

const root = resolve(process.cwd());
const script = (name) => join(root, 'scripts', 'aura', name);
const brief = readYaml(clientFile(slug, '00-intake', 'client-brief.yaml'));
const strategy = readYaml(clientFile(slug, '01-strategy', 'strategy.yaml'));
const statePath = clientFile(slug, '04-release', 'workflow-state.json');
const wireframeApprovalPath = clientFile(slug, '04-release', 'wireframe-approval.json');
const contentApprovalPath = clientFile(slug, '04-release', 'content-approval.json');
const checklistPath = clientFile(slug, '04-release', 'workflow-checklist.md');

function run(name, scriptName, extra = []) {
  const result = spawnSync(process.execPath, [script(scriptName), '--slug', slug, ...extra], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) throw new Error(`${name} failed with exit code ${result.status}.`);
}

function artifact(path) {
  return existsSync(path);
}

function state(phase, nextAction, approvals = {}) {
  const planPath = clientFile(slug, '01-strategy', 'page-plan.yaml');
  const wireframePath = clientFile(slug, '03-production', 'wireframes/site-wireframe.html');
  const manifestPath = clientFile(slug, '03-production', 'wireframes/wireframe-manifest.json');
  const promptPath = clientFile(slug, '03-production', 'prompts/01-positioning.md');
  const contentPath = clientFile(slug, '03-production', 'astro-content/component-plan.yaml');
  const output = {
    engine: 'AURA Compiler',
    generated_at: new Date().toISOString(),
    client: { slug, brand_name: brief.project?.brand_name, architecture: strategy.architecture, site_status: brief.project?.site_status },
    phase,
    next_action: nextAction,
    approvals,
    artifacts: {
      strategy_approved: strategy.decision_status === 'approved',
      page_plan: artifact(planPath),
      wireframe_html: artifact(wireframePath),
      wireframe_manifest: artifact(manifestPath),
      prompt_packets: artifact(promptPath),
      content_candidates: artifact(contentPath),
      release_dossier: artifact(clientFile(slug, '04-release', 'release-dossier.json')),
    },
    policy: {
      generated_content_is_publishable: false,
      promotion_requires_reviewer_reference: true,
      release_requires_authorized_dossier: true,
    },
  };
  writeJson(statePath, output);
  return output;
}

function writeChecklist(current) {
  writeText(checklistPath, `# ${brief.project?.brand_name || slug} — AURA Production Workflow\n\n**Architecture:** ${strategy.architecture}  \n**Current phase:** ${current.phase}  \n**Next action:** ${current.next_action}\n\n## Stage 00 — Intake and evidence\n\n- [${current.artifacts.strategy_approved ? 'x' : ' '}] Buyer, tension, offer, evidence and architecture are approved.\n- [ ] All public claims and client evidence are permissioned for the intended release.\n\n## Stage 01 — Wireframe approval\n\n- [${current.artifacts.page_plan ? 'x' : ' '}] Page plan generated.\n- [${current.artifacts.wireframe_html ? 'x' : ' '}] Annotated desktop/mobile wireframe generated.\n- [${current.approvals.wireframe ? 'x' : ' '}] Wireframe approval recorded: ${current.approvals.wireframe || 'NEEDS APPROVAL'}.\n\n## Stage 02 — Content and image approval\n\n- [${current.artifacts.prompt_packets ? 'x' : ' '}] Claim-constrained prompt packets generated.\n- [${current.artifacts.content_candidates ? 'x' : ' '}] Typed content candidates generated.\n- [${current.approvals.content ? 'x' : ' '}] Content approval recorded: ${current.approvals.content || 'NEEDS APPROVAL'}.\n- [ ] Approved JSON/MDX content is promoted through \`aura:promote\` with a reviewer reference.\n- [ ] Every real image has source, consent, crop and alt-text review.\n\n## Stage 03 — Release authorization\n\n- [${current.artifacts.release_dossier ? 'x' : ' '}] Release dossier exists.\n- [ ] Live mode has a real domain, privacy path, approved form provider and allowlisted endpoint.\n- [ ] Release dossier is authorized for the intended policy mode.\n`);
}

if (stage === 'status') {
  const current = existsSync(statePath) ? readJson(statePath) : state('intake', 'Run aura:workflow --stage plan after completing and approving strategy.');
  writeChecklist(current);
  console.log(`Workflow status: ${current.phase}`);
  process.exit(0);
}

if (stage === 'plan') {
  if (strategy.decision_status !== 'approved') throw new Error('Plan workflow requires strategy.decision_status: approved.');
  run('Assessment', 'assess.mjs');
  run('Page plan', 'plan.mjs');
  run('Asset plan', 'assets.mjs');
  run('Wireframe', 'wireframe.mjs');
  const current = state('wireframe_review', 'Review site-wireframe.html and record a named wireframe approval before generating content candidates.');
  writeChecklist(current);
  console.log(`Workflow phase: ${current.phase}`);
  process.exit(0);
}

if (stage === 'content') {
  const approval = args['approve-wireframe'];
  if (approval && approval !== true) writeJson(wireframeApprovalPath, { client_slug: slug, approval: approval, approved_at: new Date().toISOString(), artifact: '03-production/wireframes/site-wireframe.html' });
  if (!existsSync(wireframeApprovalPath)) throw new Error('Content workflow requires a named --approve-wireframe reference after wireframe review.');
  run('Prompt packet', 'prompts.mjs');
  run('Content composition', 'compose.mjs');
  const wireframeApproval = readJson(wireframeApprovalPath);
  const current = state('content_review', 'Review typed JSON and MDX candidates, then record content approval before release verification.', { wireframe: wireframeApproval.approval });
  writeChecklist(current);
  console.log(`Workflow phase: ${current.phase}`);
  process.exit(0);
}

if (stage === 'release') {
  const approval = args['approve-content'];
  if (approval && approval !== true) writeJson(contentApprovalPath, { client_slug: slug, approval: approval, approved_at: new Date().toISOString(), scope: 'Generated content candidates reviewed; promotion and live publication remain separate actions.' });
  if (!existsSync(contentApprovalPath)) throw new Error('Release workflow requires a named --approve-content reference after content review.');
  run('Strict validation', 'validate.mjs', ['--strict']);
  run('Release dossier', 'release.mjs');
  const wireframeApproval = existsSync(wireframeApprovalPath) ? readJson(wireframeApprovalPath) : {};
  const contentApproval = readJson(contentApprovalPath);
  const current = state('release_authorized', 'Promote only approved JSON/MDX through aura:promote, then use the release dossier for deployment authorization.', { wireframe: wireframeApproval.approval, content: contentApproval.approval });
  writeChecklist(current);
  console.log(`Workflow phase: ${current.phase}`);
}
