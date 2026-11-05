# Design Choices

## Frontend (React)

I chose React because I'm comfortable with it and understand its good practices. I've used other JavaScript frameworks and enjoy some of them more, but React's large ecosystem is hard to pass up. Its widespread use should also make it easier to onboard other developers if the project grows. I also expect AI agents to work well with React because there are so many public examples and established patterns.

## Validation (Zod)

I chose Zod because it lets me define validation rules in schemas instead of writing the validation logic manually. It integrates well with other libraries and works in both the frontend and backend, allowing schemas to be shared where the validation requirements match. It also lets me infer TypeScript types from those schemas, keeping validation rules and types in sync while reducing duplication.

## Linting

AI output is non-deterministic. Oxlint gives me a deterministic way to define which code and patterns are allowed, making the results more consistent and easier to maintain.

For example, using `@shadcn/lint` plugin constrains the arbitrary classes models tend to add for Tailwind. Custom rules can also ban patterns I don't want, like em dashes in UI text. Having agents run checks after changes and enforcing them in CI means violations must be fixed before checks pass. It also means every rule doesn't need to stay in the agent's context while it works.

## Backend (TypeScript, Hono)

I chose TypeScript so I can develop faster without switching between two languages. It also allows shared types between the frontend and backend. The ecosystem is well supported, and agents work well with it.

I chose Hono because I prefer its Express-style routing and request handlers. I've used tRPC and oRPC in other projects, but I find traditional REST endpoints easier to work with. Hono's typed client lets the frontend infer request and response types from the backend routes, so I can keep that style while retaining type safety across the API. Hono also handles routing and request handling that I'd otherwise need to build with Node's HTTP APIs. It supports multiple runtimes, including Node.js, Bun, and Cloudflare Workers, which gives me flexibility to change where the backend runs if needed.

Type safety matters to me because it catches mistakes and defines what functions and variables accept. Like linting, it limits what agents can do and helps catch incorrect assumptions in the code they produce.
