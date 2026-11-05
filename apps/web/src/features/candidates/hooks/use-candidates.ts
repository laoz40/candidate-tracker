import { useReducer } from "react";
import { sampleCandidates } from "@/features/candidates/lib/candidates";
import { candidatesReducer } from "@/features/candidates/lib/candidates-reducer";

export function useCandidates() {
  const [state, dispatch] = useReducer(candidatesReducer, {
    candidates: sampleCandidates,
    pane: { kind: "closed" },
  });

  const selectedId = state.pane.kind === "open" ? state.pane.candidateId : null;
  const selected = state.candidates.find((candidate) => candidate.id === selectedId);

  return {
    candidates: state.candidates,
    selectedId,
    selected,
    dispatch,
  };
}
