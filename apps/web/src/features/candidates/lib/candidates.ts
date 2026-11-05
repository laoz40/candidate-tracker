import type { requestCandidateSummary } from "@/features/candidates/lib/candidates-api";

export const stages = ["Applied", "Screening", "Interview", "Offer", "Rejected"] as const;

export type Stage = (typeof stages)[number];

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  date: string;
  stage: Stage;
  source: string | null;
  resume: string;
  summary: Awaited<ReturnType<typeof requestCandidateSummary>> | null;
  notes: { id: string; date: string; text: string }[];
};

export const sampleCandidates: Candidate[] = [
  {
    id: "1",
    name: "Olivia Chen",
    email: "olivia.chen@example.com",
    phone: "+61 412 345 678",
    role: "Frontend Engineer",
    date: "2026-11-05",
    stage: "Applied",
    source: "LinkedIn",
    resume:
      "Frontend engineer with two years of experience building accessible web applications with React and TypeScript.\n\nAt North Studio, built a reusable component library and worked with designers to improve the onboarding experience. Previously completed a software engineering internship focused on automated testing.\n\nBachelor of Computer Science, University of Sydney.\n\nSkills: React, TypeScript, HTML, CSS, accessibility, Playwright, Git.",
    summary: null,
    notes: [
      {
        id: "1",
        date: "2026-11-05T09:30:00",
        text: "Portfolio includes a thoughtful accessibility case study. Review alongside the frontend role requirements.",
      },
    ],
  },
  {
    id: "2",
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: null,
    role: "Full Stack Engineer",
    date: "2026-11-04",
    stage: "Screening",
    source: "Referral",
    resume:
      "Software engineer with experience building React interfaces and Node.js APIs. Worked on an internal scheduling application backed by PostgreSQL.\n\nSkills: JavaScript, React, Node.js, PostgreSQL, Docker.",
    summary: null,
    notes: [],
  },
  {
    id: "3",
    name: "Amara Okafor",
    email: "amara.okafor@example.com",
    phone: "+61 423 456 789",
    role: "Product Designer",
    date: "2026-11-04",
    stage: "Interview",
    source: "Company website",
    resume:
      "Product designer focused on clear, accessible workflows. Two years of experience in user research, prototyping and design systems.\n\nSkills: Figma, interaction design, usability testing, accessibility.",
    summary: null,
    notes: [
      {
        id: "2",
        date: "2026-11-04T14:00:00",
        text: "Prepare questions about the research process behind the booking project.",
      },
    ],
  },
  {
    id: "4",
    name: "Noah Patel",
    email: "noah.patel@example.com",
    phone: null,
    role: "Frontend Engineer",
    date: "2026-11-03",
    stage: "Offer",
    source: "Referral",
    resume:
      "Frontend developer with experience in React and TypeScript. Built responsive interfaces and collaborated with backend engineers on API integration.\n\nSkills: React, TypeScript, CSS, Vitest.",
    summary: null,
    notes: [],
  },
  {
    id: "5",
    name: "Sophie Taylor",
    email: "sophie.taylor@example.com",
    phone: null,
    role: "Full Stack Engineer",
    date: "2026-11-02",
    stage: "Applied",
    source: "LinkedIn",
    resume:
      "Recent software engineering graduate. Built a community events application using React, Node.js and PostgreSQL.\n\nSkills: TypeScript, SQL, REST APIs, Git.",
    summary: null,
    notes: [],
  },
  {
    id: "6",
    name: "Ethan Kim",
    email: "ethan.kim@example.com",
    phone: null,
    role: "Product Designer",
    date: "2026-11-01",
    stage: "Screening",
    source: null,
    resume:
      "Designer with a background in visual communication and a year of digital product experience. Created prototypes and conducted moderated usability sessions.\n\nSkills: Figma, prototyping, user research.",
    summary: null,
    notes: [],
  },
  {
    id: "7",
    name: "Isabella Rossi",
    email: "isabella.rossi@example.com",
    phone: null,
    role: "Frontend Engineer",
    date: "2026-10-30",
    stage: "Interview",
    source: "Company website",
    resume:
      "Web developer building responsive interfaces for small businesses. Experience with React, semantic HTML and performance optimisation.\n\nSkills: JavaScript, React, CSS, web performance.",
    summary: null,
    notes: [],
  },
  {
    id: "8",
    name: "Lucas Martin",
    email: "lucas.martin@example.com",
    phone: null,
    role: "Full Stack Engineer",
    date: "2026-10-29",
    stage: "Rejected",
    source: "LinkedIn",
    resume:
      "Junior developer with experience in Python and JavaScript. Built REST APIs and contributed to an open-source documentation project.\n\nSkills: Python, JavaScript, SQL, Git.",
    summary: null,
    notes: [],
  },
];

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("");
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
