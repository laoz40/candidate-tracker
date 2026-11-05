import { Hono } from "hono";
import { documentRoutes } from "#documents/document.routes";
import { candidateRoutes } from "#candidates/candidate.routes";

export const app = new Hono()
  .get("/api/health", (c) => c.json({ status: "ok" }))
  .route("/api/candidates", candidateRoutes)
  .route("/api/documents", documentRoutes)
  .notFound((c) => c.json({ error: "Not found" }, 404));

export type AppType = typeof app;
