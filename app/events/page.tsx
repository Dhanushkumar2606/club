import Link from "next/link";
import type { Metadata } from "next";
import { Display, SectionLabel } from "@/components/shared/typography";
import { GridPattern, NoiseField, GlowField } from "@/components/shared/textures";
import { events } from "@/data/events";

export const metadata: Metadata = {
  title: "Events — CSE Clubs",
  description: "Upcoming events and registrations — Script Soldiers and Cyber Knights",
};

function EventCard({ event }: { event: (typeof events)[number] }) {
  const isUpcoming = event.status === "upcoming";
  return (
    <div className="corner-ticks group flex flex-col gap-4 border border-ivory-dim/15 bg-origin-900/50 p-6 text-left sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="mono-label text-accent">{event.club.toUpperCase()} · {event.year ?? ""}</span>
        <span className={`mono-label rounded-full border px-3 py-1 text-[10px] ${isUpcoming ? "border-accent/40 text-accent" : "border-ivory-dim/20 text-ivory-dim/50"}`}>
          {isUpcoming ? "UPCOMING" : event.status.toUpperCase()}
        </span>
      </div>
      <h3 className="font-sans text-xl font-semibold tracking-tight text-ivory transition-colors group-hover:text-accent sm:text-2xl">
        {event.title}
      </h3>
      {(event.date || event.venue) && (
        <p className="mono-label text-ivory-dim/60">
          {[event.date, event.venue].filter(Boolean).join(" · ")}
        </p>
      )}
      {event.description && (
        <p className="text-sm leading-6 text-ivory/60">{event.description}</p>
      )}
      <div className="mt-2">
        {isUpcoming && event.registrationUrl ? (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mono-label inline-block border border-accent/40 bg-accent px-5 py-2.5 text-origin-950 transition-colors hover:bg-accent-bright"
          >
            REGISTER ↗
          </a>
        ) : isUpcoming ? (
          <span className="mono-label inline-block border border-ivory-dim/15 px-5 py-2.5 text-ivory-dim/40">
            REGISTRATIONS YET TO OPEN
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status !== "upcoming");

  return (
    <main className="vignette relative flex min-h-screen flex-col bg-origin-950 text-ivory">
      <GridPattern className="opacity-40" />
      <NoiseField className="opacity-30" />
      <GlowField className="opacity-25" />

      <div className="relative z-10 flex flex-1 flex-col px-6 py-16 sm:px-12 sm:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <SectionLabel className="text-graphite">CSE — EVENTS</SectionLabel>
          <div className="mt-6 flex flex-col gap-1">
            <Display>EVENTS</Display>
            <p className="mono-label mt-4 text-argent/60">UPCOMING // REGISTRATIONS</p>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-7 text-ivory/60">
            Stay updated with our latest events and secure your spot.
          </p>
        </div>

        {/* Upcoming — hero */}
        <div className="mx-auto mt-16 w-full max-w-6xl">
          <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-ivory-dim/15 pb-4">
            <h2 className="font-sans text-xl font-semibold tracking-tight text-ivory sm:text-2xl">UPCOMING</h2>
            <span className="mono-label hidden text-graphite sm:block">{String(upcoming.length).padStart(2, "0")} EVENTS</span>
          </div>
          {upcoming.length ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="mono-label py-16 text-center text-ivory-dim/40">NO UPCOMING EVENTS — CHECK BACK SOON</p>
          )}
        </div>

        {/* Past — collapsed link to gallery */}
        <div className="mx-auto mt-16 w-full max-w-6xl border-t border-ivory-dim/10 pt-10 text-center">
          <p className="mono-label text-graphite">PAST EVENTS</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ivory-dim/50">
            Previous events and photographs are preserved in the gallery.
          </p>
          <Link href="/gallery" className="mono-label mt-4 inline-block border border-ivory-dim/15 px-5 py-2.5 text-ivory-dim/70 transition-colors hover:border-accent hover:text-accent">
            VIEW GALLERY →
          </Link>
          <p className="mono-label mt-3 text-[10px] text-ivory-dim/30">{String(past.length).padStart(2, "0")} PAST EVENTS ARCHIVED</p>
        </div>
      </div>
    </main>
  );
}
