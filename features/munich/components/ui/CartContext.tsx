"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type CartCtx = {
  count: number;
  size: number | null;
  setSize: (s: number) => void;
  add: () => void;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [size, setSize] = useState<number | null>(42);
  const value = useMemo(
    () => ({
      count,
      size,
      setSize,
      add: () => setCount((c) => c + 1),
    }),
    [count, size],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside provider");
  return ctx;
}
