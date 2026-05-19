import { chromium } from 'playwright';

const URL = process.env.URL || 'http://localhost:5175/aramis/integrity';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message.slice(0, 200)}`));

console.log(`→ ${URL}`);
await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);

// Click "Ejecutar todos" or similar to run all tests
const runAllBtn = page.locator('button').filter({ hasText: /ejecutar todos|run all|ejecutar/i }).first();
if (await runAllBtn.count() > 0) {
  console.log('→ Clicking run-all button...');
  await runAllBtn.click();
  await page.waitForTimeout(3000);
}

// Capture test result summary (look for ✅ and ❌ counts)
const body = await page.locator('body').textContent() || '';
const passMatches = body.match(/✅/g) || [];
const failMatches = body.match(/❌/g) || [];

// Get T1/T2 results specifically
const t1Section = await page.locator('text=/T1.*HelpCenter/i').first().locator('..').textContent().catch(() => '');
const t2Section = await page.locator('text=/T2.*SitemapView/i').first().locator('..').textContent().catch(() => '');

await page.screenshot({ path: './smoke-output/aramis-integrity-after-fix.png', fullPage: false });

console.log(`Pass markers (✅): ${passMatches.length}`);
console.log(`Fail markers (❌): ${failMatches.length}`);
console.log(`Console errors: ${consoleErrors.length}`);
console.log('--- T1 region:');
console.log(t1Section.slice(0, 300));
console.log('--- T2 region:');
console.log(t2Section.slice(0, 300));

await browser.close();
