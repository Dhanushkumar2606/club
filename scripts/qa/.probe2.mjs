import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(3000);
const d = await p.evaluate(() => {
  const img = document.querySelector('img[src*="background.jpeg"]');
  const wrap = img.parentElement;
  const wc = getComputedStyle(wrap);
  const ic = getComputedStyle(img);
  const wr = wrap.getBoundingClientRect();
  const ir = img.getBoundingClientRect();
  return {
    wrapTag: wrap.tagName, wrapClass: wrap.className,
    wrapPos: wc.position, wrapTop: wc.top, wrapBottom: wc.bottom, wrapLeft: wc.left,
    wrapH: wc.height, wrapW: wc.width, wrapDisplay: wc.display, wrapZ: wc.zIndex,
    wrapRect: {w: Math.round(wr.width), h: Math.round(wr.height)},
    imgPos: ic.position, imgInset: [ic.top, ic.right, ic.bottom, ic.left].join(','),
    imgH: ic.height, imgW: ic.width, imgFit: ic.objectFit,
    imgRect: {w: Math.round(ir.width), h: Math.round(ir.height)},
    parentChain: (() => { let n = wrap, out=[]; while (n && out.length<5) { const c=getComputedStyle(n); out.push(`${n.tagName}.${String(n.className).slice(0,30)}[pos=${c.position} h=${c.height} z=${c.zIndex}]`); n=n.parentElement; } return out; })(),
  };
});
console.log(JSON.stringify(d, null, 1));
await b.close();
