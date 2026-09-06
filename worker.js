function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

async function handleContact(request, env) {
  if (!env.CONTACT_DB) {
    return jsonResponse({ error: 'Contact service is not configured.' }, 503);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return jsonResponse({ error: 'Send the form as JSON.' }, 415);
  }

  const body = await request.json();
  const name = clean(body.name, 100);
  const email = clean(body.email, 254).toLowerCase();
  const message = clean(body.message, 5000);
  const website = clean(body.website, 100);

  if (website) {
    return jsonResponse({ ok: true });
  }

  if (!name || !email || !message || !isEmail(email)) {
    return jsonResponse({ error: 'Enter your name, a valid email address, and a message.' }, 400);
  }

  await env.CONTACT_DB.prepare(
    'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)'
  ).bind(name, email, message).run();

  return jsonResponse({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ error: 'Not found.' }, 404);
    }

    return env.ASSETS.fetch(request);
  }
};
