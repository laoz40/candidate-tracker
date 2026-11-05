import { activeRoles, type emptyCandidateForm } from "@/features/candidates/lib/candidate-form";

function pickRandom<Value>(values: readonly [Value, ...Value[]]): Value {
  return values[Math.floor(Math.random() * values.length)] ?? values[0];
}

export function randomCandidateForm(): typeof emptyCandidateForm {
  const firstName = pickRandom(["Alex", "Jordan", "Sam", "Taylor", "Morgan", "Casey"]);
  const lastName = pickRandom(["Chen", "Patel", "Nguyen", "Smith", "Wilson", "Garcia"]);

  return {
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${crypto.randomUUID().slice(0, 8)}@example.com`,
    phone: pickRandom(["0412 345 678", "0423 456 789", "0434 567 890", "0445 678 901"]),
    role: pickRandom(activeRoles),
    source: pickRandom(["LinkedIn", "Referral", "Company careers page", "Seek", "Indeed"]),
    resume: pickRandom([
      "Frontend engineer with four years of experience building accessible React and TypeScript applications. Led a design system rollout and improved page load performance. Comfortable collaborating with product designers and backend engineers.",
      "Full stack engineer with six years of experience delivering web applications with React, Node.js, and PostgreSQL. Built APIs, automated testing pipelines, and internal tools. Enjoys working closely with customers to solve practical problems.",
      "Product designer with five years of experience in user research, prototyping, and interaction design. Delivered onboarding improvements for a SaaS product and maintained a shared component library in Figma. Works closely with engineers through delivery.",
      "Software engineer with two years of experience developing TypeScript applications. Contributed to customer dashboards, integration tests, and API documentation. Seeking a collaborative team with opportunities to grow product development skills.",
    ]),
    note: pickRandom([
      "Available to start in two weeks.",
      "Interested in a hybrid role in Sydney.",
      "Referred by a former colleague. Schedule an initial screening call.",
      "Portfolio includes several relevant projects. Discuss these in the interview.",
    ]),
  };
}
