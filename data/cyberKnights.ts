import { clubSchema, type Club } from "./types";

const placeholderMember = {
  name: "To be added later",
  position: "To be added later",
  image: null,
  linkedin: null,
};

export const cyberKnights: Club = clubSchema.parse({
  id: "cyber-knights",
  code: "CK",
  name: "Cyber Knights",
  identity: "CSE CLUBS // CYBERSECURITY CLUB",
  focus: "Cybersecurity, ethical hacking and defence.",
  description:
    "The Cyber Knights is the cybersecurity club of the CSE department at PERI Institute of Technology, training students to secure systems, think like attackers and defend like engineers.",
  motto: "Protect. Secure. Lead.",
  mission:
    "To equip students with practical cybersecurity knowledge and hands-on learning experiences. To encourage innovation in defending modern digital systems.",
  vision:
    "To develop skilled cyber enthusiasts who can protect and secure the digital world. To build a strong culture of cybersecurity awareness and ethical practice.",
  logo: "/logos/cyberknights.png",
  domains: [
    "Ethical Hacking",
    "Penetration Testing",
    "Network Security",
    "Digital Forensics",
    "Cybersecurity Awareness",
    "Cryptography",
    "Incident Response",
    "VAPT",
  ],
  members: [
    { name: "HAKESH.S", position: "PRESIDENT", image: null, linkedin: "https://www.linkedin.com/in/hakesh-s/" },
    { name: "SUJEETH G.V", position: "VICE PRESIDENT", image: null, linkedin: "https://www.linkedin.com/in/g-v-sujeeth-0b0973353/" },
    { name: "NAVYA MJ", position: "SECRETARY", image: "/images/team/cyber-knights/navya.jpeg", linkedin: "https://www.linkedin.com/in/navya-mj/" },
    { name: "DHARANI SRI", position: "SECRETARY", image: "/images/team/cyber-knights/dhranisri.jpeg", linkedin: "https://www.linkedin.com/in/dharanisri-saravanan-682a7132b/" },
    { name: "ABHUL RAHIMAN", position: "SECRETARY", image: null, linkedin: "https://www.linkedin.com/in/abdul-rahiman-b83a1a32b/" },
    { name: "YOGESH", position: "JOINT SECRETARY", image: "/images/team/cyber-knights/yogesh.jpeg", linkedin: null },
    { name: "VARSHINI", position: "JOINT SECRETARY", image: null, linkedin: null },
    { name: "RITHEESH", position: "TREASURER", image: "/images/team/cyber-knights/ritheesh.jpeg", linkedin: "https://www.linkedin.com/in/ritheesh-mg-038982347/" },
    { name: "ARSHAN AS", position: "JOINT TREASURER", image: null, linkedin: "https://www.linkedin.com/in/arshan-as-b1248a3a3/" },
    { name: "RUBA SRI B", position: "STUDENT SECRETARY", image: "/images/team/cyber-knights/rubasri.jpeg", linkedin: "https://www.linkedin.com/in/ruba-sri-b-/" },
    { name: "SASI", position: "STUDENT SECRETARY", image: null, linkedin: null },
    { name: "TEJASWINI", position: "STUDENT SECRETARY", image: null, linkedin: "https://www.linkedin.com/in/tejaswini-durai-rajan-ba5100384/" },
  ],
});