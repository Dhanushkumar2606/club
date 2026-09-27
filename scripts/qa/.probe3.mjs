import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(3000);
const d = await p.evaluate(() => {
  const out = [];
  let n = document.querySelector('img[src*="background.jpeg"]').parentElement;
  while (n) {
    const c = getComputedStyle(n);
    const props = { transform: c.transform, filter: c.filter, perspective: c.perspective,
      willChange: c.willChange, backdropFilter: c.backdropFilter, contain: c.contain,
      position: c.position, motion: c.motion, boxShadow: c.boxShadow };
    const hot = Object.entries(props).filter(([k,v]) => v && v !== 'none' && v !== 'normal' && v !== 'auto' && k !== 'position');
    if (hot.length) out.push({ node: `${n.tagName}.${String(n.className).slice(0,55)}`, hot });
    n = n.parentElement;
  }
  return out;
});
console.log(JSON.stringify(d, null, 1));
await b.close();
