"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import type { Club } from "@/data/types";

export function MottoSection({
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

      const text = scope.querySelector<HTMLElement>(".motto-text");
      const caret = scope.querySelector<HTMLElement>(".motto-caret");
      if (!text) return;
      const split = SplitText.create(text, { type: "chars" });

      if (reduce) {
        gsap.set(split.chars, { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
        if (caret) gsap.set(caret, { autoAlpha: 0 });
        return;
      }

      if (motion === "precise") {
        gsap.set(split.chars, { autoAlpha: 0 });
        if (caret) gsap.set(caret, { autoAlpha: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        tl.to(split.chars, {
          autoAlpha: 1,
          duration: 0.02,
          stagger: 0.02,
          ease: "steps(1)",
        });
        if (caret) {
          gsap.to(caret, { opacity: 0, duration: 0.12, repeat: -1, yoyo: true });
          tl.to(caret, { autoAlpha: 0, duration: 0.15 }, split.chars.length * 0.02 + 0.3);
        }
        return;
      }

      gsap.set(split.chars, { autoAlpha: 0, scale: 2.2, filter: "blur(12px)" });
      if (caret) gsap.set(caret, { autoAlpha: 0 });
      // transition head — tracking settles as the motto forms
      gsap.set(text, { letterSpacing: "0.06em" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(text, { letterSpacing: "-0.025em", duration: 0.9, ease: "power2.out" }, 0);
      tl.to(split.chars, {
        autoAlpha: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.1,
        stagger: 0.045,
        ease: "power3.out",
      });
    },
    { scope: ref, dependencies: [motion] },
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 50%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)",
        }}
      />
      <p
        role="text"
        className="motto-text text-glow relative max-w-5xl px-6 text-center font-sans text-5xl font-semibold tracking-tight text-ivory sm:text-7xl lg:text-8xl"
      >
        {club.motto}
        {motion === "precise" && (
          <span className="motto-caret ml-1 inline-block text-accent">
            ▌
          </span>
        )}
      </p>
    </section>
  );
}