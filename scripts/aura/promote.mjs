import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, relative, resolve } from 'node:path';
import { clientFile, clientPath, parseArgs, safeSlugFromArg, writeJson } from './lib.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const root = resolve(process.cwd());
const productionRoot = resolve(root, 'src/content');
const revisionsRoot = resolve(root, clientFile(slug, '04-release', 'content-revisions'));
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const inside = (candidate, parent) => candidate === parent || candidate.startsWith(`${parent}/`);

function safeProjectPath(value, parent, label) {
  if (!value || value.includes('..')) throw new Error(`Provide a safe relative --${label} path without '..'.`);
  const path = resolve(root, value);
  if (!inside(path, parent)) throw new Error(`--${label} must remain inside ${relative(root, parent)}.`);
  return path;
}

if (args.rollback) {
  const manifestPath = resolve(revisionsRoot, String(args.rollback), 'manifest.json');
  if (!existsSync(manifestPath)) throw new Error(`Unknown revision: ${args.rollback}`);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (!manifest.backup_path || !existsSync(manifest.backup_path)) throw new Error('The requested revision has no backup to restore.');
  if (args['dry-run'] === true) {
    console.log(`DRY RUN: would restore ${manifest.target} from ${manifest.backup_path}`);
    process.exit(0);
  }
  mkdirSync(dirname(manifest.target), { recursive: true });
  copyFileSync(manifest.backup_path, manifest.target);
  writeJson(resolve(revisionsRoot, String(args.rollback), 'rollback.json'), {
    engine: 'AURA Compiler', rolled_back_at: new Date().toISOString(), revision: args.rollback, target: manifest.target,
  });
  console.log(`Restored ${relative(root, manifest.target)} from revision ${args.rollback}`);
  process.exit(0);
}

const approval = String(args.approval || '');
if (!approval || approval.includes('[')) throw new Error('Provide --approval with a ticket, approval date, or named reviewer reference.');
const source = safeProjectPath(String(args.source || ''), resolve(root, clientPath(slug), '03-production'), 'source');
const target = safeProjectPath(String(args.target || ''), productionRoot, 'target');
if (!existsSync(source)) throw new Error(`Source does not exist: ${relative(root, source)}`);
if (!/\.(json|mdx)$/.test(source) || !/\.(json|mdx)$/.test(target)) throw new Error('Promotion supports only .json and .mdx content files.');
const sourceText = readFileSync(source, 'utf8');
if (/\[NEEDS APPROVAL|\[CLIENT NAME REQUIRED|\[DEFINE /i.test(sourceText)) {
  throw new Error('Source still contains unresolved approval placeholders and cannot be promoted.');
}
const revision = `${new Date().toISOString().replace(/[:.]/g, '-')}--${sha256(source).slice(0, 12)}`;
const revisionRoot = resolve(revisionsRoot, revision);
const backup = resolve(revisionRoot, 'before', relative(productionRoot, target));
const manifest = {
  engine: 'AURA Compiler',
  revision,
  promoted_at: new Date().toISOString(),
  client_slug: slug,
  approval,
  source,
  target,
  source_sha256: sha256(source),
  target_existed: existsSync(target),
  backup_path: existsSync(target) ? backup : null,
  dry_run: args['dry-run'] === true,
};

if (args['dry-run'] === true) {
  console.log(JSON.stringify(manifest, null, 2));
  process.exit(0);
}
if (existsSync(target)) {
  mkdirSync(dirname(backup), { recursive: true });
  copyFileSync(target, backup);
}
mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
writeJson(resolve(revisionRoot, 'manifest.json'), manifest);
console.log(`Promoted ${relative(root, source)} → ${relative(root, target)}`);
console.log(`Revision manifest: ${relative(root, resolve(revisionRoot, 'manifest.json'))}`);
