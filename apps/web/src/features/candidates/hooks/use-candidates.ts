import { activeRoles } from "@/features/candidates/lib/candidate-form";
import type { CandidateFilters } from "@/features/candidates/lib/candidates-reducer";
import type { Stage } from "@/features/candidates/lib/candidates";
import { useEffect, useReducer } from "react";
import {
  archiveCandidate,
  changeCandidateStage,
  listCandidates,
} from "@/features/candidates/lib/candidates-api";
import { candidatesReducer } from "@/features/candidates/lib/candidates-reducer";

export function useCandidates(filters: CandidateFilters) {
  const [state, dispatch] = useReducer(candidatesReducer, {
    candidates: [],
    revision: 0,
    stageChange: { kind: "idle" },
    archive: { kind: "idle" },
    load: { kind: "loading" },
    pane: { kind: "closed" },
  });

  const { stage, role, sort } = filters;
  const { revision } = state;

  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: "candidatesLoadStarted" });

    void listCandidates(
      { stage: stage ?? undefined, role: role ?? undefined, sort },
      controller.signal,
    ).then(
      (candidates) => {
        if (controller.signal.aborted) return;

        dispatch({ type: "candidatesLoaded", candidates, revision });
      },
      () => {
        if (controller.signal.aborted) return;

        dispatch({
          type: "candidatesLoadFailed",
          message: "Could not load candidates. Refresh to try again.",
        });
      },
    );

    return () => controller.abort();
  }, [stage, role, sort, revision]);

  async function archive(candidateId: string) {
    dispatch({ type: "candidateArchiveStarted", candidateId });

    try {
      await archiveCandidate(candidateId);
      dispatch({ type: "candidateArchived", candidateId });
    } catch {
      dispatch({ type: "candidateArchiveFailed", candidateId });
    }
  }

  async function changeStage(candidateId: string, nextStage: Stage) {
    dispatch({ type: "stageChangeStateChanged", state: { kind: "saving", candidateId } });

    try {
      const saved = await changeCandidateStage(candidateId, nextStage);
      dispatch({ type: "stageChanged", candidateId: saved.id, stage: saved.stage });
    } catch {
      dispatch({ type: "stageChangeStateChanged", state: { kind: "error", candidateId } });
    }
  }

  const selectedId = state.pane.kind === "open" ? state.pane.candidateId : null;
  const selected = state.candidates.find((candidate) => candidate.id === selectedId);

  return {
    roles: activeRoles,
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
