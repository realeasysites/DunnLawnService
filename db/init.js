const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// DB_PATH points at a Render persistent disk mount in production (e.g. /var/data/dunn.sqlite)
// so leads/applications survive redeploys. Falls back to a local file for local dev.
const dbPath = process.env.DB_PATH || path.join(__dirname, 'dunn.sqlite');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    town TEXT,
    service TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new'
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS job_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    position TEXT,
    availability TEXT,
    experience TEXT,
    has_license TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new'
  );
`);

module.exports = db;
