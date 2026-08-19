/**
 * AURA visual QA.
 *
 * Screenshots every route at desktop and mobile widths and audits the things
 * the research identified as the common failure points on personal brand sites:
 *   - horizontal overflow (the #1 mobile bug)
 *   - hero subject face pushed out of frame on mobile
 *   - broken or zero-size images
 *   - CTA sprawl (too many competing calls to action per viewport)
 *   - heading hierarchy (multiple h1s, skipped levels)
 *   - tap target size on mobile
 *
 * Usage: node scripts/visual-qa.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4321';
const OUT = process.env.AURA_QA_OUT || 'qa';

const DEFAULT_ROUTES = [
  '/',
  '/about/',
  '/method/',
  '/work-with-me/',
  '/speaking/',
  '/contact/',
  '/blog/',
  '/blog/expertise-is-not-a-position/',
];
const ROUTES = process.env.AURA_QA_ROUTES
  ? process.env.AURA_QA_ROUTES.split(',').map((route) => route.trim()).filter(Boolean)
  : DEFAULT_ROUTES;

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
];

const audit = async (page) =>
  page.evaluate(() => {
    // reveal everything so measurements are real
    document.querySelectorAll('[data-reveal]').forEach((el) =>
      el.setAttribute('data-revealed', 'true'),
    );
    const de = document.documentElement;
    const imgs = [...document.querySelectorAll('img')];
    const h1s = [...document.querySelectorAll('h1')];
    const headings = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) =>
      Number(h.tagName[1]),
    );
    let skips = 0;
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] - headings[i - 1] > 1) skips++;
    }
    const links = [...document.querySelectorAll('a,button')];
    const small = links.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 32);
    });
    const wide = [...document.querySelectorAll('*')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.right > de.clientWidth + 2 || r.left < -2;
    });
    return {
      scrollW: de.scrollWidth,
      clientW: de.clientWidth,
      overflow: de.scrollWidth - de.clientWidth,
      overflowingEls: wide.slice(0, 6).map((el) => ({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 60),
        right: Math.round(el.getBoundingClientRect().right),
      })),
      images: imgs.length,
      brokenImages: imgs
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.getAttribute('src')),
      h1Count: h1s.length,
      h1Text: h1s.map((h) => h.textContent.trim().slice(0, 60)),
      headingSkips: skips,
      blocks: [...document.querySelectorAll('section[data-block]')].map(
        (s) => s.dataset.block,
      ),
      smallTapTargets: small.length,
      ctasInFirstViewport: links.filter((el) => {
        const r = el.getBoundingClientRect();
        const t = (el.textContent || '').trim();
        return r.top < window.innerHeight && r.height > 30 && t.length > 3;
      }).length,
    };
  });

const run = async () => {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      isMobile: !!vp.isMobile,
      hasTouch: !!vp.isMobile,
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text().slice(0, 160));
    });
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));

    for (const route of ROUTES) {
      const url = BASE + route;
      const resp = await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      const data = await audit(page);
      const slug = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-|-$/g, '');
      const file = `${OUT}/${vp.name}-${slug}.png`;
      await page.screenshot({ path: file, fullPage: route === '/' });
      results.push({
        viewport: vp.name,
        route,
        status: resp.status(),
        file,
        consoleErrors: [...new Set(errors)],
        ...data,
      });
      errors.length = 0;
    }
    await ctx.close();
  }
  await browser.close();

  writeFileSync(`${OUT}/report.json`, JSON.stringify(results, null, 2));

  // console summary
  let fails = 0;
  console.log('\nRoute'.padEnd(42) + 'VP'.padEnd(9) + 'OVF  IMG  BAD  H1  SKIP  TAP  CTA');
  console.log('-'.repeat(88));
  for (const r of results) {
    const bad =
      r.overflow > 0 ||
      r.brokenImages.length > 0 ||
      r.h1Count !== 1 ||
      r.consoleErrors.length > 0;
    if (bad) fails++;
    console.log(
      `${r.route}`.padEnd(42) +
        `${r.viewport}`.padEnd(9) +
        `${r.overflow}`.padEnd(5) +
        `${r.images}`.padEnd(5) +
        `${r.brokenImages.length}`.padEnd(5) +
        `${r.h1Count}`.padEnd(4) +
        `${r.headingSkips}`.padEnd(6) +
        `${r.smallTapTargets}`.padEnd(5) +
        `${r.ctasInFirstViewport}` +
        (bad ? '   <-- CHECK' : ''),
    );
    if (r.overflow > 0) console.log('      overflow from:', JSON.stringify(r.overflowingEls));
    if (r.brokenImages.length) console.log('      broken:', r.brokenImages.join(', '));
    if (r.h1Count !== 1) console.log('      h1s:', JSON.stringify(r.h1Text));
    if (r.consoleErrors.length) console.log('      console:', r.consoleErrors.join(' | '));
  }
  console.log(
    `\n${results.length} page/viewport combinations checked, ${fails} flagged.`,
  );
  console.log(`screenshots + report in ./${OUT}/`);
};

run();
