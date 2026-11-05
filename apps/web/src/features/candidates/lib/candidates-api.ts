import { z } from "zod";
import { stages } from "@/features/candidates/lib/candidates";
import type { emptyCandidateForm } from "@/features/candidates/lib/candidate-form";

const candidateSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
  role: z.string(),
  date: z.iso.datetime(),
  stage: z.enum(stages),
  source: z.string().nullable(),
  resume: z.string(),
  notes: z.array(z.object({ id: z.uuid(), date: z.iso.datetime(), text: z.string() })),
});

export async function listCandidates(signal: AbortSignal) {
  const response = await fetch("/api/candidates", { signal });

  if (!response.ok) throw new Error("Could not load candidates");

  const body: unknown = await response.json();

  return z.array(candidateSchema).parse(body);
}

export async function saveCandidate(value: typeof emptyCandidateForm) {
  const response = await fetch("/api/candidates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });

  if (!response.ok) throw new Error("Could not save candidate");

  const body: unknown = await response.json();

  return candidateSchema.parse(body);
}
