const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { requireAuth } = require('../lib/auth');

const VIEWS_DIR = path.join(__dirname, '..', 'views');

// ---------- Pages ----------
router.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'admin.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'admin-login.html'));
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const okUser = username === (process.env.ADMIN_USERNAME || 'admin');
  const okPass = password === (process.env.ADMIN_PASSWORD || 'admin');
  if (okUser && okPass) {
    req.session.loggedIn = true;
    return res.redirect('/admin');
  }
  return res.redirect('/admin/login?error=1');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// ---------- API ----------
router.get('/api/leads', requireAuth, (req, res) => {
  const leads = db.prepare('SELECT * FROM leads ORDER BY id DESC').all();
  res.json({ ok: true, leads });
});

router.post('/api/leads/:id/status', requireAuth, (req, res) => {
  const { status } = req.body;
  const allowed = ['new', 'contacted', 'scheduled', 'won', 'closed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ ok: false, error: 'Invalid status' });
  }
  db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

router.post('/api/leads/:id/delete', requireAuth, (req, res) => {
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.get('/api/applications', requireAuth, (req, res) => {
  const applications = db.prepare('SELECT * FROM job_applications ORDER BY id DESC').all();
  res.json({ ok: true, applications });
});

router.post('/api/applications/:id/status', requireAuth, (req, res) => {
  const { status } = req.body;
  const allowed = ['new', 'contacted', 'interviewing', 'hired', 'passed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ ok: false, error: 'Invalid status' });
  }
  db.prepare('UPDATE job_applications SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

router.post('/api/applications/:id/delete', requireAuth, (req, res) => {
  db.prepare('DELETE FROM job_applications WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
