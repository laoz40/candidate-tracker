import { boolean, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { Summary } from "#ai/summary.schema";

export const candidateStage = pgEnum("candidate_stage", [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
]);

export const candidates = pgTable("candidates", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  phone: text(),
  role: text().notNull(),
  date: timestamp({ withTimezone: true }).defaultNow().notNull(),
  stage: candidateStage().default("Applied").notNull(),
  source: text(),
  resume: text().notNull(),
  summary: jsonb().$type<Summary>(),
  archived: boolean().default(false).notNull(),
});

export const candidateNotes = pgTable("candidate_notes", {
  id: uuid().defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id")
    .references(() => candidates.id)
    .notNull(),
  date: timestamp({ withTimezone: true }).defaultNow().notNull(),
  text: text().notNull(),
});
