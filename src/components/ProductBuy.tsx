import { useState } from 'react';
import type { Product } from '../data/products';
import { details } from '../data/details';
import type { Lang } from '../i18n/ui';
import { s, type ShopKey } from '../i18n/shop';
import { euro, swatch } from '../lib/format';
import ProductArt from './ProductArt';
import { useCart } from '../lib/cart';

const tones = [
  'from-linen to-champagne/40', 'from-ivory to-linen', 'from-linen to-ivory', 'from-ivory to-[#eddcd0]',
] as const;

export default function ProductBuy({ lang, product }: { lang: Lang; product: Product }) {
  const tr = s(lang);
  const d = details[product.slug];
  const [shot, setShot] = useState(0);
  const [metal, setMetal] = useState(product.metals[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const add = () => {
    useCart.getState().add({ slug: product.slug, metal: d.pick ? metal : null, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-14">
      <div className="md:col-span-7">
        <div className={`relative aspect-[4/5] bg-gradient-to-b md:aspect-square ${tones[shot]}`}>
          <ProductArt kind={product.art} className="absolute inset-0 m-auto h-2/3 w-2/3 text-gold-deep" />
          <p className="absolute bottom-4 left-5 text-xs text-stone">{tr('pdp.shot')} {shot + 1}/{tones.length}</p>
        </div>
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {tones.map((tn, i) => (
            <li key={tn}>
              <button type="button" onClick={() => setShot(i)} aria-label={`${tr('pdp.shot')} ${i + 1}`} aria-current={shot === i}
                className={`relative block aspect-square w-full border bg-gradient-to-b transition-colors ${tn} ${shot === i ? 'border-gold-deep' : 'border-transparent hover:border-champagne'}`}>
                <ProductArt kind={product.art} className="absolute inset-0 m-auto h-3/5 w-3/5 text-gold-deep" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-5 md:pt-2">
        <h1 className="font-serif text-4xl font-light leading-tight md:text-5xl">{product.name[lang]}</h1>
        <p className="mt-3 text-stone">{product.note[lang]}</p>
        <p className="mt-6 text-2xl">{euro(product.price, lang)}</p>
        <p className="mt-6 max-w-md leading-relaxed text-stone">{d.desc[lang]}</p>

        {d.pick && (
          <fieldset className="mt-8">
            <legend className="text-sm">{tr('pdp.color')}: <span className="text-stone">{tr(`metal.${metal}` as ShopKey)}</span></legend>
            <div className="mt-3 flex gap-3">
              {product.metals.map((m) => (
                <button key={m} type="button" onClick={() => setMetal(m)} aria-pressed={metal === m} aria-label={tr(`metal.${m}` as ShopKey)}
                  className={`h-9 w-9 rounded-full border transition-shadow ${swatch[m]} ${metal === m ? 'border-transparent ring-2 ring-gold-deep ring-offset-2 ring-offset-ivory' : 'border-ink/20'}`} />
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-8 flex items-stretch gap-4">
          <div className="flex items-center border border-champagne/70" role="group" aria-label={tr('pdp.qty')}>
            <button type="button" className="h-12 w-11 text-lg" aria-label="−" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="w-8 text-center text-sm" aria-live="polite">{qty}</span>
            <button type="button" className="h-12 w-11 text-lg" aria-label="+" onClick={() => setQty((q) => Math.min(10, q + 1))}>+</button>
          </div>
          <button type="button" onClick={add} className={`h-12 flex-1 px-6 text-sm text-ivory transition-colors ${added ? 'bg-gold-deep' : 'bg-ink hover:bg-gold-deep'}`}>
            {added ? tr('pdp.added') : tr('pdp.add')}
          </button>
        </div>

        <ul className="mt-10 space-y-3 border-t border-champagne/50 pt-6 text-sm text-stone">
          {d.list[lang].map((x) => <li key={x}>{x}</li>)}
        </ul>
      </div>
    </div>
  );
}
