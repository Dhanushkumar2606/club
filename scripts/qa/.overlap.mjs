import { chromium } from 'playwright';
const IDS = ['opening','chairman','leadership','departments','department','ecosystem','portals','contact'];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(3000);
let total = 0;
for (const id of IDS) {
  await p.evaluate((i) => { const e=document.getElementById(i); window.scrollTo({top:e.getBoundingClientRect().top+scrollY, behavior:'instant'}); }, id);
  await p.waitForTimeout(1600);
  const hits = await p.evaluate(() => {
    // fixed HUD furniture
    const furniture = [...document.querySelectorAll('header, nav[aria-label="Section spine"], [class*="fixed bottom-6"]')]
      .filter(e => { const c=getComputedStyle(e); return c.display!=='none' && +c.opacity>0.05; })
      .map(e => ({ name: e.tagName+(e.getAttribute('aria-label')||'').slice(0,18), r: e.getBoundingClientRect() }));
    const out = [];
    for (const el of document.querySelectorAll('main p, main h1, main h2, main h3, main span, main a')) {
      if (el.children.length) continue;
      const t=(el.textContent||'').trim(); if (t.length<4) continue;
      const r=el.getBoundingClientRect();
      if (r.bottom<0 || r.top>innerHeight || r.right<0 || r.left>innerWidth) continue;
      const cx=r.x+r.width/2, cy=r.y+r.height/2;
      if (!document.elementFromPoint(cx,cy)) continue;
      for (const f of furniture) {
        if (r.left < f.r.right && r.right > f.r.left && r.top < f.r.bottom && r.bottom > f.r.top) {
          out.push(`${f.name} :: ${t.slice(0,40)}`);
        }
      }
    }
    return [...new Set(out)];
  });
  if (hits.length) { total += hits.length; console.log(`${id}:`); hits.forEach(h=>console.log('   OVERLAP', h)); }
}
console.log(total === 0 ? '\nNO FIXED-CONTENT OVERLAPS' : `\n${total} overlaps`);
await b.close();
