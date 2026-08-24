import type { Metadata } from "next";
import { cyberKnights } from "@/data/cyberKnights";
import { ClubPage } from "@/components/club/club-page";
import { ClubThemeProvider } from "@/components/shared/club-theme";

export const metadata: Metadata = {
  title: cyberKnights.name,
  description: cyberKnights.description,
};

export default function CyberKnightsPage() {
  return (
    <ClubThemeProvider clubId="cyber-knights">
      <ClubPage club={cyberKnights} />
    </ClubThemeProvider>
  );
}