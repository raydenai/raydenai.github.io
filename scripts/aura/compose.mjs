import { join } from 'node:path';
import { clientFile, parseArgs, readYaml, safeSlugFromArg, writeJson, writeYaml } from './lib.mjs';

const args = parseArgs();
const slug = safeSlugFromArg(args);
const brief = readYaml(clientFile(slug, '00-intake', 'client-brief.yaml'));
const strategy = readYaml(clientFile(slug, '01-strategy', 'strategy.yaml'));
const plan = readYaml(clientFile(slug, '01-strategy', 'page-plan.yaml'));
if (strategy.decision_status !== 'approved' && args.draft !== true) throw new Error('Strategy must be approved before compose. Use --draft only for a non-production skeleton.');

const out = clientFile(slug, '03-production', 'astro-content');
const todo = (label) => `[NEEDS APPROVAL: ${label}]`;
const image = (role, width = 1920, height = 1280) => ({ src: `/images/${slug}/${role.toLowerCase()}.webp`, alt: todo(`alt text for ${role}`), width, height });
const primary = { label: brief.commercial?.primary_conversion?.action || todo('primary CTA label'), href: '/contact/', intent: 'primary', event: 'primary_cta_click' };
const secondary = { label: brief.commercial?.secondary_conversion?.action || todo('secondary CTA label'), href: '/method/', intent: 'secondary', event: 'secondary_cta_click' };

const brand = {
  name: brief.project?.brand_name || todo('brand name'),
  title: brief.position?.one_sentence_position || todo('positioning title'),
  tagline: brief.position?.central_thesis || todo('tagline'),
  archetype: strategy.architecture === 'niche-specialist' ? 'single-offer-funnel' : 'personal-authority-hub',
  theme: strategy.visual_direction?.includes('ivory') ? 'editorial-ivory' : 'obsidian-gold',
  engine: { clientPack: slug, architecture: strategy.architecture, strategyVersion: 1, siteStatus: brief.project?.site_status || 'concept_demo' },
  positioning: {
    audience: brief.buyer?.primary_person || todo('primary buyer'),
    promise: todo('approved observable promise'),
    differentiator: brief.position?.central_thesis || todo('differentiator'),
    methodName: brief.position?.named_method?.name || todo('method name'),
    enemy: brief.position?.category_enemy_or_default || todo('status quo'),
  },
  contact: { email: todo('contact email'), location: todo('location') },
  social: [],
  conversion: { primaryGoal: 'book-call', primaryCta: primary, secondaryCta: secondary },
  proof: { stats: [], mediaLogos: [], clientLogos: [], testimonials: [], awards: [] },
  assets: { portrait: image('p02', 1600, 1200), portraitAlt: image('p04', 1200, 1500), ogImage: image('og', 1200, 630) },
  nav: [
    { label: 'About', href: '/about/', children: [] }, { label: 'The Method', href: '/method/', children: [] },
    { label: 'Work With Me', href: '/work-with-me/', children: [] }, { label: 'Case Files', href: '/case-studies/', children: [] },
    { label: 'Insights', href: '/blog/', children: [] },
  ],
  footerNav: [], legal: { entity: brief.project?.brand_name || todo('legal entity'), links: [] }, integrations: {},
};
writeJson(join(out, 'brand', `${slug}.json`), brand);

function blocksFor(page) {
  return (page.sections || []).map((section) => {
    switch (section.role) {
      case 'hero': return { type: 'HeroSplitPortrait', tone: 'inverse', pad: 'loose', eyebrow: brief.position?.one_sentence_position || todo('eyebrow'), heading: todo('tension-led hero headline'), mark: { word: todo('emphasized word'), style: 'accent' }, body: todo('audience, high-stakes moment, credible future state'), ctas: [primary, secondary], portrait: image('p02', 1600, 1200), portraitTreatment: 'photo', mediaSide: 'right', badges: [], backdrop: 'both' };
      case 'problem_mirror': return { type: 'ProblemAgitation', tone: 'default', pad: 'loose', eyebrow: todo('problem eyebrow'), heading: todo('observable cost headline'), body: todo('approved problem reframe'), painPoints: [todo('cost one'), todo('cost two'), todo('cost three')], media: image('p05') };
      case 'named_method': return { type: 'MethodologyPillars', tone: 'raised', pad: 'loose', eyebrow: todo('method eyebrow'), heading: todo('method headline'), methodName: brief.position?.named_method?.name || todo('method name'), pillars: [{ name: todo('stage one'), summary: todo('tangible output') }, { name: todo('stage two'), summary: todo('tangible output') }, { name: todo('stage three'), summary: todo('tangible output') }] };
      case 'proof': return { type: 'ResultsGrid', tone: 'default', pad: 'loose', eyebrow: todo('proof eyebrow'), heading: todo('approved proof headline'), results: [{ client: todo('approved named or anonymized client context'), headline: todo('case headline'), before: todo('initial condition'), after: todo('observed shift'), metric: todo('approved metric or signal') }] };
      case 'fit': return { type: 'AudienceQualifier', tone: 'raised', pad: 'loose', eyebrow: todo('fit eyebrow'), heading: todo('who this is for'), forItems: [todo('approved fit condition')], notForItems: [todo('approved exclusion')], cta: primary };
      case 'story': return { type: 'OriginStory', tone: 'default', pad: 'loose', eyebrow: todo('origin eyebrow'), heading: todo('earned point-of-view headline'), excerpt: todo('approved origin moment tied to the method'), portrait: image('p04', 1200, 1500), ctas: [secondary] };
      case 'lead_magnet': return { type: 'LeadMagnet', id: 'start-here', tone: 'raised', pad: 'loose', eyebrow: todo('first-value eyebrow'), heading: todo('approved low-friction asset'), magnetName: todo('asset name'), body: todo('specific first result'), benefits: [todo('benefit one'), todo('benefit two')], mockup: image('p09'), form: { action: '#', fields: ['firstName', 'email'], submitLabel: todo('submit label'), consentNote: todo('consent copy') } };
      case 'offer': return { type: 'HighTicketOffer', tone: 'default', pad: 'loose', eyebrow: todo('offer eyebrow'), heading: brief.commercial?.primary_offer?.name || todo('flagship offer'), body: todo('approved scope and delivery model'), deliverables: [todo('deliverable one'), todo('deliverable two')], idealFor: [todo('fit condition')], investment: todo('approved investment framing'), media: image('p05') };
      case 'final_conversion': return { type: 'FinalCta', tone: 'inverse', pad: 'loose', eyebrow: todo('close eyebrow'), heading: todo('final decision headline'), body: todo('what happens after the action'), ctas: [primary], reassurance: [todo('reassurance one')] };
      default: return { type: 'RichText', tone: 'default', pad: 'default', markdown: todo(`content for ${section.role}`), dropCap: false };
    }
  });
}

const archetypeByPath = { '/': 'home', '/about/': 'about', '/work-with-me/': 'work-with-me', '/speaking/': 'speaking', '/contact/': 'contact' };
for (const page of plan.pages || []) {
  const fileName = page.path === '/' ? 'home' : page.path.slice(1, -1);
  writeJson(join(out, 'pages', `${fileName}.json`), {
    path: page.path, brand: slug,
    engine: { clientPack: slug, architecture: strategy.architecture, pagePlanVersion: 1, claimIds: [...new Set(page.sections.flatMap((section) => section.claim_ids || []))] },
    archetype: archetypeByPath[page.path] || 'generic',
    seo: { title: todo(`${page.page_name} title`), description: todo(`${page.page_name} meta description`), schemaType: page.path === '/' ? 'ProfilePage' : 'WebPage' },
    blocks: blocksFor(page),
  });
}

writeYaml(join(out, 'component-plan.yaml'), {
  engine: 'AURA Compiler', generated_at: new Date().toISOString(),
  architecture: strategy.architecture,
  root_composition: strategy.architecture === 'private-signal' ? 'PrivateSignalHome' : 'BlockRenderer',
  pages: (plan.pages || []).map((page) => ({ path: page.path, section_roles: page.sections.map((section) => section.role), component_strategy: page.path === '/' && strategy.architecture === 'private-signal' ? 'dedicated_composition' : 'typed_block_registry' })),
  note: 'Copy fields remain approval placeholders until drafted from approved evidence and reviewed.',
});

console.log(`Composed Astro content skeleton in ${out}`);
