import { RiChat3Line } from "@remixicon/react";
import { formatDate, type Candidate } from "@/features/candidates/lib/candidates";

type CandidateNotesProps = {
  candidate: Pick<Candidate, "notes">;
};

export function CandidateNotes({ candidate }: CandidateNotesProps) {
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
              {formatDate(note.date)}
            </time>
            <p className="text-sm leading-6 whitespace-pre-line">{note.text}</p>
          </article>
        ))
      )}
    </section>
  );
}
