"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { scriptSoldiers } from "@/data/scriptSoldiers";
import { cyberKnights } from "@/data/cyberKnights";
import { Display, CardTitle, SectionLabel } from "@/components/shared/typography";
import {
  GridPattern,
  NoiseField,
  GlowField,
} from "@/components/shared/textures";
import { LogoLockup } from "@/components/shared/logo-lockup";
import { ParticleField } from "@/components/landing/particle-field";
import { LeadershipSection } from "@/components/club/leadership";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

const clubs = [
  { club: scriptSoldiers, accent: "#c79a3b", energy: "#8e1830" },
  { club: cyberKnights, accent: "#00d9e8", energy: "#36f3ff" },
];

export function LandingPage() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        gsap.set(
          ".top-bar, .origin-label, .display-line, .tagline, .bottom-bar",
          { autoAlpha: 1, y: 0 },
        );
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".top-bar", { y: -24, autoAlpha: 0, duration: 0.8 })
        .from(
          ".display-line",
          { y: 80, autoAlpha: 0, duration: 1.2, stagger: 0.12 },
          "-=0.4",
        )
        .from(".origin-label", { autoAlpha: 0, duration: 0.6 }, "-=0.8")
        .from(".tagline", { autoAlpha: 0, duration: 0.6 }, "-=0.3")
        .from(".bottom-bar", { autoAlpha: 0, duration: 0.6 }, "-=0.4");
    },
    { scope: ref },
  );

  return (
    <main
      id="main"
      ref={ref}
      className="vignette relative flex min-h-screen flex-col overflow-hidden bg-origin-950 px-6 py-14 text-ivory sm:px-12 sm:py-20"
    >
      <GridPattern className="opacity-40" />
      <NoiseField className="opacity-30" />
      <GlowField className="opacity-25" />
      <ParticleField className="opacity-70" />

      <div className="relative z-10 flex flex-1 flex-col">
        <header className="top-bar flex items-center justify-between border-b border-ivory-dim/15 pb-6">
          <div
            className="flex w-fit flex-col items-center"
            style={{ filter: "drop-shadow(0 0 14px rgba(227,6,19,0.32)) drop-shadow(0 0 32px rgba(227,6,19,0.14))" }}
          >
            <h1 className="text-center font-sans text-[clamp(1.9rem,4vw,2.8rem)] font-black leading-none tracking-tight text-[#E30613]">
              PERI
            </h1>
            <p className="text-center font-sans text-[clamp(0.52rem,1.1vw,0.72rem)] font-semibold tracking-[0.16em] text-[#E30613]">
              INSTITUTE OF TECHNOLOGY
            </p>
            <p className="mt-0.5 text-center font-mono text-[0.5rem] tracking-[0.16em] text-argent/70">
              (AN AUTONOMOUS INSTITUTION)
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="mono-label hidden text-graphite sm:block">
              DEPARTMENT OF CSE
            </span>
            <nav className="flex items-center gap-4 border-l border-ivory-dim/15 pl-6">
              <Link href="/gallery" className="mono-label text-graphite transition-colors hover:text-accent">
                GALLERY
              </Link>
              <Link href="/events" className="mono-label text-graphite transition-colors hover:text-accent">
                EVENTS
              </Link>
            </nav>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-12 py-20 text-center">
          <SectionLabel className="origin-label text-graphite">
            CSE — THE ORIGIN
          </SectionLabel>

          <div className="flex flex-col gap-2">
            <Display className="display-line">DEPARTMENT OF</Display>
            <Display className="display-line text-outline">
              COMPUTER SCIENCE
            </Display>
            <Display className="display-line text-outline">
              & ENGINEERING
            </Display>
          </div>

          <p className="tagline mono-label text-argent/70">
            ONE DEPARTMENT — TWO FORCES
          </p>
        </div>

        <LeadershipSection />

        {/* the journey evolved → two distinct paths */}
        <section className="journey-section relative z-[20] mx-auto w-full max-w-4xl text-center">
          <Reveal>
            <p className="mono-label text-graphite">OUR JOURNEY CONTINUES</p>
            <span aria-hidden className="mx-auto mt-6 block h-10 w-px bg-gradient-to-b from-ivory-dim/40 to-transparent" />
            <p className="mt-2 font-sans text-xl font-light tracking-wide text-ivory sm:text-2xl">
              TWO DISTINCT PATHS
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <span className="corner-ticks border border-[#c79a3b]/40 bg-origin-900/60 px-5 py-3 font-mono text-[10px] tracking-[0.25em] text-ivory/85 backdrop-blur-sm">
                SCRIPT SOLDIERS
              </span>
              <span className="font-mono text-sm text-graphite">+</span>
              <span className="corner-ticks border border-accent/30 bg-origin-900/60 px-5 py-3 font-mono text-[10px] tracking-[0.25em] text-ivory/85 backdrop-blur-sm">
                CYBER KNIGHTS
              </span>
            </div>
          </Reveal>
        </section>

        <section className="gateway relative z-[20] mx-auto w-full max-w-4xl pb-12">
          <Reveal>
            <div className="mb-10 flex flex-col gap-3">
              <SectionLabel>CLUB GATEWAY</SectionLabel>
              <div className="h-px w-full bg-ivory-dim/15" />
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {clubs.map(({ club, accent, energy }, i) => (
              <Reveal key={club.id} delay={i * 0.15}>
                <Link
                  href={`/${club.id}`}
                  style={{ "--accent": accent, "--energy": energy } as CSSProperties}
                  className={cn(
                    "club-card corner-ticks group relative flex h-full flex-col gap-6 border border-ivory-dim/15",
                    "bg-origin-900/50 p-8 text-left transition-colors duration-300",
                    "hover:border-accent",
                  )}
                >
                  <span className="sheen" aria-hidden />
                  <div className="flex items-center justify-between">
                    <LogoLockup club={club} size={56} muted />
                    <span className="mono-label text-ivory-dim/50 transition-colors duration-300 group-hover:text-accent">
                      ENTER →
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <CardTitle className="transition-colors duration-300 group-hover:text-accent">
                      {club.name.toUpperCase()}
                    </CardTitle>
                    <p className="text-sm leading-6 text-ivory/70">
                      {club.description}
                    </p>
                    <p className="mono-label text-ivory-dim/60">
                      MOTTO — {club.motto.toUpperCase()}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="contact-section relative z-[20] mx-auto w-full max-w-4xl pb-8 text-center">
          <Reveal>
            <SectionLabel>CONTACT</SectionLabel>
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="mono-label text-graphite">REACH US AT</p>
              <a
                href="mailto:periitcseclub@gmail.com"
                className="font-mono text-sm tracking-[0.18em] text-accent underline-offset-4 transition-colors hover:text-accent-bright hover:underline sm:text-base"
              >
                periitcseclub@gmail.com
              </a>
              <p className="mono-label text-ivory-dim/50">DEPARTMENT OF CSE — PERI INSTITUTE OF TECHNOLOGY</p>
            </div>
          </Reveal>
        </section>

        <footer className="bottom-bar mt-12 flex items-center justify-between border-t border-ivory-dim/15 pt-6">
          <span className="mono-label text-graphite">
            SYS/BOOT — IDENTITY SYSTEM ONLINE
          </span>
          <span className="mono-label hidden text-graphite sm:block">
            CSE CLUBS © {new Date().getFullYear()}
          </span>
        </footer>
      </div>
    </main>
  );
}