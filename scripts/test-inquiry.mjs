// Self-check for api/inquiry.js with a stubbed Resend call: node scripts/test-inquiry.mjs
import assert from 'assert';
process.env.RESEND_API_KEY = 'test-key';
const { default: handler } = await import('../api/inquiry.js');

let sent = null;
globalThis.fetch = async (url, opts) => { sent = { url, ...opts, body: JSON.parse(opts.body) }; return { ok: true }; };

const call = async (method, body) => {
  const res = { code: 0, json: null, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; } };
  res.json = function (j) { this.payload = j; return this; };
  await handler({ method, body }, res);
  return res;
};

assert.strictEqual((await call('GET')).code, 405);
assert.strictEqual((await call('POST', { name: 'A', email: 'nope' })).code, 400);

sent = null;
assert.strictEqual((await call('POST', { name: 'Bot', email: 'b@b.co', website: 'spam' })).code, 200);
assert.strictEqual(sent, null, 'honeypot must not send');

const ok = await call('POST', { name: 'Ria <b>', email: 'ria@brand.co', company: 'Brand', budget: 'INR 1L-3L', message: 'line1\nline2' });
assert.strictEqual(ok.code, 200);
assert.deepStrictEqual(sent.body.to, ['studio@inksandinterfaces.design']);
assert.strictEqual(sent.body.reply_to, 'ria@brand.co');
assert(sent.body.html.includes('Ria &lt;b&gt;') && !sent.body.html.includes('<b>'), 'html is escaped');
assert(sent.body.html.includes('line1<br>line2'));

globalThis.fetch = async () => ({ ok: false, status: 422, text: async () => 'bad' });
assert.strictEqual((await call('POST', { name: 'A', email: 'a@b.co' })).code, 502);

console.log('✅ api/inquiry.js checks passed');
