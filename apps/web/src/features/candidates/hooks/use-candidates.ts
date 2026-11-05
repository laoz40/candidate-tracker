import type { Stage } from "@/features/candidates/lib/candidates";
import { useEffect, useReducer } from "react";
import {
  archiveCandidate,
  changeCandidateStage,
  listCandidates,
} from "@/features/candidates/lib/candidates-api";
import { candidatesReducer } from "@/features/candidates/lib/candidates-reducer";

export function useCandidates() {
  const [state, dispatch] = useReducer(candidatesReducer, {
    list: { candidates: [], load: { kind: "loading" } },
    mutations: { stageChange: { kind: "idle" }, archive: { kind: "idle" } },
    pane: { kind: "closed" },
  });

  useEffect(() => {
    const controller = new AbortController();

    void listCandidates(controller.signal).then(
      (candidates) => dispatch({ type: "candidatesLoaded", candidates }),
      () => {
        if (controller.signal.aborted) return;

        dispatch({
          type: "candidatesLoadFailed",
          message: "Could not load candidates. Refresh to try again.",
        });
      },
    );

    return () => controller.abort();
  }, []);

  async function archive(candidateId: string) {
    dispatch({ type: "candidateArchiveStarted", candidateId });

    try {
      await archiveCandidate(candidateId);
      dispatch({ type: "candidateArchived", candidateId });
    } catch {
      dispatch({ type: "candidateArchiveFailed", candidateId });
    }
  }

  async function changeStage(candidateId: string, stage: Stage) {
    dispatch({ type: "stageChangeStarted", candidateId });

    try {
      const saved = await changeCandidateStage(candidateId, stage);
      dispatch({ type: "stageChanged", candidateId: saved.id, stage: saved.stage });
    } catch {
      dispatch({ type: "stageChangeFailed", candidateId });
    }
  }

  const selectedId = state.pane.kind === "open" ? state.pane.candidateId : null;
  const selected = state.list.candidates.find((candidate) => candidate.id === selectedId);

  return {
    candidates: state.list.candidates,
    load: state.list.load,
    selectedId,
    selected,
    dispatch,
    stageChangeState: state.mutations.stageChange,
    changeStage,
    archiveState: state.mutations.archive,
    archive,
  };
}
