### Linting

AI output is non-deterministic. Oxlint gives me a deterministic way to define which code and patterns are allowed, making the results more consistent and easier to maintain.

For example, using `@shadcn/lint` plugin constrains the arbitrary classes models tend to add for Tailwind. Custom rules can also ban patterns I don't want, like em dashes in UI text. Having agents run checks after changes and enforcing them in CI means violations must be fixed before checks pass. It also means every rule doesn't need to stay in the agent's context while it works.

### Backend (TypeScript, Hono)

I chose TypeScript so I can develop faster without switching between two languages. It also allows shared types between the frontend and backend. The ecosystem is well supported, and agents work well with it.

Hono makes building the server easier by providing routing and request handling that I'd otherwise need to put together with Node's HTTP APIs. It keeps the Express-style endpoints I prefer while supporting type safety between the frontend and backend. I've used tRPC and oRPC in other projects for type safety, but I prefer the simplicity of Express-style code with traditional REST endpoints. I find it easier to work with than RPC-style handlers.

Type safety matters to me because it catches mistakes and defines what functions and variables accept. Like linting, it limits what agents can do and helps catch incorrect assumptions in the code they produce.
