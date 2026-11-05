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
    candidates: [],
    stageChange: { kind: "idle" },
    archive: { kind: "idle" },
    load: { kind: "loading" },
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
    dispatch({ type: "stageChangeStateChanged", state: { kind: "saving", candidateId } });

    try {
      const saved = await changeCandidateStage(candidateId, stage);
      dispatch({ type: "stageChanged", candidateId: saved.id, stage: saved.stage });
    } catch {
      dispatch({ type: "stageChangeStateChanged", state: { kind: "error", candidateId } });
    }
  }

  const selectedId = state.pane.kind === "open" ? state.pane.candidateId : null;
  const selected = state.candidates.find((candidate) => candidate.id === selectedId);

  return {
    candidates: state.candidates,
    load: state.load,
    selectedId,
    selected,
    dispatch,
    stageChangeState: state.stageChange,
    changeStage,
    archiveState: state.archive,
    archive,
  };
}
