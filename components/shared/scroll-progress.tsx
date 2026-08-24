"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/*
 * SCROLL PROGRESS INTELLIGENCE — PHASE 2.5
 * Right-edge rail on club pages: active section name (rotated), an eight-tick
 * position rail that fills with the world accent, and a dim 01/08 counter.
 * Section detection = ordered <section> elements inside the club flow.
 * Informational overlay — reduced-motion swaps instantly, no looping motion.
 */

const LABELS = [
  "INTRO",
  "MISSION",
  "VISION",
  "MOTTO",
  "ACTIVITIES",
  "TEAM",
  "EVENTS",
  "FINALE",
];

const CLUB_ROUTES = ["/script-soldiers", "/cyber-knights"];

export function ScrollProgress() {
  const pathname = usePathname();
  const isClub = CLUB_ROUTES.includes(pathname);
  /* hydration-safe mount gate (same pattern as particle-field) */
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (!mounted || !isClub) return;

      const sections = (
        Array.from(document.querySelectorAll("main > div > section")) as HTMLElement[]
      ).slice(0, LABELS.length);
      if (!sections.length) return;

      const triggers = sections.map((sec, i) =>
        ScrollTrigger.create({
          trigger: sec,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { dependencies: [mounted, isClub, pathname] },
  );

  /* SSR renders nothing — pure client-side enhancement */
  if (!mounted || !isClub) return null;

  return (
    <div
      aria-hidden
      className="scroll-progress pointer-events-none fixed right-4 top-1/2 z-[60] flex -translate-y-1/2 flex-col items-center gap-3 sm:right-6"
    >
      {/* current section name — desktop only */}
      <span
        className="mono-label hidden text-ivory/80 md:block"
        style={{
          writingMode: "vertical-rl",
          letterSpacing: "0.3em",
          transition: "opacity 200ms ease",
        }}
        key={active}
      >
        {LABELS[active]}
      </span>

      {/* tick rail */}
      <div className="flex flex-col items-center gap-[7px] py-1">
        {LABELS.map((label, i) => (
          <span
            key={label}
            className={`w-px transition-all duration-200 motion-reduce:transition-none ${
              i === active
                ? "h-[18px] bg-accent"
                : i < active
                  ? "h-[10px] bg-accent/40"
                  : "h-[10px] bg-ivory-dim/25"
            }`}
          />
        ))}
      </div>

      {/* counter */}
      <span className="font-mono text-[9px] tracking-[0.22em] text-ivory-dim/60">
        {String(active + 1).padStart(2, "0")}
        <span className="text-ivory-dim/35"> / {String(LABELS.length).padStart(2, "0")}</span>
      </span>
    </div>
  );
}
