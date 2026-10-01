const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { notifyNewApplication } = require('../lib/mailer');

// Public API: submit a job application
router.post('/', async (req, res) => {
  const { name, phone, email, position, availability, experience, has_license, message, website } = req.body;

  // Honeypot field - real applicants never fill this in
  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: 'Name and phone are required.' });
  }

  const stmt = db.prepare(`
    INSERT INTO job_applications (name, phone, email, position, availability, experience, has_license, message)
    VALUES (@name, @phone, @email, @position, @availability, @experience, @has_license, @message)
  `);

  const info = stmt.run({
    name: String(name).slice(0, 200),
    phone: String(phone).slice(0, 50),
    email: email ? String(email).slice(0, 200) : null,
    position: position ? String(position).slice(0, 100) : null,
    availability: availability ? String(availability).slice(0, 100) : null,
    experience: experience ? String(experience).slice(0, 100) : null,
    has_license: has_license ? String(has_license).slice(0, 20) : null,
    message: message ? String(message).slice(0, 2000) : null
  });

  const application = db.prepare('SELECT * FROM job_applications WHERE id = ?').get(info.lastInsertRowid);
  notifyNewApplication(application);

  res.json({ ok: true });
});

module.exports = router;
