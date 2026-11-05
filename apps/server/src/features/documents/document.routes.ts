import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { extractPdfText } from "#documents/document.service";
import { z } from "zod";

const PDF_MAX_BYTES = 5 * 1024 * 1024;

const fileSchema = z.object({
  file: z.file().mime("application/pdf").max(PDF_MAX_BYTES),
});

export const documentRoutes = new Hono().post(
  "/extract",
  bodyLimit({
    maxSize: PDF_MAX_BYTES + 64 * 1024,
    onError: (c) => c.json({ error: "PDF file is too large" }, 413),
  }),
  zValidator("form", fileSchema, (result, c) => {
    if (!result.success) return c.json({ error: "Select a PDF file within the size limit" }, 400);

    return undefined;
  }),
  async (c) => {
    const file = c.req.valid("form").file;
    const result = await extractPdfText(file);

    if ("error" in result) return c.json(result, 400);

    return c.json(result);
  },
);
