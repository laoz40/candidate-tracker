import type { Candidate } from "@/features/candidates/lib/candidates";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";

export type CandidateListState = {
  candidates: Candidate[];
  load: { kind: "loading" } | { kind: "ready" } | { kind: "error"; message: string };
};

export function candidateListReducer(
  state: CandidateListState,
  action: CandidatesAction,
): CandidateListState {
  switch (action.type) {
    case "candidatesLoaded":
      return {
        ...state,
        candidates: [
          ...state.candidates,
          ...action.candidates.filter(
            (candidate) => !state.candidates.some((existing) => existing.id === candidate.id),
          ),
        ],
        load: { kind: "ready" },
      };
    case "candidatesLoadFailed":
      return { ...state, load: { kind: "error", message: action.message } };
    case "candidateCreated":
      return { ...state, candidates: [action.candidate, ...state.candidates] };
    case "candidateArchived":
      return {
        ...state,
        candidates: state.candidates.filter((candidate) => candidate.id !== action.candidateId),
      };
    case "stageChanged":
      return {
        ...state,
        candidates: state.candidates.map((candidate) =>
          candidate.id === action.candidateId ? { ...candidate, stage: action.stage } : candidate,
        ),
      };
    case "candidateArchiveFailed":
    case "candidateArchiveStarted":
    case "candidateSelected":
    case "paneClosed":
    case "stageChangeFailed":
    case "stageChangeStarted":
      return state;
    default: {
      const exhaustive: never = action;

      return exhaustive;
    }
  }
}
