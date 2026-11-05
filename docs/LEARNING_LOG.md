## Learning Hono

This was my first project using Hono. I had used Express, tRPC, oRPC, and Convex before, so the backend concepts were familiar. I had been interested in Hono for a while but hadn't had the chance to use it in a new project. My reasons for choosing it are recorded in the [backend design choices](DESIGN_CHOICES.md#backend-typescript-hono).

I used the documentation to understand how Hono differs from Express. I found it clear, and the developer experience made Hono easy to pick up. I didn't encounter any particular difficulties.

The validation documentation recommended using a third-party validator such as Zod. Since I already planned to use Zod, I used its Hono validator middleware to connect my schemas to request validation.

I initially organised the code my own way because I thought it would make more sense to me, but I ended up making it harder to follow. Reading Hono's [best practices](https://hono.dev/docs/guides/best-practices) helped me recognise that mistake and move the handlers beside their route definitions. My previous approach preserved type inference through `factory.createHandlers()`, but my organisation added unnecessary complexity. I should have followed the best practices from the beginning.

When using Hono or any new tool, I recommend reading the best practices in its official documentation, if available, to save time and reduce errors and poor code.
