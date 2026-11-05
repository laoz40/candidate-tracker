import type { Candidate, Stage } from "@/features/candidates/lib/candidates";

type PaneState = { kind: "closed" } | { kind: "open"; candidateId: string };

export type CandidatesState = {
  candidates: Candidate[];
  pane: PaneState;
  load: { kind: "loading" } | { kind: "ready" } | { kind: "error"; message: string };
};

export type CandidatesAction =
  | { type: "candidatesLoaded"; candidates: Candidate[] }
  | { type: "candidatesLoadFailed"; message: string }
  | { type: "candidateCreated"; candidate: Candidate }
  | { type: "noteAdded"; candidateId: string; note: Candidate["notes"][number] }
  | { type: "candidateSelected"; candidateId: string }
  | { type: "paneClosed" }
  | { type: "stageChanged"; candidateId: string; stage: Stage };

export function candidatesReducer(
  state: CandidatesState,
  action: CandidatesAction,
): CandidatesState {
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
      return {
        ...state,
        candidates: [action.candidate, ...state.candidates],
        pane: { kind: "open", candidateId: action.candidate.id },
      };
    case "noteAdded":
      return {
        ...state,
        candidates: state.candidates.map((candidate) =>
          candidate.id === action.candidateId
            ? { ...candidate, notes: [...candidate.notes, action.note] }
            : candidate,
        ),
      };
    case "candidateSelected":
      return { ...state, pane: { kind: "open", candidateId: action.candidateId } };
    case "paneClosed":
      return { ...state, pane: { kind: "closed" } };
    case "stageChanged":
      return {
        ...state,
        candidates: state.candidates.map((item) =>
          item.id === action.candidateId ? { ...item, stage: action.stage } : item,
        ),
      };
    default: {
      const exhaustive: never = action;

      return exhaustive;
    }
  }
}
