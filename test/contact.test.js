import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact as rawHandle, verifyTurnstile } from '../contact.js';

// Default: a stub that accepts any token once (tests below override it).
const pass = async () => true;
const handleContact = (req, env, ctx, send, verify = pass) =>
  rawHandle(req, { TURNSTILE_SECRET_KEY: 'secret', ...env }, ctx, send, verify);

function db({ fail = false } = {}) {
  const rows = [];
  return {
    rows,
    prepare() {
      return { bind: (...v) => ({ run: async () => { if (fail) throw new Error('db down'); rows.push(v); } }) };
    }
  };
}
const req = (body, type = 'application/json') =>
  new Request('https://x/api/contact', { method: 'POST', headers: { 'content-type': type }, body });
const good = JSON.stringify({ name: 'Ada', email: 'Ada@Example.com', message: 'Hello', 'cf-turnstile-response': 'tok' });
const mailEnv = { SMTP_USER: 'u', SMTP_PASSWORD: 'p', CONTACT_TO: 'me@x.com' };

test('valid submission stores once and notifies', async () => {
  const env = { CONTACT_DB: db(), ...mailEnv }; const sent = [];
  const res = await handleContact(req(good), env, null, async (e, m) => sent.push(m));
  assert.equal(res.status, 200);
  assert.deepEqual(env.CONTACT_DB.rows, [['Ada', 'ada@example.com', 'Hello']]);
  assert.equal(sent.length, 1);
});
test('no notification without SMTP settings', async () => {
  const env = { CONTACT_DB: db() }; const sent = [];
  assert.equal((await handleContact(req(good), env, null, async () => sent.push(1))).status, 200);
  assert.equal(sent.length, 0);
});
for (const [label, body] of [['malformed JSON', '{oops'], ['null', 'null'], ['array', '[]']]) {
  test(`${label} returns 400`, async () => {
    const env = { CONTACT_DB: db() };
    assert.equal((await handleContact(req(body), env)).status, 400);
    assert.equal(env.CONTACT_DB.rows.length, 0);
  });
}
test('invalid email returns 400', async () => {
  const res = await handleContact(req(JSON.stringify({ name: 'A', email: 'nope', message: 'x' })), { CONTACT_DB: db() });
  assert.equal(res.status, 400);
});
test('overlong message returns 400', async () => {
  const res = await handleContact(req(JSON.stringify({ name: 'A', email: 'a@b.co', message: 'x'.repeat(5001) })), { CONTACT_DB: db() });
  assert.equal(res.status, 400);
});
test('oversized body returns 413', async () => {
  const res = await handleContact(req(JSON.stringify({ message: 'x'.repeat(30000) })), { CONTACT_DB: db() });
  assert.equal(res.status, 413);
});
test('wrong content type returns 415', async () => {
  assert.equal((await handleContact(req(good, 'text/plain'), { CONTACT_DB: db() })).status, 415);
});
test('storage failure returns controlled 500 and does not notify', async () => {
  const sent = [];
  const res = await handleContact(req(good), { CONTACT_DB: db({ fail: true }), ...mailEnv }, null, async () => sent.push(1));
  assert.equal(res.status, 500);
  assert.match((await res.json()).error, /email me/);
  assert.equal(sent.length, 0);
});
test('honeypot is accepted silently and not stored', async () => {
  const env = { CONTACT_DB: db() };
  const res = await handleContact(req(JSON.stringify({ name: 'A', email: 'a@b.co', message: 'x', website: 'spam' })), env);
  assert.equal(res.status, 200);
  assert.equal(env.CONTACT_DB.rows.length, 0);
});

test('missing Turnstile token returns 400 and stores nothing', async () => {
  const env = { CONTACT_DB: db() };
  const res = await handleContact(req(JSON.stringify({ name: 'A', email: 'a@b.co', message: 'x' })), env);
  assert.equal(res.status, 400);
  assert.equal(env.CONTACT_DB.rows.length, 0);
});
test('rejected token returns 403 and stores nothing', async () => {
  const env = { CONTACT_DB: db() };
  const res = await handleContact(req(good), env, null, null, async () => false);
  assert.equal(res.status, 403);
  assert.equal(env.CONTACT_DB.rows.length, 0);
});
test('replayed token is rejected the second time', async () => {
  const used = new Set();
  const once = async (_env, token) => (used.has(token) ? false : (used.add(token), true));
  const env = { CONTACT_DB: db() };
  assert.equal((await handleContact(req(good), env, null, null, once)).status, 200);
  assert.equal((await handleContact(req(good), env, null, null, once)).status, 403);
  assert.equal(env.CONTACT_DB.rows.length, 1);
});
test('missing secret fails closed with 503', async () => {
  const res = await rawHandle(req(good), { CONTACT_DB: db() }, null, null, pass);
  assert.equal(res.status, 503);
});
test('verifyTurnstile sends secret, token and IP, and reads success', async () => {
  let sent;
  const fakeFetch = async (url, init) => { sent = { url, body: init.body }; return { json: async () => ({ success: true }) }; };
  assert.equal(await verifyTurnstile({ TURNSTILE_SECRET_KEY: 's' }, 't', '1.2.3.4', fakeFetch), true);
  assert.equal(sent.url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  assert.equal(sent.body.get('secret'), 's');
  assert.equal(sent.body.get('response'), 't');
  assert.equal(sent.body.get('remoteip'), '1.2.3.4');
});
test('verifyTurnstile treats a network error as a failure', async () => {
  const boom = async () => { throw new Error('down'); };
  assert.equal(await verifyTurnstile({ TURNSTILE_SECRET_KEY: 's' }, 't', '', boom), false);
});
