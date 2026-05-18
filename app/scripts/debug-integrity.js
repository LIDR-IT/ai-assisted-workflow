import { chromium } from 'playwright';

async function debugIntegrity() {
  const browser = await chromium.launch({ headless: false }); // Show browser for debugging
  const page = await browser.newPage();

  try {
    console.log('🚀 Navegando a la página principal...');
    await page.goto('http://localhost:5176/', { waitUntil: 'networkidle', timeout: 15000 });

    console.log('✅ Página principal cargada');

    // Esperar a que React cargue
    await page.waitForTimeout(3000);

    // Verificar si hay un menú de navegación
    const navText = await page.evaluate(() => {
      const nav = document.querySelector('nav, .nav, .sidebar, .menu');
      return nav ? nav.textContent : 'No navigation found';
    });

    console.log('🧭 Navegación encontrada:', navText.substring(0, 200));

    // Buscar enlace a integrity
    const hasIntegrityLink = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      return links.some(link =>
        link.textContent && link.textContent.toLowerCase().includes('integrity')
      );
    });

    console.log('🔗 ¿Hay enlace a integrity?:', hasIntegrityLink);

    if (hasIntegrityLink) {
      // Hacer clic en el enlace de integrity
      await page.click('text=Integrity Tests');
      await page.waitForTimeout(2000);

      console.log('🎯 Navegado a integrity tests');

      const pageText = await page.evaluate(() => document.body.textContent || '');

      // Buscar T25 y T29
      console.log('🔍 Buscando T25...');
      if (pageText.includes('T25')) {
        const t25Index = pageText.indexOf('T25');
        const t25Context = pageText.substring(t25Index, t25Index + 300);
        console.log('✅ T25 encontrado:', t25Context);
      } else {
        console.log('❌ T25 no encontrado');
      }

      console.log('🔍 Buscando T29...');
      if (pageText.includes('T29')) {
        const t29Index = pageText.indexOf('T29');
        const t29Context = pageText.substring(t29Index, t29Index + 300);
        console.log('✅ T29 encontrado:', t29Context);
      } else {
        console.log('❌ T29 no encontrado');
      }

      // Contar PASS y FAIL
      const passCount = (pageText.match(/PASS/g) || []).length;
      const failCount = (pageText.match(/FAIL/g) || []).length;

      console.log(`\n📊 RESUMEN:`);
      console.log(`✅ PASS: ${passCount}`);
      console.log(`❌ FAIL: ${failCount}`);

    } else {
      console.log('❌ No se encontró enlace a integrity');
      console.log('📝 Contenido de la página:');
      const pageText = await page.evaluate(() => document.body.textContent || '');
      console.log(pageText.substring(0, 500));
    }

    // Esperar para inspección manual
    console.log('⏳ Esperando 5 segundos para inspección...');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugIntegrity();