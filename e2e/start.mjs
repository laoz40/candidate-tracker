import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";

const environment = {
  ...process.env,
  NODE_ENV: "test",
  DATABASE_URL:
    "postgresql://candidate_tracker:candidate_tracker@127.0.0.1:55433/candidate_tracker_test",
  OPENAI_API_KEY: "e2e-dummy-key",
  OPENAI_BASE_URL: "http://127.0.0.1:4174/v1",
  PORT: "4173",
};

const compose = ["compose", "-f", "compose.e2e.yaml"];
let stopping = false;
let application;

function stop(code) {
  if (stopping) return;

  stopping = true;
  application?.kill("SIGTERM");
  mock.close();
  spawnSync("docker", [...compose, "down"], { stdio: "inherit" });
  process.exit(code);
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env: environment });

  if (result.status !== 0) throw new Error(`${command} failed`);
}

const failedPrompts = new Set();

const mock = createServer(async (request, response) => {
  let body = "";

  for await (const chunk of request) body += chunk;

  response.setHeader("Content-Type", "application/json");

  if (request.url !== "/v1/responses") {
    response
      .writeHead(404)
      .end(JSON.stringify({ error: { message: "Unexpected model endpoint" } }));

    return;
  }

  if (body.includes("retry-fixture") && !failedPrompts.has(body)) {
    failedPrompts.add(body);
    response.writeHead(503).end(JSON.stringify({ error: { message: "Test provider failure" } }));

    return;
  }

  const result = {
    kind: "summary",
    overview: "Experienced TypeScript developer.",
    skills: ["TypeScript", "React"],
    experienceHighlights: ["Built accessible web applications."],
  };

  response.end(
    JSON.stringify({
      id: "resp_e2e",
      created_at: 0,
      model: "gpt-6-luna",
      status: "completed",
      output: [
        {
          type: "message",
          id: "msg_e2e",
          role: "assistant",
          status: "completed",
          content: [{ type: "output_text", text: JSON.stringify({ result }), annotations: [] }],
        },
      ],
      usage: { input_tokens: 1, output_tokens: 1 },
    }),
  );
});

process.on("SIGTERM", () => stop(0));

process.on("SIGINT", () => stop(0));

try {
  run("docker", [...compose, "up", "--wait"]);
  run("pnpm", ["--filter", "@candidate-tracker/server", "db:migrate"]);
  run("pnpm", ["build"]);
  mock.listen(4174, "127.0.0.1");
  application = spawn("node", ["apps/server/dist/index.js"], {
    stdio: "inherit",
    env: environment,
    detached: true,
  });
  application.on("exit", (code) => stop(code ?? 1));
} catch (error) {
  console.error(error);
  stop(1);
}
