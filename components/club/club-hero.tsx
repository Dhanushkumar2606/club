"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { Club } from "@/data/types";
import { ParticleField } from "@/components/landing/particle-field";
import { getLockTargets } from "@/animations/transitions/club-entry";

export function ClubHero({ club }: { club: Club }) {
  const ref = useRef<HTMLElement>(null);
  const isForge = club.id === "script-soldiers";
  const [wordA, wordB] = club.name.toUpperCase().split(" ");

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const scope = ref.current;
      if (!scope) return;

      const logo = scope.querySelector<HTMLElement>(".hero-logo");
      const logoHolder = scope.querySelector<HTMLElement>(".hero-logo-holder");
      const title = scope.querySelector<HTMLElement>(".hero-title");
      const glow = scope.querySelector<HTMLElement>(".hero-glow");
      const scan = scope.querySelector<HTMLElement>(".scan-line");
      const light = scope.querySelector<HTMLElement>(".gold-light");
      const scrollHint = scope.querySelector<HTMLElement>(".hero-scroll");
      const nav = scope.querySelector<HTMLElement>(".hero-nav");

      if (reduce || !logo || !logoHolder || !title) {
        gsap.set([logo, logoHolder, title].filter(Boolean), {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
        });
        gsap.set(".hero-title-line, .hero-meta, .hero-welcome", { autoAlpha: 1 });
        gsap.set(
          ".boot-text, .boot-offline, .boot-init, .boot-panel",
          { autoAlpha: 0 },
        );
        gsap.set([glow, scan, light, scrollHint].filter(Boolean), {
          autoAlpha: 0,
        });
        if (nav) gsap.set(nav, { autoAlpha: 1 });
        return;
      }

      const logoRect = logo.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const heroH = scope.getBoundingClientRect().height;
      const lock = getLockTargets(
        logoRect,
        titleRect,
        logoRect.width * 0.4,
      );

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      if (isForge) {
        tl.fromTo(
          logo,
          { scale: 0.55, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.3 },
        )
          .fromTo(
            light,
            { xPercent: -140, autoAlpha: 0 },
            { xPercent: 140, autoAlpha: 1, duration: 1.9, ease: "power2.inOut" },
            "-=1.1",
          )
          .fromTo(
            ".hero-title-line",
            { y: 32, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12 },
            "-=1.5",
          )
          .fromTo(
            ".hero-meta",
            { y: 16, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7 },
            "-=0.7",
          )
          .fromTo(
            ".hero-welcome",
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7 },
            "-=0.4",
          )
          .to(nav, { autoAlpha: 1, duration: 0.5 }, "-=0.3");
      } else {
        tl.set([title, scrollHint], { autoAlpha: 0 })
          .fromTo(scan, { y: 0 }, { y: heroH, duration: 1.6, ease: "power2.inOut" }, 0.3)
          .to(".boot-offline", { autoAlpha: 0, duration: 0.5 }, "-=0.4")
          .fromTo(".boot-init", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
          .to(".boot-init", { autoAlpha: 0, duration: 0.4 }, "+=0.5")
          .fromTo(
            ".boot-panel",
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.4 },
            "-=0.2",
          )
          .fromTo(
            ".boot-line",
            { autoAlpha: 0, x: -10 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.35,
              stagger: 0.22,
              ease: "power2.out",
            },
            "-=0.1",
          )
          .fromTo(
            ".boot-status",
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 0.25,
              stagger: 0.22,
              ease: "power2.out",
            },
            "-=0.05",
          )
          .to(".boot-panel", { autoAlpha: 0, duration: 0.5 }, "+=1.1")
          .fromTo(
            logo,
            mobile
              ? { scale: 0.15, autoAlpha: 0 }
              : { scale: 0.15, autoAlpha: 0, filter: "blur(10px)" },
            mobile
              ? {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 1.1,
                  ease: "expo.out",
                }
              : {
                  scale: 1,
                  autoAlpha: 1,
                  filter: "blur(0px)",
                  duration: 1.1,
                  ease: "expo.out",
                },
            "-=0.4",
          )
          .set(title, { autoAlpha: 1 })
          .fromTo(
            ".hero-title-line",
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12 },
            "-=0.3",
          )
          .fromTo(
            ".hero-welcome",
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7 },
            "-=0.3",
          )
          .to(scrollHint, { autoAlpha: 1, duration: 0.4 })
          .to(nav, { autoAlpha: 1, duration: 0.5 }, "-=0.2");
      }

      /* scroll-triggered identity transition (replaces timed travel) */
      const travel = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "+=65%",
          scrub: 0.6,
        },
      });
      travel
        .to(".hero-welcome", { autoAlpha: 0, y: -20, duration: 0.18 }, 0)
        .to(".hero-meta", { autoAlpha: 0, duration: 0.15 }, 0)
        .to(scrollHint, { autoAlpha: 0, duration: 0.1 }, 0)
        .to(logoHolder, { x: lock.dx, y: lock.dy, duration: 1 }, 0)
        .to(logo, { scale: 0.4, duration: 1 }, 0)
        .to(title, { x: lock.tdx, y: lock.tdy, scale: 0.42, duration: 1 }, 0);

      // release stale GPU layer promotion once the identity has settled
      travel.eventCallback("onComplete", () => {
        scope
          .querySelectorAll(".scan-line, .gold-light, .hero-logo, .hero-title")
          .forEach((el) => el.classList.remove("will-change-transform"));
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      {!isForge && (
        <div
          className="hero-glow pointer-events-none absolute inset-0 text-cyan-glow"
          style={{
            background:
              "radial-gradient(50% 40% at 50% 55%, color-mix(in srgb, currentColor 30%, transparent), transparent 70%)",
          }}
        />
      )}

      {isForge && (
        <div
          aria-hidden
          className="gold-light will-change-transform pointer-events-none absolute inset-y-0 left-0 w-1/3"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 16%, transparent), transparent)",
          }}
        />
      )}
      {!isForge && (
        <div
          aria-hidden
          className="scan-line will-change-transform pointer-events-none absolute inset-x-6 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--accent), transparent)",
            boxShadow: "0 0 12px color-mix(in srgb, var(--accent) 60%, transparent)",
          }}
        />
      )}

      {isForge && <ParticleField className="opacity-50" />}

      <div className="hero-nav absolute right-6 top-6 flex items-center gap-5 sm:right-10 sm:top-8">
        <Link
          href="/"
          className="mono-label text-accent hover:underline"
        >
          ← SYS/HOME
        </Link>
        <span className="mono-label hidden text-ivory-dim sm:block">
          {club.identity}
        </span>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-10">
        {!isForge && (
          <div className="boot-text relative text-center">
            <p className="boot-offline mono-label text-cyan/60">
              SYSTEM OFFLINE
            </p>
            <p className="boot-init mono-label absolute inset-0 opacity-0 text-cyan-glow">
              SYSTEM INITIALIZING
            </p>
            <div className="boot-panel absolute left-1/2 top-10 w-72 -translate-x-1/2 opacity-0 sm:w-80">
              <div className="flex flex-col gap-2.5 text-left font-mono text-[11px] tracking-wider text-ivory/70">
                <p className="boot-line flex items-center gap-3">
                  <span>NETWORK</span>
                  <span className="flex-1 border-b border-dotted border-ivory-dim/40" />
                  <span className="boot-status text-cyan-glow">ONLINE</span>
                </p>
                <p className="boot-line flex items-center gap-3">
                  <span>SECURITY</span>
                  <span className="flex-1 border-b border-dotted border-ivory-dim/40" />
                  <span className="boot-status text-cyan-glow">ACTIVE</span>
                </p>
                <p className="boot-line flex items-center gap-3">
                  <span>THREAT MONITOR</span>
                  <span className="flex-1 border-b border-dotted border-ivory-dim/40" />
                  <span className="boot-status text-cyan-glow">READY</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="hero-logo-holder relative">
          {club.logo && (
            <Image
              src={club.logo}
              alt={`${club.name} logo`}
              width={192}
              height={192}
              priority
              className="hero-logo will-change-transform h-auto w-auto object-contain"
              style={{ width: 96, height: 96 }}
              sizes="96px"
            />
          )}
        </div>

        <h1 className={`hero-title will-change-transform text-center ${isForge ? "" : "opacity-0"}`}>
          <span className="hero-title-line opacity-0 block font-sans text-5xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
            {wordA}
          </span>
          <span className="hero-title-line text-glow opacity-0 block font-sans text-5xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
            {wordB}
          </span>
        </h1>

        <p className="hero-welcome mono-label opacity-0 text-ivory-dim">
          Welcome to the world of {club.name}
        </p>

        {isForge && (
          <div className="hero-meta opacity-0 text-center">
            {club.tagline && (
              <p className="mono-label text-accent">{club.tagline}</p>
            )}
            <p className="mono-label mt-2 text-ivory-dim/70">
              {"// "}
              {club.motto.toUpperCase()}
            </p>
          </div>
        )}
      </div>

      <p className="hero-scroll mono-label absolute bottom-8 left-1/2 -translate-x-1/2 text-ivory-dim">
        SCROLL ↓
      </p>
    </section>
  );
}