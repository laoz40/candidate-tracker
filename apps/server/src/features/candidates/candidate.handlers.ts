import type { Context } from "hono";
import { candidateInputSchema } from "#candidates/candidate.schema";
import { candidateService } from "#candidates/candidate.service";

export const candidateHandlers = {
  list: async (c: Context) => {
    return c.json(await candidateService.list());
  },

  create: async (c: Context) => {
    const body: unknown = await c.req.json().catch(() => null);
    const result = candidateInputSchema.safeParse(body);

    if (!result.success) {
      return c.json({ error: "Invalid candidate", issues: result.error.issues }, 400);
    }

    const candidate = await candidateService.create(result.data);

    return c.json(candidate, 201);
  },
};
