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
