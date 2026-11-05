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
  switch (action.type) {
    case "candidateArchiveStarted":
      return { ...state, archive: { kind: "saving", candidateId: action.candidateId } };
    case "candidateArchiveFailed":
      return { ...state, archive: { kind: "error", candidateId: action.candidateId } };
    case "candidateArchived":
      return { ...state, archive: { kind: "idle" } };
    case "stageChangeStarted":
      return { ...state, stageChange: { kind: "saving", candidateId: action.candidateId } };
    case "stageChangeFailed":
      return { ...state, stageChange: { kind: "error", candidateId: action.candidateId } };
    case "stageChanged":
      return { ...state, stageChange: { kind: "idle" } };
    case "candidateCreated":
    case "candidateSelected":
    case "candidatesLoadFailed":
    case "candidatesLoaded":
    case "paneClosed":
      return state;
    default: {
      const exhaustive: never = action;

      return exhaustive;
    }
  }
}
