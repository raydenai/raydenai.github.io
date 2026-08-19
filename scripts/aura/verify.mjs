import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { clientFile, parseArgs, readYaml, safeSlugFromArg, writeJson } from './lib.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const runVisual = args.visual === true;
const reportPath = clientFile(slug, '04-release', 'verification-report.json');
const commands = [
  ['client_contract', 'pnpm', ['aura:validate', '--', '--slug', slug, '--strict']],
  ['block_sequence', 'pnpm', ['lint:blocks']],
  ['types', 'pnpm', ['check']],
  ['images', 'pnpm', ['verify:images']],
  ['build', 'pnpm', ['build']],
  ...(runVisual ? [['visual_qa', 'pnpm', ['qa:visual']]] : []),
];

const results = [];
for (const [name, command, commandArgs] of commands) {
  const result = spawnSync(command, commandArgs, { encoding: 'utf8', cwd: process.cwd() });
  results.push({ name, command: `${command} ${commandArgs.join(' ')}`, status: result.status ?? 1, stdout: result.stdout.slice(-8000), stderr: result.stderr.slice(-4000) });
  console.log(`${result.status === 0 ? 'PASS' : 'FAIL'} ${name}`);
  if (result.status !== 0) break;
}

const brief = readYaml(clientFile(slug, '00-intake', 'client-brief.yaml'));
const outputRoot = clientFile(slug, '03-production', 'astro-content');
const hasOutput = existsSync(outputRoot);
const report = {
  engine: 'AURA Compiler', slug, verified_at: new Date().toISOString(), visual_qa_requested: runVisual,
  source_site_status: brief.project?.site_status, compiler_output_present: hasOutput,
  results, status: results.length === commands.length && results.every((result) => result.status === 0) ? 'passed' : 'failed',
};
writeJson(reportPath, report);
console.log(`Verification report: ${reportPath}`);
process.exit(report.status === 'passed' ? 0 : 1);
