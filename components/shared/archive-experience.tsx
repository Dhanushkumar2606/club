"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { ArchiveEntry } from "@/data/archive";

/*
 * ARCHIVE EXPERIENCE — cinematic history journey (reusable).
 * Desktop: vertical scroll drives a horizontal photo track; the active
 * photograph is dominant while neighbours stay subdued; a live counter and
 * metadata readout follow. Click opens a lightbox (Esc / backdrop closes).
 * Mobile (<md): natural vertical progression, one dominant image at a time.
 * Reduced motion: static horizontal strip, no pinning.
 * Positioning comes only from scroll progress + pointer — never layout hacks.
 */

export function ArchiveExperience({
  items,
  eyebrow,
  heading,
  subline,
}: {
  items: ArchiveEntry[];
  eyebrow: string;
  heading: string;
  subline: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const metaLabelRef = useRef<HTMLSpanElement>(null);
  const metaTitleRef = useRef<HTMLHeadingElement>(null);
  const metaDescRef = useRef<HTMLParagraphElement>(null);
  const metaYearRef = useRef<HTMLSpanElement>(null);
  const [lightbox, setLightbox] = useState<ArchiveEntry | null>(null);

  /* Escape closes the viewer */
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  useGSAP(
    () => {
      const scope = ref.current;
      if (!scope) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const track = trackRef.current;
      if (!track) return;

      if (reduce || window.matchMedia("(max-width: 767px)").matches) {
        // static horizontal strip — collapse the scroll runway, no pinning
        const pin = scope.querySelector<HTMLElement>(".archive-pin");
        if (pin) pin.style.height = "auto";
        gsap.set(track, { x: 0 });
        return;
      }

      const panels = [...track.querySelectorAll<HTMLElement>(".archive-panel")];

      const setActive = (idx: number) => {
        panels.forEach((p, i) => {
          const dom = i === idx;
          gsap.to(p.querySelector(".archive-img-wrap"), {
            scale: dom ? 1 : 0.92,
            duration: 0.5,
            overwrite: "auto",
          });
          gsap.to(p, {
            opacity: dom ? 1 : 0.38,
            filter: dom ? "grayscale(0)" : "grayscale(0.7)",
            duration: 0.5,
            overwrite: "auto",
          });
        });
        const it = items[idx];
        if (it) {
          if (metaLabelRef.current) metaLabelRef.current.textContent = it.label;
          if (metaTitleRef.current) metaTitleRef.current.textContent = it.title ?? "";
          if (metaDescRef.current) metaDescRef.current.textContent = it.description ?? "";
          if (metaYearRef.current) metaYearRef.current.textContent = [it.year, it.venue].filter(Boolean).join(" · ");
        }
      };

      const st = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: () => "+=" + Math.max(1800, items.length * 420 + 600),
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(items.length - 1, Math.floor(self.progress * items.length));
            if (counterRef.current) {
              const next = `${String(idx + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
              if (counterRef.current.textContent !== next) counterRef.current.textContent = next;
            }
            setActive(idx);
            // gentle fade of the entire journey as we approach the end — creates depth separation before the next section
            const fadeStart = 0.88;
            if (self.progress > fadeStart) {
              const t = (self.progress - fadeStart) / (1 - fadeStart);
              gsap.set(track, { autoAlpha: 1 - t * 0.85 });
              const metaEl = scope.querySelector<HTMLElement>(".archive-readout");
              if (metaEl) gsap.set(metaEl, { autoAlpha: 1 - t });
            } else {
              gsap.set(track, { autoAlpha: 1 });
              const metaEl = scope.querySelector<HTMLElement>(".archive-readout");
              if (metaEl) gsap.set(metaEl, { autoAlpha: 1 });
            }
          },
        },
      });

      st.fromTo(
        ".archive-track",
        { x: () => window.innerWidth * 0.12 },
        {
          x: () => -(track.scrollWidth - window.innerWidth),
          duration: 1,
          ease: "none",
          invalidateOnRefresh: true,
        },
        0,
      );

      // initial dominant frame
      setActive(0);
    },
    { dependencies: [items] },
  );

  /* graceful minimal fallback */
  if (!items.length) {
    return (
      <section className="relative px-6 py-28 sm:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mono-label text-accent">{eyebrow}</p>
          <h2 className="mt-4 font-sans text-4xl font-semibold tracking-tight text-ivory sm:text-5xl">{heading}</h2>
          <p className="mono-label mt-8 text-ivory-dim/50">ARCHIVE — COMING SOON</p>
        </div>
      </section>
    );
  }

  return (
    <div ref={ref}>
      <section className="relative px-6 pt-28 sm:px-10 sm:pt-36">
        <div className="mx-auto max-w-5xl">
          <p className="mono-label mb-6 text-accent">{eyebrow}</p>
          <h2 className="font-sans text-5xl font-semibold tracking-tight text-ivory sm:text-7xl">
            {heading}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-ivory/65">{subline}</p>
        </div>
      </section>

      {/* ---------- desktop horizontal journey ---------- */}
      <div className="archive-pin relative hidden md:block" style={{ height: `${Math.max(1800, items.length * 420 + 600)}px` }}>
        <div className="archive-sticky sticky top-0 z-10 flex h-screen flex-col justify-center overflow-hidden bg-origin-950">
          <div
            ref={trackRef}
            className="archive-track will-change-transform z-10 flex items-center gap-[6vw] pl-[10vw]"
          >
            {items.map((item) => (
              <figure key={item.id} className="archive-panel group relative w-[clamp(320px,34vw,460px)] max-w-[520px] shrink-0">
                <button
                  type="button"
                  onClick={() => setLightbox(item)}
                  aria-label={`View ${item.title ?? item.label}`}
                  className="archive-img-wrap relative block aspect-[4/3] max-h-[58vh] w-full cursor-pointer overflow-hidden border border-accent/20 bg-origin-900 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
                >
                  <Image
                    src={item.image}
                    alt={item.title ? `${item.label} — ${item.title}` : item.label}
                    fill
                    sizes="(min-width: 768px) 34vw, 85vw"
                    className="object-contain bg-origin-900 transition-transform duration-500 group-hover:scale-[1.02]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </button>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="mono-label text-graphite">{item.label}</span>
                  {item.year && <span className="font-mono text-[10px] tracking-[0.25em] text-ivory-dim/50">{item.year}</span>}
                </figcaption>
              </figure>
            ))}
            {/* trailing spacer so the final frame can centre */}
            <span aria-hidden className="w-[14vw] shrink-0" />
          </div>

          {/* readout — grouped with photo, dedicated layer above track */}
          <div className="archive-readout pointer-events-none absolute inset-x-0 bottom-14 z-[12]">
            <div className="mx-auto flex max-w-6xl items-end justify-between px-10">
              <div className="max-w-lg">
                <span ref={counterRef} className="archive-counter font-mono text-sm tracking-[0.3em] text-accent">
                  01 / {String(items.length).padStart(2, "0")}
                </span>
                <h3 ref={metaTitleRef} className="mt-3 min-h-[1.2em] font-sans text-2xl font-semibold tracking-tight text-ivory" />
                <p ref={metaDescRef} className="mt-1 min-h-[1.4em] max-w-md text-sm leading-6 text-ivory-dim/70" />
                <span ref={metaLabelRef} className="mono-label mt-2 block text-graphite" />
              </div>
              <span ref={metaYearRef} className="mono-label text-ivory-dim/50" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- mobile vertical progression ---------- */}
      <div className="relative z-10 mx-auto max-w-md px-6 pb-10 md:hidden">
        {items.map((item, i) => (
          <figure key={item.id} className="pb-12">
            <button
              type="button"
              onClick={() => setLightbox(item)}
              aria-label={`View ${item.title ?? item.label}`}
              className="img-frame group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden border border-accent/20 bg-origin-900"
            >
              <Image
                src={item.image}
                alt={item.title ? `${item.label} — ${item.title}` : item.label}
                fill
                sizes="85vw"
                className="object-cover"
              />
            </button>
            <figcaption className="mt-4 flex flex-col gap-1">
              <span className="mono-label text-accent">{item.label}</span>
              {item.title && (
                <span className="font-sans text-base font-semibold tracking-tight text-ivory">{item.title}</span>
              )}
              {item.description && (
                <p className="text-[13px] leading-6 text-ivory-dim/70">{item.description}</p>
              )}
              {(item.year || item.venue) && (
                <span className="mono-label text-ivory-dim/45">
                  {[item.year, item.venue].filter(Boolean).join(" · ")}
                </span>
              )}
              <span className="sr-only">
                {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* ---------- lightbox viewer ---------- */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title ?? lightbox.label}
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Close viewer"
            onClick={() => setLightbox(null)}
            autoFocus
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-ivory-dim/30 font-mono text-lg text-ivory transition-colors hover:border-accent hover:text-accent"
          >
            ✕
          </button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="img-frame relative mx-auto aspect-[4/3] w-full max-w-4xl overflow-hidden border border-accent/30">
              <Image
                src={lightbox.image}
                alt={lightbox.title ? `${lightbox.label} — ${lightbox.title}` : lightbox.label}
                fill
                sizes="(min-width: 1024px) 60vw, 92vw"
                className="object-contain"
                priority
              />
            </div>
            <figcaption className="mt-5 text-center">
              <p className="mono-label text-accent">{lightbox.label}</p>
              {lightbox.title && (
                <p className="mt-2 font-sans text-2xl font-semibold tracking-tight text-ivory">{lightbox.title}</p>
              )}
              {lightbox.description && (
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ivory-dim/75">{lightbox.description}</p>
              )}
              {(lightbox.year || lightbox.venue || lightbox.time) && (
                <p className="mono-label mt-3 text-ivory-dim/50">
                  {[lightbox.year, lightbox.venue, lightbox.time].filter(Boolean).join(" · ")}
                </p>
              )}
              {lightbox.registrationLink && (
                <a
                  href={lightbox.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-label mt-4 inline-block border border-accent/40 px-5 py-2.5 text-accent transition-colors hover:bg-accent hover:text-origin-950"
                >
                  REGISTER ↗
                </a>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
