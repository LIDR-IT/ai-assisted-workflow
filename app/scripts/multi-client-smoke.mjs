import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.SMOKE_BASE || 'http://localhost:5174';
const OUT = process.env.SMOKE_OUT || './smoke-output/multi-client';
fs.mkdirSync(OUT, { recursive: true });

const CLIENTS = ['base', 'docline', 'facephi', 'aramis'];
const PAGES = [
  '', // home
  'requisitos',
  'prd',
  'requisitos-funcionales',
  'sprint',
  'desarrollo',
  'testing',
  'seguridad',
  'despliegue',
  'propuesta',
  'help',
  'agents',
  'handoffs',
  'sitemap',
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const results = {};

for (const client of CLIENTS) {
  console.log(`\n━━━ Cliente: ${client} ━━━`);
  results[client] = { pages: {}, clientName: null, errors: 0, warnings: 0 };

  for (const path of PAGES) {
    const url = `${BASE}/${client}${path ? '/' + path : ''}`;
    const consoleErrors = [];
    const networkErrors = [];
    const onConsole = (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); };
    const onResp = (r) => { if (r.status() >= 400 && !r.url().includes('favicon')) networkErrors.push(`${r.status()} ${r.url().split('/').slice(-2).join('/')}`); };
    const onPageError = (e) => consoleErrors.push(`pageerror: ${e.message.slice(0, 200)}`);
    page.on('console', onConsole);
    page.on('response', onResp);
    page.on('pageerror', onPageError);

    let status, bodyLen, h1, pass;
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      status = resp?.status();
      await page.waitForTimeout(800); // small render delay
      const body = (await page.locator('body').textContent()) || '';
      bodyLen = body.length;
      h1 = await page.locator('h1, h2').first().textContent().catch(() => null);
      pass = status === 200 && bodyLen > 200 && consoleErrors.length === 0;
    } catch (e) {
      status = 'EXCEPTION';
      pass = false;
      consoleErrors.push(`navigation: ${e.message.slice(0, 200)}`);
    }

    page.off('console', onConsole);
    page.off('response', onResp);
    page.off('pageerror', onPageError);

    if (!path) {
      const sn = (await page.locator('body').textContent()) || '';
      const m = sn.match(/(FacePhi|Docline|Aramis|Generic|Base Client)/i);
      results[client].clientName = m ? m[0] : '?';
    }

    if (consoleErrors.length > 0) results[client].errors += consoleErrors.length;
    if (networkErrors.length > 0) results[client].warnings += networkErrors.length;

    results[client].pages[path || 'home'] = {
      url, status, bodyLen, h1: (h1 || '').slice(0, 80),
      consoleErrors: consoleErrors.slice(0, 3),
      networkErrors: networkErrors.slice(0, 3),
      pass,
    };
    const icon = pass ? '✅' : (status === 200 ? '⚠️ ' : '❌');
    console.log(`  ${icon} /${client}${path ? '/' + path : ''} → ${status} | ${bodyLen}c | err:${consoleErrors.length} netErr:${networkErrors.length}`);
  }

  // Screenshot home of each client
  await page.goto(`${BASE}/${client}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${client}-home.png`, fullPage: false });
}

await browser.close();

// Final report
fs.writeFileSync(`${OUT}/multi-client-report.json`, JSON.stringify(results, null, 2));

console.log('\n\n━━━━━━━━━━━━━ RESUMEN ━━━━━━━━━━━━━');
for (const c of CLIENTS) {
  const pages = Object.values(results[c].pages);
  const ok = pages.filter((p) => p.pass).length;
  const fail = pages.length - ok;
  console.log(`${c.padEnd(10)} | ${ok}/${pages.length} OK | ${results[c].errors} console errors | ${results[c].warnings} net 4xx/5xx | client name: ${results[c].clientName}`);
}

const totalPages = CLIENTS.length * PAGES.length;
const okPages = Object.values(results).flatMap((r) => Object.values(r.pages)).filter((p) => p.pass).length;
console.log(`\nTotal: ${okPages}/${totalPages} pages passed`);
process.exit(okPages === totalPages ? 0 : 1);
