"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useIsMobile } from "@/lib/use-is-mobile";

/*
 * SECTION TRANSITION BRIDGES — PHASE 2.4
 * Zero-height seam markers between club sections; overlays span ±50vh around
 * each boundary and are driven by their own scrubbed ScrollTrigger.
 * stream  — accent motes traveling downward across the seam
 * line    — thin energy line drawing through the seam with a pulse dot
 * type    — outgoing/incoming section names crossfading with tracking shift
 * Transform/opacity only · reduced motion renders nothing · mobile halved.
 */

type BridgeKind = "stream" | "line" | "type";

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function SectionBridge({
  kind,
  seed = 1717,
  settle = false,
  from,
  to,
}: {
  kind: BridgeKind;
  seed?: number;
  settle?: boolean;
  from?: string;
  to?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();

  /* deterministic field — identical on server + client, safe for hydration */
  const streamDots = (() => {
    const rand = lcg(seed);
    const count = mobile ? 6 : 10;
    return Array.from({ length: count }, () => ({
      x: rand() * 100,
      size: 1.5 + rand() * 2,
      drift: (rand() - 0.5) * 60,
      start: -(160 + rand() * 220),
      end: 200 + rand() * 260,
      peak: 0.22 + rand() * 0.26,
    }));
  })();

  useGSAP(
    () => {
      const scope = ref.current;
      if (!scope) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      if (kind === "line") {
        const line = scope.querySelector<SVGLineElement>(".sb-line");
        const pulse = scope.querySelector<SVGCircleElement>(".sb-pulse-dot");
        if (!line || !pulse) return;
        gsap.set(line, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: scope,
              start: "top 85%",
              end: "bottom 15%",
              scrub: 1,
            },
          })
          .to(line, { strokeDashoffset: 0, duration: 0.7, ease: "none" }, 0)
          .fromTo(pulse, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.18)
          .fromTo(
            pulse,
            { attr: { cy: -240 } },
            { attr: { cy: 240 }, duration: 0.55, ease: "power1.inOut" },
            0.18,
          )
          .to(pulse, { opacity: 0, duration: 0.08 }, 0.73);
        return;
      }

      if (kind === "type") {
        const out = scope.querySelector<HTMLElement>(".sb-glyph-out");
        const inn = scope.querySelector<HTMLElement>(".sb-glyph-in");
        if (!out || !inn) return;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: scope,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
            },
          })
          .fromTo(
            out,
            { autoAlpha: 0.26, letterSpacing: "0.12em", y: 12 },
            { autoAlpha: 0, letterSpacing: "0.5em", y: -10, duration: 0.55, ease: "power1.in" },
            0,
          )
          .fromTo(
            inn,
            { autoAlpha: 0, letterSpacing: "0.5em", y: 10 },
            { autoAlpha: 0.32, letterSpacing: "0.16em", y: 0, duration: 0.55, ease: "power1.out" },
            0.4,
          );
        return;
      }

      /* stream */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 90%",
          end: "bottom 10%",
          scrub: 1,
        },
      });
      streamDots.forEach((d, i) => {
        const el = scope.querySelector<HTMLElement>(`.sb-dot-${i}`);
        if (!el) return;
        tl.fromTo(
          el,
          { y: d.start, x: 0 },
          {
            y: settle ? d.end * 0.75 : d.end,
            x: d.drift,
            scale: settle ? 0.55 : 1,
            duration: 1,
            ease: settle ? "power1.in" : "none",
          },
          0,
        );
        tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: d.peak, duration: 0.25 }, 0);
        tl.to(el, { autoAlpha: 0, duration: 0.22 }, 0.78);
      });
    },
    { dependencies: [mobile] },
  );

  /* reduced-motion / pre-hydration: markers stay empty (zero layout impact) */
  return (
    <div ref={ref} aria-hidden className="pointer-events-none relative z-[15] h-0">
      <div className="absolute inset-x-0 top-[-50vh] h-[100vh]">
        {kind === "line" && (
          <svg
            viewBox={`0 0 4 ${520}`}
            preserveAspectRatio="none"
            className="absolute left-1/2 top-0 h-full w-[4px] -translate-x-1/2 overflow-visible"
          >
            <line
              className="sb-line"
              x1="2"
              y1="-240"
              x2="2"
              y2="240"
              stroke="var(--accent)"
              strokeWidth="1"
              opacity="0.5"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
            <circle className="sb-pulse-dot" cx="2" cy="-240" r="2.5" fill="#bff7fb" opacity="0" />
          </svg>
        )}

        {kind === "stream" &&
          streamDots.map((d, i) => (
            <span
              key={i}
              className={`sb-dot-${i} absolute rounded-full bg-accent`}
              style={{
                left: `${d.x}%`,
                top: "50%",
                width: d.size,
                height: d.size,
                opacity: 0,
              }}
            />
          ))}

        {kind === "type" && (
          <div className="absolute inset-x-0 top-[42%] flex items-center justify-center gap-10">
            <span className="sb-glyph-out mono-label text-graphite opacity-0">{from}</span>
            <span className="text-ivory-dim/30">→</span>
            <span className="sb-glyph-in mono-label text-accent opacity-0">{to}</span>
          </div>
        )}
      </div>
    </div>
  );
}
