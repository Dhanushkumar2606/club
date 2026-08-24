"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { ArchiveEntry } from "@/data/archive";

export function OrganicRiver({
  items,
  reverse = false,
  duration = 55,
  seed = 0,
}: {
  items: ArchiveEntry[];
  reverse?: boolean;
  duration?: number;
  seed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = ref.current;
      if (!scope) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const track = scope.querySelector<HTMLElement>(".river-track");
      if (!track) return;

      // duplicate width is half of scrollWidth (because we doubled items)
      // animate from 0 to -50% (one full set)
      const tween = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        {
          xPercent: reverse ? 0 : -50,
          duration,
          ease: "none",
          repeat: -1,
        },
      );
      return () => {
        tween.kill();
      };
    },
    { scope: ref, dependencies: [reverse, duration] },
  );

  if (!items.length) return null;

  // organic offsets: stagger vertical position per item using deterministic pseudo-random
  const doubled = [...items, ...items];

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{ willChange: "transform" }}
    >
      <div className="river-track flex w-max items-center gap-6 py-4 will-change-transform">
        {doubled.map((item, idx) => {
          // deterministic offset: vary translateY and scale slightly
          const offsetSeed = (idx * 37 + seed * 13) % 100;
          const translateY = offsetSeed > 70 ? -14 : offsetSeed < 30 ? 14 : 0;
          const scaleSeed = 0.96 + ((idx * 17) % 8) * 0.01;
          return (
            <div
              key={`${item.id}-${idx}`}
              className="group relative shrink-0 overflow-hidden border border-accent/15 bg-origin-900"
              style={{
                width: "clamp(220px, 22vw, 340px)",
                transform: `translateY(${translateY}px) scale(${scaleSeed})`,
              }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title ? `${item.label} — ${item.title}` : item.label}
                  fill
                  sizes="(min-width: 768px) 22vw, 72vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
