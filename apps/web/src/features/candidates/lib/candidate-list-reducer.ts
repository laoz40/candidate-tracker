import type { Candidate } from "@/features/candidates/lib/candidates";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";

export type CandidateListState = {
  candidates: Candidate[];
  revision: number;
  load: { kind: "loading" } | { kind: "ready" } | { kind: "error"; message: string };
};

export function candidateListReducer(
  state: CandidateListState,
  action: CandidatesAction,
): CandidateListState {
  if (action.type === "candidatesLoadStarted") {
    return { ...state, load: { kind: "loading" } };
  }

  if (action.type === "candidatesLoaded") {
    return action.revision === state.revision
      ? { ...state, candidates: action.candidates, load: { kind: "ready" } }
      : state;
  }

  if (action.type === "candidatesLoadFailed") {
    return { ...state, load: { kind: "error", message: action.message } };
  }

  if (action.type === "candidateCreated") {
    return {
      ...state,
      candidates: [action.candidate, ...state.candidates],
      revision: state.revision + 1,
    };
  }

  if (action.type === "candidateArchived") {
    return {
      ...state,
      revision: state.revision + 1,
      candidates: state.candidates.filter((candidate) => candidate.id !== action.candidateId),
    };
  }

  if (action.type === "stageChanged") {
    return {
      ...state,
      revision: state.revision + 1,
      candidates: state.candidates.map((candidate) =>
        candidate.id === action.candidateId ? { ...candidate, stage: action.stage } : candidate,
      ),
    };
  }

  if (action.type === "noteAdded") {
    return {
      ...state,
      candidates: state.candidates.map((candidate) =>
        candidate.id === action.candidateId
          ? { ...candidate, notes: [...candidate.notes, action.note] }
          : candidate,
      ),
    };
  }

  return state;
}
