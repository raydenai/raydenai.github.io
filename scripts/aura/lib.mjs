import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import YAML from 'yaml';

export const ARCHITECTURES = [
  'private-signal',
  'authority-speaking',
  'creator-education',
  'niche-specialist',
  'manifesto-movement',
  'portfolio-ip',
];

export const CLIENT_ROOT = 'clients';

export function parseArgs(argv = process.argv.slice(2)) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    values[key] = !next || next.startsWith('--') ? true : next;
    if (values[key] !== true) index += 1;
  }
  return values;
}

export function clientPath(slug) {
  return join(CLIENT_ROOT, slug);
}

export function clientFile(slug, stage, name) {
  return join(clientPath(slug), stage, name);
}

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

export function readYaml(path) {
  if (!existsSync(path)) throw new Error(`Missing required file: ${path}`);
  const data = YAML.parse(readFileSync(path, 'utf8'));
  if (!data || typeof data !== 'object') throw new Error(`Expected a YAML object: ${path}`);
  return data;
}

export function writeYaml(path, value) {
  ensureDir(dirname(path));
  writeFileSync(path, YAML.stringify(value), 'utf8');
}

export function writeJson(path, value) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function writeText(path, value) {
  ensureDir(dirname(path));
  writeFileSync(path, value.endsWith('\n') ? value : `${value}\n`, 'utf8');
}

export function isKebab(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || '');
}

export function required(value) {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
}

export function diag(level, code, message, path = '') {
  return { level, code, message, path };
}

export function printDiagnostics(diagnostics) {
  for (const item of diagnostics) {
    const location = item.path ? ` (${item.path})` : '';
    console.log(`${item.level.padEnd(5)} ${item.code}${location}: ${item.message}`);
  }
  const errors = diagnostics.filter((item) => item.level === 'ERROR').length;
  const warnings = diagnostics.filter((item) => item.level === 'WARN').length;
  console.log(`\nAURA Compiler: ${errors} error(s), ${warnings} warning(s).`);
  return errors;
}

export function safeSlugFromArg(args) {
  const slug = args.slug;
  if (!isKebab(slug)) throw new Error('Provide --slug as lowercase kebab-case, for example: priya-raghavan');
  return slug;
}
