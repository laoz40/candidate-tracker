import { candidateRepository } from "#candidates/candidate.repository";
import { generateSummary } from "#ai/summary.service";
import type { Summary } from "#ai/summary.schema";
import type { CandidateInput, CandidateListQuery } from "#candidates/candidate.schema";

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
  summary: Summary | null;
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

const activeSummaries = new Map<string, Promise<Summary | undefined>>();

async function generateSavedSummary(candidateId: string) {
  const candidate = await candidateRepository.findSummaryInputById(candidateId);

  if (!candidate) return undefined;

  if (candidate.summary) return candidate.summary;

  const summary = await generateSummary(candidate.resume);

  return candidateRepository.saveSummary(candidateId, summary);
}

export const candidateService = {
  generateSummary: async (candidateId: string) => {
    const active = activeSummaries.get(candidateId);

    if (active) return active;

    const pending = generateSavedSummary(candidateId);
    activeSummaries.set(candidateId, pending);

    try {
      return await pending;
    } finally {
      activeSummaries.delete(candidateId);
    }
  },
  addNote: async (candidateId: string, text: string) => {
    const candidate = await candidateRepository.findById(candidateId);

    if (!candidate) return undefined;

    const note = await candidateRepository.addNote(candidateId, text);

    return { id: note.id, date: note.date.toISOString(), text: note.text };
  },

  list: async (query: CandidateListQuery): Promise<CandidateResponse[]> => {
    const candidates = await candidateRepository.list(query);
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
