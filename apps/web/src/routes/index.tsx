import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">Candidate Tracker</h1>
      <p className="text-muted-foreground">The project is ready for candidate workflows.</p>
    </main>
  );
}
