"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { SectionLabel } from "@/components/shared/typography";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";
import type { ClubEvent } from "@/data/types";

function EventTile({
  index,
  image,
  alt,
  className,
}: {
  index: string;
  image: string | null | undefined;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "corner-ticks relative aspect-[3/4] overflow-hidden border border-accent/25 bg-forge-navy/40",
        className,
      )}
    >
      {image ? (
        <Image src={image} alt={alt} fill sizes="320px" className="img-treated object-cover" />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="bg-noise absolute inset-0 opacity-20" />
          <span className="type-display text-accent/30">{index}</span>
        </div>
      )}
    </div>
  );
}

export function EventsSection({ events }: { events: ClubEvent[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const year = events[0]?.year ?? "2026";
  const current = open !== null ? events[open] : null;

  useGSAP(
    () => {
      if (reduce) return;
      const scope = ref.current;
      if (!scope) return;
      const preview = scope.querySelector<HTMLElement>(".event-preview");
      const list = scope.querySelector<HTMLElement>(".event-list");
      if (!preview || !list) return;

      const xTo = gsap.quickTo(preview, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(preview, "y", { duration: 0.35, ease: "power3" });

      const move = (e: PointerEvent) => {
        if (hoveredRef.current === null) return;
        const r = list.getBoundingClientRect();
        xTo(e.clientX - r.left + 28);
        yTo(e.clientY - r.top - 140);
      };
      list.addEventListener("pointermove", move);
      return () => list.removeEventListener("pointermove", move);
    },
    { scope: ref, dependencies: [reduce] },
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    if (open !== null) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useGSAP(
    () => {
      if (reduce || open === null) return;
      const modal = ref.current?.querySelector<HTMLElement>(".event-modal");
      if (!modal) return;
      gsap.fromTo(
        modal,
        { autoAlpha: 0, y: 28, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
      );
    },
    { scope: ref, dependencies: [open, reduce] },
  );

  if (events.length === 0) return null;

  return (
    <section ref={ref} className="relative">
      <div className="mx-auto max-w-6xl px-6 py-28 sm:px-10">
        <Reveal>
          <div className="flex items-end justify-between border-b border-accent/25 pb-8">
            <div>
              <SectionLabel>{"// EVENT SCHEDULE"}</SectionLabel>
              <p className="type-display mt-2 leading-none text-accent/20">
                {year}
              </p>
            </div>
            <p className="mono-label hidden text-ivory-dim/50 sm:block">
              HOVER TO PREVIEW — CLICK FOR DETAILS
            </p>
          </div>
        </Reveal>

        <div className="event-list relative">
          <div
            className={cn(
              "event-preview pointer-events-none absolute left-0 top-0 z-20 w-48 opacity-0 transition-opacity duration-300 sm:w-56",
              hovered !== null && !reduce ? "opacity-100" : "",
            )}
            aria-hidden
          >
            {hovered !== null && (
              <EventTile
                index={String(hovered + 1).padStart(2, "0")}
                image={events[hovered].image}
                alt={events[hovered].title}
              />
            )}
          </div>

          {events.map((event, i) => (
            <Reveal key={event.id} delay={i * 0.08}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setOpen(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen(i);
                  }
                }}
                onMouseEnter={() => {
                  hoveredRef.current = i;
                  setHovered(i);
                }}
                onMouseLeave={() => {
                  hoveredRef.current = null;
                  setHovered(null);
                }}
                className="group hover-lift flex cursor-pointer items-baseline gap-6 border-b border-dashed border-accent/25 py-8 transition-colors hover:border-accent sm:gap-10 sm:py-10"
              >
                <span className="mono-label text-accent/60 transition-colors group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="type-display text-2xl text-ivory transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl lg:text-5xl">
                  {event.title}
                </h3>
                <span className="mono-label ml-auto text-ivory-dim/50">
                  {event.date ?? "TBD"}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          />
          <div className="event-modal relative max-h-[85vh] w-full max-w-3xl overflow-y-auto border border-accent/25 bg-page-bg">
            <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
              <EventTile
                index={String(open! + 1).padStart(2, "0")}
                image={current.image}
                alt={current.title}
                className="w-full rounded-none border-0 border-r border-accent/20 sm:h-full"
              />
              <div className="flex flex-col gap-5 p-6 sm:p-8">
                <p className="mono-label text-accent">
                  {"EVENT "}
                  {String(open! + 1).padStart(2, "0")}
                  {" // "}
                  {current.year ?? "TBD"}
                </p>
                <h3 className="type-display text-3xl text-ivory sm:text-4xl">
                  {current.title}
                </h3>
                <div className="border-b border-dashed border-accent/25" />
                <div className="flex flex-col gap-3 font-mono text-xs text-ivory/75">
                  <p>
                    <span className="text-ivory-dim/50">DATE — </span>
                    {current.date ?? "TBD"}
                  </p>
                  <p>
                    <span className="text-ivory-dim/50">VENUE — </span>
                    {current.venue ?? "TBD"}
                  </p>
                  <p>
                    <span className="text-ivory-dim/50">STATUS — </span>
                    {current.status.toUpperCase()}
                  </p>
                </div>
                <div className="border-b border-dashed border-accent/25" />
                <p className="text-sm leading-7 text-ivory/75">
                  {current.description ?? "Details to be added later."}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  {current.registrationUrl ? (
                    <a
                      href={current.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mono-label text-accent hover:underline"
                    >
                      REGISTER →
                    </a>
                  ) : (
                    <span className="mono-label text-ivory-dim/40">
                      REGISTRATION TBD
                    </span>
                  )}
                  <button
                    ref={closeRef}
                    onClick={() => setOpen(null)}
                    className="mono-label border border-accent/30 px-4 py-2 text-accent transition-colors hover:bg-accent/10"
                  >
                    CLOSE ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}