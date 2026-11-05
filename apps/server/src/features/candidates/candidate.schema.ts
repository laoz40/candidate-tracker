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
