import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeSummaryError } from "#ai/summary.error";
import {
  candidateIdSchema,
  candidateInputSchema,
  candidateNoteInputSchema,
  candidateListSchema,
  candidateStageInputSchema,
} from "#candidates/candidate.schema";
import { candidateService } from "#candidates/candidate.service";

const validateCandidate = zValidator("json", candidateInputSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: "Invalid candidate", issues: result.error.issues }, 400);
  }

  return undefined;
});

export const candidateRoutes = new Hono()
  .post("/:id/summary", zValidator("param", candidateIdSchema), async (c) => {
    try {
      const summary = await candidateService.generateSummary(c.req.valid("param").id);

      if (!summary) return c.json({ error: "Candidate not found" }, 404);

      return c.json(summary);
    } catch (error) {
      const failure = describeSummaryError(
        error instanceof Error ? error : new Error("Unknown summary failure"),
      );

      console.error("Candidate summary generation failed", {
        candidateId: c.req.valid("param").id,
        ...failure,
      });

      return c.json(
        {
          error: `${failure.message} The candidate is still saved.`,
          code: failure.code,
          details:
            failure.code === "provider_error" && process.env.NODE_ENV !== "production"
              ? failure.diagnostic
              : undefined,
        },
        failure.status,
      );
    }
  })
  .get("/", zValidator("query", candidateListSchema), async (c) => {
    return c.json(await candidateService.list(c.req.valid("query")));
  })
  .patch(
    "/:id/stage",
    zValidator("param", candidateIdSchema),
    zValidator("json", candidateStageInputSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { stage } = c.req.valid("json");
      const candidate = await candidateService.changeStage(id, stage);

      if (!candidate) return c.json({ error: "Candidate not found" }, 404);

      return c.json(candidate);
    },
  )
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
