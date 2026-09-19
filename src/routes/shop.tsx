import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES, PRODUCTS, startingPrice, type Category } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

type ShopSearch = { category?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const raw = search["category"];
    return { category: typeof raw === "string" ? raw : undefined };
  },
  head: () => ({
    meta: [
      { title: "Shop Dry Fruits & Nuts — Pango Dry Fruits" },
      {
        name: "description",
        content:
          "Browse badam, kaju, pista, walnut, makhana, kishmish, anjeer, dates, seeds and healthy snacks in 250g, 500g and 1kg packs.",
      },
      { property: "og:title", content: "Shop Dry Fruits & Nuts — Pango Dry Fruits" },
      {
        property: "og:description",
        content: "Premium nuts, seeds and snacks in 250g, 500g and 1kg packs. Order on WhatsApp.",
      },
    ],
  }),
  component: ShopPage,
});

type Sort = "default" | "price-asc" | "price-desc" | "alpha";

function ShopPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("default");

  const active = (category as Category | undefined) ?? "All Products";

  const products = useMemo(() => {
    let list = PRODUCTS.filter((p) => active === "All Products" || p.category === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => startingPrice(a) - startingPrice(b));
    if (sort === "price-desc") sorted.sort((a, b) => startingPrice(b) - startingPrice(a));
    if (sort === "alpha") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [active, query, sort]);

  const filters = ["All Products", ...CATEGORIES] as const;

  const select = (c: string) =>
    navigate({ search: c === "All Products" ? {} : { category: c } });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="text-center">
        <h1 className="font-display text-4xl text-primary md:text-5xl">All Products</h1>
        <p className="mt-2 text-muted-foreground">
          Available packing: 250g • 500g • 1 Kg — freshly packed on every order.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for almonds, cashews, seeds..."
            className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          aria-label="Sort products"
        >
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside>
          <h2 className="mb-3 hidden text-sm font-bold uppercase tracking-wider text-muted-foreground lg:block">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {filters.map((c) => (
              <button
                key={c}
                onClick={() => select(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm lg:text-left ${
                  active === c
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground/75 hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card py-20 text-center">
              <p className="text-lg font-semibold text-foreground">
                No products found — try a different search or category 🌿
              </p>
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
