import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(2500);
console.log('EYEBROW:', JSON.stringify(await p.evaluate(() =>
  [...document.querySelectorAll('#opening p, #opening span')].slice(0,8).map(n => ({t:n.textContent.slice(0,44), c:getComputedStyle(n).color}))
), null, 1));
await p.evaluate(() => window.scrollTo(0, 4000));
await p.waitForTimeout(2500);
console.log('AT(77,300):', JSON.stringify(await p.evaluate(() =>
  document.elementsFromPoint(77, 300).slice(0,5).map(e => ({tag:e.tagName, cls:String(e.className).slice(0,70), bg:getComputedStyle(e).backgroundColor, w:Math.round(e.getBoundingClientRect().width), x:Math.round(e.getBoundingClientRect().x)}))
), null, 1));
await b.close();
