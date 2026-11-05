import type { Candidate, Stage } from "@/features/candidates/lib/candidates";

type PaneState = { kind: "closed" } | { kind: "open"; candidateId: string };

export type CandidatesState = {
  candidates: Candidate[];
  pane: PaneState;
};

export type CandidatesAction =
  | { type: "candidateSelected"; candidateId: string }
  | { type: "paneClosed" }
  | { type: "stageChanged"; candidateId: string; stage: Stage };

export function candidatesReducer(
  state: CandidatesState,
  action: CandidatesAction,
): CandidatesState {
  switch (action.type) {
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
