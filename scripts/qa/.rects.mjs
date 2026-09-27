import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(3000);
for (const id of ['leadership','departments','department','contact']) {
  await p.evaluate((i) => { const e=document.getElementById(i); window.scrollTo({top:e.getBoundingClientRect().top+scrollY, behavior:'instant'}); }, id);
  await p.waitForTimeout(1500);
  const d = await p.evaluate(() => {
    const chip = document.querySelector('[class*="fixed bottom-6"]');
    const cr = chip ? chip.getBoundingClientRect() : null;
    const chipVis = chip ? getComputedStyle(chip).opacity : '0';
    const spine = document.querySelector('nav[aria-label="Section spine"]');
    const sr = spine ? spine.getBoundingClientRect() : null;
    const inter = (a, b2) => {
      if (!a || !b2) return 0;
      const w = Math.min(a.right, b2.right) - Math.max(a.left, b2.left);
      const h = Math.min(a.bottom, b2.bottom) - Math.max(a.top, b2.top);
      return (w > 0 && h > 0) ? Math.round(w * h) : 0;
    };
    const hit = [];
    for (const el of document.querySelectorAll('main p, main h1, main h2, main h3, main span')) {
      if (el.children.length) continue;
      const t = (el.textContent||'').trim(); if (t.length < 4) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const area = Math.round(r.width * r.height);
      const ic = inter(r, cr), is = inter(r, sr);
      if (ic > 0 || is > 0) hit.push({ t: t.slice(0,34), area, chipPct: Math.round(100*ic/area), spinePct: Math.round(100*is/area) });
    }
    return { chip: cr && {x:Math.round(cr.x),y:Math.round(cr.y),w:Math.round(cr.width),h:Math.round(cr.height)}, chipVis, hit };
  });
  console.log(`\n${id}  chipVis=${d.chipVis} chip=${JSON.stringify(d.chip)}`);
  d.hit.forEach(h => console.log(`   text=${h.chipPct}% under chip, ${h.spinePct}% under spine  :: ${h.t}`));
}
await b.close();
