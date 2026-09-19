import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gift, Home as HomeIcon, MessageCircle, Truck, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { waLink } from "@/lib/products";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Get in Touch — Pango Dry Fruits" },
      {
        name: "description",
        content:
          "Chat with Pango Dry Fruits on WhatsApp at +91 89201 63426 for orders, gift hampers, bulk pricing and delivery details.",
      },
      { property: "og:title", content: "Get in Touch — Pango Dry Fruits" },
      {
        property: "og:description",
        content: "Orders, gift hampers and bulk enquiries — message us on WhatsApp.",
      },
    ],
  }),
  component: ContactPage,
});

const FAQS = [
  {
    q: "How do I place an order?",
    a: "Add the products you want to your cart, then tap “Checkout on WhatsApp”. Your order details arrive with us as a message and we confirm everything in chat.",
  },
  {
    q: "What pack sizes are available?",
    a: "Most items come in 250g, 500g and 1kg. A few items, like our healthy snacks and candies, are available in 500g and 1kg only.",
  },
  {
    q: "Do you offer bulk or gifting orders?",
    a: "Yes! We create customized gift hampers for festivals and occasions, and offer special bulk pricing for offices and events.",
  },
  {
    q: "Are prices fixed?",
    a: "Prices may vary slightly based on prevailing market rates. We always confirm the final amount with you on WhatsApp before packing.",
  },
  {
    q: "How is delivery handled?",
    a: "Delivery is arranged directly over WhatsApp once your order details are finalised, including any delivery charges that apply.",
  },
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [open, setOpen] = useState<number | null>(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Pango Dry Fruits! 🌿\n\nName: ${form.name}\nPhone: ${form.phone}\n\n${form.message}`;
    window.open(waLink(text), "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp with your message 🌿");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="text-center">
        <h1 className="font-display text-4xl text-primary md:text-5xl">Get in Touch</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          We'd love to help you find the perfect pack — for your family, your office, or as a gift.
        </p>
      </header>

      <section className="mt-10 rounded-[2.5rem] bg-primary p-8 text-center text-primary-foreground shadow-lift md:p-12">
        <h2 className="font-display text-3xl text-accent">Order Now / DM us on WhatsApp</h2>
        <p className="mt-3 text-primary-foreground/85">+91 89201 63426</p>
        <a
          href={waLink("Hi Pango Dry Fruits! I'd like to place an order.")}
          target="_blank"
          rel="noreferrer"
          className="pill-btn mt-6 bg-whatsapp px-8 py-4 text-primary-foreground hover:opacity-90"
        >
          <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
        </a>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Gift, label: "Customized Gift Hampers Available" },
          { icon: HomeIcon, label: "Bulk Orders Welcome" },
          { icon: Truck, label: "Fresh Packing on Every Order" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-3xl border border-border bg-card p-5 text-sm font-medium shadow-soft"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/25 text-wood-dark">
              <Icon className="h-5 w-5" />
            </span>
            {label}
          </div>
        ))}
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl text-primary">Send us your query</h2>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                required
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium">
                Message / Order query
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              className="pill-btn w-full bg-primary px-6 py-3.5 text-primary-foreground hover:bg-primary/90"
            >
              Send on WhatsApp
            </button>
          </form>
        </section>

        <section>
          <h2 className="font-display text-2xl text-primary">Frequently Asked Questions</h2>
          <div className="mt-5 space-y-3">
            {FAQS.map((f, i) => (
              <div
                key={f.q}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold"
                >
                  {f.q}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-primary transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === i && (
                  <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
