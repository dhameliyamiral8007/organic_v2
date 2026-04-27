import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import type { CartItem, Product } from "@/types";
import { effectivePrice } from "@/lib/product";

const KEY = "nisarg_cart";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, quantity?: number, variantIndex?: number) => void;
  remove: (productId: string | number, variantIndex?: number) => void;
  setQty: (productId: string | number, quantity: number, variantIndex?: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const sameLine = (a: CartItem, productId: string | number, variantIndex?: number) =>
  String(a.productId) === String(productId) && (a.variantIndex ?? 0) === (variantIndex ?? 0);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add: CartContextValue["add"] = (product, quantity = 1, variantIndex) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => sameLine(i, product.id, variantIndex));
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { productId: product.id, product, quantity, variantIndex }];
    });
  };

  const remove: CartContextValue["remove"] = (productId, variantIndex) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, productId, variantIndex)));
  };

  const setQty: CartContextValue["setQty"] = (productId, quantity, variantIndex) => {
    setItems((prev) =>
      prev
        .map((i) => (sameLine(i, productId, variantIndex) ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clear = () => setItems([]);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce(
      (s, i) => s + effectivePrice(i.product, i.variantIndex) * i.quantity,
      0
    );
    return { items, count, subtotal, add, remove, setQty, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
