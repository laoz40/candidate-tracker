import { z } from "zod";
import { DOCUMENT_MIN_CHARACTERS } from "@candidate-tracker/server/document-limits";

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
    .min(
      DOCUMENT_MIN_CHARACTERS,
      `Provide at least ${DOCUMENT_MIN_CHARACTERS} characters of resume or cover letter text.`,
    ),
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
