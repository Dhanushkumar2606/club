"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { department } from "@/data/department";
import { scriptSoldiers } from "@/data/scriptSoldiers";
import { cyberKnights } from "@/data/cyberKnights";
import { SectionLabel } from "@/components/shared/typography";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { useIsMobile } from "@/lib/use-is-mobile";

export function FinaleSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const mobile = useIsMobile();

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        gsap.set(".finale-veil", { autoAlpha: 1 });
        gsap.set(
          ".finale-beat, .finale-logo, .finale-word, .finale-cse, .finale-line, .finale-info",
          { autoAlpha: 1, y: 0 },
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 75%",
        end: "bottom 20%",
        onToggle: (self) =>
          document.documentElement.classList.toggle("cursor-dark", self.isActive),
      });

      tl.to(".finale-veil", { autoAlpha: 1, duration: 1.5 })
        .from(
          ".finale-logo",
          { autoAlpha: 0, y: 24, duration: 0.5, stagger: 0.12 },
          "-=0.4",
        )
        .to(
          ".finale-logo",
          { autoAlpha: 0, y: -24, duration: 0.5, stagger: 0.12 },
          "+=0.5",
        )
        .from(
          ".finale-word",
          { autoAlpha: 0, y: 16, duration: 0.4, stagger: 0.1 },
          "-=0.3",
        )
        .to(
          ".finale-word",
          { autoAlpha: 0, y: -16, duration: 0.4, stagger: 0.1 },
          "+=0.3",
        )
        .from(".finale-cse", { autoAlpha: 0, scale: 0.96, duration: 0.5 })
        .to(".finale-cse", { autoAlpha: 0, duration: 0.4 }, "+=0.4")
        .from(
          ".finale-line",
          { autoAlpha: 0, y: 20, duration: 0.5, stagger: 0.14 },
          "-=0.2",
        )
        .from(".finale-info", { autoAlpha: 0, y: 14, duration: 0.5 }, "-=0.3");
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className={
        reduce
          ? "relative px-6 py-28 sm:px-10"
          : mobile
            ? "relative h-[320vh]"
            : "relative h-[550vh]"
      }
    >
      {reduce && (
        <div className="finale-veil absolute inset-0 bg-[#f4f2ec]" />
      )}
      <div
        className={
          reduce
            ? "relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-10 py-20 text-center"
            : "sticky top-0 flex h-screen flex-col overflow-hidden"
        }
      >
        {!reduce && (
          <div className="finale-veil absolute inset-0 bg-[#f4f2ec] opacity-0" />
        )}

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center text-[#141414] sm:gap-10">
          <SectionLabel className="finale-beat text-[#141414]/60">
            CSE — FINAL TRANSMISSION
          </SectionLabel>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="finale-logo flex flex-col items-center gap-3">
              {scriptSoldiers.logo && (
                <Image
                  src={scriptSoldiers.logo}
                  alt="Script Soldiers"
                  width={160}
                  height={160}
                  sizes="160px"
                  className="h-14 w-14 object-contain grayscale sm:h-28 sm:w-28"
                />
              )}
              <span className="mono-label text-[#141414]/70">
                SCRIPT SOLDIERS
              </span>
            </div>
            <span className="finale-logo font-sans text-3xl text-[#141414]/60">
              +
            </span>
            <div className="finale-logo flex flex-col items-center gap-3">
              {cyberKnights.logo && (
                <Image
                  src={cyberKnights.logo}
                  alt="Cyber Knights"
                  width={160}
                  height={160}
                  sizes="160px"
                  className="h-14 w-14 object-contain grayscale sm:h-28 sm:w-28"
                />
              )}
              <span className="mono-label text-[#141414]/70">CYBER KNIGHTS</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="finale-word font-mono text-sm tracking-[0.25em] text-[#141414]/80">
              SCRIPT SOLDIERS
            </p>
            <p className="finale-word font-mono text-sm tracking-[0.25em] text-[#141414]/80">
              +
            </p>
            <p className="finale-word font-mono text-sm tracking-[0.25em] text-[#141414]/80">
              CYBER KNIGHTS
            </p>
            <p className="finale-word mono-label text-[#141414]/60">↓</p>
            <p className="finale-cse font-sans text-5xl font-semibold tracking-tight text-[#141414] sm:text-8xl">
              CSE
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            <p className="finale-line font-sans text-lg font-medium tracking-tight text-[#141414] sm:text-3xl">
              ONE DEPARTMENT.
            </p>
            <p className="finale-line font-sans text-lg font-medium tracking-tight text-[#141414] sm:text-3xl">
              TWO FORCES.
            </p>
            <p className="finale-line font-sans text-lg font-medium tracking-tight text-[#141414] sm:text-3xl">
              ONE FUTURE.
            </p>
          </div>

          <div className="finale-info flex flex-col items-center gap-2 border-t border-[#141414]/20 pt-6">
            <p className="mono-label text-[#141414]">{department.college}</p>
            <p className="mono-label text-[#141414]/60">
              {department.department}
            </p>
            {department.email && (
              <p className="mono-label text-[#141414]/60">
                {department.email}
              </p>
            )}
            {department.phone && (
              <p className="mono-label text-[#141414]/60">
                {department.phone}
              </p>
            )}
            {department.address && (
              <p className="mono-label text-[#141414]/60">
                {department.address}
              </p>
            )}
            {department.socials.length > 0 && (
              <p className="mt-1 flex items-center gap-4">
                {department.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mono-label text-[#141414]/60 transition-colors hover:text-[#141414]"
                  >
                    {social.label} ↗
                  </a>
                ))}
              </p>
            )}
            <p className="mono-label text-[#141414]/40">
              CSE CLUBS © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}