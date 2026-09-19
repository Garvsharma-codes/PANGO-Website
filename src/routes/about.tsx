import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Gift, Leaf, MessageCircle, Tag } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import lifestyle from "@/assets/lifestyle.jpg";
import { waLink } from "@/lib/products";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Pango Dry Fruits" },
      {
        name: "description",
        content:
          "Pango Dry Fruits handpicks premium nuts, seeds and dried fruits, packs every order fresh, and keeps prices honest and market-fair.",
      },
      { property: "og:title", content: "Our Story — Pango Dry Fruits" },
      {
        property: "og:description",
        content: "Pure Goodness. Better Living. Learn how Pango sources and packs every order.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="relative">
        <img
          src={aboutHero}
          alt="Assorted dry fruits and nuts on jute cloth"
          width={1600}
          height={800}
          className="h-[320px] w-full object-cover md:h-[420px]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/65 px-4 text-center text-primary-foreground">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
            Our Story
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">Pure Goodness. Better Living.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Pango Dry Fruits began with a simple belief: everyday snacking should be honest,
            nourishing and genuinely enjoyable. We source premium almonds, cashews, walnuts,
            pistachios, makhana, seeds, dried fruits and wholesome snacks from trusted suppliers,
            and we taste and inspect what we sell before it ever reaches your home.
          </p>
          <p>
            Freshness is the heart of what we do. Our stock is refreshed regularly — that is why
            you will often see us announcing "Fresh Stock is Back!" — and every single order is
            packed at the time of ordering, never scooped from something that has been sitting on
            a shelf for weeks.
          </p>
          <p>
            We also believe good quality should not come with confusing pricing. Our rates stay
            fair and transparent, with 250g, 500g and 1kg packs so you can buy exactly what suits
            you. Our mission is simple: to make healthy, natural snacking a natural part of
            everyday family life.
          </p>
        </div>
      </section>

      <section className="bg-cream-deep/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl text-primary md:text-4xl">
            Why Choose Us
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Award,
                title: "Premium Quality",
                copy: "Handpicked, top-grade nuts and dry fruits, checked batch by batch.",
              },
              {
                icon: Tag,
                title: "Best Prices",
                copy: "Honest, market-fair pricing with multiple pack sizes to choose from.",
              },
              {
                icon: Leaf,
                title: "Freshly Packed",
                copy: "Every order packed fresh — never sitting on a shelf waiting for you.",
              },
              {
                icon: Gift,
                title: "Gifting & Bulk",
                copy: "Customized hampers for festivals and bulk pricing for offices & events.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="card-lift rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/25 text-wood-dark">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2.5rem] bg-primary p-6 text-primary-foreground md:grid-cols-2 md:p-12">
          <div>
            <h2 className="font-display text-3xl text-accent md:text-4xl">Our Quality Promise</h2>
            <p className="mt-5 text-primary-foreground/85">
              From sourcing to sealing, everything is handled hygienically in clean, controlled
              conditions. We buy in small, frequent lots so stock keeps moving, store it properly
              to protect flavour and crunch, and reject anything that does not meet our standard.
              What reaches you is what we would happily serve at our own table.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="pill-btn bg-accent px-6 py-3 text-accent-foreground hover:opacity-90"
              >
                Have questions? Reach out
              </Link>
              <a
                href={waLink("Hi Pango Dry Fruits! I have a question about your products.")}
                target="_blank"
                rel="noreferrer"
                className="pill-btn bg-whatsapp px-6 py-3 text-primary-foreground hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
          <img
            src={lifestyle}
            alt="Bowl of mixed nuts shared at a table"
            loading="lazy"
            width={1408}
            height={912}
            className="rounded-[2rem] object-cover shadow-lift"
          />
        </div>
      </section>
    </div>
  );
}
