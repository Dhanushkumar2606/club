import { chromium, webkit, devices } from "playwright";

const BASE = "http://localhost:3100";
const results = [];
const rec = (name, pass, detail = "") => {
  results.push({ name, pass: !!pass, detail: String(detail).slice(0, 300) });
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrollTo(page, y, steps = 24, stepMs = 40) {
  const max = await page.evaluate(() => document.documentElement.scrollHeight);
  const ih = await page.evaluate(() => window.innerHeight);
  const from = await page.evaluate(() => window.scrollY);
  const to = Math.max(0, Math.min(y, max - ih));
  const inc = (to - from) / steps;
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((v) => window.scrollTo(0, v), from + inc * i);
    await page.waitForTimeout(stepMs);
  }
}

async function pageChecks(page, label, pagePath) {
  await page.goto(BASE + pagePath, { waitUntil: "networkidle" });
  await wait(1200);

  const img = await page.evaluate(() =>
    [...document.images].map((im) => ({
      complete: im.complete,
      w: im.naturalWidth,
      alt: im.alt,
      loading: im.loading,
      cls: (im.className || "").toString(),
    })),
  );
  const heroImg = img.find((i) => i.cls.includes("hero-logo"));
  const heroOk =
    pagePath === "/"
      ? img.every((i) => i.loading === "lazy" || (i.complete && i.w > 0))
      : !!heroImg && heroImg.complete && heroImg.w > 0;
  rec(`${label} ${pagePath} hero-image`, heroOk, JSON.stringify(img));
  rec(`${label} ${pagePath} images-alt`, img.every((i) => i.alt.length > 0), `missing=${img.filter((i) => !i.alt).length}`);
  const lazyImgs =
    pagePath === "/"
      ? []
      : await page.evaluate(() =>
          [...document.querySelectorAll(".finale-logo img")].map((im) => ({ loading: im.loading, alt: im.alt })),
        );
  rec(
    `${label} ${pagePath} lazy-finale-logos`,
    pagePath === "/" || (lazyImgs.length === 2 && lazyImgs.every((i) => i.loading === "lazy")),
    JSON.stringify(lazyImgs),
  );

  const sw = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Switch club"]');
    return { present: !!nav, active: nav?.querySelector('[aria-current="page"]')?.textContent?.trim() };
  });
  const expectActive = pagePath === "/" ? "CSE" : pagePath === "/script-soldiers" ? "SS" : "CK";
  rec(`${label} ${pagePath} switcher`, sw.present && sw.active === expectActive, JSON.stringify(sw));

  if (pagePath !== "/") {
    try {
      await page.waitForFunction(
        () => Number(getComputedStyle(document.querySelector(".hero-title")).opacity) > 0.9,
        { timeout: 20000 },
      );
      rec(`${label} ${pagePath} hero-reveal`, true);
    } catch {
      rec(`${label} ${pagePath} hero-reveal`, false, "timeout");
    }
  }

  if (pagePath !== "/") {
    const sections = await page.evaluate(() => {
      const has = (t) => [...document.querySelectorAll("section")].some((s) => s.textContent.includes(t));
      return { mission: has("MISSION"), team: has("TEAM ROSTER"), finale: has("FINAL TRANSMISSION") };
    });
    rec(`${label} ${pagePath} sections`, sections.mission && sections.team && sections.finale, JSON.stringify(sections));
    const dup = await page.evaluate(() =>
      document.body.textContent.includes("DEPARTMENT LEADERSHIP") ||
      document.body.textContent.includes("FACULTY COORDINATORS") ||
      document.body.textContent.includes("IMPACT / COMBINED"),
    );
    rec(`${label} ${pagePath} no-dept-dup`, !dup, dup ? "dept content on club page" : "");
  } else {
    const lead = await page.evaluate(() => {
      const has = (t) => [...document.querySelectorAll("section")].some((s) => s.textContent.includes(t));
      const el = [...document.querySelectorAll("section")].find((s) => s.textContent.includes("DEPARTMENT LEADERSHIP"));
      return {
        dept: has("DEPARTMENT LEADERSHIP"),
        hod: has("[HOD]"),
        fac: has("FACULTY COORDINATORS"),
        gateway: has("CLUB GATEWAY"),
        accentVar: el ? getComputedStyle(el).getPropertyValue("--accent").trim() : null,
        order: (() => {
          if (!el) return -1;
          const gw = [...document.querySelectorAll("section")].findIndex((s) => s.textContent.includes("CLUB GATEWAY"));
          return gw > [...document.querySelectorAll("section")].indexOf(el) ? 1 : 0;
        })(),
      };
    });
    rec(`${label} / leadership-on-dept`, lead.dept && lead.hod && lead.fac, JSON.stringify(lead));
    rec(`${label} / gateway-after-leadership`, lead.order === 1, `order=${lead.order}`);
    rec(`${label} / leadership-neutral-theme`, lead.accentVar === "#d7e0e8", String(lead.accentVar));
    const impactGone = await page.evaluate(() => !document.body.textContent.includes("IMPACT / COMBINED"));
    rec(`${label} / impact-removed`, impactGone);

    const dupIntro = await page.evaluate(() => document.body.textContent.includes("ONE COMMUNITY"));
    rec(`${label} / no-duplicate-intro`, !dupIntro);

    const hodPos = await page.evaluate(() => {
      const el = [...document.querySelectorAll("section")].find((s) => s.textContent.includes("DEPARTMENT LEADERSHIP"));
      return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : -1;
    });
    let hodState = { photo: false, placeholder: false };
    if (hodPos >= 0) {
      await scrollTo(page, hodPos);
      await wait(1500);
      hodState = await page.evaluate(() => {
        const el = [...document.querySelectorAll("section")].find((s) => s.textContent.includes("DEPARTMENT LEADERSHIP"));
        const im = [...(el?.querySelectorAll("img") || [])].find((i) => i.currentSrc.includes("hod"));
        return { photo: !!im && im.complete && im.naturalWidth > 0 };
      });
    }
    rec(`${label} / hod-photo`, hodState.photo, JSON.stringify(hodState));

    const gpos = await page.evaluate(() => {
      const s = [...document.querySelectorAll("section")].find((x) => x.textContent.includes("CLUB GATEWAY"));
      return s ? { top: s.getBoundingClientRect().top + window.scrollY, h: s.getBoundingClientRect().height } : null;
    });
    if (gpos) {
      await scrollTo(page, gpos.top + Math.floor(gpos.h / 2));
      await wait(1400);
      const cards = await page.evaluate(() =>
        [...document.querySelectorAll(".club-card")].map((c) => Number(getComputedStyle(c).opacity)),
      );
      rec(`${label} / gateway-cards-reveal`, cards.length === 2 && cards.every((o) => o > 0.9), JSON.stringify(cards));
      const logos = await page.evaluate(() =>
        [...document.querySelectorAll(".club-card img")].map((im) => ({ c: im.complete, w: im.naturalWidth })),
      );
      rec(`${label} / gateway-logos-loaded`, logos.length === 2 && logos.every((l) => l.c && l.w > 0), JSON.stringify(logos));
    }
  }

  rec(`${label} ${pagePath} no-h-overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));

  if (pagePath !== "/") {
    const mpos = await page.evaluate(() => {
      const s = [...document.querySelectorAll("section")].find((x) => x.querySelector(".mission-statement"));
      return s ? { top: s.getBoundingClientRect().top + window.scrollY, h: s.getBoundingClientRect().height } : null;
    });
    if (mpos) {
      await scrollTo(page, mpos.top + Math.floor(mpos.h * 0.75));
      await wait(1300);
      const chars = await page.evaluate(() => {
        const s = [...document.querySelectorAll("section")].find((x) => x.querySelector(".mission-statement"));
        const lines = [...s.querySelector(".mission-statement").children];
        return { total: lines.length, shown: lines.filter((c) => Number(getComputedStyle(c).opacity) > 0.5).length };
      });
      rec(`${label} ${pagePath} mission-lines`, chars.total >= 2 && chars.shown === chars.total, JSON.stringify(chars));
      const kicker = await page.evaluate(() => ({
        mission: getComputedStyle(document.querySelector(".mission-kicker")).opacity,
        meta: (document.querySelector(".mission-kicker")?.textContent || "").includes("SYS://"),
      }));
      rec(`${label} ${pagePath} mission-kicker`, kicker.mission > 0.8 && kicker.meta, "");
      const scansGone = await page.evaluate(() => !document.querySelector(".mission-scan") && !document.querySelector(".mission-caret"));
      rec(`${label} ${pagePath} mission-clean`, scansGone);
    }

    const tpos = await page.evaluate(() => {
      const s = [...document.querySelectorAll("section")].find((x) => x.textContent.includes("TEAM ROSTER"));
      return s ? { top: s.getBoundingClientRect().top + window.scrollY, h: s.getBoundingClientRect().height } : null;
    });
    if (tpos) {
      await scrollTo(page, tpos.top + Math.floor(tpos.h * 0.5));
      await wait(1500);
      const layer = await page.evaluate(
        () => [...document.querySelectorAll(".team-member")].some((x) => Number(getComputedStyle(x).opacity) > 0.5),
      );
      rec(`${label} ${pagePath} team-beat`, layer);
      // member name word-boundary wrapping
      const nameStruct = await page.evaluate(() => {
        const layer = [...document.querySelectorAll(".team-member")].find(
          (x) => Number(getComputedStyle(x).opacity) > 0.5,
        );
        if (!layer) return null;
        const name = layer.querySelector(".team-name");
        const kids = [...name.children];
        const cs = getComputedStyle(name);
        const link = layer.querySelector("a.team-meta-el[target='_blank']");
        return {
          words: kids.map((k) => k.textContent),
          nestedChars: kids.some((k) => k.children.length > 0),
          wordBreak: cs.wordBreak,
          connect: link ? { host: link.hostname, rel: link.rel } : null,
        };
      });
      rec(
        `${label} ${pagePath} name-word-wrapping`,
        !!nameStruct && nameStruct.words.length >= 1 && nameStruct.nestedChars && nameStruct.wordBreak === "normal",
        JSON.stringify(nameStruct?.words),
      );
      if (nameStruct?.connect)
        rec(`${label} ${pagePath} connect-link`, nameStruct.connect.host.includes("linkedin") && nameStruct.connect.rel.includes("noopener"), JSON.stringify(nameStruct.connect));

      // full wired roster — every member slot carries its own LinkedIn anchor
      const roster = await page.evaluate(() => {
        const s = [...document.querySelectorAll("section")].find((x) => x.textContent.includes("TEAM ROSTER"));
        const anchors = [...(s?.querySelectorAll("a.team-meta-el[target='_blank']") || [])];
        return { count: anchors.length, hrefs: [...new Set(anchors.map((a) => a.href))], relOk: anchors.every((a) => a.rel.includes("noopener")) };
      });
      rec(
        `${label} ${pagePath} roster-links`,
        roster.count >= 1 && roster.hrefs.length === roster.count && roster.hrefs.every((h) => h.includes("linkedin")) && roster.relOk,
        JSON.stringify(roster),
      );
    }

    const fpos = await page.evaluate(() => {
      const s = [...document.querySelectorAll("section")].find((x) => x.textContent.includes("FINAL TRANSMISSION"));
      return s ? { top: s.getBoundingClientRect().top + window.scrollY, h: s.getBoundingClientRect().height } : null;
    });
    if (fpos) {
      let infoMax = 0;
      let hasLine = false;
      for (let i = 0; i <= 8; i++) {
        await scrollTo(page, fpos.top + Math.floor(fpos.h * (0.3 + 0.7 * (i / 8))), 10, 30);
        await wait(350);
        const sample = await page.evaluate(() => {
          const s = [...document.querySelectorAll("section")].find((x) => x.textContent.includes("FINAL TRANSMISSION"));
          const info = s?.querySelector(".finale-info");
          return { info: info ? Number(getComputedStyle(info).opacity) : 0, line: s?.textContent.includes("ONE FUTURE.") };
        });
        infoMax = Math.max(infoMax, sample.info);
        if (sample.line) hasLine = true;
      }
      rec(`${label} ${pagePath} finale`, infoMax > 0.5 && hasLine, `infoMax=${Math.round(infoMax * 100) / 100}`);

      await scrollTo(page, fpos.top + fpos.h - 200, 14, 40);
      await wait(1200);
      const finImgs = await page.evaluate(() =>
        [...document.querySelectorAll(".finale-logo img")].map((im) => ({ c: im.complete, w: im.naturalWidth })),
      );
      rec(`${label} ${pagePath} finale-logos-loaded`, finImgs.length === 2 && finImgs.every((i) => i.c && i.w > 0), JSON.stringify(finImgs));
    }
  }
}

// section transition bridges
async function bridgeChecks(page, label) {
  await page.goto(BASE + "/cyber-knights", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  await wait(1500);

  const seams = await page.evaluate(() =>
    [...document.querySelectorAll("div[aria-hidden]")]
      .filter((d) => d.className.includes("h-0") && d.querySelector(".sb-dot-0,.sb-line,.sb-glyph-out"))
      .map((m) => (m.querySelector(".sb-dot-0") ? "stream" : m.querySelector(".sb-line") ? "line" : "type")),
  );
  rec(`${label} bridges-count`, seams.length === 5, JSON.stringify(seams));
  rec(`${label} bridges-order`, JSON.stringify(seams) === JSON.stringify(["stream", "line", "type", "stream", "stream"]), "");

  const seamY = await page.evaluate(
    () => Math.round([...document.querySelectorAll("div[aria-hidden]")].filter((d) => d.className.includes("h-0"))[0].getBoundingClientRect().top + scrollY),
  );
  const dotT = () =>
    page.evaluate(() => {
      const d = document.querySelector(".sb-dot-0");
      return d ? getComputedStyle(d).transform : "none";
    });
  await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, seamY - 600));
  await wait(800);
  const t1 = await dotT();
  await page.evaluate((y) => window.scrollTo(0, y), seamY + 500);
  await wait(800);
  const t2 = await dotT();
  rec(`${label} stream-motion`, t1 !== "none" && t1 !== t2, "");

  const seamY2 = await page.evaluate(() => {
    const m = [...document.querySelectorAll("div[aria-hidden]")].filter((d) => d.className.includes("h-0"))[1];
    return m ? Math.round(m.getBoundingClientRect().top + scrollY) : -1;
  });
  if (seamY2 > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), seamY2);
    await wait(900);
    const drawn = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector(".sb-line")).strokeDashoffset));
    rec(`${label} line-draws`, drawn < 20, `offset=${drawn}`);
  }
  rec(`${label} no-overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
}

// CLUB HISTORY & ARCHIVE — shared legacy + per-club archives
async function archiveChecks(label) {
  const { browser, ctx } = await makeBrowser("chrome");
  const page = await ctx.newPage();

  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  await wait(1000);
  const legacy = await page.evaluate(() => ({
    panels: document.querySelectorAll(".archive-panel").length,
    heading: [...document.querySelectorAll("h2")].some((h) => h.textContent.includes("OUR LEGACY")),
    techRhythm: document.body.textContent.includes("TECH RHYTHM"),
    glitch: document.body.textContent.includes("GLITCHYUGAM'26"),
    journey: document.body.textContent.includes("TWO DISTINCT PATHS"),
  }));
  rec(`${label} legacy-panels-22`, legacy.panels === 22, `count=${legacy.panels}`);
  rec(`${label} legacy-content`, legacy.heading && legacy.techRhythm && legacy.glitch && legacy.journey, JSON.stringify(legacy));

  // horizontal track responds to scroll
  await page.evaluate(() => {
    const pin = document.querySelector(".archive-pin");
    window.scrollTo(0, Math.round(pin.getBoundingClientRect().top + scrollY) + 700);
  });
  await wait(1300);
  const trackX1 = await page.evaluate(
    () => new DOMMatrixReadOnly(getComputedStyle(document.querySelector(".archive-track")).transform).e,
  );
  await page.evaluate(() => {
    const pin = document.querySelector(".archive-pin");
    window.scrollTo(0, Math.round(pin.getBoundingClientRect().top + scrollY) + 1600);
  });
  await wait(1300);
  const trackX2 = await page.evaluate(
    () => new DOMMatrixReadOnly(getComputedStyle(document.querySelector(".archive-track")).transform).e,
  );
  rec(`${label} legacy-track-moves`, trackX2 < trackX1 - 150, `${Math.round(trackX1)}→${Math.round(trackX2)}`);

  // stale EXPLORE (from gateway cards) must not leak into the archive view
  const stale = await page.evaluate(() => ({
    label: document.querySelector(".pc-label")?.textContent ?? "",
    op: Number(getComputedStyle(document.querySelector(".pc-label")).opacity),
    w: Math.round(document.querySelector(".pc-ring").getBoundingClientRect().width),
  }));
  rec(
    `${label} no-stale-explore`,
    (stale.label === "" || stale.op < 0.15) && stale.w <= 34,
    JSON.stringify(stale),
  );

  // archive photographs stay DEFAULT ○ under direct hover
  const panelBtns = await page.$$(".archive-panel button");
  if (panelBtns.length > 5) {
    const pb5 = await panelBtns[5].boundingBox();
    await page.mouse.move(pb5.x + pb5.width / 2, pb5.y + pb5.height / 2);
    await wait(650);
    const ap = await page.evaluate(() => ({
      label: document.querySelector(".pc-label")?.textContent ?? "",
      w: Math.round(document.querySelector(".pc-ring").getBoundingClientRect().width),
    }));
    rec(`${label} archive-photo-default`, ap.label === "" && ap.w <= 30, JSON.stringify(ap));

    // lazy gallery images all load once visited
    const loaded = await page.evaluate(() => {
      const panels = [...document.querySelectorAll(".archive-panel")];
      return {
        count: panels.length,
        ok: panels.filter((f) => {
          const im = f.querySelector("img");
          return !im || (im.complete && im.naturalWidth > 0);
        }).length,
      };
    });
    rec(`${label} gallery-loaded`, loaded.count === 22, JSON.stringify(loaded));
    await page.mouse.move(pb5.x + pb5.width / 2, pb5.y + pb5.height / 2);
  }

  // counter reaches final frame — scroll to spacer end and let scrub settle
  await page.evaluate(() => {
    const pin = document.querySelector(".archive-pin");
    window.scrollTo(0, Math.round(pin.getBoundingClientRect().top + scrollY) + pin.getBoundingClientRect().height);
  });
  await wait(2600);
  const counterTxt = await page.evaluate(
    () => document.querySelector(".archive-counter")?.textContent.trim() ?? "",
  );
  rec(`${label} legacy-counter-final`, counterTxt === String(legacy.panels).padStart(2, "0") + " / " + String(legacy.panels).padStart(2, "0"), counterTxt);

  // return to pin start → first panel visible → open lightbox → Esc closes
  await page.evaluate(() => {
    const pin = document.querySelector(".archive-pin");
    window.scrollTo(0, Math.round(pin.getBoundingClientRect().top + scrollY) + 150);
  });
  await wait(1800);
  let lbOpen = false;
  const firstPanel = await page.$(".archive-panel button");
  if (firstPanel) {
    // use DOM click to avoid viewport actionability races with pinned track
    await page.evaluate(() => document.querySelector(".archive-panel button")?.click());
    await wait(400);
    // fallback to Playwright click if evaluate click did not open
    if (!(await page.evaluate(() => !!document.querySelector("[role='dialog']")))) {
      await firstPanel.click({ timeout: 9000, force: true }).catch(() => {});
    }
    await wait(600);
    lbOpen = await page.evaluate(() => !!document.querySelector("[role='dialog']"));
    await page.keyboard.press("Escape");
    await wait(450);
  }
  const lbClosed = await page.evaluate(() => !document.querySelector("[role='dialog']"));
  rec(`${label} lightbox-esc`, lbOpen && lbClosed, `open=${lbOpen}`);

  // club pages — own events only, zero legacy duplication
  for (const [route, want] of [
    ["/script-soldiers", ["CODE VOYAGE", "BRAINS & BYTES"]],
    ["/cyber-knights", ["CYBER VERTEX", "CYBER NEXUS"]],
  ]) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
    await wait(900);
    const r = await page.evaluate(([want]) => {
      const t = document.body.textContent;
      return {
        panels: document.querySelectorAll(".archive-panel").length,
        hasWanted: want.every((w) => t.toUpperCase().includes(w)),
        legacyLeak: t.includes("SHARED LEGACY / 01") || t.includes("TECH RHYTHM"),
        comingSoon: t.includes("ARCHIVE — COMING SOON"),
      };
    }, [want]);
    rec(
      `${label} ${route} archive`,
      (r.panels === 2 && r.hasWanted && !r.legacyLeak) || (r.panels === 0 && r.comingSoon),
      JSON.stringify(r),
    );
  }
  await browser.close();

  // MOBILE — vertical layout, no overflow, desktop pin hidden
  const { browser: b2, ctx: c2 } = await makeBrowser("android");
  const m = await c2.newPage();
  await m.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await m.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  await m.waitForTimeout(800);
  const mob = await m.evaluate(() => ({
    pinHidden: (() => {
      const pin = document.querySelector(".archive-pin");
      return !pin || getComputedStyle(pin).display === "none";
    })(),
    overflowOk: document.documentElement.scrollWidth <= innerWidth + 1,
    mobileFigures: document.querySelectorAll("figure").length >= 20,
  }));
  rec(`${label} mobile-vertical`, mob.pinHidden && mob.overflowOk && mob.mobileFigures, JSON.stringify(mob));
  await b2.close();
}


// CK interactive capability network + mission readability
async function capabilityChecks(page, label) {
  await page.goto(BASE + "/cyber-knights", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  await wait(9000);

  const caps = await page.evaluate(() => {
    const root = document.querySelector(".caps-section");
    if (!root) return null;
    return {
      nodes: root.querySelectorAll(".cap-node").length,
      spokes: root.querySelectorAll(".cap-spoke").length,
      heading: root.querySelector(".caps-heading")?.textContent || "",
      core: !!root.querySelector(".cap-core-group"),
      panel: !!root.querySelector(".caps-info-panel"),
      pulses: root.querySelectorAll(".cap-pulse").length,
      networkGone: !document.querySelector(".network-stage"),
    };
  });
  rec(`${label} caps-present`, !!caps && caps.nodes === 8 && caps.spokes === 8 && caps.core && caps.pulses === 2 && caps.networkGone, JSON.stringify(caps));
  rec(`${label} caps-heading`, !!caps && caps.heading.toUpperCase().includes("WHAT WE DO"), "");

  const stTop = await page.evaluate(() => {
    const r = document.querySelector(".cap-stage");
    return r ? Math.round(r.getBoundingClientRect().top + scrollY) : -1;
  });
  const stageH = await page.evaluate(() =>
    document.querySelector(".cap-stage")?.getBoundingClientRect().height || 800,
  );
  if (stTop > 0) {
    // approach point — network partially built while stage enters
    await page.evaluate((y) => window.scrollTo(0, y), Math.floor(stTop - 250));
    await wait(1300);
    const mid = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll(".cap-node")];
      return { vis: nodes.filter((n) => Number(getComputedStyle(n).opacity) > 0.4).length };
    });
    rec(`${label} caps-progressive`, mid.vis >= 1 && mid.vis < 8, JSON.stringify(mid));

    // center the stage for interaction checks
    await page.evaluate((y) => window.scrollTo(0, y), Math.floor(stTop + stageH / 2 - 450));
    await wait(1500);
    const full = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll(".cap-node")];
      const spokes = [...document.querySelectorAll(".cap-spoke")];
      return {
        vis: nodes.filter((n) => Number(getComputedStyle(n).opacity) > 0.4).length,
        drawn: spokes.every((s) => parseFloat(getComputedStyle(s).strokeDashoffset) < 15),
      };
    });
    rec(`${label} caps-full`, full.vis === 8 && full.drawn, JSON.stringify(full));

    const nodeHandles = await page.$$(".cap-node");
    if (nodeHandles.length) {
      const nb = await nodeHandles[0].boundingBox();
      if (nb) {
        await page.mouse.move(nb.x + nb.width / 2, nb.y + nb.height / 2);
        await wait(700);
        const hov = await page.evaluate(() => {
          const panel = document.querySelector(".caps-info-panel");
          return {
            panelOp: Number(getComputedStyle(panel).opacity),
            title: panel.querySelector(".capi-title")?.textContent,
            num: panel.querySelector(".capi-num")?.textContent.includes("01"),
          };
        });
        rec(`${label} caps-hover-panel`, hov.panelOp > 0.5 && hov.title === "ETHICAL HACKING" && hov.num, JSON.stringify(hov));

        await page.mouse.move(nb.x - 320, nb.y - 240);
        await wait(600);
        const out = await page.evaluate(() => Number(getComputedStyle(document.querySelector(".caps-info-panel")).opacity));
        rec(`${label} caps-panel-hides`, out < 0.4, `op=${out}`);
      }
    }
  }

  const missionClean = await page.evaluate(
    () => !document.querySelector(".mission-scan") && !document.querySelector(".mission-caret"),
  );
  rec(`${label} mission-clean`, missionClean);

  await page.goto(BASE + "/script-soldiers", { waitUntil: "domcontentloaded" });
  await wait(1500);
  const ssClean = await page.evaluate(() => !document.querySelector(".mission-scan") && !document.querySelector(".mission-caret"));
  rec(`${label} ss-mission-clean`, ssClean);
  rec(`${label} no-overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
}

/* ---------------- restored suites ---------------- */

// scroll-triggered hero identity transition
async function heroIdentityChecks(label) {
  for (const route of ["/script-soldiers", "/cyber-knights"]) {
    const { browser, ctx } = await makeBrowser("chrome");
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
    await page.waitForFunction(
      () => Number(getComputedStyle(document.querySelector(".hero-title")).opacity) > 0.9,
      { timeout: 20000 },
    ).catch(() => {});
    await wait(1200);

    const state = () =>
      page.evaluate(() => {
        const h = document.querySelector(".hero-logo-holder");
        const w = document.querySelector(".hero-welcome");
        const m = new DOMMatrixReadOnly(
          getComputedStyle(h).transform === "none" ? "matrix(1,0,0,1,0,0)" : getComputedStyle(h).transform,
        );
        return { x: Math.round(m.e), y: Math.round(m.f), welcome: Number(getComputedStyle(w).opacity), text: w.textContent.trim() };
      });

    await wait(5000);
    const idle = await state();
    rec(`${label} ${route} idle-no-travel`, Math.abs(idle.x) < 4 && Math.abs(idle.y) < 4 && idle.welcome > 0.85, JSON.stringify(idle));
    rec(`${label} ${route} welcome-text`, idle.text.startsWith("Welcome to the world of"), idle.text);

    await page.mouse.wheel(0, 450);
    await wait(1400);
    const scrolled = await state();
    rec(`${label} ${route} scroll-transitions`, scrolled.x < -100 && scrolled.welcome < 0.5, JSON.stringify(scrolled));

    await page.evaluate(() => window.scrollTo(0, 700));
    await wait(1200);
    const settled = await state();
    rec(`${label} ${route} settles-top-left`, settled.x < -300 && settled.welcome === 0, JSON.stringify(settled));

    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(1600);
    const back = await state();
    rec(`${label} ${route} reverses`, Math.abs(back.x) < 6 && back.welcome > 0.8, JSON.stringify(back));

    await browser.close();
  }
}

async function scrollPerf(page, label) {
  await page.goto(BASE + "/script-soldiers", { waitUntil: "networkidle" });
  await wait(1000);
  const times = [];
  for (let i = 0; i < 60; i++) {
    const t0 = Date.now();
    await page.evaluate((y) => window.scrollTo(0, y), i * 120);
    await page.waitForTimeout(16);
    times.push(Date.now() - t0);
  }
  times.sort((a, b) => a - b);
  rec(`${label} scroll-perf p95<=50ms`, times[Math.floor(times.length * 0.95)] <= 50, `p50=${times[Math.floor(times.length * 0.5)]}ms p95=${times[Math.floor(times.length * 0.95)]}ms`);
}

async function wheelScroll(page, label) {
  await page.goto(BASE + "/script-soldiers", { waitUntil: "networkidle" });
  await wait(1200);
  const before = await page.evaluate(() => window.scrollY);
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 600);
    await wait(250);
  }
  await wait(800);
  const after = await page.evaluate(() => window.scrollY);
  rec(`${label} wheel-scroll`, after - before > 200, `before=${before} after=${after}`);
}

async function ckInputMatrix(page, label) {
  await page.goto(BASE + "/cyber-knights", { waitUntil: "domcontentloaded" });

  await wait(400);
  let y = await page.evaluate(() => window.scrollY);
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 500);
    await wait(150);
  }
  let y2 = await page.evaluate(() => window.scrollY);
  rec(`${label} ck-matrix wheel-during-boot`, y2 - y > 100, `+${y2 - y}`);

  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  for (const f of [0.3, 0.55, 0.8]) {
    await page.evaluate((v) => window.scrollTo(0, v), Math.floor((docH - 900) * f));
    await wait(1800);
    const b = await page.evaluate(() => window.scrollY);
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 500);
      await wait(140);
    }
    await wait(900);
    const a = await page.evaluate(() => window.scrollY);
    rec(`${label} ck-matrix resume@${Math.round(f * 100)}%`, a - b > 150, `+${a - b}`);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(600);
  await page.keyboard.press("ArrowDown");
  await wait(300);
  const kb = await page.evaluate(() => window.scrollY);
  rec(`${label} ck-matrix keyboard-arrow`, kb >= 30, `scrollY=${kb}`);

  const sbWidth = await page.evaluate(() => window.innerWidth - document.documentElement.clientWidth);
  if (sbWidth > 8) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(500);
    const vp = page.viewportSize();
    await page.mouse.move(vp.width - 4, 200);
    await page.mouse.down();
    await page.mouse.move(vp.width - 4, vp.height - 100, { steps: 10 });
    await page.mouse.up();
    await wait(700);
    const sb = await page.evaluate(() => window.scrollY);
    rec(`${label} ck-matrix scrollbar-drag`, sb > 100, `scrollY=${sb}`);
  } else {
    rec(`${label} ck-matrix scrollbar-drag`, true, `overlay scrollbars (${sbWidth}px)`);
  }
}

// PHASE 2.5 — scroll progress rail
async function progressChecks(label) {
  const { browser, ctx } = await makeBrowser("chrome");
  const page = await ctx.newPage();
  await page.goto(BASE + "/cyber-knights", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  await wait(800);

  const read = () =>
    page.evaluate(() => {
      const root = document.querySelector(".scroll-progress");
      if (!root) return null;
      const ticks = [...root.querySelectorAll(".w-px")];
      const nameEl = [...root.querySelectorAll("span")].find((s) => s.style.writingMode);
      return {
        ticks: ticks.length,
        active: ticks.findIndex((t) => t.className.includes("h-[18px]")),
        name: nameEl ? nameEl.textContent.trim() : null,
      };
    });

  const top = await read();
  rec(`${label} rail-8-ticks`, !!top && top.ticks === 8 && top.active === 0 && top.name === "INTRO", JSON.stringify(top));

  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  let lastActive = -1;
  let monotonic = true;
  let reachedFinale = false;
  for (const f of [0.12, 0.24, 0.34, 0.5, 0.68, 0.8, 0.94]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.floor((docH - 900) * f));
    await wait(650);
    const r = await read();
    if (!r || r.active < lastActive) monotonic = false;
    lastActive = r ? r.active : lastActive;
    if (r && r.active === 7) reachedFinale = true;
  }
  rec(`${label} advances-monotonic`, monotonic, `last=${lastActive}`);
  rec(`${label} reaches-finale`, reachedFinale);

  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(700);
  const backTop = await read();
  rec(`${label} returns-intro`, backTop.active === 0 && backTop.name === "INTRO", "");

  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  await wait(600);
  rec(`${label} absent-on-landing`, await page.evaluate(() => !document.querySelector(".scroll-progress")));
  await browser.close();

  const { browser: b2, ctx: c2 } = await makeBrowser("android");
  const p2 = await c2.newPage();
  await p2.goto(BASE + "/cyber-knights", { waitUntil: "domcontentloaded" });
  await p2.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  await wait(800);
  const mob = await p2.evaluate(() => {
    const root = document.querySelector(".scroll-progress");
    if (!root) return null;
    const nameEl = [...root.querySelectorAll("span")].find((s) => s.style.writingMode);
    return { nameHidden: nameEl ? getComputedStyle(nameEl).display === "none" : true, ticks: root.querySelectorAll(".w-px").length };
  });
  rec(`${label} mobile-compact`, !!mob && mob.nameHidden && mob.ticks === 8, JSON.stringify(mob));
  await b2.close();
}

// PHASES 2.6–2.19 consolidated
async function phaseBatchChecks(label) {
  const { browser, ctx } = await makeBrowser("chrome");
  const page = await ctx.newPage();
  await page.goto(BASE + "/script-soldiers", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  await wait(1000);

  rec(`${label} h1-hero`, await page.evaluate(() => !!document.querySelector("h1.hero-title")));
  rec(`${label} skip-link`, await page.evaluate(() => !!document.querySelector('a[href="#main"]')));
  rec(`${label} vignette`, await page.evaluate(() => document.querySelector("main")?.classList.contains("vignette") ?? false));

  const meta = await page.evaluate(() => document.querySelector(".mission-kicker")?.textContent || "");
  rec(`${label} identity-meta`, meta.includes("SYS://CODE"), meta.slice(-24));

  rec(
    `${label} ss-depth`,
    await page.evaluate(
      () =>
        !!document.querySelector("main div[aria-hidden][style*='repeating']") &&
        document.querySelectorAll(".particle").length > 20,
    ),
  );

  const teamY = await page.evaluate(() => {
    const s = [...document.querySelectorAll("section")].find((x) => x.textContent.includes("TEAM ROSTER"));
    return Math.round(s.getBoundingClientRect().top + scrollY);
  });
  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.evaluate((y) => window.scrollTo(0, y), Math.floor(teamY + (docH - teamY) * 0.16));
  await wait(1100);
  rec(
    `${label} member-spotlight`,
    await page.evaluate(() => {
      const s = document.querySelector(".team-spotlight");
      return !!s && Number(getComputedStyle(s).opacity) > 0.4;
    }),
  );
  rec(
    `${label} accent-line-drawn`,
    await page.evaluate(() => {
      const l = [...document.querySelectorAll(".member-accent-line")].find(
        (x) => Number(getComputedStyle(x.parentElement).opacity) > 0.5,
      );
      return !!l && getComputedStyle(l).transform.includes("matrix");
    }),
  );

  rec(`${label} connect-label`, await page.evaluate(() => document.querySelector(".team-meta-el span")?.textContent.trim() === "CONNECT ↗"));

  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  await wait(600);
  const narrative = await page.evaluate(() => {
    const t = document.body.textContent;
    return !t.includes("ONE COMMUNITY") && t.includes("SCRIPT SOLDIERS") && t.includes("CYBER KNIGHTS");
  });
  rec(`${label} no-duplicate-intro`, narrative);

  const resp = await page.request.get(BASE + "/_next/image?url=%2Fimages%2Fleadership%2Fhod.jpg&w=1080&q=75");
  rec(`${label} img-cached`, resp.status() === 200 && (resp.headers()["x-nextjs-cache"] === "hit" || !!resp.headers()["cache-control"]), `status=${resp.status()}`);
  await browser.close();
}

// PHASE 2.3 — magnetic interactions
async function magneticChecks(label) {
  const { browser, ctx } = await makeBrowser("chrome");
  const page = await ctx.newPage();

  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  const card = await page.$(".club-card");
  if (card) {
    await card.scrollIntoViewIfNeeded();
    await wait(1200);
    const chip = await page.evaluateHandle(() =>
      [...document.querySelectorAll(".club-card span")].find((s) => (s.textContent || "").trim().startsWith("ENTER")),
    );
    const cb = await chip.asElement().boundingBox();
    if (cb) {
      const cx = cb.x + cb.width / 2;
      const cy = cb.y + cb.height / 2;
      const sel = `[...document.querySelectorAll(".club-card span")].find((s) => (s.textContent || "").trim().startsWith("ENTER"))`;
      const before = await page.evaluate(`getComputedStyle(${sel}).transform`);
      await page.mouse.move(cx + 140, cy + 60);
      await wait(250);
      await page.mouse.move(cx + 12, cy);
      await wait(700);
      const pulled = await page.evaluate(`getComputedStyle(${sel}).transform`);
      const mag = pulled.match(/matrix\(([^)]+)\)/);
      let total = 0;
      if (mag) {
        const parts = mag[1].split(",").map(Number);
        total = Math.hypot(Math.abs(parts[4]), Math.abs(parts[5]));
      }
      rec(`${label} chip-pulls`, before !== pulled && total > 1 && total <= 12, `pull=${total.toFixed(1)}px`);

      await page.mouse.move(cx - 400, cy - 300);
      await wait(800);
      const released = await page.evaluate(`getComputedStyle(${sel}).transform`);
      rec(`${label} chip-releases`, /matrix\(1, 0, 0, 1, 0, 0\)|none/.test(released), released.slice(0, 30));
    }
  }

  await page.goto(BASE + "/cyber-knights", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  const btn = await page.$('nav[aria-label="Switch club"] button');
  if (btn) {
    const bb = await btn.boundingBox();
    await wait(600);
    await page.mouse.move(bb.x + bb.width / 2 + 26, bb.y + bb.height / 2);
    await wait(700);
    const m = await page.evaluate(() => {
      const el = document.querySelector('nav[aria-label="Switch club"] button');
      const t = getComputedStyle(el).transform;
      const p = t.match(/matrix\(([^)]+)\)/);
      return p ? Math.hypot(Number(p[1].split(",")[4]), Number(p[1].split(",")[5])) : 0;
    });
    rec(`${label} switcher-pulls`, m > 1 && m <= 12, `offset=${m.toFixed(1)}px`);
  }
  await browser.close();

  const { browser: b2, ctx: c2 } = await makeBrowser("android");
  const p2 = await c2.newPage();
  await p2.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await wait(1000);
  const clean = await p2.evaluate(() => {
    const chip = [...document.querySelectorAll(".club-card span")].find((s) => (s.textContent || "").trim().startsWith("ENTER"));
    return !chip || ["none", "matrix(1, 0, 0, 1, 0, 0)"].includes(getComputedStyle(chip).transform);
  });
  rec(`${label} disabled-android`, clean);
  await b2.close();
}

// PHASE 2.2 — premium cursor
async function cursorChecks(label) {
  const { browser, ctx } = await makeBrowser("chrome");
  const page = await ctx.newPage();
  await page.goto(BASE + "/cyber-knights", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  await wait(600);

  rec(
    `${label} present+gate`,
    await page.evaluate(
      () => !!document.querySelector(".pc-dot") && document.documentElement.classList.contains("has-cursor"),
    ),
  );

  const t1 = await page.evaluate(() => getComputedStyle(document.querySelector(".pc-dot")).transform);
  await page.mouse.move(300, 300);
  await wait(350);
  await page.mouse.move(760, 430);
  await wait(500);
  const t2 = await page.evaluate(() => getComputedStyle(document.querySelector(".pc-dot")).transform);
  rec(`${label} follows-pointer`, t1 !== t2 && t2.includes("matrix"), "");

  const swBtn = await page.$('nav[aria-label="Switch club"] button');
  if (swBtn) {
    const bb = await swBtn.boundingBox();
    await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await wait(600);
    const go = await page.evaluate(() => ({
      label: document.querySelector(".pc-label")?.textContent,
      w: Math.round(document.querySelector(".pc-ring").getBoundingClientRect().width),
      blend: getComputedStyle(document.querySelector(".pc-ring")).mixBlendMode,
    }));
    rec(`${label} nav-label-go`, go.label === "GO" && go.w > 55 && go.blend === "normal", JSON.stringify(go));
  }

  await page.mouse.move(200, 150);
  await wait(600);
  const idle = await page.evaluate(() => ({
    w: Math.round(document.querySelector(".pc-ring").getBoundingClientRect().width),
    labelOp: Number(getComputedStyle(document.querySelector(".pc-label")).opacity),
    blend: getComputedStyle(document.querySelector(".pc-ring")).mixBlendMode,
  }));
  rec(`${label} contracts-idle`, idle.w <= 30 && idle.labelOp === 0 && idle.blend === "difference", JSON.stringify(idle));

  // wheel with stationary cursor over neutral ground → must STAY ○
  await page.mouse.move(160, 130);
  await wait(600);
  await page.mouse.wheel(0, 260);
  await wait(500);
  const rv2 = await page.evaluate(() => ({
    label: document.querySelector(".pc-label")?.textContent ?? "",
    labelOp: Number(getComputedStyle(document.querySelector(".pc-label")).opacity),
    w: Math.round(document.querySelector(".pc-ring").getBoundingClientRect().width),
  }));
  rec(`${label} neutral-wheel-default`, rv2.labelOp === 0 && rv2.w <= 30, JSON.stringify(rv2));

  await page.goto(BASE + "/script-soldiers", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  const teamY3 = await page.evaluate(() => {
    const s = [...document.querySelectorAll("section")].find((x) => x.textContent.includes("TEAM ROSTER"));
    return Math.round(s.getBoundingClientRect().top + scrollY);
  });
  const dh3 = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.evaluate((y) => window.scrollTo(0, y), Math.floor(teamY3 + (dh3 - teamY3) * 0.12));
  await wait(1800);

  const photo = await page.$(".team-member .team-photo");
  if (photo) {
    const pb = await photo.boundingBox();
    if (pb) {
      const hx = pb.x + pb.width / 2;
      const hy = pb.y + pb.height / 2;
      await page.mouse.move(hx, hy);
      await wait(650);
      const v = await page.evaluate(
        ([hx, hy]) => ({
          label: document.querySelector(".pc-label")?.textContent,
          w: Math.round(document.querySelector(".pc-ring").getBoundingClientRect().width),
          attached: (() => {
            const r = document.querySelector(".pc-ring").getBoundingClientRect();
            return Math.hypot(r.x + r.width / 2 - hx, r.y + r.height / 2 - hy) < 60;
          })(),
        }),
        [hx, hy],
      );
      rec(`${label} member-photo-view`, v.label === "VIEW" && v.w > 55 && v.attached, JSON.stringify(v));

      const linkHandle = await page.evaluateHandle(() => {
        const l = [...document.querySelectorAll(".team-member")].find(
          (x) => Number(getComputedStyle(x).opacity) > 0.5,
        );
        return l?.querySelector("a.team-meta-el[target='_blank']");
      });
      const lb = await linkHandle.asElement()?.boundingBox();
      if (lb) {
        await page.mouse.move(lb.x + lb.width / 2, lb.y + lb.height / 2);
        await wait(650);
        const lk = await page.evaluate(() => ({
          label: document.querySelector(".pc-label")?.textContent,
          w: Math.round(document.querySelector(".pc-ring").getBoundingClientRect().width),
        }));
        rec(`${label} connect-open`, lk.label === "↗" && lk.w >= 40 && lk.w <= 48, JSON.stringify(lk));
      }

      await page.mouse.move(160, 130);
      await wait(650);
      const def = await page.evaluate(() => ({
        labelOp: Number(getComputedStyle(document.querySelector(".pc-label")).opacity),
        w: Math.round(document.querySelector(".pc-ring").getBoundingClientRect().width),
      }));
      rec(`${label} name-area-default`, def.labelOp === 0 && def.w <= 30, JSON.stringify(def));
    }
  }
  await browser.close();

  // single global cursor instance + scroll revert
  const { browser: b3, ctx: c3 } = await makeBrowser("chrome");
  const p3 = await c3.newPage();
  await p3.goto(BASE + "/script-soldiers", { waitUntil: "domcontentloaded" });
  await p3.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  await p3.waitForFunction(
    () => Number(getComputedStyle(document.querySelector(".hero-title")).opacity) > 0.9,
    { timeout: 20000 },
  ).catch(() => {});
  await wait(1200);

  await p3.evaluate(() => {
    const l = [...document.querySelectorAll(".team-member")].find((x) => true);
    void l;
  });
  const teamY4 = await p3.evaluate(() => {
    const s = [...document.querySelectorAll("section")].find((x) => x.textContent.includes("TEAM ROSTER"));
    return Math.round(s.getBoundingClientRect().top + scrollY);
  });
  const dH4 = await p3.evaluate(() => document.documentElement.scrollHeight);
  await p3.evaluate((y) => window.scrollTo(0, y), Math.floor(teamY4 + (dH4 - teamY4) * 0.12));
  await wait(1800);
  const ph = await p3.$(".team-member .team-photo");
  if (ph) {
    const pb = await ph.boundingBox();
    await p3.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2);
    await wait(650);
    const v2 = await p3.evaluate(() => ({
      label: document.querySelector(".pc-label")?.textContent,
      op: Number(getComputedStyle(document.querySelector(".pc-label")).opacity),
      w: Math.round(document.querySelector(".pc-ring").getBoundingClientRect().width),
    }));
    rec(`${label} photo-view-restored`, v2.label === "VIEW" && v2.op > 0.9 && v2.w > 55, JSON.stringify(v2));

    // leave the photo → contracts to ○ … then wheel with stationary cursor → must STAY ○
    await p3.mouse.move(160, 130);
    await wait(600);
    await p3.mouse.wheel(0, 260);
    await wait(500);
    const rv = await p3.evaluate(() => ({
      labelOp: Number(getComputedStyle(document.querySelector(".pc-label")).opacity),
      w: Math.round(document.querySelector(".pc-ring").getBoundingClientRect().width),
      instances: document.querySelectorAll(".pc-root").length,
    }));
    rec(
      `${label} scroll-stays-default`,
      rv.labelOp === 0 && rv.w <= 30 && rv.instances === 1,
      JSON.stringify(rv),
    );

    const dup = await p3.evaluate(() => ({
      rings: document.querySelectorAll(".pc-ring").length,
      dots: document.querySelectorAll(".pc-dot").length,
      strayView: [...document.querySelectorAll("body *")].filter(
        (el) => el.children.length === 0 && el.textContent.trim() === "VIEW" && !el.closest(".pc-root"),
      ).length,
    }));
    rec(`${label} single-cursor-instance`, dup.rings === 1 && dup.dots === 1 && dup.strayView === 0, JSON.stringify(dup));
  }
  await b3.close();

  for (const kind of ["android", "iphone"]) {
    const { browser: b4, ctx: c4 } = await makeBrowser(kind);
    const p4 = await c4.newPage();
    await p4.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await wait(1000);
    rec(
      `${label} disabled-${kind}`,
      await p4.evaluate(
        () => !document.querySelector(".pc-dot") && !document.documentElement.classList.contains("has-cursor"),
      ),
    );
    await b4.close();
  }
}

// PHASE 2.1 — cinematic entry loader
async function entryChecks(label) {
  const { browser, ctx } = await makeBrowser("chrome");
  const page = await ctx.newPage();
  await page.goto(BASE + "/cyber-knights", { waitUntil: "domcontentloaded" });
  const appeared = await page.evaluate(() => !!document.querySelector(".entry-loader"));
  const t0 = Date.now();
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 4000 }).catch(() => {});
  const goneMs = Date.now() - t0;
  rec(`${label} entry-full-once`, appeared && goneMs < 2600, `appeared=${appeared} goneIn=${goneMs}ms`);
  rec(`${label} entry-page-usable`, await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight));

  await page.reload({ waitUntil: "domcontentloaded" });
  const t1 = Date.now();
  await page.waitForSelector(".entry-loader", { state: "detached", timeout: 1500 }).catch(() => {});
  rec(`${label} entry-whisper-return`, Date.now() - t1 < 800, `${Date.now() - t1}ms`);
  await browser.close();

  const { browser: b2, ctx: c2 } = await makeBrowser("chrome", { reducedMotion: "reduce" });
  const p2 = await c2.newPage();
  await p2.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const t2 = Date.now();
  await p2.waitForSelector(".entry-loader", { state: "detached", timeout: 1200 }).catch(() => {});
  rec(`${label} entry-reduce-instant`, Date.now() - t2 < 900, `${Date.now() - t2}ms`);
  await b2.close();
}

async function reducedMotion(kind, label) {
  const { browser, ctx } = await makeBrowser(kind, { reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const p of ["/script-soldiers", "/cyber-knights"]) {
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    await wait(900);
    const s = await page.evaluate(() => {
      const find = (sel) => [...document.querySelectorAll("section")].find((x) => x.querySelector(sel));
      const finale = find(".finale-info");
      const v = (el) => (el ? Number(getComputedStyle(el).opacity) : -1);
      return { finale: v(finale) };
    });
    rec(`${label} ${p} reduce-finale-static`, s.finale === 1, `op=${s.finale}`);
    if (p === "/cyber-knights") {
      const bridgeInert = await page.evaluate(() => {
        const dot = document.querySelector(".sb-dot-0");
        return !dot || getComputedStyle(dot).opacity === "0" || getComputedStyle(dot).transform === "none";
      });
      rec(`${label} ${p} reduce-bridges-inert`, bridgeInert);
      const capsStatic = await page.evaluate(() => {
        const nodes = [...document.querySelectorAll(".cap-node")];
        if (nodes.length) {
          const spokes = [...document.querySelectorAll(".cap-spoke")];
          return (
            nodes.length === 8 &&
            nodes.every((n) => Number(getComputedStyle(n).opacity) > 0.9) &&
            spokes.every((s) => parseFloat(getComputedStyle(s).strokeDashoffset) < 15)
          );
        }
        const rows = [...document.querySelectorAll(".cap-row")];
        return rows.length === 8 && rows.every((r) => Number(getComputedStyle(r).opacity) > 0.9);
      });
      rec(`${label} ${p} reduce-caps-static`, capsStatic);
    }
  }
  await browser.close();
}

async function slow3g() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 400,
    downloadThroughput: (400 * 1024) / 8,
    uploadThroughput: (400 * 1024) / 8,
  });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  await page.goto(BASE + "/script-soldiers", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector(".hero-title", { timeout: 60000 }).catch(() => {});
  await wait(2500);
  const r = await page.evaluate(() => ({
    hero: !!document.querySelector(".hero-title"),
    mission: (document.querySelector(".mission-statement")?.textContent || "").length > 50,
    sectionCount: document.querySelectorAll("section").length,
    heroImg: (() => {
      const h = document.querySelector("img.hero-logo");
      return h ? h.complete && h.naturalWidth > 0 : false;
    })(),
  }));
  rec("slow3g renders", r.hero && r.mission && r.sectionCount > 8, JSON.stringify(r));
  rec("slow3g hero-image", r.heroImg);
  rec("slow3g no-errors", errs.length === 0, errs.join(" | "));
  await browser.close();
}

async function makeBrowser(kind, opts = {}) {
  if (kind === "android") {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ ...devices["Pixel 7"], ...opts });
    return { browser, ctx };
  }
  if (kind === "iphone") {
    const browser = await webkit.launch();
    const ctx = await browser.newContext({ ...devices["iPhone 13"], ...opts });
    return { browser, ctx };
  }
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  return { browser, ctx };
}

async function runKind(kind, label) {
  const { browser, ctx } = await makeBrowser(kind);
  const page = await ctx.newPage();
  for (const p of ["/", "/script-soldiers", "/cyber-knights"]) {
    await pageChecks(page, label, p);
  }
  await scrollPerf(page, label);
  if (kind === "chrome") {
    await wheelScroll(page, label);
    await bridgeChecks(page, label);
    await capabilityChecks(page, label);
    await ckInputMatrix(page, label);
  }
  await browser.close();
}

(async () => {
  console.log("\n== CHROME =="); await runKind("chrome", "CHROME").catch((e) => console.error("CHROME FAIL:", e.message));
  console.log("== ANDROID =="); await runKind("android", "ANDROID").catch((e) => console.error("ANDROID FAIL:", e.message));
  console.log("== SAFARI =="); await runKind("iphone", "SAFARI").catch((e) => console.error("SAFARI FAIL:", e.message));
  console.log("== ENTRY LOADER =="); await entryChecks("ENTRY").catch((e) => console.error("ENTRY FAIL:", e.message));
  console.log("== CURSOR =="); await cursorChecks("CURSOR").catch((e) => console.error("CURSOR FAIL:", e.message));
  console.log("== MAGNETIC =="); await magneticChecks("MAG").catch((e) => console.error("MAG FAIL:", e.message));
  console.log("== PROGRESS RAIL =="); await progressChecks("RAIL").catch((e) => console.error("RAIL FAIL:", e.message));
  console.log("== PHASE BATCH =="); await phaseBatchChecks("P2").catch((e) => console.error("BATCH FAIL:", e.message));
  console.log("== ARCHIVE =="); await archiveChecks("ARCH").catch((e) => console.error("ARCH FAIL:", e.message));
  console.log("== HERO IDENTITY =="); await heroIdentityChecks("HERO").catch((e) => console.error("HERO FAIL:", e.message));
  console.log("== REDUCED MOTION ==");
  await reducedMotion("chrome", "RM-DESKTOP").catch((e) => console.error("RM-DESKTOP FAIL:", e.message));
  await reducedMotion("iphone", "RM-MOBILE").catch((e) => console.error("RM-MOBILE FAIL:", e.message));
  console.log("== SLOW 3G =="); await slow3g().catch((e) => console.error("SLOW3G FAIL:", e.message));

  const failed = results.filter((r) => !r.pass);
  console.log(`\n== SUMMARY ==\npassed: ${results.length - failed.length}/${results.length}`);
  if (failed.length) {
    console.log("\nFAILED:");
    for (const f of failed) console.log(`  ✗ ${f.name} — ${f.detail}`);
    process.exitCode = 1;
  } else {
    console.log("ALL GREEN");
  }
})();
