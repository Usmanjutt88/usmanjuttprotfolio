export type Skill = { id: string; name: string; icon: string };
export type SkillGroup = { id: string; title: string; items: Skill[] };
export type Edu = { id: string; degree: string; school: string; meta: string };
export type Exp = { id: string; title: string; org: string; dates: string; description: string };
export type Cert = { id: string; title: string; issuer: string };
export type Service = { id: string; title: string; description: string; icon: string };
export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string;
  category: "Web" | "Programming" | "AI";
  demo: string;
  github: string;
};
export type Video = { id: string; title: string; description: string; url: string };

export type SiteContent = {
  hero: { greeting: string; name: string; roles: string; intro: string; avatar: string };
  about: { title: string; bio: string; photo: string; stats: { id: string; value: string; label: string }[] };
  links: {
    github: string;
    linkedin: string;
    whatsapp: string;
    email: string;
    cv: string;
    hire: string;
    talk: string;
  };
  skills: SkillGroup[];
  education: Edu[];
  experience: Exp[];
  certifications: Cert[];
  services: Service[];
  projects: Project[];
  videos: Video[];
  contact: { phone: string; email: string; location: string };
  footer: { tagline: string };
};

export const uid = () => Math.random().toString(36).slice(2, 10);

const sk = (name: string, icon = "Code2"): Skill => ({ id: uid(), name, icon });

export const defaultContent: SiteContent = {
  hero: {
    greeting: "Hi, I'm",
    name: "Muhammad Usman",
    roles: "Web Developer, BS CS Student, Problem Solver, AI Enthusiast",
    intro:
      "Motivated BS Computer Science student with a strong foundation in web development, programming, and problem-solving.",
    avatar: "",
  },
  about: {
    title: "Building real-world software, one line at a time.",
    bio: "I'm a 7th semester BS Computer Science student at the University of Education, Vehari, with a CGPA of 3.51. I'm skilled in HTML, CSS, JavaScript, PHP, C and C++, and passionate about building real-world software solutions that are fast, clean and genuinely useful.",
    photo: "",
    stats: [
      { id: "s1", value: "3.51", label: "CGPA" },
      { id: "s2", value: "7th", label: "Semester" },
      { id: "s3", value: "10+", label: "Skills" },
      { id: "s4", value: "3+", label: "Certifications" },
    ],
  },
  links: {
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    whatsapp: "https://wa.me/923110003348",
    email: "mailto:uj6595890@gmail.com",
    cv: "",
    hire: "https://wa.me/923110003348",
    talk: "https://wa.me/923110003348",
  },
  skills: [
    {
      id: "g1",
      title: "Programming",
      items: [
        sk("C", "Terminal"),
        sk("C++", "Terminal"),
        sk("HTML5", "FileCode"),
        sk("CSS3", "Palette"),
        sk("JavaScript", "Braces"),
        sk("PHP", "Server"),
        sk("OOP", "Boxes"),
        sk("Data Structures", "Network"),
      ],
    },
    {
      id: "g2",
      title: "Computer",
      items: [
        sk("AI Tools (ChatGPT, Gemini, DeepSeek, Kimi)", "Sparkles"),
        sk("MS Office", "FileText"),
        sk("Networking Basics", "Wifi"),
        sk("Database Management", "Database"),
        sk("Problem-solving & Debugging", "Bug"),
      ],
    },
    {
      id: "g3",
      title: "Languages",
      items: [sk("English (Intermediate)", "Languages"), sk("Urdu (Native)", "Languages")],
    },
  ],
  education: [
    { id: uid(), degree: "BS Computer Science", school: "University of Education, Vehari", meta: "7th Semester | CGPA: 3.51" },
    { id: uid(), degree: "Intermediate", school: "Your college name", meta: "Year | Marks" },
    { id: uid(), degree: "Matriculation", school: "Your school name", meta: "Year | Marks" },
  ],
  experience: [
    {
      id: uid(),
      title: "Your role",
      org: "University of Education Jinnah Hostel, Lahore",
      dates: "2024 — Present",
      description: "Describe your responsibilities and achievements here.",
    },
  ],
  certifications: [
    { id: uid(), title: "AI Agent Course", issuer: "Bano Qabil" },
    { id: uid(), title: "Digital Marketing", issuer: "Certification" },
    { id: uid(), title: "Information Technology (Computer Operator)", issuer: "Certification" },
  ],
  services: [
    { id: uid(), title: "Web Development", description: "Fast, responsive websites built with modern tools.", icon: "Globe" },
    { id: uid(), title: "Frontend Design", description: "Clean, pixel-perfect interfaces people enjoy using.", icon: "Palette" },
    { id: uid(), title: "Database Management", description: "Structured, reliable data storage and queries.", icon: "Database" },
    { id: uid(), title: "AI Tools Integration", description: "Bringing ChatGPT, Gemini and more into your workflow.", icon: "Sparkles" },
  ],
  projects: [
    {
      id: uid(),
      title: "Portfolio Website",
      description: "A premium personal portfolio with a live admin panel and cloud sync.",
      image: "",
      tags: "React, Tailwind, Cloud",
      category: "Web",
      demo: "",
      github: "",
    },
    {
      id: uid(),
      title: "Student Management System",
      description: "C++ console app for managing student records using OOP and file handling.",
      image: "",
      tags: "C++, OOP",
      category: "Programming",
      demo: "",
      github: "",
    },
    {
      id: uid(),
      title: "AI Study Assistant",
      description: "A helper that summarizes notes and generates quizzes using AI tools.",
      image: "",
      tags: "JavaScript, AI",
      category: "AI",
      demo: "",
      github: "",
    },
  ],
  videos: [],
  contact: { phone: "0311-0003348", email: "uj6595890@gmail.com", location: "Vehari, Punjab, Pakistan" },
  footer: { tagline: "Web Developer & BS Computer Science student crafting clean digital experiences." },
};

export function convertDriveImageLink(url: string) {
  if (!url) return url;
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}` : url;
}

export function convertDriveVideoLink(url: string) {
  if (!url) return url;
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}

export const isValidLink = (u: string) => u === "" || /^(https:\/\/|mailto:)/.test(u.trim());

/** Deep-merge saved content on top of defaults so new fields always exist. */
export function mergeContent(saved: unknown): SiteContent {
  if (!saved || typeof saved !== "object") return defaultContent;
  const s = saved as Partial<SiteContent>;
  return {
    ...defaultContent,
    ...s,
    hero: { ...defaultContent.hero, ...s.hero },
    about: { ...defaultContent.about, ...s.about },
    links: { ...defaultContent.links, ...s.links },
    contact: { ...defaultContent.contact, ...s.contact },
    footer: { ...defaultContent.footer, ...s.footer },
  };
}
