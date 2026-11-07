import { useEffect, useRef } from 'react';
import { products } from '../data/products';
import { basePath, type Lang } from '../i18n/ui';
import { h } from '../i18n/home';
import { s, type ShopKey } from '../i18n/shop';
import { euro } from '../lib/format';
import { useCart, priceOf, subtotalOf } from '../lib/cart';
import ProductArt from './ProductArt';

export default function CartDrawer({ lang }: { lang: Lang }) {
  const open = useCart((st) => st.open);
  const lines = useCart((st) => st.lines);
  const { setOpen, setQty, remove } = useCart.getState();
  const closeRef = useRef<HTMLButtonElement>(null);
  const tr = h(lang); const sh = s(lang); const base = basePath(lang);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; removeEventListener('keydown', onKey); };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={tr('cart.title')}>
      <button type="button" tabIndex={-1} aria-label={tr('cart.close')} className="drawer-fade absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
      <aside className="drawer-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-champagne/40 px-6 py-5">
          <h2 className="font-serif text-2xl">{tr('cart.title')}</h2>
          <button ref={closeRef} type="button" className="text-sm text-stone hover:text-gold-deep" onClick={() => setOpen(false)}>{tr('cart.close')}</button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <ProductArt kind="locket" className="h-28 w-28 text-champagne" />
            <p className="text-stone">{tr('cart.empty')}</p>
            <a href={`${base}/#collections`} onClick={() => setOpen(false)} className="text-sm underline decoration-champagne underline-offset-8 hover:text-gold-deep">{tr('cart.continue')}</a>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-champagne/40 overflow-y-auto px-6">
              {lines.map((l) => {
                const p = products.find((x) => x.slug === l.slug)!;
                const k = { slug: l.slug, metal: l.metal };
                return (
                  <li key={`${l.slug}:${l.metal}`} className="flex gap-4 py-5">
                    <div className="relative h-24 w-20 shrink-0 bg-gradient-to-b from-linen to-champagne/40">
                      <ProductArt kind={p.art} className="absolute inset-0 m-auto h-3/5 w-3/5 text-gold-deep" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <a href={`${base}/product/${p.slug}/`} className="font-serif text-lg leading-snug">{p.name[lang]}</a>
                      {l.metal && <p className="text-sm text-stone">{sh(`metal.${l.metal}` as ShopKey)}</p>}
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-champagne/70 text-sm">
                          <button type="button" className="h-8 w-8" aria-label="−" onClick={() => setQty(k, l.qty - 1)}>−</button>
                          <span className="w-6 text-center" aria-live="polite">{l.qty}</span>
                          <button type="button" className="h-8 w-8" aria-label="+" onClick={() => setQty(k, l.qty + 1)}>+</button>
                        </div>
                        <span className="text-sm">{euro(priceOf(l.slug) * l.qty, lang)}</span>
                      </div>
                      <button type="button" className="mt-2 w-fit text-xs text-stone underline decoration-champagne underline-offset-4 hover:text-gold-deep" onClick={() => remove(k)}>{tr('cart.remove')}</button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-champagne/40 px-6 py-6">
              <div className="flex items-baseline justify-between"><span>{tr('cart.subtotal')}</span><span className="font-serif text-2xl">{euro(subtotalOf(lines), lang)}</span></div>
              <p className="mt-2 text-xs text-stone">{tr('cart.note')}</p>
              <a href={`${base}/checkout/`} className="mt-5 block bg-ink py-3.5 text-center text-sm text-ivory transition-colors hover:bg-gold-deep">{tr('cart.checkout')}</a>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
