'use client'
import React, { useEffect } from 'react'

// Konfiguracja Sender.net (pobrana z ligazeglarska.pl)
const SENDER_ACCOUNT = '6eb9a0c7c61511'
const SENDER_FORM_ID = 'dR6rqq'

export default function NewsletterSekcja({ bg }: { bg?: string }) {
  useEffect(() => {
    const w = window as any
    if (!w.sender) {
      ;(function (s: any, e: Document, n: string, d: string, er: string) {
        s['Sender'] = er
        s[er] =
          s[er] ||
          function () {
            ;(s[er].q = s[er].q || []).push(arguments)
          }
        s[er].l = 1 * (new Date() as any)
        const a = e.createElement(n) as HTMLScriptElement
        const m = e.getElementsByTagName(n)[0]
        a.async = true
        a.src = d
        m.parentNode!.insertBefore(a, m)
      })(w, document, 'script', 'https://cdn.sender.net/accounts_resources/universal.js', 'sender')
      w.sender(SENDER_ACCOUNT)
    }
  }, [])

  return (
    <section
      className="relative bg-navy"
      style={
        bg
          ? {
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }
          : undefined
      }
    >
      <div className="relative mx-auto flex max-w-[1440px] justify-center px-4 py-10 md:py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-7">
          <div className="sender-form-field" data-sender-form-id={SENDER_FORM_ID} />
        </div>
      </div>
    </section>
  )
}
