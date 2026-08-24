/*
 * CLUB HISTORY & ARCHIVE — single source of truth.
 *
 * Classification rules (do not rewrite history):
 *   archiveType: "shared-legacy" → department / joint activities (club: null)
 *   archiveType: "club"          → belongs exclusively to one current club
 *
 * Event metadata sourced verbatim from the legacy cseclubs records.
 * Gallery photographs carry no historical metadata — neutral labels only.
 */

export type ArchiveType = "shared-legacy" | "club";
export type ArchiveClub = null | "script-soldiers" | "cyber-knights";

export interface ArchiveEntry {
  id: string;
  image: string;
  /** Neutral identifier when no verified title exists */
  label: string;
  title?: string;
  description?: string;
  year?: string;
  venue?: string;
  time?: string;
  archiveType: ArchiveType;
  club: ArchiveClub;
  registrationLink?: string;
}

const GALLERY = "/images/gallery";
const EVENTS = "/images/archive/events";

/* ---- shared historical photograph set (unclassified provenance) ---- */
const galleryShared: ArchiveEntry[] = Array.from({ length: 20 }, (_, i) => {
  const row = i < 10 ? 1 : 2;
  const n = (i % 10) + 1;
  const num = String(i + 1).padStart(2, "0");
  return {
    id: `shared-${num}`,
    image: `${GALLERY}/row${row}-photo${n}.jpg`,
    label: `SHARED LEGACY / ${num}`,
    archiveType: "shared-legacy" as const,
    club: null,
  };
});

/* ---- real events from the department's records ---- */
const eventsArchive: ArchiveEntry[] = [
  {
    id: "event-tech-rhythm",
    image: `${EVENTS}/event1.jpg`,
    label: "SHARED LEGACY / TECH RHYTHM",
    title: "TECH RHYTHM",
    description:
      "An intense 6-hour coding marathon where teams competed to solve real-world problems using innovative algorithms and data structures.",
    year: "2026",
    venue: "Beta Conference Hall",
    time: "9:30 AM – 3:30 PM",
    archiveType: "shared-legacy",
    club: null,
  },
  {
    id: "event-cyber-vertex",
    image: `${EVENTS}/event2.jpg`,
    label: "CYBER KNIGHTS ARCHIVE / CYBER VERTEX",
    title: "CYBER VERTEX",
    description: "Cyber VerteX — where security meets innovation.",
    year: "2025",
    venue: "Beta Conference Hall",
    time: "1:00 PM – 3:30 PM",
    archiveType: "club",
    club: "cyber-knights",
  },
  {
    id: "event-code-voyage",
    image: `${EVENTS}/event3.jpg`,
    label: "SCRIPT SOLDIERS ARCHIVE / CODE VOYAGE",
    title: "CODE VOYAGE",
    description:
      "More than just a coding event — a journey where young innovators set sail into the vast ocean of logic, problem solving and creativity.",
    year: "2025",
    venue: "Delta Conference Hall",
    time: "12:45 PM – 3:30 PM",
    archiveType: "club",
    club: "script-soldiers",
  },
  {
    id: "event-cyber-nexus",
    image: `${EVENTS}/event4.jpg`,
    label: "CYBER KNIGHTS ARCHIVE / CYBER NEXUS",
    title: "CYBER NEXUS",
    description: "Join the cipher run — fun, games and challenges.",
    year: "2025",
    venue: "Beta Conference Hall",
    time: "1:00 PM – 4:00 PM",
    archiveType: "club",
    club: "cyber-knights",
  },
  {
    id: "event-brains-bytes",
    image: `${EVENTS}/event5.jpg`,
    label: "SCRIPT SOLDIERS ARCHIVE / BRAINS & BYTES",
    title: "BRAINS & BYTES",
    description: "Seminar on AI and Machine Learning.",
    year: "2025",
    venue: "Beta Conference Hall",
    time: "1:00 PM – 4:00 PM",
    archiveType: "club",
    club: "script-soldiers",
  },
  {
    id: "event-glitchyugam-26",
    image: `${EVENTS}/event6.jpg`,
    label: "SHARED LEGACY / GLITCHYUGAM'26",
    title: "GLITCHYUGAM'26",
    description:
      "Annual technical festival featuring coding contests, cybersecurity challenges, project exhibitions and guest lectures from industry leaders.",
    year: "2026",
    venue: "Zeta & Beta Conference Halls",
    time: "9:00 AM – 5:00 PM",
    archiveType: "shared-legacy",
    club: null,
    registrationLink:
      "https://docs.google.com/forms/d/e/1FAIpQLSfzvU7pPBYC1QopicbreUlLtqCmBY1e5lcKNkwGJRihhMAH0Q/viewform",
  },
];

export const archiveEntries: ArchiveEntry[] = [...galleryShared, ...eventsArchive];

/** Department-level history — joint activities and shared origins. */
export function getSharedLegacy(): ArchiveEntry[] {
  return archiveEntries.filter((e) => e.archiveType === "shared-legacy");
}

/** Club-exclusive history. Returns [] until club-specific entries exist. */
export function getClubArchive(club: Exclude<ArchiveClub, null>): ArchiveEntry[] {
  return archiveEntries.filter((e) => e.archiveType === "club" && e.club === club);
}
