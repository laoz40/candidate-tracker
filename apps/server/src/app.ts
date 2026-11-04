import { Hono } from "hono";

export const app = new Hono().get("/api/health", (c) => c.json({ status: "ok" }));
app.notFound((c) => c.json({ error: "Not found" }, 404));
