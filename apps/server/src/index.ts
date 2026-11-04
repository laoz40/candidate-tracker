import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const webRoot = fileURLToPath(new URL("../../web/dist", import.meta.url));
app.all("/api/*", (c) => c.json({ error: "Not found" }, 404));
app.use("*", serveStatic({ root: webRoot }));
app.get("*", serveStatic({ root: webRoot, path: "index.html" }));

const server = serve({ fetch: app.fetch, port });
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close());
}
