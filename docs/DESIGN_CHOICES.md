# Design Choices

## Frontend (React)

I chose React because I'm comfortable with it and understand its good practices. I've used other JavaScript frameworks and enjoy some of them more, but React's large ecosystem is hard to pass up. Its widespread use should also make it easier to onboard other developers if the project grows. I also expect AI agents to work well with React because there are so many public examples and established patterns.

## Backend (TypeScript, Hono)

I chose TypeScript so I can develop faster without switching between two languages. It also allows shared types between the frontend and backend. The ecosystem is well supported, and agents work well with it.

I chose Hono because it handles routing and requests that I'd otherwise need to build with Node's HTTP APIs. It supports multiple runtimes, including Node.js, Bun, and Cloudflare Workers, giving me flexibility to change where the backend runs if needed. Hono also combines the Express-style REST handlers I prefer with a typed client that can infer request and response types from the backend routes. This lets me keep type safety across the API without adopting the RPC approach I've used with tRPC and oRPC in other projects.

Type safety matters to me because it catches mistakes and defines what functions and variables accept. Like linting, it limits what agents can do and helps catch incorrect assumptions in the code they produce.

## Linting

AI output is non-deterministic. I use linting to turn coding expectations into automatic checks, catching patterns that models tend to produce but that I don't want in this project. This reduces reliance on agents remembering every instruction. Agents run the checks after changes, and the same checks could run before merging if CI were added.

I limit cyclomatic complexity to 12 to discourage functions with too many branches. Limits on nesting and statement counts also help prevent large functions that do too much. The aim is to keep functions small, focused, and easier to read and maintain.

Other rules address recurring AI patterns directly. The `@shadcn/lint` plugin restricts arbitrary Tailwind styling. Custom rules enforce backend responsibilities and prevent repository functions from combining independent database operations. When I identify an unwanted pattern, I try to design a lint rule to prevent it from happening again.

I chose Oxlint for its speed and support for ESLint-compatible plugins.

## Validation (Zod)

I chose Zod because it lets me define validation rules in schemas instead of writing the validation logic manually. It integrates well with other libraries and works in both the frontend and backend, allowing schemas to be shared where the validation requirements match. It also lets me infer TypeScript types from those schemas, keeping validation rules and types in sync while reducing duplication.
