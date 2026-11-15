import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

type Env = {
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  SESSION_SECRET?: string;
  ELEVENLABS_API_KEY?: string;
  ELEVENLABS_VOICE_ID?: string;
};

const ADMIN_EMAIL = '3asfuur@gmail.com';
const SESSION_DAYS = 30;
const enc = new TextEncoder();

const b64u = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64u = (s: string) => {
  const p = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob(p);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};
const hmac = async (secret: string, data: string) => {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  return key;
};
const sign = async (secret: string, data: string) => {
  const key = await hmac(secret, data);
  return b64u(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
};
const verify = async (secret: string, data: string, sig: string) => {
  const key = await hmac(secret, data);
  try {
    return await crypto.subtle.verify('HMAC', key, fromB64u(sig), enc.encode(data));
  } catch {
    return false;
  }
};

type SessionUser = { email: string; name: string; picture: string; exp: number };

const readCookie = (header: string | null, name: string) => {
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
};

async function getUser(req: Request, env: Env): Promise<SessionUser | null> {
  if (!env.SESSION_SECRET) return null;
  const raw = readCookie(req.headers.get('cookie'), 'dsess');
  if (!raw) return null;
  const [payload, sig] = raw.split('.');
  if (!payload || !sig || !(await verify(env.SESSION_SECRET, payload, sig))) return null;
  try {
    const u = JSON.parse(new TextDecoder().decode(fromB64u(payload))) as SessionUser;
    return u.exp > Date.now() / 1000 ? u : null;
  } catch {
    return null;
  }
}

const app = new Hono<{ Bindings: Env }>().basePath('/api');

app.get('/health', (c) =>
  c.json({
    ok: true,
    app: 'deutschy',
    auth: Boolean(c.env.GOOGLE_CLIENT_ID && c.env.GOOGLE_CLIENT_SECRET && c.env.SESSION_SECRET),
    tts: Boolean(c.env.ELEVENLABS_API_KEY),
  }),
);

app.get('/auth/google', async (c) => {
  const { GOOGLE_CLIENT_ID, SESSION_SECRET } = c.env;
  if (!GOOGLE_CLIENT_ID || !SESSION_SECRET) return c.json({ error: 'auth_not_configured' }, 503);
  const origin = new URL(c.req.url).origin;
  const state = b64u(crypto.getRandomValues(new Uint8Array(18)));
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${origin}/api/auth/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });
  const res = c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, 302);
  res.headers.append('Set-Cookie', `dstate=${state}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  return res;
});

app.get('/auth/callback', async (c) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = c.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SESSION_SECRET) return c.json({ error: 'auth_not_configured' }, 503);
  const url = new URL(c.req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const saved = readCookie(c.req.header('cookie') ?? null, 'dstate');
  if (!code || !state || !saved || state !== saved) return c.redirect('/?login=failed', 302);
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${url.origin}/api/auth/callback`,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) return c.redirect('/?login=failed', 302);
  const tok = (await tokenRes.json()) as { id_token?: string };
  if (!tok.id_token) return c.redirect('/?login=failed', 302);
  // id_token was received directly from Google's token endpoint over TLS in exchange for our code.
  const claims = JSON.parse(new TextDecoder().decode(fromB64u(tok.id_token.split('.')[1]))) as {
    aud?: string; iss?: string; email?: string; email_verified?: boolean; name?: string; picture?: string;
  };
  if (claims.aud !== GOOGLE_CLIENT_ID || !claims.email || claims.email_verified !== true) return c.redirect('/?login=failed', 302);
  const user: SessionUser = {
    email: claims.email.toLowerCase(),
    name: claims.name ?? claims.email,
    picture: claims.picture ?? '',
    exp: Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400,
  };
  const payload = b64u(enc.encode(JSON.stringify(user)));
  const sig = await sign(SESSION_SECRET, payload);
  const res = c.redirect('/', 302);
  res.headers.append('Set-Cookie', `dsess=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`);
  res.headers.append('Set-Cookie', 'dstate=; Path=/api/auth; Max-Age=0');
  return res;
});

app.get('/auth/me', async (c) => {
  const u = await getUser(c.req.raw, c.env);
  c.header('Cache-Control', 'no-store');
  if (!u) return c.json({ user: null });
  return c.json({ user: { email: u.email, name: u.name, picture: u.picture, isAdmin: u.email === ADMIN_EMAIL } });
});

app.post('/auth/logout', (c) => {
  c.header('Set-Cookie', 'dsess=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  return c.json({ ok: true });
});

app.get('/admin/ping', async (c) => {
  const u = await getUser(c.req.raw, c.env);
  c.header('Cache-Control', 'no-store');
  if (!u || u.email !== ADMIN_EMAIL) return c.json({ error: 'forbidden' }, 403);
  return c.json({ ok: true });
});

// Text-to-speech via ElevenLabs when a key is configured; otherwise the client falls back to the browser's German voice.
app.get('/tts', async (c) => {
  const key = c.env.ELEVENLABS_API_KEY;
  if (!key) return c.json({ fallback: true }, 501);
  const text = (c.req.query('text') ?? '').trim();
  if (!text || text.length > 200) return c.json({ error: 'bad_text' }, 400);
  const voice = c.env.ELEVENLABS_VOICE_ID ?? '';
  if (!voice) return c.json({ fallback: true }, 501);
  const cache = caches.default;
  const cacheKey = new Request(new URL(`/api/tts?text=${encodeURIComponent(text)}`, c.req.url).toString());
  const hit = await cache.match(cacheKey);
  if (hit) return hit;
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
  });
  if (!r.ok) return c.json({ fallback: true }, 502);
  const res = new Response(r.body, { headers: { 'content-type': 'audio/mpeg', 'cache-control': 'public, max-age=31536000, immutable' } });
  c.executionCtx.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
});

export const onRequest = handle(app);
