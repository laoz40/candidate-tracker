import type { CandidateMutationStatus } from "@/features/candidates/lib/candidate-mutation-reducer";
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

const stageStyles = {
  Applied: { variant: "neutral", icon: RiCircleLine },
  Screening: { variant: "info", icon: RiSearchLine },
  Interview: { variant: "progress", icon: RiDiscussLine },
  Offer: { variant: "success", icon: RiCheckLine },
  Rejected: { variant: "danger", icon: RiCloseLine },
} as const;

export function StageBadge({ stage }: { stage: Stage }) {
  const { variant, icon: Icon } = stageStyles[stage];

  return (
    <Badge variant={variant}>
      <Icon data-icon="inline-start" />
      {stage}
    </Badge>
  );
}

export type StageMenuProps = {
  candidate: Pick<Candidate, "id" | "name" | "stage">;
  stageChangeState: CandidateMutationStatus;
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
            {stages.map((option) => {
              const { variant, icon: Icon } = stageStyles[option];
              const isCurrent = option === candidate.stage;

              return (
                <DropdownMenuItem
                  key={option}
                  variant={variant}
                  data-current={isCurrent || undefined}
                  disabled={isCurrent || stageChangeState.kind === "saving"}
                  aria-label={isCurrent ? `${option}, current stage` : option}
                  onClick={() => void onStageChange(candidate.id, option)}>
                  <Icon />
                  {option}
                  {isCurrent ? (
                    <span
                      aria-hidden="true"
                      className="ml-auto size-2 rounded-full bg-current"
                    />
                  ) : null}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {stageChangeState.kind === "error" && stageChangeState.candidateId === candidate.id ? (
        <p role="alert">Could not change stage. Please try again.</p>
      ) : null}
    </div>
  );
}
