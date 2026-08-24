import type { Metadata } from "next";
import { scriptSoldiers } from "@/data/scriptSoldiers";
import { ClubPage } from "@/components/club/club-page";
import { ClubThemeProvider } from "@/components/shared/club-theme";

export const metadata: Metadata = {
  title: scriptSoldiers.name,
  description: scriptSoldiers.description,
};

export default function ScriptSoldiersPage() {
  return (
    <ClubThemeProvider clubId="script-soldiers">
      <ClubPage club={scriptSoldiers} />
    </ClubThemeProvider>
  );
}