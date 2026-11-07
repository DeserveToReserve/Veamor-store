// Post-build: writes dist/_headers with a strict per-page CSP. Astro's island bootstrap is an inline
// <script>/<style>, so instead of 'unsafe-inline' every inline block is allowed by its SHA-256 hash.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
const hash = (s) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`;
const inline = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)</${tag}>`, 'g'))]
  .filter(([, attrs, body]) => !/\ssrc=/.test(attrs) && !/ld\+json/.test(attrs) && body.trim()).map(([, , body]) => hash(body));

const csp = (scripts, styles) => [
  "default-src 'self'",
  `script-src 'self' ${scripts.join(' ')}`.trim(),
  `style-src 'self' ${styles.join(' ')}`.trim(),
  "img-src 'self' data: blob:", "font-src 'self'", "connect-src 'self'",
  "object-src 'none'", "base-uri 'none'", "form-action 'self'", "frame-ancestors 'none'", 'upgrade-insecure-requests',
].join('; ');

let out = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;
let pages = 0;
for (const file of walk(dist).filter((f) => f.endsWith('.html') && !f.endsWith('404.html'))) {
  const route = '/' + relative(dist, file).split(sep).join('/').replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  out += `\n${route}\n  Content-Security-Policy: ${csp(inline(html, 'script'), inline(html, 'style'))}\n`;
  pages++;
}
writeFileSync(join(dist, '_headers'), out);
console.log(`CSP written for ${pages} pages`);
