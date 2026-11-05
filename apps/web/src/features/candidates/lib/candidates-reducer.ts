import type { Candidate, Stage } from "@/features/candidates/lib/candidates";

type PaneState = { kind: "closed" } | { kind: "open"; candidateId: string };

export type ArchiveState =
  | { kind: "idle" }
  | { kind: "saving"; candidateId: string }
  | { kind: "error"; candidateId: string };

export type StageChangeState = ArchiveState;

export type CandidatesState = {
  stageChange: StageChangeState;
  archive: ArchiveState;
  candidates: Candidate[];
  pane: PaneState;
  load: { kind: "loading" } | { kind: "ready" } | { kind: "error"; message: string };
};

export type CandidatesAction =
  | { type: "candidatesLoaded"; candidates: Candidate[] }
  | { type: "candidatesLoadFailed"; message: string }
  | { type: "candidateCreated"; candidate: Candidate }
  | { type: "candidateArchiveStarted"; candidateId: string }
  | { type: "candidateArchiveFailed"; candidateId: string }
  | { type: "candidateArchived"; candidateId: string }
  | { type: "candidateSelected"; candidateId: string }
  | { type: "paneClosed" }
  | { type: "stageChangeStateChanged"; state: StageChangeState }
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
    case "candidateArchiveStarted":
      return { ...state, archive: { kind: "saving", candidateId: action.candidateId } };
    case "candidateArchiveFailed":
      return { ...state, archive: { kind: "error", candidateId: action.candidateId } };
    case "candidateArchived":
      return {
        ...state,
        archive: { kind: "idle" },
        candidates: state.candidates.filter((candidate) => candidate.id !== action.candidateId),
        pane: closeCandidatePane(state.pane, action.candidateId),
      };
    case "candidateSelected":
      return { ...state, pane: { kind: "open", candidateId: action.candidateId } };
    case "paneClosed":
      return { ...state, pane: { kind: "closed" } };
    case "stageChangeStateChanged":
      return { ...state, stageChange: action.state };
    case "stageChanged":
      return {
        ...state,
        stageChange: { kind: "idle" },
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

function closeCandidatePane(pane: PaneState, candidateId: string): PaneState {
  if (pane.kind === "open" && pane.candidateId === candidateId) return { kind: "closed" };

  return pane;
}
