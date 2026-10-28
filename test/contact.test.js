import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact } from '../contact.js';

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
const good = JSON.stringify({ name: 'Ada', email: 'Ada@Example.com', message: 'Hello' });
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
