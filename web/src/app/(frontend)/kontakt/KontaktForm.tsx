'use client'
import React, { useActionState } from 'react'
import { sendKontakt, type KontaktStan } from './actions'

const inputCls =
  'w-full rounded-[10px] border-2 border-navy/15 px-4 py-2.5 outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10'

export default function KontaktForm() {
  const [stan, formAction, pending] = useActionState<KontaktStan, FormData>(sendKontakt, {})

  if (stan.ok) {
    return (
      <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-2 text-4xl">✅</div>
        <h3 className="text-lg font-bold text-green-800">Dziękujemy!</h3>
        <p className="mt-1 text-sm text-green-700">Twoja wiadomość została wysłana. Odezwiemy się wkrótce.</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      {stan.error && (
        <div className="rounded-[10px] border-2 border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {stan.error}
        </div>
      )}

      {/* honeypot */}
      <input type="text" name="firma" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-navy">Imię i nazwisko *</label>
          <input name="imie" required className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-navy">E-mail *</label>
          <input type="email" name="email" required className={inputCls} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-navy">Temat</label>
        <input name="temat" className={inputCls} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-navy">Wiadomość *</label>
        <textarea name="tresc" required rows={6} className={inputCls} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-[10px] bg-brand-red px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-red-dark disabled:opacity-60"
      >
        {pending ? 'Wysyłanie…' : 'Wyślij wiadomość'}
      </button>
    </form>
  )
}
