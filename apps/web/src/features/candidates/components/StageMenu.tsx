import type { StageChangeState } from "@/features/candidates/lib/candidates-reducer";
import {
  RiArrowDownSLine,
  RiLoader4Line,
  RiCircleLine,
  RiSearchLine,
  RiDiscussLine,
  RiCheckLine,
  RiCloseLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { stages, type Candidate, type Stage } from "@/features/candidates/lib/candidates";

export function StageBadge({ stage }: { stage: Stage }) {
  const styles = {
    Applied: { variant: "neutral", icon: RiCircleLine },
    Screening: { variant: "info", icon: RiSearchLine },
    Interview: { variant: "progress", icon: RiDiscussLine },
    Offer: { variant: "success", icon: RiCheckLine },
    Rejected: { variant: "danger", icon: RiCloseLine },
  } as const;

  const { variant, icon: Icon } = styles[stage];

  return (
    <Badge variant={variant}>
      <Icon data-icon="inline-start" />
      {stage}
    </Badge>
  );
}

export type StageMenuProps = {
  candidate: Pick<Candidate, "id" | "name" | "stage">;
  stageChangeState: StageChangeState;
  onStageChange: (candidateId: string, stage: Stage) => Promise<void>;
};

export function StageMenu({ candidate, stageChangeState, onStageChange }: StageMenuProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              disabled={stageChangeState.kind === "saving"}
              variant="outline"
              size="sm"
              aria-label={`Change stage for ${candidate.name}`}
            />
          }>
          {stageChangeState.kind === "saving" && stageChangeState.candidateId === candidate.id ? (
            <>
              <RiLoader4Line
                data-icon="inline-start"
                className="animate-spin"
              />
              Saving
            </>
          ) : (
            <>
              Change stage <RiArrowDownSLine data-icon="inline-end" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {stages.map((option) => (
              <DropdownMenuItem
                key={option}
                disabled={option === candidate.stage || stageChangeState.kind === "saving"}
                onClick={() => void onStageChange(candidate.id, option)}>
                {option}
                {option === candidate.stage ? " (current)" : ""}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {stageChangeState.kind === "error" && stageChangeState.candidateId === candidate.id ? (
        <p role="alert">Could not change stage. Please try again.</p>
      ) : null}
    </div>
  );
}
