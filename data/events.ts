import { eventSchema, type ClubEvent } from "./types";

const placeholder = {
  date: null,
  venue: null,
  description: null,
  image: null,
  registrationUrl: null,
};

export const events: ClubEvent[] = [
  eventSchema.parse({
    id: "hackathon-2026",
    title: "HACKATHON",
    club: "script-soldiers",
    year: "2026",
    status: "upcoming",
    ...placeholder,
  }),
  eventSchema.parse({
    id: "workshop-2026",
    title: "WORKSHOP",
    club: "script-soldiers",
    year: "2026",
    status: "upcoming",
    ...placeholder,
  }),
  eventSchema.parse({
    id: "coding-challenge-2026",
    title: "CODING CHALLENGE",
    club: "script-soldiers",
    year: "2026",
    status: "upcoming",
    ...placeholder,
  }),
  eventSchema.parse({
    id: "ck-event-01",
    title: "TO BE ADDED",
    club: "cyber-knights",
    year: "2026",
    status: "upcoming",
    ...placeholder,
  }),
  eventSchema.parse({
    id: "ck-event-02",
    title: "TO BE ADDED",
    club: "cyber-knights",
    year: "2026",
    status: "upcoming",
    ...placeholder,
  }),
  eventSchema.parse({
    id: "ck-event-03",
    title: "TO BE ADDED",
    club: "cyber-knights",
    year: "2026",
    status: "upcoming",
    ...placeholder,
  }),
];