const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext(devices['iPhone 13']);
  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000); // let animations run
  await page.screenshot({ path: 'mobile.png' });
  await browser.close();
  console.log('Saved to mobile.png');
})();
