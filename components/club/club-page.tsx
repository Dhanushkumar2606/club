import type { Club } from "@/data/types";
import { ClubHero } from "@/components/club/club-hero";
import { MissionSection } from "@/components/club/mission";
import { VisionSection } from "@/components/club/vision";
import { MottoSection } from "@/components/club/motto";
import { ActivitiesSection, SS_PANELS } from "@/components/club/activities";
import { CapabilitiesSection } from "@/components/club/capabilities";
import { TeamSection } from "@/components/club/team";
import { FinaleSection } from "@/components/club/finale";
import { SectionLabel } from "@/components/shared/typography";
import {
  GridPattern,
  Scanlines,
  NoiseField,
  GlowField,
} from "@/components/shared/textures";
import { CodeFragment } from "@/components/shared/code";
import { DiagnosticsPanel } from "@/components/shared/diagnostics";
import { Reveal } from "@/components/shared/reveal";
import { ConnectionLine } from "@/components/shared/node";
import { SectionBridge } from "@/components/club/section-bridges";

export function ClubPage({ club }: { club: Club }) {
  const isForge = club.id === "script-soldiers";
  const missionWords = isForge
    ? ["BUILD", "CREATE", "INNOVATE", "LEAD"]
    : ["SCAN", "DETECT", "ANALYZE", "DEFEND"];
  const missionMotion = isForge ? "fluid" : "precise";
  const teamTitle = isForge ? "THE SOLDIERS" : "THE KNIGHTS";
  const teamSubtitle = isForge ? "ONE FORCE." : "ONE DEFENSE.";

  return (
    <main
      id="main"
      className="vignette relative flex flex-1 flex-col bg-page-bg text-ivory"
    >
      {isForge ? (
        <>
          <GridPattern className="opacity-50" />
          {/* PHASE 2.12 — SS technical depth grid (distinct from CK scanlines) */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0 118px, color-mix(in srgb, var(--accent) 35%, transparent) 118px 119px), repeating-linear-gradient(0deg, transparent 0 118px, color-mix(in srgb, var(--accent) 25%, transparent) 118px 119px)",
            }}
          />
        </>
      ) : (
        <Scanlines className="opacity-40" />
      )}
      <NoiseField className="opacity-30" />
      <GlowField className="opacity-40" />

      <div className="relative z-10 flex flex-1 flex-col">
        <ClubHero club={club} />
        <SectionBridge kind="stream" seed={11} />
<MissionSection club={club} words={missionWords} motion={missionMotion} />

        <VisionSection club={club} motion={missionMotion} />

        <SectionBridge kind="type" from="VISION" to={isForge ? "MOTTO" : "MOTTO"} />
        <MottoSection club={club} motion={missionMotion} />

        <SectionBridge kind="stream" seed={33} />
        {isForge ? (
          <ActivitiesSection panels={SS_PANELS} />
        ) : (
          <CapabilitiesSection domains={club.domains} />
        )}

        <SectionBridge kind="stream" seed={44} settle />
        <TeamSection
          club={club}
          title={teamTitle}
          subtitle={teamSubtitle}
          motion={missionMotion}
        />

        <div className="flex flex-col gap-14 px-6 pb-20 sm:px-10 sm:pb-24">
          <Reveal>
            <p className="max-w-xl text-sm leading-7 text-ivory/75">
              {club.description}
            </p>
          </Reveal>

          <ConnectionLine className="h-0.5 w-full" />

          <section className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <Reveal>
              <div className="flex flex-col gap-12">
                <section className="flex flex-col gap-4">
                  <SectionLabel>DOMAINS / SPECIALIZATIONS</SectionLabel>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {club.domains.map((domain) => (
                      <li
                        key={domain}
                        className="corner-ticks hover-lift border border-accent/25 bg-forge-navy/20 px-4 py-3 font-mono text-xs text-ivory/80 transition-colors hover:border-accent"
                      >
                        <span className="mr-2 text-accent">◆</span>
                        {domain.toUpperCase()}
                      </li>
                    ))}
                  </ul>
                </section>

                <footer className="mono-label text-ivory-dim/60">
                  MEMBERS: {club.members.length} — POSITIONS PENDING
                </footer>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              {isForge ? (
                <CodeFragment
                  title={`${club.code}.MODULES`}
                  className="w-72 sm:w-80"
                  lines={club.domains.map((domain) => [
                    {
                      text: `import { ${domain.replace(/\s+/g, "")} }`,
                      tone: "accent",
                    },
                    { text: ` from "forge/core";`, tone: "dim" },
                  ])}
                />
              ) : (
                <DiagnosticsPanel
                  title="DEFENSE PROTOCOLS"
                  rows={[
                    {
                      id: "01",
                      label: "Members",
                      value: String(club.members.length),
                      status: "OK",
                    },
                    {
                      id: "02",
                      label: "Domains",
                      value: String(club.domains.length),
                      status: "OK",
                    },
                    { id: "03", label: "Motto", value: club.motto, status: "OK" },
                    { id: "04", label: "Protocol", status: "ACTIVE" },
                  ]}
                />
              )}
            </Reveal>
          </section>
        </div>

        <FinaleSection />
      </div>
    </main>
  );
}