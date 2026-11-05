import { asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "#db";
import { candidateNotes, candidates } from "#schema";
import type { CandidateInsert } from "#candidates/candidate.service";

export const candidateRepository = {
  list: async () => {
    return db
      .select()
      .from(candidates)
      .where(eq(candidates.archived, false))
      .orderBy(desc(candidates.date), desc(candidates.id));
  },

  archive: async (id: string) => {
    const [candidate] = await db
      .update(candidates)
      .set({ archived: true })
      .where(eq(candidates.id, id))
      .returning({ id: candidates.id });

    return candidate;
  },

  listNotes: async (candidateIds: string[]) => {
    return db
      .select()
      .from(candidateNotes)
      .where(inArray(candidateNotes.candidateId, candidateIds))
      .orderBy(asc(candidateNotes.date), asc(candidateNotes.id));
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
