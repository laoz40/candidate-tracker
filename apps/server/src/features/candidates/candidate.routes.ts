import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { candidateIdSchema, candidateInputSchema } from "#candidates/candidate.schema";
import { candidateService } from "#candidates/candidate.service";

const validateCandidate = zValidator("json", candidateInputSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: "Invalid candidate", issues: result.error.issues }, 400);
  }

  return undefined;
});

export const candidateRoutes = new Hono()
  .get("/", async (c) => {
    return c.json(await candidateService.list());
  })
  .post("/:id/archive", zValidator("param", candidateIdSchema), async (c) => {
    const { id } = c.req.valid("param");
    const candidate = await candidateService.archive(id);

    if (!candidate) return c.json({ error: "Candidate not found" }, 404);

    return c.body(null, 204);
  })
  .post("/", validateCandidate, async (c) => {
    const input = c.req.valid("json");
    const candidate = await candidateService.create(input);

    return c.json(candidate, 201);
  });
