import type { Dispatch } from "react";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CandidateTableRow } from "@/features/candidates/components/CandidateTableRow";
import type { Candidate } from "@/features/candidates/lib/candidates";

type CandidateTableProps = {
  candidates: Candidate[];
  selectedId: string | null;
  dispatch: Dispatch<CandidatesAction>;
};

export function CandidateTable({ candidates, selectedId, dispatch }: CandidateTableProps) {
  return (
    <Table aria-label="Candidates">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="w-44">Role</TableHead>
          <TableHead className="w-32">Date added</TableHead>
          <TableHead className="w-32">Stage</TableHead>
          <TableHead className="w-40">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidates.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center">
              No candidates yet. Add a candidate to get started.
            </TableCell>
          </TableRow>
        ) : null}
        {candidates.map((candidate) => (
          <CandidateTableRow
            key={candidate.id}
            candidate={candidate}
            isSelected={selectedId === candidate.id}
            dispatch={dispatch}
          />
        ))}
      </TableBody>
    </Table>
  );
}
