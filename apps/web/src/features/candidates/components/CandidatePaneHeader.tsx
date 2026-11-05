import type { StageMenuProps } from "@/features/candidates/components/StageMenu";
import type { Dispatch } from "react";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";
import { RiCloseLine } from "@remixicon/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StageBadge, StageMenu } from "@/features/candidates/components/StageMenu";
import { initials, type Candidate } from "@/features/candidates/lib/candidates";

type CandidatePaneHeaderProps = Pick<StageMenuProps, "stageChangeState" | "onStageChange"> & {
  candidate: Pick<Candidate, "id" | "name" | "role" | "stage">;
  dispatch: Dispatch<CandidatesAction>;
};

export function CandidatePaneHeader({
  candidate,
  dispatch,
  stageChangeState,
  onStageChange,
}: CandidatePaneHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarFallback>{initials(candidate.name)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2
            id="candidate-name"
            className="text-lg leading-6 font-semibold tracking-tight">
            {candidate.name}
          </h2>
          <p className="text-sm text-muted-foreground">{candidate.role}</p>
        </div>
        <Button
          variant="outline"
          size="icon-lg"
          onClick={() => dispatch({ type: "paneClosed" })}
          aria-label="Close candidate details">
          <RiCloseLine />
        </Button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <StageBadge stage={candidate.stage} />
        <StageMenu
          candidate={candidate}
          stageChangeState={stageChangeState}
          onStageChange={onStageChange}
        />
      </div>
    </>
  );
}
