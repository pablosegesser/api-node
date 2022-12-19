const nodemailer = require('nodemailer');
const config = require('config.json');
const emailFrom = process.env.EMAIL_FROM;
const smtpOptions = {
    "host": process.env.HOST,
    "port": 587,
    "auth": {
        "user": process.env.SMTP_USER,
        "pass":  process.env.SMTP_PASS
    }
}

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = emailFrom }) {
    const transporter = nodemailer.createTransport(smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}