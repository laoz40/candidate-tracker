import { useEffect, useReducer } from "react";
import { listCandidates } from "@/features/candidates/lib/candidates-api";
import { candidatesReducer } from "@/features/candidates/lib/candidates-reducer";

export function useCandidates() {
  const [state, dispatch] = useReducer(candidatesReducer, {
    candidates: [],
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

  const selectedId = state.pane.kind === "open" ? state.pane.candidateId : null;
  const selected = state.candidates.find((candidate) => candidate.id === selectedId);

  return {
    candidates: state.candidates,
    load: state.load,
    selectedId,
    selected,
    dispatch,
  };
}
