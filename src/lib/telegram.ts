import type { Env } from './server';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Telegram HTML mode
const eur = (c: number) => `${(c / 100).toFixed(2)} €`;
const enabled = (env: Env) => !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
const endpoint = (env: Env, method: string) => `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`;

export const tg = (env: Env, method: string, payload: Record<string, unknown>) =>
  fetch(endpoint(env, method), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

interface OrderLike {
  id: string;
  customer: { name: string; email: string; phone: string; city: string; address: string; postal: string; note: string; payment: string };
  lines: { name: string; qty: number; unit: number }[];
  total: number;
}

export async function notifyOrder(env: Env, o: OrderLike, photo: { bytes: Uint8Array; type: string } | null) {
  if (!enabled(env)) return;
  try {
    const c = o.customer;
    const short = o.id.slice(0, 8).toUpperCase();
    const text = [
      `🛍 <b>Нова поръчка #${short}</b>`,
      c.payment === 'card' ? '💳 Карта – чака плащане' : '💵 Наложен платеж',
      '',
      ...o.lines.map((l) => `• ${esc(l.name)} × ${l.qty} – ${eur(l.unit * l.qty)}`),
      `<b>Общо: ${eur(o.total)}</b>`,
      '',
      `👤 ${esc(c.name)}`,
      `📞 ${esc(c.phone)}`,
      `✉️ ${esc(c.email)}`,
      `📍 ${esc(`${c.postal} ${c.city}, ${c.address}`)}`,
      c.note ? `📝 ${esc(c.note)}` : '',
      photo ? '📷 Снимката е в следващото съобщение' : '',
    ].filter((x, i, a) => x !== '' || a[i - 1] !== '').join('\n');

    await tg(env, 'sendMessage', {
      chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true,
      reply_markup: { inline_keyboard: [[{ text: '✔️ Маркирай като обработена', callback_data: `done:${o.id}` }]] },
    });
    if (photo) {
      const fd = new FormData();
      fd.set('chat_id', String(env.TELEGRAM_CHAT_ID));
      fd.set('caption', `📷 #${short}`);
      fd.set('photo', new Blob([photo.bytes], { type: photo.type }), 'photo');
      await fetch(endpoint(env, 'sendPhoto'), { method: 'POST', body: fd });
    }
  } catch { /* an unreachable Telegram must never break an order */ }
}

export async function notifyPaid(env: Env, id: string, cents?: number) {
  if (!enabled(env)) return;
  try {
    await tg(env, 'sendMessage', { chat_id: env.TELEGRAM_CHAT_ID, parse_mode: 'HTML', text: `✅ <b>Платена поръчка #${id.slice(0, 8).toUpperCase()}</b>\nСума: ${eur(cents ?? 0)}` });
  } catch { /* ignore */ }
}
