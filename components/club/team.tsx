"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { useIsMobile } from "@/lib/use-is-mobile";
import type { Club } from "@/data/types";

function MemberCard({
  index,
  name,
  position,
  linkedin,
  image,
  motion,
}: {
  index: number;
  name: string;
  position: string;
  linkedin: string | null | undefined;
  image: string | null | undefined;
  motion: "fluid" | "precise";
}) {
  const tag = String(index + 1).padStart(2, "0");
  return (
    <div className="team-member group pointer-events-none absolute inset-0 flex items-center justify-center px-6 opacity-0 sm:px-10">
      <div className="grid w-full max-w-6xl grid-cols-[auto_minmax(0,1fr)] items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="team-photo corner-ticks img-frame relative isolate mx-auto aspect-[3/4] w-36 overflow-hidden border border-accent/25 bg-forge-navy/40 lg:mx-0 lg:w-full lg:max-w-sm">
          <div className="team-photo-wipe absolute inset-0">
            <div className="team-photo-inner absolute inset-0 overflow-hidden">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(min-width: 1024px) 40vw, 144px"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  className="img-treated h-full w-full"
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center bg-forge-navy/40">
                  <div className="bg-noise absolute inset-0 opacity-20" />
                  <span className="type-display text-accent/30">{tag}</span>
                </div>
              )}
            </div>
            {motion === "precise" && (
              <>
                <span className="team-scan-tag mono-label absolute left-3 top-3 text-accent">
                  SCAN
                </span>
                <span className="team-scanline will-change-transform absolute inset-y-0 left-0 w-px bg-accent" />
              </>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <p className="team-meta-el mono-label text-accent">[{tag}]</p>
          {motion === "precise" && (
            <p className="team-verified mono-label text-accent">
              IDENTITY VERIFIED ✓
            </p>
          )}
          <h3 className="team-name type-display text-ivory">
            {name.toUpperCase()}
          </h3>
          <span className="member-accent-line block h-px w-16 origin-left bg-accent/70" />
          <p className="team-meta-el mono-label text-accent">
            {motion === "precise"
              ? `/ ${position.toUpperCase()}`
              : position.toUpperCase()}
          </p>
          {linkedin ? (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="team-meta-el mono-label relative block w-fit text-ivory-dim transition-colors hover:text-accent"
            >
              <span className="block transition-opacity duration-300 group-hover:opacity-0">
                CONNECT ↗
              </span>
              <span
                aria-hidden
                className="absolute inset-0 block text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                LINKEDIN ↗
              </span>
            </a>
          ) : (
            <span className="team-meta-el mono-label relative block text-ivory-dim/40">
              <span className="block transition-opacity duration-300 group-hover:opacity-0">
                CONNECT ↗
              </span>
              <span
                aria-hidden
                className="absolute inset-0 block opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                LINKEDIN
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function TeamSection({
  club,
  title = "THE SOLDIERS",
  subtitle = "ONE FORCE.",
  motion = "fluid",
}: {
  club: Club;
  title?: string;
  subtitle?: string;
  motion?: "fluid" | "precise";
}) {
  const ref = useRef<HTMLElement>(null);
  const lastSpot = useRef(0);
  const reduce = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const members = club.members;

  useGSAP(
    () => {
      if (reduce || members.length === 0) return;
      const scope = ref.current;
      if (!scope) return;

      const title = scope.querySelector<HTMLElement>(".team-title");
      const minds = scope.querySelector<HTMLElement>(".team-minds");
      const intro = scope.querySelector<HTMLElement>(".team-intro");
      const stage = scope.querySelector<HTMLElement>(".team-stage");
      const counter = scope.querySelector<HTMLElement>(".team-counter");
      const bar = scope.querySelector<HTMLElement>(".team-progress-bar");
      const layers = [
        ...scope.querySelectorAll<HTMLElement>(".team-member"),
      ];
      if (!title || !minds || !intro || !stage || !counter || !bar) return;

      const titleSplit = SplitText.create(title, { type: "chars" });
      const mindsSplit = SplitText.create(minds, { type: "chars" });

      gsap.set(titleSplit.chars, { autoAlpha: 0, y: 60, rotateX: 45 });
      gsap.set(mindsSplit.chars, { autoAlpha: 0, y: 30 });
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      // pre-beat layers are visibility-hidden — they can never intercept clicks
      gsap.set(layers, { autoAlpha: 0 });

      const perMemberNameSplit = layers.map((layer) => {
        const el = layer.querySelector<HTMLElement>(".team-name");
        const meta = layer.querySelectorAll<HTMLElement>(".team-meta-el");
        const photo = layer.querySelector<HTMLElement>(".team-photo");
        const wipe = layer.querySelector<HTMLElement>(".team-photo-wipe");
        const inner = layer.querySelector<HTMLElement>(".team-photo-inner");
        const scanline = layer.querySelector<HTMLElement>(".team-scanline");
        const scanTag = layer.querySelector<HTMLElement>(".team-scan-tag");
        const verified = layer.querySelector<HTMLElement>(".team-verified");
        const accent = layer.querySelector<HTMLElement>(".member-accent-line");
        const split = el ? SplitText.create(el, { type: "words,chars" }) : null;
        if (split) gsap.set(split.chars, { autoAlpha: 0, y: 24 });
        gsap.set(meta, { autoAlpha: 0, y: 16 });
        if (accent) gsap.set(accent, { scaleX: 0 });
        if (scanline) gsap.set(scanline, { autoAlpha: 0, x: 0 });
        if (scanTag) gsap.set(scanTag, { autoAlpha: 0 });
        if (verified) {
          gsap.set(verified, { autoAlpha: 0, clipPath: "inset(0% 100% 0% 0%)" });
        }
        return { split, meta, photo, wipe, inner, scanline, scanTag, verified, accent };
      });

      const total = members.length + 1;
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const step = Math.min(
              members.length,
              Math.max(0, Math.floor(self.progress * total)),
            );
            const next =
              step === 0
                ? "INTRO"
                : `${String(step).padStart(2, "0")} / ${String(
                    members.length,
                  ).padStart(2, "0")}`;
            if (counter.textContent !== next) counter.textContent = next;
            gsap.set(bar, { scaleX: step / members.length });
            // PHASE 2.9 — spotlight drifts toward the active member
            if (step !== lastSpot.current) {
              lastSpot.current = step;
              const spot = scope.querySelector<HTMLElement>(".team-spotlight");
              if (spot) {
                if (step === 0) {
                  gsap.to(spot, { opacity: 0, duration: 0.6 });
                } else {
                  const px = 32 + ((step * 37) % 36);
                  gsap.to(spot, {
                    opacity: 1,
                    background: `radial-gradient(46% 40% at ${px}% 45%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)`,
                    duration: 0.8,
                    ease: "power2.out",
                  });
                }
              }
            }
            // only the visible member accepts input (CONNECT clicks)
            layers.forEach((l, i) => {
              l.style.pointerEvents = i === step - 1 ? "auto" : "none";
            });
          },
        },
      });

      tl.to(
        titleSplit.chars,
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 0.45,
          stagger: 0.02,
          ease: "power3.out",
        },
        0.08,
      ).to(
        mindsSplit.chars,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.015,
          ease: "power3.out",
        },
        0.55,
      );

      layers.forEach((layer, i) => {
        const d = perMemberNameSplit[i];
        const t = 1 + i;
        tl.to(layer, { autoAlpha: 1, duration: 0.08 }, t)
          .fromTo(
            d.wipe,
            { scaleY: 0, transformOrigin: "top" },
            { scaleY: 1, duration: 0.55, ease: "power3.inOut" },
            t + 0.04,
          )
          .fromTo(
            d.inner,
            { scale: 1.14, yPercent: 8 },
            { scale: 1, yPercent: 0, duration: 0.9, ease: "power2.out" },
            t + 0.04,
          )
          // beat peak — subtle enlarge (PHASE 2.8) — yPercent kept at 0 to avoid bottom gap/seam
          .to(d.inner, { scale: 1.04, duration: 0.3, ease: "power2.out" }, t + 0.6)
          .to(d.inner, { scale: 1, duration: 0.45, ease: "power2.inOut" }, t + 1.05);

        if (d.accent) {
          tl.to(
            d.accent,
            { scaleX: 1, duration: 0.3, ease: "power3.out" },
            motion === "precise" ? t + 0.58 : t + 0.12,
          );
        }

        if (
          motion === "precise" &&
          d.photo &&
          d.scanline &&
          d.scanTag &&
          d.verified
        ) {
          const photoW = d.photo.offsetWidth;
          tl.fromTo(
            d.scanline,
            { x: 0, autoAlpha: 0 },
            {
              x: photoW,
              autoAlpha: 1,
              duration: 0.22,
              ease: "power4.in",
            },
            t + 0.02,
          )
            .to(d.scanline, { autoAlpha: 0, duration: 0.1 }, t + 0.28)
            .to(d.scanTag, { autoAlpha: 1, duration: 0.06 }, t)
            .to(d.scanTag, { autoAlpha: 0, duration: 0.08 }, t + 0.3)
            .to(
              d.verified,
              {
                autoAlpha: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.12,
                ease: "power4.in",
              },
              t + 0.52,
            );
        }

        tl.to(
          d.split ? d.split.chars : [],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.016,
            ease: "power3.out",
          },
          motion === "precise" ? t + 0.62 : t + 0.14,
        )
          .to(
            d.meta,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.35,
              stagger: 0.07,
              ease: "power2.out",
            },
            motion === "precise" ? t + 0.74 : t + 0.28,
          )
          .to(stage, { yPercent: 1.6, duration: 0.55, ease: "power1.inOut" }, t)
          .to(stage, { yPercent: 0, duration: 0.55, ease: "power1.inOut" }, t + 0.6)
          .to(intro, { autoAlpha: 0, duration: 0.25 }, t);

        if (i < layers.length - 1) {
          tl.to(layer, { autoAlpha: 0, duration: 0.1, ease: "power1.in" }, t + 1);
        }
      });
    },
    { scope: ref, dependencies: [reduce, members.length, motion] },
  );

  const total = members.length + 1;

  if (reduce) {
    return (
      <section ref={ref} className="relative flex flex-col items-center">
        <div className="flex max-w-6xl flex-col gap-6 px-6 py-24 text-center sm:px-10">
          <p className="mono-label text-accent">{"// TEAM ROSTER"}</p>
          <h2 className="type-display text-ivory">{title}</h2>
          <p className="mono-label text-ivory-dim/70">
            {members.length} MINDS. {subtitle}
          </p>
          <div className="mt-10 flex flex-col gap-4">
            {members.map((member, i) => (
              <div
                key={i}
                className="group flex items-center gap-6 border border-accent/20 bg-forge-navy/20 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent"
              >
                <div className="corner-ticks img-frame relative aspect-[3/4] w-24 shrink-0 overflow-hidden border border-accent/25 bg-forge-navy/40">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="96px"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                      className="img-treated h-full w-full transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="type-display text-accent/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {motion === "precise" && (
                    <p className="mono-label text-accent">
                      IDENTITY VERIFIED ✓
                    </p>
                  )}
                  <h3 className="type-heading text-ivory">
                    {member.name.toUpperCase()}
                  </h3>
                  <p className="mono-label text-accent">
                    {motion === "precise"
                      ? `/ ${member.position.toUpperCase()}`
                      : member.position.toUpperCase()}
                  </p>
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-meta-el mono-label relative block w-fit text-ivory-dim transition-colors hover:text-accent"
                    >
                      <span className="block transition-opacity duration-300 group-hover:opacity-0">
                        CONNECT ↗
                      </span>
                      <span
                        aria-hidden
                        className="absolute inset-0 block text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        LINKEDIN ↗
                      </span>
                    </a>
                  ) : (
                    <span className="team-meta-el mono-label relative block text-ivory-dim/40">
                      <span className="block transition-opacity duration-300 group-hover:opacity-0">
                        CONNECT ↗
                      </span>
                      <span
                        aria-hidden
                        className="absolute inset-0 block opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        LINKEDIN
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${total * (mobile ? 70 : 100)}vh` }}
    >
      <div className="team-stage sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* PHASE 2.9 — member spotlight: ambient environment follows active member */}
        <div
          aria-hidden
          className="team-spotlight pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              "radial-gradient(46% 40% at 50% 45%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="team-intro absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center sm:px-10">
            <p className="mono-label text-accent">{"// TEAM ROSTER"}</p>
            <h2 className="team-title type-display text-ivory">
              {title}
            </h2>
            <p role="text" className="team-minds mono-label text-ivory-dim/70">
              {members.length} MINDS. {subtitle}
            </p>
          </div>
          {members.map((member, i) => (
            <MemberCard
              key={i}
              index={i}
              name={member.name}
              position={member.position}
              linkedin={member.linkedin}
              image={member.image}
              motion={motion}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-6 bottom-6 z-10 flex items-center justify-between sm:inset-x-10">
          <span className="team-counter mono-label text-accent">
            {String(0).padStart(2, "0")} / {String(members.length).padStart(2, "0")}
          </span>
          <span className="mono-label text-ivory-dim/50">
            SCROLL TO INTRODUCE
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-6 bottom-14 sm:inset-x-10">
          <div className="h-px w-full bg-ivory-dim/15">
            <div className="team-progress-bar h-px w-full bg-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}