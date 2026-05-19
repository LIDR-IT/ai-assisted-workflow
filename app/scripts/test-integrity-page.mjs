import { chromium } from 'playwright';

const URL = process.env.URL || 'http://localhost:5175/aramis/integrity';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleMessages = [];
const pageErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') {
    consoleMessages.push(`[${m.type()}] ${m.text().slice(0, 250)}`);
  }
});
page.on('pageerror', (e) => pageErrors.push(`pageerror: ${e.message.slice(0, 250)}`));

console.log(`→ Loading ${URL}`);
const resp = await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);

const h1 = await page.locator('h1, h2').first().textContent().catch(() => null);
const body = (await page.locator('body').textContent()) || '';

await page.screenshot({ path: './smoke-output/aramis-integrity.png', fullPage: false });

const fsErrors = [...consoleMessages, ...pageErrors].filter((m) => m.includes('fs') || m.includes('Module'));

console.log(`status: ${resp?.status()}`);
console.log(`title h1/h2: ${(h1 || '').slice(0, 100)}`);
console.log(`body length: ${body.length}c`);
console.log(`console errors+warnings: ${consoleMessages.length}`);
console.log(`page errors: ${pageErrors.length}`);
console.log(`fs/module errors specifically: ${fsErrors.length}`);
if (fsErrors.length > 0) {
  console.log('--- fs/module errors ---');
  fsErrors.forEach((e) => console.log(e));
}
if (pageErrors.length > 0) {
  console.log('--- page errors ---');
  pageErrors.slice(0, 5).forEach((e) => console.log(e));
}

await browser.close();
process.exit(fsErrors.length === 0 && pageErrors.length === 0 ? 0 : 1);
