import type { Dispatch } from "react";
import { RiLoader4Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useCandidateNoteForm } from "@/features/candidates/hooks/use-candidate-note-form";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";

type AddCandidateNoteProps = {
  candidateId: string;
  onClose: () => void;
  dispatch: Dispatch<CandidatesAction>;
};

export function AddCandidateNote({ candidateId, dispatch, onClose }: AddCandidateNoteProps) {
  const { form } = useCandidateNoteForm(candidateId, dispatch, onClose);

  return (
    <form
      noValidate
      className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}>
      <FieldGroup>
        <form.Field name="text">
          {(field) => {
            const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor="new-candidate-note">New note</FieldLabel>
                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <Textarea
                      id="new-candidate-note"
                      name={field.name}
                      rows={3}
                      required
                      disabled={isSubmitting}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={invalid}
                      aria-describedby="candidate-note-description candidate-note-error"
                    />
                  )}
                </form.Subscribe>
                <FieldDescription id="candidate-note-description">
                  Saved notes cannot be edited or deleted.
                </FieldDescription>
                {invalid ? (
                  <FieldError
                    id="candidate-note-error"
                    errors={field.state.meta.errors}
                  />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
      <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
        {(errors) => <FieldError errors={Array.isArray(errors) ? errors : []} />}
      </form.Subscribe>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}>
              {isSubmitting ? (
                <RiLoader4Line
                  data-icon="inline-start"
                  className="animate-spin"
                />
              ) : null}
              {isSubmitting ? "Saving" : "Add note"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
