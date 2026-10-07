const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// On Render, set DB_PATH to a file on a persistent disk (e.g. /var/data/dunn.sqlite)
// so leads and job applications survive redeploys. Without it, the database lives in
// the app folder, which Render wipes on every deploy.
const dbPath = process.env.DB_PATH || path.join(__dirname, 'dunn.sqlite');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
console.log(`[db] Using database at ${dbPath}`);

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
