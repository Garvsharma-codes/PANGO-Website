import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/products";

export function FloatingWhatsApp() {
  return (
    <a
      href={waLink("Hi Pango Dry Fruits! I'd like to know more about your products.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="pill-btn fixed bottom-5 right-5 z-50 h-14 w-14 bg-whatsapp text-primary-foreground shadow-lift hover:opacity-90"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
