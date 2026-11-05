import { candidateRepository } from "#candidates/candidate.repository";
import type { CandidateInput } from "#candidates/candidate.schema";

export type CandidateStage = "Applied" | "Screening" | "Interview" | "Offer" | "Rejected";

export type CandidateInsert = Pick<CandidateInput, "name" | "email" | "role" | "resume"> & {
  phone: string | null;
  source: string | null;
  note?: string;
};

type CandidateNote = {
  id: string;
  date: Date;
  text: string;
};

type CandidateRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  date: Date;
  stage: CandidateStage;
  source: string | null;
  resume: string;
};

export type CandidateResponse = Omit<CandidateRecord, "date"> & {
  date: string;
  notes: (Omit<CandidateNote, "date"> & { date: string })[];
};

function toCandidateResponse(
  candidate: CandidateRecord,
  notes: CandidateNote[],
): CandidateResponse {
  return {
    ...candidate,
    date: candidate.date.toISOString(),
    notes: notes.map((note) => ({
      id: note.id,
      date: note.date.toISOString(),
      text: note.text,
    })),
  };
}

export const candidateService = {
  list: async (): Promise<CandidateResponse[]> => {
    const candidates = await candidateRepository.list();
    const candidateIds = candidates.map((candidate) => candidate.id);

    const notes = candidateIds.length ? await candidateRepository.listNotes(candidateIds) : [];

    const notesByCandidateId = new Map<string, CandidateNote[]>();

    for (const note of notes) {
      const candidateNotes = notesByCandidateId.get(note.candidateId) ?? [];
      candidateNotes.push(note);
      notesByCandidateId.set(note.candidateId, candidateNotes);
    }

    return candidates.map((candidate) =>
      toCandidateResponse(candidate, notesByCandidateId.get(candidate.id) ?? []),
    );
  },

  changeStage: async (id: string, stage: CandidateStage) => {
    return candidateRepository.changeStage(id, stage);
  },

  archive: async (id: string) => {
    return candidateRepository.archive(id);
  },

  create: async (input: CandidateInput): Promise<CandidateResponse> => {
    const { candidate, notes } = await candidateRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      role: input.role,
      source: input.source || null,
      resume: input.resume,
      note: input.note || undefined,
    });

    return toCandidateResponse(candidate, notes);
  },
};
