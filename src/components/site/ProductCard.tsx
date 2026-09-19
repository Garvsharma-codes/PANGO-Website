import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { WEIGHTS, formatINR, type Product, type Weight } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const available = WEIGHTS.filter((w) => product.prices[w] != null);
  const [weight, setWeight] = useState<Weight>(available[0] ?? "500g");
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  const price = product.prices[weight] ?? 0;

  return (
    <article className="card-lift flex min-w-0 w-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-cream-deep">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={912}
          height={912}
          className="block h-full w-full max-w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-semibold text-primary">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-sm leading-snug text-foreground sm:text-base">{product.name}</h3>

        <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
          {WEIGHTS.map((w) => {
            const ok = product.prices[w] != null;
            return (
              <button
                key={w}
                disabled={!ok}
                onClick={() => setWeight(w)}
                title={ok ? `${w} — ${formatINR(product.prices[w]!)}` : "Not Available"}
                className={`rounded-full border px-2 py-1 text-[10px] font-semibold transition-colors sm:px-3 sm:text-xs ${
                  !ok
                    ? "cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through"
                    : weight === w
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground/70 hover:border-primary hover:text-primary"
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>

        <p className="mt-2 font-display text-xl text-primary sm:mt-3 sm:text-2xl">{formatINR(price)}</p>

        <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:pt-4">
          <div className="flex self-start items-center rounded-full border border-border">
            <button
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="pill-btn h-9 w-9 text-foreground/70 hover:text-primary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center text-sm font-semibold">{qty}</span>
            <button
              aria-label="Increase quantity"
              onClick={() => setQty((q) => q + 1)}
              className="pill-btn h-9 w-9 text-foreground/70 hover:text-primary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => {
              addItem(
                {
                  id: product.id,
                  name: product.name,
                  weight,
                  price,
                  image: product.image,
                },
                qty,
              );
              toast.success("Added to Cart 🌿", {
                description: `${product.name} — ${weight} × ${qty}`,
              });
              setQty(1);
            }}
            className="pill-btn w-full bg-primary px-3 py-2 text-xs text-primary-foreground hover:bg-primary/90 sm:w-auto sm:flex-1 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
