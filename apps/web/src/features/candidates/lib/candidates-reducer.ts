import type { Candidate, Stage } from "@/features/candidates/lib/candidates";

type PaneState = { kind: "closed" } | { kind: "open"; candidateId: string };

export type ArchiveState =
  | { kind: "idle" }
  | { kind: "saving"; candidateId: string }
  | { kind: "error"; candidateId: string };

export type CandidateSort = "newest" | "oldest" | "stage";

export type CandidateFilters = {
  stage: Stage | null;
  role: string | null;
  sort: CandidateSort;
};

export type StageChangeState = ArchiveState;

export type CandidatesState = {
  revision: number;
  stageChange: StageChangeState;
  archive: ArchiveState;
  candidates: Candidate[];
  pane: PaneState;
  load: { kind: "loading" } | { kind: "ready" } | { kind: "error"; message: string };
};

export type CandidatesAction =
  | { type: "candidatesLoadStarted" }
  | { type: "candidatesLoaded"; candidates: Candidate[]; revision: number }
  | { type: "candidatesLoadFailed"; message: string }
  | { type: "candidateCreated"; candidate: Candidate }
  | { type: "candidateArchiveStarted"; candidateId: string }
  | { type: "candidateArchiveFailed"; candidateId: string }
  | { type: "candidateArchived"; candidateId: string }
  | { type: "noteAdded"; candidateId: string; note: Candidate["notes"][number] }
  | { type: "candidateSelected"; candidateId: string }
  | { type: "paneClosed" }
  | { type: "stageChangeStateChanged"; state: StageChangeState }
  | { type: "stageChanged"; candidateId: string; stage: Stage };

function closeArchivedPane(pane: PaneState, candidateId: string): PaneState {
  return pane.kind === "open" && pane.candidateId === candidateId ? { kind: "closed" } : pane;
}

export function candidatesReducer(
  state: CandidatesState,
  action: CandidatesAction,
): CandidatesState {
  if (action.type === "stageChangeStateChanged") return { ...state, stageChange: action.state };

  return reduceCandidateData(state, action);
}

function reduceCandidateData(
  state: CandidatesState,
  action: Exclude<CandidatesAction, { type: "stageChangeStateChanged" }>,
): CandidatesState {
  switch (action.type) {
    case "candidatesLoadStarted":
      return { ...state, load: { kind: "loading" } };
    case "candidatesLoaded":
      return applyLoadedCandidates(state, action);
    case "candidatesLoadFailed":
      return { ...state, load: { kind: "error", message: action.message } };
    case "candidateCreated":
      return {
        ...state,
        candidates: [action.candidate, ...state.candidates],
        revision: state.revision + 1,
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
        revision: state.revision + 1,
        candidates: state.candidates.filter((candidate) => candidate.id !== action.candidateId),
        pane: closeArchivedPane(state.pane, action.candidateId),
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
        stageChange: { kind: "idle" },
        revision: state.revision + 1,
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

function applyLoadedCandidates(
  state: CandidatesState,
  action: Extract<CandidatesAction, { type: "candidatesLoaded" }>,
): CandidatesState {
  if (action.revision !== state.revision) return state;

  return { ...state, candidates: action.candidates, load: { kind: "ready" } };
}
