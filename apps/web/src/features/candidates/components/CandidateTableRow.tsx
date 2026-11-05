import type { StageMenuProps } from "@/features/candidates/components/StageMenu";
import type { Dispatch } from "react";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableRow, TableCell } from "@/components/ui/table";
import { StageBadge, StageMenu } from "@/features/candidates/components/StageMenu";
import { initials, formatDate, type Candidate } from "@/features/candidates/lib/candidates";

type CandidateTableRowProps = Pick<StageMenuProps, "stageChangeState" | "onStageChange"> & {
  candidate: Candidate;
  isSelected: boolean;
  dispatch: Dispatch<CandidatesAction>;
};

export function CandidateTableRow({
  candidate,
  isSelected,
  dispatch,
  stageChangeState,
  onStageChange,
}: CandidateTableRowProps) {
  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => dispatch({ type: "candidateSelected", candidateId: candidate.id })}
      data-state={isSelected ? "selected" : undefined}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials(candidate.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{candidate.name}</span>
        </div>
      </TableCell>
      <TableCell>{candidate.role}</TableCell>
      <TableCell>
        <time dateTime={candidate.date}>{formatDate(candidate.date)}</time>
      </TableCell>
      <TableCell>
        <StageBadge stage={candidate.stage} />
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <div className="flex justify-end">
          <StageMenu
            candidate={candidate}
            stageChangeState={stageChangeState}
            onStageChange={onStageChange}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
