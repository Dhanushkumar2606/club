import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3100/cyber-knights", { waitUntil: "domcontentloaded" });
await p.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
await p.waitForTimeout(600);

console.log("pin exists on CK:", await p.evaluate(`!!document.querySelector('.archive-pin')`));

// replicate: hover nav button first (like earlier step), then move away, then scroll
const swBtn = await p.$('nav[aria-label="Switch club"] button');
if (swBtn) {
  const bb = await swBtn.boundingBox();
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await p.waitForTimeout(500);
}
await p.mouse.move(200, 150);
await p.waitForTimeout(600);
await p.evaluate(() => {
  const pin = document.querySelector(".archive-pin");
  if (pin) window.scrollTo(0, Math.round(pin.getBoundingClientRect().top + scrollY) + 1400);
});
await p.waitForTimeout(900);
console.log(JSON.stringify(await p.evaluate(`(()=>{
  const lab=document.querySelector('.pc-label');
  const ring=document.querySelector('.pc-ring');
  return {
    label:lab.textContent,
    op:Number(getComputedStyle(lab).opacity),
    w:Math.round(ring.getBoundingClientRect().width),
    cond1:String(lab.textContent)!=='EXPLORE',
    cond2:Number(getComputedStyle(lab).opacity)===0,
    cond3:Math.round(ring.getBoundingClientRect().width)<=30,
  };
})()`)));
await b.close();
