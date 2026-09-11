import { clubSchema, type Club } from "./types";

const placeholderMembers = Array.from({ length: 12 }, () => ({
  name: "To be added later",
  position: "To be added later",
  image: null,
  linkedin: null,
}));

export const scriptSoldiers: Club = clubSchema.parse({
  id: "script-soldiers",
  code: "SS",
  name: "Script Soldiers",
  identity: "CSE CLUBS // CODING CLUB",
  focus: "Programming, development and building with code.",
  description:
    "The Script Soldiers is the coding club of the CSE department at PERI Institute of Technology, bringing together students who build, ship and compete with code.",
  motto: "Code. Innovate. Excel.",
  tagline: "Core CSE Technical Club",
  mission:
    "To strengthen coding and problem-solving skills through training, workshops, and competitions. To prepare students for real-world technical challenges and career opportunities.",
  vision:
    "To nurture passionate programmers capable of building impactful digital solutions. To inspire innovation and excellence in the world of coding.",
  logo: "/logos/scriptsoldiers.png",
  domains: [
    "Web Development",
    "App Development",
    "Machine Learning",
    "Cloud Computing",
    "Competitive Programming",
    "UI/UX Design",
  ],
  members:[
    { name: "CHUKKA GAYATRI PREETHI", position: "PRESIDENT", image: "/images/team/script-soldiers/preethi.jpeg", linkedin: "https://www.linkedin.com/in/gayatri-preethi-chukka-788064329/" },
    { name: "GOKILA DEVI S.P", position: "VICE PRESIDENT", image: "/images/team/script-soldiers/gokila.jpeg", linkedin: "https://www.linkedin.com/in/gokila-devi-s-p-b72821383/" },
    { name: "DHANUSH KUMAR M", position: "SECRETARY", image: "/images/team/script-soldiers/dhanush26.jpg", linkedin: "https://www.linkedin.com/in/dhanush-kumar-08b052329/" },
    { name: "YUVA KRISHNA M", position: "SECRETARY", image: "/images/team/script-soldiers/yuva1.jpeg", linkedin: "https://www.linkedin.com/in/m-yuvakrishna-148952326/" },
    { name: "GOPIKA J", position: "SECRETARY", image: null, linkedin: null },
    { name: "SARAN ", position: "JOINT SECRETARY", image: null, linkedin: null },
    { name: "KARUNYA P", position: "JOINT SECRETARY", image: "/images/team/script-soldiers/karunya.jpg", linkedin: "https://www.linkedin.com/in/karunya-palanivel-199a04383/"},
    { name: "INDHU S", position: "TREASURER", image: "/images/team/script-soldiers/indhu.jpeg", linkedin: "https://www.linkedin.com/in/indhu-saravanan-1b057038b/" },
    { name: "SANJEEVAN U.S", position: "STUDENT SECRETARY", image: "/images/team/script-soldiers/sanjeevan.jpg", linkedin: "https://www.linkedin.com/in/sanjeevan-u-s-4362423b5/" },
    { name: "ADHITHYA", position: "STUDENT SECRETARY", image: "/images/team/script-soldiers/adhi1.jpg", linkedin: "https://www.linkedin.com/in/adhithya-rajadurai-54507a331/" },
    { name: "THIRUMA K.R", position: "STUDENT SECRETARY", image: "/images/team/script-soldiers/thiruma.jpeg", linkedin: "https://www.linkedin.com/in/thiruma-ravi-9bb183383/" },
    { name: "ASHMITHA A", position: "STUDENT SECRETARY", image: "/images/team/script-soldiers/ashmitha.jpeg", linkedin: "https://www.linkedin.com/in/ashmitha-a-1247bb391/" },
    { name: "VISHVA MALAR K", position: "STUDENT SECRETARY", image: "/images/team/script-soldiers/malar.jpeg", linkedin: "https://www.linkedin.com/in/vishva-malar-b31189383/" },
    { name: "MUKITHA", position: "CO-COMMITTEE MEMBER", image: "/images/team/script-soldiers/mukitha.jpeg", linkedin: "https://www.linkedin.com/in/mukitha-k-48b359335/" },
  ],
});