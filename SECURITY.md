# Veamor - security overview and go-live checklist

## What is in place
- **Static JAMstack**: Astro builds plain files for Cloudflare Pages; the only server code is 3 small Pages Functions (`functions/api`).
- **CSP**: `scripts/csp.mjs` runs after the build and writes `dist/_headers` with a per-page Content-Security-Policy. No `unsafe-inline`: Astro's inline bootstrap is allowed by SHA-256 hash. Fonts are self-hosted, `connect-src 'self'`, `frame-ancestors 'none'`, `form-action 'self'`, `object-src 'none'`.
- **Other headers**: HSTS (preload), `nosniff`, `X-Frame-Options: DENY`, strict Referrer-Policy, Permissions-Policy, COOP.
- **XSS**: React/Astro escape all output; user text is never written as HTML; images are shown via `blob:` URLs only.
- **CSRF**: double-submit token (`__Host-csrf`, HttpOnly, Secure, SameSite=Strict) plus an `Origin` check.
- **Validation**: the same rules (`src/lib/order.ts`) run in the browser and again on the server. Control characters are stripped, lengths are capped, a honeypot field catches bots.
- **Prices**: the cart stores only slug/variant/quantity. The server re-prices every order from the catalog.
- **Payments**: hosted Stripe Checkout. Card data never reaches this site (PCI SAQ A). The webhook verifies Stripe's HMAC signature with a 5-minute replay window.
- **Photos**: re-encoded in the browser (EXIF/GPS removed, max 2000 px), checked again on the server by magic bytes and size (6 MB), stored in a private R2 bucket under random IDs.
- **State**: Zustand cart in localStorage; invalid entries are discarded on load.

## Go-live checklist
1. `npm install && npm run build`
2. `npx wrangler r2 bucket create veamor-orders` (keep it private, no public access)
3. Set `SITE_URL` in `wrangler.toml` to the real domain (no trailing slash)
4. `npx wrangler pages secret put STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`
5. `npx wrangler pages deploy dist`
6. Stripe Dashboard -> Webhooks -> `https://<domain>/api/stripe-webhook`, event `checkout.session.completed`
7. Cloudflare Dashboard -> Security -> WAF: add a rate-limiting rule for `/api/*` (e.g. 10 requests/min per IP); optionally add Turnstile on the order form
8. Write the privacy policy and terms (orders contain names, addresses and photos)

## Not done yet
- Order notifications (email/Telegram) - orders currently land in R2 as `orders/<id>/order.json`
- Shipping costs, real prices, privacy/terms/returns pages

## Telegram order bot
New orders arrive in a Telegram chat (items, total, customer, address, note, and the photo for lockets) with a "mark as handled" button.
Card orders are announced when Stripe session is created ("awaiting payment") and again when Stripe confirms payment.
1. In Telegram open @BotFather -> `/newbot` -> copy the token (treat it like a password; never paste it in chats or commit it)
2. Send any message to your new bot (or add it to a group), then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `chat.id`
3. `npx wrangler pages secret put TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and `TELEGRAM_WEBHOOK_SECRET` (a long random string, letters/digits/_/- only)
4. Register the button webhook once:
   `curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" -d "url=https://<domain>/api/telegram-webhook" -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>" -d 'allowed_updates=["callback_query"]'`
- Only taps from the configured chat are accepted, and every request must carry the secret header.
- Telegram receives customer names, addresses and photos: mention it in the privacy policy.
