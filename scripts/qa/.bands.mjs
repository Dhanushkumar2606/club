import { chromium } from 'playwright';
const IDS = ['opening','chairman','leadership','departments','department','ecosystem','portals','contact'];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(3000);
for (const id of IDS) {
  await p.evaluate((i) => document.getElementById(i)?.scrollIntoView({behavior:'instant', block:'start'}), id);
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `/tmp/bands/${id}.png` });
}
await b.close();
console.log('done');
