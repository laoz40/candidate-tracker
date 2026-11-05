# Candidate Tracker with AI-assisted feature

A mini applicant tracking system that manages candidates moving through a hiring pipeline.

This is an assessment task. What will seperate my project from the rest is:

- how I structure it
- the decisions I make (and how I communicate them)
- how sensibly I integrate the AI feature

## When to offer reflection

- Before significant feature/scope decisions or adopting a library, framework, tool, or AI provider, offer to ask about my rationale, alternatives, and tradeoffs.
- When I correct, reject, or rewrite AI code, offer to capture the original suggestion, my change, and why I made it, with a concrete code/file reference.
- For unfamiliar technology, ask what is new to me, what I read or tried, what confused me, and what I learned. Do not assume my experience.
- Skip routine implementation details and already captured decisions. If I decline or defer, continue the task.

### Reflection workflow

1. Offer to do the reflection in separate thread and create it only if I accept. Pass only the relevant decision/code, brief requirements, destination file, and these approval rules. If unavailable, offer to ask here.
2. Ask questions, then draft an entry from my answers. Never invent my reasoning, experience, or outcomes.
3. Show me the exact proposed text and destination. Wait for my explicit approval before creating or editing any written deliverable.

### Destinations

- `docs/DESIGN_CHOICES.md`: decisions, alternatives, tradeoffs, AI prompt/API design, and future work.
- `docs/AI_USAGE_LOG.md`: specific AI corrections, rejections, or rewrites.
- `docs/LEARNING_LOG.md`: unfamiliar component, sources, confusion, lessons, and advice for the next engineer.
- `docs/DEPLOYMENT_DESIGN.md`: one page with named cloud services, architecture, and a rough monthly cost range.

## Agent Behaviour

### Code maintanability

- When adding a new feature, always avoid feature creep and over-engineering
    - Reach for the simplest thing that works
    - Suggest issues from edge cases before you implement fixes for them or build for hypothetical futures.
    - Do not assume backwards compatibility, migrations, or backfills are needed. Check if the feature is actually in the main branch already
    - Make sure not to write low value tests that don't relate to the core behaviour
    - Make sure not to add unecessary fields to the db schema
- Use YAGNI and DRY principles
- Writing code is cheap for you, which makes over-engineering easy.
- Counter it by borrowing a human maintainer's fatigue. Aim for the most result with the least code and complexity.
- If a human developer would find the code exhausting to maintain, it is a bad solution. Be lazy. Stay simple.

- Never use oxlint ignore comments to bypass the linter; fix or restructure instead.

### React

- This project uses React Compiler for automatic memoization. Avoid manual `useMemo` and `useCallback` unless there is a specific need.
- Keep React components focused on rendering and user interactions.
- Pass `useReducer`'s typed `dispatch` directly; avoid callback props that only wrap it.
- Prefer useReducer for related state and centralized transitions rather than scattering state and business logic across React components
- Extract data fetching, reusable stateful logic, and external synchronisation into appropriately scoped hooks or modules.
- Prefer derived state and event handlers over effects.
- Only introduce effects when synchronising with external systems, and avoid abstractions that merely hide unnecessary effects.

- Extract major or self-contained UI sections into separate component files.
- Use `PascalCase.tsx` for React component files and `PascalCase` for type names.

### TypeScript

- Reject nested `if` statements.
- Use discriminated unions for app state so boolean flags and optional fields cannot allow invalid combinations.
- Parse boundary data once with Zod.
- Express internal contracts with types instead of untyped dictionaries or redundant runtime checks.

### Tailwind

- Loading states need an animated spinner icon and a concise label such as `Saving`, without trailing ellipses.

### Comments

- Do not add comments unless asked

