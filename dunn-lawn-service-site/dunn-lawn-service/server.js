require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');

const quoteRoutes = require('./routes/quote');
const careersRoutes = require('./routes/careers');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hours
  })
);

app.use('/api/quote', quoteRoutes);
app.use('/api/careers', careersRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Dunn Lawn Service site running on port ${PORT}`);
});
