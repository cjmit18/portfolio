import { LogLevel, WorkerMailer } from 'worker-mailer';
import { handleContact, jsonResponse } from './contact.js';

// Emails each new message to CONTACT_TO through the SMTP mailbox (implicit TLS on 465 only).
// The message is already saved in D1, so a mail failure is logged and never shown to the visitor.
async function notify(env, { name, email, message }) {
  try {
    await WorkerMailer.send(
      {
        host: env.SMTP_HOST || 'smtp.purelymail.com',
        port: 465,
        secure: true,
        startTls: false,
        logLevel: LogLevel.NONE,
        credentials: { username: env.SMTP_USER, password: env.SMTP_PASSWORD },
        authType: 'plain',
        socketTimeoutMs: 10000,
        responseTimeoutMs: 10000
      },
      {
        from: { name: 'wayne-mitchell.com', email: env.SMTP_USER },
        to: env.CONTACT_TO,
        reply: email,
        subject: `New message from ${name} via wayne-mitchell.com`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}\n`
      }
    );
  } catch (err) {
    console.error('contact: notification failed', err instanceof Error ? err.name : 'error');
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env, ctx, notify);
    }

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ error: 'Not found.' }, 404);
    }

    return env.ASSETS.fetch(request);
  }
};
