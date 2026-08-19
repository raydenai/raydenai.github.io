import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { clientFile, parseArgs, readYaml, safeSlugFromArg, writeJson } from './lib.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const visual = args.visual !== 'false' && args['no-visual'] !== true;
const brief = readYaml(clientFile(slug, '00-intake', 'client-brief.yaml'));
const strategy = readYaml(clientFile(slug, '01-strategy', 'strategy.yaml'));
const plan = readYaml(clientFile(slug, '01-strategy', 'page-plan.yaml'));
const evidence = readYaml(clientFile(slug, '00-intake', 'evidence-register.yaml'));
const assets = readYaml(clientFile(slug, '02-assets', 'asset-manifest.yaml'));
const siteStatus = brief.project?.site_status || 'unknown';
const mode = ['live_client', 'anonymized_client'].includes(siteStatus) ? 'production' : 'concept';
const reportPath = clientFile(slug, '04-release', 'release-dossier.json');
const visualOutput = clientFile(slug, '04-release', 'visual-qa');

function run(name, command, commandArgs, env = {}) {
  const result = spawnSync(command, commandArgs, {
    encoding: 'utf8', cwd: process.cwd(), env: { ...process.env, ...env },
  });
  const entry = {
    name, command: `${command} ${commandArgs.join(' ')}`, status: result.status ?? 1,
    stdout: (result.stdout || '').slice(-8000), stderr: (result.stderr || '').slice(-4000),
  };
  console.log(`${entry.status === 0 ? 'PASS' : 'FAIL'} ${name}`);
  return entry;
}

async function waitForPreview(url) {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    try { if ((await fetch(url)).ok) return true; } catch {}
    await delay(200);
  }
  return false;
}

async function runBrowserChecks() {
  const port = Number(args.port || 4322);
  const baseUrl = `http://127.0.0.1:${port}`;
  const preview = spawn(process.execPath, ['scripts/aura/static-preview.mjs', '--port', String(port)], {
    cwd: process.cwd(), stdio: 'pipe',
  });
  const started = await waitForPreview(baseUrl);
  if (!started) {
    preview.kill('SIGTERM');
    return [{ name: 'visual_qa', command: 'static preview + visual-qa', status: 1, stdout: '', stderr: 'Static preview did not become ready.' }];
  }
  const results = [
    run('visual_qa', process.execPath, ['scripts/visual-qa.mjs', baseUrl], { AURA_QA_OUT: visualOutput }),
  ];
  if (results[0].status === 0) {
    results.push(run('accessibility_smoke', process.execPath, ['scripts/aura/a11y-smoke.mjs', baseUrl]));
  }
  preview.kill('SIGTERM');
  await new Promise((resolve) => preview.once('exit', resolve));
  return results;
}

const steps = [
  ['client_contract', 'pnpm', ['aura:validate', '--', '--slug', slug, '--strict']],
  ['block_sequence', 'pnpm', ['lint:blocks']],
  ['types', 'pnpm', ['check']],
  ['images', 'pnpm', ['verify:images']],
  ['build', 'pnpm', ['build']],
  ['system_policy', 'pnpm', ['aura:system-check', '--', '--mode', mode]],
];
const results = [];
for (const [name, command, commandArgs] of steps) {
  const result = run(name, command, commandArgs);
  results.push(result);
  if (result.status !== 0) break;
}
if (visual && results.every((result) => result.status === 0)) results.push(...await runBrowserChecks());

const git = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8', cwd: process.cwd() });
const verificationPath = clientFile(slug, '04-release', 'verification-report.json');
const release = {
  engine: 'AURA Compiler', dossier_version: 2, generated_at: new Date().toISOString(),
  git_revision: git.status === 0 ? git.stdout.trim() : null,
  client: {
    slug, brand_name: brief.project?.brand_name, site_status: siteStatus, architecture: strategy.architecture,
    primary_conversion: brief.commercial?.primary_conversion?.action,
  },
  strategy: {
    approved: strategy.decision_status === 'approved', selected_because: strategy.selected_because,
    pages: (plan.pages || []).map((page) => ({ path: page.path, decision: page.desired_decision, cta: page.primary_cta?.label })),
  },
  evidence: {
    total_claims: (evidence.claims || []).length,
    referenced_claims: (plan.pages || []).flatMap((page) => (page.sections || []).flatMap((section) => section.claim_ids || [])),
  },
  assets: {
    total_roles: (assets.assets || []).length,
    roles: (assets.assets || []).map((asset) => ({ role: asset.role, source_state: asset.source_state, permission_note: asset.permission_note })),
  },
  policy: {
    mode, visual_qa_required: visual, canonical_domain: brief.operations?.canonical_domain || null,
    form_provider: brief.operations?.form_provider || null, form_endpoint_status: brief.operations?.form_endpoint_status || null,
  },
  source_reports: {
    verification: existsSync(verificationPath) ? verificationPath : null,
    visual_qa: visual && existsSync(join(visualOutput, 'report.json')) ? join(visualOutput, 'report.json') : null,
    system_check: existsSync('dist/aura-system-check.json') ? 'dist/aura-system-check.json' : null,
  },
  results,
  status: results.length === steps.length + (visual ? 2 : 0) && results.every((result) => result.status === 0) ? 'authorized' : 'blocked',
};
writeJson(reportPath, release);
console.log(`Release dossier: ${reportPath}`);
process.exit(release.status === 'authorized' ? 0 : 1);
