# Candidate Tracker with an AI-Assisted Feature

> Early Careers Engineering Assessment for Publicis Sapient

## Written deliverables

The [`docs/`](docs/) directory contains the written deliverables, including the design choices and reasoning, AI usage log, learning log, and deployment design.

- [Design choices and tradeoffs](docs/DESIGN_CHOICES.md)
- [AI usage log](docs/AI_USAGE_LOG.md)
- [Learning log](docs/LEARNING_LOG.md)
- [Deployment design](docs/DEPLOYMENT_DESIGN.md)

## Requirements

- Git
- Node.js >=22.12.0
- pnpm 10.x; the project pins 10.26.1 in `package.json`
- Docker with Compose, running
- OpenAI API key for AI summaries only

## Run locally

1. Clone and install:

   ```sh
   git clone https://github.com/laoz40/candidate-tracker.git
   cd candidate-tracker
   pnpm install
   ```

2. Copy [`.env.example`](apps/server/.env.example):

   ```sh
   cp apps/server/.env.example apps/server/.env
   ```

   In `apps/server/.env`, keep `DATABASE_URL` as supplied for Docker. For AI summaries, uncomment `OPENAI_API_KEY` and replace `your-key`.

3. Start PostgreSQL and apply migrations:

   ```sh
   docker compose up -d --wait
   pnpm --filter @candidate-tracker/server db:migrate
   ```

4. Start the app:

   ```sh
   pnpm dev
   ```

5. Open http://localhost:5173. The API uses port 3000; PostgreSQL uses port 5432.

Stop the app with Ctrl+C. Stop PostgreSQL with `docker compose stop`.

## Development

This pnpm monorepo has two apps:

- [`apps/web`](apps/web): React frontend. Routes live in `src/routes`, feature UI and logic in `src/features`.
- [`apps/server`](apps/server): Hono API. Routes, services, and repositories live in `src/features`; the Drizzle schema lives in `src/db` and migrations in `drizzle`.

Run commands from the repository root:

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run both apps with automatic reload |
| `pnpm --filter @candidate-tracker/web dev` | Run only the frontend |
| `pnpm --filter @candidate-tracker/server dev` | Run only the API |
| `pnpm check` | Run lint, lint-rule tests, formatting checks, and type checks |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm test:lint` | Run custom lint-rule tests |
| `pnpm format` | Format files |
| `pnpm build` | Build both apps |
| `pnpm --filter @candidate-tracker/server db:generate` | Generate a migration after schema changes |
| `pnpm --filter @candidate-tracker/server db:migrate` | Apply database migrations |
