import type { Metadata } from "next";
import { Display, SectionLabel } from "@/components/shared/typography";
import { GridPattern, NoiseField, GlowField } from "@/components/shared/textures";
import { OrganicRiver } from "@/components/gallery/organic-river";
import { getClubArchive, getSharedLegacy } from "@/data/archive";

export const metadata: Metadata = {
  title: "Gallery — CSE Clubs",
  description: "Event gallery — Script Soldiers and Cyber Knights",
};

export default function GalleryPage() {
  const ssItems = getClubArchive("script-soldiers");
  const ckItems = getClubArchive("cyber-knights");
  // OUR LEGACY should show only the 20 shared historical photographs, not the event posters (event1/event6)
  const legacyItems = getSharedLegacy().filter((e) => e.image.includes("/gallery/"));

  return (
    <main className="vignette relative flex min-h-screen flex-col bg-origin-950 text-ivory">
      <GridPattern className="opacity-40" />
      <NoiseField className="opacity-30" />
      <GlowField className="opacity-25" />

      <div className="relative z-10 flex flex-1 flex-col px-6 py-16 sm:px-12 sm:py-20">
        {/* header */}
        <div className="mx-auto w-full max-w-6xl text-center">
          <SectionLabel className="text-graphite">CSE — ARCHIVE</SectionLabel>
          <div className="mt-6 flex flex-col gap-1">
            <Display>GALLERY</Display>
            <p className="mono-label mt-4 text-argent/60">EVENTS // ARCHIVE</p>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-ivory/60">
            A living archive of Script Soldiers and Cyber Knights — flowing continuously, just as our journey does.
          </p>
        </div>

        {/* OUR LEGACY — shared history, first */}
        <section className="mx-auto mt-20 w-full max-w-6xl">
          <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-ivory-dim/15 pb-4">
            <div>
              <h2 className="font-sans text-2xl font-semibold tracking-tight text-ivory sm:text-3xl">
                OUR LEGACY
              </h2>
              <p className="mono-label mt-1 text-ivory-dim/50">SHARED HISTORY — BEFORE TWO PATHS EMERGED</p>
            </div>
            <span className="mono-label hidden text-graphite sm:block">
              {String(legacyItems.length).padStart(2, "0")} MOMENTS
            </span>
          </div>
          <div className="flex flex-col gap-8">
            <OrganicRiver items={legacyItems} duration={72} seed={7} />
            <OrganicRiver items={legacyItems} reverse duration={82} seed={19} />
          </div>
        </section>

        {/* Script Soldiers — frozen, image-only */}
        <section className="mx-auto mt-20 w-full max-w-6xl">
          <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-ivory-dim/15 pb-4">
            <h2 className="font-sans text-2xl font-semibold tracking-tight text-ivory sm:text-3xl">
              SCRIPT SOLDIERS
            </h2>
            <span className="mono-label hidden text-graphite sm:block">
              {String(ssItems.length).padStart(2, "0")} MOMENTS
            </span>
          </div>
          {ssItems.length ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {ssItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden border border-accent/15 bg-origin-900"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title ? `${item.label} — ${item.title}` : item.label}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mono-label py-12 text-center text-ivory-dim/40">ARCHIVE — COMING SOON</p>
          )}
        </section>

        {/* Cyber Knights — frozen, image-only */}
        <section className="mx-auto mt-20 w-full max-w-6xl">
          <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-ivory-dim/15 pb-4">
            <h2 className="font-sans text-2xl font-semibold tracking-tight text-ivory sm:text-3xl">
              CYBER KNIGHTS
            </h2>
            <span className="mono-label hidden text-graphite sm:block">
              {String(ckItems.length).padStart(2, "0")} MOMENTS
            </span>
          </div>
          {ckItems.length ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {ckItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden border border-accent/15 bg-origin-900"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title ? `${item.label} — ${item.title}` : item.label}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mono-label py-12 text-center text-ivory-dim/40">ARCHIVE — COMING SOON</p>
          )}
        </section>

        <p className="mx-auto mt-16 max-w-xl text-center text-xs leading-6 text-ivory-dim/40">
          Shared historical photographs are preserved here under Our Legacy. Club sections below show only their own moments.
        </p>
      </div>
    </main>
  );
}
