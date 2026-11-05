import { useState, type Dispatch } from "react";
import { useForm } from "@tanstack/react-form";
import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResumeUploadButton } from "@/features/candidates/components/ResumeUploadButton";
import {
  activeRoles,
  candidateFormSchema,
  createCandidate,
  emptyCandidateForm,
} from "@/features/candidates/lib/candidate-form";
import type { CandidatesAction } from "@/features/candidates/lib/candidates-reducer";

const contactFields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone (optional)", type: "tel", required: false },
  {
    name: "source",
    label: "Source (optional)",
    type: "text",
    required: false,
  },
] as const;

export function AddCandidateDialog({ dispatch }: { dispatch: Dispatch<CandidatesAction> }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <RiAddLine data-icon="inline-start" />
        Add candidate
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-11/12 overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add candidate</DialogTitle>
        </DialogHeader>
        {open ? (
          <AddCandidateForm
            dispatch={dispatch}
            onCreated={() => setOpen(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AddCandidateForm({
  dispatch,
  onCreated,
}: {
  dispatch: Dispatch<CandidatesAction>;
  onCreated: () => void;
}) {
  const form = useForm({
    defaultValues: emptyCandidateForm,
    validators: { onBlur: candidateFormSchema, onSubmit: candidateFormSchema },
    onSubmit: ({ value }) => {
      dispatch({
        type: "candidateCreated",
        candidate: createCandidate(candidateFormSchema.parse(value)),
      });
      onCreated();
    },
  });

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-6">
      <FieldGroup>
        <FieldGroup className="grid sm:grid-cols-2">
          {contactFields.map((input) => (
            <form.Field
              key={input.name}
              name={input.name}>
              {(field) => {
                const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={`candidate-${field.name}`}>{input.label}</FieldLabel>
                    <Input
                      id={`candidate-${field.name}`}
                      name={field.name}
                      type={input.type}
                      autoComplete="off"
                      required={input.required}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={invalid}
                      aria-describedby={invalid ? `candidate-${field.name}-error` : undefined}
                    />
                    {invalid ? (
                      <FieldError
                        id={`candidate-${field.name}-error`}
                        errors={field.state.meta.errors}
                      />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>
          ))}
        </FieldGroup>
        <form.Field name="role">
          {(field) => {
            const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor="candidate-role">Role applied for</FieldLabel>
                <Select
                  name={field.name}
                  value={field.state.value || null}
                  onValueChange={(value) => field.handleChange(value ?? "")}>
                  <SelectTrigger
                    id="candidate-role"
                    onBlur={field.handleBlur}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? "candidate-role-error" : undefined}
                    className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {activeRoles.map((role) => (
                        <SelectItem
                          key={role}
                          value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {invalid ? (
                  <FieldError
                    id="candidate-role-error"
                    errors={field.state.meta.errors}
                  />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="resume">
          {(field) => {
            const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={invalid}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <FieldLabel htmlFor="candidate-resume">Resume or cover letter</FieldLabel>
                  <ResumeUploadButton />
                </div>
                <Textarea
                  id="candidate-resume"
                  name={field.name}
                  required
                  rows={6}
                  className="max-h-64 overflow-y-auto"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={invalid}
                  aria-describedby="candidate-resume-description candidate-resume-error"
                />
                <FieldDescription id="candidate-resume-description">
                  Paste up to 50,000 characters.
                </FieldDescription>
                {invalid ? (
                  <FieldError
                    id="candidate-resume-error"
                    errors={field.state.meta.errors}
                  />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="note">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="candidate-note">First note (optional)</FieldLabel>
              <Textarea
                id="candidate-note"
                name={field.name}
                rows={3}
                className="max-h-40 overflow-y-auto"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>
      <DialogFooter>
        <DialogClose
          render={
            <Button
              type="button"
              variant="outline"
            />
          }>
          Cancel
        </DialogClose>
        <Button type="submit">Add candidate</Button>
      </DialogFooter>
    </form>
  );
}
