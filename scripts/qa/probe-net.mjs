import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3100/cyber-knights", { waitUntil: "domcontentloaded" });
await p.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
const stTop = await p.evaluate(
  `Math.round(document.querySelector('.cap-stage').getBoundingClientRect().top + scrollY)`,
);
const stageH = await p.evaluate(`document.querySelector('.cap-stage').getBoundingClientRect().height`);
await p.evaluate((y) => window.scrollTo(0, y), Math.floor(stTop + stageH / 2 - 450));
await p.waitForTimeout(1600);

// instrument
await p.evaluate(() => {
  const w = window;
  w.__overNode = 0;
  document.querySelector(".caps-section").addEventListener("pointerover", () => w.__overNode++);
});

const nb = (await p.$$(".cap-node"))[0];
const bb = await nb.boundingBox();
console.log("node bbox:", JSON.stringify(bb));
console.log(
  "elementFromPoint(center):",
  await p.evaluate(
    ([x, y]) => {
      const e = document.elementFromPoint(x, y);
      return e ? e.tagName + "|" + String(e.className).slice(0, 44) : "none";
    },
    [bb.x + bb.width / 2, bb.y + bb.height / 2],
  ),
);
await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 5 });
await p.waitForTimeout(600);
console.log("__overNode fired:", await p.evaluate(`(window).__overNode`));
console.log("panel op:", await p.evaluate(`Number(getComputedStyle(document.querySelector('.caps-info-panel')).opacity)`));

// stage geometry for runway tuning
console.log(
  "stage:",
  await p.evaluate(`JSON.stringify({ h: Math.round(document.querySelector('.cap-stage').getBoundingClientRect().height), secH: Math.round(document.querySelector('.caps-section').getBoundingClientRect().height) })`),
);
await b.close();
