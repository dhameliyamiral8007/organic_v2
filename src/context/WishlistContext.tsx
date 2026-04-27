import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import type { Product } from "@/types";

const KEY = "nisarg_wishlist";

interface WishlistContextValue {
  items: Product[];
  has: (id: string | number) => boolean;
  toggle: (p: Product) => void;
  remove: (id: string | number) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Product[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      has: (id) => items.some((p) => String(p.id) === String(id)),
      toggle: (p) =>
        setItems((prev) =>
          prev.some((x) => String(x.id) === String(p.id))
            ? prev.filter((x) => String(x.id) !== String(p.id))
            : [p, ...prev]
        ),
      remove: (id) => setItems((prev) => prev.filter((x) => String(x.id) !== String(id))),
      clear: () => setItems([]),
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};
