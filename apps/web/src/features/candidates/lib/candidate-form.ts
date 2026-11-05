import { z } from "zod";
import type { Candidate } from "@/features/candidates/lib/candidates";

export const activeRoles = [
  "Frontend Engineer",
  "Full Stack Engineer",
  "Product Designer",
] as const;

export const candidateFormSchema = z.object({
  name: z.string().trim().min(1, "Enter the candidate's name."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim(),
  role: z.enum(activeRoles, { error: "Select a role." }),
  source: z.string().trim(),
  resume: z
    .string()
    .trim()
    .min(1, "Paste resume or cover letter text.")
    .max(50_000, "Use no more than 50,000 characters."),
  note: z.string().trim(),
});

export const emptyCandidateForm = {
  name: "",
  email: "",
  phone: "",
  role: "",
  source: "",
  resume: "",
  note: "",
};

export function createCandidate(value: z.infer<typeof candidateFormSchema>): Candidate {
  const now = new Date();

  return {
    id: crypto.randomUUID(),
    name: value.name,
    email: value.email,
    phone: value.phone || null,
    role: value.role,
    source: value.source || null,
    resume: value.resume,
    stage: "Applied",
    date: now.toISOString(),
    notes: value.note
      ? [{ id: crypto.randomUUID(), date: now.toISOString(), text: value.note }]
      : [],
  };
}
