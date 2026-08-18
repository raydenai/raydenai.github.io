/**
 * AURA block linter
 *
 * Guards the persuasion sequence and conversion discipline that page builders
 * do not enforce. It deliberately reports diagnostics rather than attempting
 * to rewrite a strategist's decisions.
 *
 * Usage:
 *   node scripts/lint-blocks.mjs
 *   node scripts/lint-blocks.mjs --strict  # warnings fail CI too
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/content';
const strict = process.argv.includes('--strict');

const STAGE = {
  HeroSplitPortrait: 'attention', HeroSplitOptin: 'attention',
  HeroCenteredStatement: 'attention', HeroVideoOverlay: 'attention', HeroSegmented: 'attention',
  LogoStrip: 'credibility', CredibilityBar: 'credibility', CredibilityStack: 'credibility',
  AuthorityQuote: 'credibility', AssociationGrid: 'credibility', MediaFeatures: 'credibility', BookShowcase: 'credibility',
  TestimonialGrid: 'proof', TestimonialSlider: 'proof', ResultsGrid: 'proof', VideoGrid: 'proof', Gallery: 'proof',
  ProblemAgitation: 'problem', EmpathyQuoteWall: 'problem', AudienceQualifier: 'qualification',
  FuturePacing: 'aspiration', IconGrid: 'explanation',
  MethodologyPillars: 'mechanism', NumberedFramework: 'mechanism', PrincipleZigZag: 'mechanism', ProcessTimeline: 'risk-reduction',
  OriginStory: 'trust', CrucibleMoment: 'trust', Manifesto: 'trust', IdentityCallout: 'qualification', PersonalStats: 'trust',
  ServicesGrid: 'offer', OfferLadder: 'offer', HighTicketOffer: 'offer', SpeakingTopics: 'offer',
  PodcastPromo: 'nurture', PostsGrid: 'nurture',
  LeadMagnet: 'capture', LeadMagnetBanner: 'capture', DualCtaTransition: 'transition',
  FinalCta: 'close', ApplicationForm: 'close', ContactSplit: 'close', FaqAccordion: 'objection', RichText: 'explanation',
};
const HEROES = new Set(['HeroSplitPortrait', 'HeroSplitOptin', 'HeroCenteredStatement', 'HeroVideoOverlay', 'HeroSegmented']);
const PROOF = new Set(['LogoStrip', 'CredibilityBar', 'CredibilityStack', 'AuthorityQuote', 'AssociationGrid', 'TestimonialGrid', 'TestimonialSlider', 'ResultsGrid', 'VideoGrid', 'Gallery', 'MediaFeatures']);
const MECHANISM = new Set(['MethodologyPillars', 'NumberedFramework', 'PrincipleZigZag', 'ProcessTimeline']);
const OFFERS = new Set(['ServicesGrid', 'OfferLadder', 'HighTicketOffer', 'SpeakingTopics']);
const CLOSES = new Set(['FinalCta', 'ApplicationForm', 'ContactSplit']);

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : entry.name.endsWith('.json') ? [path] : [];
  });
}

function ctas(block) {
  const found = [];
  if (Array.isArray(block.ctas)) found.push(...block.ctas);
  if (block.cta) found.push(block.cta);
  if (Array.isArray(block.services)) found.push(...block.services.map((s) => s.cta).filter(Boolean));
  if (Array.isArray(block.rungs)) found.push(...block.rungs.map((r) => r.cta).filter(Boolean));
  return found;
}

function firstIndex(blocks, predicate) { return blocks.findIndex(predicate); }
function has(blocks, set) { return blocks.some((b) => set.has(b.type)); }

const output = [];
let errors = 0;
let warnings = 0;
function add(level, file, message) {
  output.push({ level, file, message });
  if (level === 'ERROR') errors++;
  else warnings++;
}

for (const file of files(join(ROOT, 'pages'))) {
  let page;
  try { page = JSON.parse(readFileSync(file, 'utf8')); }
  catch (err) { add('ERROR', file, `Invalid JSON: ${err.message}`); continue; }
  const blocks = page.blocks || [];
  const types = blocks.map((b) => b.type);
  const stages = blocks.map((b) => STAGE[b.type] || 'unknown');
  const label = `${file} (${page.path || 'no path'})`;

  if (!blocks.length) { add('ERROR', label, 'Page contains no blocks.'); continue; }
  const unknown = types.filter((t) => !STAGE[t]);
  if (unknown.length) add('ERROR', label, `Unknown block type(s): ${[...new Set(unknown)].join(', ')}.`);

  if (page.archetype === 'home' && !HEROES.has(types[0])) {
    add('ERROR', label, `Home should open with a hero; found ${types[0]}.`);
  }
  if (page.archetype !== 'home' && !HEROES.has(types[0]) && !blocks[0].heading) {
    add('ERROR', label, 'Non-hero opening block must declare a heading so the renderer can emit an h1.');
  }

  const offerIndex = firstIndex(blocks, (b) => OFFERS.has(b.type));
  const mechanismIndex = firstIndex(blocks, (b) => MECHANISM.has(b.type));
  const proofIndex = firstIndex(blocks, (b) => PROOF.has(b.type));
  if (offerIndex >= 0 && proofIndex < 0 && ['home', 'work-with-me', 'services', 'speaking'].includes(page.archetype)) {
    add('WARN', label, 'Offer appears without a proof block on the page. Add a result, testimonial, authority quote, logo strip, or media feature.');
  }
  /* A compact ServicesGrid can work as early wayfinding on a warm offer page.
     The detailed sale (HighTicketOffer / OfferLadder) must still follow proof. */
  const detailedOfferIndex = firstIndex(blocks, (b) => ['HighTicketOffer', 'OfferLadder'].includes(b.type));
  const onlyServiceMenuFirst = types[1] === 'ServicesGrid' && proofIndex === 2;
  if (offerIndex >= 0 && proofIndex > offerIndex && !onlyServiceMenuFirst && (detailedOfferIndex < 0 || proofIndex > detailedOfferIndex)) {
    add('WARN', label, 'First proof block appears after the detailed offer. Establish evidence before asking for the sale.');
  }
  if (offerIndex >= 0 && mechanismIndex > offerIndex) {
    add('WARN', label, 'Named mechanism appears after the first offer. Explain why this works before showing how to buy.');
  }
  if (['home', 'work-with-me', 'services', 'speaking'].includes(page.archetype) && !has(blocks, CLOSES)) {
    add('WARN', label, 'High-intent page has no explicit close block (FinalCta, ApplicationForm, or ContactSplit).');
  }
  if (page.archetype === 'home' && !has(blocks, new Set(['FaqAccordion']))) {
    add('WARN', label, 'Home has no FAQ objection handler; add one unless the traffic is exclusively warm.');
  }
  const finalClose = Math.max(...blocks.map((b, i) => CLOSES.has(b.type) ? i : -1));
  if (finalClose >= 0 && finalClose < blocks.length - 3) {
    add('WARN', label, `Close block is at position ${finalClose + 1} of ${blocks.length}; consider ending with it to preserve conversion momentum.`);
  }

  const primary = blocks.flatMap(ctas).filter((cta) => (cta.intent || 'primary') === 'primary');
  const hrefs = [...new Set(primary.map((cta) => cta.href).filter(Boolean))];
  if (!primary.length && !has(blocks, new Set(['LeadMagnet', 'LeadMagnetBanner', 'ApplicationForm', 'ContactSplit']))) {
    add('WARN', label, 'No primary CTA or capture form found.');
  }
  if (hrefs.length > 3) {
    add('WARN', label, `Primary CTA hierarchy is diffuse: ${hrefs.length} unique primary destinations (${hrefs.join(', ')}). Limit to one business goal plus at most two supporting routes.`);
  }

  if (stages.includes('unknown')) add('ERROR', label, 'One or more blocks are not assigned to a persuasion stage.');
}

if (!output.length) console.log('AURA block lint: clean.');
else {
  for (const item of output) console.log(`${item.level.padEnd(5)} ${item.file}\n      ${item.message}`);
  console.log(`\nAURA block lint: ${errors} error(s), ${warnings} warning(s). ${strict ? 'Strict mode enabled.' : 'Warnings do not fail the build.'}`);
}
process.exit(errors || (strict && warnings) ? 1 : 0);
