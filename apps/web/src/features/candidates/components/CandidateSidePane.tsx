import type { StageMenuProps } from "@/features/candidates/components/StageMenu";
import type { Dispatch } from "react";
import type { CandidateMutationStatus } from "@/features/candidates/lib/candidate-mutation-reducer";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";
import { ArchiveCandidateButton } from "@/features/candidates/components/ArchiveCandidateButton";
import { CandidateNotes } from "@/features/candidates/components/CandidateNotes";
import { CandidatePaneHeader } from "@/features/candidates/components/CandidatePaneHeader";
import { CandidateProfileFields } from "@/features/candidates/components/CandidateProfileFields";
import { CandidateResume } from "@/features/candidates/components/CandidateResume";
import { Separator } from "@/components/ui/separator";
import type { Candidate } from "@/features/candidates/lib/candidates";

type CandidateSidePaneProps = Pick<StageMenuProps, "stageChangeState" | "onStageChange"> & {
  candidate: Candidate;
  archiveState: CandidateMutationStatus;
  onArchive: (candidateId: string) => Promise<void>;
  dispatch: Dispatch<Extract<CandidatesAction, { type: "paneClosed" | "noteAdded" }>>;
};

export function CandidateSidePane({
  candidate,
  dispatch,
  archiveState,
  onArchive,
  stageChangeState,
  onStageChange,
}: CandidateSidePaneProps) {
  return (
    <section
      id="candidate-detail"
      aria-labelledby="candidate-name"
      className="flex min-w-0 flex-col border-t bg-background xl:w-2/5 xl:max-w-2xl xl:min-w-96 xl:shrink-0 xl:border-t-0 xl:border-l">
      <div className="flex flex-col gap-6 overflow-y-auto p-6">
        <CandidatePaneHeader
          candidate={candidate}
          dispatch={dispatch}
          stageChangeState={stageChangeState}
          onStageChange={onStageChange}
        />
        <CandidateProfileFields candidate={candidate} />
        <Separator />
        <CandidateResume candidate={candidate} />
        <Separator />
        <CandidateNotes
          candidate={candidate}
          dispatch={dispatch}
        />
        <Separator />
        <ArchiveCandidateButton
          candidateId={candidate.id}
          state={archiveState}
          onArchive={onArchive}
        />
      </div>
    </section>
  );
}
