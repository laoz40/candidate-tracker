import { z } from "zod";

export const summarySchema = z.union([
  z.object({
    kind: z.literal("summary"),
    overview: z.string().trim().min(1),
    skills: z.array(z.string().trim().min(1)),
    experienceHighlights: z.array(z.string().trim().min(1)),
  }),
  z.object({
    kind: z.literal("insufficient_information"),
    reason: z.string().trim().min(1),
  }),
]);

export type Summary = z.infer<typeof summarySchema>;

export const summaryOutputSchema = z.object({ result: summarySchema });
