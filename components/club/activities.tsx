"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { useIsMobile } from "@/lib/use-is-mobile";
import { CodeFragment } from "@/components/shared/code";
import { SectionLabel } from "@/components/shared/typography";

type ActivityVisual =
  | "code"
  | "web"
  | "app"
  | "ai"
  | "git"
  | "timer"
  | "net"
  | "scan"
  | "timeline"
  | "cipher"
  | "rings"
  | "radar";

export type ActivityPanelData = {
  index: string;
  title: string;
  kicker: string;
  visual: ActivityVisual;
};

export const SS_PANELS: ActivityPanelData[] = [
  {
    index: "01",
    title: "PROGRAMMING",
    kicker: "// COMPETITIVE PROGRAMMING",
    visual: "code",
  },
  {
    index: "02",
    title: "WEB",
    kicker: "// WEB DEVELOPMENT",
    visual: "web",
  },
  {
    index: "03",
    title: "APP",
    kicker: "// APP DEVELOPMENT",
    visual: "app",
  },
  {
    index: "04",
    title: "AI",
    kicker: "// MACHINE LEARNING",
    visual: "ai",
  },
  {
    index: "05",
    title: "OPEN SOURCE",
    kicker: "// OPEN SOURCE",
    visual: "git",
  },
  {
    index: "06",
    title: "HACKATHONS",
    kicker: "// HACKATHONS",
    visual: "timer",
  },
];

function CodeVisual() {
  return (
    <CodeFragment
      title="forge/core.c"
      className="w-72 sm:w-80"
      lines={[
        [
          { text: "int ", tone: "accent" },
          { text: "solve", tone: "plain" },
          { text: "(void) {" },
        ],
        [{ text: "  int ans = 0;" }],
        [
          { text: "  while (", tone: "dim" },
          { text: "code", tone: "accent" },
          { text: ") {" },
        ],
        [
          { text: "    ans += ", tone: "plain" },
          { text: "logic", tone: "accent" },
          { text: "();" },
        ],
        [{ text: "  }" }],
        [{ text: "  return ans;" }],
        [{ text: "}" }],
      ]}
    />
  );
}

function WebVisual() {
  return (
    <div className="w-72 border border-accent/25 bg-forge-navy/40 sm:w-80">
      <div className="flex items-center gap-2 border-b border-accent/20 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-accent/70" />
        <span className="h-2 w-2 rounded-full bg-ivory-dim/40" />
        <span className="h-2 w-2 rounded-full bg-ivory-dim/20" />
        <span className="ml-3 flex-1 truncate border border-accent/20 px-2 py-0.5 font-mono text-[10px] text-ivory-dim">
          ss.dev/web
        </span>
      </div>
      <div className="flex flex-col gap-2.5 px-4 py-5">
        <div className="h-2 w-3/4 rounded bg-accent/50" />
        <div className="h-2 w-1/2 rounded bg-ivory-dim/30" />
        <div className="my-1 h-px w-full bg-ivory-dim/15" />
        <div className="h-2 w-2/3 rounded bg-ivory-dim/25" />
        <div className="h-2 w-5/6 rounded bg-ivory-dim/25" />
        <div className="h-2 w-2/5 rounded bg-ivory-dim/20" />
      </div>
    </div>
  );
}

function AppVisual() {
  return (
    <div className="w-40 rounded-[2rem] border border-accent/30 bg-forge-navy/40 p-2.5">
      <div className="rounded-[1.6rem] border border-accent/15 px-4 py-4">
        <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-ivory-dim/30" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-md ${
                i === 4 ? "bg-accent" : "bg-ivory-dim/25"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AiVisual() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const mobile = useIsMobile();

  // forge mind — 3-4-1 layered network, animated signal flow, interactive focus
  const L0 = [
    { x: 52, y: 36, label: "PIXEL" },
    { x: 52, y: 80, label: "TEXT" },
    { x: 52, y: 124, label: "SIGNAL" },
  ];
  const L1 = [
    { x: 160, y: 22 },
    { x: 160, y: 62 },
    { x: 160, y: 98 },
    { x: 160, y: 138 },
  ];
  const L2 = { x: 268, y: 80, label: "CLASS" };
  const INPUT_LABELS = ["PIXEL", "TEXT", "SIGNAL"];

  useGSAP(
    () => {
      const el = wrapRef.current;
      if (!el) return;

      const svg = el.querySelector<SVGSVGElement>(".ai-svg");
      const lines = el.querySelectorAll<SVGLineElement>(".ai-line");
      const nodes = el.querySelectorAll<HTMLElement>(".ai-node");
      const dots = el.querySelectorAll<HTMLElement>(".ai-dot");
      const epochBar = el.querySelector<HTMLElement>(".ai-epoch-bar");
      const lossEl = el.querySelector<HTMLElement>(".ai-loss");
      const accEl = el.querySelector<HTMLElement>(".ai-acc");
      const readout = el.querySelector<HTMLElement>(".ai-readout");
      const readoutTitle = el.querySelector<HTMLElement>(".ai-readout-title");
      const readoutDesc = el.querySelector<HTMLElement>(".ai-readout-desc");
      if (!svg || !lines.length) return;

      const isReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      // initial state
      if (isReduce) {
        gsap.set(lines, { strokeDashoffset: 0, opacity: 1 });
        gsap.set(nodes, { autoAlpha: 1, scale: 1 });
        gsap.set(dots, { autoAlpha: 1, scale: 1 });
        if (epochBar) gsap.set(epochBar, { scaleX: 1 });
        return;
      }

      gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 1, attr: { "stroke-opacity": 0.55 } } as unknown as gsap.TweenVars);
      gsap.set(nodes, { autoAlpha: 0, scale: 0.6, transformOrigin: "center" });
      gsap.set(dots, { autoAlpha: 0, scale: 0.6 });
      if (epochBar) gsap.set(epochBar, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
      });
      tl.to(lines, { strokeDashoffset: 0, duration: 0.6, stagger: 0.02, ease: "power2.out" }, 0)
        .to(nodes, { autoAlpha: 1, scale: 1, duration: 0.35, stagger: 0.03, ease: "back.out(1.2)" }, 0.2)
        .to(dots, { autoAlpha: 1, scale: 1, duration: 0.25, stagger: 0.02 }, 0.3);
      if (epochBar) tl.to(epochBar, { scaleX: 1, duration: 0.9, ease: "power2.out" }, 0.4);

      // loss count-down + acc count-up idle
      if (lossEl && accEl) {
        const lossObj = { v: 0.42 };
        gsap.to(lossObj, {
          v: 0.12,
          duration: 2.2,
          delay: 0.6,
          ease: "power2.out",
          onUpdate: () => {
            if (lossEl) lossEl.textContent = lossObj.v.toFixed(2);
          },
        });
        const accObj = { v: 68 };
        gsap.to(accObj, {
          v: 94,
          duration: 2.0,
          delay: 0.7,
          ease: "power2.out",
          snap: { v: 1 },
          onUpdate: () => {
            if (accEl) accEl.textContent = `ACC ${Math.round(accObj.v)}%`;
          },
        });
      }

      // data pulses along random lines
      const pulseEls = el.querySelectorAll<SVGCircleElement>(".ai-pulse");
      const lineArr = Array.from(lines) as SVGLineElement[];
      let pIdx = 0;
      let pulseActive = true;
      const fire = () => {
        if (!pulseActive || !pulseEls.length) return;
        const pe = pulseEls[pIdx % pulseEls.length] as SVGCircleElement;
        pIdx++;
        const ln = lineArr[Math.floor(Math.random() * lineArr.length)];
        if (!pe || !ln) return;
        const len = (ln as unknown as { getTotalLength: () => number }).getTotalLength?.() ?? 120;
        const dur = 1.35 + Math.random() * 0.7;
        gsap.set(pe, { opacity: 0 });
        gsap.fromTo(pe, { opacity: 0 }, { opacity: 0.95, duration: 0.15 });
        const o = { t: 0 };
        gsap.to(o, {
          t: 1,
          duration: dur,
          ease: "none",
          onUpdate: () => {
            const pt = (ln as unknown as { getPointAtLength: (n: number) => { x: number; y: number } }).getPointAtLength(o.t * len);
            pe.setAttribute("cx", String(pt.x));
            pe.setAttribute("cy", String(pt.y));
          },
          onComplete: () => {
            gsap.to(pe, {
              opacity: 0,
              duration: 0.2,
              onComplete: () => {
                if (pulseActive) gsap.delayedCall(0.9 + Math.random() * 1.2, fire);
              },
            });
          },
        });
      };
      const startPulses = () => {
        pulseActive = true;
        fire();
        if (!isMobile) gsap.delayedCall(0.9, fire);
      };
      // start once built
      ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        once: true,
        onEnter: startPulses,
      });
      // fallback if already in view
      gsap.delayedCall(0.9, () => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) startPulses();
      });

      // hover / focus interaction — desktop fine pointer only
      if (!isMobile && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const allLines = Array.from(lines) as SVGLineElement[];
        const allNodes = Array.from(nodes) as HTMLElement[];
        const allDots = Array.from(dots) as HTMLElement[];

        const setDim = (active: Element | null) => {
          const isActive = (el: Element) => el === active;
          allNodes.forEach((n) => {
            const on = active === null || isActive(n);
            gsap.to(n, { opacity: on ? 1 : 0.28, duration: 0.28, overwrite: "auto" });
          });
          allDots.forEach((d, i) => {
            const parentNode = allNodes[i];
            const on = active === null || (parentNode && isActive(parentNode));
            gsap.to(d, { opacity: on ? 1 : 0.32, duration: 0.28, overwrite: "auto" });
          });
          allLines.forEach((ln) => {
            const sIdx = Number(ln.dataset.si ?? -1);
            const sLayer = ln.dataset.sl;
            const tIdx = Number(ln.dataset.ti ?? -1);
            let highlight = false;
            if (active) {
              const aLayer = active.getAttribute("data-layer");
              const aIdx = Number(active.getAttribute("data-idx"));
              if (aLayer === "input" && sLayer === "input" && sIdx === aIdx) highlight = true;
              if (aLayer === "hidden") {
                if ((sLayer === "input" && tIdx === aIdx) || (sLayer === "hidden" && sIdx === aIdx)) highlight = true;
              }
              if (aLayer === "output" && sLayer === "hidden") highlight = true;
            }
            gsap.to(ln, {
              attr: { "stroke-opacity": active === null ? 0.55 : highlight ? 1 : 0.14 },
              duration: 0.28,
              overwrite: "auto",
            });
          });
        };

        const showReadout = (node: Element) => {
          if (!readout || !readoutTitle || !readoutDesc) return;
          const layer = node.getAttribute("data-layer");
          const idx = Number(node.getAttribute("data-idx"));
          let title = "";
          let desc = "";
          if (layer === "input") {
            title = INPUT_LABELS[idx] ?? "INPUT";
            desc = ["Image patches → 16×16 tokens", "Tokenizer → 512 dim embeddings", "Sensor stream → FFT features"][idx] ?? "";
          } else if (layer === "hidden") {
            title = `HIDDEN ${String(idx + 1).padStart(2, "0")}`;
            desc = ["Edge & texture filters", "Shape & pattern assembly", "Context aggregation", "Decision projection"][idx] ?? "";
          } else {
            title = "OUTPUT";
            desc = "Softmax → class logits → calibrated confidence";
          }
          readoutTitle.textContent = title;
          readoutDesc.textContent = desc;
          gsap.to(readout, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" });
        };
        const hideReadout = () => {
          if (!readout) return;
          gsap.to(readout, { autoAlpha: 0, y: 6, duration: 0.22, ease: "power2.in" });
        };

        const onEnter = (e: Event) => {
          const target = e.target as Element;
          const node = target.closest(".ai-node");
          if (!node || !(node instanceof Element)) return;
          setDim(node);
          const dot = node.querySelector(".ai-dot");
          if (dot) gsap.to(dot, { scale: 1.35, duration: 0.28, transformOrigin: "center" });
          showReadout(node);
          // burst one extra pulse along its fan
          const linesForNode: SVGLineElement[] = [];
          const layer = node.getAttribute("data-layer");
          const idx = Number(node.getAttribute("data-idx"));
          allLines.forEach((ln) => {
            const sl = ln.dataset.sl;
            const si = Number(ln.dataset.si);
            const ti = Number(ln.dataset.ti);
            if (layer === "input" && sl === "input" && si === idx) linesForNode.push(ln);
            if (layer === "hidden" && ((sl === "input" && ti === idx) || (sl === "hidden" && si === idx))) linesForNode.push(ln);
            if (layer === "output" && sl === "hidden") linesForNode.push(ln);
          });
          if (linesForNode.length) {
            const ln = linesForNode[Math.floor(Math.random() * linesForNode.length)];
            const pe = pulseEls[pIdx % pulseEls.length] as SVGCircleElement;
            pIdx++;
            if (ln && pe) {
              const len = (ln as unknown as { getTotalLength: () => number }).getTotalLength();
              gsap.set(pe, { opacity: 0.95 });
              const o2 = { t: 0 };
              gsap.to(o2, {
                t: 1,
                duration: 0.9,
                ease: "power2.in",
                onUpdate: () => {
                  const pt = (ln as unknown as { getPointAtLength: (n: number) => { x: number; y: number } }).getPointAtLength(o2.t * len);
                  pe.setAttribute("cx", String(pt.x));
                  pe.setAttribute("cy", String(pt.y));
                },
                onComplete: () => gsap.to(pe, { opacity: 0, duration: 0.2 }),
              });
            }
          }
        };
        const onLeave = (e: Event) => {
          const target = e.target as Element;
          const node = target.closest(".ai-node");
          if (!node) return;
          const related = (e as PointerEvent).relatedTarget as Element | null;
          if (related && related.closest && related.closest(".ai-node") === node) return;
          setDim(null);
          allNodes.forEach((n) => {
            const d = n.querySelector(".ai-dot");
            if (d) gsap.to(d, { scale: 1, duration: 0.28 });
          });
          hideReadout();
        };
        const onClickInput = (e: Event) => {
          const node = (e.target as Element).closest(".ai-node[data-layer='input']");
          if (!node) return;
          // cycle label PIXEL→TEXT→SIGNAL→PIXEL visually just bump
          const labelEl = node.querySelector(".ai-node-label");
          if (labelEl) {
            const cur = labelEl.textContent?.trim() ?? "";
            const next = INPUT_LABELS[(INPUT_LABELS.indexOf(cur) + 1) % INPUT_LABELS.length] ?? cur;
            labelEl.textContent = next;
            gsap.fromTo(labelEl, { scale: 0.9, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.32, ease: "back.out(1.4)" });
          }
          // nudge accuracy up slightly
          if (accEl) {
            const cur = parseInt((accEl.textContent ?? "94").replace(/\D/g, "")) || 94;
            const nxt = Math.min(99, cur + 1);
            gsap.to({ v: cur }, {
              v: nxt,
              duration: 0.5,
              snap: { v: 1 },
              onUpdate: function () {
                accEl.textContent = `ACC ${Math.round((this.targets()[0] as { v: number }).v)}%`;
              },
            });
          }
        };

        el.addEventListener("pointerover", onEnter);
        el.addEventListener("pointerout", onLeave);
        el.addEventListener("click", onClickInput);

        // keyboard focus mirrors hover
        allNodes.forEach((n) => {
          n.addEventListener("focus", () => {
            setDim(n);
            showReadout(n);
          });
          n.addEventListener("blur", () => {
            setDim(null);
            hideReadout();
          });
        });

        return () => {
          el.removeEventListener("pointerover", onEnter);
          el.removeEventListener("pointerout", onLeave);
          el.removeEventListener("click", onClickInput);
          pulseActive = false;
        };
      }

      return () => {
        pulseActive = false;
      };
    },
    { scope: wrapRef, dependencies: [reduce, mobile] },
  );

  return (
    <div ref={wrapRef} className="relative w-72 sm:w-80">
      <div className="corner-ticks border border-accent/25 bg-forge-navy/40 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <span className="mono-label text-[9px] tracking-[0.2em] text-accent">FORGE MIND // ML CORE</span>
          <span className="flex items-center gap-1.5 mono-label text-[9px] text-ivory-dim/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            LIVE
          </span>
        </div>

        <div className="ai-readout pointer-events-none absolute right-3 top-10 z-10 w-36 border border-accent/30 bg-forge-navy/80 p-2 opacity-0 backdrop-blur-sm sm:w-40">
          <p className="ai-readout-title mono-label text-[9px] text-accent">HOVER A NODE</p>
          <p className="ai-readout-desc mt-1 text-[11px] leading-4 text-ivory/70">Interactive signal flow — hover or tap inputs</p>
        </div>

        <svg
          viewBox="0 0 320 160"
          className="ai-svg mt-3 h-[160px] w-full overflow-visible"
          role="img"
          aria-label="Interactive neural network: input hidden output layers with signal flow"
        >
          {/* layer backbones */}
          <g opacity="0.06" stroke="var(--accent)" strokeWidth="0.7">
            <line x1="52" y1="14" x2="52" y2="146" strokeDasharray="2 4" />
            <line x1="160" y1="14" x2="160" y2="146" strokeDasharray="2 4" />
            <line x1="268" y1="14" x2="268" y2="146" strokeDasharray="2 4" />
          </g>

          {/* dense connections input→hidden */}
          <g className="ai-lines">
            {L0.map((s, si) =>
              L1.map((t, ti) => (
                <line
                  key={`ih-${si}-${ti}`}
                  className="ai-line"
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke="color-mix(in srgb, var(--accent) 52%, transparent)"
                  strokeWidth={0.9}
                  pathLength={1}
                  style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                  data-sl="input"
                  data-si={si}
                  data-ti={ti}
                />
              )),
            ).flat()}
            {L1.map((s, si) => (
              <line
                key={`ho-${si}`}
                className="ai-line"
                x1={s.x}
                y1={s.y}
                x2={L2.x}
                y2={L2.y}
                stroke="color-mix(in srgb, var(--accent) 58%, transparent)"
                strokeWidth={1.15}
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                data-sl="hidden"
                data-si={si}
              />
            ))}
          </g>

          {/* pulses */}
          <circle className="ai-pulse" r="2.6" fill="#e4be68" opacity="0" />
          <circle className="ai-pulse" r="2.6" fill="#e4be68" opacity="0" />
          <circle className="ai-pulse" r="2.1" fill="#f4d48a" opacity="0" />

          {/* layer labels */}
          <text x="52" y="10" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono, monospace" fill="color-mix(in srgb, var(--accent) 75%, transparent)" letterSpacing="0.18em">INPUT</text>
          <text x="160" y="10" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono, monospace" fill="color-mix(in srgb, var(--accent) 75%, transparent)" letterSpacing="0.18em">HIDDEN</text>
          <text x="268" y="10" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono, monospace" fill="color-mix(in srgb, var(--accent) 75%, transparent)" letterSpacing="0.18em">OUTPUT</text>
        </svg>

        {/* html nodes over svg for interaction + typography */}
        {[...L0.map((p, i) => ({ ...p, layer: "input" as const, idx: i })), ...L1.map((p, i) => ({ ...p, layer: "hidden" as const, idx: i })), { ...L2, layer: "output" as const, idx: 0 }].map((n) => {
          const left = `${(n.x / 320) * 100}%`;
          const top = `${(n.y / 160) * 100}%`;
          const isInput = n.layer === "input";
          const isOutput = n.layer === "output";
          return (
            <div
              key={`${n.layer}-${n.idx}`}
              className="ai-node group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1 focus-visible:outline-none"
              style={{ left, top }}
              data-layer={n.layer}
              data-idx={n.idx}
              tabIndex={0}
              role="button"
              aria-label={`${n.layer} node ${n.idx + 1}${isInput ? ` ${(n as typeof L0[number]).label}` : ""}`}
            >
              <span className={`ai-dot block rounded-full border bg-forge-navy transition-transform duration-300 ${isOutput ? "h-[13px] w-[13px] border-accent bg-accent shadow-[0_0_14px_color-mix(in_srgb,var(--accent)_60%,transparent)]" : "h-[9px] w-[9px] border-accent bg-origin-900"} ${isInput ? "group-hover:scale-110" : ""}`} />
              {isInput && (
                <span className="ai-node-label whitespace-nowrap font-mono text-[7px] tracking-[0.16em] text-ivory/80">{(n as typeof L0[number]).label}</span>
              )}
              {n.layer === "hidden" && (
                <span className="font-mono text-[6px] tracking-[0.16em] text-accent/70">H{String(n.idx + 1).padStart(2, "0")}</span>
              )}
              {isOutput && <span className="font-mono text-[7px] tracking-[0.16em] text-accent">OUT</span>}
            </div>
          );
        })}

        <div className="mt-4 flex flex-col gap-2 border-t border-accent/15 pt-3">
          <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em]">
            <span className="text-ivory-dim/50">EPOCH</span>
            <span className="ai-epoch text-ivory/80">03 / 12</span>
          </div>
          <div className="h-1 overflow-hidden bg-ivory-dim/15">
            <div className="ai-epoch-bar h-full w-full origin-left bg-accent" />
          </div>
          <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em]">
            <span className="text-ivory-dim/60">
              LOSS <span className="ai-loss text-accent">0.12</span>
            </span>
            <span className="ai-acc text-accent">ACC 94%</span>
          </div>
          <p className="mono-label text-center text-[8px] tracking-[0.16em] text-ivory-dim/40">HOVER NODES • TAP INPUTS TO CYCLE</p>
        </div>
      </div>
    </div>
  );
}

function GitVisual() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const mobile = useIsMobile();

  // PR pipeline — trunk + two feature branches, commits, PR badges, merge pulse
  const trunkCommits = [
    { y: 28, id: "a1b2c3", msg: "init: scaffold" },
    { y: 62, id: "d4e5f6", msg: "feat: auth" },
    { y: 118, id: "m6n7o8", msg: "merge: ui → main" },
  ];
  const branchA = {
    y0: 68,
    y1: 42,
    commits: [
      { x: 152, id: "b1c2d3", msg: "ui: hero" },
      { x: 182, id: "e4f5g6", msg: "ui: cards" },
      { x: 212, id: "h7i8j9", msg: "ui: polish" },
    ],
    pr: { x: 182, label: "PR #12", status: "OPEN" as const },
  };
  const branchB = {
    y0: 98,
    y1: 88,
    commits: [
      { x: 152, id: "k1l2m3", msg: "api: routes" },
      { x: 186, id: "n4o5p6", msg: "api: cache" },
    ],
    pr: { x: 168, label: "PR #13", status: "MERGED" as const },
  };

  useGSAP(
    () => {
      const el = wrapRef.current;
      if (!el) return;
      const lines = el.querySelectorAll<SVGPathElement>(".os-line");
      const commits = el.querySelectorAll<HTMLElement>(".os-commit");
      const prs = el.querySelectorAll<HTMLElement>(".os-pr");
      const statsCommits = el.querySelector<HTMLElement>(".os-stat-commits");
      const statsPrs = el.querySelector<HTMLElement>(".os-stat-prs");
      const readout = el.querySelector<HTMLElement>(".os-readout");
      const readoutTitle = el.querySelector<HTMLElement>(".os-readout-title");
      const readoutDesc = el.querySelector<HTMLElement>(".os-readout-desc");
      if (!lines.length) return;

      const isReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      if (isReduce) {
        gsap.set(lines, { strokeDashoffset: 0, opacity: 1 });
        gsap.set(commits, { autoAlpha: 1, scale: 1 });
        gsap.set(prs, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 1 } as unknown as gsap.TweenVars);
      gsap.set(commits, { autoAlpha: 0, scale: 0.6, transformOrigin: "center" });
      gsap.set(prs, { autoAlpha: 0, y: 6 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
      });
      tl.to(lines, { strokeDashoffset: 0, duration: 0.7, stagger: 0.08, ease: "power2.out" }, 0)
        .to(commits, { autoAlpha: 1, scale: 1, duration: 0.32, stagger: 0.04, ease: "back.out(1.3)" }, 0.22)
        .to(prs, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" }, 0.42);

      // live pulse along trunk + branches
      const pulseEls = el.querySelectorAll<SVGCircleElement>(".os-pulse");
      const lineArr = Array.from(lines) as SVGPathElement[];
      let pIdx = 0;
      let active = true;
      const fire = () => {
        if (!active || !pulseEls.length) return;
        const pe = pulseEls[pIdx % pulseEls.length] as SVGCircleElement;
        pIdx++;
        // prefer branch lines for visual interest, but include trunk
        const pool = lineArr.filter((ln) => ln.classList.contains("os-branch") || ln.classList.contains("os-trunk"));
        const ln = pool[Math.floor(Math.random() * pool.length)] ?? lineArr[0];
        if (!pe || !ln) return;
        const len = (ln as unknown as { getTotalLength: () => number }).getTotalLength();
        const dur = 1.2 + Math.random() * 0.8;
        gsap.set(pe, { opacity: 0.95 });
        const o = { t: 0 };
        gsap.to(o, {
          t: 1,
          duration: dur,
          ease: "none",
          onUpdate: () => {
            const pt = (ln as unknown as { getPointAtLength: (n: number) => { x: number; y: number } }).getPointAtLength(o.t * len);
            pe.setAttribute("cx", String(pt.x));
            pe.setAttribute("cy", String(pt.y));
          },
          onComplete: () => {
            gsap.to(pe, {
              opacity: 0,
              duration: 0.22,
              onComplete: () => {
                if (active) gsap.delayedCall(0.85 + Math.random() * 1.1, fire);
              },
            });
          },
        });
      };
      const startPulses = () => {
        active = true;
        fire();
        if (!isMobile) gsap.delayedCall(0.85, fire);
      };
      ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: startPulses });
      gsap.delayedCall(0.95, () => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) startPulses();
      });

      if (!isMobile && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const allCommits = Array.from(commits) as HTMLElement[];
        const allLines = Array.from(lines) as SVGPathElement[];

        const highlightCommit = (elCommit: Element | null) => {
          const id = elCommit?.getAttribute("data-id");
          allCommits.forEach((c) => {
            const on = !id || c.getAttribute("data-id") === id;
            gsap.to(c, { opacity: on ? 1 : 0.32, scale: on ? 1 : 0.9, duration: 0.26, overwrite: "auto" });
          });
          allLines.forEach((ln) => {
            const owns = ln.getAttribute("data-owns");
            const on = !id || (owns && owns.split(",").includes(id ?? ""));
            gsap.to(ln, { attr: { "stroke-opacity": !id ? 0.62 : on ? 1 : 0.16 }, duration: 0.26, overwrite: "auto" });
          });
        };

        const highlightPr = (prEl: Element | null) => {
          if (!prEl) {
            highlightCommit(null);
            return;
          }
          const owns = prEl.getAttribute("data-owns") ?? "";
          const ids = owns.split(",");
          allCommits.forEach((c) => {
            const on = ids.includes(c.getAttribute("data-id") ?? "");
            gsap.to(c, { opacity: on ? 1 : 0.3, scale: on ? 1.08 : 0.92, duration: 0.26, overwrite: "auto" });
          });
          allLines.forEach((ln) => {
            const lineOwns = ln.getAttribute("data-owns") ?? "";
            const on = lineOwns.split(",").some((x) => ids.includes(x));
            gsap.to(ln, { attr: { "stroke-opacity": on ? 1 : 0.14 }, duration: 0.26, overwrite: "auto" });
          });
        };

        const show = (title: string, desc: string) => {
          if (!readout || !readoutTitle || !readoutDesc) return;
          readoutTitle.textContent = title;
          readoutDesc.textContent = desc;
          gsap.to(readout, { autoAlpha: 1, y: 0, duration: 0.24, ease: "power2.out" });
        };
        const hide = () => {
          if (!readout) return;
          gsap.to(readout, { autoAlpha: 0, y: 6, duration: 0.2, ease: "power2.in" });
        };

        const onOverCommit = (e: Event) => {
          const t = (e.target as Element).closest(".os-commit");
          if (!(t instanceof Element)) return;
          const dot = t.querySelector(".os-dot");
          if (dot) gsap.to(dot, { scale: 1.35, duration: 0.24, transformOrigin: "center" });
          highlightCommit(t);
          show(`${t.getAttribute("data-id") ?? ""}`, t.getAttribute("data-msg") ?? "");
          // burst pulse on its branch
          const ln = lineArr.find((l) => (l.getAttribute("data-owns") ?? "").includes(t.getAttribute("data-id") ?? ""));
          if (ln) {
            const pe = pulseEls[pIdx % pulseEls.length] as SVGCircleElement;
            pIdx++;
            const len = (ln as unknown as { getTotalLength: () => number }).getTotalLength();
            gsap.set(pe, { opacity: 0.95 });
            const o2 = { t: 0 };
            gsap.to(o2, {
              t: 1,
              duration: 0.85,
              ease: "power2.in",
              onUpdate: () => {
                const pt = (ln as unknown as { getPointAtLength: (n: number) => { x: number; y: number } }).getPointAtLength(o2.t * len);
                pe.setAttribute("cx", String(pt.x));
                pe.setAttribute("cy", String(pt.y));
              },
              onComplete: () => gsap.to(pe, { opacity: 0, duration: 0.18 }),
            });
          }
        };
        const onOutCommit = (e: Event) => {
          const t = (e.target as Element).closest(".os-commit");
          if (!t) return;
          const related = (e as PointerEvent).relatedTarget as Element | null;
          if (related && related.closest && related.closest(".os-commit") === t) return;
          const dot = t.querySelector(".os-dot");
          if (dot) gsap.to(dot, { scale: 1, duration: 0.24 });
          highlightCommit(null);
          hide();
        };
        const onOverPr = (e: Event) => {
          const t = (e.target as Element).closest(".os-pr");
          if (!(t instanceof Element)) return;
          highlightPr(t);
          show(t.getAttribute("data-label") ?? "PR", t.getAttribute("data-desc") ?? "");
        };
        const onOutPr = () => {
          highlightPr(null);
          hide();
        };
        const onClickBranch = (e: Event) => {
          const branch = (e.target as Element).closest("[data-branch]");
          if (!(branch instanceof HTMLElement)) return;
          const branchKey = branch.getAttribute("data-branch");
          // increment stats
          if (statsCommits) {
            const cur = parseInt(statsCommits.textContent?.replace(/\D/g, "") ?? "8") || 8;
            const nxt = Math.min(24, cur + 1);
            statsCommits.textContent = String(nxt).padStart(2, "0");
            gsap.fromTo(statsCommits, { scale: 1.12 }, { scale: 1, duration: 0.28, ease: "back.out(1.6)" });
          }
          if (statsPrs && branchKey === "b") {
            // simulate new commit added to PR #12
            gsap.fromTo(branch, { scale: 0.98 }, { scale: 1, duration: 0.22, ease: "power2.out" });
          }
          // quick burst
          const ln = lineArr.find((l) => l.getAttribute("data-branch") === branchKey);
          if (ln) {
            const pe = pulseEls[pIdx % pulseEls.length] as SVGCircleElement;
            pIdx++;
            const len = (ln as unknown as { getTotalLength: () => number }).getTotalLength();
            gsap.set(pe, { opacity: 0.95 });
            const o3 = { t: 0 };
            gsap.to(o3, {
              t: 1,
              duration: 0.9,
              ease: "power2.in",
              onUpdate: () => {
                const pt = (ln as unknown as { getPointAtLength: (n: number) => { x: number; y: number } }).getPointAtLength(o3.t * len);
                pe.setAttribute("cx", String(pt.x));
                pe.setAttribute("cy", String(pt.y));
              },
              onComplete: () => gsap.to(pe, { opacity: 0, duration: 0.2 }),
            });
          }
        };

        // use delegation on wrapper
        el.addEventListener("pointerover", (e) => {
          const t = e.target as Element;
          if (t.closest(".os-commit")) onOverCommit(e);
          else if (t.closest(".os-pr")) onOverPr(e);
        });
        el.addEventListener("pointerout", (e) => {
          const t = e.target as Element;
          if (t.closest(".os-commit")) onOutCommit(e);
          else if (t.closest(".os-pr")) onOutPr();
        });
        el.addEventListener("click", onClickBranch);
        // keyboard
        allCommits.forEach((c) => {
          c.addEventListener("focus", () => {
            highlightCommit(c);
            show(c.getAttribute("data-id") ?? "", c.getAttribute("data-msg") ?? "");
          });
          c.addEventListener("blur", () => {
            highlightCommit(null);
            hide();
          });
        });

        return () => {
          active = false;
        };
      }

      return () => {
        active = false;
      };
    },
    { scope: wrapRef, dependencies: [reduce, mobile] },
  );

  return (
    <div ref={wrapRef} className="relative w-72 sm:w-80">
      <div className="corner-ticks border border-accent/25 bg-forge-navy/40 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <span className="mono-label text-[9px] tracking-[0.2em] text-accent">FORGE // OPEN SOURCE</span>
          <span className="flex items-center gap-1.5 mono-label text-[9px] text-ivory-dim/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            2 PRS
          </span>
        </div>

        <div className="os-readout pointer-events-none absolute right-3 top-10 z-10 w-40 border border-accent/30 bg-forge-navy/80 p-2 opacity-0 backdrop-blur-sm">
          <p className="os-readout-title mono-label text-[9px] text-accent">HOVER COMMITS</p>
          <p className="os-readout-desc mt-1 text-[11px] leading-4 text-ivory/70">Interactive PR flow — hover commits or PRs</p>
        </div>

        <svg viewBox="0 0 320 160" className="mt-3 h-[160px] w-full overflow-visible" role="img" aria-label="Open source collaboration graph with branches, commits and pull requests">
          {/* trunk */}
          <path
            d="M30 12 V148"
            className="os-line os-trunk"
            fill="none"
            stroke="color-mix(in srgb, var(--accent) 62%, transparent)"
            strokeWidth="2.2"
            pathLength={1}
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            data-owns="a1b2c3,d4e5f6,m6n7o8"
          />
          {/* branch A — feature/ui */}
          <path
            d={`M30 ${branchA.y0} C 78 ${branchA.y0}, 110 ${branchA.y1}, 150 ${branchA.y1} H 228`}
            className="os-line os-branch"
            fill="none"
            stroke="color-mix(in srgb, var(--accent) 42%, transparent)"
            strokeWidth="1.8"
            pathLength={1}
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            data-branch="a"
            data-owns={branchA.commits.map((c) => c.id).join(",")}
          />
          {/* branch B — feature/api */}
          <path
            d={`M30 ${branchB.y0} C 78 ${branchB.y0}, 112 ${branchB.y1}, 148 ${branchB.y1} H 236`}
            className="os-line os-branch"
            fill="none"
            stroke="color-mix(in srgb, var(--ivory) 34%, transparent)"
            strokeWidth="1.6"
            pathLength={1}
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            data-branch="b"
            data-owns={branchB.commits.map((c) => c.id).join(",")}
          />
          {/* pulses */}
          <circle className="os-pulse" r="2.7" fill="#e4be68" opacity="0" />
          <circle className="os-pulse" r="2.7" fill="#e4be68" opacity="0" />
          <circle className="os-pulse" r="2.1" fill="#f4d48a" opacity="0" />

          {/* trunk label */}
          <text x="40" y="18" fill="var(--accent)" fontSize="8.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.12em">main</text>
          <text x="150" y="34" fill="color-mix(in srgb, var(--accent) 68%, transparent)" fontSize="7" fontFamily="JetBrains Mono, monospace" letterSpacing="0.14em">feature/ui</text>
          <text x="148" y="102" fill="color-mix(in srgb, var(--ivory) 58%, transparent)" fontSize="7" fontFamily="JetBrains Mono, monospace" letterSpacing="0.14em">feature/api</text>

          {/* merge markers */}
          <g opacity="0.9">
            <line x1="30" y1={branchA.y1} x2="30" y2={branchA.y1} stroke="var(--accent)" strokeWidth="1.2" />
            <circle cx="30" cy={branchA.y1} r="2.2" fill="var(--accent)" stroke="#101923" strokeWidth="1" />
            <line x1="30" y1={branchB.y1} x2="30" y2={branchB.y1} stroke="var(--accent)" strokeWidth="1.2" />
            <circle cx="30" cy={branchB.y1} r="2.2" fill="var(--accent)" stroke="#101923" strokeWidth="1" />
          </g>
        </svg>

        {/* html commits over svg */}
        {trunkCommits.map((c) => (
          <div
            key={c.id}
            className="os-commit group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-1.5 focus-visible:outline-none"
            style={{ left: "9.4%", top: `${(c.y / 160) * 100}%` }}
            data-id={c.id}
            data-msg={c.msg}
            tabIndex={0}
            role="button"
            aria-label={`commit ${c.id} ${c.msg}`}
          >
            <span className="os-dot block h-[9px] w-[9px] rounded-full border border-accent bg-accent shadow-[0_0_10px_color-mix(in_srgb,var(--accent)_45%,transparent)] transition-transform duration-300 group-hover:scale-125" />
            <span className="hidden font-mono text-[7px] tracking-[0.14em] text-ivory/75 sm:block">{c.id}</span>
          </div>
        ))}
        {branchA.commits.map((c) => (
          <div
            key={c.id}
            className="os-commit group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1 focus-visible:outline-none"
            style={{ left: `${(c.x / 320) * 100}%`, top: `${(branchA.y1 / 160) * 100}%` }}
            data-id={c.id}
            data-msg={c.msg}
            tabIndex={0}
            role="button"
            aria-label={`commit ${c.id} ${c.msg}`}
          >
            <span className="os-dot block h-[8px] w-[8px] rounded-full border border-accent bg-forge-navy transition-transform duration-300 group-hover:scale-125" />
            <span className="font-mono text-[6px] tracking-[0.14em] text-ivory/65">{c.id.slice(0, 4)}</span>
          </div>
        ))}
        {branchB.commits.map((c) => (
          <div
            key={c.id}
            className="os-commit group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1 focus-visible:outline-none"
            style={{ left: `${(c.x / 320) * 100}%`, top: `${(branchB.y1 / 160) * 100}%` }}
            data-id={c.id}
            data-msg={c.msg}
            tabIndex={0}
            role="button"
            aria-label={`commit ${c.id} ${c.msg}`}
          >
            <span className="os-dot block h-[7.5px] w-[7.5px] rounded-full border border-accent/80 bg-origin-900 transition-transform duration-300 group-hover:scale-125" />
            <span className="font-mono text-[6px] tracking-[0.14em] text-ivory/60">{c.id.slice(0, 4)}</span>
          </div>
        ))}

        {/* PR badges */}
        <div
          className="os-pr absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-1.5 border border-accent/30 bg-forge-navy/90 px-2 py-1 backdrop-blur-sm transition-colors hover:border-accent hover:bg-forge-navy"
          style={{ left: "68%", top: "21%" }}
          data-label={branchA.pr.label}
          data-desc="feature/ui → main • 3 commits • review • +42 −8"
          data-owns={branchA.commits.map((c) => c.id).join(",")}
          tabIndex={0}
          role="button"
          aria-label="PR 12 open"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[8px] tracking-[0.16em] text-accent">{branchA.pr.label}</span>
          <span className="rounded bg-accent px-1 py-0.5 font-mono text-[7px] tracking-[0.12em] text-forge-navy">OPEN</span>
        </div>
        <div
          className="os-pr absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-1.5 border border-accent/25 bg-forge-navy/80 px-2 py-1 backdrop-blur-sm transition-colors hover:border-accent"
          style={{ left: "66%", top: "63%" }}
          data-label={branchB.pr.label}
          data-desc="feature/api → main • 2 commits • merged • +31 −12"
          data-owns={branchB.commits.map((c) => c.id).join(",")}
          tabIndex={0}
          role="button"
          aria-label="PR 13 merged"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ivory/60" />
          <span className="font-mono text-[8px] tracking-[0.16em] text-ivory/80">{branchB.pr.label}</span>
          <span className="rounded bg-ivory-dim/20 px-1 py-0.5 font-mono text-[7px] tracking-[0.12em] text-ivory/70">MERGED</span>
        </div>

        {/* invisible branch hit areas for click */}
        <div className="absolute inset-0">
          <div data-branch="a" className="absolute cursor-pointer" style={{ left: "28%", top: "18%", width: "42%", height: "18%" }} aria-hidden />
          <div data-branch="b" className="absolute cursor-pointer" style={{ left: "28%", top: "48%", width: "42%", height: "16%" }} aria-hidden />
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-accent/15 pt-3">
          <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em]">
            <span className="text-ivory-dim/60">COMMITS</span>
            <span className="flex items-center gap-3">
              <span className="os-stat-commits text-ivory/85">08</span>
              <span className="text-ivory-dim/40">•</span>
              <span className="text-ivory-dim/50">PRS</span> <span className="os-stat-prs text-accent">02</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.16em] text-ivory-dim/45">
            <span className="h-1 w-1 rounded-full bg-accent" />
            CLICK BRANCH TO ADD COMMIT • HOVER PR TO HIGHLIGHT
          </div>
        </div>
      </div>
    </div>
  );
}

function TimerVisual() {
  return (
    <div className="corner-ticks border border-accent/25 bg-forge-navy/40 px-10 py-7 text-center">
      <p className="mono-label text-accent">HACK-TIME</p>
      <p className="mt-3 font-mono text-4xl tracking-widest text-ivory sm:text-5xl">
        24<span className="animate-pulse text-accent">:</span>00
        <span className="animate-pulse text-accent">:</span>00
      </p>
    </div>
  );
}

function NetVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-72 sm:w-80">
      <g stroke="color-mix(in srgb, var(--accent) 30%, transparent)">
        <line x1="160" y1="80" x2="60" y2="30" />
        <line x1="160" y1="80" x2="260" y2="35" />
        <line x1="160" y1="80" x2="70" y2="130" />
        <line x1="160" y1="80" x2="250" y2="125" />
        <line x1="160" y1="80" x2="160" y2="20" />
        <line x1="60" y1="30" x2="160" y2="20" />
        <line x1="260" y1="35" x2="160" y2="20" />
      </g>
      <circle
        cx="60"
        cy="30"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 35%, transparent)"
      />
      <circle
        cx="260"
        cy="35"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 35%, transparent)"
      />
      <circle
        cx="70"
        cy="130"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 35%, transparent)"
      />
      <circle
        cx="250"
        cy="125"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 35%, transparent)"
      />
      <circle
        cx="160"
        cy="20"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 35%, transparent)"
      />
      <circle cx="160" cy="80" r="7" fill="var(--accent)" />
    </svg>
  );
}

function ScanVisual() {
  return (
    <div className="w-72 border border-accent/25 bg-forge-navy/40 font-mono text-[11px] sm:w-80">
      <div className="flex items-center justify-between border-b border-accent/20 px-4 py-2">
        <span className="mono-label text-accent">PORT-SCAN</span>
        <span className="text-ivory-dim/50">{"// TCP"}</span>
      </div>
      <div className="flex flex-col gap-1.5 px-4 py-4 text-ivory/70">
        {["22/tcp open ssh", "80/tcp open http", "443/tcp open https", "8080/tcp filtered"].map(
          (line) => {
            const [port, state, proto] = line.split(" ");
            return (
              <p key={line} className="flex justify-between">
                <span className="text-ivory-dim/60">{port}</span>
                <span className="text-accent">{state}</span>
                <span>{proto}</span>
              </p>
            );
          },
        )}
      </div>
    </div>
  );
}

function TimelineVisual() {
  return (
    <svg viewBox="0 0 320 80" className="w-72 sm:w-80">
      <line
        x1="10"
        y1="48"
        x2="310"
        y2="48"
        stroke="color-mix(in srgb, var(--ivory) 25%, transparent)"
      />
      {["IDENTIFY", "PRESERVE", "COLLECT", "EXAMINE"].map((phase, i) => (
        <g key={phase}>
          <circle
            cx={30 + i * 90}
            cy="48"
            r="5"
            fill={
              i === 2
                ? "var(--accent)"
                : "color-mix(in srgb, var(--ivory) 30%, transparent)"
            }
          />
          <text
            x={30 + i * 90}
            y="36"
            textAnchor="middle"
            fill={
              i === 2
                ? "var(--accent)"
                : "color-mix(in srgb, var(--ivory) 55%, transparent)"
            }
            fontSize="9"
            fontFamily="JetBrains Mono, monospace"
          >
            {phase}
          </text>
        </g>
      ))}
    </svg>
  );
}

function CipherVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-72 sm:w-80">
      {Array.from({ length: 8 }, (_, r) =>
        Array.from({ length: 8 }, (_, c) => (
          <text
            key={`${r}-${c}`}
            x={44 + c * 30}
            y={24 + r * 18}
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
            fill={
              r === c
                ? "var(--accent)"
                : "color-mix(in srgb, var(--ivory) 40%, transparent)"
            }
          >
            {String.fromCharCode(65 + ((r * 7 + c * 3) % 26))}
          </text>
        )),
      )}
    </svg>
  );
}

function RingsVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-72 sm:w-80">
      {[72, 52, 34].map((r, i) => (
        <circle
          key={r}
          cx="160"
          cy="80"
          r={r}
          fill="none"
          stroke={
            i === 0
              ? "color-mix(in srgb, var(--accent) 55%, transparent)"
              : "color-mix(in srgb, var(--ivory) 25%, transparent)"
          }
          strokeWidth="1"
          strokeDasharray={i === 0 ? undefined : "2 3"}
        />
      ))}
      <circle cx="160" cy="80" r="6" fill="var(--accent)" />
    </svg>
  );
}

function RadarVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-72 sm:w-80">
      {[60, 40, 20].map((r, i) => (
        <circle
          key={r}
          cx="160"
          cy="80"
          r={r}
          fill="none"
          stroke={
            i === 0
              ? "color-mix(in srgb, var(--accent) 50%, transparent)"
              : "color-mix(in srgb, var(--ivory) 22%, transparent)"
          }
          strokeWidth="1"
        />
      ))}
      <line x1="160" y1="80" x2="160" y2="20" stroke="color-mix(in srgb, var(--ivory) 30%, transparent)" />
      <line x1="160" y1="80" x2="300" y2="80" stroke="color-mix(in srgb, var(--ivory) 30%, transparent)" />
      <line x1="160" y1="80" x2="240" y2="40" stroke="var(--accent)" strokeWidth="1" opacity="0.7" />
      <circle cx="205" cy="105" r="3" fill="var(--accent)" />
    </svg>
  );
}

function PanelVisual({ visual }: { visual: ActivityVisual }) {
  switch (visual) {
    case "code":
      return <CodeVisual />;
    case "web":
      return <WebVisual />;
    case "app":
      return <AppVisual />;
    case "ai":
      return <AiVisual />;
    case "git":
      return <GitVisual />;
    case "timer":
      return <TimerVisual />;
    case "net":
      return <NetVisual />;
    case "scan":
      return <ScanVisual />;
    case "timeline":
      return <TimelineVisual />;
    case "cipher":
      return <CipherVisual />;
    case "rings":
      return <RingsVisual />;
    case "radar":
      return <RadarVisual />;
  }
}

function ActivityPanel({
  index,
  title,
  kicker,
  visual,
  stacked,
}: ActivityPanelData & { stacked: boolean }) {
  return (
    <div
      className={`${
        stacked
          ? "flex min-h-screen w-full flex-col items-center justify-center gap-10 px-6 sm:px-10"
          : "flex h-full w-screen shrink-0 flex-col items-center justify-center gap-10 px-6 sm:px-10"
      }`}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="mono-label text-accent/70">[{index}]</span>
        <h3 className="type-display text-ivory">{title}</h3>
        <span className="mono-label text-ivory-dim/60">{kicker}</span>
      </div>
      <PanelVisual visual={visual} />
    </div>
  );
}

export function ActivitiesSection({
  panels = SS_PANELS,
}: {
  panels?: ActivityPanelData[];
}) {
  return <StripActivitiesSection panels={panels} />;
}

function StripActivitiesSection({ panels }: { panels: ActivityPanelData[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduce) return;
      const scope = ref.current;
      if (!scope) return;
      const row = scope.querySelector<HTMLElement>(".activities-row");
      const bar = scope.querySelector<HTMLElement>(".activities-progress-bar");
      const counter = scope.querySelector<HTMLElement>(".activities-counter");
      if (!row || !bar || !counter) return;

      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              panels.length - 1,
              Math.round(self.progress * (panels.length - 1)),
            );
            const next = `${panels[idx].index} / ${String(
              panels.length,
            ).padStart(2, "0")}`;
            if (counter.textContent !== next) counter.textContent = next;
          },
        },
      });

      tl.to(
        row,
        {
          x: () => -(row.scrollWidth - window.innerWidth),
          duration: 1,
        },
        0,
      ).to(bar, { scaleX: 1, duration: 1 }, 0);
    },
    { scope: ref, dependencies: [reduce] },
  );

  return (
    <section
      ref={ref}
      className="relative"
      style={reduce ? undefined : { height: "500vh" }}
    >
      <div
        className={
          reduce
            ? "flex flex-col"
            : "sticky top-0 flex h-screen flex-col overflow-hidden"
        }
      >
        <div className="flex items-center justify-between px-6 pt-8 sm:px-10">
          <SectionLabel>ACTIVITIES / WHAT WE DO</SectionLabel>
        </div>

        <div
          className={
            reduce
              ? "activities-row flex flex-col"
              : "activities-row flex min-h-0 flex-1"
          }
        >
          {panels.map((panel) => (
            <ActivityPanel key={panel.index} {...panel} stacked={reduce} />
          ))}
        </div>

        {!reduce && (
          <div className="pointer-events-none absolute inset-x-6 bottom-6 z-10 flex items-center justify-between sm:inset-x-10">
            <span className="activities-counter mono-label text-accent">
              01 / {String(panels.length).padStart(2, "0")}
            </span>
            <span className="mono-label text-ivory-dim/50">
              ↓ CONTINUE SCROLLING
            </span>
          </div>
        )}
        {!reduce && (
          <div className="pointer-events-none absolute inset-x-6 bottom-14 sm:inset-x-10">
            <div className="h-px w-full bg-ivory-dim/15">
              <div className="activities-progress-bar h-px w-full bg-accent" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}