import type { Leader } from "./types";

export const leadership: {
  vicePrincipal: { name: string; position: string; image: string | null; linkedin: string | null };
  hod: { name: string; position: string; image: string | null; linkedin: string | null };
  coordinators: Leader[];
} = {
  vicePrincipal: {
    name: "Dr.MAGESH BALAKRISHNAN",
    position: "Vice Principal",
    image: "/images/leadership/vp2.jpg",
    linkedin: "https://www.linkedin.com/in/dr-magesh-balakrishnan-793331128/",
  },
  hod: {
    name: "Ms.PRADEEPA.K",
    position: "Head of Department — CSE",
    image: "/images/leadership/hod1.jpeg",
    linkedin: null,
  },
  coordinators: [
    {
      name: "DHARMA PRAKASH V",
      position: "Faculty Coordinator — CSE",
      image: "/images/leadership/staff1.jpeg",
      linkedin: "https://www.linkedin.com/in/v-dharma-prakash-8aa55654/",
      club: "both",
    },
    {
      name: "SUGANYA S",
      position: "Faculty Coordinator — CSE",
      image: "/images/leadership/suganya-mam.jpg",
      linkedin: null,
      club: "both",
    },
  ],
};