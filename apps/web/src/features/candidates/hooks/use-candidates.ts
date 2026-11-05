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
    list: { candidates: [], revision: 0, load: { kind: "loading" } },
    mutations: { stageChange: { kind: "idle" }, archive: { kind: "idle" } },
    pane: { kind: "closed" },
  });

  const { stage, role, sort, archived } = filters;
  const { revision } = state.list;

  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: "candidatesLoadStarted" });

    void listCandidates(
      { stage: stage ?? undefined, role: role ?? undefined, sort, archived },
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
  }, [stage, role, sort, archived, revision]);

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
    dispatch({ type: "stageChangeStarted", candidateId });

    try {
      const saved = await changeCandidateStage(candidateId, nextStage);
      dispatch({ type: "stageChanged", candidateId: saved.id, stage: saved.stage });
    } catch {
      dispatch({ type: "stageChangeFailed", candidateId });
    }
  }

  const selectedId = state.pane.kind === "open" ? state.pane.candidateId : null;
  const selected = state.list.candidates.find((candidate) => candidate.id === selectedId);

  return {
    roles: activeRoles,
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
