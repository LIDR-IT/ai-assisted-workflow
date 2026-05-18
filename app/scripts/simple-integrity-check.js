import { chromium } from 'playwright';

async function quickIntegrityCheck() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🎯 Navegando directamente a /integrity...');
    await page.goto('http://localhost:5176/integrity', { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Esperar un poco para que React renderice
    await page.waitForTimeout(3000);

    // Buscar contenido de tests
    const pageText = await page.evaluate(() => document.body.textContent || '');

    console.log('📏 Tamaño del contenido:', pageText.length);

    // Buscar T25 y T29 específicamente
    const hasT25 = pageText.includes('T25');
    const hasT29 = pageText.includes('T29');

    console.log('🔍 T25 encontrado:', hasT25 ? '✅' : '❌');
    console.log('🔍 T29 encontrado:', hasT29 ? '✅' : '❌');

    if (hasT25) {
      const t25Context = pageText.substring(pageText.indexOf('T25'), pageText.indexOf('T25') + 100);
      console.log('📝 T25:', t25Context);
    }

    if (hasT29) {
      const t29Context = pageText.substring(pageText.indexOf('T29'), pageText.indexOf('T29') + 100);
      console.log('📝 T29:', t29Context);
    }

    // Buscar PASS y FAIL
    const passMatches = pageText.match(/PASS/g) || [];
    const failMatches = pageText.match(/FAIL/g) || [];

    console.log('\n📊 RESUMEN:');
    console.log(`✅ PASS encontrados: ${passMatches.length}`);
    console.log(`❌ FAIL encontrados: ${failMatches.length}`);

    if (failMatches.length === 0 && passMatches.length > 0) {
      console.log('\n🎉 ¡TODOS LOS TESTS PARECEN ESTAR PASANDO!');
    } else if (failMatches.length > 0) {
      console.log(`\n⚠️  HAY ${failMatches.length} TESTS FALLANDO`);
    } else {
      console.log('\n❓ No se encontraron resultados de tests claros');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

quickIntegrityCheck();