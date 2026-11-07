import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { products } from '../data/products';
import { basePath, type Lang } from '../i18n/ui';
import { c, type CKey } from '../i18n/checkout';
import { euro } from '../lib/format';
import { useCart, subtotalOf, priceOf } from '../lib/cart';
import { needsPhoto, validate, type FieldErrors, type Fields } from '../lib/order';
import ProductArt from './ProductArt';

const input = 'w-full border-0 border-b border-champagne bg-transparent py-2.5 text-base outline-none transition-colors focus:border-gold-deep';

// Re-encoding through a canvas shrinks the photo and drops EXIF (GPS etc.) before it leaves the device.
async function prepPhoto(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
  const cv = document.createElement('canvas');
  cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
  cv.getContext('2d')!.drawImage(bmp, 0, 0, cv.width, cv.height);
  return new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('encode'))), 'image/jpeg', 0.9));
}

export default function CheckoutForm({ lang }: { lang: Lang }) {
  const t = c(lang); const base = basePath(lang);
  const lines = useCart((s) => s.lines);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [f, setF] = useState<Fields>({ name: '', email: '', phone: '', city: '', address: '', postal: '', note: '', payment: 'card', consent: false });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [photo, setPhoto] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState('');
  const need = needsPhoto(lines);

  const err = (k: keyof FieldErrors) => errors[k] && <p id={`${k}-err`} className="mt-1 text-sm text-[#9b3d2f]">{t(`err.${errors[k]}` as CKey)}</p>;
  const field = (k: keyof Fields, type = 'text', auto = '') => (
    <div>
      <label htmlFor={k} className="text-sm text-stone">{t(k as CKey)}</label>
      <input id={k} name={k} type={type} autoComplete={auto} maxLength={k === 'note' ? 300 : 120} className={input}
        value={f[k] as string} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }))} />
      {err(k)}
    </div>
  );

  const onPhoto = async (file?: File) => {
    if (!file) return;
    setErrors((e) => ({ ...e, photo: undefined }));
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return setErrors((e) => ({ ...e, photo: 'photo_type' }));
    if (file.size > 15 * 1024 * 1024) return setErrors((e) => ({ ...e, photo: 'photo_size' }));
    try {
      const blob = await prepPhoto(file);
      if (photo) URL.revokeObjectURL(photo.url);
      setPhoto({ blob, url: URL.createObjectURL(blob) });
    } catch { setErrors((e) => ({ ...e, photo: 'photo_type' })); }
  };

  const submit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setFail('');
    const errs = validate(f);
    if (need && !photo) errs.photo = 'photo';
    if (!lines.length) errs.cart = 'cart';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const { token } = await (await fetch('/api/csrf', { credentials: 'same-origin' })).json();
      const fd = new FormData(ev.currentTarget); // includes the hidden honeypot field
      fd.set('consent', f.consent ? 'on' : '');
      fd.set('lang', lang);
      fd.set('lines', JSON.stringify(lines.map(({ slug, metal, qty }) => ({ slug, metal, qty }))));
      if (photo) fd.set('photo', photo.blob, 'photo.jpg');
      const r = await fetch('/api/checkout', { method: 'POST', body: fd, headers: { 'X-CSRF-Token': token }, credentials: 'same-origin' });
      const data = await r.json().catch(() => ({}));
      if (r.status === 422 && data.errors) { setErrors(data.errors); return; }
      if (!r.ok) { setFail(t(`err.${data.error === 'csrf' || data.error === 'payment_unavailable' ? data.error : 'server'}` as CKey)); return; }
      if (typeof data.url === 'string' && data.url.startsWith('https://checkout.stripe.com/')) location.assign(data.url);
      else if (typeof data.next === 'string' && data.next.startsWith('/') && !data.next.startsWith('//')) location.assign(data.next);
      else setFail(t('err.server'));
    } catch { setFail(t('err.server')); } finally { setBusy(false); }
  };

  if (mounted && lines.length === 0) {
    return (
      <div className="mt-16 text-center">
        <ProductArt kind="locket" className="mx-auto h-28 w-28 text-champagne" />
        <p className="mt-6 text-stone">{t('empty')}</p>
        <a href={`${base}/`} className="mt-6 inline-block text-sm underline decoration-champagne underline-offset-8 hover:text-gold-deep">{t('back')}</a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mt-10 grid gap-12 md:grid-cols-12 md:gap-16">
      <div className="space-y-12 md:col-span-7">
        <fieldset className="space-y-6"><legend className="mb-2 font-serif text-2xl">{t('sec.contact')}</legend>
          {field('name', 'text', 'name')}{field('email', 'email', 'email')}{field('phone', 'tel', 'tel')}
        </fieldset>
        <fieldset className="space-y-6"><legend className="mb-2 font-serif text-2xl">{t('sec.delivery')}</legend>
          {field('city', 'text', 'address-level2')}{field('address', 'text', 'street-address')}{field('postal', 'text', 'postal-code')}{field('note')}
        </fieldset>

        {need && (
          <fieldset><legend className="mb-2 font-serif text-2xl">{t('sec.photo')}</legend>
            <p className="text-sm leading-relaxed text-stone">{t('photo.hint')}</p>
            <div className="mt-5 flex items-center gap-5">
              {photo && <img src={photo.url} alt="" className="h-24 w-24 object-cover" />}
              <label className="cursor-pointer border border-champagne px-6 py-3 text-sm transition-colors hover:border-gold-deep">
                {photo ? t('photo.replace') : t('photo.choose')}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => onPhoto(e.target.files?.[0])} />
              </label>
            </div>
            {err('photo')}
          </fieldset>
        )}

        <fieldset><legend className="mb-4 font-serif text-2xl">{t('sec.payment')}</legend>
          <div className="grid gap-3">
            {(['card', 'cod'] as const).map((m) => (
              <label key={m} className={`flex cursor-pointer gap-4 border p-4 transition-colors ${f.payment === m ? 'border-gold-deep' : 'border-champagne/60'}`}>
                <input type="radio" name="payment" value={m} checked={f.payment === m} onChange={() => setF((p) => ({ ...p, payment: m }))} className="mt-1 accent-[#8a6a2f]" />
                <span><span className="block">{t(`pay.${m}` as CKey)}</span><span className="mt-1 block text-sm text-stone">{t(`pay.${m}.d` as CKey)}</span></span>
              </label>
            ))}
          </div>
          {err('payment')}
        </fieldset>

        <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

        <div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={f.consent} onChange={(e) => setF((p) => ({ ...p, consent: e.target.checked }))} className="mt-1 accent-[#8a6a2f]" aria-invalid={!!errors.consent} />
            <span>{t('consent')}</span>
          </label>
          {err('consent')}
        </div>
      </div>

      <aside className="md:col-span-5">
        <div className="bg-linen/70 p-6 md:sticky md:top-28 md:p-8">
          <h2 className="font-serif text-2xl">{t('sum.title')}</h2>
          <ul className="mt-6 divide-y divide-champagne/40">
            {mounted && lines.map((l) => {
              const p = products.find((x) => x.slug === l.slug)!;
              return (
                <li key={`${l.slug}:${l.metal}`} className="flex gap-4 py-4">
                  <div className="relative h-16 w-14 shrink-0 bg-gradient-to-b from-ivory to-champagne/40"><ProductArt kind={p.art} className="absolute inset-0 m-auto h-3/5 w-3/5 text-gold-deep" /></div>
                  <div className="flex-1 text-sm"><p className="font-serif text-base leading-snug">{p.name[lang]}</p><p className="text-stone">× {l.qty}</p></div>
                  <span className="text-sm">{euro(priceOf(l.slug) * l.qty, lang)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-champagne/60 pt-4"><span>{t('sum.total')}</span><span className="font-serif text-2xl">{euro(mounted ? subtotalOf(lines) : 0, lang)}</span></div>
          <p className="mt-2 text-xs text-stone">{t('sum.ship')}</p>
          {err('cart')}
          {fail && <p role="alert" className="mt-4 text-sm text-[#9b3d2f]">{fail}</p>}
          <button type="submit" disabled={busy} className="mt-6 w-full bg-ink py-3.5 text-sm text-ivory transition-colors hover:bg-gold-deep disabled:opacity-60">
            {busy ? t('sending') : f.payment === 'card' ? t('submit.card') : t('submit.cod')}
          </button>
          <p className="mt-4 text-xs leading-relaxed text-stone">{t('secure')}</p>
        </div>
      </aside>
    </form>
  );
}
