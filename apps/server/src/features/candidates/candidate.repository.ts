import { asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "#db";
import { candidateNotes, candidates } from "#schema";
import type { CandidateInsert } from "#candidates/candidate.service";

export const candidateRepository = {
  list: async () => {
    return db.select().from(candidates).orderBy(desc(candidates.date), desc(candidates.id));
  },

  listNotes: async (candidateIds: string[]) => {
    return db
      .select()
      .from(candidateNotes)
      .where(inArray(candidateNotes.candidateId, candidateIds))
      .orderBy(asc(candidateNotes.date), asc(candidateNotes.id));
  },

  findById: async (id: string) => {
    const [candidate] = await db
      .select({ id: candidates.id })
      .from(candidates)
      .where(eq(candidates.id, id));

    return candidate;
  },

  addNote: async (candidateId: string, text: string) => {
    const [note] = await db.insert(candidateNotes).values({ candidateId, text }).returning();

    if (!note) throw new Error("Note insert returned no row");

    return note;
  },

  create: async (input: CandidateInsert) => {
    return db.transaction(async (tx) => {
      const [candidate] = await tx
        .insert(candidates)
        .values({
          name: input.name,
          email: input.email,
          phone: input.phone,
          role: input.role,
          source: input.source,
          resume: input.resume,
        })
        .returning();

      if (!candidate) {
        throw new Error("Candidate insert returned no row");
      }

      const notes = input.note
        ? await tx
            .insert(candidateNotes)
            .values({ candidateId: candidate.id, text: input.note })
            .returning()
        : [];

      return { candidate, notes };
    });
  },
};
