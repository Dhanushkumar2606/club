import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(3500);
const read = async (label) => {
  const d = await p.evaluate(() => {
    const img = document.querySelector('img[src*="background.jpeg"]');
    const wrap = img?.closest('div');
    const layers = [...wrap.querySelectorAll(':scope > div')].map(d => ({
      cls: d.className.slice(0,50), op: getComputedStyle(d).opacity, bg: getComputedStyle(d).backgroundColor,
    }));
    const r = img.getBoundingClientRect();
    return {
      complete: img.complete, natural: img.naturalWidth, rect: {w:Math.round(r.width),h:Math.round(r.height)},
      scrollY: Math.round(scrollY), wrapOpacity: wrap ? getComputedStyle(wrap).opacity : null,
      wrapZ: wrap ? getComputedStyle(wrap).zIndex : null,
      veil: layers,
      groundZ: getComputedStyle(wrap).zIndex,
      bodyBg: getComputedStyle(document.body).backgroundColor,
    };
  });
  console.log('\n== ' + label + ' ==');
  console.log(JSON.stringify(d, null, 1));
};
await read('TOP scrollY=0');
await p.screenshot({ path: '/tmp/shots/p-top.png' });
await p.evaluate(() => window.scrollTo(0, 4000));
await p.waitForTimeout(2500);
await read('scrollY=4000');
await p.screenshot({ path: '/tmp/shots/p-4000.png' });
await b.close();
