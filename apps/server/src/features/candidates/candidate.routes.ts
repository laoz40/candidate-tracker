import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  candidateIdSchema,
  candidateInputSchema,
  candidateNoteInputSchema,
} from "#candidates/candidate.schema";
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
  .post("/", validateCandidate, async (c) => {
    const input = c.req.valid("json");
    const candidate = await candidateService.create(input);

    return c.json(candidate, 201);
  })
  .post(
    "/:id/notes",
    zValidator("param", candidateIdSchema),
    zValidator("json", candidateNoteInputSchema),
    async (c) => {
      const note = await candidateService.addNote(
        c.req.valid("param").id,
        c.req.valid("json").text,
      );

      if (!note) return c.json({ error: "Candidate not found" }, 404);

      return c.json(note, 201);
    },
  );
