# AI usage log

## Simplifying candidate row clicks

AI added three checks to work out what was clicked before opening the candidate pane. These weren't needed because clicking anything inside a row also triggers the row's click handler.

All that was needed was a click handler on the row and `stopPropagation()` on the table cell containing the dropdown button. This stops dropdown clicks from also opening the pane.

Code: `apps/web/src/features/candidates/components/CandidateTable.tsx`.

## Removing unnecessary dispatch wrappers

Candidate state is managed with React's `useReducer`. AI introduced callback props that only wrapped its `dispatch` function and passed them through components. I changed these components to receive typed `dispatch` directly and dispatch actions where the interaction occurs.

When AI repeated this pattern in the add-candidate form, I also updated `AGENTS.md` to prevent it in future runs. This improves the agent's working environment and addresses the recurring cause instead of fixing each occurrence separately.

Code: `apps/web/src/routes/index.tsx`, `apps/web/src/features/candidates/components/AddCandidateDialog.tsx`, and `AGENTS.md`.
