// Vercel serverless function: POST /api/inquiry
// Emails the contact form to the studio through Resend (https://resend.com).
// Needs env vars on Vercel:
//   RESEND_API_KEY  – API key from Resend
//   INQUIRY_FROM    – optional sender, must be on a domain verified in Resend
//                     (default: "inks & interfaces <website@inksandinterfaces.design>")
const TO = 'studio@inksandinterfaces.design';
const FROM = process.env.INQUIRY_FROM || 'inks & interfaces <website@inksandinterfaces.design>';

const FIELDS = { name: 'Name', email: 'Email', company: 'Company / project', need: 'What they need', budget: 'Budget', message: 'Project summary' };
const MAX = { name: 120, email: 200, company: 200, need: 60, budget: 40, message: 5000 };

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};

  // honeypot: real people never see this field, bots fill it. Pretend it worked.
  if (body.website) return res.status(200).json({ ok: true });

  const data = {};
  for (const key of Object.keys(FIELDS)) {
    data[key] = String(body[key] ?? '').trim().slice(0, MAX[key]);
  }
  if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return res.status(400).json({ error: 'Name and a valid email are required.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email is not configured.' });
  }

  const rows = Object.entries(FIELDS).filter(([k]) => data[k]);
  const html = `<h2>New project inquiry</h2><table cellpadding="6">${rows
    .map(([k, label]) => `<tr><td valign="top"><strong>${label}</strong></td><td>${esc(data[k]).replace(/\n/g, '<br>')}</td></tr>`)
    .join('')}</table>`;
  const text = rows.map(([k, label]) => `${label}: ${data[k]}`).join('\n\n');

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: data.email,
      subject: `New project inquiry: ${data.name}${data.company ? ` (${data.company})` : ''}`.replace(/[\r\n]+/g, ' '),
      html,
      text,
    }),
  }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));

  if (!r.ok) {
    console.error('Resend failed', r.status, await r.text());
    return res.status(502).json({ error: 'Could not send right now.' });
  }
  return res.status(200).json({ ok: true });
}

function safeJson(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
