const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 320, height: 568 } }); // Very small phone
  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000); 
  await page.screenshot({ path: 'mobile-small.png' });
  await browser.close();
})();
