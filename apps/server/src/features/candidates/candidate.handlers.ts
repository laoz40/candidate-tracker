import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { candidateInputSchema } from "#candidates/candidate.schema";
import { candidateService } from "#candidates/candidate.service";

const factory = createFactory();

export const candidateHandlers = {
  list: factory.createHandlers(async (c) => c.json(await candidateService.list())),

  create: factory.createHandlers(
    zValidator("json", candidateInputSchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: "Invalid candidate", issues: result.error.issues }, 400);
      }

      return undefined;
    }),
    async (c) => {
      const candidate = await candidateService.create(c.req.valid("json"));

      return c.json(candidate, 201);
    },
  ),
};
