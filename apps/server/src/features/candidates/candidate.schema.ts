import { z } from "zod";

export const candidateInputSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  phone: z.string().trim(),
  role: z.enum(["Frontend Engineer", "Full Stack Engineer", "Product Designer"]),
  source: z.string().trim(),
  resume: z.string().trim().min(1).max(50_000),
  note: z.string().trim(),
});

export type CandidateInput = z.infer<typeof candidateInputSchema>;

export const candidateIdSchema = z.object({ id: z.uuid() });
export const candidateNoteInputSchema = z.object({ text: z.string().trim().min(1) });

export const candidateListSchema = z.object({
  stage: z.enum(["Applied", "Screening", "Interview", "Offer", "Rejected"]).optional(),
  role: z.string().trim().min(1).optional(),
  sort: z.enum(["newest", "oldest", "stage"]).default("newest"),
});

export type CandidateListQuery = z.infer<typeof candidateListSchema>;

export const candidateStageInputSchema = z.object({
  stage: z.enum(["Applied", "Screening", "Interview", "Offer", "Rejected"]),
});
