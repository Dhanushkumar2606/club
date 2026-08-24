"use client";

import type { CSSProperties, ReactNode } from "react";
import type { ClubId } from "@/data/types";

const clubThemes: Record<
  ClubId,
  {
    accent: string;
    accentBright: string;
    accentDim: string;
    energy: string;
    structure: string;
    pageBg: string;
  }
> = {
  "script-soldiers": {
    accent: "#c79a3b",
    accentBright: "#e4be68",
    accentDim: "#8a6f2f",
    energy: "#8e1830",
    structure: "#101923",
    pageBg: "#080a0f",
  },
  "cyber-knights": {
    accent: "#00d9e8",
    accentBright: "#36f3ff",
    accentDim: "#0a8f9c",
    energy: "#36f3ff",
    structure: "#9aa7b5",
    pageBg: "#030810",
  },
};

export function getClubTheme(clubId: ClubId) {
  return clubThemes[clubId];
}

export function ClubThemeProvider({
  clubId,
  children,
}: {
  clubId: ClubId;
  children: ReactNode;
}) {
  const t = clubThemes[clubId];
  return (
    <div
      style={
        {
          "--accent": t.accent,
          "--accent-bright": t.accentBright,
          "--accent-dim": t.accentDim,
          "--energy": t.energy,
          "--structure": t.structure,
          "--page-bg": t.pageBg,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}