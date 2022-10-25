import * as playwright from "playwright";

(async () => {
  const browser = await playwright.chromium.launch({
    ignoreHTTPSErrors: true,
    headless: true,
    devtools: true,
     args: [
      "--no-sandbox", // required to run within some containers
      "--disable-dev-shm-usage", // workaround for "Target closed" errors when capturing screenshots
      "--disable-gpu", // helps preven "Page crashed!" errors
      "--disable-setuid-sandbox", // ensures sandbox is not enabled
      "--disable-web-security", // enable accessing cross-domain iframe's
      "--disable-blink-features=AutomationControlled", // disables navigator.webdriver in chrome to avoid detection
      "--ignore-certificate-errors",
      "--allow-insecure-localhost",
    ],
  });

  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
    bypassCSP: true,
    javaScriptEnabled :true
  });
  
  const page = await context.newPage({ 
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
    bypassCSP: true,
    javaScriptEnabled :true
   });

  try {

    const response=  await page.goto(
      "https://www.motionindustries.com/products/sku/04879612",
    );


    console.log(`status is: ${response.status()}`);

    if (response) {
      const status = response.status();
      console.log(`the status is ${status}`);
      if (status === 400 || status === 401 || status === 402 || status === 403) {
          throw new ErrorCode(`Request returned status=${status}`, "BLOCKED");
      }
  }

    let security = await response.securityDetails();

    //console.log(`security is: ${security}`);

    await page.waitForTimeout(1000);
    //await page.screenshot({ path: `example2.png` });

    var loc = await page.locator(".d-inline.base-font.item-desc-text.mb-1h");

    var texto =await loc.allTextContents();
   console.log(`producto es ${texto}`);

    await browser.close();
  } catch (error) {
    console.error(error);
  }



})();