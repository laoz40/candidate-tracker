import { describe, it } from "node:test";

import { RuleTester } from "oxlint/plugins-dev";

import { focusedRepositoryOperations, noBackendLayerImports } from "#lint/project";

RuleTester.describe = describe;

RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } });
const violation = (messageId) => ({ messageId });

tester.run("project/no-backend-layer-imports", noBackendLayerImports, {
  valid: [
    {
      code: 'type CandidateInput = import("./candidate.service.js").CandidateInput;',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
    },
    {
      code: 'import { db } from "#db"; export const repository = db.select();',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
    },
    {
      code: 'import type { Candidate } from "./candidate.service.js";',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
    },
    {
      code: 'import { candidatesHandler } from "./features/candidates/candidate.handlers.js";',
      filename: "/repo/apps/server/src/app.ts",
    },
    {
      code: 'import { Hono } from "hono"; export const app = new Hono();',
      filename: "/repo/apps/server/src/app.ts",
    },
    {
      code: 'import { Hono } from "hono"; export const app = new Hono();',
      filename: "/repo/apps/server/src/index.ts",
    },
    {
      code: 'import { Hono } from "hono"; export const handlers = new Hono();',
      filename: "/repo/apps/server/src/features/candidates/candidate.handlers.ts",
    },
    {
      code: 'import { db } from "#db";',
      filename: "/repo/apps/server/src/db/index.ts",
    },
    {
      code: 'import { drizzle } from "drizzle-orm/node-postgres"; import pg from "pg";',
      filename: "/repo/apps/server/src/db/client.ts",
    },
    {
      code: 'import { db } from "#db"; export { db };',
      filename: "/repo/apps/server/src/index.ts",
    },
    {
      code: 'import { getCandidate } from "./candidate.service.js";',
      filename: "/repo/apps/server/src/features/candidates/candidate.handlers.ts",
    },
    {
      code: 'import type { CandidateService } from "./candidate.service.js";',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
    },
  ],
  invalid: [
    {
      code: 'import { eq } from "drizzle-orm";',
      filename: "/repo/apps/server/src/features/candidates/candidate.service.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'import "pg";',
      filename: "/repo/apps/server/src/features/candidates/candidate.handlers.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'import type { SQL } from "drizzle-orm";',
      filename: "/repo/apps/server/src/features/candidates/candidate.service.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'export { db } from "#db";',
      filename: "/repo/apps/server/src/features/candidates/candidate.service.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'export * from "pg";',
      filename: "/repo/apps/server/src/features/candidates/candidate.handlers.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'const db = await import("#db");',
      filename: "/repo/apps/server/src/features/candidates/candidate.service.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'const db = require("postgres");',
      filename: "/repo/apps/server/src/features/candidates/candidate.handlers.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'import { db } from "#db";',
      filename: "/repo/apps/server/src/features/candidates/candidate.service.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'import { db } from "../../db/client.js";',
      filename: "/repo/apps/server/src/features/candidates/candidate.service.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'import { candidateHandlers } from "./candidate.handlers.js";',
      filename: "/repo/apps/server/src/features/candidates/candidate.service.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'import type { CandidateHandlers } from "./candidate.handlers.js";',
      filename: "/repo/apps/server/src/features/candidates/candidate.service.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'export { candidateHandlers } from "./candidate.handlers.js";',
      filename: "/repo/apps/server/src/features/candidates/candidate.service.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'await import("./candidate.repository.js");',
      filename: "/repo/apps/server/src/features/candidates/candidate.handlers.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'require("./candidate.repository.js");',
      filename: "/repo/apps/server/src/features/candidates/candidate.handlers.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'import { Hono } from "hono";',
      filename: "/repo/apps/server/src/features/candidates/candidate.service.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'import type { Context } from "hono";',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'import { getCandidate } from "./features/candidates/candidate.service.js";',
      filename: "/repo/apps/server/src/app.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'import { candidateRepository } from "./features/candidates/candidate.repository.js";',
      filename: "/repo/apps/server/src/app.ts",
      errors: [violation("forbidden")],
    },
    {
      code: 'import { Hono } from "hono"; export const app = new Hono();',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
      errors: [violation("forbidden")],
    },
  ],
});

tester.run("project/focused-repository-operations", focusedRepositoryOperations, {
  valid: [
    {
      code: 'import { db } from "#db"; export const repository = { list: async () => db.select(), create: async () => db.transaction(async tx => { await tx.insert(); await tx.insert(); }) };',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
    },
    {
      code: 'import { db } from "#db"; function unrelated(db) { db.select(); db.insert(); }',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
    },
    {
      code: 'import { db } from "#db"; export async function getOne() { return db.select(); }',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
    },
    {
      code: 'import { db as database } from "#db"; export async function getOne() { return database.select(); }',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
    },
    {
      code: 'import { db } from "#db"; export async function updateOne() { return db.transaction(async (tx) => { await tx.update(); await tx.execute(); }); }',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
    },
    {
      code: 'import { db } from "#db"; export async function read() { return db.select(); } export async function write() { return db.insert(); }',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
    },
    {
      code: "export function helper() { return { select() {}, insert() {} }; }",
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
    },
  ],
  invalid: [
    {
      code: 'import { db } from "#db"; export const repository = { list: async () => { const rows = await db.select(); const notes = await db.select(); return {rows, notes}; } };',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
      errors: [violation("multiple")],
    },
    {
      code: 'import { db } from "#db"; export async function save() { await db.select(); await db.insert(); }',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
      errors: [violation("multiple")],
    },
    {
      code: 'import { db as database } from "#db"; export async function save() { await database.update(); await database.delete(); }',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
      errors: [violation("multiple")],
    },
    {
      code: 'import { db } from "#db"; export const candidateRepository = { async save() { await db.insert(); await db.select(); } };',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
      errors: [violation("multiple")],
    },
    {
      code: 'import { db } from "#db"; export async function save() { await db.execute(); await db.transaction(async (tx) => tx.insert()); }',
      filename: "/repo/apps/server/src/features/candidates/candidate.repository.ts",
      errors: [violation("multiple")],
    },
  ],
});
