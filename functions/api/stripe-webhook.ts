import { notifyPaid } from '../../src/lib/telegram';
import { safeEqual, type Env } from '../../src/lib/server';

const enc = (s: string) => new TextEncoder().encode(s);
const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, '0')).join('');

// Verifies Stripe's HMAC signature (and a 5-minute replay window) before trusting the event.
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const body = await request.text();
  const sig = request.headers.get('Stripe-Signature') ?? '';
  const t = sig.match(/t=(\d+)/)?.[1];
  const v1 = [...sig.matchAll(/v1=([0-9a-f]+)/g)].map((m) => m[1]);
  if (!t || !v1.length || Math.abs(Date.now() / 1000 - Number(t)) > 300) return new Response('bad request', { status: 400 });

  const key = await crypto.subtle.importKey('raw', enc(env.STRIPE_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = hex(new Uint8Array(await crypto.subtle.sign('HMAC', key, enc(`${t}.${body}`))));
  if (!v1.some((v) => safeEqual(v, mac))) return new Response('bad signature', { status: 400 });

  const ev = JSON.parse(body);
  const o = ev?.data?.object;
  if (ev.type === 'checkout.session.completed' && o?.payment_status === 'paid' && /^[0-9a-f-]{36}$/.test(o.client_reference_id ?? '')) {
    await env.ORDERS.put(`orders/${o.client_reference_id}/paid.json`, JSON.stringify({ paidAt: new Date().toISOString(), session: o.id, amountTotal: o.amount_total }), { httpMetadata: { contentType: 'application/json' } });
    await notifyPaid(env, o.client_reference_id, o.amount_total);
  }
  return new Response('ok');
};
