const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { notifyNewLead } = require('../lib/mailer');

// Public API: submit a quote request
router.post('/', async (req, res) => {
  const { name, phone, email, town, service, message, website } = req.body;

  // Honeypot field - real users never fill this in
  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: 'Name and phone are required.' });
  }

  const stmt = db.prepare(`
    INSERT INTO leads (name, phone, email, town, service, message)
    VALUES (@name, @phone, @email, @town, @service, @message)
  `);

  const info = stmt.run({
    name: String(name).slice(0, 200),
    phone: String(phone).slice(0, 50),
    email: email ? String(email).slice(0, 200) : null,
    town: town ? String(town).slice(0, 100) : null,
    service: service ? String(service).slice(0, 100) : null,
    message: message ? String(message).slice(0, 2000) : null
  });

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(info.lastInsertRowid);
  notifyNewLead(lead);

  res.json({ ok: true });
});

module.exports = router;
