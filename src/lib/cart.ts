import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { products, type Metal } from '../data/products';

// The cart stores ONLY slug / variant / quantity. Prices and names always come from the
// catalog, so tampering with localStorage can never change what a customer is charged
// (the server must re-price the order again in Stage 5).
export interface Line { slug: string; metal: Metal | null; qty: number }
type Key = Pick<Line, 'slug' | 'metal'>;

const MAX = 10;
const METALS = ['steel', 'gold', 'black', 'white'];
const isLine = (l: unknown): l is Line => {
  const x = l as Line;
  return !!x && products.some((p) => p.slug === x.slug) && Number.isInteger(x.qty) && x.qty >= 1 && x.qty <= MAX
    && (x.metal === null || METALS.includes(x.metal));
};
const same = (a: Key, b: Key) => a.slug === b.slug && a.metal === b.metal;

interface CartState {
  lines: Line[];
  open: boolean;
  add: (l: Line) => void;
  setQty: (k: Key, qty: number) => void;
  remove: (k: Key) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      add: (l) => set((s) => {
        const i = s.lines.findIndex((x) => same(x, l));
        if (i < 0) return { lines: [...s.lines, { ...l, qty: Math.min(MAX, l.qty) }], open: true };
        const lines = s.lines.slice();
        lines[i] = { ...lines[i], qty: Math.min(MAX, lines[i].qty + l.qty) };
        return { lines, open: true };
      }),
      setQty: (k, qty) => set((s) => ({ lines: s.lines.map((x) => (same(x, k) ? { ...x, qty: Math.min(MAX, Math.max(1, qty)) } : x)) })),
      remove: (k) => set((s) => ({ lines: s.lines.filter((x) => !same(x, k)) })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: 'veamor-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ lines: s.lines }),
      // Never trust stored data: drop anything that is not a valid line.
      merge: (persisted, current) => {
        const l = (persisted as { lines?: unknown } | undefined)?.lines;
        return { ...current, lines: Array.isArray(l) ? l.filter(isLine) : [] };
      },
    },
  ),
);

if (typeof window !== 'undefined') {
  void useCart.persist.rehydrate();
  addEventListener('storage', (e) => { if (e.key === 'veamor-cart') void useCart.persist.rehydrate(); });
}

export const priceOf = (slug: string) => products.find((p) => p.slug === slug)?.price ?? 0;
export const countOf = (lines: Line[]) => lines.reduce((n, l) => n + l.qty, 0);
export const subtotalOf = (lines: Line[]) => lines.reduce((n, l) => n + priceOf(l.slug) * l.qty, 0);
