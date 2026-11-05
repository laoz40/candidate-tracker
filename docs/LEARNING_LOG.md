## Learning Hono

This was my first project using Hono. I had used Express, tRPC, oRPC, and Convex before, so the backend concepts were familiar. I had been interested in Hono for a while but hadn't had the chance to use it in a new project. My reasons for choosing it are recorded in the [backend design choices](DESIGN_CHOICES.md#backend-typescript-hono).

I used the documentation to understand how Hono differs from Express. I found it clear, and the developer experience made Hono easy to pick up. I didn't encounter any particular difficulties.

The validation documentation recommended using a third-party validator such as Zod. Since I already planned to use Zod, I used its Hono validator middleware to connect my schemas to request validation.

I initially organised the code my own way because I thought it would make more sense to me, but I ended up making it harder to follow. Reading Hono's [best practices](https://hono.dev/docs/guides/best-practices) helped me recognise that mistake and move the handlers beside their route definitions. My previous approach preserved type inference through `factory.createHandlers()`, but my organisation added unnecessary complexity. I should have followed the best practices from the beginning.

When using Hono or any new tool, I recommend reading the best practices in its official documentation, if available, to save time and reduce errors and poor code.

## Learning Vercel AI SDK

This is my first time integrating an AI feature, and I had not used an AI SDK before. Before starting, I read the Vercel AI SDK documentation and researched alternatives, including TanStack AI and the SDKs from providers such as OpenAI and Anthropic.

### Error handling and schema compatibility

During development, a summary request failed, but the app only returned "Could not generate summary." The project brief put exhaustive error handling outside scope, and the short timeframe influenced my decision to start with a broad try/catch. I normally use exhaustive Result-type error handling in my projects.

The generic response left me unable to diagnose the failure. I decided to improve error handling in this module so provider errors would be available for diagnosis.

The underlying issue was the JSON Schema produced from our Zod schema. OpenAI rejected its nested `oneOf` before generating a response. Changing `z.discriminatedUnion` to `z.union` produced a supported schema and fixed the request.

Useful diagnostics earlier would have avoided confusion, although they would not have prevented the schema bug itself.

I hadn't realised that `strictJsonSchema` defaults to `true` for OpenAI requests through `generateText`. I skimmed past the documentation's warning about supported schema limitations. This taught me to read the provider-specific constraints alongside the SDK examples.
