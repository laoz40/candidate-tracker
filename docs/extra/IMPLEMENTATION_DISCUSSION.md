# Implementation discussion

This document summarises a back-and-forth discussion with AI to think through each part of the project using Matt Pocock's `grill-me` skill:

> Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree resolving dependencies between decisions one by one.

## Scope and architecture

| Question explored | Decision |
|---|---|
| What should the initial application cover? | Implement the required candidate workflows and AI summary. Leave analytics and candidate scoring outside scope. |
| Should deployment be addressed during the initial build? | Build and run locally first. Defer cloud-service selection and deployment planning. |
| Which frontend tools should be used? | React, Vite, TanStack Router, Query, Form, and Table, with shadcn/ui. |
| Why these frontend tools? | Existing experience with React and the TanStack tools, type safety, and their ecosystems. shadcn/ui provides editable components and a consistent UI that supports faster initial development. |
| Which backend framework should be used? | Hono, for its type safety and conventional, readable HTTP endpoints. |
| How should frontend and backend be organised? | One repository using pnpm workspaces, with separate [`apps/web`](../../apps/web) and [`apps/server`](../../apps/server) packages and root commands to run them together. |
| How should production serving work? | A Node server can serve the API and built frontend from one origin. Specific cloud hosting remains deferred. |
| Which database and database tooling should be used? | PostgreSQL through Docker Compose, with Drizzle. Drizzle is already familiar. |
| Should the application run without an OpenAI API key? | Yes. Candidate management and PDF extraction remain available. Summary generation displays a clear configuration message. Simulated model responses are enabled only through explicit test configuration. |

## Candidate workflows

| Question explored | Decision |
|---|---|
| How should applied roles be entered? | Provide a place to define active roles. Candidate creation must select from those active roles. |
| How should roles be managed? | Support creation, renaming, deactivation, and reactivation, without deletion. Deactivation prevents selecting the role for new candidates while preserving existing candidate associations and list filters. Renaming updates the displayed name everywhere. |
| Should candidate source be included? | Include an optional free-text source field on the candidate, such as LinkedIn, referral, or company website, as specified in the brief. |
| Should general candidate editing be included? | Defer it. Initial changes to existing candidates cover stage changes, notes, archiving, and restoration. |
| How should candidate removal work? | Archive candidates, exclude them from the default list, and allow viewing and restoring archived candidates. |
| How should the candidate list behave? | Server-side filtering, sorting, and pagination. Store stage, role, sorting, and page in URL search parameters. Default to newest first. |
| What operations should the API expose? | Create, list, and retrieve candidates; change stage; archive and restore; append notes; extract PDF text; generate and save summaries; create, rename, deactivate, and reactivate roles. |

## Document input

| Question explored | Decision |
|---|---|
| Which input formats should be supported? | Pasted text and text-based PDF uploads. |
| Should original uploaded files be retained? | No. Extract and store the text in PostgreSQL. |
| Which PDF extraction library should be used? | Use `pdf-parse` in the backend. |
| Should extracted text be reviewable? | Yes. Populate the form with extracted text so it can be reviewed before saving. |
| How should unsupported PDFs be handled? | Reject unsupported, encrypted, image-only, or otherwise unreadable PDFs with a clear error. OCR is outside scope. |
| What document input limits should apply initially? | Accept PDFs up to 5 MB and extracted or pasted text up to 50,000 characters. Reject oversized input clearly rather than silently truncating it. Keep the limits configurable. |
| How should extraction and summarisation relate? | Keep them separate. Extraction returns text for review. Summarisation operates on the saved candidate's document text. |

## AI summary

| Question explored | Decision |
|---|---|
| Which AI SDK should be used? | Vercel AI SDK. Its provider adapters make future provider changes easier as models evolve. |
| Which initial provider and model should be used? | OpenAI, using `gpt-6-luna`. Cost efficiency relative to performance motivates this preference. |
| What should the model receive? | Only the submitted resume or cover-letter text. Do not separately send candidate contact fields or the applied role. |
| Should the AI assess job suitability? | No. Summarise skills and experience supported by the document. |
| What should the summary contain? | Structured output containing a short overview, skills, and experience highlights. Permit empty sections and an insufficient-information result. |
| How should untrusted document content be treated? | Treat instructions embedded in the document as untrusted input. Report insufficient or unreadable information rather than inventing details. |
| When should summarisation happen? | Save the candidate first, navigate to the detail page, then automatically make a separate summary request. |
| How should generation execute? | Keep the request open until generation succeeds or fails. No streaming UI, queue, or background worker initially. |
| What happens if generation fails or is interrupted? | Keep the candidate saved and offer an explicit Generate or Retry action. Automatic recovery after a server restart is unnecessary. |
| What if the user leaves before generation starts? | It is acceptable for the candidate to remain without a summary until the user returns and generates it. |
| What boundaries should the AI module have? | Keep document-to-summary generation separate from HTTP handling and candidate persistence. The module owns its prompt, output schema, and model call. |
| What request safeguards should exist? | Use a 60-second summary timeout and a maximum of 2,000 output tokens. Avoid automatic retries, permit one active generation per candidate, and reuse an existing successful summary. Keep the limits configurable. |

## Testing and learning

| Question explored | Decision |
|---|---|
| Which test framework should be used initially? | Playwright only. Do not introduce other test frameworks unless a concrete need emerges. |
| How should automated AI integration tests avoid paid calls? | Supply controlled model responses at the server's model boundary while exercising application behaviour through Playwright. |
| How should real summary quality be checked initially? | Manually evaluate representative documents through the application, including garbled and adversarial input. These actions make real provider calls. |
| Should an automated live-model evaluation be added now? | Defer it until repeated manual evaluation creates a reason to automate. |
| What is the principal learning component? | Implementing the AI feature with Vercel AI SDK, including structured output, failure handling, and evaluating generated summaries. |

## Open decisions

Cloud services, deployment architecture, and cost estimates remain deferred. Request limits may be adjusted after evaluating representative resumes.
