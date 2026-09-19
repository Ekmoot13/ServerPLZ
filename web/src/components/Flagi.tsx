import React from 'react'

/**
 * Flagi sygnałowe komisji regatowej.
 *
 * Rysowane wektorowo, żeby były ostre i na przycisku w telefonie, i na banerze
 * przez całą szerokość strony. Kształt ma znaczenie tak samo jak barwy: AP
 * i pierwsza zastępcza to proporce, N to flaga prostokątna, A ma jaskółczy ogon.
 */
export type KodFlagi = 'POM' | 'AP' | 'APA' | 'APH' | 'N' | 'PZ'

export type OpisFlagi = {
  kod: KodFlagi
  /** Nazwa sygnału, tak jak mówi o nim komisja. */
  nazwa: string
  /** Co oznacza dla żeglarzy i kibiców. */
  znaczenie: string
  /**
   * Wydźwięk sygnału. Pomarańczowa mówi „płyniemy", reszta wstrzymuje regaty —
   * baner nie może krzyczeć na czerwono, że wszystko jest w porządku.
   */
  ton: 'ok' | 'wstrzymanie'
}

/** Kolejność jak w panelu: dwie kolumny, trzy rzędy. */
export const FLAGI: OpisFlagi[] = [
  { kod: 'POM', nazwa: 'Pomarańczowa', znaczenie: 'Wyścigi trwają zgodnie z planem', ton: 'ok' },
  { kod: 'AP', nazwa: 'AP', znaczenie: 'Wyścigi odroczone', ton: 'wstrzymanie' },
  { kod: 'APA', nazwa: 'AP nad A', znaczenie: 'Koniec wyścigów w dniu dzisiejszym', ton: 'wstrzymanie' },
  { kod: 'APH', nazwa: 'AP nad H', znaczenie: 'Powrót na ląd — czekamy na brzegu', ton: 'wstrzymanie' },
  { kod: 'N', nazwa: 'N', znaczenie: 'Wyścigi przerwane', ton: 'wstrzymanie' },
  { kod: 'PZ', nazwa: 'Pierwsza zastępcza', znaczenie: 'Falstart generalny', ton: 'wstrzymanie' },
]

export function opisFlagi(kod: string | null | undefined): OpisFlagi | null {
  return FLAGI.find((f) => f.kod === kod) || null
}

const CZERWONY = '#d21034'
const NIEBIESKI = '#0d4ea8'
const ZOLTY = '#ffd400'
const GRANAT = '#000f8c'
const POMARANCZ = '#e2660c'
const OBRYS = 'rgba(0,0,0,0.25)'

/** Proporzec AP — pionowe pasy czerwono-białe, zwężający się ku końcowi. */
function Ap({ y = 0, h = 60 }: { y?: number; h?: number }) {
  const punkty = `0,${y} 100,${y + h * 0.35} 100,${y + h * 0.65} 0,${y + h}`
  const id = `ap-${y}`
  return (
    <>
      <defs>
        <clipPath id={id}>
          <polygon points={punkty} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={i * 20}
            y={y}
            width={20}
            height={h}
            fill={i % 2 === 0 ? CZERWONY : '#fff'}
          />
        ))}
      </g>
      <polygon points={punkty} fill="none" stroke={OBRYS} strokeWidth="1" />
    </>
  )
}

/** Flaga A — jaskółczy ogon, biała przy drzewcu, niebieska od strony wolnej. */
function A({ y = 0, h = 60 }: { y?: number; h?: number }) {
  const ogon = `100,${y} 78,${y + h / 2} 100,${y + h}`
  return (
    <>
      <rect x="0" y={y} width="50" height={h} fill="#fff" />
      <polygon points={`50,${y} 100,${y} 78,${y + h / 2} 100,${y + h} 50,${y + h}`} fill={NIEBIESKI} />
      <polygon points={ogon} fill="none" stroke="none" />
      <polygon
        points={`0,${y} 100,${y} 78,${y + h / 2} 100,${y + h} 0,${y + h}`}
        fill="none"
        stroke={OBRYS}
        strokeWidth="1"
      />
    </>
  )
}

/** Flaga H — pionowo podzielona: biała przy drzewcu, czerwona od strony wolnej. */
function H({ y = 0, h = 60 }: { y?: number; h?: number }) {
  return (
    <>
      <rect x="0" y={y} width="50" height={h} fill="#fff" />
      <rect x="50" y={y} width="50" height={h} fill={CZERWONY} />
      <rect x="0" y={y} width="100" height={h} fill="none" stroke={OBRYS} strokeWidth="1" />
    </>
  )
}

/** Pomarańczowa — jednolita, bez znaków. */
function Pomaranczowa() {
  return (
    <>
      <rect x="0" y="0" width="100" height="60" fill={POMARANCZ} />
      <rect x="0" y="0" width="100" height="60" fill="none" stroke={OBRYS} strokeWidth="1" />
    </>
  )
}

/** Flaga N — szachownica niebiesko-biała 4x4, niebieskie narożniki. */
function N() {
  const pole = 100 / 4
  const wys = 60 / 4
  const kratki = []
  for (let w = 0; w < 4; w++) {
    for (let k = 0; k < 4; k++) {
      kratki.push(
        <rect
          key={`${w}-${k}`}
          x={k * pole}
          y={w * wys}
          width={pole}
          height={wys}
          fill={(w + k) % 2 === 0 ? NIEBIESKI : '#fff'}
        />,
      )
    }
  }
  return (
    <>
      {kratki}
      <rect x="0" y="0" width="100" height="60" fill="none" stroke={OBRYS} strokeWidth="1" />
    </>
  )
}

/**
 * Pierwsza zastępcza — granatowy proporzec z żółtym trójkątem, którego
 * podstawa leży przy drzewcu, a wierzchołek celuje w wolny koniec.
 */
function PierwszaZastepcza() {
  return (
    <>
      <polygon points="0,0 100,30 0,60" fill={GRANAT} />
      <polygon points="0,14 55,30 0,46" fill={ZOLTY} />
      <polygon points="0,0 100,30 0,60" fill="none" stroke={OBRYS} strokeWidth="1" />
    </>
  )
}

export default function Flaga({ kod, className = '' }: { kod: KodFlagi; className?: string }) {
  const opis = opisFlagi(kod)
  const etykieta = opis ? `Flaga ${opis.nazwa} — ${opis.znaczenie}` : 'Flaga sygnałowa'

  // Sygnały złożone — dwie flagi jedna pod drugą, tak jak na maszcie.
  if (kod === 'APA' || kod === 'APH') {
    return (
      <svg viewBox="0 0 100 130" className={className} role="img" aria-label={etykieta}>
        <Ap y={0} h={60} />
        {kod === 'APA' ? <A y={70} h={60} /> : <H y={70} h={60} />}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 100 60" className={className} role="img" aria-label={etykieta}>
      {kod === 'AP' && <Ap />}
      {kod === 'N' && <N />}
      {kod === 'PZ' && <PierwszaZastepcza />}
      {kod === 'POM' && <Pomaranczowa />}
    </svg>
  )
}
