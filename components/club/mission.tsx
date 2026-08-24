"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import type { Club } from "@/data/types";

const DEFAULT_WORDS = ["BUILD", "CREATE", "INNOVATE", "LEAD"];

export function MissionSection({
  club,
  words = DEFAULT_WORDS,
  motion = "fluid",
}: {
  club: Club;
  words?: string[];
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

      const statement = scope.querySelector<HTMLElement>(".mission-statement");
      const words = scope.querySelectorAll<HTMLElement>(".mission-word");
      const arrows = scope.querySelectorAll<HTMLElement>(".mission-arrow");
      const kicker = scope.querySelector<HTMLElement>(".mission-kicker");
      const chars = statement
        ? SplitText.create(statement, { type: "lines" }).lines
        : null;

      if (reduce || !chars) {
        gsap.set(kicker, { autoAlpha: 1, y: 0 });
        words.forEach((word, i) =>
          gsap.set(word, {
            autoAlpha: i === words.length - 1 ? 1 : 0,
            scale: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
          }),
        );
        gsap.set(arrows, { autoAlpha: 0 });
        if (chars)
          gsap.set(chars, {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
          });
        return;
      }

      if (motion === "precise") {
        gsap.set(kicker, { autoAlpha: 0, y: 8 });
        gsap.set(chars, { autoAlpha: 0, y: 14, clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(words, { autoAlpha: 0, clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(arrows, { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        words.forEach((word, i) => {
          const t = i * 0.55;
          tl.to(
            word,
            {
              autoAlpha: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.18,
              ease: "power4.in",
            },
            t,
          );
          if (i < words.length - 1) {
            tl.to(word, { autoAlpha: 0, duration: 0.12, ease: "steps(1)" }, t + 0.42);
          }
          if (i < words.length - 1) {
            tl.to(arrows[i], { autoAlpha: 1, duration: 0.06 }, t + 0.3).to(
              arrows[i],
              { autoAlpha: 0, duration: 0.06 },
              t + 0.42,
            );
          }
        });

        tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.15, ease: "steps(1)" }, 0.05);
        tl.to(
          chars,
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(-10% 0% -10% 0%)",
            duration: 0.05,
            stagger: 0.11,
            ease: "steps(2)",
          },
          2.3,
        )
          .to({}, { duration: 0.5 });
        return;
      }

      gsap.set(kicker, { autoAlpha: 0, y: 12 });
      gsap.set(chars, { autoAlpha: 0, y: 26, clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(words, { autoAlpha: 0, scale: 1.15, y: 40 });
      gsap.set(arrows, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      words.forEach((word, i) => {
        const t = i * 0.6;
        tl.to(
          word,
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out" },
          t,
        );
        if (i < words.length - 1) {
          tl.to(
            word,
            { autoAlpha: 0, scale: 0.9, y: -40, duration: 0.25, ease: "power3.in" },
            t + 0.35,
          );
        }
        if (i < words.length - 1) {
          tl.to(arrows[i], { autoAlpha: 1, duration: 0.2 }, t + 0.2).to(
            arrows[i],
            { autoAlpha: 0, duration: 0.2 },
            t + 0.45,
          );
        }
      });

      tl.to(
        kicker,
        { autoAlpha: 1, y: 0, duration: 0.25, ease: "power3.out" },
        0.1,
      );
      tl.to(
        chars,
        {
          autoAlpha: 1,
          y: 0,
          clipPath: "inset(-10% 0% -10% 0%)",
          duration: 0.55,
          stagger: 0.18,
          ease: "power3.out",
        },
        2.2,
      ).to({}, { duration: 0.4 });
    },
    { scope: ref, dependencies: [motion] },
  );

  return (
    <section ref={ref} className="relative" style={{ height: "350vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 text-center sm:px-10">
          <div className="mission-kicker mb-8 flex items-center justify-center gap-4">
            <span className="font-mono text-xs tracking-[0.3em] text-accent">01</span>
            <span className="mono-label text-graphite">MISSION</span>
            <span className="h-px w-10 bg-accent/40" />
            <span className="mono-label hidden text-ivory-dim/40 lg:block">
              {club.id === "script-soldiers"
                ? "SYS://CODE·LOGIC·SYS·ENG"
                : "SYS://SEC·AI·NET·INTEL"}
            </span>
          </div>
          <div className="mission-stage relative h-48 sm:h-56">
            {words.map((word, i) => (
              <div
                key={word}
                className="mission-step absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <div className="relative inline-block">
                  <span className="mission-word type-display text-accent">
                    {word}
                  </span>
                </div>
                {i < words.length - 1 && (
                  <span className="mission-arrow text-2xl text-ivory-dim">
                    ↓
                  </span>
                )}
              </div>
            ))}
          </div>
          <p
          role="text"
          className="mission-statement mx-auto mt-16 max-w-2xl text-lg leading-8 text-ivory/80 sm:text-xl sm:leading-9"
        >
            {club.mission}
          </p>
        </div>
      </div>
    </section>
  );
}