import { RiArchiveLine, RiLoader4Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import type { CandidateMutationStatus } from "@/features/candidates/lib/candidate-mutation-reducer";

export function ArchiveCandidateButton({
  candidateId,
  state,
  onArchive,
}: {
  candidateId: string;
  state: CandidateMutationStatus;
  onArchive: (candidateId: string) => Promise<void>;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        variant="outline-destructive"
        disabled={state.kind === "saving"}
        onClick={() => void onArchive(candidateId)}>
        {state.kind === "saving" ? (
          <RiLoader4Line
            data-icon="inline-start"
            className="animate-spin"
          />
        ) : (
          <RiArchiveLine data-icon="inline-start" />
        )}
        {state.kind === "saving" ? "Archiving" : "Archive candidate"}
      </Button>
      {state.kind === "error" && state.candidateId === candidateId ? (
        <p role="alert">Could not archive candidate. Please try again.</p>
      ) : null}
    </div>
  );
}
