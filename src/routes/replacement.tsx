import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/replacement")({ component: ReplacementPage });

function ReplacementPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl text-primary">Replacement Promise</h1>
      <p className="mt-5 leading-7 text-muted-foreground">
        Not happy with the quality? We'll replace it.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        TODO: Add the replacement window, eligibility and contact steps.
      </p>
    </div>
  );
}
