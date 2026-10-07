require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const crypto = require('crypto');

const quoteRoutes = require('./routes/quote');
const careersRoutes = require('./routes/careers');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Render terminates HTTPS at its proxy; trust it so secure cookies work.
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// This repo is public, so a built-in fallback secret would let anyone forge an
// admin session. If SESSION_SECRET isn't set, use a random one per boot
// (the admin just has to log in again after a restart).
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
if (!process.env.SESSION_SECRET) {
  console.warn('[session] SESSION_SECRET not set — using a random secret for this run.');
}

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
      httpOnly: true,
      sameSite: 'lax',
      secure: Boolean(process.env.RENDER) // Render sets RENDER=true; local dev stays on http
    }
  })
);

app.use('/api/quote', quoteRoutes);
app.use('/api/careers', careersRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Dunn Lawn Service site running on port ${PORT}`);
});
