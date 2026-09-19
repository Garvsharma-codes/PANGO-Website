import { Link } from "@tanstack/react-router";
import { Award, Leaf, Tag, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { waLink } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="h-6 w-full bg-accent/20" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/75">
            Premium almonds, cashews, walnuts, seeds and healthy snacks — handpicked and freshly
            packed for every order.
          </p>
          <a
            href={waLink("Hi Pango Dry Fruits! I'd like to place an order.")}
            target="_blank"
            rel="noreferrer"
            className="pill-btn mt-6 bg-whatsapp px-5 py-3 text-sm text-primary-foreground hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" /> Order Now / DM — +91 89201 63426
          </a>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            {[
              { to: "/", label: "Home" },
              { to: "/shop", label: "Shop" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Why Pango</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" /> Premium Quality
            </li>
            <li className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-accent" /> Best Prices
            </li>
            <li className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-accent" /> Fresh Stock Available
            </li>
          </ul>
          <ul className="mt-5 space-y-2 text-sm text-primary-foreground/70">
            <li>🎁 Customized Gift Hampers Available</li>
            <li>🏠 Bulk Orders Welcome</li>
            <li>🚚 Fresh Packing on Every Order</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 px-4 py-6 text-center text-xs text-primary-foreground/70">
        <p>Prices are subject to change based on the prevailing market rates.</p>
        <p className="mt-2">© 2026 Pango Dry Fruits. Good Food • Good Health Always!</p>
      </div>
    </footer>
  );
}
