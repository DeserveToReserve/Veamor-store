import { useEffect, useState } from 'react';
import { products } from '../data/products';
import { basePath, type Lang } from '../i18n/ui';
import { s } from '../i18n/shop';
import ProductArt from './ProductArt';

const filters = ['all', 'jewelry', 'couples', 'family'] as const;
type Filter = (typeof filters)[number];

const tone = {
  warm: 'bg-gradient-to-b from-linen to-champagne/40',
  pale: 'bg-gradient-to-b from-ivory to-linen',
  sand: 'bg-gradient-to-b from-linen to-ivory',
  rose: 'bg-gradient-to-b from-ivory to-[#eddcd0]',
} as const;
import { euro, swatch } from '../lib/format';

export default function ProductGrid({ lang }: { lang: Lang }) {
  const tr = s(lang);
  const base = basePath(lang);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    const sync = () => {
      const hash = location.hash.slice(1);
      if ((filters as readonly string[]).includes(hash)) setFilter(hash as Filter);
    };
    sync();
    addEventListener('hashchange', sync);
    return () => removeEventListener('hashchange', sync);
  }, []);

  const names: Record<Filter, string> = {
    all: tr('cat.all'),
    jewelry: lang === 'bg' ? 'Бижута' : 'Jewelry',
    couples: lang === 'bg' ? 'За двойки' : 'For couples',
    family: lang === 'bg' ? 'За семейството' : 'For family',
  };
  const list = products.filter((p) => filter === 'all' || p.category === filter);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-serif text-4xl font-light md:text-5xl">{tr('cat.title')}</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2" role="group">
          {filters.map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}
              className={`border-b pb-1 text-sm transition-colors ${filter === f ? 'border-gold-deep text-ink' : 'border-transparent text-stone hover:text-gold-deep'}`}>
              {names[f]}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? <p className="mt-12 text-stone">{tr('cat.empty')}</p> : (
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
          {list.map((p) => (
            <li key={p.slug}>
              <a href={`${base}/product/${p.slug}/`} className="group block">
                <div className={`relative aspect-[4/5] overflow-hidden ${tone[p.tone]}`}>
                  <ProductArt kind={p.art} className="absolute inset-0 m-auto h-3/5 w-3/5 text-gold-deep transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="mt-4 font-serif text-xl leading-snug">{p.name[lang]}</h3>
                <p className="mt-1 text-sm text-stone">{p.note[lang]}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm">{euro(p.price, lang)}</span>
                  <span className="flex gap-1.5" aria-hidden="true">
                    {p.metals.map((m) => <span key={m} className={`h-3 w-3 rounded-full border border-ink/20 ${swatch[m]}`} />)}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
