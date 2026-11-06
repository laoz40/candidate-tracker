# AI usage log

## Separating backend responsibilities

AI initially kept putting candidate validation, database queries, and response formatting in [`apps/server/src/app.ts`](../apps/server/src/app.ts). Putting everything in one file would make it harder to maintain as the app grew. I asked AI to separate the code into service and repository layers. Its first attempt moved too much logic into the repository, so I corrected that separation too.

I wanted high-level code that clearly expressed the application logic, with implementation details kept in focused functions. This makes each part easier to read and change if needed. Keeping database queries abstracted limits the changes needed elsewhere if I replace the database or ORM. It can also keep less in the agents context.

I then added two lint rules to enforce this structure. `no-backend-layer-imports` blocks imports that cross the intended boundaries, such as handlers accessing the repository directly or services importing database code. `focused-repository-operations` flags repository functions that combine independent database operations, while allowing writes that must succeed together in a transaction. These checks catch the patterns automatically instead of relying on repeated instructions to agents.

Code: [`apps/server/src/app.ts`](../apps/server/src/app.ts) and [`apps/server/src/features/candidates/`](../apps/server/src/features/candidates). Lint rules: [`tools/oxlint/project.mjs`](../tools/oxlint/project.mjs) and [`.oxlintrc.json`](../.oxlintrc.json).

## Reuse TanStack Form's error handling

I corrected the AI's use of separate `submitError` state in [`use-candidate-note-form.ts`](../apps/web/src/features/candidates/hooks/use-candidate-note-form.ts). I was familiar with TanStack Form and recognised that it already provides submission error handling. The updated code uses `formApi.setErrorMap`.

In future, review AI code against the library's existing APIs, especially with newer libraries, to avoid unnecessary custom state or logic.

## Splitting candidate state by concern

AI kept adding features to the same candidate reducer until it became large, mixed several responsibilities, and hit the cyclomatic complexity limit. It then extracted `closeCandidatePane` into a helper to pass the lint check, leaving the underlying structure unchanged.

I split the reducer into candidate list state, mutation progress, and pane selection. Each reducer now handles a focused concern, making the code easier to read and maintain.

Code: [`apps/web/src/features/candidates/lib/candidates-reducer.ts`](../apps/web/src/features/candidates/lib/candidates-reducer.ts) and the three concern reducers.

## Reusing existing constants and functions

When I asked AI to remove a separate constants file, it defined `DOCUMENT_MAX_CHARACTERS = 50_000` in both the document service and candidate validation schema. I corrected this to keep one exported definition and import it where needed.

Duplicating a shared rule means remembering to update every copy. Missing one could make PDF extraction and candidate validation enforce different limits. This is a pattern I watch for in AI code: creating another constant or function instead of reusing what already exists.

Code: [`apps/server/src/features/documents/document.service.ts`](../apps/server/src/features/documents/document.service.ts) and [`apps/server/src/features/candidates/candidate.schema.ts`](../apps/server/src/features/candidates/candidate.schema.ts).

## Removing unnecessary dispatch wrappers

Candidate state is managed with React's `useReducer`. AI introduced callback props that only wrapped its `dispatch` function and passed them through components. I changed these components to receive typed `dispatch` directly and dispatch actions where the interaction occurs.

When AI repeated this pattern in the add-candidate form, I also updated [`AGENTS.md`](../AGENTS.md) to prevent it in future runs. This improves the agent's working environment and addresses the recurring cause instead of fixing each occurrence separately.

Code: [`apps/web/src/routes/index.tsx`](../apps/web/src/routes/index.tsx), [`apps/web/src/features/candidates/components/AddCandidateDialog.tsx`](../apps/web/src/features/candidates/components/AddCandidateDialog.tsx), and [`AGENTS.md`](../AGENTS.md).

