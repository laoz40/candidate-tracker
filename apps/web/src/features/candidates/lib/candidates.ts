import type { listCandidates } from "@/features/candidates/lib/candidates-api";

export const stages = ["Applied", "Screening", "Interview", "Offer", "Rejected"] as const;

export type Stage = (typeof stages)[number];

export type Candidate = Awaited<ReturnType<typeof listCandidates>>[number];

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
