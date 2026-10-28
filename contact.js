// Contact form handler: validates the request, saves it to D1, then hands it to `send`
// (the email notifier in worker.js). Kept free of Worker-only imports so Node tests can load it.
const MAX_BODY_BYTES = 20000;
const LIMITS = { name: 100, email: 254, message: 5000, website: 100 };

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export function notificationsEnabled(env) {
  return Boolean(env.SMTP_USER && env.SMTP_PASSWORD && env.CONTACT_TO);
}

async function readJson(request) {
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > MAX_BODY_BYTES) return { error: 413 };
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return { error: 413 };
  try {
    const body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 400 };
    return { body };
  } catch {
    return { error: 400 };
  }
}

export async function handleContact(request, env, ctx, send) {
  if (!env.CONTACT_DB) {
    return jsonResponse({ error: 'Contact service is not configured.' }, 503);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return jsonResponse({ error: 'Send the form as JSON.' }, 415);
  }

  const { body, error } = await readJson(request);
  if (error === 413) {
    return jsonResponse({ error: 'That message is too long.' }, 413);
  }
  if (error) {
    return jsonResponse({ error: 'Enter your name, a valid email address, and a message.' }, 400);
  }

  const website = clean(body.website, LIMITS.website);
  if (website) {
    return jsonResponse({ ok: true });
  }

  const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';
  if (rawMessage.length > LIMITS.message) {
    return jsonResponse({ error: `Keep the message under ${LIMITS.message} characters.` }, 400);
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email).toLowerCase();
  const message = rawMessage;

  if (!name || !email || !message || !isEmail(email)) {
    return jsonResponse({ error: 'Enter your name, a valid email address, and a message.' }, 400);
  }

  try {
    await env.CONTACT_DB.prepare(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)'
    ).bind(name, email, message).run();
  } catch (err) {
    console.error('contact: storage failed', err instanceof Error ? err.message : 'error');
    return jsonResponse({ error: 'The message could not be sent. Please email me directly.' }, 500);
  }

  if (send && notificationsEnabled(env)) {
    const pending = send(env, { name, email, message });
    if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(pending);
    else await pending;
  }

  return jsonResponse({ ok: true });
}
