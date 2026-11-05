import { hc, type InferRequestType } from "hono/client";
import type { AppType } from "@candidate-tracker/server";

const client = hc<AppType>("/").api;

type CreateCandidateInput = InferRequestType<typeof client.candidates.$post>["json"];

export async function listCandidates(signal: AbortSignal) {
  const response = await client.candidates.$get({}, { init: { signal } });

  if (!response.ok) throw new Error("Could not load candidates");

  return response.json();
}

export async function saveCandidate(value: CreateCandidateInput) {
  const response = await client.candidates.$post({ json: value });

  if (!response.ok) throw new Error("Could not save candidate");

  return response.json();
}

export async function archiveCandidate(id: string) {
  const response = await client.candidates[":id"].archive.$post({ param: { id } });

  if (!response.ok) throw new Error("Could not archive candidate");
}

export async function saveCandidateNote(candidateId: string, text: string) {
  const response = await client.candidates[":id"].notes.$post({
    param: { id: candidateId },
    json: { text },
  });

  if (!response.ok) throw new Error("Could not save note");

  return response.json();
}
