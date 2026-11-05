import { RiFileTextLine } from "@remixicon/react";
import type { Candidate } from "@/features/candidates/lib/candidates";

type CandidateResumeProps = {
  candidate: Pick<Candidate, "resume">;
};

export function CandidateResume({ candidate }: CandidateResumeProps) {
  return (
    <section
      className="flex flex-col gap-3"
      aria-labelledby="resume-heading">
      <h3
        id="resume-heading"
        className="flex items-center gap-2 text-sm font-semibold">
        <RiFileTextLine className="size-4 text-muted-foreground" />
        Resume / cover letter
      </h3>
      <p className="text-sm leading-6 whitespace-pre-line">{candidate.resume}</p>
    </section>
  );
}
