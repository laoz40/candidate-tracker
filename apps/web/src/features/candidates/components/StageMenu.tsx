import type { Dispatch } from "react";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";
import {
  RiArrowDownSLine,
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

type StageMenuProps = {
  candidate: Pick<Candidate, "id" | "name" | "stage">;
  dispatch: Dispatch<CandidatesAction>;
};

export function StageMenu({ candidate, dispatch }: StageMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            aria-label={`Change stage for ${candidate.name}`}
          />
        }>
        Change stage <RiArrowDownSLine data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {stages.map((option) => (
            <DropdownMenuItem
              key={option}
              disabled={option === candidate.stage}
              onClick={() =>
                dispatch({ type: "stageChanged", candidateId: candidate.id, stage: option })
              }>
              {option}
              {option === candidate.stage ? " (current)" : ""}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
