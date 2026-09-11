import type { Leader } from "./types";

export const leadership: {
  vicePrincipal: { name: string; position: string; image: string | null };
  hod: { name: string; position: string; image: string | null };
  coordinators: Leader[];
} = {
  vicePrincipal: {
    name: "To be added later",
    position: "Vice Principal",
    image: null,
  },
  hod: {
    name: "PRADEEPA.K",
    position: "Head of Department — CSE",
    image: "/images/leadership/hod1.jpeg",
  },
  coordinators: [
    {
      name: "To be added later",
      position: "Faculty Coordinator — CSE",
      image: null,
      linkedin: null,
      club: "both",
    },
    {
      name: "To be added later",
      position: "Faculty Coordinator — CSE",
      image: null,
      linkedin: null,
      club: "both",
    },
    {
      name: "To be added later",
      position: "Faculty Coordinator — CSE",
      image: null,
      linkedin: null,
      club: "both",
    },
  ],
};