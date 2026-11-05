import { createOpenAI } from "@ai-sdk/openai";
import { env } from "#env";

export function getSummaryModel() {
  if (!env.OPENAI_API_KEY) {
    throw new Error("Summary generation requires OPENAI_API_KEY to be configured");
  }

  const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });

  return openai("gpt-6-luna");
}
