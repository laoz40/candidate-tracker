import { RiLoader4Line, RiSparklingLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import type { CandidateSummaryState } from "@/features/candidates/lib/candidate-summary";

type CandidateSummaryProps = {
  state: CandidateSummaryState;
  onGenerate: () => Promise<void>;
};

export function CandidateSummary({ state, onGenerate }: CandidateSummaryProps) {
  return (
    <section
      aria-labelledby="ai-summary-heading"
      aria-busy={state.kind === "generating"}
      className="flex flex-col gap-3 rounded-lg border border-primary/15 bg-primary/5 p-4">
      <h3
        id="ai-summary-heading"
        className="flex items-center gap-2 text-sm font-semibold">
        <RiSparklingLine className="size-4 text-muted-foreground" />
        AI Summary
      </h3>
      {state.kind === "idle" ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-muted-foreground">
            Generate a summary of this candidate's resume.
          </p>
          <Button
            size="sm"
            onClick={() => void onGenerate()}>
            Generate summary
          </Button>
        </div>
      ) : null}
      {state.kind === "generating" ? (
        <output className="flex items-center gap-2 text-sm">
          <RiLoader4Line className="size-4 animate-spin" />
          Generating summary
        </output>
      ) : null}
      {state.kind === "error" ? (
        <div className="flex flex-col items-start gap-3">
          <p
            className="text-sm"
            role="alert">
            {state.message}
          </p>
          <Button
            size="sm"
            onClick={() => void onGenerate()}>
            Retry
          </Button>
        </div>
      ) : null}
      {state.kind === "ready" && state.summary.kind === "insufficient_information" ? (
        <p className="text-sm leading-6">{state.summary.reason}</p>
      ) : null}
      {state.kind === "ready" && state.summary.kind === "summary" ? (
        <div className="flex flex-col gap-3 text-sm leading-6">
          <p>{state.summary.overview}</p>
          {state.summary.skills.length > 0 ? (
            <div>
              <h4 className="font-semibold">Skills</h4>
              <p>{state.summary.skills.join(", ")}</p>
            </div>
          ) : null}
          {state.summary.experienceHighlights.length > 0 ? (
            <div>
              <h4 className="font-semibold">Experience highlights</h4>
              <ul className="list-disc pl-5">
                {state.summary.experienceHighlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
