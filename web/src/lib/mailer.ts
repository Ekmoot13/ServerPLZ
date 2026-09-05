import nodemailer from 'nodemailer'

// Transport SMTP budowany z zmiennych środowiskowych.
// Wymagane: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
// Opcjonalne: SMTP_SECURE ('true' dla portu 465), SMTP_FROM, SMTP_TO.
export function mailerConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export function getTransport() {
  const port = Number(process.env.SMTP_PORT || 587)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export function mailFrom(): string {
  return process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@ligowastrefakibica.pl'
}

export function mailTo(): string {
  return process.env.SMTP_TO || 'info@ligazeglarska.pl'
}
