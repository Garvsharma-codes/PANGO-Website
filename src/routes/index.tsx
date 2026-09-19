import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Gift, Home as HomeIcon, Leaf, MessageCircle, Tag, Truck } from "lucide-react";
import heroBowl from "@/assets/hero-bowl.jpg";
import lifestyle from "@/assets/lifestyle.jpg";
import giftHamper from "@/assets/gift-hamper.jpg";
import {
  CATEGORIES,
  CATEGORY_IMAGES,
  FEATURED_IDS,
  PRODUCTS,
  formatINR,
  startingPrice,
  waLink,
} from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pango Dry Fruits — Premium Nuts, Seeds & Healthy Snacks" },
      {
        name: "description",
        content:
          "Fresh stock is back! Shop premium badam, kaju, pista, walnut, makhana, dates and healthy snacks. Order on WhatsApp — freshly packed every time.",
      },
      { property: "og:title", content: "Pango Dry Fruits — Pure Goodness • Better Living" },
      {
        property: "og:description",
        content:
          "Premium dry fruits, nuts, seeds and healthy snacks at honest prices. Order easily on WhatsApp.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
    (p): p is (typeof PRODUCTS)[number] => Boolean(p),
  );

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
          <div className="relative max-w-2xl">
            <span className="pill-btn bg-accent/25 px-4 py-2 text-xs font-bold uppercase leading-none tracking-[0.14em] text-wood-dark">
              🌿 Good Food • Good Health Always!
            </span>
            <h1 className="mt-6 font-display text-[3.25rem] leading-[0.98] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              FRESH STOCK
              <span className="relative mt-3 block w-fit">
                <span className="relative z-10 block rounded-2xl bg-primary px-4 py-2 text-accent sm:px-5 sm:py-2.5">
                  IS BACK!
                </span>
                <span className="absolute -right-4 -top-4 text-2xl text-accent">✦</span>
                <span className="absolute -bottom-3 -left-3 text-xl text-accent">✦</span>
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Premium quality almonds, cashews, walnuts, seeds & healthy snacks — delivered fresh
              to your door.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="pill-btn bg-primary px-7 py-3.5 text-primary-foreground shadow-soft hover:bg-primary/90 sm:w-auto"
              >
                Shop Now
              </Link>
              <a
                href={waLink("Hi Pango Dry Fruits! I'd like to place an order.")}
                target="_blank"
                rel="noreferrer"
                className="pill-btn border border-primary/30 bg-card px-7 py-3.5 text-primary hover:bg-primary/10 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" /> Order via WhatsApp
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -inset-4 rounded-[3rem] bg-accent/20 blur-2xl" aria-hidden />
            <img
              src={heroBowl}
              alt="Wooden bowl overflowing with mixed dry fruits and nuts"
              width={1600}
              height={1200}
              className="relative rounded-[2.5rem] object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-border bg-cream-deep">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 py-6 text-center sm:grid-cols-3">
          {[
            { icon: Award, label: "Premium Quality" },
            { icon: Tag, label: "Best Prices" },
            { icon: Leaf, label: "Fresh Stock Available" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-2 text-wood-dark">
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading eyebrow="Explore" title="Shop by Category" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.filter((c) => c !== "Special Item").map((c) => (
            <Link
              key={c}
              to="/shop"
              search={{ category: c }}
              className="card-lift group overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
            >
              <img
                src={CATEGORY_IMAGES[c]}
                alt={c}
                loading="lazy"
                width={912}
                height={912}
                className="aspect-square w-full object-cover"
              />
              <p className="px-3 py-3 text-center text-sm font-semibold text-foreground group-hover:text-primary">
                {c}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-cream-deep/50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Bestsellers" title="Loved by Our Customers" />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Handpicked favourites, starting at{" "}
            {formatINR(Math.min(...featured.map((p) => startingPrice(p))))}
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="pill-btn border border-primary/30 bg-card px-7 py-3 text-primary hover:bg-primary/10"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* NATURAL BANNER */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2.5rem] bg-primary p-6 text-primary-foreground md:grid-cols-2 md:p-12">
          <img
            src={lifestyle}
            alt="Sharing a bowl of nuts and dry fruits"
            loading="lazy"
            width={1408}
            height={912}
            className="rounded-[2rem] object-cover shadow-lift"
          />
          <div>
            <h2 className="font-display text-4xl text-accent md:text-5xl">
              Natural. Healthy. Delicious.
            </h2>
            <p className="mt-5 text-primary-foreground/85">
              Every product is handpicked, freshly packed, and free from unnecessary additives —
              because good food should feel good too.
            </p>
            <Link
              to="/about"
              className="pill-btn mt-7 bg-accent px-6 py-3 text-accent-foreground hover:opacity-90"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* GIFTING */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="grid items-center gap-8 rounded-[2.5rem] border border-border bg-card p-6 shadow-soft md:grid-cols-2 md:p-12">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Gifting & Bulk"
              title="Looking for Gift Hampers or Bulk Orders?"
            />
            <p className="mt-4 text-muted-foreground">
              We offer customized gift hampers for festivals & occasions, bulk pricing for offices
              and events, and fresh packing on every single order.
            </p>
            <ul className="mt-6 space-y-3 text-sm font-medium">
              {[
                { icon: Gift, label: "Customized Gift Hampers Available" },
                { icon: HomeIcon, label: "Bulk Orders Welcome" },
                { icon: Truck, label: "Fresh Packing on Every Order" },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/25 text-wood-dark">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <a
              href={waLink("Hi Pango Dry Fruits! I'd like to enquire about gift hampers / bulk orders.")}
              target="_blank"
              rel="noreferrer"
              className="pill-btn mt-8 bg-whatsapp px-7 py-3.5 text-primary-foreground hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
            </a>
          </div>
          <img
            src={giftHamper}
            alt="Premium dry fruit gift hamper"
            loading="lazy"
            width={1200}
            height={912}
            className="rounded-[2rem] object-cover shadow-soft"
          />
        </div>
      </section>
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground/70">
        🌿 {eyebrow}
      </span>
      <h2 className="mt-2 font-display text-3xl text-primary md:text-4xl">{title}</h2>
    </div>
  );
}
