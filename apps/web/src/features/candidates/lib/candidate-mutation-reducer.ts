import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";

export type CandidateMutationStatus =
  | { kind: "idle" }
  | { kind: "saving"; candidateId: string }
  | { kind: "error"; candidateId: string };

export type CandidateMutationState = {
  archive: CandidateMutationStatus;
  stageChange: CandidateMutationStatus;
};

export function candidateMutationReducer(
  state: CandidateMutationState,
  action: CandidatesAction,
): CandidateMutationState {
  if (action.type === "candidateArchiveStarted") {
    return { ...state, archive: { kind: "saving", candidateId: action.candidateId } };
  }

  if (action.type === "candidateArchiveFailed") {
    return { ...state, archive: { kind: "error", candidateId: action.candidateId } };
  }

  if (action.type === "candidateArchived") {
    return { ...state, archive: { kind: "idle" } };
  }

  if (action.type === "stageChangeStarted") {
    return { ...state, stageChange: { kind: "saving", candidateId: action.candidateId } };
  }

  if (action.type === "stageChangeFailed") {
    return { ...state, stageChange: { kind: "error", candidateId: action.candidateId } };
  }

  if (action.type === "stageChanged") {
    return { ...state, stageChange: { kind: "idle" } };
  }

  return state;
}
