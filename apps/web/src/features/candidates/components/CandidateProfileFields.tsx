import { formatDate, type Candidate } from "@/features/candidates/lib/candidates";

type CandidateProfileFieldsProps = {
  candidate: Pick<Candidate, "email" | "phone" | "date" | "source">;
};

export function CandidateProfileFields({ candidate }: CandidateProfileFieldsProps) {
  return (
    <dl className="grid grid-cols-4 gap-x-4 gap-y-3 text-sm leading-6">
      <dt className="text-muted-foreground">Email</dt>
      <dd className="col-span-3 break-all">
        <a
          className="underline-offset-4 hover:underline"
          href={`mailto:${candidate.email}`}>
          {candidate.email}
        </a>
      </dd>
      <dt className="text-muted-foreground">Phone</dt>
      <dd className="col-span-3">{candidate.phone ?? "Not provided"}</dd>
      <dt className="text-muted-foreground">Date added</dt>
      <dd className="col-span-3">{formatDate(candidate.date)}</dd>
      <dt className="text-muted-foreground">Source</dt>
      <dd className="col-span-3">{candidate.source ?? "Not provided"}</dd>
    </dl>
  );
}
