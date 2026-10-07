const nodemailer = require('nodemailer');

let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Link back to the admin dashboard, appended to every notification email.
// Set SITE_URL to the live site's base URL (e.g. https://dunnlawnservice.onrender.com).
function adminLink() {
  if (!process.env.SITE_URL) return '';
  return `\n\nView in dashboard: ${process.env.SITE_URL.replace(/\/$/, '')}/admin`;
}

async function notifyNewLead(lead) {
  if (!transporter || !process.env.NOTIFY_EMAIL) return;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL,
      // Replying to this email goes straight to the customer, not back to the sending inbox.
      replyTo: lead.email || undefined,
      subject: `New quote request - ${lead.name} (${lead.service || 'General'})`,
      text: [
        `New lead from the website:`,
        ``,
        `Name: ${lead.name}`,
        `Phone: ${lead.phone}`,
        `Email: ${lead.email || '-'}`,
        `Town: ${lead.town || '-'}`,
        `Service: ${lead.service || '-'}`,
        `Message: ${lead.message || '-'}`
      ].join('\n') + adminLink()
    });
  } catch (err) {
    console.error('Failed to send lead notification email:', err.message);
  }
}

async function notifyNewApplication(app) {
  if (!transporter || !process.env.NOTIFY_EMAIL) return;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL,
      replyTo: app.email || undefined,
      subject: `New job application - ${app.name} (${app.position || 'General'})`,
      text: [
        `New job application from the website:`,
        ``,
        `Name: ${app.name}`,
        `Phone: ${app.phone}`,
        `Email: ${app.email || '-'}`,
        `Position: ${app.position || '-'}`,
        `Availability: ${app.availability || '-'}`,
        `Experience: ${app.experience || '-'}`,
        `Valid driver's license: ${app.has_license || '-'}`,
        `Message: ${app.message || '-'}`
      ].join('\n') + adminLink()
    });
  } catch (err) {
    console.error('Failed to send job application notification email:', err.message);
  }
}

module.exports = { notifyNewLead, notifyNewApplication };
