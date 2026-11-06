# Deployment design

## Expected usage/scope

I assume this would be a low-traffic internal tool. Recruiters would manage candidates rather than applicants submitting directly through it, so high concurrent traffic is unlikely initially. Actual usage would depend on the company.

## Application and database deployment approach

I would deploy the frontend and backend together in one container. The existing Node server already serves both, so this gives the application one deployment and avoids separate frontend hosting and cross-origin configuration.

A container would package Node, the application and PDF parser dependencies together. Serverless functions can also package these dependencies, including through container images on some platforms, but require additional setup for adapting how the server receives requests. Managed container hosting fits the existing HTTP server and avoids maintaining a virtual machine. I would still need to update dependencies and rebuild the image.

PostgreSQL would run separately through a managed database service. Application containers could then be replaced or scaled without replacing stored data. I would choose a managed database to reduce infrastructure maintenance, while remaining responsible for access, backup settings and schema changes.

## Proposed services

### Google Cloud Run

I would use Cloud Run to host the application container. It provides HTTPS, request routing and automatic scaling without configuring a separate load balancer.

I prefer it over a conventional ECS/Fargate setup because fewer infrastructure components need configuring. Compared with Azure Container Apps, Cloud Run does not require a separate Container Apps environment for shared networking and application settings. For one HTTP service, I would choose that simpler service-level setup. Its documented Cloud SQL connection also gives me a clear path for connecting PostgreSQL.

### Cloud SQL for PostgreSQL

I would use Cloud SQL to keep managed PostgreSQL on the same cloud as the application. This keeps billing and access configuration together and avoids configuring connectivity between cloud providers.

For the cost estimate, I would start with a small, single-zone `db-f1-micro` instance to keep costs low. This is a reasonable starting point for the assumed low usage. If usage grows and the database needs more capacity, I would increase the instance size.

### Existing OpenAI API

I would keep the existing OpenAI integration for deployment. Vercel AI SDK makes switching providers straightforward in code, but I would still need to test the new model's summary quality and how it handles adversarial resume text before switching.

Google Cloud AI could centralise billing and access permissions. However, GPT-6 Luna is currently in private preview there, so switching would require confirming access or evaluating another available model. [Google's announcement](https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-brings-openai-models-to-customers)

## Deployment approaches considered:

### Serverless functions

Options include AWS Lambda, Azure Functions and Cloud Run functions.

#### Pros

- The provider handles execution and scaling, so I would not need to maintain servers.
- Occasional requests can be cheap because compute does not need to run continuously.

#### Cons

- Function deployments require adapting how the server starts and receives requests. Hono supports this, but it introduces deployment setup.
- Requests after inactivity can take longer. That is acceptable here because it would mainly delay loading the initial candidate list.
- More simultaneous executions can open more database connections, so scaling needs limits.

Serverless functions could work, but I prefer deploying the existing HTTP server with its runtime and dependencies packaged together. Functions can also support containers, so this is a preference for the deployment approach rather than a limitation of functions.

### Managed containers

Options include Google Cloud Run, Azure Container Apps and AWS ECS on Fargate.

#### Pros

- I can package Node, the backend, the built frontend and PDF parser dependencies in one image. This keeps deployment close to how the application runs locally.
- The provider maintains the underlying servers, leaving me to maintain the application.
- If usage grows, I can run more copies without immediately introducing separate services.

#### Cons

- Updating Node or a dependency requires building and deploying a new image. Using CI could automate this after running the project checks.
- More containers can create more database connections and AI requests. I would limit scaling to what those services can handle.
- Scaling to zero reduces idle costs but slows the first request after inactivity. I would accept that tradeoff for this internal tool.

I would choose managed containers because they package the existing HTTP server and its dependencies together while avoiding virtual machine administration. Cloud Run's scale-to-zero option suits the assumed low traffic, with a slower first request after inactivity as the tradeoff. I would limit application scaling to protect database connections and control AI request volume.

### Managing infrastructure directly

This includes configuring virtual machines and supporting infrastructure, with or without automation.

#### Pros

- More control over server sizes, networking and resource sharing could help optimise costs once actual usage is understood.

#### Cons

- Configuration, patching, monitoring and recovery create more responsibilities and maintenance work.
- A lower infrastructure bill may not justify that work for a small internal tool.

I would consider this approach when measured costs or specific requirements make the extra control worthwhile.

## Rough monthly cost

Approximate monthly costs in AUD for a small Sydney deployment:

- Cloud SQL `db-f1-micro`: **A$15–20**.
- 10 GiB SSD storage: **A$3–4**.
- Cloud Run: **A$0–5** for the assumed low usage, using request-based billing and scaling to zero.

I would budget **A$30–40 per month, plus AI usage and tax**, to leave some breathing room. Actual costs would depend on usage and exchange rates.
