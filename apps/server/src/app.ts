import { Hono } from "hono";
import { candidateHandlers } from "#candidates/candidate.handlers";

export const app = new Hono()
  .get("/api/health", (c) => c.json({ status: "ok" }))
  .get("/api/candidates", ...candidateHandlers.list)
  .post("/api/candidates", ...candidateHandlers.create)
  .notFound((c) => c.json({ error: "Not found" }, 404));

export type AppType = typeof app;
