import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddCandidateDialog } from "@/features/candidates/components/AddCandidateDialog";
import type { Dispatch } from "react";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";

export function CandidatesHeader({
  count,
  dispatch,
}: {
  count: number;
  dispatch: Dispatch<CandidatesAction>;
}) {
  return (
    <header className="flex min-h-20 shrink-0 flex-wrap items-center gap-3 px-6 py-4">
      <SidebarTrigger
        variant="outline"
        size="icon-lg"
      />
      <h1 className="text-2xl font-semibold tracking-tight">Candidates</h1>
      <Badge variant="secondary">{count}</Badge>
      <div className="ml-auto">
        <AddCandidateDialog dispatch={dispatch} />
      </div>
    </header>
  );
}
