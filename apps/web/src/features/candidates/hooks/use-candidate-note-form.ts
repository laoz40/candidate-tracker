import type { Dispatch } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { saveCandidateNote } from "@/features/candidates/lib/candidates-api";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";

const noteFormSchema = z.object({
  text: z.string().trim().min(1, "Enter a note."),
});

export function useCandidateNoteForm(
  candidateId: string,
  dispatch: Dispatch<Extract<CandidatesAction, { type: "noteAdded" }>>,
  onSaved: () => void,
) {
  const form = useForm({
    defaultValues: { text: "" },
    validators: { onSubmit: noteFormSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        const note = await saveCandidateNote(candidateId, value.text.trim());
        dispatch({ type: "noteAdded", candidateId, note });
        form.reset();
        onSaved();
      } catch {
        formApi.setErrorMap({
          onSubmit: {
            form: [{ message: "Could not save note. Please try again." }],
            fields: {},
          },
        });
      }
    },
  });

  return { form };
}
