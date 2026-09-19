import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBasket, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatINR, waLink } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Pango Dry Fruits" },
      {
        name: "description",
        content:
          "Review your dry fruits order and checkout instantly on WhatsApp — no payment gateway, just a quick chat to confirm.",
      },
      { property: "og:title", content: "Your Cart — Pango Dry Fruits" },
      {
        property: "og:description",
        content: "Review your order and confirm it on WhatsApp with Pango Dry Fruits.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, removeItem } = useCart();

  const checkout = () => {
    const lines = items.map(
      (i, idx) =>
        `${idx + 1}. ${i.name} (${i.weight}) x${i.qty} - ${formatINR(i.price * i.qty)}`,
    );
    const message = [
      "Hi Pango Dry Fruits! 🌿 I'd like to place an order:",
      "",
      ...lines,
      "",
      `Total: ${formatINR(subtotal)}`,
      "",
      "Please confirm availability and delivery details. Thank you!",
    ].join("\n");

    window.open(waLink(message), "_blank", "noopener,noreferrer");
    toast.success("Redirecting you to WhatsApp to confirm your order! 🌿");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-primary md:text-5xl">Your Cart 🛒</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-dashed border-border bg-card px-6 py-20 text-center shadow-soft">
          <ShoppingBasket className="mx-auto h-16 w-16 text-accent" />
          <p className="mt-6 text-lg font-semibold text-foreground">
            Your cart is empty. Time to fill it with some goodness!
          </p>
          <Link
            to="/shop"
            className="pill-btn mt-6 bg-primary px-7 py-3 text-primary-foreground hover:bg-primary/90"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={`${item.id}-${item.weight}`}
                className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  width={912}
                  height={912}
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">
                    {item.name} – {item.weight}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatINR(item.price)} each</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => setQty(item.id, item.weight, item.qty - 1)}
                        className="pill-btn h-8 w-8 text-foreground/70 hover:text-primary"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => setQty(item.id, item.weight, item.qty + 1)}
                        className="pill-btn h-8 w-8 text-foreground/70 hover:text-primary"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.id, item.weight)}
                      className="pill-btn h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="font-display text-xl text-primary">
                  {formatINR(item.price * item.qty)}
                </p>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-soft lg:sticky lg:top-32">
            <h2 className="font-display text-2xl text-primary">Order Summary</h2>
            <div className="mt-5 flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatINR(subtotal)}</span>
            </div>
            <p className="mt-4 rounded-2xl bg-cream-deep p-3 text-xs text-muted-foreground">
              Final price confirmed on WhatsApp. Delivery charges (if any) discussed separately.
            </p>
            <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-display text-3xl text-primary">{formatINR(subtotal)}</span>
            </div>
            <button
              onClick={checkout}
              className="pill-btn mt-6 w-full bg-whatsapp px-6 py-4 text-primary-foreground hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" /> Checkout on WhatsApp
            </button>
            <Link
              to="/shop"
              className="mt-4 block text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
