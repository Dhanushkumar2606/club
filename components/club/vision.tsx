"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import type { Club } from "@/data/types";

export function VisionSection({
  club,
  motion = "fluid",
}: {
  club: Club;
  motion?: "fluid" | "precise";
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = ref.current;
      if (!scope) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const text = scope.querySelector<HTMLElement>(".vision-text");
      const line = scope.querySelector<HTMLElement>(".vision-line");
      const kicker = scope.querySelector<HTMLElement>(".vision-kicker");
      if (!text) return;
      const split = SplitText.create(text, { type: "lines" });

      if (reduce) {
        gsap.set(kicker, { autoAlpha: 1, y: 0 });
        gsap.set(split.lines, {
          autoAlpha: 1,
          y: 0,
          clipPath: "inset(-10% 0% -10% 0%)",
        });
        if (line) gsap.set(line, { scaleX: 1 });
        return;
      }

      if (motion === "precise") {
        gsap.set(kicker, { autoAlpha: 0, y: 8 });
        gsap.set(split.lines, {
          autoAlpha: 0,
          clipPath: "inset(0% 100% 0% 0%)",
        });
        if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 1,
          },
        });

        tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.12, ease: "steps(1)" }, 0);
        tl.to(split.lines, {
          autoAlpha: 1,
          clipPath: "inset(-10% 0% -10% 0%)",
          duration: 1.2,
          stagger: 0.14,
          ease: "steps(2)",
        });
        if (line) {
          tl.to(
            line,
            { scaleX: 1, duration: 1.4, ease: "power4.in" },
            0.6,
          );
        }
        // transition tail — release toward the next section
        tl.to(
          text,
          { filter: "blur(4px)", letterSpacing: "0.05em", duration: 0.5, ease: "none" },
          ">-0.15",
        );
        return;
      }

      gsap.set(kicker, { autoAlpha: 0, y: 12 });
      gsap.set(split.lines, {
        autoAlpha: 0,
        y: 26,
        clipPath: "inset(100% 0% 0% 0%)",
      });
      if (line) gsap.set(line, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 1,
        },
      });

      tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power3.out" }, 0);
      tl.to(split.lines, {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(-10% 0% -10% 0%)",
        duration: 1.1,
        stagger: 0.16,
        ease: "power3.out",
      });
      // transition tail — release toward the next section
      tl.to(
        text,
        { filter: "blur(4px)", letterSpacing: "0.05em", duration: 0.5, ease: "none" },
        ">-0.15",
      );
    },
    { scope: ref, dependencies: [motion] },
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center"
    >
      <div className="mx-auto max-w-5xl px-6 py-32 text-center sm:px-10">
        <div className="vision-kicker mb-10 flex items-center justify-center gap-4">
          <span className="font-mono text-xs tracking-[0.3em] text-accent">02</span>
          <span className="mono-label text-graphite">VISION</span>
          <span className="h-px w-10 bg-accent/40" />
          <span className="mono-label hidden text-ivory-dim/40 lg:block">
            {club.id === "script-soldiers"
              ? "SYS://BUILD·SHIP·COMPETE"
              : "SYS://DEFEND·MONITOR·RESPOND"}
          </span>
        </div>
        <p
          role="text"
          className="vision-text font-sans text-3xl font-light leading-tight text-ivory sm:text-4xl md:text-5xl"
        >
          {club.vision}
        </p>
        {motion === "precise" && (
          <div className="mx-auto mt-10 h-px w-56 bg-accent">
            <div className="vision-line h-full w-full bg-accent" />
          </div>
        )}
      </div>
    </section>
  );
}