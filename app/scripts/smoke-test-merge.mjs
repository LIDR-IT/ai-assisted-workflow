import { chromium } from 'playwright';

const URL = process.env.SMOKE_URL || 'http://localhost:5174/';
const OUT_DIR = process.env.SMOKE_OUT || './smoke-output';

import fs from 'node:fs';
fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleErrors = [];
const networkErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('response', (r) => { if (r.status() >= 400) networkErrors.push(`${r.status()} ${r.url()}`); });
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

console.log(`→ Navigating to ${URL}`);
const resp = await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
console.log(`  status: ${resp?.status()}`);

const title = await page.title();
const h1 = await page.locator('h1').first().textContent().catch(() => null);
const navLinks = await page.locator('a, button').evaluateAll((els) =>
  els.slice(0, 30).map((e) => (e.textContent || '').trim()).filter((t) => t.length > 0 && t.length < 60),
);

await page.screenshot({ path: `${OUT_DIR}/home.png`, fullPage: false });
console.log(`  screenshot: ${OUT_DIR}/home.png`);

const bodyText = (await page.locator('body').textContent()) || '';

const report = {
  url: URL,
  httpStatus: resp?.status(),
  title,
  h1,
  bodyLengthChars: bodyText.length,
  bodySnippet: bodyText.slice(0, 200).replace(/\s+/g, ' ').trim(),
  visibleClickableLabels: [...new Set(navLinks)].slice(0, 20),
  consoleErrors,
  networkErrors,
  pass: !!resp && resp.status() === 200 && bodyText.length > 100,
};

fs.writeFileSync(`${OUT_DIR}/report.json`, JSON.stringify(report, null, 2));
console.log('\n=== SMOKE TEST REPORT ===');
console.log(JSON.stringify(report, null, 2));

await browser.close();
process.exit(report.pass && consoleErrors.length === 0 ? 0 : 1);
