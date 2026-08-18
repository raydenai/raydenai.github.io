/**
 * AURA new-client scaffolder
 *
 * Creates a brand file and the six page JSON files required for an authority
 * site. It does not generate strategy or invent proof; its placeholders make
 * missing discovery answers impossible to overlook.
 *
 * Usage:
 *   pnpm new:client -- --slug jane-doe --name "Jane Doe" --title "Leadership Advisor" \
 *     --theme obsidian-gold --archetype personal-authority-hub
 *
 * Required: --slug, --name, --title
 * Optional: --theme, --archetype, --out, --force
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
function arg(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}
const slug = arg('--slug');
const name = arg('--name');
const title = arg('--title');
const theme = arg('--theme', 'obsidian-gold');
const archetype = arg('--archetype', 'personal-authority-hub');
const out = arg('--out', `clients/${slug}`);
const force = args.includes('--force');
const validThemes = ['obsidian-gold', 'editorial-ivory', 'institutional-navy', 'signal-cyan', 'insurgent-red'];
const validArchetypes = ['personal-authority-hub', 'firm-with-figurehead', 'coach-transformation', 'single-offer-funnel'];

if (!slug || !name || !title) {
  console.error('Usage: pnpm new:client -- --slug <kebab-case> --name "Full Name" --title "Positioning title" [--theme <theme>] [--archetype <archetype>] [--out <directory>] [--force]');
  process.exit(1);
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('--slug must be lowercase kebab-case.'); process.exit(1);
}
if (!validThemes.includes(theme)) { console.error(`--theme must be one of: ${validThemes.join(', ')}`); process.exit(1); }
if (!validArchetypes.includes(archetype)) { console.error(`--archetype must be one of: ${validArchetypes.join(', ')}`); process.exit(1); }

/* The system demo remains intact. The CLI creates a portable content pack that
   can be moved into a fresh clone’s src/content directory after the demo
   content is removed, or reviewed independently before integration. */
const contentRoot = join(out, 'src/content');
const brandPath = join(contentRoot, 'brand', `${slug}.json`);
const pagesDir = join(contentRoot, 'pages');
if ((existsSync(brandPath) || existsSync(pagesDir)) && !force) {
  console.error(`Client '${slug}' already exists. Use --force only if you deliberately want to overwrite files.`);
  process.exit(1);
}
mkdirSync(join(contentRoot, 'brand'), { recursive: true });
mkdirSync(pagesDir, { recursive: true });

const todo = (label) => `[DISCOVERY REQUIRED: ${label}]`;
const image = (role) => ({ src: `/images/${slug}/${role}.webp`, alt: todo(`descriptive alt text for ${role}`), width: 1920, height: 1280 });
const cta = { label: todo('primary CTA label'), href: '/contact/', intent: 'primary', event: 'primary_cta_click' };
const form = { action: '#', fields: ['firstName', 'email'], submitLabel: todo('submit label'), consentNote: todo('consent copy') };

const brand = {
  name, title, tagline: todo('one-line category position'), archetype, theme,
  positioning: {
    audience: todo('a precise primary audience'),
    promise: todo('observable transformation'),
    differentiator: todo('why this person is specifically credible'),
    methodName: todo('named method'),
    enemy: todo('status quo or bad alternative'),
  },
  contact: { email: todo('contact email'), location: todo('city / region'), bookingUrl: todo('calendar URL') },
  social: [],
  conversion: {
    primaryGoal: 'book-call', primaryCta: cta,
    secondaryCta: { label: todo('secondary CTA label'), href: '/method/', intent: 'secondary' },
    leadMagnet: { name: todo('lead-magnet name'), type: 'audit', promise: todo('lead-magnet promise'), formAction: '#' },
  },
  proof: { stats: [], mediaLogos: [], clientLogos: [], testimonials: [], awards: [] },
  assets: {
    portrait: { ...image('portrait-hero'), src: `/images/${slug}/portrait-hero.png`, width: 1200, height: 1500 },
    portraitAlt: image('portrait-story'),
    ogImage: image('og-image'),
  },
  nav: [
    { label: 'About', href: '/about/', children: [] }, { label: 'The Method', href: '/method/', children: [] },
    { label: 'Work With Me', href: '/work-with-me/', children: [] }, { label: 'Speaking', href: '/speaking/', children: [] },
    { label: 'Insights', href: '/blog/', children: [] },
  ],
  footerNav: [], legal: { entity: name, links: [] }, integrations: {},
};

const page = (path, archetypeName, seo, blocks) => ({ path, brand: slug, archetype: archetypeName, seo, blocks });
const home = page('/', 'home', {
  title: `${name} | ${title}`, description: todo('155-character homepage meta description'), schemaType: 'ProfilePage',
}, [
  {
    type: 'HeroSplitPortrait', tone: 'inverse', pad: 'loose', eyebrow: title,
    heading: todo('specific, tension-filled hero promise'), mark: { word: todo('one emphasized word'), style: 'accent' },
    body: todo('2-3 sentences: audience, problem, believable future state'), ctas: [cta, brand.conversion.secondaryCta],
    portrait: brand.assets.portrait, portraitTreatment: 'cutout', mediaSide: 'right', badges: [todo('credibility badge')], backdrop: 'both',
  },
  { type: 'LogoStrip', tone: 'raised', pad: 'tight', eyebrow: todo('proof label'), logos: [{ src: `/images/${slug}/logos/placeholder.svg`, alt: todo('earned media or client name'), width: 120 }], grayscale: true },
  { type: 'EmpathyQuoteWall', tone: 'default', pad: 'loose', eyebrow: todo('problem eyebrow'), heading: todo('things this audience actually says'), quotes: [todo('verbatim audience quote 1'), todo('verbatim audience quote 2'), todo('verbatim audience quote 3')], reaction: todo('reframe the real problem') },
  { type: 'ProblemAgitation', tone: 'inverse', pad: 'loose', eyebrow: todo('cost eyebrow'), heading: todo('the quiet cost of the status quo'), body: todo('explain material consequences without fear-mongering'), painPoints: [todo('cost 1'), todo('cost 2'), todo('cost 3')], media: image('working-candid') },
  { type: 'CredibilityBar', tone: 'accent', pad: 'default', stats: [{ value: todo('number'), label: todo('specific proof label') }, { value: todo('number'), label: todo('specific proof label') }, { value: todo('number'), label: todo('specific proof label') }] },
  { type: 'MethodologyPillars', tone: 'default', pad: 'loose', eyebrow: todo('method eyebrow'), heading: todo('named method headline'), methodName: todo('method name'), pillars: [{ name: todo('pillar 1'), summary: todo('what it solves') }, { name: todo('pillar 2'), summary: todo('what it solves') }, { name: todo('pillar 3'), summary: todo('what it solves') }] },
  { type: 'ResultsGrid', tone: 'raised', pad: 'loose', eyebrow: todo('outcomes eyebrow'), heading: todo('what changes in numbers'), results: [{ client: todo('client / industry'), headline: todo('specific outcome narrative'), before: todo('before'), after: todo('after'), metric: todo('top-line metric') }] },
  { type: 'TestimonialGrid', tone: 'default', pad: 'loose', eyebrow: todo('testimonial eyebrow'), heading: todo('credible client words'), testimonials: [{ quote: todo('verbatim testimonial with a concrete outcome'), author: todo('name'), role: todo('role'), company: todo('company'), result: todo('result') }], layout: 'grid', columns: 3 },
  { type: 'OriginStory', tone: 'inverse', pad: 'loose', eyebrow: todo('origin eyebrow'), heading: todo('why I do this work'), excerpt: todo('the short origin story and pivotal moment'), portrait: image('story-environmental'), ctas: [{ label: 'Read the full story', href: '/about/', intent: 'secondary' }] },
  { type: 'LeadMagnet', id: 'audit', tone: 'raised', pad: 'loose', eyebrow: todo('lead-magnet eyebrow'), heading: todo('specific free diagnostic / toolkit'), magnetName: brand.conversion.leadMagnet.name, body: brand.conversion.leadMagnet.promise, benefits: [todo('benefit 1'), todo('benefit 2'), todo('benefit 3')], mockup: image('leadmagnet'), form },
  { type: 'FaqAccordion', tone: 'default', pad: 'loose', eyebrow: todo('FAQ eyebrow'), heading: todo('the questions worth asking'), faqs: [{ question: todo('question 1'), answer: todo('direct answer 1') }, { question: todo('question 2'), answer: todo('direct answer 2') }, { question: todo('question 3'), answer: todo('direct answer 3') }] },
  { type: 'FinalCta', tone: 'inverse', pad: 'loose', eyebrow: todo('closing eyebrow'), heading: todo('closing decision headline'), body: todo('what happens next and why this is low-risk'), ctas: [cta], reassurance: [todo('reassurance 1'), todo('reassurance 2')] },
]);

const about = page('/about/', 'about', { title: `About | ${name}`, description: todo('About page meta description'), schemaType: 'AboutPage' }, [
  { type: 'HeroCenteredStatement', tone: 'inverse', pad: 'loose', eyebrow: 'About', heading: todo('the belief that drives this work'), body: todo('one-paragraph biography positioning') },
  { type: 'CrucibleMoment', tone: 'default', pad: 'loose', year: todo('year'), eyebrow: todo('turning point'), heading: todo('the moment the method began'), moment: todo('one vivid, specific scene'), aftermath: todo('what changed afterward'), background: image('detail-texture') },
  { type: 'OriginStory', tone: 'raised', pad: 'loose', heading: todo('the fuller story'), excerpt: todo('credible career story'), portrait: image('story-environmental') },
  { type: 'BookShowcase', tone: 'default', pad: 'loose', heading: todo('book or authority artifact'), books: [{ title: todo('title'), description: todo('what this artifact helps the reader do'), cover: { ...image('book-cover'), src: `/images/${slug}/book-cover.png`, width: 900, height: 900 } }] },
  { type: 'FinalCta', tone: 'inverse', pad: 'loose', heading: todo('related next step'), ctas: [cta] },
]);

const method = page('/method/', 'generic', { title: `The Method | ${name}`, description: todo('Method page meta description'), schemaType: 'WebPage' }, [
  { type: 'HeroCenteredStatement', tone: 'inverse', pad: 'loose', eyebrow: todo('method name'), heading: todo('one-sentence description of the mechanism'), body: todo('why it works and why alternatives fail') },
  { type: 'NumberedFramework', tone: 'default', pad: 'loose', heading: todo('the steps in order'), methodName: todo('method name'), steps: [{ title: todo('step 1'), description: todo('output and reasoning') }, { title: todo('step 2'), description: todo('output and reasoning') }, { title: todo('step 3'), description: todo('output and reasoning') }] },
  { type: 'ProcessTimeline', tone: 'raised', pad: 'loose', heading: todo('what working together looks like'), steps: [{ label: '01', title: todo('phase 1'), description: todo('delivery'), duration: todo('duration') }, { label: '02', title: todo('phase 2'), description: todo('delivery'), duration: todo('duration') }] },
  { type: 'FinalCta', tone: 'inverse', pad: 'loose', heading: todo('method page close'), ctas: [cta] },
]);

const work = page('/work-with-me/', 'work-with-me', { title: `Work With Me | ${name}`, description: todo('Offer page meta description'), schemaType: 'Service' }, [
  { type: 'HeroCenteredStatement', tone: 'inverse', pad: 'loose', eyebrow: 'Work with me', heading: todo('who this is for and the outcome'), body: todo('one decisive qualification paragraph'), ctas: [cta] },
  { type: 'HighTicketOffer', tone: 'default', pad: 'loose', heading: todo('flagship engagement'), body: todo('position the offer'), deliverables: [todo('deliverable 1'), todo('deliverable 2'), todo('deliverable 3')], idealFor: [todo('ideal client trait')], investment: todo('investment framing'), media: image('working-candid') },
  { type: 'ResultsGrid', tone: 'raised', pad: 'loose', heading: todo('case outcomes'), results: [{ client: todo('client'), headline: todo('outcome'), before: todo('before'), after: todo('after'), metric: todo('metric') }] },
  { type: 'TestimonialGrid', tone: 'default', pad: 'loose', heading: todo('client evidence'), testimonials: [{ quote: todo('testimonial'), author: todo('name'), company: todo('company'), result: todo('result') }], layout: 'grid', columns: 3 },
  { type: 'ApplicationForm', tone: 'inverse', pad: 'loose', heading: todo('apply / book a call'), form: { action: '#', fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'context', label: todo('qualification question'), type: 'textarea', required: true }], submitLabel: todo('submit label') }, reassurance: [todo('what happens after submission')] },
]);

const speaking = page('/speaking/', 'speaking', { title: `Speaking | ${name}`, description: todo('Speaking page meta description'), schemaType: 'Service' }, [
  { type: 'HeroVideoOverlay', tone: 'inverse', pad: 'loose', eyebrow: 'Speaking', heading: todo('the keynote outcome'), body: todo('event planner value proposition'), background: image('stage-wide'), videoUrl: todo('speaker reel URL'), playLabel: 'Watch the speaker reel', ctas: [cta] },
  { type: 'SpeakingTopics', tone: 'default', pad: 'loose', heading: todo('keynotes and workshops'), topics: [{ title: todo('keynote title'), audience: todo('audience'), description: todo('topic description'), takeaways: [todo('takeaway 1'), todo('takeaway 2')] }], eventLogos: [] },
  { type: 'TestimonialGrid', tone: 'raised', pad: 'loose', heading: todo('event organizer feedback'), testimonials: [{ quote: todo('testimonial'), author: todo('name'), role: todo('role'), result: todo('result') }], layout: 'grid', columns: 3 },
  { type: 'FinalCta', tone: 'inverse', pad: 'loose', heading: todo('bring this to your room'), ctas: [cta] },
]);

const contact = page('/contact/', 'contact', { title: `Contact | ${name}`, description: todo('Contact page meta description'), schemaType: 'ContactPage' }, [
  { type: 'ContactSplit', tone: 'default', pad: 'loose', eyebrow: 'Get in touch', heading: todo('simple, human contact headline'), body: todo('what will happen when they reach out'), responseTime: todo('specific reply window'), portrait: image('seated-editorial'), channels: [{ label: 'Email', value: todo('email'), href: 'mailto:hello@example.com' }], form: { action: '#', fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'message', label: 'What would be useful?', type: 'textarea', required: true }], submitLabel: todo('send label') } },
]);

function write(path, data) {
  if (existsSync(path) && !force) return;
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  console.log(`created ${path}`);
}
write(brandPath, brand);
write(join(pagesDir, 'home.json'), home);
write(join(pagesDir, 'about.json'), about);
write(join(pagesDir, 'method.json'), method);
write(join(pagesDir, 'work-with-me.json'), work);
write(join(pagesDir, 'speaking.json'), speaking);
write(join(pagesDir, 'contact.json'), contact);

console.log(`\nAURA client '${slug}' content pack scaffolded at ${out}/.`);
console.log('Next: complete prompts/discovery-questionnaire.md, replace every [DISCOVERY REQUIRED: ...] value, add the 8-shot photo library, then move this pack into a fresh AURA clone\'s src/content/ directory (after removing demo content). Run pnpm lint:blocks && pnpm verify:images && pnpm build.');
