import { APICallError, NoObjectGeneratedError, NoOutputGeneratedError } from "ai";
import { z } from "zod";
import { DOCUMENT_MIN_CHARACTERS, DOCUMENT_MAX_CHARACTERS } from "#documents/document-limits";

export class SummaryConfigurationError extends Error {
  constructor() {
    super("Summary generation requires OPENAI_API_KEY to be configured");
    this.name = "SummaryConfigurationError";
  }
}

export function describeSummaryError(error: Error) {
  if (error instanceof SummaryConfigurationError) {
    return { status: 503, code: "not_configured", message: error.message } as const;
  }

  if (error instanceof z.ZodError) {
    return {
      status: 422,
      code: "invalid_resume",
      message: `Resume text must contain between ${DOCUMENT_MIN_CHARACTERS} and ${DOCUMENT_MAX_CHARACTERS} characters after trimming whitespace.`,
    } as const;
  }

  if (APICallError.isInstance(error)) {
    return {
      status: 502,
      code: "provider_error",
      message: `OpenAI rejected or failed the summary request (HTTP ${error.statusCode ?? "unknown"}).`,
      providerStatus: error.statusCode,
      diagnostic: error.message,
    } as const;
  }

  if (NoObjectGeneratedError.isInstance(error) || NoOutputGeneratedError.isInstance(error)) {
    return {
      status: 502,
      code: "invalid_output",
      message: "The model did not return a valid structured summary. Try again.",
    } as const;
  }

  if (error.name === "TimeoutError" || error.name === "AbortError") {
    return {
      status: 504,
      code: "timeout",
      message: "Summary generation timed out. Try again.",
    } as const;
  }

  return {
    status: 500,
    code: "unexpected_error",
    message: "An unexpected error prevented summary generation.",
  } as const;
}
