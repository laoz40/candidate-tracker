import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";

export type CandidatePaneState = { kind: "closed" } | { kind: "open"; candidateId: string };

export function candidatePaneReducer(
  state: CandidatePaneState,
  action: CandidatesAction,
): CandidatePaneState {
  if (action.type === "candidateSelected") {
    return { kind: "open", candidateId: action.candidateId };
  }

  if (action.type === "candidateCreated") {
    return { kind: "open", candidateId: action.candidate.id };
  }

  if (action.type === "paneClosed") return { kind: "closed" };

  if (
    action.type === "candidateArchived" &&
    state.kind === "open" &&
    state.candidateId === action.candidateId
  ) {
    return { kind: "closed" };
  }

  return state;
}
