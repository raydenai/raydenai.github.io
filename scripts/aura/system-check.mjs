import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseArgs, printDiagnostics, diag, writeJson } from './lib.mjs';

const args = parseArgs();
const mode = args.mode || 'concept';
const dist = args.dist || 'dist';
const diagnostics = [];
const add = (level, code, message, path = '') => diagnostics.push(diag(level, code, message, path));
const htmlFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith('.html')) htmlFiles.push(path);
  }
}

if (!existsSync(dist)) {
  add('ERROR', 'DIST_MISSING', `Build output does not exist: ${dist}. Run pnpm build first.`, dist);
} else {
  walk(dist);
  if (!htmlFiles.length) add('ERROR', 'HTML_MISSING', 'No HTML output was found.', dist);
}

for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8');
  const relativePath = relative(dist, path);
  const count = (pattern) => (html.match(pattern) || []).length;
  if (count(/<title>/g) !== 1) add('ERROR', 'TITLE_INVALID', 'Every page needs exactly one title element.', relativePath);
  if (!/<meta\s+name="description"/i.test(html)) add('ERROR', 'DESCRIPTION_MISSING', 'Every page needs a meta description.', relativePath);
  if (!/<link\s+rel="canonical"/i.test(html)) add('ERROR', 'CANONICAL_MISSING', 'Every page needs a canonical link.', relativePath);
  if (!/<main\s+id="main"/i.test(html)) add('ERROR', 'MAIN_LANDMARK_MISSING', 'Every page needs the primary main landmark.', relativePath);
  if (!/<html[^>]+lang="[^"]+"/i.test(html)) add('ERROR', 'LANG_MISSING', 'Every page needs an html lang attribute.', relativePath);
  if (count(/<h1\b/gi) !== 1) add('ERROR', 'H1_INVALID', 'Every page needs exactly one H1.', relativePath);
  if (/<img\b(?![^>]*\balt=)[^>]*>/gi.test(html)) add('ERROR', 'IMAGE_ALT_MISSING', 'Every rendered image needs an alt attribute; use alt="" only when decorative.', relativePath);
  if (/(?:src|href)="http:\/\//i.test(html)) add('ERROR', 'INSECURE_RESOURCE', 'Production output contains an insecure http:// resource reference.', relativePath);
  const demoForm = /action="demo:\/\//i.test(html);
  const isConcept = /CONCEPT[- ]SAFE|CONCEPT PREVIEW|CONCEPT DEMO/i.test(html) || /noindex/i.test(html);
  if (demoForm && mode === 'production' && !isConcept) {
    add('ERROR', 'DEMO_FORM_IN_PRODUCTION', 'A production page contains a demo:// form action without a concept disclosure.', relativePath);
  }
  if (mode === 'production' && /https:\/\/example\.com/i.test(html)) {
    add('ERROR', 'PLACEHOLDER_DOMAIN', 'Production output contains example.com canonical or metadata.', relativePath);
  }
}

if (existsSync(dist) && !existsSync(join(dist, 'sitemap-index.xml'))) {
  add('ERROR', 'SITEMAP_MISSING', 'sitemap-index.xml is missing from the static output.', dist);
}

const report = {
  engine: 'AURA Compiler',
  checked_at: new Date().toISOString(),
  mode,
  dist,
  pages_checked: htmlFiles.length,
  diagnostics,
  status: diagnostics.some((item) => item.level === 'ERROR') ? 'failed' : 'passed',
};
writeJson(join(dist, 'aura-system-check.json'), report);
const errors = printDiagnostics(diagnostics);
console.log(`System check report: ${join(dist, 'aura-system-check.json')}`);
process.exit(errors ? 1 : 0);
