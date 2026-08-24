"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { CodeFragment } from "@/components/shared/code";
import { SectionLabel } from "@/components/shared/typography";

type ActivityVisual =
  | "code"
  | "web"
  | "app"
  | "ai"
  | "git"
  | "timer"
  | "net"
  | "scan"
  | "timeline"
  | "cipher"
  | "rings"
  | "radar";

export type ActivityPanelData = {
  index: string;
  title: string;
  kicker: string;
  visual: ActivityVisual;
};

export const SS_PANELS: ActivityPanelData[] = [
  {
    index: "01",
    title: "PROGRAMMING",
    kicker: "// COMPETITIVE PROGRAMMING",
    visual: "code",
  },
  {
    index: "02",
    title: "WEB",
    kicker: "// WEB DEVELOPMENT",
    visual: "web",
  },
  {
    index: "03",
    title: "APP",
    kicker: "// APP DEVELOPMENT",
    visual: "app",
  },
  {
    index: "04",
    title: "AI",
    kicker: "// MACHINE LEARNING",
    visual: "ai",
  },
  {
    index: "05",
    title: "OPEN SOURCE",
    kicker: "// OPEN SOURCE",
    visual: "git",
  },
  {
    index: "06",
    title: "HACKATHONS",
    kicker: "// HACKATHONS",
    visual: "timer",
  },
];

function CodeVisual() {
  return (
    <CodeFragment
      title="forge/core.c"
      className="w-72 sm:w-80"
      lines={[
        [
          { text: "int ", tone: "accent" },
          { text: "solve", tone: "plain" },
          { text: "(void) {" },
        ],
        [{ text: "  int ans = 0;" }],
        [
          { text: "  while (", tone: "dim" },
          { text: "code", tone: "accent" },
          { text: ") {" },
        ],
        [
          { text: "    ans += ", tone: "plain" },
          { text: "logic", tone: "accent" },
          { text: "();" },
        ],
        [{ text: "  }" }],
        [{ text: "  return ans;" }],
        [{ text: "}" }],
      ]}
    />
  );
}

function WebVisual() {
  return (
    <div className="w-72 border border-accent/25 bg-forge-navy/40 sm:w-80">
      <div className="flex items-center gap-2 border-b border-accent/20 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-accent/70" />
        <span className="h-2 w-2 rounded-full bg-ivory-dim/40" />
        <span className="h-2 w-2 rounded-full bg-ivory-dim/20" />
        <span className="ml-3 flex-1 truncate border border-accent/20 px-2 py-0.5 font-mono text-[10px] text-ivory-dim">
          ss.dev/web
        </span>
      </div>
      <div className="flex flex-col gap-2.5 px-4 py-5">
        <div className="h-2 w-3/4 rounded bg-accent/50" />
        <div className="h-2 w-1/2 rounded bg-ivory-dim/30" />
        <div className="my-1 h-px w-full bg-ivory-dim/15" />
        <div className="h-2 w-2/3 rounded bg-ivory-dim/25" />
        <div className="h-2 w-5/6 rounded bg-ivory-dim/25" />
        <div className="h-2 w-2/5 rounded bg-ivory-dim/20" />
      </div>
    </div>
  );
}

function AppVisual() {
  return (
    <div className="w-40 rounded-[2rem] border border-accent/30 bg-forge-navy/40 p-2.5">
      <div className="rounded-[1.6rem] border border-accent/15 px-4 py-4">
        <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-ivory-dim/30" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-md ${
                i === 4 ? "bg-accent" : "bg-ivory-dim/25"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AiVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-72 sm:w-80">
      <g stroke="color-mix(in srgb, var(--accent) 35%, transparent)">
        <line x1="160" y1="80" x2="45" y2="35" />
        <line x1="160" y1="80" x2="275" y2="35" />
        <line x1="160" y1="80" x2="45" y2="125" />
        <line x1="160" y1="80" x2="275" y2="125" />
        <line x1="160" y1="80" x2="160" y2="20" />
      </g>
      <circle
        cx="45"
        cy="35"
        r="5"
        fill="color-mix(in srgb, var(--ivory) 40%, transparent)"
      />
      <circle
        cx="275"
        cy="35"
        r="5"
        fill="color-mix(in srgb, var(--ivory) 40%, transparent)"
      />
      <circle
        cx="45"
        cy="125"
        r="5"
        fill="color-mix(in srgb, var(--ivory) 40%, transparent)"
      />
      <circle
        cx="275"
        cy="125"
        r="5"
        fill="color-mix(in srgb, var(--ivory) 40%, transparent)"
      />
      <circle
        cx="160"
        cy="20"
        r="5"
        fill="color-mix(in srgb, var(--ivory) 40%, transparent)"
      />
      <circle cx="160" cy="80" r="7" fill="var(--accent)" />
    </svg>
  );
}

function GitVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-72 sm:w-80">
      <path
        d="M30 12 V148"
        stroke="color-mix(in srgb, var(--accent) 55%, transparent)"
        strokeWidth="2"
      />
      <path
        d="M30 95 C 95 95, 115 45, 155 45 H 290"
        fill="none"
        stroke="color-mix(in srgb, var(--ivory) 35%, transparent)"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <circle cx="30" cy="30" r="4" fill="var(--accent)" />
      <circle cx="30" cy="70" r="4" fill="var(--accent)" />
      <circle cx="30" cy="120" r="4" fill="var(--accent)" />
      <circle
        cx="155"
        cy="45"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 60%, transparent)"
      />
      <circle
        cx="210"
        cy="45"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 60%, transparent)"
      />
      <circle
        cx="265"
        cy="45"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 60%, transparent)"
      />
      <text
        x="40"
        y="26"
        fill="var(--accent)"
        fontSize="10"
        fontFamily="JetBrains Mono, monospace"
      >
        main
      </text>
      <text
        x="155"
        y="32"
        fill="color-mix(in srgb, var(--ivory) 60%, transparent)"
        fontSize="10"
        fontFamily="JetBrains Mono, monospace"
      >
        feature/x
      </text>
    </svg>
  );
}

function TimerVisual() {
  return (
    <div className="corner-ticks border border-accent/25 bg-forge-navy/40 px-10 py-7 text-center">
      <p className="mono-label text-accent">HACK-TIME</p>
      <p className="mt-3 font-mono text-4xl tracking-widest text-ivory sm:text-5xl">
        24<span className="animate-pulse text-accent">:</span>00
        <span className="animate-pulse text-accent">:</span>00
      </p>
    </div>
  );
}

function NetVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-72 sm:w-80">
      <g stroke="color-mix(in srgb, var(--accent) 30%, transparent)">
        <line x1="160" y1="80" x2="60" y2="30" />
        <line x1="160" y1="80" x2="260" y2="35" />
        <line x1="160" y1="80" x2="70" y2="130" />
        <line x1="160" y1="80" x2="250" y2="125" />
        <line x1="160" y1="80" x2="160" y2="20" />
        <line x1="60" y1="30" x2="160" y2="20" />
        <line x1="260" y1="35" x2="160" y2="20" />
      </g>
      <circle
        cx="60"
        cy="30"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 35%, transparent)"
      />
      <circle
        cx="260"
        cy="35"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 35%, transparent)"
      />
      <circle
        cx="70"
        cy="130"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 35%, transparent)"
      />
      <circle
        cx="250"
        cy="125"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 35%, transparent)"
      />
      <circle
        cx="160"
        cy="20"
        r="4"
        fill="color-mix(in srgb, var(--ivory) 35%, transparent)"
      />
      <circle cx="160" cy="80" r="7" fill="var(--accent)" />
    </svg>
  );
}

function ScanVisual() {
  return (
    <div className="w-72 border border-accent/25 bg-forge-navy/40 font-mono text-[11px] sm:w-80">
      <div className="flex items-center justify-between border-b border-accent/20 px-4 py-2">
        <span className="mono-label text-accent">PORT-SCAN</span>
        <span className="text-ivory-dim/50">{"// TCP"}</span>
      </div>
      <div className="flex flex-col gap-1.5 px-4 py-4 text-ivory/70">
        {["22/tcp open ssh", "80/tcp open http", "443/tcp open https", "8080/tcp filtered"].map(
          (line) => {
            const [port, state, proto] = line.split(" ");
            return (
              <p key={line} className="flex justify-between">
                <span className="text-ivory-dim/60">{port}</span>
                <span className="text-accent">{state}</span>
                <span>{proto}</span>
              </p>
            );
          },
        )}
      </div>
    </div>
  );
}

function TimelineVisual() {
  return (
    <svg viewBox="0 0 320 80" className="w-72 sm:w-80">
      <line
        x1="10"
        y1="48"
        x2="310"
        y2="48"
        stroke="color-mix(in srgb, var(--ivory) 25%, transparent)"
      />
      {["IDENTIFY", "PRESERVE", "COLLECT", "EXAMINE"].map((phase, i) => (
        <g key={phase}>
          <circle
            cx={30 + i * 90}
            cy="48"
            r="5"
            fill={
              i === 2
                ? "var(--accent)"
                : "color-mix(in srgb, var(--ivory) 30%, transparent)"
            }
          />
          <text
            x={30 + i * 90}
            y="36"
            textAnchor="middle"
            fill={
              i === 2
                ? "var(--accent)"
                : "color-mix(in srgb, var(--ivory) 55%, transparent)"
            }
            fontSize="9"
            fontFamily="JetBrains Mono, monospace"
          >
            {phase}
          </text>
        </g>
      ))}
    </svg>
  );
}

function CipherVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-72 sm:w-80">
      {Array.from({ length: 8 }, (_, r) =>
        Array.from({ length: 8 }, (_, c) => (
          <text
            key={`${r}-${c}`}
            x={44 + c * 30}
            y={24 + r * 18}
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
            fill={
              r === c
                ? "var(--accent)"
                : "color-mix(in srgb, var(--ivory) 40%, transparent)"
            }
          >
            {String.fromCharCode(65 + ((r * 7 + c * 3) % 26))}
          </text>
        )),
      )}
    </svg>
  );
}

function RingsVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-72 sm:w-80">
      {[72, 52, 34].map((r, i) => (
        <circle
          key={r}
          cx="160"
          cy="80"
          r={r}
          fill="none"
          stroke={
            i === 0
              ? "color-mix(in srgb, var(--accent) 55%, transparent)"
              : "color-mix(in srgb, var(--ivory) 25%, transparent)"
          }
          strokeWidth="1"
          strokeDasharray={i === 0 ? undefined : "2 3"}
        />
      ))}
      <circle cx="160" cy="80" r="6" fill="var(--accent)" />
    </svg>
  );
}

function RadarVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-72 sm:w-80">
      {[60, 40, 20].map((r, i) => (
        <circle
          key={r}
          cx="160"
          cy="80"
          r={r}
          fill="none"
          stroke={
            i === 0
              ? "color-mix(in srgb, var(--accent) 50%, transparent)"
              : "color-mix(in srgb, var(--ivory) 22%, transparent)"
          }
          strokeWidth="1"
        />
      ))}
      <line x1="160" y1="80" x2="160" y2="20" stroke="color-mix(in srgb, var(--ivory) 30%, transparent)" />
      <line x1="160" y1="80" x2="300" y2="80" stroke="color-mix(in srgb, var(--ivory) 30%, transparent)" />
      <line x1="160" y1="80" x2="240" y2="40" stroke="var(--accent)" strokeWidth="1" opacity="0.7" />
      <circle cx="205" cy="105" r="3" fill="var(--accent)" />
    </svg>
  );
}

function PanelVisual({ visual }: { visual: ActivityVisual }) {
  switch (visual) {
    case "code":
      return <CodeVisual />;
    case "web":
      return <WebVisual />;
    case "app":
      return <AppVisual />;
    case "ai":
      return <AiVisual />;
    case "git":
      return <GitVisual />;
    case "timer":
      return <TimerVisual />;
    case "net":
      return <NetVisual />;
    case "scan":
      return <ScanVisual />;
    case "timeline":
      return <TimelineVisual />;
    case "cipher":
      return <CipherVisual />;
    case "rings":
      return <RingsVisual />;
    case "radar":
      return <RadarVisual />;
  }
}

function ActivityPanel({
  index,
  title,
  kicker,
  visual,
  stacked,
}: ActivityPanelData & { stacked: boolean }) {
  return (
    <div
      className={`${
        stacked
          ? "flex min-h-screen w-full flex-col items-center justify-center gap-10 px-6 sm:px-10"
          : "flex h-full w-screen shrink-0 flex-col items-center justify-center gap-10 px-6 sm:px-10"
      }`}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="mono-label text-accent/70">[{index}]</span>
        <h3 className="type-display text-ivory">{title}</h3>
        <span className="mono-label text-ivory-dim/60">{kicker}</span>
      </div>
      <PanelVisual visual={visual} />
    </div>
  );
}

export function ActivitiesSection({
  panels = SS_PANELS,
}: {
  panels?: ActivityPanelData[];
}) {
  return <StripActivitiesSection panels={panels} />;
}

function StripActivitiesSection({ panels }: { panels: ActivityPanelData[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduce) return;
      const scope = ref.current;
      if (!scope) return;
      const row = scope.querySelector<HTMLElement>(".activities-row");
      const bar = scope.querySelector<HTMLElement>(".activities-progress-bar");
      const counter = scope.querySelector<HTMLElement>(".activities-counter");
      if (!row || !bar || !counter) return;

      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              panels.length - 1,
              Math.round(self.progress * (panels.length - 1)),
            );
            const next = `${panels[idx].index} / ${String(
              panels.length,
            ).padStart(2, "0")}`;
            if (counter.textContent !== next) counter.textContent = next;
          },
        },
      });

      tl.to(
        row,
        {
          x: () => -(row.scrollWidth - window.innerWidth),
          duration: 1,
        },
        0,
      ).to(bar, { scaleX: 1, duration: 1 }, 0);
    },
    { scope: ref, dependencies: [reduce] },
  );

  return (
    <section
      ref={ref}
      className="relative"
      style={reduce ? undefined : { height: "500vh" }}
    >
      <div
        className={
          reduce
            ? "flex flex-col"
            : "sticky top-0 flex h-screen flex-col overflow-hidden"
        }
      >
        <div className="flex items-center justify-between px-6 pt-8 sm:px-10">
          <SectionLabel>ACTIVITIES / WHAT WE DO</SectionLabel>
        </div>

        <div
          className={
            reduce
              ? "activities-row flex flex-col"
              : "activities-row flex min-h-0 flex-1"
          }
        >
          {panels.map((panel) => (
            <ActivityPanel key={panel.index} {...panel} stacked={reduce} />
          ))}
        </div>

        {!reduce && (
          <div className="pointer-events-none absolute inset-x-6 bottom-6 z-10 flex items-center justify-between sm:inset-x-10">
            <span className="activities-counter mono-label text-accent">
              01 / {String(panels.length).padStart(2, "0")}
            </span>
            <span className="mono-label text-ivory-dim/50">
              ↓ CONTINUE SCROLLING
            </span>
          </div>
        )}
        {!reduce && (
          <div className="pointer-events-none absolute inset-x-6 bottom-14 sm:inset-x-10">
            <div className="h-px w-full bg-ivory-dim/15">
              <div className="activities-progress-bar h-px w-full bg-accent" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}