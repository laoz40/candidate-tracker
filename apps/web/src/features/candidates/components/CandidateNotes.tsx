import type { Dispatch } from "react";
import { AddCandidateNote } from "@/features/candidates/components/AddCandidateNote";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";
import { RiChat3Line } from "@remixicon/react";
import { type Candidate } from "@/features/candidates/lib/candidates";

type CandidateNotesProps = {
  dispatch: Dispatch<CandidatesAction>;
  candidate: Pick<Candidate, "id" | "notes">;
};

export function CandidateNotes({ candidate, dispatch }: CandidateNotesProps) {
  return (
    <section
      className="flex flex-col gap-3"
      aria-labelledby="notes-heading">
      <h3
        id="notes-heading"
        className="flex items-center gap-2 text-sm font-semibold">
        <RiChat3Line className="size-4 text-muted-foreground" />
        Notes
      </h3>
      {candidate.notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notes yet.</p>
      ) : (
        candidate.notes.map((note) => (
          <article
            key={note.id}
            className="flex flex-col gap-2">
            <time
              className="text-xs text-muted-foreground"
              dateTime={note.date}>
              {new Intl.DateTimeFormat("en-AU", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(note.date))}
            </time>
            <p className="text-sm leading-6 whitespace-pre-line">{note.text}</p>
          </article>
        ))
      )}
      <AddCandidateNote
        key={candidate.id}
        candidateId={candidate.id}
        dispatch={dispatch}
      />
    </section>
  );
}
