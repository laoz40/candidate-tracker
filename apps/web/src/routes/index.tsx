import { RiLoader4Line } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CandidateListControls } from "@/features/candidates/components/CandidateListControls";
import { CandidatesHeader } from "@/features/candidates/components/CandidatesHeader";
import { TrackerSidebar } from "@/components/TrackerSidebar";
import { CandidateTable } from "@/features/candidates/components/CandidateTable";
import { CandidateSidePane } from "@/features/candidates/components/CandidateSidePane";
import { useCandidates } from "@/features/candidates/hooks/use-candidates";
import { z } from "zod";
import { stages } from "@/features/candidates/lib/candidates";
import { cn } from "@/lib/utils";

const candidateSearchSchema = z.object({
  archived: z.enum(["true", "false"]).catch("false"),
  stage: z.enum(stages).optional().catch(undefined),
  role: z.string().trim().min(1).optional().catch(undefined),
  sort: z.enum(["newest", "oldest", "stage"]).catch("newest"),
});

export const Route = createFileRoute("/")({
  component: CandidatesRoute,
  validateSearch: candidateSearchSchema,
});

function CandidatesRoute() {
  const search = Route.useSearch();

  const filters = {
    stage: search.stage ?? null,
    role: search.role ?? null,
    sort: search.sort,
    archived: search.archived,
  };

  const {
    candidates,
    roles,
    selectedId,
    selected,
    dispatch,
    load,
    archiveState,
    archive,
    stageChangeState,
    changeStage,
    summaryState,
    generateSummary,
  } = useCandidates(filters);

  return (
    <SidebarProvider>
      <TrackerSidebar />
      <SidebarInset className="min-w-0">
        <CandidatesHeader
          count={candidates.length}
          dispatch={dispatch}
        />
        <CandidateListControls
          filters={filters}
          roles={roles}
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
                filtered={filters.stage !== null || filters.role !== null}
                selectedId={selectedId}
                stageChangeState={stageChangeState}
                onStageChange={changeStage}
                dispatch={dispatch}
              />
            ) : null}
          </div>
          {selected ? (
            <CandidateSidePane
              candidate={selected}
              summaryState={summaryState}
              onGenerateSummary={generateSummary}
              archiveState={archiveState}
              stageChangeState={stageChangeState}
              onStageChange={changeStage}
              onArchive={archive}
              dispatch={dispatch}
            />
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
