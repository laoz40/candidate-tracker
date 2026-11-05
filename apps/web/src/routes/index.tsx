import { RiLoader4Line } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CandidatesHeader } from "@/features/candidates/components/CandidatesHeader";
import { TrackerSidebar } from "@/components/TrackerSidebar";
import { CandidateTable } from "@/features/candidates/components/CandidateTable";
import { CandidateSidePane } from "@/features/candidates/components/CandidateSidePane";
import { useCandidates } from "@/features/candidates/hooks/use-candidates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: CandidatesRoute });

function CandidatesRoute() {
  const { candidates, selectedId, selected, dispatch, load } = useCandidates();

  return (
    <SidebarProvider>
      <TrackerSidebar />
      <SidebarInset className="min-w-0">
        <CandidatesHeader
          count={candidates.length}
          dispatch={dispatch}
        />
        <div className="flex min-h-0 flex-1 flex-col border-t xl:flex-row">
          <div className={cn("min-w-0 flex-1", selected && "hidden xl:block")}>
            {load.kind === "loading" ? (
              <output className="flex items-center gap-2 p-6">
                <RiLoader4Line className="animate-spin" />
                Loading candidates
              </output>
            ) : null}
            {load.kind === "error" ? (
              <p
                role="alert"
                className="p-6">
                {load.message}
              </p>
            ) : null}
            {load.kind === "ready" ? (
              <CandidateTable
                candidates={candidates}
                selectedId={selectedId}
                dispatch={dispatch}
              />
            ) : null}
          </div>
          {selected ? (
            <CandidateSidePane
              candidate={selected}
              dispatch={dispatch}
            />
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
