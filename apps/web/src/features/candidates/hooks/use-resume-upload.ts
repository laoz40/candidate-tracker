import { useReducer } from "react";
import { extractDocumentText } from "@/features/candidates/lib/candidates-api";

type UploadState = { kind: "idle" } | { kind: "extracting" } | { kind: "error"; message: string };

export function useResumeUpload(onExtracted: (text: string) => void) {
  const [state, dispatch] = useReducer((_state: UploadState, next: UploadState) => next, {
    kind: "idle",
  });

  async function upload(file: File) {
    dispatch({ kind: "extracting" });

    try {
      const text = await extractDocumentText(file);
      onExtracted(text);
      dispatch({ kind: "idle" });
    } catch (error) {
      dispatch({
        kind: "error",
        message:
          error instanceof Error ? error.message : "Could not extract text. Please try again.",
      });
    }
  }

  return { state, upload };
}
