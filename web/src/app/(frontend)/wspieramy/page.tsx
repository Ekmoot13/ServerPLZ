import React from 'react'
import PageHero from '@/components/site/PageHero'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Wspieramy — Polska Liga Żeglarska' }

function Blok({
  nadtytul,
  tytul,
  children,
  link,
}: {
  nadtytul: string
  tytul: string
  children: React.ReactNode
  link?: { label: string; href: string }
}) {
  return (
    <div className="rounded-2xl border-2 border-navy/10 bg-white p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">{nadtytul}</p>
      <h2 className="mt-1 text-2xl font-extrabold uppercase tracking-wide text-navy">{tytul}</h2>
      <div className="mt-4 space-y-3 text-slate-700">{children}</div>
      {link && (
        <a
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-[10px] border-2 border-navy px-5 py-2 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
        >
          {link.label}
        </a>
      )}
    </div>
  )
}

export default function WspieramyPage() {
  return (
    <main className="bg-slate-50">
      <PageHero tytul="Wspieramy" podtytul="Żeglarstwo to dla nas nie tylko rywalizacja — to społeczność, równość szans i odpowiedzialność." />

      <section className="mx-auto max-w-4xl space-y-6 px-4 py-14">
        <Blok nadtytul="Żeglarstwo kobiet" tytul="Wyrównujemy szanse" link={{ label: 'Odwiedź ladiesailing.pl', href: 'https://ladiesailing.pl/' }}>
          <p>
            We wszystkich regatach Polskiej Ligi Żeglarskiej mogą brać udział kobiety i rywalizować na równym poziomie z
            mężczyznami — aż 7 razy w sezonie 2025 na podium regat Ligi stawały sterniczki.
          </p>
          <p>
            Od 2022 roku organizujemy Żeglarskie Mistrzostwa Polski Kobiet — unikalne na skalę kraju regaty, w których biorą
            udział wyłącznie żeglarki. Odbywają się przy sopockim Molo i łączą sport, styl życia i siłę kobiet. Na jednej
            trasie ścigają się medalistki olimpijskie, mistrzynie świata i Europy, członkinie Kadry Narodowej, ale też
            amatorki i początkujące zawodniczki w dedykowanej subkategorii.
          </p>
        </Blok>

        <Blok nadtytul="Młodzi zawodnicy" tytul="Rozwijamy społeczność i aktywizujemy" link={{ label: 'Liga Młodzieżowa', href: '/mlodziezowa-liga-zeglarska' }}>
          <p>
            Regaty PLŻ są dostępne dla zawodników w każdym wieku — najstarszy sternik finału Ekstraklasy 2025 miał 53 lata,
            a najmłodszy zaledwie 16 lat.
          </p>
          <p>
            Od 2025 roku zawodnicy do 25. roku życia rywalizują w Młodzieżowej Polskiej Lidze Żeglarskiej — na nowoczesnych
            jachtach zapewnionych przez organizatora, z oprawą medialną i promocją zawodników. Na najlepszych czeka awans do
            Młodzieżowej Żeglarskiej Ligi Mistrzów.
          </p>
        </Blok>

        <Blok nadtytul="Charytatywnie" tytul="Wielka Orkiestra Świątecznej Pomocy">
          <p>
            Polska Liga Żeglarska od lat aktywnie wspiera WOŚP, budując most między żeglarstwem a działalnością charytatywną.
            Co roku organizujemy aukcje, dzięki którym można wylicytować udział w naszych regatach i przeżyć żeglarską
            przygodę u boku najlepszych — jednocześnie wspierając zbiórkę.
          </p>
        </Blok>

        <Blok nadtytul="Nasze środowisko" tytul="Nie chcemy zapomnieć">
          <p>
            Setki tysięcy zdjęć i terabajty filmów to efekt pracy „Liberów” — Gwidona i Kacpra, ojca i syna, którzy od lat
            dokumentują regaty Polskiej Ligi Żeglarskiej. To oni zatrzymują emocje i budują wspomnienia całej ligowej
            społeczności. Dziś sami mierzą się z trudnym wyzwaniem zdrowotnym w rodzinie — jako środowisko chcemy ich wspierać.
          </p>
        </Blok>
      </section>
    </main>
  )
}
