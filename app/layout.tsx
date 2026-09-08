import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/shared/smooth-scroll";
import { EntryLoader } from "@/components/shared/entry-loader";
import { PremiumCursor } from "@/components/shared/premium-cursor";
import { MagneticInteractions } from "@/components/shared/magnetic";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { ClubSwitcher } from "@/components/shared/club-switcher";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CSE CLUBS — PERI Institute of Technology",
    template: "%s — CSE CLUBS",
  },
  description:
    "Script Soldiers and Cyber Knights — the coding and cybersecurity clubs of the CSE department at PERI Institute of Technology.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  themeColor: "#07090d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col text-ivory">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-origin-900 focus:px-4 focus:py-2"
        >
          SKIP TO CONTENT
        </a>
        <SmoothScroll />
        {children}
        <ClubSwitcher />
        <EntryLoader />
        <PremiumCursor />
        <MagneticInteractions />
        <ScrollProgress />
      </body>
    </html>
  );
}