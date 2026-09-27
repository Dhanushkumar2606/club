import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
const IDS = ['opening','chairman','leadership','departments','department','ecosystem','portals','contact'];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(3000);
for (const id of IDS) {
  await p.evaluate((i) => document.getElementById(i)?.scrollIntoView({behavior:'instant', block:'start'}), id);
  await p.waitForTimeout(1300);
  const items = await p.evaluate(() => {
    const res = [];
    for (const el of document.querySelectorAll('p,span,h1,h2,h3,h4,a,li')) {
      if (el.children.length) continue;
      const t = (el.textContent || '').trim();
      if (t.length < 3 || t.length > 70) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 6 || r.bottom < 62 || r.top > 858 || r.right < 0 || r.left > 1440) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.5) continue;
      // occlusion: the element (or a descendant) must be what's actually hit
      const cx = r.x + r.width/2, cy = r.y + r.height/2;
      const hit = document.elementFromPoint(cx, cy);
      if (!hit || !(el === hit || el.contains(hit) || hit.contains(el))) continue;
      res.push({ t: t.slice(0,46), color: cs.color, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
    }
    return res;
  });
  const shot = await p.screenshot();
  writeFileSync(`/tmp/bands/audit-${id}.png`, shot);
  writeFileSync(`/tmp/bands/audit-${id}.json`, JSON.stringify(items));
}
console.log('audited');
await b.close();
