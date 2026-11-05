import { type Dispatch, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddCandidateNote } from "@/features/candidates/components/AddCandidateNote";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";
import { RiChat3Line } from "@remixicon/react";
import { type Candidate } from "@/features/candidates/lib/candidates";

type CandidateNotesProps = {
  dispatch: Dispatch<Extract<CandidatesAction, { type: "noteAdded" }>>;
  candidate: Pick<Candidate, "id" | "notes">;
};

export function CandidateNotes({ candidate, dispatch }: CandidateNotesProps) {
  const [composer, setComposer] = useState<"closed" | "open">("closed");

  return (
    <section
      className="flex flex-col gap-3"
      aria-labelledby="notes-heading">
      <div className="flex items-center justify-between gap-3">
        <h3
          id="notes-heading"
          className="flex items-center gap-2 text-sm font-semibold">
          <RiChat3Line className="size-4 text-muted-foreground" />
          Notes
        </h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={composer === "open"}
          aria-expanded={composer === "open"}
          onClick={() => setComposer("open")}>
          Create note
        </Button>
      </div>
      {candidate.notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notes yet.</p>
      ) : (
        candidate.notes.map((note) => (
          <article
            key={note.id}
            className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
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
      {composer === "open" ? (
        <AddCandidateNote
          key={candidate.id}
          candidateId={candidate.id}
          dispatch={dispatch}
          onClose={() => setComposer("closed")}
        />
      ) : null}
    </section>
  );
}
