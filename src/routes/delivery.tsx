import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/delivery")({ component: DeliveryPage });

function DeliveryPage() {
  return (
    <PolicyPage
      title="Delivery"
      text="TODO: Add delivery areas, timelines, charges and pay-on-delivery details."
    />
  );
}

function PolicyPage({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl text-primary">{title}</h1>
      <p className="mt-5 leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}
