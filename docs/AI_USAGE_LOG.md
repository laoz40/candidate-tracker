# AI usage log

## Simplifying candidate row clicks

AI added three checks to work out what was clicked before opening the candidate pane. These weren't needed because clicking anything inside a row also triggers the row's click handler.

All that was needed was a click handler on the row and `stopPropagation()` on the table cell containing the dropdown button. This stops dropdown clicks from also opening the pane.

Code: `apps/web/src/features/candidates/components/CandidateTable.tsx`.

## Removing unnecessary dispatch wrappers

Candidate state is managed with React's `useReducer`. AI introduced callback props that only wrapped its `dispatch` function and passed them through components. I changed these components to receive typed `dispatch` directly and dispatch actions where the interaction occurs.

When AI repeated this pattern in the add-candidate form, I also updated `AGENTS.md` to prevent it in future runs. This improves the agent's working environment and addresses the recurring cause instead of fixing each occurrence separately.

Code: `apps/web/src/routes/index.tsx`, `apps/web/src/features/candidates/components/AddCandidateDialog.tsx`, and `AGENTS.md`.

## Separating backend responsibilities

AI initially put candidate validation, database queries, and response formatting in `apps/server/src/app.ts`. Keeping everything in one file would make it harder to maintain as the app grew. I asked AI to separate the code into service and repository layers. Its first attempt moved too much logic into the repository, so I corrected that separation too.

I wanted high-level code that clearly expressed the application logic, with implementation details kept in focused functions. This makes each part easier to read, change, and refactor. It also helps agents work with less context. Keeping database queries behind repository functions limits the changes needed elsewhere if I replace the database or ORM.

I then added two lint rules to enforce this structure. `no-backend-layer-imports` blocks imports that cross the intended boundaries, such as handlers accessing the repository directly or services importing database code. `focused-repository-operations` flags repository functions that combine independent database operations, while allowing writes that must succeed together in a transaction. These checks catch the patterns automatically instead of relying on repeated instructions to agents.

Code: `apps/server/src/app.ts` and `apps/server/src/features/candidates/`. Lint rules: `tools/oxlint/project.mjs` and `.oxlintrc.json`.

## Splitting candidate state by concern

AI kept adding features to the same candidate reducer until it became large, mixed several responsibilities, and hit the cyclomatic complexity limit. It then extracted `closeCandidatePane` into a helper to pass the lint check, leaving the underlying structure unchanged.

I split the reducer into candidate list state, mutation progress, and pane selection. Each reducer now handles a focused concern, making the code easier to read and maintain.

Code: `apps/web/src/features/candidates/lib/candidates-reducer.ts` and the three concern reducers.
