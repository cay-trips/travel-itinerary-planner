// /api/send-booking-email.js
//
// This runs on Vercel's server, NOT in the browser — so the Brevo API key
// (read from an environment variable below) is never visible to visitors.
// The browser only ever calls this endpoint; it never sees the key itself.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const SENDER_EMAIL = process.env.SENDER_EMAIL || 'caytrips@gmail.com';
  const SENDER_NAME = process.env.SENDER_NAME || 'CAY Trips';

  if (!BREVO_API_KEY) {
    return res.status(500).json({
      error: 'Email service not configured. Set BREVO_API_KEY in Vercel → Project Settings → Environment Variables.'
    });
  }

  const { toEmail, toName, booking } = req.body || {};

  if (!toEmail || !toEmail.includes('@')) {
    return res.status(400).json({ error: 'A valid recipient email is required.' });
  }
  if (!booking || !booking.destination || !booking.travelDate) {
    return res.status(400).json({ error: 'Missing booking details.' });
  }

  const lineItems = Array.isArray(booking.lineItems) ? booking.lineItems : [];
  const invoiceLines = lineItems
    .map(li => `  ${li.label.padEnd(28, '.')} Rs. ${Number(li.amount).toLocaleString('en-IN')}`)
    .join('\n');
  const totalLine = booking.total != null
    ? `  ${'TOTAL'.padEnd(28, '.')} Rs. ${Number(booking.total).toLocaleString('en-IN')}`
    : `  (No fixed price available for this destination — check the travel/stay links below for current rates.)`;

  const textContent =
`Hi ${toName || 'Traveler'},

Your booking request is confirmed! Here is your itinerary and invoice.

TRIP SUMMARY
------------
Destination : ${booking.destination}
Travel date : ${booking.travelDate}
Duration    : ${booking.duration} day(s)
Travelers   : ${booking.travelers}

INVOICE
-------
${invoiceLines || '  (no itemized lines provided)'}
${totalLine}

NEXT STEP — COMPLETE YOUR BOOKING
----------------------------------
This site does not process payments directly. To finalize dates, seats,
rooms, and pay for this trip, continue on the following real sites:

  Travel : ${booking.travelProviderName || 'our travel partner'}
           ${booking.travelProviderUrl || '(link not provided)'}
  Stay   : ${booking.stayProviderName || 'our stay partner'}
           ${booking.stayProviderUrl || '(link not provided)'}

Safe travels!
${SENDER_NAME}
`;

  try {
    const brevoResp = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { email: SENDER_EMAIL, name: SENDER_NAME },
        to: [{ email: toEmail, name: toName || undefined }],
        subject: `Your Itinerary & Invoice — ${booking.destination}`,
        textContent
      })
    });

    if (brevoResp.status === 201) {
      return res.status(200).json({ ok: true });
    }
    const detail = await brevoResp.text();
    return res.status(502).json({ error: 'Email provider rejected the request.', detail });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
