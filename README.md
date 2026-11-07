# Dunn Lawn Service Website

Node/Express + SQLite site for Dunn Lawn Service LLC (Spencerport, NY), with a public marketing site and a password-protected admin dashboard for incoming quote-request leads.

## Project structure

```
db/         SQLite connection + schema (db/init.js)
lib/        Shared helpers — auth middleware, email notifications
routes/     Express routers — routes/quote.js (public quote form API),
            routes/admin.js (admin login + dashboard API)
public/     The marketing site itself (static: html/css/js/images)
views/      Server-rendered admin HTML pages (login screen, dashboard)
server.js   Thin entry point — wires up middleware and mounts the routers
```

## Local setup

```bash
npm install
cp .env.example .env   # then edit values in .env
npm start
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin` for the lead dashboard (login with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set in `.env`).

## Deploying (Render, same pattern as past client sites)

1. Push this folder to a new GitHub repo.
2. In Render: New Web Service → connect the repo.
   - Build command: `npm install`
   - Start command: `npm start`
3. Set these Environment Variables in Render (matching `.env.example`):
   - `SESSION_SECRET` — any long random string
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — the admin dashboard login (set your own — don't ship the example defaults)
   - `DB_PATH` — `/var/data/dunn.sqlite` (see persistent disk note below)
   - `NOTIFY_EMAIL` — where new leads get emailed (currently `DunnLawnServiceLLC@yahoo.com` — the business's own inbox)
   - `SITE_URL` — `https://dunnlawnservice.onrender.com` — adds a "View in dashboard" link to each notification email
   - `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER=realeasy365@gmail.com`, `SMTP_PASS` — notifications are sent from the Real Easy Sites Gmail account (same pattern as the other client sites), not from Dunn's own Yahoo address. **Requires a Gmail "app password"** (Google Account → Security → App passwords, needs 2-Step Verification on) — not the regular Gmail login password. Replies to the notification email go straight to the customer, not back to this inbox.
4. Node is pinned to 20.x (`.node-version` + `package.json engines`) because `better-sqlite3` needs a prebuilt binary — don't bump Node without checking that first.
5. **Persistent lead storage**: a 1 GB Render Disk is mounted at `/var/data` on this service. With `DB_PATH=/var/data/dunn.sqlite` set, the SQLite file lives on that disk and survives redeploys — leads and job applications are no longer wiped when the service rebuilds. (A disk attached to a service means deploys briefly take the service offline instead of zero-downtime swapping — expected trade-off for persistent storage on a single instance.) Without `DB_PATH` set, it falls back to `db/dunn.sqlite` inside the repo, which **is** ephemeral — fine for local dev, not for production.

## Images

All photo slots are filled with real (or client-generated) images — logo, hero striped-lawn, mulch/stone, fall clean-up, shrub trimming, and snow removal. To swap any of them later, just replace the file in `public/images/` under the same filename — no code changes needed.

## Color palette

Red / black / white (set as CSS custom properties at the top of `public/css/style.css`: `--red`, `--black`, plus `--white`). Change the hex values there to retheme the whole site.

## Careers / hiring page

`public/careers.html` is a "Join Our Team" page (linked from the header/footer nav on every page) with a job-application form for people who want to work for Dunn Lawn Service. Submissions POST to `/api/careers` (see `routes/careers.js`), are stored in the `job_applications` table (`db/init.js`), and trigger the same email-notification pattern as quote leads (`lib/mailer.js`). They show up in the admin dashboard under the "Job Applications" tab alongside the existing "Quote Leads" tab (`/admin`).
