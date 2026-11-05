import type { Dispatch } from "react";
import { requestCandidateSummary } from "@/features/candidates/lib/candidates-api";

type Summary = Awaited<ReturnType<typeof requestCandidateSummary>>;

export type CandidateSummaryState =
  | { kind: "idle" }
  | { kind: "generating" }
  | { kind: "ready"; summary: Summary }
  | { kind: "error"; message: string };

export type CandidateSummaryAction =
  | { type: "summaryStarted"; candidateId: string }
  | { type: "summaryGenerated"; candidateId: string; summary: Summary }
  | { type: "summaryFailed"; candidateId: string; message: string };

export async function generateCandidateSummary(
  candidateId: string,
  dispatch: Dispatch<CandidateSummaryAction>,
) {
  dispatch({ type: "summaryStarted", candidateId });

  try {
    const summary = await requestCandidateSummary(candidateId);
    dispatch({ type: "summaryGenerated", candidateId, summary });
  } catch (error) {
    console.error("AI summary generation failed", {
      candidateId,
      error,
      details: error instanceof Error ? error.cause : undefined,
    });

    dispatch({
      type: "summaryFailed",
      candidateId,
      message: error instanceof Error ? error.message : "Could not generate summary. Try again.",
    });
  }
}

export function candidateSummaryReducer(
  state: Map<string, CandidateSummaryState>,
  action: CandidateSummaryAction,
): Map<string, CandidateSummaryState> {
  const next = new Map(state);

  switch (action.type) {
    case "summaryStarted":
      next.set(action.candidateId, { kind: "generating" });
      break;
    case "summaryGenerated":
      next.set(action.candidateId, { kind: "ready", summary: action.summary });
      break;
    case "summaryFailed":
      next.set(action.candidateId, { kind: "error", message: action.message });
      break;
    default: {
      const exhaustive: never = action;

      return exhaustive;
    }
  }

  return next;
}
