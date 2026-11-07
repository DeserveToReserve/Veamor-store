import { safeEqual, type Env } from '../../src/lib/server';
import { tg } from '../../src/lib/telegram';

// Receives the "mark as handled" button presses. Telegram sends the secret we set in setWebhook
// in a header; only taps coming from the configured chat are accepted.
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const secret = env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || !safeEqual(request.headers.get('X-Telegram-Bot-Api-Secret-Token') ?? '', secret)) return new Response('forbidden', { status: 403 });

  const update = (await request.json().catch(() => null)) as { callback_query?: any } | null;
  const cb = update?.callback_query;
  if (!cb || String(cb.message?.chat?.id) !== String(env.TELEGRAM_CHAT_ID)) return new Response('ok');

  if (typeof cb.data === 'string' && /^done:[0-9a-f-]{36}$/.test(cb.data)) {
    const id = cb.data.slice(5);
    await env.ORDERS.put(`orders/${id}/handled.json`, JSON.stringify({ handledAt: new Date().toISOString(), by: cb.from?.id ?? null }), { httpMetadata: { contentType: 'application/json' } });
    await tg(env, 'editMessageReplyMarkup', { chat_id: cb.message.chat.id, message_id: cb.message.message_id, reply_markup: { inline_keyboard: [[{ text: '✅ Обработена', callback_data: 'noop' }]] } });
  }
  await tg(env, 'answerCallbackQuery', { callback_query_id: cb.id });
  return new Response('ok');
};
