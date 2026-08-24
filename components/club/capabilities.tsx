"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsMobile } from "@/lib/use-is-mobile";

/*
 * CYBER KNIGHTS — INTERACTIVE CAPABILITY NETWORK
 * Central capability core + eight connected domain nodes.
 * Scroll builds the network progressively (spokes draw, nodes activate);
 * desktop hover highlights a capability with a compact technical readout;
 * a few data pulses travel live links once the net is online.
 * Transform / opacity / stroke-dashoffset only · deterministic geometry ·
 * pointer-events limited to nodes · effects scoped to this section.
 */

const CX = 500;
const CY = 380;
const RX = 355;
const RY = 272;

const DESCRIPTORS: Record<string, string> = {
  "Ethical Hacking": "Offensive security methodology — thinking like an attacker to build stronger defenses.",
  "Penetration Testing": "Structured security assessment of systems and applications before real adversaries arrive.",
  "Network Security": "Defending infrastructure, traffic and protocols against intrusion and misuse.",
  "Digital Forensics": "Investigating digital evidence with precision, chain-of-custody and analytical rigour.",
  "Cybersecurity Awareness": "Building a human firewall — culture, habits and informed decision-making.",
  Cryptography: "The mathematics of trust — encryption, hashing and secure communication.",
  "Incident Response": "Detection, containment and recovery when defenses are tested.",
  VAPT: "Vulnerability Assessment and Penetration Testing — finding weaknesses end-to-end.",
};

function polar(cx: number, cy: number, rx: number, ry: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: +(cx + rx * Math.cos(rad)).toFixed(1), y: +(cy + ry * Math.sin(rad)).toFixed(1) };
}

/* fixed node geometry — deterministic, hydration-safe */
export const NODE_POS = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => polar(CX, CY, RX, RY, -90 + i * 45));

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function CapabilitiesSection({ domains }: { domains: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const mobile = useIsMobile();

  const motes = (() => {
    const rand = lcg(7712);
    return Array.from({ length: 12 }, () => ({
      x: Math.round(rand() * 100),
      y: Math.round(rand() * 100),
      o: Math.round((0.05 + rand() * 0.06) * 100) / 100,
    }));
  })();
  const traces = (() => {
    const rand = lcg(3389);
    return Array.from({ length: 5 }, () => ({
      d: `M${(rand() * 100).toFixed(1)},${(rand() * 100).toFixed(1)} L${(rand() * 100).toFixed(1)},${(rand() * 100).toFixed(1)}`,
    }));
  })();

  useGSAP(
    () => {
      const scope = ref.current;
      if (!scope) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      /* ---------- shared reveals (header) ---------- */
      const kicker = scope.querySelector(".caps-kicker");
      const heading = scope.querySelector(".caps-heading");
      const support = scope.querySelector(".caps-support");
      if (!reduce) {
        gsap.set([kicker, support], { autoAlpha: 0, y: 14 });
        gsap.set(heading, { autoAlpha: 0, y: 30, clipPath: "inset(0% 0% 100% 0%)" });
      }

      if (mobile) {
        /* ---------- vertical connected chain ---------- */
        const spine = scope.querySelector<HTMLElement>(".cap-spine-m");
        const rows = scope.querySelectorAll<HTMLElement>(".cap-row");
        if (reduce) {
          gsap.set([kicker, heading, support].filter(Boolean), { autoAlpha: 1, y: 0 });
          if (spine) gsap.set(spine, { scaleY: 1 });
          gsap.set(rows, { autoAlpha: 1, y: 0 });
          return;
        }
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: scope, start: "top 70%", end: "bottom 55%", scrub: 1 },
        });
        tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.25 }, 0)
          .to(heading, { autoAlpha: 1, y: 0, clipPath: "inset(-10% 0% -10% 0%)", duration: 0.5 }, 0.05)
          .to(support, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.3);
        if (spine) tl.fromTo(spine, { scaleY: 0 }, { scaleY: 1, duration: 0.55, transformOrigin: "top", ease: "none" }, 0.15);
        rows.forEach((row, i) => {
          tl.fromTo(row, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.2 + i * 0.07);
        });
        return;
      }

      /* ---------- desktop radial network ---------- */
      const nodes = scope.querySelectorAll<HTMLElement>(".cap-node");
      const spokes = scope.querySelectorAll<SVGLineElement>(".cap-spoke");
      const labels = scope.querySelectorAll<HTMLElement>(".cap-label");
      const core = scope.querySelector<HTMLElement>(".cap-core-group");
      const ring = scope.querySelector<HTMLElement>(".cap-core-ring");
      const panel = scope.querySelector<HTMLElement>(".caps-info-panel");
      if (!nodes.length || !spokes.length || !core) return;

      if (reduce) {
        gsap.set([kicker, heading, support].filter(Boolean), { autoAlpha: 1, y: 0 });
        gsap.set(core, { autoAlpha: 1, scale: 1 });
        gsap.set(spokes, { strokeDashoffset: 0 });
        gsap.set(nodes, { autoAlpha: 1, scale: 1 });
        gsap.set(labels, { autoAlpha: 1, y: 0 });
        if (panel) gsap.set(panel, { autoAlpha: 1 });
        return;
      }

      gsap.set(kicker, { autoAlpha: 0, y: 12 });
      gsap.set(heading, { autoAlpha: 0, y: 30, clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(support, { autoAlpha: 0, y: 16 });
      gsap.set(core, { autoAlpha: 0, scale: 0.6, svgOrigin: `${CX} ${CY}` });
      gsap.set(spokes, { strokeDasharray: 1, strokeDashoffset: 1 });
      nodes.forEach((n) => gsap.set(n, { autoAlpha: 0, scale: 0.55, transformOrigin: "center" }));
      labels.forEach((l) => gsap.set(l, { autoAlpha: 0, y: 8 }));

      /* ambient core ring rotation */
      if (ring) {
        gsap.to(ring, {
          rotate: 360,
          duration: 46,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: scope, start: "top 65%", end: "+=140%", scrub: 1 },
      });

      // data pulses begin once the network is nearly complete
      ScrollTrigger.create({
        trigger: scope,
        start: "top 12%",
        once: true,
        onEnter: startPulses,
      });

      // PHASE 0 — core activates
      tl.to(core, { autoAlpha: 1, scale: 1, duration: 0.1, ease: "power2.out" }, 0);

      // PHASES 1–3 — spokes draw, nodes + labels activate one by one
      nodes.forEach((_, i) => {
        const t = 0.16 + i * 0.085;
        tl.to(spokes[i], { strokeDashoffset: 0, duration: 0.05 }, t)
          .to(nodes[i], { autoAlpha: 1, scale: 1, duration: 0.035, ease: "power2.out" }, t + 0.02)
          .to(labels[i], { autoAlpha: 1, y: 0, duration: 0.03 }, t + 0.035);
      });

      // PHASE 4 — header completes over the growing network
      tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.04)
        .to(heading, { autoAlpha: 1, y: 0, clipPath: "inset(-10% 0% -10% 0%)", duration: 0.35 }, 0.08)
        .to(support, { autoAlpha: 1, y: 0, duration: 0.28 }, 0.26);

      // PHASE 5 — stabilizing settle
      tl.to(scope.querySelector(".cap-stage"), { scale: 1.015, duration: 0.06 }, 0.92).to(
        scope.querySelector(".cap-stage"),
        { scale: 1, duration: 0.05 },
        0.98,
      );

      /* ---------- data pulses (few, controlled, post-build) ---------- */
      function startPulses() {
        const linkEls = gsap.utils.toArray<SVGLineElement>(".cap-spoke");
        const pool = gsap.utils.toArray<SVGCircleElement>(".cap-pulse");
        let n = 0;
        const fire = () => {
          const el = pool[n % pool.length];
          n++;
          const path = linkEls[Math.floor(Math.random() * linkEls.length)];
          if (!el || !path) return;
          const len = path.getTotalLength();
          const dur = 1.5 + Math.random() * 0.7;
          gsap.fromTo(el, { opacity: 0 }, { opacity: 0.9, duration: 0.2 });
          gsap.fromTo(
            { t: 0 },
            { t: 1 },
            {
              duration: dur,
              ease: "none",
              onUpdate: function () {
                const pt = path.getPointAtLength((this.targets()[0] as { t: number }).t * len);
                el.setAttribute("cx", String(pt.x));
                el.setAttribute("cy", String(pt.y));
              },
              onComplete: () => {
                gsap.to(el, { opacity: 0, duration: 0.25, onComplete: () => gsap.delayedCall(1.2 + Math.random() * 1.6, fire) });
              },
            },
          );
        };
        fire();
        if (window.matchMedia("(min-width: 1024px)").matches) gsap.delayedCall(1.3, fire);
      }

      /* ---------- hover interaction (desktop fine pointer, delegated) ---------- */
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const setDim = (activeIdx: number | null) => {
          nodes.forEach((nd, i) => {
            const base = activeIdx === null || i === activeIdx ? 1 : 0.32;
            gsap.to(nd, { opacity: base, duration: 0.3, overwrite: "auto" });
            gsap.to(spokes[i], {
              attr: { "stroke-opacity": i === activeIdx ? 1 : activeIdx === null ? 0.55 : 0.16 },
              duration: 0.3,
              overwrite: "auto",
            });
          });
        };
        const showPanel = (i: number) => {
          if (!panel) return;
          const dom = domains[i];
          const numEl = panel.querySelector(".capi-num");
          const titEl = panel.querySelector(".capi-title");
          const desEl = panel.querySelector(".capi-desc");
          if (numEl) numEl.textContent = `CAPABILITY ${String(i + 1).padStart(2, "0")} / ${String(domains.length).padStart(2, "0")}`;
          if (titEl) titEl.textContent = dom.toUpperCase();
          if (desEl) desEl.textContent = DESCRIPTORS[dom] ?? "";
          gsap.to(panel, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power3.out" });
        };
        const hidePanel = () => {
          if (!panel) return;
          gsap.to(panel, { autoAlpha: 0, x: 12, duration: 0.3, ease: "power2.in" });
        };

        let hoverIdx: number | null = null;
        const onOver = (e: PointerEvent) => {
          const target = e.target as Element;
          const nodeEl = target.closest(".cap-node");
          if (!nodeEl) return;
          const idx = [...nodes].findIndex((n) => n === nodeEl);
          if (idx === -1 || idx === hoverIdx) return;
          hoverIdx = idx;
          setDim(idx);
          gsap.to(nodes[idx].querySelector(".cap-dot"), { scale: 1.28, duration: 0.3, transformOrigin: "center" });
          showPanel(idx);
        };
        const onOut = (e: PointerEvent) => {
          const target = e.target as Element;
          if (!target.closest(".cap-node")) return;
          const related = e.relatedTarget as Element | null;
          if (related && related.closest(".cap-node")) return; // still within a node
          hoverIdx = null;
          setDim(null);
          nodes.forEach((n) =>
            gsap.to(n.querySelector(".cap-dot"), { scale: 1, duration: 0.3 }),
          );
          hidePanel();
        };

        scope.addEventListener("pointerover", onOver);
        scope.addEventListener("pointerout", onOut);
      }
    },
    { scope: ref, dependencies: [mobile] },
  );

  const domainsSafe = domains.slice(0, NODE_POS.length);

  return (
    <section
      ref={ref}
      aria-label="What we do in Cyber Knights"
      className="caps-section relative overflow-hidden px-6 py-28 sm:px-10 sm:py-36"
    >
      {/* atmosphere behind everything */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(44% 36% at 50% 42%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 72%)",
          }}
        />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {traces.map((t, i) => (
            <line key={`tr-${i}`} d={t.d} stroke="var(--accent)" strokeWidth="0.07" opacity="0.05" vectorEffect="non-scaling-stroke" />
          ))}
          {motes.map((m, i) => (
            <circle key={`m-${i}`} cx={m.x} cy={m.y} r={0.14} fill="#d7e0e8" opacity={m.o} />
          ))}
        </svg>
      </div>

      {/* header */}
      <div className="relative z-10 mx-auto max-w-5xl">
        <p className="caps-kicker mono-label mb-6 text-accent">
          CYBER KNIGHTS // CAPABILITY NETWORK
        </p>
        <h2 className="caps-heading font-sans text-5xl font-semibold tracking-tight text-ivory sm:text-7xl">
          WHAT WE DO
        </h2>
        <p className="caps-support mt-6 max-w-xl text-base leading-7 text-ivory/65">
          One connected system — offensive security, defence, intelligence and
          research operating as a single unit.
        </p>

        {/* system metadata */}
        {!mobile && (
          <div className="mt-8 flex flex-col gap-1 font-mono text-[9px] tracking-[0.22em] text-ivory-dim/45">
            {[
              ["SYSTEM STATUS", "ONLINE"],
              ["ACTIVE NODES", String(domains.length).padStart(2, "0")],
              ["NETWORK", "STABLE"],
            ].map(([k, v]) => (
              <p key={k} className="flex items-center gap-4">
                <span className="w-24 text-ivory-dim/35">{k}</span>
                <span className="text-accent/65">{v}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* ================= NETWORK STAGE ================= */}
      {!mobile ? (
        <div className="cap-stage relative z-10 mx-auto mt-4 aspect-[1000/760] w-full max-w-[1080px]">
          <svg viewBox={`0 0 ${1000} ${760}`} className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <radialGradient id="cap-core-g" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#bff7fb" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#36f3ff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#00d9e8" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* spokes */}
            {domainsSafe.map((d, i) => (
              <line
                key={`s-${i}`}
                className="cap-spoke"
                x1={CX}
                y1={CY}
                x2={NODE_POS[i].x}
                y2={NODE_POS[i].y}
                stroke="color-mix(in srgb, var(--accent) 55%, transparent)"
                strokeWidth="1"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                strokeOpacity="0.55"
              />
            ))}

            {/* core */}
            <g className="cap-core-group">
              <circle cx={CX} cy={CY} r="58" fill="url(#cap-core-g)" opacity="0.5" />
              <circle
                className="cap-core-ring"
                cx={CX}
                cy={CY}
                r="40"
                fill="none"
                stroke="color-mix(in srgb, var(--accent) 45%, transparent)"
                strokeWidth="1"
                strokeDasharray="4 10"
              />
              <circle cx={CX} cy={CY} r="17" fill="none" stroke="color-mix(in srgb, #d7e0e8 40%, transparent)" strokeWidth="1" />
              <circle cx={CX} cy={CY} r="5" fill="#bff7fb" />
            </g>

            {/* node markers */}
            {domainsSafe.map((_, i) => (
              <circle
                key={`nm-${i}`}
                className="cap-node-mark"
                cx={NODE_POS[i].x}
                cy={NODE_POS[i].y}
                r="7"
                fill="#0b0e14"
                stroke="var(--accent)"
                strokeWidth="1.2"
              />
            ))}

            {/* pulses */}
            {[0, 1].map((i) => (
              <circle key={`pl-${i}`} className="cap-pulse" r="2.4" fill="#bff7fb" opacity="0" />
            ))}
          </svg>

          {/* HTML labels/nodes (hit targets + typography) */}
          {domainsSafe.map((domain, i) => (
            <div
              key={domain}
              className="cap-node absolute flex -translate-x-1/2 -translate-y-1/2 cursor-default flex-col items-center gap-1.5 text-center"
              style={{ left: `${NODE_POS[i].x / 10}%`, top: `${NODE_POS[i].y / 7.6}%` }}
            >
              <span
                className="cap-dot block h-[9px] w-[9px] rounded-full border border-accent bg-origin-900"
                aria-hidden
              />
              <span className="cap-index font-mono text-[10px] tracking-[0.25em] text-accent/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="cap-label whitespace-nowrap font-sans text-[11px] font-semibold tracking-[0.18em] text-ivory/85 transition-colors duration-300 sm:text-xs">
                {domain.toUpperCase()}
              </span>
            </div>
          ))}

          {/* contextual readout */}
          <aside
            className="caps-info-panel pointer-events-none absolute right-[2%] top-[8%] w-[240px] border border-accent/30 bg-defense-navy/70 p-4 opacity-0 backdrop-blur-sm sm:w-[260px]"
            style={{ translate: "none" }}
          >
            <span className="cap-bar absolute left-0 top-0 h-full w-[2px] origin-top bg-accent" />
            <p className="capi-num mono-label text-accent/80">CAPABILITY</p>
            <p className="capi-title mt-2 font-sans text-lg font-semibold tracking-tight text-ivory">—</p>
            <span className="my-3 block h-px w-full bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="capi-desc min-h-[48px] text-[13px] leading-6 text-ivory-dim/80">—</p>
            <p className="mono-label mt-4 flex items-center justify-between text-ivory-dim/45">
              STATUS
              <span className="text-accent/80">ACTIVE</span>
            </p>
          </aside>
        </div>
      ) : (
        /* ================= MOBILE — vertical chain ================= */
        <div className="relative z-10 mx-auto mt-10 max-w-md">
          <div className="mb-2 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-origin-900">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
          </div>
          <div className="relative pl-[27px]">
            <span
              className="cap-spine-m absolute left-[13px] top-0 h-full w-px origin-top bg-gradient-to-b from-accent/60 via-accent/25 to-transparent"
            />
            {domains.map((domain, i) => (
              <div key={domain} className="cap-row relative py-5">
                <span className="absolute -left-[19px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full border border-accent bg-origin-900" />
                <p className="font-mono text-[10px] tracking-[0.25em] text-accent/80">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-sans text-base font-semibold tracking-[0.12em] text-ivory">
                  {domain.toUpperCase()}
                </h3>
                <p className="mt-1 text-[13px] leading-6 text-ivory-dim/70">{DESCRIPTORS[domain] ?? ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
