import "dotenv/config";
import { z } from "zod";

export const env = z
  .object({
    OPENAI_API_KEY: z.string().trim().min(1).optional(),
    DATABASE_URL: z.url().refine((value) => {
      const protocol = new URL(value).protocol;

      return protocol === "postgres:" || protocol === "postgresql:";
    }, "DATABASE_URL must use postgres:// or postgresql://"),
  })
  .parse(process.env);
