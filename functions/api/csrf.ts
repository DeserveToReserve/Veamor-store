import { b64url, json } from '../../src/lib/server';

// Double-submit token: the cookie is HttpOnly + __Host- + SameSite=Strict, the same value is returned
// in the body and must come back in the X-CSRF-Token header. A third-party site can do neither.
export const onRequestGet = async () => {
  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  return json({ token }, 200, { 'Set-Cookie': `__Host-csrf=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=3600` });
};
