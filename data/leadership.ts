import type { Leader } from "./types";

export const leadership: {
  vicePrincipal: { name: string; position: string; image: string | null; linkedin: string | null };
  hod: { name: string; position: string; image: string | null; linkedin: string | null };
  coordinators: Leader[];
} = {
  vicePrincipal: {
    name: "Dr.MAGESH BALAKRISHNAN",
    position: "Vice Principal",
    image: "/images/leadership/vp.jpg",
    linkedin: "https://www.linkedin.com/in/dr-magesh-balakrishnan-793331128/",
  },
  hod: {
    name: "PRADEEPA.K",
    position: "Head of Department — CSE",
    image: "/images/leadership/hod1.jpeg",
    linkedin: null,
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