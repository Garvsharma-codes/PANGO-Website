import { Leaf } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" aria-label="Pango Dry Fruits home" className="group inline-flex shrink-0">
      <img
        src="/pango_logoT.png"
        alt="Pango Dry Fruits & Spices"
        width={1185}
        height={1379}
        className="h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105 sm:h-16"
      />
      <span
        className={`hidden flex h-10 w-10 items-center justify-center rounded-full ${
          light ? "bg-primary-foreground/15 text-accent" : "bg-primary/10 text-primary"
        }`}
      >
        <Leaf className="h-5 w-5" />
      </span>
      <span className="hidden">
        <span
          className={`block font-display text-lg font-bold tracking-tight ${
            light ? "text-primary-foreground" : "text-primary"
          }`}
        >
          PANGO <span className="text-accent">DRY FRUITS</span>
        </span>
        <span
          className={`block text-[11px] italic ${
            light ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          Pure Goodness • Better Living
        </span>
      </span>
    </Link>
  );
}
