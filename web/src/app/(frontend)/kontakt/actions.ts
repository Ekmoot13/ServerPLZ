'use server'
import { mailerConfigured, getTransport, mailFrom, mailTo } from '@/lib/mailer'

export type KontaktStan = { ok?: boolean; error?: string }

export async function sendKontakt(_prev: KontaktStan, formData: FormData): Promise<KontaktStan> {
  // Honeypot — jeśli wypełnione, to bot.
  if (String(formData.get('firma') || '')) return { ok: true }

  const imie = String(formData.get('imie') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const temat = String(formData.get('temat') || '').trim()
  const tresc = String(formData.get('tresc') || '').trim()

  if (!imie || !email || !tresc) {
    return { error: 'Uzupełnij imię, e-mail i treść wiadomości.' }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: 'Podaj poprawny adres e-mail.' }
  }

  if (!mailerConfigured()) {
    return {
      error:
        'Formularz nie jest jeszcze skonfigurowany (brak SMTP). Napisz bezpośrednio na info@ligazeglarska.pl.',
    }
  }

  try {
    const transport = getTransport()
    await transport.sendMail({
      from: mailFrom(),
      to: mailTo(),
      replyTo: email,
      subject: `[Kontakt WWW] ${temat || 'Wiadomość ze strony'}`,
      text: `Od: ${imie} <${email}>\nTemat: ${temat}\n\n${tresc}`,
    })
    return { ok: true }
  } catch {
    return { error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie później lub napisz na info@ligazeglarska.pl.' }
  }
}
