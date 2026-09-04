import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

// Zawartość strony głównej — w pełni edytowalna przez redaktora.
// Sekcje: aktualności → następne regaty → wprowadzenie (z pop-upami) → sponsorzy.
export const StronaGlowna: GlobalConfig = {
  slug: 'strona-glowna',
  label: 'Strona główna',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    // ============ SEKCJA AKTUALNOŚCI ============
    {
      name: 'aktualnosci',
      type: 'group',
      label: 'Sekcja: Aktualności',
      fields: [
        {
          name: 'tryb',
          type: 'select',
          label: 'Sposób wyświetlania',
          defaultValue: 'rotacja',
          options: [
            { label: 'Rotacja (przejście z jednego do drugiego)', value: 'rotacja' },
            { label: 'Pojedyncze wyświetlenie', value: 'pojedynczy' },
          ],
        },
        {
          name: 'pojedynczyElement',
          type: 'select',
          label: 'Element pokazywany w trybie pojedynczym',
          defaultValue: 'baner',
          options: [
            { label: 'Baner „Śledź regaty”', value: 'baner' },
            { label: 'Najnowszy post Facebook', value: 'facebook' },
            { label: 'Najnowszy post Instagram', value: 'instagram' },
          ],
        },
        { name: 'pokazFacebook', type: 'checkbox', label: 'Pokaż najnowszy post z Facebooka', defaultValue: true },
        { name: 'pokazInstagram', type: 'checkbox', label: 'Pokaż najnowszy post z Instagrama', defaultValue: true },
        { name: 'pokazBaner', type: 'checkbox', label: 'Pokaż baner „Śledź regaty”', defaultValue: true },
        {
          name: 'fbPageId',
          type: 'text',
          label: 'Facebook — ID strony',
          admin: { description: 'Numeryczne ID strony FB (Graph API).' },
        },
        { name: 'fbToken', type: 'text', label: 'Facebook — token dostępu (long-lived Page token)' },
        { name: 'igUserId', type: 'text', label: 'Instagram — ID konta (IG Business/Creator)' },
        { name: 'igToken', type: 'text', label: 'Instagram — token dostępu' },
        { name: 'banerTytul', type: 'text', label: 'Baner — tytuł', defaultValue: 'Śledź regaty na żywo' },
        { name: 'banerTekst', type: 'textarea', label: 'Baner — tekst' },
        { name: 'banerLink', type: 'text', label: 'Baner — link', defaultValue: '/regatowastrefakibica' },
        { name: 'banerObraz', type: 'text', label: 'Baner — URL obrazu tła (opcjonalnie)' },
      ],
    },

    // ============ SEKCJA NASTĘPNE REGATY ============
    {
      name: 'nastepneRegaty',
      type: 'group',
      label: 'Sekcja: Następne regaty',
      fields: [
        { name: 'pokaz', type: 'checkbox', label: 'Pokaż sekcję', defaultValue: true },
        { name: 'tytul', type: 'text', label: 'Nagłówek', defaultValue: 'Regaty' },
      ],
    },

    // ============ SEKCJA WPROWADZENIA ============
    {
      name: 'wprowadzenie',
      type: 'group',
      label: 'Sekcja: Wprowadzenie',
      fields: [
        { name: 'tytul', type: 'text', label: 'Tytuł banera', defaultValue: 'REGATY JAK NA STADIONIE' },
        {
          name: 'tekst',
          type: 'textarea',
          label: 'Tekst banera (akapity oddzielone pustą linią)',
        },
        { name: 'obrazTla', type: 'text', label: 'URL obrazu tła banera (opcjonalnie)' },
        // POP-UP: Jak się ścigamy
        {
          name: 'jakSieScigamyHtml',
          type: 'textarea',
          label: 'Pop-up „Jak się ścigamy?” — treść (HTML)',
        },
        // POP-UP: Jakie są poziomy ligi
        {
          name: 'poziomyObraz',
          type: 'text',
          label: 'Pop-up „Jakie są poziomy ligi?” — URL obrazu',
          defaultValue: '/poziomy-lig.png',
        },
        // POP-UP: Jak śledzić regaty (linki)
        {
          name: 'jakSledzic',
          type: 'array',
          label: 'Pop-up „Jak śledzić regaty?” — linki',
          fields: [
            { name: 'label', type: 'text', label: 'Nazwa' },
            { name: 'url', type: 'text', label: 'Adres URL' },
          ],
        },
        // POP-UP: Media (grupy logotypów)
        {
          name: 'media',
          type: 'array',
          label: 'Pop-up „Jakie media nas pokazują?” — grupy',
          labels: { singular: 'Grupa', plural: 'Grupy' },
          fields: [
            { name: 'kategoria', type: 'text', label: 'Kategoria (np. TELEWIZJA)' },
            {
              name: 'loga',
              type: 'array',
              label: 'Logotypy',
              fields: [
                { name: 'logoUrl', type: 'text', label: 'URL logo' },
                { name: 'link', type: 'text', label: 'Link' },
                { name: 'nazwa', type: 'text', label: 'Nazwa (alt)' },
              ],
            },
          ],
        },
        // POP-UP: Jak się zgłosić
        { name: 'zgloszeniaIntro', type: 'textarea', label: 'Pop-up „Jak się zgłosić?” — wstęp' },
        {
          name: 'zgloszeniaLigi',
          type: 'array',
          label: 'Pop-up „Jak się zgłosić?” — ligi',
          fields: [
            { name: 'nazwa', type: 'text', label: 'Nazwa ligi' },
            { name: 'logoUrl', type: 'text', label: 'URL logo' },
            { name: 'wiecejLink', type: 'text', label: 'Link „Dowiedz się więcej”' },
            { name: 'wyslijLink', type: 'text', label: 'Link „Wyślij zgłoszenie” (np. mailto:)' },
          ],
        },
      ],
    },

    // ============ SEKCJA SPONSORÓW ============
    {
      name: 'sponsorzy',
      type: 'group',
      label: 'Sekcja: Sponsorzy',
      fields: [
        { name: 'tytul', type: 'text', label: 'Nagłówek', defaultValue: 'Sponsorzy i Partnerzy' },
        {
          name: 'grupy',
          type: 'array',
          label: 'Grupy sponsorów',
          labels: { singular: 'Grupa', plural: 'Grupy' },
          fields: [
            { name: 'kategoria', type: 'text', label: 'Kategoria (np. Sponsorzy Główni)' },
            {
              name: 'loga',
              type: 'array',
              label: 'Logotypy',
              fields: [
                { name: 'logoUrl', type: 'text', label: 'URL logo' },
                { name: 'link', type: 'text', label: 'Link' },
                { name: 'nazwa', type: 'text', label: 'Nazwa (alt)' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
