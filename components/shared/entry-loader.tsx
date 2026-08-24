"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/*
 * CINEMATIC ENTRY LOADER — PHASE 2.1
 * College → Department → Initializing → Clubs → Main experience.
 * Full beat sequence once per browser session (~1.35s);
 * returning visitors get a ~250ms whisper fade;
 * prefers-reduced-motion dismisses instantly.
 * Pure fixed overlay — zero impact on layout, sections, or scrolling systems.
 */

const SESSION_FLAG = "cse-entered";

export function EntryLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const scope = ref.current;
      if (!scope) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const finish = () => {
        try {
          sessionStorage.setItem(SESSION_FLAG, "1");
        } catch {}
        setDone(true);
      };

      if (reduce) {
        finish();
        return;
      }

      let entered = false;
      try {
        entered = sessionStorage.getItem(SESSION_FLAG) === "1";
      } catch {}

      if (entered) {
        // whisper fade — barely there for returning visitors
        gsap.to(scope, {
          autoAlpha: 0,
          duration: 0.25,
          ease: "power1.out",
          onComplete: finish,
        });
        return;
      }

      /* full cinematic beat sequence */
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.fromTo(
        ".el-line",
        { y: 10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.34, stagger: 0.26 },
      )
        .to(".el-progress", { scaleX: 1, duration: 1.15, ease: "none" }, 0)
        .to({}, { duration: 0.12 })
        .to(".el-inner", { autoAlpha: 0, y: -8, duration: 0.28 })
        .to(
          scope,
          {
            autoAlpha: 0,
            duration: 0.3,
            ease: "power1.inOut",
            onComplete: finish,
          },
          "<0.08",
        );
    },
    { scope: ref },
  );

  /* hard failsafe — the page can never be stranded behind the loader */
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="entry-loader pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "var(--page-bg)" }}
    >
      {/* atmosphere + tiny particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 42% at 50% 52%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 72%)",
          }}
        />
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="particle absolute h-px w-px rounded-full bg-argent/70"
            style={
              {
                left: `${(i * 37 + 13) % 96}%`,
                bottom: `${(i * 53 + 9) % 88}%`,
                "--particle-drift-x": `${(((i % 3) - 1) * 14).toString()}px`,
                "--particle-drift-y": "-36px",
                "--particle-opacity": 0.3,
                animationDuration: `${7 + (i % 4) * 2}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="el-inner relative z-10 flex flex-col items-center gap-5 px-6 text-center">
        <p className="el-line opacity-0 mono-label text-graphite">
          PERI INSTITUTE OF TECHNOLOGY
        </p>
        <p className="el-line opacity-0 mono-label text-sm tracking-[0.3em] text-ivory">
          DEPARTMENT OF CSE
        </p>
        <p className="el-line opacity-0 mono-label text-ivory-dim/70">
          SYSTEM / ENVIRONMENT INITIALIZING
        </p>
        <div className="el-line flex items-center gap-5 opacity-0 sm:gap-7">
          <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-ivory/85 sm:text-[11px]">
            SCRIPT SOLDIERS
            <span className="h-1.5 w-1.5 rounded-full bg-[#c79a3b]" />
          </span>
          <span className="text-ivory-dim/40">|</span>
          <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-ivory/85 sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d9e8]" />
            CYBER KNIGHTS
          </span>
        </div>
        <div className="mt-3 h-px w-52 overflow-hidden bg-ivory-dim/15 sm:w-64">
          <div
            className="el-progress h-full w-full origin-left bg-accent/80"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
