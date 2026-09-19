import { Leaf } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          light ? "bg-primary-foreground/15 text-accent" : "bg-primary/10 text-primary"
        }`}
      >
        <Leaf className="h-5 w-5" />
      </span>
      <span className="leading-tight">
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
