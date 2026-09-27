import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1440, 1280, 1024]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 45000 });
  await p.waitForTimeout(2500);
  const d = await p.evaluate(() => {
    const bar = document.querySelector('header > div');
    const doors = [...document.querySelectorAll('header a[aria-label^="Enter "]')];
    const r = bar.getBoundingClientRect();
    const kids = [...bar.children].map(c => { const b2=c.getBoundingClientRect(); return {x:Math.round(b2.x), w:Math.round(b2.width)}; });
    let overflow = false;
    for (let i=1;i<kids.length;i++) if (kids[i].x < kids[i-1].x + kids[i-1].w - 1) overflow = true;
    return { barH: Math.round(r.height), doors: doors.length, doorNames: doors.map(a=>a.getAttribute('aria-label').slice(5,18)), overflow, kids };
  });
  console.log(`${w}px  barH=${d.barH}  doors=${d.doors} ${JSON.stringify(d.doorNames)}  overflow=${d.overflow}`);
  await p.close();
}
await b.close();
