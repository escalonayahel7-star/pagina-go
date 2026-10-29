// Exporta el carrusel: un PNG 1080×1350 por lámina y un PDF con todas.
// Uso: node render.js   (requiere playwright)
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const dir = __dirname;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(dir, 'carrusel.html'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const slides = await page.$$('section.lamina');
  for (let i = 0; i < slides.length; i++) {
    const name = `lamina-${String(i + 1).padStart(2, '0')}.png`;
    await slides[i].screenshot({ path: path.join(dir, 'png', name) });
    console.log(name);
  }
  await page.pdf({ path: path.join(dir, 'telas-para-el-frio.pdf'), width: '1080px', height: '1350px', printBackground: true });
  console.log('telas-para-el-frio.pdf');
  await browser.close();
})();
