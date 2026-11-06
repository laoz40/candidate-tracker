# Deployment design

## Expected usage

I assume this would be a low-traffic internal tool. Recruiters would manage candidates rather than applicants submitting directly through it, so high concurrent traffic is unlikely initially. Actual usage would depend on the company.

## Application and database

I would deploy the frontend and backend together in one container. The Node server already serves both, so separate hosting would add configuration without a clear benefit. Keeping them together also avoids cross-origin configuration.

PostgreSQL would run separately through a managed database service. This means I could replace or scale application containers without replacing their stored data. The provider would maintain the database infrastructure, while I would manage access, backup settings and schema changes.

## Deployment options

### Serverless functions

Options include AWS Lambda, Azure Functions and Cloud Run functions.

#### Pros

- The provider handles execution and scaling, so I would not need to maintain servers.
- Occasional requests can be inexpensive because compute does not need to run continuously.

#### Cons

- Some function deployments require adapting how the server starts and receives requests. Hono supports this, but it introduces deployment setup.
- Requests after inactivity can take longer. That is acceptable here because it would mainly delay loading the initial candidate list.
- More simultaneous executions can open more database connections, so scaling needs limits.

Functions could work, but I prefer deploying the existing HTTP server with its runtime and dependencies packaged together. Functions can also support containers, so this is a preference for the deployment approach rather than a limitation of functions.

### Managed containers

Options include Google Cloud Run, Azure Container Apps and AWS ECS on Fargate.

#### Pros

- I can package Node, the backend, the built frontend and PDF parser dependencies in one image. This keeps deployment close to how the application runs locally.
- The provider maintains the underlying servers, leaving me to maintain the application.
- If usage grows, I can run more copies without immediately introducing separate services.

#### Cons

- Updating Node or a dependency requires building and deploying a new image. CI could automate this after running the project checks.
- More containers can create more database connections and AI requests. I would limit scaling to what those services can handle.
- Scaling to zero reduces idle costs but slows the first request after inactivity. I would accept that tradeoff for this internal tool.

I would choose managed containers because they fit the current application without adding server administration. There is no current requirement for queues or workers, so summary generation would remain synchronous with explicit retries.

### Managing infrastructure directly

This includes configuring virtual machines and supporting infrastructure, with or without automation.

#### Pros

- More control over server sizes, networking and resource sharing could help optimise costs once actual usage is understood.

#### Cons

- Configuration, patching, monitoring and recovery create more responsibilities and maintenance work.
- A lower infrastructure bill may not justify that work for a small internal tool.

I would consider this approach when measured costs or specific requirements make the extra control worthwhile.

## Proposed services

### Google Cloud Run

I would use Cloud Run to host the application container. It provides HTTPS, request routing and automatic scaling without configuring a separate load balancer.

I prefer it over a conventional ECS/Fargate setup because fewer infrastructure components need configuring. Compared with Azure Container Apps, Cloud Run does not require a separate Container Apps environment for shared networking and application settings. For one HTTP service, I would choose that simpler service-level setup. Its documented Cloud SQL connection also gives me a clear path for connecting PostgreSQL.

### Cloud SQL for PostgreSQL

I would keep PostgreSQL on the same cloud as the application. This keeps billing and access configuration together and avoids setting up connectivity between cloud providers.

### Existing OpenAI API

The application currently calls OpenAI directly. Vercel AI SDK keeps this flexible, so switching providers should be a small integration change.

Google Cloud AI could centralise billing and access permissions. However, GPT-6 Luna is currently in private preview there, so switching would require confirming access or evaluating another available model. [Google's announcement](https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-brings-openai-models-to-customers)

## Rough monthly cost

Approximate monthly costs in AUD for a small Sydney deployment:

- Cloud SQL `db-f1-micro`: **A$15**.
- 10 GiB SSD storage: **A$3**.
- Backups and supporting services: **A$3–10**.
- Cloud Run: potentially **A$0 within its free allowance**, depending on usage.

I would budget **A$22–29 per month, plus AI usage and tax**. Actual costs would depend on usage and exchange rates.
