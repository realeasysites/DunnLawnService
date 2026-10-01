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

async function notifyNewLead(lead) {
  if (!transporter || !process.env.NOTIFY_EMAIL) return;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL,
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
      ].join('\n')
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
      ].join('\n')
    });
  } catch (err) {
    console.error('Failed to send job application notification email:', err.message);
  }
}

module.exports = { notifyNewLead, notifyNewApplication };
