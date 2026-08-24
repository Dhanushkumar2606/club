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
  rec(`${label} ck-matrix keyboard-arrow`, kb > 40, `scrollY=${kb}`);

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

    await p3.evaluate(() => window.dispatchEvent(new WheelEvent("wheel", { deltaY: 240 })));
    await wait(450);
    const rv = await p3.evaluate(() => ({
      labelOp: Number(getComputedStyle(document.querySelector(".pc-label")).opacity),
      w: Math.round(document.querySelector(".pc-ring").getBoundingClientRect().width),
      instances: document.querySelectorAll(".pc-root").length,
    }));
    rec(
      `${label} scroll-revert`,
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
