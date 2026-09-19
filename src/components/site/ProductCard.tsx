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
    <article className="card-lift flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="relative aspect-square overflow-hidden bg-cream-deep">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={912}
          height={912}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-semibold text-primary">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base leading-snug text-foreground">{product.name}</h3>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {WEIGHTS.map((w) => {
            const ok = product.prices[w] != null;
            return (
              <button
                key={w}
                disabled={!ok}
                onClick={() => setWeight(w)}
                title={ok ? `${w} — ${formatINR(product.prices[w]!)}` : "Not Available"}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
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

        <p className="mt-3 font-display text-2xl text-primary">{formatINR(price)}</p>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <div className="flex items-center rounded-full border border-border">
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
            className="pill-btn flex-1 bg-primary px-4 py-2.5 text-sm text-primary-foreground hover:bg-primary/90"
          >
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
