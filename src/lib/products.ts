import badam from "@/assets/badam.jpg";
import kaju from "@/assets/kaju.jpg";
import pista from "@/assets/pista.jpg";
import walnut from "@/assets/walnut.jpg";
import makhana from "@/assets/makhana.jpg";
import kishmish from "@/assets/kishmish.jpg";
import anjeer from "@/assets/anjeer.jpg";
import dates from "@/assets/dates.jpg";
import seeds from "@/assets/seeds.jpg";
import snacks from "@/assets/snacks.jpg";
import ajwaDates from "@/assets/ajwa_dates.png";
import flavouredBadam from "@/assets/flavoured_badam.png";
import kajuTukda from "@/assets/kaju_tukda.png";
import kaliKishmish from "@/assets/kali_kishmish.png";
import gourbandiBadam from "@/assets/gourbandi_badam.png";
import sonoraBadam from "@/assets/sonora_badam.png";
import walnutInShell from "@/assets/wallnut_in_shell.png";

export type Weight = "250g" | "500g" | "1kg";

export const WEIGHTS: Weight[] = ["250g", "500g", "1kg"];

export type Product = {
  id: string;
  name: string;
  category: Category;
  image: string;
  prices: Partial<Record<Weight, number>>;
};

export const CATEGORIES = [
  "Badam",
  "Kaju (Cashew)",
  "Pista",
  "Walnut",
  "Makhana",
  "Kishmish",
  "Anjeer",
  "Dates",
  "Healthy Seeds",
  "Healthy Snacks & Candies",
  "Special Item",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_IMAGES: Record<Category, string> = {
  Badam: badam,
  "Kaju (Cashew)": kaju,
  Pista: pista,
  Walnut: walnut,
  Makhana: makhana,
  Kishmish: kishmish,
  Anjeer: anjeer,
  Dates: dates,
  "Healthy Seeds": seeds,
  "Healthy Snacks & Candies": snacks,
  "Special Item": badam,
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function p(
  name: string,
  category: Category,
  prices: Partial<Record<Weight, number>>,
  image = CATEGORY_IMAGES[category],
): Product {
  return { id: slug(name), name, category, image, prices };
}

export const PRODUCTS: Product[] = [
  p("Badam Giri", "Badam", { "250g": 300, "500g": 595, "1kg": 1180 }),
  p("Sonora Badam", "Badam", { "250g": 395, "500g": 780, "1kg": 1560 }, sonoraBadam),
  p("Gourbandi Badam", "Badam", { "250g": 360, "500g": 705, "1kg": 1400 }, gourbandiBadam),

  p("Premium Cashew", "Kaju (Cashew)", { "250g": 320, "500g": 630, "1kg": 1250 }),
  p("Classic Cashew", "Kaju (Cashew)", { "250g": 275, "500g": 535, "1kg": 1060 }),
  p("Kaju Tukda", "Kaju (Cashew)", { "250g": 240, "500g": 470, "1kg": 910 }, kajuTukda),

  p("Roasted Pista", "Pista", { "250g": 500, "500g": 980, "1kg": 1950 }),

  p("Classic Walnut", "Walnut", { "250g": 370, "500g": 730, "1kg": 1450 }),
  p("Premium Walnut", "Walnut", { "250g": 420, "500g": 830, "1kg": 1650 }),
  p("Walnut in Shell", "Walnut", { "250g": 230, "500g": 445, "1kg": 880 }, walnutInShell),

  p("Classic Makhana", "Makhana", { "250g": 345, "500g": 680, "1kg": 1350 }),
  p("Premium Makhana", "Makhana", { "250g": 395, "500g": 780, "1kg": 1560 }),

  p("Premium Cream Kishmish", "Kishmish", { "250g": 195, "500g": 385, "1kg": 760 }),
  p("Gold Kishmish", "Kishmish", { "250g": 175, "500g": 335, "1kg": 660 }),
  p("Kali Kishmish", "Kishmish", { "250g": 195, "500g": 385, "1kg": 760 }, kaliKishmish),

  p("Classic Anjeer", "Anjeer", { "250g": 305, "500g": 595, "1kg": 1180 }),

  p("Premium Dates", "Dates", { "250g": 160, "500g": 300, "1kg": 600 }),
  p("Ajwa Dates", "Dates", { "250g": 205, "500g": 400, "1kg": 780 }, ajwaDates),

  p("Tarbooj Seeds", "Healthy Seeds", { "250g": 180, "500g": 345, "1kg": 680 }),
  p("Kharbuja Seeds", "Healthy Seeds", { "250g": 180, "500g": 345, "1kg": 680 }),
  p("Pumpkin Seeds", "Healthy Seeds", { "250g": 190, "500g": 365, "1kg": 720 }),
  p("Flax (Alsi) Seeds", "Healthy Seeds", { "250g": 65, "500g": 120 }),

  p("Amla Candy (With Sugar)", "Healthy Snacks & Candies", { "500g": 165, "1kg": 320 }),
  p("Amla Candy (Without Sugar)", "Healthy Snacks & Candies", { "500g": 165, "1kg": 320 }),
  p("Paan Shots", "Healthy Snacks & Candies", { "500g": 385, "1kg": 760 }),
  p("Cranberry", "Healthy Snacks & Candies", { "500g": 355, "1kg": 700 }),
  p("Munakka", "Healthy Snacks & Candies", { "500g": 495, "1kg": 980 }),
  p("Mexican Seeds Mix", "Healthy Snacks & Candies", { "500g": 405, "1kg": 800 }),
  p("Protein Seeds Mix", "Healthy Snacks & Candies", { "500g": 450, "1kg": 900 }),
  p("Mix Berry", "Healthy Snacks & Candies", { "500g": 500, "1kg": 1000 }),
  p("Trail Mix (Dry Fruits, Nuts & Seeds)", "Healthy Snacks & Candies", {
    "500g": 500,
    "1kg": 1000,
  }),

  p("Flavoured Badam", "Special Item", { "250g": 310, "500g": 600, "1kg": 1080 }, flavouredBadam),
];

export const FEATURED_IDS = [
  "badam-giri",
  "premium-cashew",
  "roasted-pista",
  "classic-walnut",
  "trail-mix-dry-fruits-nuts-seeds",
  "ajwa-dates",
  "flavoured-badam",
  "premium-makhana",
];

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");

export const startingPrice = (product: Product) =>
  Math.min(...Object.values(product.prices).filter((v): v is number => typeof v === "number"));

export const WHATSAPP_NUMBER = "918920163426";

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
