import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Weight } from "./products";

export type CartItem = {
  id: string;
  name: string;
  weight: Weight;
  price: number;
  image: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, weight: Weight, qty: number) => void;
  removeItem: (id: string, weight: Weight) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "pango-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, loaded]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
      addItem: (item, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((i) => i.id === item.id && i.weight === item.weight);
          if (found) {
            return prev.map((i) =>
              i.id === item.id && i.weight === item.weight ? { ...i, qty: i.qty + qty } : i,
            );
          }
          return [...prev, { ...item, qty }];
        }),
      setQty: (id, weight, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => !(i.id === id && i.weight === weight))
            : prev.map((i) => (i.id === id && i.weight === weight ? { ...i, qty } : i)),
        ),
      removeItem: (id, weight) =>
        setItems((prev) => prev.filter((i) => !(i.id === id && i.weight === weight))),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
