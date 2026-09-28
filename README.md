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
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — the admin dashboard login
   - `NOTIFY_EMAIL` — where new leads get emailed (currently `DunnLawnServiceLLC@yahoo.com`)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` — the email account that sends notifications. **Yahoo requires an "app password"**, not the regular account password — generate one in Yahoo Account Security settings.
4. Node is pinned to 20.x (`.node-version` + `package.json engines`) because `better-sqlite3` needs a prebuilt binary — don't bump Node without checking that first.
5. The SQLite database file lives at `db/dunn.sqlite` and is created automatically on first run. On Render's free tier the disk is ephemeral (wiped on redeploy) — if you want leads to persist long-term, add a Render Disk mounted at `/db` or upgrade to a paid instance with a persistent disk later. Fine to start with for testing.

## Images

All photo slots are filled with real (or client-generated) images — logo, hero striped-lawn, mulch/stone, fall clean-up, shrub trimming, and snow removal. To swap any of them later, just replace the file in `public/images/` under the same filename — no code changes needed.

## Color palette

Red / black / white (set as CSS custom properties at the top of `public/css/style.css`: `--red`, `--black`, plus `--white`). Change the hex values there to retheme the whole site.

## Careers / hiring page

`public/careers.html` is a "Join Our Team" page (linked from the header/footer nav on every page) with a job-application form for people who want to work for Dunn Lawn Service. Submissions POST to `/api/careers` (see `routes/careers.js`), are stored in the `job_applications` table (`db/init.js`), and trigger the same email-notification pattern as quote leads (`lib/mailer.js`). They show up in the admin dashboard under the "Job Applications" tab alongside the existing "Quote Leads" tab (`/admin`).
