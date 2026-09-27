import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
const IDS = ['opening','chairman','leadership','departments','department','ecosystem','portals','contact'];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(3000);
for (const id of IDS) {
  const y = await p.evaluate((i) => { const el=document.getElementById(i); const top=el?el.getBoundingClientRect().top+scrollY:0; window.scrollTo({top, behavior:'instant'}); return Math.round(top); }, id);
  await p.waitForTimeout(1800);
  const info = await p.evaluate(() => ({ y: Math.round(scrollY), hud: document.querySelector('header p[aria-live]')?.textContent?.trim() }));
  writeFileSync(`/tmp/v2/${id}.png`, await p.screenshot());
  console.log(`${id.padEnd(13)} target=${String(y).padEnd(6)} actual=${String(info.y).padEnd(6)} hud=${info.hud}`);
}
await b.close();
