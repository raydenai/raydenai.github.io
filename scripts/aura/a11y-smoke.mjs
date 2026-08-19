import { chromium } from 'playwright';
import { parseArgs } from './lib.mjs';

const args = parseArgs();
const positionalUrl = process.argv.slice(2).find((arg) => arg !== '--' && !arg.startsWith('--'));
const baseUrl = args.url || positionalUrl || 'http://127.0.0.1:4322';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await context.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
const response = await page.goto(baseUrl, { waitUntil: 'networkidle' });
const result = { route: '/', status: response?.status() ?? 0, checks: {}, errors };

const toggle = page.locator('.ahd__toggle');
if (await toggle.count() !== 1) throw new Error('Expected exactly one mobile menu toggle on the primary reference route.');
const box = await toggle.boundingBox();
result.checks.toggle_44px = Boolean(box && box.width >= 44 && box.height >= 44);
await toggle.click();
await page.waitForTimeout(80);
result.checks.drawer_open = await page.locator('#ahd-drawer').evaluate((drawer) => !drawer.hidden);
result.checks.background_inert = await page.locator('main').evaluate((main) => main.hasAttribute('inert'));
result.checks.focus_moved_inside_drawer = await page.locator('#ahd-drawer').evaluate((drawer) => drawer.contains(document.activeElement));

await page.keyboard.press('Shift+Tab');
result.checks.shift_tab_wraps = await page.locator('#ahd-drawer').evaluate((drawer) => drawer.contains(document.activeElement));
await page.keyboard.press('Tab');
result.checks.tab_wraps = await page.locator('#ahd-drawer').evaluate((drawer) => drawer.contains(document.activeElement));
await page.keyboard.press('Escape');
await page.waitForTimeout(50);
result.checks.escape_closes = await page.locator('#ahd-drawer').evaluate((drawer) => drawer.hidden);
result.checks.focus_restored = await toggle.evaluate((element) => document.activeElement === element);
result.checks.no_console_errors = errors.length === 0;

await browser.close();
const failures = Object.entries(result.checks).filter(([, value]) => value !== true).map(([key]) => key);
console.log(JSON.stringify(result, null, 2));
if (failures.length) {
  console.error(`Accessibility smoke test failed: ${failures.join(', ')}`);
  process.exit(1);
}
