// Shared by the browser form AND the Cloudflare Function: the server never trusts the client.
import { products } from '../data/products';
import { details } from '../data/details';
import type { Lang } from '../i18n/ui';

export interface Fields { name: string; email: string; phone: string; city: string; address: string; postal: string; note: string; payment: string; consent: boolean }
export type ErrorCode = 'required' | 'email' | 'phone' | 'postal' | 'consent' | 'payment' | 'photo' | 'photo_type' | 'photo_size' | 'cart';
export type FieldErrors = Partial<Record<keyof Fields | 'photo' | 'cart', ErrorCode>>;
export interface CartLine { slug: string; metal: string | null; qty: number }

export const clean = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';

export function validate(f: Fields): FieldErrors {
  const e: FieldErrors = {};
  if (f.name.length < 2) e.name = 'required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'email';
  if (!/^\+?[0-9 ()-]{7,20}$/.test(f.phone)) e.phone = 'phone';
  if (f.city.length < 2) e.city = 'required';
  if (f.address.length < 5) e.address = 'required';
  if (!/^[0-9A-Za-z -]{4,10}$/.test(f.postal)) e.postal = 'postal';
  if (f.payment !== 'card' && f.payment !== 'cod') e.payment = 'payment';
  if (!f.consent) e.consent = 'consent';
  return e;
}

export function parseLines(raw: unknown): CartLine[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 20) return null;
  const out: CartLine[] = [];
  for (const l of raw) {
    const p = products.find((x) => x.slug === l?.slug);
    if (!p || !Number.isInteger(l.qty) || l.qty < 1 || l.qty > 10) return null;
    const metal = l.metal ?? null;
    if (metal !== null && !(p.metals as string[]).includes(metal)) return null;
    out.push({ slug: p.slug, metal, qty: l.qty });
  }
  return out;
}

export const needsPhoto = (lines: CartLine[]) => lines.some((l) => details[l.slug]?.photo);

// Prices always come from the catalog, never from the request.
export function priceLines(lines: CartLine[], lang: Lang) {
  const items = lines.map((l) => {
    const p = products.find((x) => x.slug === l.slug)!;
    return { slug: l.slug, metal: l.metal, qty: l.qty, unit: p.price, name: p.name[lang] + (l.metal ? ` (${l.metal})` : '') };
  });
  return { items, total: items.reduce((n, i) => n + i.unit * i.qty, 0) };
}
