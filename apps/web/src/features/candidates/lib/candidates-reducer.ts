import type { Candidate, Stage } from "@/features/candidates/lib/candidates";
import {
  candidateListReducer,
  type CandidateListState,
} from "@/features/candidates/lib/candidate-list-reducer";
import {
  candidateMutationReducer,
  type CandidateMutationState,
} from "@/features/candidates/lib/candidate-mutation-reducer";
import {
  candidatePaneReducer,
  type CandidatePaneState,
} from "@/features/candidates/lib/candidate-pane-reducer";

export type CandidatesState = {
  list: CandidateListState;
  mutations: CandidateMutationState;
  pane: CandidatePaneState;
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
  | { type: "stageChangeStarted"; candidateId: string }
  | { type: "stageChangeFailed"; candidateId: string }
  | { type: "stageChanged"; candidateId: string; stage: Stage };

export function candidatesReducer(
  state: CandidatesState,
  action: CandidatesAction,
): CandidatesState {
  return {
    list: candidateListReducer(state.list, action),
    mutations: candidateMutationReducer(state.mutations, action),
    pane: candidatePaneReducer(state.pane, action),
  };
}
