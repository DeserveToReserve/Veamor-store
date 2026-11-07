import { useEffect, useState } from 'react';
import { useCart, countOf } from '../lib/cart';
import { h } from '../i18n/home';
import type { Lang } from '../i18n/ui';

export default function CartButton({ lang }: { lang: Lang }) {
  const count = useCart((s) => countOf(s.lines));
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []); // avoids a server/client mismatch for the badge
  const shown = mounted && count > 0;
  return (
    <button type="button" className="relative" aria-label={`${h(lang)('cart.title')}${shown ? ` (${count})` : ''}`} onClick={() => useCart.getState().setOpen(true)}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2" /></svg>
      {shown && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold-deep px-1 text-[10px] text-ivory">{count}</span>}
    </button>
  );
}
