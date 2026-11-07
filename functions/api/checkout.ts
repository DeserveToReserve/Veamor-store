import { clean, needsPhoto, parseLines, priceLines, validate, type Fields } from '../../src/lib/order';
import { notifyOrder } from '../../src/lib/telegram';
import { getCookie, json, safeEqual, sniffImage, type Env } from '../../src/lib/server';

const MAX_BODY = 8 * 1024 * 1024;
const MAX_PHOTO = 6 * 1024 * 1024;

export const onRequestPost = async ({ request, env, waitUntil }: { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void }) => {
  // 1. Same-origin + CSRF token
  if (request.headers.get('Origin') !== new URL(env.SITE_URL).origin) return json({ error: 'forbidden' }, 403);
  const token = request.headers.get('X-CSRF-Token') ?? '';
  const cookie = getCookie(request, '__Host-csrf');
  if (!token || !cookie || !safeEqual(token, cookie)) return json({ error: 'csrf' }, 403);

  // 2. Size / type limits before parsing
  if (!(request.headers.get('Content-Type') ?? '').startsWith('multipart/form-data')) return json({ error: 'type' }, 415);
  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY) return json({ error: 'too_large' }, 413);
  let form: FormData;
  try { form = await request.formData(); } catch { return json({ error: 'bad_request' }, 400); }

  const str = (k: string, max: number) => clean(form.get(k), max);
  if (str('website', 50)) return json({ ok: true, next: '/' }); // honeypot: bots get a fake success

  // 3. Re-validate everything server-side
  const lang = str('lang', 2) === 'en' ? 'en' : 'bg';
  const f: Fields = {
    name: str('name', 80), email: str('email', 120), phone: str('phone', 20), city: str('city', 60),
    address: str('address', 120), postal: str('postal', 10), note: str('note', 300), payment: str('payment', 4),
    consent: form.get('consent') === 'on',
  };
  const errors = validate(f);
  let lines: ReturnType<typeof parseLines> = null;
  try { lines = parseLines(JSON.parse(str('lines', 2000))); } catch { /* invalid */ }
  if (!lines) errors.cart = 'cart';

  const file = form.get('photo');
  const photo = file instanceof File && file.size > 0 ? file : null;
  let bytes: Uint8Array | null = null;
  let kind: ReturnType<typeof sniffImage> = null;
  if (photo) {
    if (photo.size > MAX_PHOTO) errors.photo = 'photo_size';
    else {
      bytes = new Uint8Array(await photo.arrayBuffer());
      kind = sniffImage(bytes);
      if (!kind) errors.photo = 'photo_type';
    }
  } else if (lines && needsPhoto(lines)) errors.photo = 'photo';
  if (Object.keys(errors).length) return json({ errors }, 422);

  // 4. Price from the catalog, store the order
  const { items, total } = priceLines(lines!, lang);
  const id = crypto.randomUUID();
  let photoKey: string | null = null;
  if (bytes && kind) {
    photoKey = `orders/${id}/photo.${kind.ext}`;
    await env.ORDERS.put(photoKey, bytes, { httpMetadata: { contentType: kind.type } });
  }
  const { consent: _c, ...customer } = f;
  const order = { id, createdAt: new Date().toISOString(), status: f.payment === 'card' ? 'pending_payment' : 'cod_pending', customer, lines: items, total, currency: 'EUR', photoKey };
  await env.ORDERS.put(`orders/${id}/order.json`, JSON.stringify(order), { httpMetadata: { contentType: 'application/json' } });

  // Telegram runs after the response is sent and can never make an order fail.
  const notify = () => waitUntil(notifyOrder(env, order, bytes && kind ? { bytes, type: kind.type } : null));
  const base = lang === 'en' ? '/en' : '';
  const next = `${base}/checkout/success/?o=${id}`;
  if (f.payment === 'cod') { notify(); return json({ ok: true, next }); }

  // 5. Card: hosted Stripe Checkout - card data never touches our site or servers
  const p = new URLSearchParams({
    mode: 'payment', locale: lang, customer_email: f.email, client_reference_id: id, 'metadata[order_id]': id,
    success_url: `${env.SITE_URL}${next}`, cancel_url: `${env.SITE_URL}${base}/checkout/`,
  });
  items.forEach((it, i) => {
    p.set(`line_items[${i}][quantity]`, String(it.qty));
    p.set(`line_items[${i}][price_data][currency]`, 'eur');
    p.set(`line_items[${i}][price_data][unit_amount]`, String(it.unit));
    p.set(`line_items[${i}][price_data][product_data][name]`, it.name);
  });
  const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded', 'Idempotency-Key': id },
    body: p,
  });
  const s = (await r.json()) as { url?: string };
  if (!r.ok || !s.url) return json({ error: 'payment_unavailable' }, 502);
  notify();
  return json({ ok: true, url: s.url });
};
